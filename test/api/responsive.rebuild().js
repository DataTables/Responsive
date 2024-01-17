describe('Responsive - responsive.rebuild()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	function checkVisible(expected) {
		for (let i = 0; i < expected.length; i++) {
			let style = $('thead th:eq(' + i + ')').attr('style') || '';
			let invisible = style.includes('display: none;');
			expect(!invisible).toBe(expected[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic_wide');
		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				responsive: true
			});
			expect(typeof table.responsive.rebuild).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.responsive.rebuild() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	// TK can't separate the rebuild and recalc - values are read on the
	// fly in HTML5 and the init options aren't changable, so need to
	// rebuild to see the effect they have
	describe('Functional testss', function () {
		dt.html('basic');
		it('Check original values', function () {
			$('table').wrapAll('<div style="width:250px">');
			$('thead th:eq(0)').attr('data-priority', 20000);

			table = $('#example').DataTable({
				responsive: true
			});

			checkVisible([false, true, true, true, false, false]);
		});
		it('... change existing value', function() {
			$('thead th:eq(0)').attr('data-priority', 1);

			table.responsive.rebuild();
			table.responsive.recalc();

			checkVisible([true, true, false, false, false, false]);
		});
	});
});
