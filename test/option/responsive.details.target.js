describe('Responsive - responsive.details.target', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	dt.html('basic_wide');
	it('Has no effect with inline', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'inline',
					target: 1
				}
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('5px');
	});
	it('Clicking on first column opens child row', function() {
		$('tbody tr td:eq(0)').click();
		expect($('tbody tr').length).toBe(11);
	});

	dt.html('basic_wide');
	it('Target specified within columnDefs', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'column'
				}
			},
			columnDefs: [
				{
					targets: 1,
					className: 'control'
				}
			]
		});
		let el = window.getComputedStyle(document.querySelector('tr td:nth-child(2)'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('5px');
	});

	dt.html('basic_wide');
	it('Target only within details - no control icon', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'column',
					target: 1
				}
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td:nth-child(2)'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('0px');
		expect($('tbody tr').length).toBe(10);
	});
	it('Clicking first column does nothing', function() {
		$('tbody tr td:eq(0)').click();
		expect($('tbody tr').length).toBe(10);
	});
	it('Clicking second column opens child rows', function() {
		$('tbody tr td:eq(1)').click();
		expect($('tbody tr').length).toBe(11);
	});
	it('Clicking again second column closes child rows', function() {
		$('tbody tr td:eq(1)').click();
		expect($('tbody tr').length).toBe(10);
	});

	dt.html('basic_wide');
	it('Target can be a row', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'column',
					target: 'tr'
				}
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td:nth-child(2)'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('0px');
		expect($('tbody tr').length).toBe(10);
	});
	it('Clicking on first column opens child row', function() {
		$('tbody tr td:eq(0)').click();
		expect($('tbody tr').length).toBe(11);
	});
	it('Clicking second column closes child rows', function() {
		$('tbody tr td:eq(1)').click();
		expect($('tbody tr').length).toBe(10);
	});
});
