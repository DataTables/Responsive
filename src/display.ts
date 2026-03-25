import DataTable, { ApiRowMethods, Dom } from 'datatables.net';
import { ResponsiveDisplay } from './interface';

const util = DataTable.util;

export const childRow: ResponsiveDisplay = function (row, update, render) {
	var rowNode = Dom.s(row.node());

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
	var rowNode = Dom.s(row.node());

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
				Dom.s(document).off('keypress.dtr');
				Dom.s(row.node()).classRemove('dtr-expanded');

				closeCallback();
			};

			modal = Dom
				.c('div')
				.classAdd('dtr-modal')
				.append(
					Dom
						.c('div')
						.classAdd('dtr-modal-display')
						.append(
							Dom
								.c('div')
								.classAdd('dtr-modal-content')
								.data('dtrRowIdx', row.index())
								.append(rendered)
						)
						.append(
							Dom
								.c('div')
								.classAdd('dtr-modal-close')
								.html('&times;')
								.on('click', function () {
									close();
								})
						)
				)
				.append(
					Dom
						.c('div')
						.classAdd('dtr-modal-background')
						.on('click', function () {
							close();
						})
				)
				.appendTo('body');

			Dom.s(row.node()).classAdd('dtr-expanded');

			Dom.s(document).on('keyup.dtr', function (e) {
				if (e.keyCode === 27) {
					e.stopPropagation();

					close();
				}
			});
		}
		else {
			modal = Dom.s('div.dtr-modal-content');

			if (modal.count() && row.index() === modal.data('dtrRowIdx')) {
				modal.empty().append(rendered);
			}
			else {
				// Modal not shown, nothing to update
				return false;
			}
		}

		if (options && options.header) {
			Dom.s('div.dtr-modal-content').prepend(
				Dom.c('h2').html(options.header(row))
			);
		}

		return true;
	};
}
