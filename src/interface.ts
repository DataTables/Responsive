import DataTables, { Api, ApiRowMethods } from 'datatables.net';
import Responsive from './Responsive';

export default DataTables;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Options {
		/**
		 * Responsive extension options
		 */
		responsive?: boolean | Config;
	}

	interface Defaults {
		/**
		 * Responsive extension defaults
		 */
		responsive?: Config;
	}

	interface Context {
		_responsive: Responsive;
	}

	interface ConfigColumns {
		/**
		 * Set column's visibility priority
		 */
		responsivePriority?: number;
	}

	interface Context {
		responsive: Responsive;
	}

	interface Api<T> {
		/**
		 * Responsive methods container
		 *
		 * @returns Api for chaining with the additional Responsive methods
		 */
		responsive: ApiResponsiveMethods<T>;
	}

	interface ApiColumnMethods<T> {
		/**
		 * Get the responsive visibility state of a column in the table
		 */
		responsiveHidden(): boolean;
	}

	interface ApiColumnsMethods<T> {
		/**
		 * Get the responsive visibility state of columns in the table
		 */
		responsiveHidden(): Api<boolean>;
	}

	interface DataTablesStatic {
		/**
		 * Responsive class
		 */
		Responsive: typeof Responsive;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */

export interface Defaults {
	/**
	 * Set the breakpoints for a responsive instance
	 */
	breakpoints: Array<ResponsiveBreakpoint>;

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 */
	auto: true;

	/**
	 * Enable and configure the child rows shown by Responsive for collapsed
	 * tables.
	 */
	details: boolean | ConfigResponsiveDetails;

	/**
	 * The data type to request when obtaining data from the DataTable for a
	 * specific cell. See the columns.render and cell().render() documentation
	 * for full details.
	 */
	orthogonal: string;
}

export interface Config extends Partial<Defaults> {}

export interface ApiResponsiveMethods<T> extends Api<T> {
	/**
	 * Determine if Responsive has hidden any columns in the table
	 *
	 * @returns true if columns have been hidden, false if not
	 */
	hasHidden(): boolean;

	/**
	 * DEPRECATED
	 * Calculate the cell index from a li details element
	 *
	 * @param li The li node (or a jQuery collection containing the node) to get the cell index for.
	 * @returns Cell object that contains the properties row and column. This object can be used as a DataTables cell-selector.
	 */
	index(li: HTMLElement): object;

	/**
	 * Recalculate the column breakpoints based on the class information of the column header cells
	 *
	 * @returns DataTables API instance
	 */
	rebuild(): Api<T>;

	/**
	 * Recalculate the widths used by responsive after a change in the display.
	 *
	 * @returns DataTables Api instance
	 */
	recalc(): Api<T>;
}

export interface ConfigResponsiveDetails {
	/**
	 * Define how the hidden information should be displayed to the end user.
	 *
	 * @param row DataTables API instance for the table in question which is prepopulated with the row that is being acted upon - i.e. the result from row().
	 * @param update This parameter is used to inform the function what has triggered the function call:
	 * @param render The data to be shown - this is given as a function so it will be executed only when required (i.e. there is no point in gather data to display if the display function is simply going to hide it). The string returned by this function is that given by the responsive.details.renderer function. It accepts no input parameters.
	 * @returns boolean true if the display function has shown the hidden data, false
	 */
	display?: ResponsiveDisplay;

	/**
	 * Define the renderer used to display the child rows.
	 *
	 * @param api DataTables API instance for the table in question
	 * @param rowIdx Row index for the row that the renderer is being asked to render. Use the row() and / or cells() methods to get information from the API about the row so the information can be rendered.
	 * @param columns Since 2.0.0: An array of objects containing information about each column in the DataTable. The array length is exactly equal to the number of columns in the DataTable, with each column represented by a DataTable in index order.
	 * @returns boolean | string  `false` - Do not display a child row. Or a string - The information to be shown in the details display, including any required HTML.
	 */
	renderer?: ResponsiveRenderer | string;

	/**
	 * As a number it is a column index to the show / hide control should be attached. This can be >=0 to count columns from the left, or <0 to count from the right.
	 *
	 * As a string, this option is used as a jQuery selector to determine what element(s) will activate the show / hide control for the details child rows. This provides the ability to use any element in a table - for example you can use the whole row, or a single img element in the row.
	 */
	target?: number | string;

	/**
	 * The child row display type to use. This can be one of: `inline`, `column` or `none`
	 */
	type: boolean | string;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Support
 */

export interface ResponsiveBreakpoint {
	/**
	 * Breakpoint name
	 */
	name: string;

	/**
	 * Breakpoint width
	 */
	width: number;
}

export interface ResponsiveRenderer {
	/**
	 * Rendering functions for Responsive
	 */
	(
		this: Responsive,
		api: Api<any>,
		rowIdx: number,
		columns: ResponsiveRowDetails[]
	): Node | false;

	_responsiveMovesNodes?: boolean;
}

export interface ResponsiveDisplay {
	/**
	 * Display function for Responsive.
	 *
	 * @param row DataTables API row() for the row in question
	 * @param update Indicates if this is a redraw (true) or a fresh draw
	 *   (false)
	 * @param render Rendering function to be executed to get the data to show
	 *   for the row
	 */
	(
		row: ApiRowMethods,
		update: boolean,
		render: () => ReturnType<ResponsiveRenderer>,
		closeCallback: () => void
	): boolean;
}

interface ResponsiveModalOptions {
	header?(row: any): string;
}

export interface ResponsiveRowDetails {
	className: string | null;
	columnIndex: number;
	data: any;
	hidden: boolean;
	rowIndex: number;
	title: string;
}

export interface Column {
	className: string;
	includeIn: string[];
	auto: boolean;
	control: boolean;
	minWidth: number;
	never: boolean;
	priority: number;
}

export interface Settings {
	childNodeStore: Record<string, Node[]>;
	columns: Column[];
	current: boolean[];
	details: ConfigResponsiveDetails;
	dt: Api;
	timer: ReturnType<typeof setTimeout> | null;
}
