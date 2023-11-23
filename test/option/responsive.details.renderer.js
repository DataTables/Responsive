describe('Responsive - responsive.details.renderer', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	describe('Built-in renderers', function() {
		let table;

		dt.html('basic_wide');
		it('listHidden', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						renderer: $.fn.dataTable.Responsive.renderer.listHidden()
					}
				}
			});
			expect($('table').length).toBe(1);
			expect($('tbody tr').length).toBe(10);
		});
		it('Clicking on first column opens child row', function() {
			$('tbody tr td:eq(0)').click();
			expect($('table').length).toBe(1);
			expect($('tbody tr').length).toBe(11);
		});
		it('Clicking on first column closes child row', function() {
			$('tbody tr td:eq(0)').click();
			expect($('table').length).toBe(1);
			expect($('tbody tr').length).toBe(10);
		});

		dt.html('basic_wide');
		it('tableAll', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						renderer: $.fn.dataTable.Responsive.renderer.tableAll()
					}
				}
			});
			expect($('table').length).toBe(1);
			expect($('tbody tr').length).toBe(10);
		});
		it('Clicking on first column opens child row', function() {
			$('tbody tr td:eq(0)').click();
			expect($('table').length).toBe(2);
			expect($('tbody tr').length).toBe(22);
		});
		it('Clicking on first column closes child row', function() {
			$('tbody tr td:eq(0)').click();
			expect($('table').length).toBe(1);
			expect($('tbody tr').length).toBe(10);
		});

		dt.html('basic_wide');
		it('tableAll - set tableClass', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						renderer: $.fn.dataTable.Responsive.renderer.tableAll({
							tableClass: 'unitTest'
						})
					}
				}
			});
			expect($('table').length).toBe(1);
			expect($('table.unitTest').length).toBe(0);
			expect($('tbody tr').length).toBe(10);
		});
		it('Clicking on first column opens child row', function() {
			$('tbody tr td:eq(0)').click();
			expect($('table').length).toBe(2);
			expect($('table.unitTest').length).toBe(1);
			expect($('tbody tr').length).toBe(22);
		});
	});

	describe('Custom renderers', function() {
		let table;
		let args;
		let returnVal = false;

		dt.html('basic_wide');
		it('Arg types as expected', function() {
			table = $('#example').DataTable({
				responsive: {
					details: {
						renderer: function() {
							args = arguments;
							return returnVal;
						}
					}
				}
			});
			$('tbody tr:eq(2) td:eq(0)').click();

			expect(args.length).toBe(3);
			expect(args[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(typeof args[1]).toBe('number');
			expect(args[2] instanceof Array).toBe(true);
			expect(args[2].length).toBe(11);
		});
		it('Arg values as expected', function() {
			expect(args[1]).toBe(2);
			expect(args[2][0].data).toBe('Ashton');
		});
		it('Renders as expected', function() {
			returnVal = "<p class='test'>unitTest</p>";
			$('tbody tr:eq(2) td:eq(0)').click();
			expect($('p.test').text()).toBe('unitTest');
			expect($('tr.child').length).toBe(1);
		});
	});
});
