
(function($, DataTables){

var _display = DataTables.Responsive.display;
var _original = _display.modal;

_display.modal = function ( options ) {
	return function ( row, update, render ) {
		if ( ! $.fn.dialog ) {
			_original( row, update, render );
		}
		else {
			if ( ! update ) {
				$( '<div/>' )
					.append( render() )
					.appendTo( 'body' )
					.dialog( $.extend( true, {
						title: options && options.header ? options.header( row ) : '',
						width: 500
					}, options.dialog ) );
			}
		}
	};
};

})(jQuery, jQuery.fn.dataTable);
