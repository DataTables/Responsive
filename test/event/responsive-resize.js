describe('Responsive - responsive-resize', function() {
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
		table.on('responsive-resize', function() {
			args = arguments;
			count++;
		});
		expect(count).toBe(0);
	});
	it('Check correct number of args', async function() {
		table.column(2).visible(false);
		await dt.sleep(300); // Responsive's update is async
		expect(args.length).toBe(3);
	});
	it('First arg - event object', function() {
		expect(args[0] instanceof $.Event).toBe(true);
	});
	it('Second arg - API instance', function() {
		expect(args[1] instanceof $.fn.dataTable.Api).toBe(true);
	});
	it('Third arg - row API', function() {
		expect(args[2] instanceof Array).toBe(true);

		let visible = [true, true, true, true, true, true, true, true, true, false, false];
		for (let i = 0; i < visible.length; i++) {
			expect(args[2][i]).toBe(visible[i]);
		}
	});
});
