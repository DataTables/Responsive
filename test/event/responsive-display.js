describe('Responsive - responsive-display', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;
	let args;
	let count = 0;

	dt.html('basic_wide');
	it('Setup', function() {
		table = $('#example').DataTable({
			responsive: true
		});
		table.on('responsive-display', function() {
			args = arguments;
			count++;
		});
		expect(count).toBe(0);
	});
	it('Check correct number of args', function() {
		$('tbody tr:eq(2) td:eq(0)').click();
		expect(args.length).toBe(5);
	});
	it('First arg - event object', function() {
		expect(args[0] instanceof $.Event).toBe(true);
	});
	it('Second arg - API', function() {
		expect(args[1] instanceof $.fn.dataTable.Api).toBe(true);
	});
	it('Third arg - row API', function() {
		expect(args[2] instanceof $.fn.dataTable.Api).toBe(true);
		expect(args[2][0][0]).toBe(2);
		expect(args[2].data()[0]).toBe('Ashton');
	});
	it('Fourth arg - showHide', function() {
		expect(args[3]).toBe(true);
		$('tbody tr:eq(2) td:eq(0)').click();
		expect(args[3]).toBe(false);
	});
	it('Fifth arg - update', async function() {
		expect(args[4]).toBe(false);
		$('tbody tr:eq(2) td:eq(0)').click();
		table.column(2).visible(false);
		await dt.sleep(300); // Responsive is async in its response to column visibility change
		expect(args[4]).toBe(true);
	});
});
