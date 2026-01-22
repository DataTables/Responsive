export function childRow(row, update, render) {
	var rowNode = $(row.node());

	if (update) {
		if (rowNode.hasClass('dtr-expanded')) {
			row.child(render(), 'child').show();

			return true;
		}
	}
	else {
		if (!rowNode.hasClass('dtr-expanded')) {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			row.child(rendered, 'child').show();
			return true;
		}
		else {
			row.child(false);
		}
	}

	return false;
}

export function childRowImmediate(row, update, render) {
	var rowNode = $(row.node());

	if (
		(!update && rowNode.hasClass('dtr-expanded')) ||
		!row.responsive.hasHidden()
	) {
		// User interaction and the row is show, or nothing to show
		row.child(false);

		return false;
	}
	else {
		// Display
		var rendered = render();

		if (rendered === false) {
			return false;
		}

		row.child(rendered, 'child').show();

		return true;
	}
}

// This is a wrapper so the modal options for Bootstrap and jQuery UI can
// have options passed into them. This specific one doesn't need to be a
// function but it is for consistency in the `modal` name
export function modal(options) {
	return function (row, update, render, closeCallback) {
		var modal;
		var rendered = render();

		if (rendered === false) {
			return false;
		}

		if (!update) {
			// Show a modal
			var close = function () {
				modal.remove(); // will tidy events for us
				$(document).off('keypress.dtr');
				$(row.node()).removeClass('dtr-expanded');

				closeCallback();
			};

			modal = $('<div class="dtr-modal"/>')
				.append(
					$('<div class="dtr-modal-display"/>')
						.append(
							$('<div class="dtr-modal-content"/>')
								.data('dtr-row-idx', row.index())
								.append(rendered)
						)
						.append(
							$(
								'<div class="dtr-modal-close">&times;</div>'
							).click(function () {
								close();
							})
						)
				)
				.append(
					$('<div class="dtr-modal-background"/>').click(function () {
						close();
					})
				)
				.appendTo('body');

			$(row.node()).addClass('dtr-expanded');

			$(document).on('keyup.dtr', function (e) {
				if (e.keyCode === 27) {
					e.stopPropagation();

					close();
				}
			});
		}
		else {
			modal = $('div.dtr-modal-content');

			if (modal.length && row.index() === modal.data('dtr-row-idx')) {
				modal.empty().append(rendered);
			}
			else {
				// Modal not shown, nothing to update
				return null;
			}
		}

		if (options && options.header) {
			$('div.dtr-modal-content').prepend(
				'<h2>' + options.header(row) + '</h2>'
			);
		}

		return true;
	};
}
