/*! Foundation integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var _display = DataTable.Responsive.display;
var _original = _display.modal;

_display.modal = function (options) {
	return function (row, update, render, closeCallback) {
		if (!$.fn.foundation) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				var modalContainer = $('<div class="reveal-overlay" style="display:block"/>');
				$(
					'<div class="reveal reveal-modal" style="display:block; top: 150px;" data-reveal/>'
				)
					.append('<button class="close-button" aria-label="Close">&#215;</button>')
					.append(
						options && options.header ? '<h4>' + options.header(row) + '</h4>' : null
					)
					.append(rendered)
					.appendTo(modalContainer);

				modalContainer.appendTo('body');

				$('button.close-button').on('click', function () {
					$('.reveal-overlay').remove();
					closeCallback();
				});
				$('.reveal-overlay').on('click', function () {
					$('.reveal-overlay').remove();
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
