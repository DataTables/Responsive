describe('Responsive - responsive.breakpoints', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables']
	});

	let table;

	function checkVisible(expected) {
		for (let i = 0; i < expected.length; i++) {
			let invisible = $('thead th:eq(' + i + ')')
				.attr('style')
				.includes('display: none;');
			expect(!invisible).toBe(expected[i]);
		}
	}

	// DD-881 Responsive breakpoints doing very odd things so bailing out here
	// TK COLIN
	describe('Functional tests - check defaults', function() {
		dt.html('basic');
		// it('Check taken from right by default', function() {
		// 	// $('table').wrapAll('<div style="width:800px">');
		// 	table = $('#example').DataTable({
		// 		responsive: true,
		// 		columns: [ 
		// 			{className: 'mobile-p'},
		// 			{className: 'mobile-p'},
		// 			{className: 'desktop'},
		// 			{className: 'tablet-p'},
		// 			{className: 'mobile-p'},
		// 			{className: 'none'},

		// 		]
		// 	});

		// 	checkVisible([true, true, false, false, false, false]);
		// });

		// dt.html('basic');
		// it('High values taken first', function() {
		// 	$('table').wrapAll('<div style="width:250px">');
		// 	table = $('#example').DataTable({
		// 		responsive: true,
		// 		columnDefs: [
		// 			{
		// 				targets: 0,
		// 				responsivePriority: 20000
		// 			}
		// 		]
		// 	});

		// 	checkVisible([false, true, true, true, false, false]);
		// });

		// dt.html('basic');
		// it('Low values taken last', function() {
		// 	$('table').wrapAll('<div style="width:250px">');
		// 	table = $('#example').DataTable({
		// 		responsive: true,
		// 		columnDefs: [
		// 			{
		// 				targets: 5,
		// 				responsivePriority: 1
		// 			}
		// 		]
		// 	});

		// 	checkVisible([true, false, false, false, false, true]);
		// });

		// dt.html('basic');
		// it('Combine low and high', function() {
		// 	$('table').wrapAll('<div style="width:250px">');
		// 	table = $('#example').DataTable({
		// 		responsive: true,
		// 		columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
		// 	});

		// 	checkVisible([false, true, false, false, false, true]);
		// });

		// dt.html('basic');
		// it('Initalise options always take priority over HTML5', function() {
		// 	$('table').wrapAll('<div style="width:250px">');
		// 	$('thead th:eq(0)').attr('data-priority', 20000);

		// 	table = $('#example').DataTable({
		// 		responsive: true,
		// 		columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
		// 	});

		// 	checkVisible([false, true, false, false, false, true]);
		// });
		// it('... even if recalculated afterwards', function() {
		// 	table.responsive.rebuild();
		// 	table.responsive.recalc();

		// 	checkVisible([false, true, false, false, false, true]);
		// });
	});

	// describe('Functional tests - responsivePriority', function() {
	// 	dt.html('basic');
	// 	it('Check taken from right by default', function() {
	// 		$('table').wrapAll('<div style="width:250px">');
	// 		table = $('#example').DataTable({
	// 			responsive: true
	// 		});

	// 		checkVisible([true, true, false, false, false, false]);
	// 	});

	// 	dt.html('basic');
	// 	it('High values taken first', function() {
	// 		$('table').wrapAll('<div style="width:250px">');
	// 		table = $('#example').DataTable({
	// 			responsive: true,
	// 			columnDefs: [
	// 				{
	// 					targets: 0,
	// 					responsivePriority: 20000
	// 				}
	// 			]
	// 		});

	// 		checkVisible([false, true, true, true, false, false]);
	// 	});

	// 	dt.html('basic');
	// 	it('Low values taken last', function() {
	// 		$('table').wrapAll('<div style="width:250px">');
	// 		table = $('#example').DataTable({
	// 			responsive: true,
	// 			columnDefs: [
	// 				{
	// 					targets: 5,
	// 					responsivePriority: 1
	// 				}
	// 			]
	// 		});

	// 		checkVisible([true, false, false, false, false, true]);
	// 	});

	// 	dt.html('basic');
	// 	it('Combine low and high', function() {
	// 		$('table').wrapAll('<div style="width:250px">');
	// 		table = $('#example').DataTable({
	// 			responsive: true,
	// 			columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
	// 		});

	// 		checkVisible([false, true, false, false, false, true]);
	// 	});

	// 	dt.html('basic');
	// 	it('Initalise options always take priority over HTML5', function() {
	// 		$('table').wrapAll('<div style="width:250px">');
	// 		$('thead th:eq(0)').attr('data-priority', 20000);

	// 		table = $('#example').DataTable({
	// 			responsive: true,
	// 			columnDefs: [{ targets: 0, responsivePriority: 20000 }, { targets: 5, responsivePriority: 1 }]
	// 		});

	// 		checkVisible([false, true, false, false, false, true]);
	// 	});
	// 	it('... even if recalculated afterwards', function() {
	// 		table.responsive.rebuild();
	// 		table.responsive.recalc();

	// 		checkVisible([false, true, false, false, false, true]);
	// 	});
	// });

});
