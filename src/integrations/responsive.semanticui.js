/*! Responsive Fomantic styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

// Note that Fomantic's JS depends upon jQuery, so we use it here
var jq = DataTable.use('jq');
var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal;

function getModelEl() {
	if (!_modal) {
		_modal = jq(
			'<div class="ui modal" role="dialog">' +
				'<div class="header">' +
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="content"/>' +
				'</div>'
		);
	}

	return _modal;
}

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		if (!jq.fn.modal) {
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
					modal
						.find('div.header')
						.empty()
						.append('<h4 class="title">' + options.header(row) + '</h4>');
				}

				modal.find('div.content').empty().append(rendered);

				// Only need to attach the first time
				if (!modal.parent().hasClass('dimmer')) {
					modal.appendTo('body');
				}

				modal
					.modal({
						onHide: closeCallback
					})
					.modal('show');
			}
			else {
				// Modal not shown for this row - do nothing
				return false;
			}

			return true;
		}
	};
};
