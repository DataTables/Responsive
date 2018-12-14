describe('Responsive - responsive.details', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	dt.html('basic_wide');
	it('Has no effect with inline', function() {
		table = $('#example').DataTable({
			responsive: {
				details: false
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td'), ':before');
		expect(el.getPropertyValue('content')).toBe('none');
	});
	it('Clicking first column does nothing', function() {
		$('tbody tr td:eq(0)').click();
		expect($('tbody tr').length).toBe(10);
	});
});
