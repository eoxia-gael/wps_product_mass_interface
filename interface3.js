function addPost( event, element ) {
	var newPost = jQuery( '#inline-edit' ).clone();
	event.preventDefault();
	newPost.show();
	jQuery( element ).addClass( 'hidden' );
	newPost.find( '.cancel' ).click( function() {
		newPost.remove();
		jQuery( element ).removeClass( 'hidden' );
	} );
	newPost.find( 'input[name="post_title"]' ).on( 'keydown', function( e ) {
		if ( e.which == 13 ) {
			e.preventDefault();
			sendPost();
		}
	} );
	newPost.find( '.save' ).click( function() {
		sendPost();
	} );
	sendPostWait = true;
	function sendPost() {
		if ( sendPostWait ) {
			sendPostWait = false;
			newPost.find( '.spinner' ).addClass( 'is-active' );
			title = newPost.find( 'input[name="post_title"]' ).val();
			jQuery.post( ajaxurl, { action: 'wps_mass_3_new', title: title }, function( response ) {
				jQuery( '#the-list' ).prepend( response.data.row );
				jQuery( '.subsubsub' ).html( response.data.subsubsub );
				jQuery( '.tablenav.top' ).prevUntil( '#posts-filter' ).andSelf().html( response.data.tablenav_top );
				jQuery( '.tablenav.bottom' ).html( response.data.tablenav_bottom );
				newPost.remove();
				toMuchRows = response.data.per_page - jQuery( '#the-list > tr' ).length;
				if ( toMuchRows < 0 ) {
					jQuery( '#the-list > tr' ).slice( toMuchRows ).hide();
				}
				jQuery( element ).removeClass( 'hidden' );
				jQuery( '.no-items' ).remove();
				sendPostWait = true;
			} );
		}
	}
	jQuery( '#the-list' ).prepend( newPost );
}

jQuery( document ).on( 'change', '#the-list :input:not(input:checkbox[name^=cb]), #the-list select, #the-list textarea', function() {
	jQuery( this ).closest( 'tr' ).find( 'input:checkbox[name^=cb]' ).prop( 'checked', true );
});

jQuery( document ).on( 'click', '.bulk-save', function() {
	var checkeds = jQuery( '#the-list input:checkbox[name^=cb]:checked' );
	var datas = checkeds.closest( 'tr' ).find( ':input:not(.toggle-row), select, textarea' ).add( '<input type="text" name="action" value="wps_mass_3_save"/>' );
	jQuery( '.bulkactions .spinner' ).addClass( 'is-active' );
	jQuery.post( ajaxurl, datas, function( response ) {
		jQuery( '.bulkactions .spinner' ).removeClass( 'is-active' );
		checkeds.prop( 'checked', false );
		jQuery( ':input[id^=cb-select-all]' ).prop( 'checked', false );
		notice = jQuery( '.hidden.notice' ).clone().addClass( 'notice-success' ).removeClass( 'hidden' );
		notice.find( 'p' ).text( response.data.notice );
		// jQuery( '.hidden.notice' ).after( notice );
		window.location.reload();
	} );
} );

jQuery( document ).on( 'click', '.notice-dismiss', function() {
	jQuery( this ).parent( 'div' ).remove();
} );
