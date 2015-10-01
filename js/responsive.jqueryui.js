/*! jQuery UI integration for DataTables' Responsive
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables', 'datatables-responsive'], factory );
	}
	else if ( typeof exports === 'object' ) {
		// Node / CommonJS
		module.exports = function ($, dt) {
			if ( ! $ ) { $ = require('jquery'); }
			factory( $, dt || $.fn.dataTable || require('datatables') );
		};
	}
	else if ( jQuery ) {
		// Browser standard
		factory( jQuery, jQuery.fn.dataTable );
	}
}(function( $, DataTable ) {
'use strict';


var _display = DataTable.Responsive.display;
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


}));
