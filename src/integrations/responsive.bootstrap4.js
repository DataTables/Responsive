/*! Responsive Bootstrap 4 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

// Note that BS4's JS depends upon jQuery, so we use it here
var $ = DataTable.use('jq');
var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal;

function getModelEl() {
	if (!_modal) {
		_modal = $(
			'<div class="modal fade dtr-bs-modal" role="dialog">' +
				'<div class="modal-dialog" role="document">' +
				'<div class="modal-content">' +
				'<div class="modal-header">' +
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body"/>' +
				'</div>' +
				'</div>' +
				'</div>'
		);
	}

	return _modal;
}

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		if (!$.fn.modal) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();
			var modal = getModelEl();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				if (options && options.header) {
					var header = modal.find('div.modal-header');
					var button = header.find('button').detach();

					header
						.empty()
						.append(
							'<h4 class="modal-title">' +
								options.header(row) +
								'</h4>'
						)
						.append(button);
				}

				modal.find('div.modal-body').empty().append(rendered);

				modal
					.attr('data-dtr-index', row.index())
					.one('hidden.bs.modal', closeCallback)
					.appendTo('body')
					.modal();
			}
			else {
				if (
					$.contains(document, modal[0]) &&
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
		}
	};
};
