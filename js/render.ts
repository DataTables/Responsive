export function listHiddenNodes() {
	var fn = function (api, rowIdx, columns) {
		var that = this;
		var ul = $('<ul data-dtr-index="' + rowIdx + '" class="dtr-details"/>');
		var found = false;

		$.each(columns, function (i, col) {
			if (col.hidden) {
				var klass = col.className
					? 'class="' + col.className + '"'
					: '';

				$(
					'<li ' +
						klass +
						' data-dtr-index="' +
						col.columnIndex +
						'" data-dt-row="' +
						col.rowIndex +
						'" data-dt-column="' +
						col.columnIndex +
						'">' +
						'<span class="dtr-title">' +
						col.title +
						'</span> ' +
						'</li>'
				)
					.append(
						$('<span class="dtr-data"/>').append(
							that._childNodes(api, col.rowIndex, col.columnIndex)
						)
					) // api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
					.appendTo(ul);

				found = true;
			}
		});

		return found ? ul : false;
	};

	fn._responsiveMovesNodes = true;

	return fn;
}

export function listHidden() {
	return function (api, rowIdx, columns) {
		var data = $.map(columns, function (col) {
			var klass = col.className ? 'class="' + col.className + '"' : '';

			return col.hidden
				? '<li ' +
						klass +
						' data-dtr-index="' +
						col.columnIndex +
						'" data-dt-row="' +
						col.rowIndex +
						'" data-dt-column="' +
						col.columnIndex +
						'">' +
						'<span class="dtr-title">' +
						col.title +
						'</span> ' +
						'<span class="dtr-data">' +
						col.data +
						'</span>' +
						'</li>'
				: '';
		}).join('');

		return data
			? $(
					'<ul data-dtr-index="' + rowIdx + '" class="dtr-details"/>'
			  ).append(data)
			: false;
	};
}

export function tableAll(options) {
	options = $.extend(
		{
			tableClass: ''
		},
		options
	);

	return function (api, rowIdx, columns) {
		var data = $.map(columns, function (col) {
			var klass = col.className ? 'class="' + col.className + '"' : '';

			return (
				'<tr ' +
				klass +
				' data-dt-row="' +
				col.rowIndex +
				'" data-dt-column="' +
				col.columnIndex +
				'">' +
				'<td>' +
				('' !== col.title ? col.title + ':' : '') +
				'</td> ' +
				'<td>' +
				col.data +
				'</td>' +
				'</tr>'
			);
		}).join('');

		return $(
			'<table class="' +
				options.tableClass +
				' dtr-details" width="100%"/>'
		).append(data);
	};
}
