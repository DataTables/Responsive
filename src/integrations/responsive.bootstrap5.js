/*! Responsive Bootstrap 5 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

var Dom = DataTable.Dom;
var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal;
var _bsModal;

function getModelEl() {
	if (!_modal) {
		_modal = Dom.c('div')
			.classAdd('modal fade dtr-bs-modal')
			.attr('role', 'dialog')
			.append(
				Dom.c('div')
					.classAdd('modal-dialog')
					.attr('role', 'document')
					.append(
						Dom.c('div')
							.classAdd('modal-content')
							.append(
								Dom.c('div')
									.classAdd('modal-header')
									.append(
										Dom.c('button')
											.attr('type', 'button')
											.attr('data-bs-dismiss', 'modal')
											.attr('aria-label', 'Close')
											.classAdd('btn-close')
									)
							)
							.append(Dom.c('div').classAdd('modal-body'))
					)
			)
			.append(Dom.c('div').classAdd('content'));
	}

	return _modal;
}

// Get the Bootstrap library from locally set (legacy) or from DT.
function getBs() {
	let dtBs = DataTable.use('bootstrap');
	let win = DataTable.use('win');

	if (dtBs) {
		return dtBs;
	}

	if (win.bootstrap) {
		return win.bootstrap;
	}

	throw new Error(
		'No Bootstrap library. Set it with `DataTable.use(bootstrap);`'
	);
}

_display.modal = function (options) {
	let modalEl = getModelEl();
	let localBs = getBs();

	if (!_bsModal && localBs.Modal) {
		_bsModal = new localBs.Modal(modalEl.get(0));
	}

	return function (row, update, render, closeCallback) {
		if (!_bsModal) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				if (options && options.header) {
					var header = modalEl.find('div.modal-header');
					var button = header.find('button').detach();

					header
						.empty()
						.append(
							Dom.c('h4')
								.classAdd('modal-title')
								.html(options.header(row))
						)
						.append(button);
				}

				modalEl.find('div.modal-body').empty().append(rendered);

				modalEl.attr('data-dtr-index', row.index()).appendTo('body');

				modalEl
					.get(0)
					.addEventListener('hidden.bs.modal', closeCallback, {
						once: true
					});

				_bsModal.show();
			}
			else {
				if (
					modalEl.isAttached() &&
					row.index() === modalEl.attr('data-dtr-index')
				) {
					modalEl.find('div.modal-body').empty().append(rendered);
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
