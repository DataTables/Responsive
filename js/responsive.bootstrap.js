
(function($, DataTables){

var _display = DataTables.Responsive.display;
var _original = _display.modal;

_display.modal = function ( options ) {
	return function ( row, update, render ) {
		if ( ! $.fn.modal ) {
			_original( row, update, render );
		}
		else {
			if ( ! update ) {
				var modal = $(
					'<div class="modal fade" role="dialog">'+
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

				if ( options && options.header ) {
					modal.find('div.modal-header')
						.append( '<h4 class="modal-title">'+options.header( row )+'</h4>' );
				}

				modal.find( 'div.modal-body' ).append( render() );
				modal
					.appendTo( 'body' )
					.modal();
			}
		}
	};
};

})(jQuery, jQuery.fn.dataTable);
