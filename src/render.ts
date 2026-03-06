import DataTable, { Dom } from 'datatables.net';
import { ResponsiveRenderer } from './interface';

export function listHiddenNodes(): ResponsiveRenderer {
	let fn: ResponsiveRenderer = function (api, rowIdx, columns) {
		let that = this;
		let ul = Dom
			.c('ul')
			.attr('data-dtr-index', rowIdx)
			.classAdd('dtr-details');

		let found = false;

		columns.forEach(function (col) {
			if (col.hidden) {
				let klass = col.className
					? 'class="' + col.className + '"'
					: '';

				Dom.c('li')
					.classAdd(col.className)
					.attr('data-dtr-index', col.columnIndex)
					.attr('data-dt-row', col.rowIndex)
					.attr('data-dt-column', col.columnIndex)
					.append(Dom.c('span').classAdd('dtr-title').html(col.title))
					.append(
						Dom
							.c('span')
							.classAdd('dtr-data')
							.append(
								that.childNodes(
									api,
									col.rowIndex,
									col.columnIndex
								)
							)
					) // api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
					.appendTo(ul);

				found = true;
			}
		});

		return found ? ul.get(0) : false;
	};

	fn._responsiveMovesNodes = true;

	return fn;
}

export function listHidden(): ResponsiveRenderer {
	return function (api, rowIdx, columns) {
		let ul = Dom
			.c('ul')
			.attr('data-dtr-index', rowIdx)
			.classAdd('dtr-details');

		columns.forEach(function (col) {
			if (!col.hidden) {
				return;
			}

			Dom.c('li')
				.classAdd(col.className)
				.attr('data-dtr-index', col.columnIndex)
				.attr('data-dt-row', col.rowIndex)
				.attr('data-dt-column', col.columnIndex)
				.append(Dom.c('span').classAdd('dtr-title').html(col.title))
				.append(Dom.c('span').classAdd('dtr-data').html(col.data))
				.appendTo(ul);
		});

		return ul.children().count() ? ul.get(0) : false;
	};
}

export function tableAll(
	options: { tableClass?: string } = {}
): ResponsiveRenderer {
	options = DataTable.util.object.assign(
		{
			tableClass: ''
		},
		options
	);

	return function (api, rowIdx, columns) {
		let table = Dom
			.c('table')
			.classAdd(options.tableClass)
			.classAdd('dtr-details');

		columns.forEach(function (col) {
			if (!col.hidden) {
				return;
			}

			Dom.c('tr')
				.classAdd(col.className)
				.attr('data-dt-row', col.rowIndex)
				.attr('data-dt-column', col.columnIndex)
				.append(Dom.c('td').html(col.title))
				.append(Dom.c('td').html(col.data))
				.appendTo(table);
		});

		return table.children().count() ? table.get(0) : false;
	};
}
