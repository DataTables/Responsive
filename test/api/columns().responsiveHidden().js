describe('Responsive - columns().responsiveHidden()', function() {
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
			expect(typeof table.columns(0).responsiveHidden).toBe('function');
		});
		it('Returns an API instance containing booleans', function() {
			expect(table.columns(0).responsiveHidden() instanceof $.fn.dataTable.Api).toBe(true);
			expect(typeof table.columns(0).responsiveHidden()[0]).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic_wide');
		it('Check single column', function() {
			table = $('#example').DataTable({
				responsive: true
			});

			for (let i = 0; i < 8; i++) {
				expect(table.columns(i).responsiveHidden()[0]).toBe(true);
			}
			expect(table.columns(8).responsiveHidden()[0]).toBe(false);
		});

		it('Check array of columns', function() {
			let result = table.columns([0, 8]).responsiveHidden();
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(false);
		});

		it('Doesnt care about visible columns', async function() {
			table.column(0).visible(false);
			await dt.sleep(300); // Responsive is async in its response to column visibility change

			let result = table.columns([0, 1, 8]).responsiveHidden();
			expect(result[0]).toBe(true);
			expect(result[1]).toBe(true);
			expect(result[2]).toBe(false);
		});
	});
});
