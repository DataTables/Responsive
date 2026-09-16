/*! Responsive Bulma styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

var Dom = DataTable.Dom;
var _display = DataTable.Responsive.display;
var _modal;

function getModelEl() {
	if (!_modal) {
		_modal = Dom
			.c('div')
			.classAdd('modal DTED')
			.append(Dom.c('div').classAdd('modal-background'))
			.append(
				Dom
					.c('div')
					.classAdd('modal-content')
					.append(Dom.c('div').classAdd('modal-header'))
					.append(Dom.c('div').classAdd('modal-body'))
			)
			.append(
				Dom
					.c('button')
					.attr('type', 'button')
					.attr('aria-label', 'Close')
					.classAdd('modal-close is-large')
			);
	}

	return _modal;
}

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		var rendered = render();
		var modal = getModelEl();

		if (rendered === false) {
			return false;
		}

		if (!update) {
			if (options && options.header) {
				var header = modal.find('div.modal-header');
				header.find('button').detach();

				header
					.empty()
					.append(
						Dom
							.c('h4')
							.classAdd('modal-title subtitle')
							.html(options.header(row))
					);
			}

			modal.find('div.modal-body').empty().append(rendered);

			modal.attr('data-dtr-index', row.index()).appendTo('body');

			modal.classAdd('is-active is-clipped');

			Dom.s('.modal-close').one('click', function () {
				modal.classRemove('is-active is-clipped');
				closeCallback();
			});

			Dom.s('.modal-background').one('click', function () {
				modal.classRemove('is-active is-clipped');
				closeCallback();
			});
		}
		else {
			if (
				modal.isAttached() &&
				row.index() === modal.attr('data-dtr-index')
			) {
				modal.find('div.modal-body').empty().append(rendered);
			}
			else {
				// Modal not shown - do nothing
				return null;
			}
		}

		return true;
	};
};
