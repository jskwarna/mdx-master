$(document).ready( function() {
  resizeBoxes();
});
$(window).resize( function() {
  resizeBoxes();
});
function resizeBoxes() {
    if( $(window).width() > 678 ) {
        $('.grid > li').height($('.one-quarter').width());
    } else {
        $('.grid > li').height($('.one-quarter').width());
    }
}