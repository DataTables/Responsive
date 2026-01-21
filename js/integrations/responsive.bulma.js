/*! Bulma integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var _display = DataTable.Responsive.display;
var _modal = $(
	'<div class="modal DTED">' +
		'<div class="modal-background"></div>' +
		'<div class="modal-content">' +
		'<div class="modal-header">' +
		'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
		'</div>' +
		'<div class="modal-body"/>' +
		'</div>' +
		'<button class="modal-close is-large" aria-label="close"></button>' +
		'</div>'
);

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		var rendered = render();

		if (rendered === false) {
			return false;
		}

		if (!update) {
			if (options && options.header) {
				var header = _modal.find('div.modal-header');
				header.find('button').detach();

				header
					.empty()
					.append('<h4 class="modal-title subtitle">' + options.header(row) + '</h4>');
			}

			_modal.find('div.modal-body').empty().append(rendered);

			_modal.data('dtr-row-idx', row.index()).appendTo('body');

			_modal.addClass('is-active is-clipped');

			$('.modal-close').one('click', function () {
				_modal.removeClass('is-active is-clipped');
				closeCallback();
			});
			$('.modal-background').one('click', function () {
				_modal.removeClass('is-active is-clipped');
				closeCallback();
			});
		}
		else {
			if ($.contains(document, _modal[0]) && row.index() === _modal.data('dtr-row-idx')) {
				_modal.find('div.modal-body').empty().append(rendered);
			}
			else {
				// Modal not shown - do nothing
				return null;
			}
		}

		return true;
	};
};
