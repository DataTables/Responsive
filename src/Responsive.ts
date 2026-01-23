import DataTable, {
	Api,
	ApiColumnMethods,
	ApiRowMethods,
	Context,
	Dom,
	HeaderStructure
} from 'datatables.net';
import * as display from './display';
import {
	Column,
	Config,
	ConfigResponsiveDetails,
	Defaults,
	ResponsiveRenderer,
	ResponsiveRowDetails,
	Settings
} from './interface';
import * as renderers from './render';

// Sanity check
if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('3')) {
	throw 'DataTables Responsive requires DataTables 3 or newer';
}

const dom = DataTable.dom;
const util = DataTable.util;

export default class Responsive {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Statics
	 */
	public static breakpoints = [
		{ name: 'desktop', width: Infinity },
		{ name: 'tablet-l', width: 1024 },
		{ name: 'tablet-p', width: 768 },
		{ name: 'mobile-l', width: 480 },
		{ name: 'mobile-p', width: 320 }
	];

	public static defaults: Defaults = {
		breakpoints: Responsive.breakpoints,
		auto: true,
		details: {
			display: display.childRow,
			renderer: renderers.listHidden(),
			target: 0,
			type: 'inline'
		},
		orthogonal: 'display'
	};

	public static display = {
		childRow: display.childRow,
		childRowImmediate: display.childRowImmediate,
		modal: display.modal
	};

	public static renderer: Record<string, () => ResponsiveRenderer> = {
		listHidden: renderers.listHidden,
		listHiddenNodes: renderers.listHiddenNodes,
		tableAll: renderers.tableAll
	}

	public static version = '3.0.7';

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Properties
	 */
	private c: Config;
	private s: Settings;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	constructor(dt: Context | Api, opts: Config) {
		let details: ConfigResponsiveDetails = { type: 'inline' };

		// details is an object, but for simplicity the user can give it as a
		// string or a boolean
		if (opts && typeof opts.details === 'string') {
			details = { type: opts.details };
		}
		else if (opts && opts.details === false) {
			details = { type: false };
		}

		this.c = util.object.assignDeep(
			{},
			Responsive.defaults,
			DataTable.defaults.responsive,
			opts
		);

		this.s = {
			childNodeStore: {},
			columns: [],
			current: [],
			details: util.is.plainObject(this.c.details)
				? util.object.assign(details, this.c.details)
				: details,
			dt: new DataTable.Api(dt),
			timer: null
		};

		let settings = this.s.dt.settings()[0];

		// Check if responsive has already been initialised on this table
		if (settings._responsive) {
			return;
		}

		settings._responsive = this;
		this._init();
	}

	private _init() {
		var that = this;
		var dt = this.s.dt;
		var oldWindowWidth = dom.w.width();

		// Use DataTables' throttle function to avoid processor thrashing
		dom.w.on(
			'orientationchange.dtr',
			DataTable.util.throttle(function () {
				// iOS has a bug whereby resize can fire when only scrolling
				// See: http://stackoverflow.com/questions/8898412
				var width = dom.w.width();

				if (width !== oldWindowWidth) {
					that._resize();
					oldWindowWidth = width;
				}
			})
		);

		// Handle new rows being dynamically added - needed as responsive
		// updates all rows (shown or not) a responsive change, rather than
		// per draw.
		dt.on('row-created.dtr', function (e, tr, data, idx) {
			if (that.s.current.includes(false)) {
				dom.s(tr)
					.children('td, th')
					.each(function (el, i) {
						var idx = dt.column.index('toData', i);

						if (that.s.current[idx!] === false) {
							dom.s(el)
								.css('display', 'none')
								.classAdd('dtr-hidden');
						}
					});
			}
		});

		// Destroy event handler
		dt.on('destroy.dtr', function () {
			dt.off('.dtr');
			dom.s(dt.table().body()).off('.dtr');
			dom.w.off('resize.dtr orientationchange.dtr');

			dt.cells('.dtr-control').nodes().toDom().classRemove('dtr-control');
			dom.s(dt.table().node()).classRemove('dtr-inline collapsed');

			// Restore the columns that we've hidden
			that.s.current.forEach((val, i) => {
				if (val === false) {
					that._setColumnVis(i, true);
				}
			});
		});

		// Reorder the breakpoints array here in case they have been added out
		// of order
		if (this.c.breakpoints) {
			this.c.breakpoints.sort((a, b) => {
				return a.width < b.width ? 1 : a.width > b.width ? -1 : 0;
			});
		}

		this._classLogic();

		// Details handler
		var details = this.s.details;

		if (details.type !== false) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on('column-visibility.dtr', function () {
				// Use a small debounce to allow multiple columns to be set
				// together
				if (that.s.timer) {
					clearTimeout(that.s.timer);
				}

				that.s.timer = setTimeout(function () {
					that.s.timer = null;

					that._classLogic();
					that._resizeAuto();
					that._resize(true);

					that._redrawChildren();
				}, 100);
			});

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on('draw.dtr', function () {
				that._redrawChildren();
			});

			dom.s(dt.table().node()).classAdd('dtr-' + details.type);
		}

