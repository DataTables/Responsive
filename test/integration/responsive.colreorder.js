describe('Responsive - responsive.colreorder', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive', 'colreorder'],
		css: ['datatables', 'responsive', 'colreorder']
	});

	let table;

	dt.html('basic_wide');
	it('Confirm initial setup', function() {
		table = $('#example').DataTable({
			responsive: true,
			colReorder: true
		});
		expect($('thead th:visible').text()).toBe('First nameLast namePositionOfficeAgeStart dateSalaryExtn.');
	});
	it('Open a child', function() {
		$('tbody tr:eq(2) td:eq(0)').click();
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
	});
	// TK COLIN
	// failing due to jira DD-757
	// it('Move a row and check table headers', function() {
	// 	table.colReorder.move(0,10);
	// 	//table.draw();
	// 	expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
	// 	expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
	// });
	// it('and child rows of open child', function() {
	// });
	// it('and a new child rows', function() {
	// });	
	// it('Change order with colReorder.order()', function() {
	// });	
	// it('And then reset back to the original', function() {
	// });
	// it('Do a subset of these when responsivePriority is set', function() {
	// });
});
