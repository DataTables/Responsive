/*! Bootstrap integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal = $(
	'<div class="modal fade dtr-bs-modal" role="dialog">'+
		'<div class="modal-dialog" role="document">'+
			'<div class="modal-content">'+
				'<div class="modal-header">'+
					'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				'</div>'+
				'<div class="modal-body"/>'+
			'</div>'+
		'</div>'+
	'</div>'
);

_display.modal = function ( options ) {
	return function ( row, update, render, closeCallback ) {
		if ( ! $.fn.modal ) {
			return _original( row, update, render, closeCallback );
		}
		else {
			if ( ! update ) {
				if ( options && options.header ) {
					var header = _modal.find('div.modal-header');
					var button = header.find('button').detach();
					
					header
						.empty()
						.append( '<h4 class="modal-title">'+options.header( row )+'</h4>' )
						.prepend( button );
				}

				_modal.find( 'div.modal-body' )
					.empty()
					.append( render() );

				_modal
					.one('hidden.bs.modal', closeCallback)
					.appendTo( 'body' )
					.modal();
			}

			return true;
		}
	};
};