		// DT2+ let's us tell it if we are hiding columns
		dt.on('column-calc.dt', function (e, d) {
			var curr = that.s.current;

			for (var i = 0; i < curr.length; i++) {
				var idx = d.visible.indexOf(i);

				if (curr[i] === false && idx >= 0) {
					d.visible.splice(idx, 1);
				}
			}
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on('preXhr.dtr', function () {
			var rowIds: string[] = [];

			dt.rows().every(function () {
				if (this.child.isShown()) {
					rowIds.push(this.id(true));
				}
			});

			dt.one('draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows(rowIds).every(function () {
					that._detailsDisplay(this, false);
				});
			});
		});

		// First pass when the table is ready
		dt.on('draw.dtr', function () {
			// For server-side tables, each draw needs the child node
			// cache to be cleared since it is no longer relevant. We can
			// create a new object for speed in this case - no mutation.
			if (dt.page.info().serverSide) {
				that.s.childNodeStore = {};
			}

			that._controlClass();
		}).ready(function () {
			that._resizeAuto();
			that._resize();

			// Change in column sizes means we need to calc
			dt.on('column-sizing.dtr', function () {
				that._resizeAuto();
				that._resize();
			});
		});

		// Attach listeners after first pass
		dt.on('column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize(true);
		});
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get and store nodes from a cell - use for node moving renderers
	 *
	 * @param dt DT instance
	 * @param row Row index
	 * @param col Column index
	 */
	public childNodes(dt: Api, row: number, col: number) {
		var name = row + '-' + col;

		if (this.s.childNodeStore[name]) {
			return this.s.childNodeStore[name];
		}

		// https://jsperf.com/childnodes-array-slice-vs-loop
		var nodes = [];
		var children = dt.cell(row, col).node().childNodes;
		for (var i = 0, iLen = children.length; i < iLen; i++) {
			nodes.push(children[i]);
		}

		this.s.childNodeStore[name] = nodes;

		return nodes;
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Insert a `col` tag into the correct location in a `colgroup`.
	 *
	 * @param colGroup The `colgroup` tag
	 * @param colEl Array of `col` tags
	 * @param idx Column index
	 */
	private _colGroupAttach(colGroup: Dom, colEls: Dom[], idx: number) {
		var found = null;

		// No need to do anything if already attached
		if (colEls[idx].get(0).parentNode === colGroup.get(0)) {
			return;
		}

		// Find the first `col` after our own which is already attached
		for (var i = idx + 1; i < colEls.length; i++) {
			if (colGroup.get(0) === colEls[i].get(0).parentNode) {
				found = i;
				break;
			}
		}

		if (found !== null) {
			// Insert before
			colEls[idx].insertBefore(colEls[found].get(0));
		}
		else {
			// If wasn't found, insert at the end
			colGroup.append(colEls[idx]);
		}
	}

	/**
	 * Restore nodes from the cache to a table cell
	 *
	 * @param dt DT instance
	 * @param row Row index
	 * @param col Column index
	 */
	private _childNodesRestore(dt: Api, row: number, col: number) {
		var name = row + '-' + col;

		if (!this.s.childNodeStore[name]) {
			return;
		}

		var node = dt.cell(row, col).node();
		var store = this.s.childNodeStore[name];

		if (store.length > 0) {
			var parent = store[0].parentNode;
			var parentChildren = parent!.childNodes;
			var a = [];

			for (var i = 0, iLen = parentChildren.length; i < iLen; i++) {
				a.push(parentChildren[i]);
			}

			for (var j = 0, jen = a.length; j < jen; j++) {
				node.appendChild(a[j]);
			}
		}

		delete this.s.childNodeStore[name];
	}

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown and
	 * hidden.
	 *
	 * @param  breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 */
	private _columnsVisibility(breakpoint: string) {
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, iLen;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map(function (col, idx) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			})
			.sort(function (a, b) {
				if (a.priority !== b.priority) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			});

		// Class logic - determine which columns are in this breakpoint based on
		// the classes. If no class control (i.e. `auto`) then `-` is used to
		// indicate this to the rest of the function
		var display = columns.map((col, i) => {
			if (dt.column(i).visible() === false) {
				return 'not-visible';
			}

			return col.auto && col.minWidth === null
				? false
				: col.auto === true
				? '-'
				: col.includeIn.includes(breakpoint);
		});

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for (i = 0, iLen = display.length; i < iLen; i++) {
			if (display[i] === true) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].scroll;
		var bar = scrolling.y || scrolling.x ? scrolling.barWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for (i = 0, iLen = display.length; i < iLen; i++) {
			if (columns[i].control) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for (i = 0, iLen = order.length; i < iLen; i++) {
			var colIdx = order[i].columnIdx;

			if (
				display[colIdx] === '-' &&
				!columns[colIdx].control &&
				columns[colIdx].minWidth
			) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if (empty || usedWidth - columns[colIdx].minWidth < 0) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first, before the action in the second can be taken
		var showControl = false;

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (
				!columns[i].control &&
				!columns[i].never &&
				display[i] === false
			) {
				showControl = true;
				break;
			}
		}

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (columns[i].control) {
				display[i] = showControl;
			}

			// Replace not visible string with false from the control column
			// detection above
			if (display[i] === 'not-visible') {
				display[i] = false;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if (!display.includes(true)) {
			display[0] = true;
		}

		// Everything will have been transformed to boolean by this point
		return display as boolean[];
	}

	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 */
	private _classLogic() {
		var that = this;
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns: Column[] = [];

		dt.columns().every(function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = column.init().responsivePriority;
			var dataPriority = column.header().getAttribute('data-priority');

			if (priority === undefined) {
				priority =
					dataPriority === undefined || dataPriority === null
						? 10000
						: parseInt(dataPriority) * 1;
			}

			columns.push({
				className: className,
				includeIn: [],
				auto: false,
				control: false,
				never: className.match(/\b(dtr\-)?never\b/) ? true : false,
				priority: priority,
				minWidth: 0
			});
		});

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function (colIdx: number, name: string) {
			var includeIn = columns[colIdx].includeIn;

			if (!includeIn.includes(name)) {
				includeIn.push(name);
			}
		};

		var column = function (
			colIdx: number,
			name: string,
			operator?: string,
			matched?: string
		) {
			var size, i, iLen;
			let breakpoint = that._find(name);

			if (!breakpoints) {
				return;
			}

			if (!operator) {
				columns[colIdx].includeIn.push(name);
			}
			else if (operator === 'max-') {
				// Add this breakpoint and all smaller
				if (breakpoint) {
					size = breakpoint.width;

					for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
						if (breakpoints[i].width <= size) {
							add(colIdx, breakpoints[i].name);
						}
					}
				}
			}
			else if (operator === 'min-') {
				// Add this breakpoint and all larger
				if (breakpoint) {
					size = breakpoint.width;

					for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
						if (breakpoints[i].width >= size) {
							add(colIdx, breakpoints[i].name);
						}
					}
				}
			}
			else if (operator === 'not-') {
				// Add all but this breakpoint
				for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
					if (
						matched &&
						breakpoints[i].name.indexOf(matched) === -1
					) {
						add(colIdx, breakpoints[i].name);
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.forEach(function (col, i) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if
			// needed
			for (var k = 0, ken = classNames.length; k < ken; k++) {
				var className = classNames[k].trim();

				if (className === 'all' || className === 'dtr-all') {
					// Include in all
					hasClass = true;
					col.includeIn = breakpoints!.map(a => a.name);
					return;
				}
				else if (
					className === 'none' ||
					className === 'dtr-none' ||
					col.never
				) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if (
					className === 'control' ||
					className === 'dtr-control'
				) {
					// Special column that is only visible, when one of the
					// other columns is hidden. This is used for the details
					// control
					hasClass = true;
					col.control = true;
					return;
				}

				breakpoints?.forEach(breakpoint => {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp(
						'(min\\-|max\\-|not\\-)?(' +
							brokenPoint[0] +
							')(\\-[_a-zA-Z0-9])?'
					);
					var match = className.match(re);

					if (match) {
						hasClass = true;

						if (
							match[2] === brokenPoint[0] &&
							match[3] === '-' + brokenPoint[1]
						) {
							// Class name matches breakpoint name fully
							column(
								i,
								breakpoint.name,
								match[1],
								match[2] + match[3]
							);
						}
						else if (match[2] === brokenPoint[0] && !match[3]) {
							// Class name matched primary breakpoint name with
							// no qualifier
							column(i, breakpoint.name, match[1], match[2]);
						}
					}
				});
			}

			// If there was no control class, then automatic sizing is used
			if (!hasClass) {
				col.auto = true;
			}
		});

		this.s.columns = columns;
	}

	/**
	 * Update the cells to show the correct control class / button
	 */
	private _controlClass() {
		if (this.s.details.type === 'inline') {
			var dt = this.s.dt;
			var columnsVis = this.s.current;
			var firstVisible = columnsVis.indexOf(true);

			// Remove from any cells which shouldn't have it
			dt.cells(
				null,
				function (idx) {
					return idx !== firstVisible;
				},
				{ page: 'current' }
			)
				.nodes()
				.toDom()
				.filter('.dtr-control')
				.classRemove('dtr-control');

			if (firstVisible >= 0) {
				dt.cells(null, firstVisible, { page: 'current' })
					.nodes()
					.toDom()
					.classAdd('dtr-control');
			}
		}

		this._tabIndexes();
	}

	/**
	 * Show the details for the child row
	 *
	 * @param  row    API instance for the row
	 * @param  update Update flag
	 */
	private _detailsDisplay(row: ApiRowMethods, update: boolean) {
		var that = this;
		var dt = this.s.dt;
		var details = this.s.details;
		var event = function (res: boolean) {
			dom.s(row.node()).classToggle('dtr-expanded', res !== false);
			dom.s(dt.table().node()).trigger('responsive-display.dt', false, [
				dt,
				row,
				res,
				update
			]);
		};

		if (details && details.type !== false) {
			var renderer =
				typeof details.renderer === 'string'
					? Responsive.renderer[details.renderer]()
					: details.renderer;

			var res = details.display!(
				row,
				update,
				function () {
					return renderer
						? renderer.call(
								that,
								dt,
								row[0][0],
								that._detailsObj(row[0])
						  )
						: false;
				},
				function () {
					event(false);
				}
			);

			if (typeof res === 'boolean') {
				event(res);
			}
		}
	}

	/**
	 * Initialisation for the details handler
	 */
	private _detailsInit() {
		var that = this;
		var dt = this.s.dt;
		var details = this.s.details;

		// The inline type always uses the first child as the target
		if (details.type === 'inline') {
			details.target = 'td.dtr-control, th.dtr-control';
		}

		dom.s(dt.table().body()).on(
			'keyup.dtr',
			'td, th',
			function (e: KeyboardEvent) {
				if (document.activeElement) {
					let activeNodeName =
						document.activeElement.nodeName.toLowerCase();

					if (
						e.keyCode === 13 &&
						dom.s(this).data('dtr-keyboard') &&
						(activeNodeName === 'td' || activeNodeName === 'th')
					) {
						dom.s(this).trigger('click');
					}
				}
			}
		);

		// type.target can be a string jQuery selector or a column index
		var target = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		if (target !== undefined || target !== null) {
			// Click handler to show / hide the details rows when they are
			// available
			dom.s(dt.table().body()).on(
				'click.dtr mousedown.dtr mouseup.dtr',
				selector,
				function (e) {
					// If the table is not collapsed (i.e. there is no hidden
					// columns) then take no action
					if (!dom.s(dt.table().node()).classHas('collapsed')) {
						return;
					}

					// Check that the row is actually a DataTable's controlled
					// node
					if (
						!dt
							.rows()
							.nodes()
							.toArray()
							.includes(dom.s(this).closest('tr').get(0))
					) {
						return;
					}

					// For column index, we determine if we should act or not in
					// the handler - otherwise it is already okay
					if (typeof target === 'number') {
						var targetIdx =
							target < 0
								? dt.columns().eq(0).length + target
								: target;

						if (dt.cell(this).index().column !== targetIdx) {
							return;
						}
					}

					// $().closest() includes itself in its check
					var row = dt.row(dom.s(this).closest('tr'));

					// Check event type to do an action
					if (e.type === 'click') {
						// The renderer is given as a function so the caller can
						// execute it only when they need (i.e. if hiding there
						// is no point is running the renderer)
						that._detailsDisplay(row, false);
					}
					else if (e.type === 'mousedown') {
						// For mouse users, prevent the focus ring from showing
						dom.s(this).css('outline', 'none');
					}
					else if (e.type === 'mouseup') {
						// And then re-allow at the end of the click
						dom.s(this).css('outline', '').trigger('blur');
					}
				}
			);
		}
	}

	/**
	 * Get the details to pass to a renderer for a row
	 * @param rowIdx Row index
	 */
	private _detailsObj(rowIdx: number): ResponsiveRowDetails[] {
		var that = this;
		var dt = this.s.dt;
		var columnApis: ApiColumnMethods[] = [];
		let settings = dt.settings()[0];

		return this.s.columns
			.filter(function (col) {
				// Never and control columns should not be passed to the
				// renderer
				return col.never || col.control ? false : true;
			})
			.map(function (col, i) {
				var dtCol = settings.columns[i];

				if (!columnApis[i]) {
					columnApis[i] = dt.column(i);
				}

				return {
					className: dtCol.className,
					columnIndex: i,
					data: settings.fastData(rowIdx, i, that.c.orthogonal!),
					hidden: columnApis[i].visible() && !that.s.current[i],
					rowIndex: rowIdx,
					title: columnApis[i].title()
				};
			});
	}

	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  name Breakpoint name to find
	 * @return Breakpoint description object
	 */
	private _find(name: string) {
		var breakpoints = this.c.breakpoints;

		if (breakpoints) {
			for (var i = 0, len = breakpoints.length; i < len; i++) {
				if (breakpoints[i].name === name) {
					return breakpoints[i];
				}
			}
		}
	}

	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 */
	private _redrawChildren() {
		var that = this;
		var dt = this.s.dt;

		dt.rows({ page: 'current' }).iterator('row', function (settings, idx) {
			that._detailsDisplay(dt.row(idx), true);
		});
	}

	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @param forceRedraw Force a redraw
	 */
	private _resize(forceRedraw = false) {
		var that = this;
		var dt = this.s.dt;
		var width = dom.w.width();
		var breakpoints = this.c.breakpoints!;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, iLen;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for (i = breakpoints.length - 1; i >= 0; i--) {
			if (width <= breakpoints[i].width) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}

		// Show the columns for that break point
		var columnsVis = this._columnsVisibility(breakpoint);
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (
				columnsVis[i] === false &&
				!columns[i].never &&
				!columns[i].control &&
				!dt.column(i).visible() === false
			) {
				collapsedClass = true;
				break;
			}
		}

		dom.s(dt.table().node()).classToggle('collapsed', collapsedClass);

		var changed = false;
		var visible = 0;
		var dtSettings = dt.settings()[0];
		var colGroup = dom.s(dt.table().node()).children('colgroup');
		var colEls = dtSettings.columns.map(function (col) {
			return col.colEl;
		});

		dt.columns()
			.eq(0)
			.each(function (colIdx, i) {
				// Do nothing on DataTables' hidden column - DT removes it from
				// the table so we need to slide back
				if (!dt.column(colIdx).visible()) {
					return;
				}

				if (columnsVis[i] === true) {
					visible++;
				}

				if (forceRedraw || columnsVis[i] !== oldVis[i]) {
					changed = true;
					that._setColumnVis(colIdx, columnsVis[i]);
				}

				// DataTables 2 uses `col` to define the width for a column
				// and this needs to run each time, as DataTables will change
				// the column width. We may need to reattach if we've removed
				// an element previously.
				if (!columnsVis[i]) {
					colEls[i].detach();
				}
				else {
					that._colGroupAttach(colGroup, colEls, i);
				}
			});

		if (changed) {
			dt.columns.adjust();

			this._redrawChildren();

			// Inform listeners of the change
			dom.s(dt.table().node()).trigger('responsive-resize.dt', false, [
				dt,
				this._responsiveOnlyHidden()
			]);

			// If no records, update the "No records" display element
			if (dt.page.info().recordsDisplay === 0) {
				dom.s(dt.table().body())
					.find('td')
					.eq(0)
					.attr('colspan', visible);
			}
		}

		that._controlClass();
	}

	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 */
	private _resizeAuto() {
		var dt = this.s.dt;
		var columns = this.s.columns;
		var that = this;
		var visibleColumns = dt
			.columns()
			.indexes()
			.filter(function (idx) {
				return dt.column(idx).visible();
			});

		// Are we allowed to do auto sizing?
		if (!this.c.auto) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if (!columns.map(c => c.auto).includes(true)) {
			return;
		}

		// Clone the table with the current data in it
		var clonedTable = dt.table().node().cloneNode(false) as HTMLElement;
		var clonedHeader = dom
			.s(dt.table().header().cloneNode(false))
			.appendTo(clonedTable);
		var clonedFooter = dom
			.s(dt.table().footer().cloneNode(false))
			.appendTo(clonedTable);
		var clonedBody = dom
			.s(dt.table().body())
			.clone(true)
			.empty()
			.appendTo(clonedTable);

		clonedTable.style.width = 'auto';

		// Header
		dt.table()
			.header.structure(visibleColumns)
			.forEach(row => {
				var cells = row
					.filter(function (el) {
						return el ? true : false;
					})
					.map(function (el) {
						return dom
							.s(el.cell)
							.clone(true)
							.css('display', 'table-cell')
							.css('width', 'auto')
							.css('min-width', '0')
							.get(0);
					});

				dom.c('tr').append(cells).appendTo(clonedHeader);
			});

		// Always need an empty row that we can read widths from
		var emptyRow = dom.c('tr').appendTo(clonedBody);

		for (var i = 0; i < visibleColumns.count(); i++) {
			emptyRow.append(dom.c('td'));
		}

		// Body rows
		let renderer = this.s.details.renderer;

		if (typeof renderer === 'function' && renderer._responsiveMovesNodes) {
			// Slow but it allows for moving elements around the document
			dt.rows({ page: 'current' }).every(function (rowIdx) {
				var node = this.node();

				if (!node) {
					return;
				}

				// We clone the table's rows and cells to create the sizing
				// table
				var tr = node.cloneNode(false);

				dt.cells(rowIdx, visibleColumns).every(function (
					rowIdx2,
					colIdx
				) {
					// If nodes have been moved out (listHiddenNodes), we need
					// to clone from the store
					var store = that.s.childNodeStore[rowIdx + '-' + colIdx];

					if (store) {
						dom.s(this.node().cloneNode(false))
							.append(dom.s(store).clone(true))
							.appendTo(tr);
					}
					else {
						dom.s(this.node()).clone(true).appendTo(tr);
					}
				});

				clonedBody.append(tr);
			});
		}
		else {
			// This is much faster, but it doesn't account for moving nodes
			// around
			clonedBody
				.append(
					dt.rows({ page: 'current' }).nodes().toDom().clone(true)
				)
				.find('th, td')
				.css('display', '');
		}

		// Any cells which were hidden by Responsive in the host table, need to
		// be visible here for the calculations
		clonedBody.find('th, td').css('display', '');

		// Footer
		dt.table()
			.footer.structure(visibleColumns)
			.forEach(row => {
				var cells = row
					.filter(function (el) {
						return el ? true : false;
					})
					.map(function (el) {
						return dom
							.s(el.cell)
							.clone(false)
							.css('display', 'table-cell')
							.css('width', 'auto')
							.css('min-width', '0')
							.get(0);
					});

				dom.c('tr').append(cells).appendTo(clonedFooter);
			});

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if (this.s.details.type === 'inline') {
			dom.s(clonedTable).classAdd('dtr-inline collapsed');
		}

		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the checked state of the original radio.
		dom.s(clonedTable).find('[name]').removeAttr('name');

		// A position absolute table would take the table out of the flow of
		// our container element, bypassing the height and width (Scroller)
		dom.s(clonedTable).css('position', 'relative');

		var inserted = dom
			.c('div')
			.css({
				width: '1px',
				height: '1px',
				overflow: 'hidden',
				clear: 'both'
			})
			.append(clonedTable);

		inserted.insertBefore(dt.table().node());

		// The cloned table now contains the smallest that each column can be
		emptyRow.children().each(function (el, i) {
			var idx = dt.column.index('fromVisible', i);

			if (idx !== null) {
				columns[idx].minWidth = el.offsetWidth || 0;
			}
		});

		inserted.remove();
	}

	/**
	 * Get the state of the current hidden columns - controlled by Responsive
	 * only
	 */
	private _responsiveOnlyHidden() {
		var dt = this.s.dt;

		return this.s.current.map(function (v, i) {
			// If the column is hidden by DataTables then it can't be hidden by
			// Responsive!
			if (dt.column(i).visible() === false) {
				return true;
			}

			return v;
		});
	}

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param col      Column index
	 * @param showHide Show or hide (true or false)
	 */
	private _setColumnVis(col: number, showHide: boolean) {
		var that = this;
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		this._setHeaderVis(col, showHide, dt.table().header.structure());
		this._setHeaderVis(col, showHide, dt.table().footer.structure());

		dt.column(col)
			.nodes()
			.toDom()
			.css('display', display)
			.classToggle('dtr-hidden', !showHide);

		// We need to set a variable that DT can use when selecting visible
		// columns without needing to query the DOM
		dt.settings()[0].columns[col].responsiveVisible = showHide;

		// If the are child nodes stored, we might need to reinsert them
		if (Object.keys(this.s.childNodeStore).length !== 0) {
			dt.cells(null, col)
				.indexes()
				.each(function (idx) {
					that._childNodesRestore(dt, idx.row, idx.column);
				});
		}
	}

	/**
	 * Set a column's visibility, taking into account multiple rows
	 * in a header / footer and colspan attributes
	 * @param col
	 * @param showHide
	 * @param structure
	 */
	private _setHeaderVis(
		col: number,
		showHide: boolean,
		structure: HeaderStructure[][]
	) {
		var that = this;
		var display = showHide ? '' : 'none';

		// We use the `null`s in the structure array to indicate that a cell
		// should expand over that one if there is a colspan, but it might
		// also have been filled by a rowspan, so we need to expand the
		// rowspan cells down through the structure
		structure.forEach(function (row, rowIdx) {
			for (var col = 0; col < row.length; col++) {
				if (row[col] && row[col].rowspan > 1) {
					var span = row[col].rowspan;

					for (var i = 1; i < span; i++) {
						(structure[rowIdx + i][col] as any) = {};
					}
				}
			}
		});

		structure.forEach(function (row) {
			if (row[col] && row[col].cell) {
				dom.s(row[col].cell)
					.css('display', display)
					.classToggle('dtr-hidden', !showHide);
			}
			else {
				// In a colspan - need to rewind calc the new span since
				// display:none elements do not count as being spanned over
				var search = col;

				while (search >= 0) {
					if (row[search] && row[search].cell) {
						dom.s(row[search].cell).attr(
							'colSpan',
							that._colspan(row, search)
						);
						break;
					}

					search--;
				}
			}
		});
	}

	/**
	 * How many columns should this cell span
	 *
	 * @param row Header structure row
	 * @param idx The column index of the cell to span
	 */
	private _colspan(row: HeaderStructure[], idx: number) {
		var colspan = 1;

		for (var col = idx + 1; col < row.length; col++) {
			if (row[col] === null && this.s.current[col]) {
				// colspan and not hidden by Responsive
				colspan++;
			}
			else if (row[col]) {
				// Got the next cell, jump out
				break;
			}
		}

		return colspan;
	}

	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 */
	private _tabIndexes() {
		var dt = this.s.dt;
		var cells = dt.cells({ page: 'current' }).nodes().toDom();
		var ctx = dt.settings()[0];
		var target = this.s.details.target;

		cells.filter('[data-dtr-keyboard]').removeAttr('data-dtr-keyboard');

		if (typeof target === 'number') {
			dt.cells(null, target, { page: 'current' })
				.nodes()
				.toDom()
				.attr('tabIndex', ctx.tabIndex)
				.data('dtr-keyboard', 1);
		}
		else if (target) {
			// This is a bit of a hack - we need to limit the selected nodes to
			// just those of this table
			if (target === 'td:first-child, th:first-child') {
				target = '>td:first-child, >th:first-child';
			}

			var rows = dt.rows({ page: 'current' }).nodes().toDom();
			var nodes = target === 'tr' ? rows : rows.find(target);

			nodes.attr('tabIndex', ctx.tabIndex).data('dtr-keyboard', 1);
		}
	}
}
