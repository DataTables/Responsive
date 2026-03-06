/*! Responsive jQuery UI styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

// Note that jQuery UI's JS depends upon jQuery, so we use it here
var $ = DataTable.use('jq');
var _display = DataTable.Responsive.display;
var _original = _display.modal;

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		if (!$.fn.dialog) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				$('<div/>')
					.append(rendered)
					.appendTo('body')
					.dialog(
						$.extend(
							true,
							{
								close: closeCallback,
								title: options && options.header ? options.header(row) : '',
								width: 500
							},
							options.dialog
						)
					);
			}
			else {
				return false;
			}

			return true;
		}
	};
};
