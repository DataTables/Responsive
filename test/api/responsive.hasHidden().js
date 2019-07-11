describe('Responsive - responsive.hasHidden()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	describe('Check the defaults', function() {
		dt.html('basic_wide');
		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				responsive: true
			});
			expect(typeof table.responsive.hasHidden).toBe('function');
		});
		it('Returns boolean', function() {
			expect(typeof table.responsive.hasHidden()).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic_wide');
		it('Check single column', function() {
			table = $('#example').DataTable({
				responsive: true
			});

			expect(table.responsive.hasHidden()).toBe(true);
		});
		it('Remove columns so nothing responsive', function() {
			table.columns([0, 1, 2, 9, 10]).visible(false);
			expect(table.responsive.hasHidden()).toBe(false);
		});
	});
});
