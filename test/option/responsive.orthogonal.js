describe('Responsive - responsive.orthogonal', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let columnDefs = [
		{
			targets: 9,
			render: function(data, type, row, meta) {
				return type === 'unitTest' ? 'test ' + data : data;
			}
		}
	];

	dt.html('basic_wide');
	it('Check default orthogonal value used', function() {
		table = $('#example').DataTable({
			responsive: true,
			columnDefs: columnDefs
		});
		$('tbody tr:eq(2) td:eq(0)').click();

		expect($('td.child ul li:eq(1) span:eq(1)').text()).toBe('Tiger');
	});

	dt.html('basic_wide');
	it('Use orthogonal value used', function() {
		table = $('#example').DataTable({
			responsive: {
				orthogonal: 'unitTest'
			},
			columnDefs: columnDefs
		});
		$('tbody tr:eq(2) td:eq(0)').click();

		expect($('td.child ul li:eq(1) span:eq(1)').text()).toBe('test Tiger');
	});
});
