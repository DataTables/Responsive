import DataTable, { Context } from 'datatables.net';
import Responsive from './Responsive';

const Api = DataTable.Api;
const dom = DataTable.dom;
const util = DataTable.util;

Api.register('responsive()', function () {
	return this.inst(this.context);
});

Api.register('responsive.index()', function (li) {
	li = dom.s(li);

	return {
		column: li.data('dtr-index'),
		row: li.parent().data('dtr-index')
	};
});

Api.register('responsive.rebuild()', function () {
	return this.iterator('table', function (ctx) {
		if (ctx._responsive) {
			ctx._responsive._classLogic();
		}
	});
});

Api.register('responsive.recalc()', function () {
	return this.iterator('table', function (ctx) {
		if (ctx._responsive) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	});
});

Api.register('responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive
		? ctx._responsive._responsiveOnlyHidden().includes(false)
		: false;
});

Api.registerPlural(
	'columns().responsiveHidden()',
	'column().responsiveHidden()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				return settings._responsive
					? settings._responsive._responsiveOnlyHidden()[column]
					: false;
			},
			true
		);
	}
);

DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
dom.s(document).on('preInit.dt.dtr', function (e, settings: Context, json) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (
		dom.s(settings.table).classHas('responsive') ||
		dom.s(settings.table).classHas('dt-responsive') ||
		settings.init.responsive ||
		DataTable.defaults.responsive
	) {
		var init = settings.init.responsive;

		if (init !== false) {
			new Responsive(settings, util.is.plainObject(init) ? init : {});
		}
	}
});
