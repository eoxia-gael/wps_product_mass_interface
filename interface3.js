function addPost( event, element ) {
	//Console.log( jQuery( '.tablenav.top' ).prevUntil( '.search-box' ).andSelf().html( '' ) );
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
				jQuery( '.tablenav.top' ).prevUntil( '.search-box' ).andSelf().html( response.data.tablenav_top );
				jQuery( '.tablenav.bottom' ).html( response.data.tablenav_bottom );
				newPost.remove();
				toMuchRows = response.data.per_page - jQuery( '#the-list > tr' ).length;
				if ( toMuchRows < 0 ) {
					jQuery( '#the-list > tr' ).slice( toMuchRows ).hide();
				}
				jQuery( element ).removeClass( 'hidden' );
				sendPostWait = true;
			} );
		}
	}
	jQuery( '#the-list' ).prepend( newPost );
}

jQuery( document ).on( 'change', '#the-list :input, #the-list select, #the-list textarea', function() {
	jQuery( this ).closest( 'tr' ).children( 'th.check-column' ).children( 'input[type=checkbox]' ).prop( 'checked', true );
});
