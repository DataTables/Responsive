describe('Responsive - responsive', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	dt.html('basic_wide');
	it('Classes are transferred to the responsive display', function() {
		table = $('#example').DataTable({
			responsive: true,
			columnDefs: [
				{
					targets: 10,
					className: 'test'
				}
			]
		});

		$('tbody tr:eq(0) td:eq(0)').click();

		expect($('ul li').length).toBe(3);
		expect($('ul li:eq(2)').attr('data-dtr-index')).toBe('10');
		expect($('ul li:eq(2)').hasClass('test')).toBe(true);
		expect($('ul li:eq(1)').hasClass('test')).toBe(false);
	});

	dt.html('basic_wide');

	it('+ icons are displayed on all rows on first page', function() {
		table = $('#example').DataTable({
			responsive: true,
			columnDefs: [
				{
					targets: 10,
					className: 'test'
				}
			]
		});

		expect($('tbody tr td.dtr-control').length).toBe(10);
	});

	it('... and second page', function() {
		table.page(1).draw(false);

		expect($('tbody tr td.dtr-control').length).toBe(10);
	});

	it('Row expands when clicked', function() {
		$('tbody tr td.dtr-control').eq(0).trigger('click');

		expect($('tbody tr').length).toBe(11);
	});

	it('Row has dtr-expanded class when expanded', function() {
		expect($('tbody tr').eq(0).hasClass('dtr-expanded')).toBe(true);
		expect($('tbody tr.dtr-expanded').length).toBe(1);
	});

	it('Row contracts when clicked', function() {
		$('tbody tr td.dtr-control').eq(0).trigger('click');

		expect($('tbody tr').length).toBe(10);
	});

	it('Row has dtr-expanded class removed when contracted', function() {
		expect($('tbody tr').eq(0).hasClass('dtr-expanded')).toBe(false);
		expect($('tbody tr.dtr-expanded').length).toBe(0);
	});

	it('Classes are removed on destroy', function() {
		table.destroy();

		expect($('table.dtr-inline').length).toBe(0);
		expect($('table.collapsed').length).toBe(0);
	});


	dt.html('complex-header-footer');

	it('Complex header and footer initialises', function() {
		table = $('#example').DataTable({
			responsive: true
		});

		expect($('table.collapsed tbody tr td.dtr-control').length).toBe(0);
	});

	it('Resize to remove last column - activates child display control', function() {
		table.table().container().style.width = '450px';
		table.columns.adjust();

		expect($('table.collapsed tbody tr td.dtr-control').length).toBe(10);
	});

	it('Last column was removed', function() {
		expect($('tbody tr').eq(0).children(':visible').length).toBe(5);
	});

	it('Header has expected number of cells', function() {
		expect($('thead tr').eq(0).children(':visible').length).toBe(3);
		expect($('thead tr').eq(1).children(':visible').length).toBe(2);
	});

	it('Colspan updated for header rows', function() {
		expect($('thead tr').eq(0).children().eq(2).attr('colspan')).toBe('2');
		expect($('thead tr').eq(1).children().eq(1).attr('colspan')).toBe('1');
	});

	it('Remove second last column as well', function() {
		table.table().container().style.width = '400px';
		table.columns.adjust();

		expect($('tbody tr').eq(0).children(':visible').length).toBe(4);
	});

	it('Header has expected number of cells', function() {
		expect($('thead tr').eq(0).children(':visible').length).toBe(3);
		expect($('thead tr').eq(1).children(':visible').length).toBe(1);
	});

	it('Colspan updated for header rows', function() {
		expect($('thead tr').eq(0).children().eq(2).attr('colspan')).toBe('1');
		expect($('thead tr').eq(1).children().eq(0).attr('colspan')).toBe('3');
	});

	it('Remove third last column as well', function() {
		table.table().container().style.width = '300px';
		table.columns.adjust();

		expect($('tbody tr').eq(0).children(':visible').length).toBe(3);
	});

	it('Header has expected number of cells', function() {
		expect($('thead tr').eq(0).children(':visible').length).toBe(2);
		expect($('thead tr').eq(1).children(':visible').length).toBe(1);
	});

	it('Colspan updated for header rows', function() {
		expect($('thead tr').eq(0).children().eq(1).attr('colspan')).toBe('2');
		expect($('thead tr').eq(1).children().eq(0).attr('colspan')).toBe('2');
	});

	it('And the fourth last column', function() {
		table.table().container().style.width = '200px';
		table.columns.adjust();

		expect($('tbody tr').eq(0).children(':visible').length).toBe(2);
	});

	it('Header has expected number of cells', function() {
		expect($('thead tr').eq(0).children(':visible').length).toBe(2);
		expect($('thead tr').eq(1).children(':visible').length).toBe(1);
	});

	it('Colspan updated for header rows', function() {
		expect($('thead tr').eq(0).children().eq(1).attr('colspan')).toBe('1');
		expect($('thead tr').eq(1).children().eq(0).attr('colspan')).toBe('1');
	});

	it('And the fifth last column', function() {
		table.table().container().style.width = '100px';
		table.columns.adjust();

		expect($('tbody tr').eq(0).children(':visible').length).toBe(1);
	});

	it('Header has expected number of cells', function() {
		expect($('thead tr').eq(0).children(':visible').length).toBe(1);
		expect($('thead tr').eq(1).children(':visible').length).toBe(0);
	});

	it('Colspan updated for header rows', function() {
		expect($('thead tr').eq(0).children().eq(0).attr('colspan')).toBe('1');
	});
});
