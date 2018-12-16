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
	it('Check correct number of args', function() {
		table.column(2).visible(false);
		expect(args.length).toBe(3);
	});
	it('First arg - event object', function() {
		expect(args[0] instanceof $.Event).toBe(true);
	});
	it('Second arg - API', function() {
		expect(args[1] instanceof $.fn.dataTable.Api).toBe(true);
	});
	it('Third arg - row API', function() {
		expect(args[2] instanceof Array).toBe(true);

		// third one should be false - will fail when DD-756 fixed.
		let visible = [true, true, false, true, true, true, true, true, true, false, false];
		for (let i = 0; i < visible.length; i++) {
			expect(args[2][i]).toBe(visible[i]);
		}
	});
});
