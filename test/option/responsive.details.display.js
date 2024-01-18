describe('Responsive - responsive.details.display', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	describe('Functional tests - hildRowImmediate (default)', function() {
		dt.html('basic_wide');
		it('Check nothing open originally', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						display: $.fn.dataTable.Responsive.display.childRow
					}
				}
			});
			expect($('tr.child').length).toBe(0);
		});
		it('Open a parent', function() {
			$('tbody tr:eq(2) td:eq(0)').click();
			expect($('tr.child').length).toBe(1);
			expect($('td.child ul li').length).toBe(3);
		});
	});

	describe('Functional tests - childRowImmediate', function() {
		dt.html('basic_wide');
		it('Check all open', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						display: $.fn.dataTable.Responsive.display.childRowImmediate
					}
				}
			});
			expect($('tr.child').length).toBe(10);
		});
		it('Close a parent', function() {
			$('tbody tr:eq(2) td:eq(0)').click();

			expect($('tr.child').length).toBe(9);
			expect($('td.child ul li').length).toBe(27);
		});
	});

	describe('Functional tests - modal', function() {
		dt.html('basic_wide');
		it('Check nothing open originally', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						display: $.fn.dataTable.Responsive.display.modal()
					}
				}
			});
			expect($('tr.child').length).toBe(0);
		});
		it('Open a parent', function() {
			$('tbody tr:eq(2) td:eq(0)').click();
			expect($('div.dtr-modal').length).toBe(1);
			expect($('div.dtr-modal-content ul li').length).toBe(3);
		});
		it('Close a parent', function() {
			$('div.dtr-modal-close').click();
			expect($('div.dtr-modal').length).toBe(0);
			expect($('div.dtr-modal-content ul li').length).toBe(0);
		});
	});

	describe('Functional tests - custom function', function() {
		let args;
		dt.html('basic_wide');
		it('Check nothing open originally', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						display: function(row, update, render) {
							args = arguments;
							if (update) {
								row.child(render(), 'child').show();
								return true;
							} else {
								if (!row.child.isShown()) {
									row.child(render(), 'child').show();
									return true;
								} else {
									row.child(false);
									return false;
								}
							}
						}
					}
				}
			});
			expect($('tr.child').length).toBe(10);
			expect($('td.child ul li').length).toBe(30);
		});
		it('Check arguments', function() {
			expect(args.length).toBe(4);
			expect(args[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(typeof args[1]).toBe('boolean');
			expect(typeof args[2]).toBe('function');
			expect(typeof args[3]).toBe('function');
		});
		it('Close a parent', function() {
			$('tbody tr:eq(2) td:eq(0)').click();
			expect($('tr.child').length).toBe(9);
			expect($('td.child ul li').length).toBe(27);
		});
	});
});
