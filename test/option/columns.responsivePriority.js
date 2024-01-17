describe('Responsive - columns.responsivePriority', function() {
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

	describe('Functional tests - responsivePriority', function() {
		dt.html('basic');
		it('Check taken from right by default', function() {
			$('table').wrapAll('<div style="width:250px">');
			table = $('#example').DataTable({
				responsive: true
			});

			checkVisible([true, true, false, false, false, false]);
		});

		dt.html('basic');
		it('High values taken first', function() {
			$('table').wrapAll('<div style="width:250px">');
			table = $('#example').DataTable({
				responsive: true,
				columnDefs: [
					{
						targets: 0,
						responsivePriority: 20000
					}
				]
			});

			checkVisible([false, true, true, true, false, false]);
		});

		dt.html('basic');
		it('Low values taken last', function() {
			$('table').wrapAll('<div style="width:250px">');
			table = $('#example').DataTable({
				responsive: true,
				columnDefs: [
					{
						targets: 5,
						responsivePriority: 1
					}
				]
			});

			checkVisible([true, false, false, false, false, true]);
		});

		dt.html('basic');
		it('Combine low and high', function() {
			$('table').wrapAll('<div style="width:250px">');
			table = $('#example').DataTable({
				responsive: true,
				columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
			});

			checkVisible([false, true, false, false, false, true]);
		});

		dt.html('basic');
		it('Initalisation options take priority over HTML5', function() {
			$('table').wrapAll('<div style="width:250px">');
			$('thead th:eq(0)').attr('data-priority', 20000);

			table = $('#example').DataTable({
				responsive: true,
				columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
			});

			checkVisible([false, true, false, false, false, true]);
		});
		it('... even if recalculated afterwards', function() {
			table.responsive.rebuild();
			table.responsive.recalc();

			checkVisible([false, true, false, false, false, true]);
		});
	});

	describe('Functional tests - HTML5 properties', function() {
		dt.html('basic');
		it('High values taken first', function() {
			$('table').wrapAll('<div style="width:250px">');
			$('thead th:eq(0)').attr('data-priority', 20000);

			table = $('#example').DataTable({
				responsive: true
			});

			checkVisible([false, true, true, true, false, false]);
		});

		dt.html('basic');
		it('Low values taken last', function() {
			$('table').wrapAll('<div style="width:250px">');
			$('thead th:eq(5)').attr('data-priority', 1);

			table = $('#example').DataTable({
				responsive: true
			});

			checkVisible([true, false, false, false, false, true]);
		});

		dt.html('basic');
		it('Combine low and high', function() {
			$('table').wrapAll('<div style="width:250px">');
			$('thead th:eq(0)').attr('data-priority', 20000);
			$('thead th:eq(5)').attr('data-priority', 1);

			table = $('#example').DataTable({
				responsive: true
			});

			checkVisible([false, true, false, false, false, true]);
		});
		it('Can change values', function() {
			$('thead th:eq(0)').attr('data-priority', 1);
			$('thead th:eq(4)').attr('data-priority', 1);

			table.responsive.rebuild();
			table.responsive.recalc();

			checkVisible([true, false, false, false, true, false]);
		});
	});
});
