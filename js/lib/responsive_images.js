/*
*
*	Table of contents:
*
*	1. Functions
*		1.1 Display info obj
*		1.9 Multi images	
*
*	2. Document ready
*		2.1 Window resize and orientation change
*			2.1.1 Get display info on resize
*			2.1.2 Create multi images
*		2.2 Get info for display
*		2.3 Create multi images
*
*	3. Window load
*		3.1 Get info for display
*		3.4 Multi images on window load
*
*	4. Scroll
*		4.1 Change display object offset
*
*/

/*** 1. Functions ***/

/* 1.1 Display info obj */
var display = new Object();
var get_display = function() {
	
	display.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	display.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	display.offset_top = $('body').scrollTop();

	if ( parseInt($('#display_helper').css('width'), 10) == 1 ) {
		display.type = "large_desktop";
	} else if ( parseInt($('#display_helper').css('width'), 10) == 2 ) {
		display.type = "desktop";
	} else if ( parseInt($('#display_helper').css('width'), 10) == 3 ) {
		display.type = "tablet_v";
	} else if ( parseInt($('#display_helper').css('width'), 10) == 4 ) {
		display.type = "tablet_p";
	} else if ( parseInt($('#display_helper').css('width'), 10) == 5 ) {
		display.type = "phone";
	} else {
		display.type = "unknown";
	}

	//console.log('---');
}

/* 1.9 Multi images */
var multi_images = function(){

	var wrapper_height = 0;
	var class_value = '';
	var style= '';
	var offset = '';
	if ( display.type == 'large_desktop') { class_value = "hide_phone hide_tablet_v hide_tablet_p hide_desktop show_large_desktop"; }
	if ( display.type == 'desktop') { class_value = "hide_phone hide_tablet_v hide_tablet_p hide_large_desktop show_desktop "; }
	if ( display.type == 'tablet_v') { class_value = "hide_phone hide_tablet_p hide_desktop hide_large_desktop show_tablet_v "; }
	if ( display.type == 'tablet_p') { class_value = "hide_phone hide_tablet_v hide_desktop hide_large_desktop show_tablet_p ";}
        if ( display.type == 'phone') { class_value = "hide_phone hide_tablet_v hide_desktop hide_large_desktop show_phone ";}

	// Create images
	if ( $('.multi-image').length ) {
		$('.multi-image').each(function(){

			style = "";
			if ( typeof($(this).parents('.multi-images').attr('data-offset')) != 'undefined' && parseInt($(this).parents('.multi-images').attr('data-offset'), 10) > 0 ) {
				// Change % offset to px
				wrapper_height = $(this).parents('.multi-images').parent().height();
				offset = parseInt(($(this).attr('data-height')/100)*parseInt($(this).parents('.multi-images').attr('data-offset'),10)-wrapper_height, 10);
				$(this).attr('data-offset', offset);

				// Apply offset and create images		
				style += 'margin-top: -'+$(this).attr('data-offset')+'px;';
			}

			if ( $(this).parents('.multi-images').attr('data-center') == 'true' ) {
				style += 'margin-left: '+((parseInt($(this).attr('data-width'))-display.width)/2)*(-1)+'px';
			}

			if ( $(this).attr('data-display') == display.type ) {
				if ( style != '' ) {
					$(this).after('<img src="'+$(this).attr('data-src')+'" alt="'+$(this).parents('.multi-images').attr('data-alt')+'" class="'+class_value+'" style="'+style+'"/>');
				} else {
					$(this).after('<img src="'+$(this).attr('data-src')+'" alt="'+$(this).parents('.multi-images').attr('data-alt')+'" class="'+class_value+'" />');
				}
				$(this).remove();
			}
		});	
	}

	// Center images on resize
	if ( $('.multi-images img').length ) {
		$('.multi-images img').each(function(){
			if ( $(this).parents('.multi-images').attr('data-center') == 'true' ) {
				$(this).css('margin-left',((parseInt($(this).width())-display.width)/2)*(-1)+'px');
			}
		});
	}
}

/*** 2. Document ready ***/
$(document).ready(function(){

	// 2.1 Window resize and orientation change
	var on_window_change = function() {


		// 2.1.1 Get display info on resize
		get_display();

		// 2.1.2 Creata multi images 
		multi_images();

	}

	var on_orientation_change = function() {
		switch(window.orientation) 
	    {  
	      case -90:
	      case 90:
	        on_window_change();
	        break; 
	      default:
	        on_window_change();
	        break; 
	    }
	}

	$(window).resize(function() {
		on_window_change();
	});
	
	if ( window.addEventListener) { 
		window.addEventListener('orientationchange', on_orientation_change); 
	}

	// 2.2 Get info for display
	get_display();

	// 2.3 Creata multi images  
	multi_images();

});

/*** 3. Window load ***/
$(window).load(function(){

	// 3.1 Get info for display
	get_display();

	// 3.4 Multi images on window load
	multi_images();

});

/*** 4. Scroll ***/
$('body').scroll(function(){ 
	 
	// 4.1 Change display object offset
	display.offset_top = $('body').scrollTop();

});