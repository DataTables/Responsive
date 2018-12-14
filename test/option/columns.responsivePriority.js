describe('Responsive - columns.responsivePriority', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'responsive'],
		css: ['datatables', 'responsive']
	});

	let table;

	// can't test until bug fixed

	// dt.html('basic_wide');
	// it('Check taken from left by default', function() {
	// 	table = $('#example').DataTable({
	// 		responsive: true
	// 	});

	// 	// TK COLIN bad test - always seems to have this text
	// 	expect($('thead tr').text()).toBe(
	// 		'First nameLast namePositionOfficeAgeStart dateSalaryExtn.E-mailLine Manager First NameLine Manager Last Name'
	// 	);
	// });

	// dt.html('basic_wide');
	// it('Set priority to first two columns', function() {
	// 	table = $('#example').DataTable({
	// 		responsive: true,
	// 		columnDefs: [{
	// 			responsivePriority: 2, targets: 2
	// 		}]
	// 	});

	// 	// TK COLIN bad test - always seems to have this text
	// 	expect($('thead tr').text()).toBe(
	// 		'First nameLast namePositionOfficeAgeStart dateSalaryExtn.E-mailLine Manager First NameLine Manager Last Name'
	// 	);
	// });

});
