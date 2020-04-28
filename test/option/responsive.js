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
});
