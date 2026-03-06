/*! Responsive Foundation styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

// Note that Foundation's JS depends upon jQuery, so we use it here
var jq = DataTable.use('jq');
var _display = DataTable.Responsive.display;
var _original = _display.modal;

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		if (!jq.fn.foundation) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				var modalContainer = jq('<div class="reveal-overlay" style="display:block"/>');
				jq(
					'<div class="reveal reveal-modal" style="display:block; top: 150px;" data-reveal/>'
				)
					.append('<button class="close-button" aria-label="Close">&#215;</button>')
					.append(
						options && options.header ? '<h4>' + options.header(row) + '</h4>' : null
					)
					.append(rendered)
					.appendTo(modalContainer);

				modalContainer.appendTo('body');

				jq('button.close-button').on('click', function () {
					jq('.reveal-overlay').remove();
					closeCallback();
				});
				jq('.reveal-overlay').on('click', function () {
					jq('.reveal-overlay').remove();
					closeCallback();
				});
			}
			else {
				return false;
			}

			return true;
		}
	};
};
