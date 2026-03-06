/*! Responsive Bootstrap 5 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

var Dom = DataTable.Dom;
var _display = DataTable.Responsive.display;
var _original = _display.modal;

var _modal = Dom
	.c('div')
	.classAdd('modal fade dtr-bs-modal')
	.attr('role', 'dialog')
	.append(
		Dom
			.c('div')
			.classAdd('modal-dialog')
			.attr('role', 'document')
			.append(
				Dom
					.c('div')
					.classAdd('modal-content')
					.append(
						Dom
							.c('div')
							.classAdd('modal-header')
							.append(
								Dom
									.c('button')
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

var modal;

// Note this could be undefined at the time of initialisation - the
// DataTable.Responsive.bootstrap function can be used to set a different
// bootstrap object
var _bs = window.bootstrap;

DataTable.Responsive.bootstrap = function (bs) {
	_bs = bs;
};

// Get the Bootstrap library from locally set (legacy) or from DT.
function getBs() {
	let dtBs = DataTable.use('bootstrap');

	if (dtBs) {
		return dtBs;
	}

	if (_bs) {
		return _bs;
	}

	throw new Error(
		'No Bootstrap library. Set it with `DataTable.use(bootstrap);`'
	);
}

_display.modal = function (options) {
	if (!modal && _bs.Modal) {
		let localBs = getBs();
		modal = new localBs.Modal(_modal.get(0));
	}

	return function (row, update, render, closeCallback) {
		if (!modal) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				if (options && options.header) {
					var header = _modal.find('div.modal-header');
					var button = header.find('button').detach();

					header
						.empty()
						.append(
							Dom
								.c('h4')
								.classAdd('modal-title')
								.html(options.header(row))
						)
						.append(button);
				}

				_modal.find('div.modal-body').empty().append(rendered);

				_modal
					.data('dtr-row-idx', row.index())
					.appendTo('body');

				_modal.get(0).addEventListener('hidden.bs.modal', closeCallback, {
					once: true
				});

				modal.show();
			}
			else {
				if (
					_modal.isAttached() &&
					row.index() === _modal.data('dtr-row-idx')
				) {
					_modal.find('div.modal-body').empty().append(rendered);
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
