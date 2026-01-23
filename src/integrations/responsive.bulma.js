/*! Bulma integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var dom = DataTable.dom;
var _display = DataTable.Responsive.display;
var _modal = dom
	.c('div')
	.classAdd('modal DTED')
	.append(dom.c('div').classAdd('modal-background'))
	.append(
		dom
			.c('div')
			.classAdd('modal-content')
			.append(dom.c('div').classAdd('modal-header'))
			.append(dom.c('div').classAdd('modal-body'))
	)
	.append(
		dom
			.c('button')
			.attr('type', 'button')
			.attr('aria-label', 'Close')
			.classAdd('modal-close is-large')
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
					.append(
						dom
							.c('h4')
							.classAdd('modal-title subtitle')
							.html(options.header(row))
					);
			}

			_modal.find('div.modal-body').empty().append(rendered);

			_modal.data('dtr-row-idx', row.index()).appendTo('body');

			_modal.classAdd('is-active is-clipped');

			dom.s('.modal-close').one('click', function () {
				_modal.classRemove('is-active is-clipped');
				closeCallback();
			});

			dom.s('.modal-background').one('click', function () {
				_modal.classRemove('is-active is-clipped');
				closeCallback();
			});
		}
		else {
			if (
				_modal.isAttached() &&
				row.index() === _modal.data('dtr-row-idx')
			) {
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
