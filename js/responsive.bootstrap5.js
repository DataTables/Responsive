/*! Bootstrap 5 integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal = $(
	'<div class="modal fade dtr-bs-modal" role="dialog">' +
		'<div class="modal-dialog" role="document">' +
		'<div class="modal-content">' +
		'<div class="modal-header">' +
		'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
		'</div>' +
		'<div class="modal-body"/>' +
		'</div>' +
		'</div>' +
		'</div>'
);
var modal;

// Note this could be undefined at the time of initialisation - the
// DataTable.Responsive.bootstrap function can be used to set a different
// bootstrap object
var _bs = window.bootstrap;

DataTable.Responsive.bootstrap = function (bs) {
	_bs = bs;
};

_display.modal = function (options) {
	if (!modal) {
		modal = new _bs.Modal(_modal[0]);
	}

	return function (row, update, render, closeCallback) {
		if (!$.fn.modal) {
			return _original(row, update, render, closeCallback);
		}
		else {
			if (!update) {
				if (options && options.header) {
					var header = _modal.find('div.modal-header');
					var button = header.find('button').detach();

					header
						.empty()
						.append('<h4 class="modal-title">' + options.header(row) + '</h4>')
						.append(button);
				}

				_modal.find('div.modal-body').empty().append(render());

				_modal
					.data('dtr-row-idx', row.index())
					.one('hidden.bs.modal', closeCallback)
					.appendTo('body')
					.modal();

				modal.show();
			}
			else {
				if ($.contains(document, _modal[0]) && row.index() === _modal.data('dtr-row-idx')) {
					_modal.find('div.modal-body').empty().append(render());
				}
				else {
					// Modal not shown for this row - do nothing
					return null;
				}
			}

			return true;
		}
	};
};
