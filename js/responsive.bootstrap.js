/*! Bootstrap integration for DataTables' Responsive
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-responsive'], factory );
	}
	else if ( typeof exports === 'object' ) {
		// Node / CommonJS
		module.exports = function ($) {
			if ( ! $ ) { $ = require('jquery'); }
			if ( ! $.fn.dataTable ) { require('datatables.net-bs')($); }
			if ( ! $.fn.dataTable.AutoFill ) { require('datatables.net-responsive')($); }

			factory( $ );
		};
	}
	else {
		// Browser
		factory( jQuery );
	}
}(function( $ ) {
'use strict';
var DataTable = $.fn.dataTable;


var _display = DataTable.Responsive.display;
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


return DataTable.Responsive;
}));
