describe('Responsive - responsive.details.type', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	dt.html('basic_wide');
	it('Default is inline', function() {
		table = $('#example').DataTable({
			responsive: true
		});
		let el = window.getComputedStyle(document.querySelector('tr td'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('5px');
	});

	dt.html('basic_wide');
	it('Specify inline', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'inline'
				}
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('5px');
	});

	dt.html('basic_wide');
	it('Specify column', function() {
		table = $('#example').DataTable({
			responsive: {
				details: {
					type: 'column'
				}
			}
		});
		let el = window.getComputedStyle(document.querySelector('tr td'), ':before');
		expect(el.getPropertyValue('border-top-width')).toBe('0px');
	});
});
