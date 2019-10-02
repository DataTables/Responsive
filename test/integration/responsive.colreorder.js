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
		expect($('ul li').length).toBe(3);
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
	});
	it('Move a row and check table headers', function() {
		table.colReorder.move(0, 10);

		expect($('thead th:visible').text()).toBe('Last namePositionOfficeAgeStart dateSalaryExtn.');
	});
	it('... and child rows of open child', function() {
		expect($('ul li').length).toBe(4);
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
		expect($('ul li:nth-child(4) span:eq(0)').text()).toBe('First name');
	});
	it('... and a new child rows', function() {
		$('tbody tr:eq(3) td:eq(0)').click();
		expect($('ul li').length).toBe(4);
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
		expect($('ul li:nth-child(4) span:eq(0)').text()).toBe('First name');
	});
	it('Change order with colReorder.order()', function() {
		table.colReorder.order([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]);
		expect($('thead th:visible').text()).toBe('PositionOfficeAgeStart dateSalaryExtn.E-mail');
	});
	it('... and child rows of open child', function() {
		expect($('ul li').length).toBe(4);
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager Last Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('First name');
		expect($('ul li:nth-child(4) span:eq(0)').text()).toBe('Last name');
	});
	it('And then reset back to the original', function() {
		table.colReorder.order([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true);
		expect($('thead th:visible').text()).toBe('First nameLast namePositionOfficeAgeStart dateSalaryExtn.');
	});
	it('... and child rows of open child', function() {
		expect($('ul li').length).toBe(3);
		expect($('ul li:nth-child(1) span:eq(0)').text()).toBe('E-mail');
		expect($('ul li:nth-child(2) span:eq(0)').text()).toBe('Line Manager First Name');
		expect($('ul li:nth-child(3) span:eq(0)').text()).toBe('Line Manager Last Name');
	});
});
