import DataTable, { ApiRowMethods, Dom } from 'datatables.net';
import { ResponsiveDisplay } from './interface';

const dom = DataTable.dom;
const util = DataTable.util;

export const childRow: ResponsiveDisplay = function (row, update, render) {
	var rowNode = dom.s(row.node());

	if (update) {
		if (rowNode.classHas('dtr-expanded')) {
			let rendered = render();

			if (rendered) {
				row.child(rendered, 'child').show();
			}

			return true;
		}
	}
	else {
		if (!rowNode.classHas('dtr-expanded')) {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			row.child(rendered, 'child').show();
			return true;
		}
		else {
			row.child(false);
		}
	}

	return false;
};

export const childRowImmediate: ResponsiveDisplay = function (
	row,
	update,
	render
) {
	var rowNode = dom.s(row.node());

	if (
		(!update && rowNode.classHas('dtr-expanded')) ||
		!(row as any).responsive.hasHidden()
	) {
		// User interaction and the row is show, or nothing to show
		row.child(false);

		return false;
	}
	else {
		// Display
		var rendered = render();

		if (rendered === false) {
			return false;
		}

		row.child(rendered, 'child').show();

		return true;
	}
};

// This is a wrapper so the modal options for Bootstrap and jQuery UI can have
// options passed into them. This specific one doesn't need to be a function but
// it is for consistency in the `modal` name
export function modal(options?: {
	header?: (row: ApiRowMethods) => string;
}): ResponsiveDisplay {
	return function (row, update, render, closeCallback) {
		var modal: Dom;
		var rendered = render();

		if (rendered === false) {
			return false;
		}

		if (!update) {
			// Show a modal
			var close = function () {
				modal.remove(); // will tidy events for us
				dom.s(document).off('keypress.dtr');
				dom.s(row.node()).classRemove('dtr-expanded');

				closeCallback();
			};

			modal = dom
				.c('div')
				.classAdd('dtr-modal')
				.append(
					dom
						.c('div')
						.classAdd('dtr-modal-display')
						.append(
							dom
								.c('div')
								.classAdd('dtr-modal-content')
								.data('dtr-row-idx', row.index())
								.append(rendered)
						)
						.append(
							dom
								.c('div')
								.classAdd('dtr-modal-close')
								.html('&times;')
								.on('click', function () {
									close();
								})
						)
				)
				.append(
					dom
						.c('div')
						.classAdd('dtr-modal-background')
						.on('click', function () {
							close();
						})
				)
				.appendTo('body');

			dom.s(row.node()).classAdd('dtr-expanded');

			dom.s(document).on('keyup.dtr', function (e) {
				if (e.keyCode === 27) {
					e.stopPropagation();

					close();
				}
			});
		}
		else {
			modal = dom.s('div.dtr-modal-content');

			if (modal.count() && row.index() === modal.data('dtr-row-idx')) {
				modal.empty().append(rendered);
			}
			else {
				// Modal not shown, nothing to update
				return false;
			}
		}

		if (options && options.header) {
			dom.s('div.dtr-modal-content').prepend(
				dom.c('h2').html(options.header(row))
			);
		}

		return true;
	};
}
