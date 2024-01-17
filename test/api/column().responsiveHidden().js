describe('Responsive - column().responsiveHidden()', function() {
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
			expect(typeof table.column(0).responsiveHidden).toBe('function');
		});
		it('Returns a boolean', function() {
			expect(typeof table.column(0).responsiveHidden()).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic_wide');
		it('Just check all the columns', function() {
			table = $('#example').DataTable({
				responsive: true
			});

			for (let i = 0; i < 8; i++) {
				expect(table.column(i).responsiveHidden()).toBe(true);
			}
			expect(table.column(8).responsiveHidden()).toBe(false);
		});

		it('Doesnt care about visible columns', async function() {
			table.column(0).visible(false);
			await dt.sleep(300); // Responsive is async in its response to column visibility change

			for (let i = 0; i < 8; i++) {
				expect(table.column(i).responsiveHidden()).toBe(true);
			}
			expect(table.column(8).responsiveHidden()).toBe(false);
		});
	});
});
