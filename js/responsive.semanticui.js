/*! Bootstrap integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal = $(
	'<div class="ui modal" role="dialog">'+
		'<div class="header">'+
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
		'</div>'+
		'<div class="content"/>'+
	'</div>'
);

_display.modal = function ( options ) {
	return function ( row, update, render ) {
		if ( ! $.fn.modal ) {
			_original( row, update, render );
		}
		else {
			if ( ! update ) {
				if ( options && options.header ) {
					_modal.find('div.header')
						.empty()
						.append( '<h4 class="title">'+options.header( row )+'</h4>' );
				}

				_modal.find( 'div.content' )
					.empty()
					.append( render() );

				// Only need to attach the first time
				if (! _modal.parent().hasClass('dimmer')) {
					_modal.appendTo( 'body' )
				}

				_modal.modal('show');
			}
		}
	};
};
