// TK can't separate the rebuild and recalc - main tests are in rebuild()
describe('Responsive - responsive.recalc()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic_wide');
		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				responsive: true
			});
			expect(typeof table.responsive.recalc).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.responsive.recalc() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});
});
