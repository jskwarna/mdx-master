/*
 *     Middlesex University - JavaScript
 *     @author Tomasz Rembacz (Squiz)
 *     -----------------------------------------------
 *
 *
 *     1. Modules
 *       1.1 Announcement Bar
 *       1.2 Saved Pages
 *       1.3 Tabs
 *       1.4 Responsive Navigation
 *       1.5 Gallery Component
 *       1.6 Cookies notification
 *       1.7 Share widget
 *       1.8 Promotional sliders + lightbox
 *       1.9 Showcase lightbox
 *       1.10 Sticky navigation
 *       1.11 RWD Image Maps
 *       1.12 Form inputs
 *       1.13 KIS widget - On resize 
 *       1.14 MegaMenu
 *       1.15 Funnelback Main Search - AJAX
 *       1.16 Funnelback Related Results - AJAX
 *       1.17 Positioning components on home page
 *       1.18 Positioning components on course page
 *       1.19 Sitewide search - query change
 *       1.20 Calendar - Events Page
 *       1.21 Gap between components: departments, business and knowledge
 *       1.22 Share button on mobile
 *       1.23 Border color on black tabs when mouse enter on li
 *       1.24 Map our campuses collapse on mobile
 *       1.25 Funnelback AZ Results - AJAX  
 *       1.26 Upcoming Events - Matrix Items - AJAX 
 *       1.27 A-Z Listing - changing letters, hide/show content
 *       1.28 Hide components if no results
 *       1.29 Search page - Filters
 *       1.30 Funnelback autocomplete + typeahead
 *       1.31 Gallery - Pausing players 
 *
 *
 *     2. On window load
 *     3. On window resize
 *     4. Document ready
 *
 *
 *     5. Functions
 *       5.1 Get Parameter 
 *       5.2 Tabs scrolling 
 *       5.x  
 *
 *
 */

/*
 --------------------
 1. Modules
 --------------------
 */

/* -- 1.1 Announcement Bar -- */

var announcement = {
    setState: function(){
        jQuery('.announcement-close').click(function(){
            jQuery.cookie("announcement_info", "off", { path: '/' });
            jQuery('.announcements-wrapper').parent('section').hide();
            return false;
        });
    },
    checkState: function(){
        if ( jQuery.cookie("announcement_info") == undefined ){
            jQuery('.announcements-wrapper').show();
        }
    },
    init: function(){
        if ( jQuery('.announcements-wrapper').length > 0){
            announcement.setState();
            announcement.checkState();
        }
    }
};

/* -- 1.2 Saved Pages -- */

var saved_pages = {

    config: function(){
        jQuery.cookie.json = true;
    },

    checkState: function() {
        var current_id = jQuery('.page-save').attr('data-id');


        if (jQuery.cookie('pages') == undefined){
            var pages_null = { "page": { "id": [] }};
            jQuery.cookie('pages', pages_null, { expires: 355, path: '/' });
            jQuery('.saved-pages-number').text('0');
        }
        else {
            var saved = jQuery.cookie('pages');
            for(var k in saved.page.id) {
                if (saved.page.id[k]['id'] == current_id) {
                    jQuery('.page-save').addClass('saved');
                }
            }

            jQuery('.middle-showcase li.showcase-item').each(function(){
                var showcase_id = jQuery(this).attr('id');
                for(var k in saved.page.id) {
                    if (saved.page.id[k]['id'] == showcase_id) {
                        jQuery(this).find('.favourite').addClass('active');
                    }
                }
            });

            jQuery('.saved-pages-number').text(saved.page.id.length);
        }

        jQuery('.page-save').click(function(){
            var thisEl = jQuery(this);

            var saved = jQuery.cookie('pages');
            var current_id = thisEl.attr('data-id');
            var item_name = thisEl.attr('data-name');
            var item_url = thisEl.attr('data-url');

            if ( thisEl.hasClass('saved') ) {

                // remove page
                for(var k in saved.page.id) {
                    if (saved.page.id[k]['id'] == current_id) {
                        saved.page.id.splice(k, 1);
                        jQuery.cookie('pages', saved, { expires: 355, path: '/' });

                        if (thisEl.hasClass('course-save-button')) {
                            jQuery('.tabbed-content li').find('.page-save').removeClass('saved');
                        } else {
                            thisEl.removeClass('saved');
                        }
                    }
                }
                saved_pages.createList();
                jQuery('.saved-pages-number').text(saved.page.id.length);

            }
            else {

                // save page
                if (saved.page.id.length > 9) {
                    alert('You can save max 10 pages');
                } else {
                    saved.page.id.push({'id': current_id, 'name': item_name, 'url': item_url});
                    jQuery.cookie('pages', saved, { expires: 355, path: '/' });

                    if (thisEl.hasClass('course-save-button')) {
                        jQuery('.tabbed-content li').find('.page-save').addClass('saved');
                    } else {
                        thisEl.addClass('saved');
                    }
                    jQuery('.saved-pages-number').text(saved.page.id.length);
                    saved_pages.createList();
                }
            }
        });

        jQuery('.favourite').click(function(e){
            e.preventDefault();
            var thisEl = jQuery(this);
            var saved = jQuery.cookie('pages');
            var current_id = thisEl.attr('data-id');
            var item_name = thisEl.attr('data-name');
            var item_url = thisEl.attr('data-url');

            if ( thisEl.hasClass('active') ) {

                // remove page
                for(var k in saved.page.id) {
                    if (saved.page.id[k]['id'] == current_id) {
                        saved.page.id.splice(k, 1);
                        jQuery.cookie('pages', saved, { expires: 355, path: '/' });
                        thisEl.removeClass('active');
                    }
                }
                jQuery('.saved-pages-number').text(saved.page.id.length);
                saved_pages.createList();
            }
            else {
                // save page
                if (saved.page.id.length > 9) {
                    alert('You can save max 10 pages');
                } else {
                    saved.page.id.push({'id': current_id, 'name': item_name, 'url': item_url});
                    jQuery.cookie('pages', saved, { expires: 355, path: '/' });
                    thisEl.addClass('active');
                    jQuery('.saved-pages-number').text(saved.page.id.length);
                    saved_pages.createList();
                }
            }
        });
    },

    createList: function(){

        jQuery('.saved-elements-list').html('');
        jQuery('.saved-elements-message').remove();

        var saved = jQuery.cookie('pages');
        var id = "";
        var name = "";
        var url = "";

        for(var k in saved.page.id) {
            id = saved.page.id[k]['id'];
            name = saved.page.id[k]['name'];
            url = saved.page.id[k]['url'];

            jQuery('.saved-elements-list').append('<li><a href="'+url+'">'+name+'</a><span data-id="'+ id +'" class="delete"></span></li>');
        }
    },

    button: function(){

        jQuery(document).on({
            click: function(e){
                e.preventDefault();

                var saved = jQuery.cookie('pages');
                if ((saved.page.id.length === 0) && (jQuery('.saved-elements-message').length === 0)) {
                    jQuery('.saved-elements').prepend('<p class="saved-elements-message">You have no saved pages</p>');
                    //    jQuery('.saved-elements-message').html('You have no saved pages');
                } else {
                    jQuery('.saved-elements-message').remove();
                    saved_pages.createList();
                }
                jQuery('.saved-elements').toggle();
            }
        }, '.saved-pages > span, .saved-pages .arrow, .saved-pages .saved-pages-number, .saved-elements-close');

    },

    removeButton: function(){

        jQuery(document).on({
            click: function(e){
                e.preventDefault();

                var saved = jQuery.cookie('pages');
                var current_id = jQuery(this).attr('data-id');

                for(var k in saved.page.id) {
                    if (saved.page.id[k]['id'] == current_id) {
                        saved.page.id.splice(k, 1);
                        jQuery.cookie('pages', saved, { expires: 355, path: '/' });
                        jQuery(this).parent().remove();
                        jQuery('body').find("[data-id='" + current_id + "']").removeClass('active').removeClass('saved');
                    }
                }
                if (saved.page.id.length === 0) {
                    jQuery('.saved-elements').prepend('<p class="saved-elements-message">You have no saved pages</p>');
                    jQuery('.saved-elements-list').html('');
                    //  jQuery('.saved-elements-message').html('You have no saved pages');
                }
                jQuery('.saved-pages-number').text(saved.page.id.length);
            }
        }, '.saved-elements-list li span.delete');

    },

    init: function(){
        saved_pages.config();
        saved_pages.checkState();
        saved_pages.createList();
        saved_pages.button();
        saved_pages.removeButton();
    }

};


/* -- 1.3 Tabs -- */

var tabs = {

    action: function(){
        var tabContent = null;
        jQuery('.tabbed-navigation a').on('click', function(e){
            e.preventDefault();
            var pageName = window.location.href;
            pageName = pageName.replace("_nocache","").replace("_recache","");

            var tab_id = jQuery(this).attr('data-tab');
            // if analytics is added track tabs
            if (window.ga) {
                tabs.trackTabEvent(jQuery(this).find("span").text(), pageName);
            }


            jQuery('.tabbed-navigation li').removeClass('active');
            jQuery(this).parent().addClass('active');
            jQuery('.tabbed-content li').removeClass('active');

            tabContent = jQuery(".tabbed-content").find("[data-tab='"+ tab_id +"']");
            tabContent.addClass('active');
            if ((tabContent.is(":visible") === true) && (tabContent.find("ul.slides").length > 0)){ // fix for flexSlider issue on hidden cards
                tabContent.find(".carousel-container").resize();
                tabContent.find(".carousel-navigation").resize();
            }
        });
    },

    fav_tab: function(){
        if (getParam(location.href,'tab')) {
            var fav_tab = getParam(location.href,'tab');
            jQuery('.tabbed-navigation li, .tabbed-content li').removeClass('active');
            jQuery('.tabbed-navigation li').find("[data-tab-name='" + fav_tab + "']").parent().addClass('active');
            jQuery('.tabbed-content').find("[data-tab-name='" + fav_tab + "']").addClass('active');
        }
    },

    scrolling_tabs: function(){
        if (jQuery(window).width() > 800) {

            var tab_w = 0;

            if (jQuery('.tabbed-navigation li').length > 0) {
                jQuery('.tabbed-navigation li').each(function() { tab_w = tab_w + jQuery(this).width(); });

                var active_width = jQuery('.tabbed-navigation li.active').width()+2;
                var active_pos_arr = jQuery('.tabbed-navigation li.active').position('left');
                if (typeof active_pos_arr !== "undefined") {
                    var active_pos = Math.round(active_pos_arr.left);
                    var active_box = active_width + active_pos;
                }
                var tab_box = jQuery('.tabbed-menu-scroll').width();
                if (tab_box <= tab_w) {
                    jQuery('.tabbed-navigation').width(tab_w+3);
                    jQuery('.tabbed-menu-scroll').addClass('scroll-on');
                    if (!jQuery('.tab-forward').length) {
                        var tab_arrows = '<span class="tab-back"></span><span class="tab-forward"></span>';
                        jQuery('.box-scroll').prepend(tab_arrows);
                        jQuery('.tab-forward').unbind();
                        jQuery('.tab-back').unbind();
                        jQuery('.tab-forward').mousedown(scroll_forward).mouseup(stopScrolling);
                        jQuery('.tab-back').mousedown(scroll_back).mouseup(stopScrolling);
                    }
                } else {
                    jQuery('.tab-forward').remove();
                    jQuery('.tab-back').remove();
                    jQuery('.tabbed-menu-scroll').removeClass('scroll-on');
                    jQuery('.tabbed-navigation').width('');
                }


            }
        } else {
            jQuery('.tab-forward').remove();
            jQuery('.tab-back').remove();
            jQuery('.tabbed-menu-scroll').removeClass('scroll-on');
            jQuery('.tabbed-navigation').width('');
        }
    },
    trackTabEvent: function(tabName, pageName){
        ga('send', 'event', 'Tab', 'click', tabName+ ": " + pageName);
    },
    init: function(){
        tabs.action();
        if (!jQuery('body').hasClass('profile')) {
            tabs.scrolling_tabs();
        }
        //tabs.scrolling_tabs();
        tabs.fav_tab();
    }

};

/* -- 1.4 Responsive Navigation -- */

var mobile_navigation = {

    action: function(){

        var page_container = jQuery('.page-container');
        var mobile_nav = jQuery('.mobile-nav');

        mobile_nav.css('right', '-240px');

        jQuery(".show-mobile-nav-icon, .navigation-close").click(function(){
            if (jQuery('.show-mobile-nav-icon').hasClass('active')) {
                page_container.animate({ left: '+=240' }, 500, function() { mobile_nav.hide(); });
                mobile_nav.animate({ right: '-=240' }, 500);
                jQuery('.show-mobile-nav-icon').removeClass('active');
            } else {
                page_container.animate({ left: '-=240' }, 500);
                mobile_nav.show().animate({ right: '+=240' }, 500);
                jQuery('.show-mobile-nav-icon').addClass('active');
            }
        });

        jQuery(window).resize(function () {
            var page_w = window.innerWidth || jQuery(window).width();

            //var page_w = jQuery(window).width();
            mobile_navigation.resize(page_container, mobile_nav, page_w);
            // sticky search bar width fix
            //var searchBarWidth = jQuery('.search-and-saved-wrapper').width();
            //jQuery('.search-and-saved').width(searchBarWidth); 
        });
    },

    resize: function(p_cont, m_nav, p_width){

        if (p_width < 769 && jQuery('.show-mobile-nav-icon').hasClass('active') ) {
            p_cont.css('left', '-240px');
            m_nav.css('right', '0px').show();
        } else {
            m_nav.hide();
            p_cont.css('left', '0');
        }
    },

    init: function(){
        mobile_navigation.action();
    }
};

/* -- 1.5 Gallery Component -- */

var gallery_component = {

    create: function(){

        if (jQuery('.carousel-container').length > 0) {

            jQuery('.carousel-container').each(function(){

                var gid = jQuery(this).attr('data-id');
                var g_cont = '.g-cont_'+gid;
                var g_nav = '.g-nav_'+gid;
                jQuery(this).find('.carousel-content').addClass('g-cont_'+gid);
                jQuery(this).find('.carousel-navigation').addClass('g-nav_'+gid);


                jQuery(g_cont).flexslider({
                    animation: "fade",
                    controlNav: false,
                    directionNav: false,
                    slideshow: false,
                    //video: true,
                    animationLoop: false,
                    sync: g_nav,
                    before: function(slider){
                        // $( slider.slides.eq(slider.currentSlide).find('iframe').attr('id') ).api('pause');
                        // $(player).api('pause');
                    }
                    /*
                     after: function(slider){
                     jQuery(this).find(g_nav+' ul li').removeClass('active');
                     jQuery(this).find(g_nav+' ul li').eq(slider.currentSlide).addClass('active');
                     }
                     */
                });

                jQuery(g_nav).flexslider({
                    animation: "slide",
                    controlsContainer: g_nav,
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemMargin: 0,
                    //  move: 1,
                    //  minItems: 1,
                    maxItems: 3,
                    itemWidth: jQuery(this).find(g_nav+' li').width(),
                    asNavFor: g_cont
                });

            });
        }
    },

    touchEvent: function(){

        jQuery(".carousel-content").swipe( {
            swipe:function(event, direction, distance, duration, fingerCount) {
                var current_slider = '.g-cont_'+(jQuery(this).parents('.carousel-container').attr('data-id'));
                if (direction == 'left') {
                    jQuery(current_slider).flexslider("next");
                } else if (direction == 'right') {
                    jQuery(current_slider).flexslider("prev");
                }
            },
            threshold:10
        });

    },

    init: function() {
        gallery_component.create();
        gallery_component.touchEvent();
    }
};

/* -- 1.6 Cookies notification -- */

var cookies_notification = {
    setState: function(){
        jQuery('.cookies-wrapper .continue').click(function(){
            jQuery.cookie("cookies_info", "off", { expires: 355, path: '/' });
            jQuery('.cookies-wrapper').hide();
            return false;
        });
    },
    checkState: function(){
        if ( jQuery.cookie("cookies_info") == undefined ){
            jQuery('.cookies-wrapper').show();
        }
    },
    init: function(){
        cookies_notification.setState();
        cookies_notification.checkState();
    }
};

/* -- 1.7 Share widget -- */


var share_widget = {

    action: function(){
        jQuery('.share-container').hover(function() {
            jQuery(this).stop(true,false).animate({ width: '95px'}, 500); }, function(){
            jQuery(".share-container").stop(true,false).animate({width: "35px"}, 500);
        });
    },

    init: function(){
        share_widget.action();
    }

};

/* -- 1.8 Promotional sliders + lightbox -- */

var promo_sliders = {

    colorboxAmount: "Slide {current} of {total}",

    setColorboxTitle: function() {
        var cbox_title = jQuery(this).find('.promo-area-text').text();
        return cbox_title;
    },

    promotional: function(){

        if (jQuery('.promotional').length > 0) {

            jQuery('.promotional').each(function(){

                var pid = jQuery(this).attr('data-id');
                var p_cont = '.promo-slider_'+pid;

                var max_popup_w =  (jQuery(window).width() < 480) ? '95%' : '50%';
                var max_popup_h = (jQuery(window).width() < 480) ? '95%' : '65%';
                var inner_popup_w = (jQuery(window).width() < 480) ? '95%' : '50%';
                var inner_popup_h = (jQuery(window).width() < 480) ? '95%' : '65%';

                jQuery(p_cont).flexslider({
                    animation: "slide",
                    directionNav: true,
                    controlNav: false,
                    minItems: 1,
                    rel: pid,
                    smoothHeight: false,
                    animationLoop: false,
                    slideshow: false
                });

                jQuery(p_cont+' .image').colorbox({
                    animation: "slide",
                    title: promo_sliders.setColorboxTitle,
                    current: promo_sliders.colorboxAmount,
                    rel: pid,
                    inline: true,
                    smoothHeight: false,
                    animationLoop: false,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h
                });

                jQuery(p_cont+' .youtube, '+ p_cont + ' .vimeo').colorbox({
                    animation: "slide",
                    title: promo_sliders.setColorboxTitle,
                    current: promo_sliders.colorboxAmount,
                    rel: pid,
                    iframe: true,
                    video: true,
                    smoothHeight: false,
                    animationLoop: false,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h,
                    innerWidth: inner_popup_w,
                    innerHeight: inner_popup_h
                });

                jQuery(p_cont+' .flow-video').colorbox({
                    animation: "slide",
                    title: promo_sliders.setColorboxTitle,
                    current: promo_sliders.colorboxAmount,
                    rel: pid,
                    inline: true,
                    smoothHeight: false,
                    animationLoop: false,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h,
                    innerWidth: inner_popup_w,
                    innerHeight: inner_popup_h
                });

            });

        }
    },

    init: function() {
        promo_sliders.promotional();
    }

};

/* -- 1.9 Showcase lightbox -- */

var showcase_component = {

    showcaseAmount: "{current} of {total}",

    setShowcaseTitle: function() {
        var cbox_title = jQuery(this).find('.item-content').text();
        return cbox_title;
    },

    action: function(){

        if (jQuery('.showcase_component').length > 0) {

            jQuery('.showcase_component').each(function(){

                var sid = jQuery(this).attr('data-id');
                var s_cont = '.showcase_'+sid;
                var type_value = (jQuery('.showInMenu .typeOne').hasClass('selected')) ? 'SQ_LINK_TYPE_1' : 'SQ_LINK_TYPE_2';

                var max_popup_w =  (jQuery(window).width() < 480) ? '95%' : '50%';
                var max_popup_h = (jQuery(window).width() < 480) ? '95%' : '65%';
                var inner_popup_w = (jQuery(window).width() < 480) ? '95%' : '50%';
                var inner_popup_h = (jQuery(window).width() < 480) ? '95%' : '65%';

                jQuery(s_cont+' ul li a.image').colorbox({
                    title: showcase_component.setShowcaseTitle,
                    current: showcase_component.showcaseAmount,
                    rel: sid,
                    inline: true,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h
                });

                jQuery(s_cont+' ul li a.youtube, '+ s_cont + ' ul li a.vimeo').colorbox({
                    title: showcase_component.setShowcaseTitle,
                    current: showcase_component.showcaseAmount,
                    rel: sid,
                    iframe: true,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h,
                    innerWidth: inner_popup_w,
                    innerHeight: inner_popup_h
                });

                jQuery(s_cont+' ul li a.flow-video').colorbox({
                    title: showcase_component.setShowcaseTitle,
                    current: showcase_component.showcaseAmount,
                    rel: sid,
                    inline: true,
                    maxWidth: max_popup_w,
                    maxHeight: max_popup_h,
                    innerWidth: inner_popup_w,
                    innerHeight: inner_popup_h
                });

            });
        }
    },

    init: function() {
        showcase_component.action();
    }

};

/* -- 1.10 Sticky navigation -- */

var sticky_menu = {

    action: function() {

        var announce_h = 0;
        if (jQuery('.announcements-wrapper').is(':visible')) {
            announce_h = jQuery('.announcements-wrapper').height();
        }
        if ( (jQuery(window).scrollTop() > 40+announce_h) && (!jQuery('header').hasClass('menu_fixed')) ) {
            jQuery('.page-container').prepend('<div class="sticky_fix" style="height:102px; display:block">&nbsp;</div>');
            jQuery('header').addClass('menu_fixed').css('position','fixed');
            jQuery('.search-and-saved-wrapper').addClass('search-inner-fixed');
            //var searchBarWidth = jQuery('.search-and-saved-wrapper').width();
            if (jQuery('.site-navigation li.active').length) {
                var offset = jQuery('.site-navigation li.active').offset();
                var distance = jQuery('.site-navigation li.active').height() + offset.top;
                if (jQuery('header').hasClass('menu_fixed')) {
                    distance = distance - jQuery(document).scrollTop()
                }
                jQuery('.megamenu-position').css('top',Math.floor(distance)+'px');
            }
            //jQuery('.search-and-saved').width(searchBarWidth); 
        }
        else if ( jQuery(window).scrollTop() < 40+announce_h ) {
            jQuery('.sticky_fix').remove();
            jQuery('header').removeClass('menu_fixed').css('position','relative');
            jQuery('.search-and-saved-wrapper').removeClass('search-inner-fixed');
            if (jQuery('.site-navigation li.active').length) {
                var offset = jQuery('.site-navigation li.active').offset();
                var distance = jQuery('.site-navigation li.active').height() + offset.top;
                if (jQuery('header').hasClass('menu_fixed')) {
                    distance = distance - jQuery(document).scrollTop()
                }
                jQuery('.megamenu-position').css('top',Math.floor(distance)+'px');
            }
        }

    },

    checkPosition: function() {

        jQuery(window).scroll(function(){
            sticky_menu.action();
        });

    },

    init: function() {
        sticky_menu.action();
        sticky_menu.checkPosition();
    }

};

/* -- 1.11 RWD Image Maps -- */

var rwd_image_maps = {

    action: function() {
        jQuery('img[usemap]').rwdImageMaps();
    },

    init: function() {
        rwd_image_maps.action();
    }

};

/* -- 1.12 Form Inputs -- */

var form_inputs = {
    action: function() {
        if (jQuery('.form-content').length) {
            //checkboxess
            jQuery('input[type="checkbox"]').each(function() {
                jQuery(this).addClass('no-vsibility');
                if (jQuery(this).prop('checked')===true) {
                    jQuery(this).next('label').addClass('checked');
                    jQuery(this).next('label').attr('data-checked', 1);
                }
            });

            jQuery('input[type="checkbox"]').next('label').on('click', function(e){
                e.preventDefault();
                if (jQuery(this).attr('data-checked')==='1') {
                    jQuery(this).removeClass('checked');
                    jQuery(this).prev('input').prop("checked", false);
                    jQuery(this).attr('data-checked', 0);
                }
                else {
                    jQuery(this).addClass('checked');
                    jQuery(this).prev('input').prop("checked", true);
                    jQuery(this).attr('data-checked', 1);
                }
            });

            //radio buttons
            var name;

            jQuery('input[type="radio"]').each(function() {
                jQuery(this).addClass('no-vsibility');
                if (jQuery(this).prop('checked')===true) {
                    jQuery(this).next('label').addClass('checked');
                }
            });

            jQuery('input[type="radio"]').next('label').on('click', function(e){
                e.preventDefault();
                name=jQuery(this).prev('input').attr('name');
                jQuery('input[name="'+name+'"]').next().removeClass('checked');
                jQuery(this).addClass('checked');
                jQuery(this).prev('input').prop("checked", true);
            });

        }
    },

    init: function() {
        form_inputs.action();
    }

};













/* -- 1.x Custom -- */

var custom = {
    search_mobile: function(){
        var s_mob = jQuery('.block-site-search').clone();
        jQuery('.main-container').prepend(s_mob);
    },
    search_fields: function(){
        jQuery(".site-search input, .profile-filter input").focus(function() {
            if ( jQuery(this).val()==jQuery(this).attr('title') ) {
                jQuery(this).val('');
            }
        }); // end focus
        jQuery(".site-search input, .profile-filter input").blur(function() {
            if (jQuery(this).val().length<1) {
                jQuery(this).val(jQuery(this).attr('title'));
            }
        }); // end blur
    },

    showcase_share: function(){
        jQuery('.showcase_component').find('.share').click(function(e) {
            e.preventDefault();
        });

        jQuery('.share .social_buttons li').mouseenter(function(){
            jQuery(this).click(function(){
                window.open(jQuery(this).attr('data-url'));
                return false;
            });
        });
    },

    rhs_share_buttons: function(){
        jQuery('.share-container .share-items a').click(function(e) {
            e.preventDefault();
        });
    },

    content_lightbox: function(){
        jQuery('.content-container .content img.lightbox').each(function(){
            var thisEl = jQuery(this);
            if (thisEl.parent('a').length === 0) {
                thisEl.wrap(function() {
                    var data_url = thisEl.attr('src');
                    var data_title = thisEl.attr('title');
                    if (typeof(data_title) == 'undefined') { data_title = ''; }
                    var data_rel = 'content_lightbox';
                    return "<a class='"+data_rel+"' title='"+data_title+"' href='"+data_url+"'></a>";
                });
            }
            jQuery(".content_lightbox").colorbox(({rel:'content_lightbox'}));
        });
    },

    accordion_links: function(){

        /*
         jQuery('.accordion li h6').on('click', function(){
         jQuery(this).parent().toggleClass('active');
         jQuery(this).parent().find('p').toggleClass('active');
         });
         */

        jQuery(document).on({
            click: function (e) {
                e.preventDefault();
                jQuery(this).parent().toggleClass('active');
                jQuery(this).parent().find('p').toggleClass('active');
            }
        }, '.accordion li h6');

    },

    kis_widget_accordion: function(){
        jQuery('.kis-accordion').click(function(e){
            e.preventDefault();
            jQuery(this).toggleClass('active');
            jQuery(this).siblings('.kis-container').toggleClass('kis-collapsed');
        });
    },

    profile_filter: function(){

        /*
         jQuery(document).on({
         keyup: function () {
         jQuery('.staff-profiles ul li').css('display', 'none');
         var search_value = jQuery(this).val().toLowerCase();
         jQuery('.staff-profiles ul li').each(function() {
         var val = jQuery(this).text();
         if(val.toLowerCase().indexOf(search_value) >= 0) {
         jQuery(this).closest('li').css('display', 'block');
         }
         });
         }
         }, '.profile-filter input[type="text"]');
         */
        jQuery('.profile-filter input[type="text"]').keyup(function() {
            jQuery('.staff-profiles ul li').css('display', 'none');
            var search_value = jQuery(this).val().toLowerCase();
            jQuery('.staff-profiles ul li').each(function() {
                var val = jQuery(this).text();
                if(val.toLowerCase().indexOf(search_value) >= 0) {
                    jQuery(this).closest('li').css('display', 'block');
                }
            });
        });

    },

    international_filter: function(){
        jQuery('.international-select-box ul li a').click(function(e){
            e.preventDefault();
            var selected_value = jQuery(this).attr('data-id');
            var selected_text = jQuery(this).text();
            jQuery('.international-select').text(selected_text);
            jQuery('.international-boxes > div').addClass('hide');
            jQuery('.international-boxes').find("[data-id='" + selected_value + "']").toggleClass('hide');
        });
    },

    magnifier_icon: function() {

        jQuery('.search-icon').click(function(e) {
            e.preventDefault();
            if (jQuery('.homepage .block-site-search').length > 0) {
                jQuery('.homepage .main-container > .block-site-search').toggle();
            } else {
                jQuery('.search-and-saved-wrapper').toggle();
            }
        });
    },

    megamenu_columns: function() {
        var menuCount = [];
        var colCount;
        var boxCount=jQuery('.megamenu>ul').length;
        var k;
        var a;
        var i;
        var sumK;
        var control;
        var kk;
        for (var j=0; j<boxCount;j++) {
            menuCount[j]=[];
            sumK=0;
            colCount=0;
            a=1;
            kk=0;
            control=0;
            for (k=0; k<jQuery('.megamenu>ul').eq(j).find('.megamenu-section.dontsplit').length;k++) {
                menuCount[j][k]= jQuery('.megamenu>ul').eq(j).children('div').find('.megamenu-section.dontsplit:eq('+k+')>ul>li').length;
                sumK=sumK+jQuery('.megamenu>ul').eq(j).children('div').find('.megamenu-section.dontsplit:eq('+k+')>ul>li').length;
                if (!menuCount[j][k])
                    kk++;
                kk++;
            }

            // 4 txt
            if (jQuery('.megamenu>ul').eq(j).children('.mm-4cols').children('.dontsplit').length) {
                jQuery('<div class="col1 menu_cols first column "></div><div class="col2 menu_cols column"></div><div class="col3 menu_cols column"></div><div class="col4 column last menu_cols"></div>').appendTo(jQuery('.megamenu>ul').eq(j).children('.mm-4cols'));
                colCount=Math.ceil((sumK+kk)/4);

                for (i=0;i<k;i++) {
                    jQuery('.megamenu>ul').eq(j).children('.mm-4cols').find('.megamenu-section.dontsplit:eq('+i+')').clone().appendTo(jQuery('.megamenu>ul').eq(j).children('.mm-4cols').find('.col'+a));

                    if (!menuCount[j][i] && control===0)
                        control=control+2;
                    else if (!menuCount[j][i])
                        control=control+1.2;
                    else
                        control=control+0.5;

                    control=control+menuCount[j][i];

                    if ((control+menuCount[j][i+1])>=colCount && a<4 && control>2) {
                        a++;
                        control=0;
                    }
                }
                jQuery('.megamenu>ul').eq(j).children('.mm-4cols').children('.megamenu-section').remove();

            }

            // 1 feat 3txt
            if (jQuery('.megamenu>ul').eq(j).children('.mm-4cols').children('.mm-3c-text').length) {
                jQuery('<div class="col1 menu_cols first column "></div><div class="col2 menu_cols column"></div><div class="col3 column last menu_cols"></div>').appendTo(jQuery('.megamenu>ul').eq(j).find('.mm-3c-text'));
                colCount=Math.ceil((sumK+kk)/3);
                for (i=0;i<k;i++) {
                    jQuery('.megamenu>ul').eq(j).children('.mm-4cols').find('.megamenu-section.dontsplit:eq('+i+')').clone().appendTo(jQuery('.megamenu>ul').eq(j).children('.mm-4cols').find('.col'+a));
                    if (!menuCount[j][i] && control===0)
                        control=control+2;
                    else if (!menuCount[j][i])
                        control=control+1.2;
                    else
                        control=control+0.5;

                    control=control+menuCount[j][i];

                    if ((control+menuCount[j][i+1]+1)>colCount && a<3 && control>2) {
                        a++;
                        control=0;
                    }
                }
                jQuery('.megamenu>ul').eq(j).children('.mm-4cols').children('.mm-3c-text').children('.megamenu-section').remove();
            }

            // 2 feat 1 txt
            if (jQuery('.megamenu>ul').eq(j).children('.mm-3cols').children('.mm-1c-text').length) {
                jQuery('<div class="col1 menu_cols first column "></div><div class="col2 column last menu_cols"></div>').appendTo(jQuery('.megamenu>ul').eq(j).children('.mm-3cols').children('.featured-items'));
                sumK=jQuery('.megamenu>ul').eq(j).children('.mm-3cols').children('.featured-items').children('li').length;
                colCount=Math.ceil(sumK/2);
                for (i=0;i<sumK;i++) {
                    jQuery('.megamenu>ul').eq(j).children('.mm-3cols').children('.featured-items').children('li:eq('+i+')').clone().appendTo(jQuery('.megamenu>ul').eq(j).children('.mm-3cols').find('.col'+a));

                    if (i+1===colCount*a)
                        a++;
                }
                jQuery('.megamenu>ul').eq(j).children('.mm-3cols').children('.featured-items').children('li').remove();
            }
        }


        /*
         jQuery('.megamenu ul .mm-3c-text').columnize({ columns: 3, buildOnce: true });
         jQuery('.col-4-txt .mm-4cols').columnize({ columns: 4, buildOnce: true });
         jQuery('.megamenu ul .mm-3cols .featured-items').columnize({ columns: 2, buildOnce: true });

         jQuery('.second-level-list').each(function(){
         if (jQuery(this).find('.featured-items')) {
         var feat_h = 0;
         jQuery(this).find('.featured-items > li').each(function(index, n){
         feat_h = jQuery(n).height()-5;
         feat_h = feat_h + feat_h;
         });
         }
         var mm_h = Math.round(jQuery(this).height());
         if (feat_h > mm_h) {
         jQuery(this).find('.column, .featured-items, .mm-1c-text').css('height', feat_h);
         } else {
         jQuery(this).find('.column, .featured-items, .mm-1c-text').css('height', mm_h);
         }
         });


         jQuery('.second-level-list').each(function(){
         var mm_h = Math.round(jQuery(this).height());
         jQuery(this).find('.column, .featured-items, .mm-1c-text').css('height', mm_h);
         });
         */

    },

    init: function(){
        custom.search_mobile();
        custom.search_fields();
        custom.showcase_share();
        custom.content_lightbox();
        custom.accordion_links();
        custom.kis_widget_accordion();
        custom.profile_filter();
        custom.international_filter();
        custom.magnifier_icon();
        custom.megamenu_columns();
        // custom.rhs_share_buttons();
    }
};


/* -- 1.13 KIS widget - On resize -- */

var onResize = {

    kis_widget_type: function() {

        if (jQuery('.kis-container').length > 0) {

            var kis_horizontal = jQuery('.kis-container').attr('data-widget-horizontal-url');
            var kis_vertical = jQuery('.kis-container').attr('data-widget-vertical-url');

            if (jQuery(window).width() < 670) {
                jQuery('.kis-container iframe').attr('src', kis_vertical).css('height', '520px');
                jQuery('.kis-container iframe').parent().css('width', '190px').css('margin', '0 auto');
                return false;
            } else {
                jQuery('.kis-container iframe').parent().removeAttr('style');
                jQuery('.kis-container iframe').attr('src', kis_horizontal).removeAttr('style');
                return false;
            }
        }
    },

    resize: function(){

    },

    init: function(){
        onResize.kis_widget_type();
        onResize.resize();
    }
};


/* -- 1.14 MegaMenu -- */

var megamenu = {

    // this js need to be simplify later
    toggle: function(){
        jQuery('.site-navigation li a').hover(function(e){
            e.preventDefault();
            var that = this;
            var offset = $(this).parent().offset();
            var distance = $(this).parent().height() + offset.top;
            if ($('header').hasClass('menu_fixed')) {
                distance = distance - $(document).scrollTop()
            }
            //var distance = $('header').height()+20;

            naviTimeout = setTimeout(function(){
                var selected_value = jQuery(that).attr('data-id');
                if (jQuery('.megamenu.wrap').find("[data-id='"+selected_value+"']").length > 0) {
                    jQuery('.site-navigation li').removeClass('active');
                    jQuery(that).parent().addClass('active');
                    jQuery('.megamenu.wrap > ul').removeClass('mm-active').hide();
                    $('.megamenu-position').removeAttr('style')
                    $('.megamenu-position').css('top',Math.floor(distance)+'px');
                    jQuery('.megamenu.wrap').show();
                    jQuery('.megamenu.wrap').find("[data-id='"+selected_value+"']").show().addClass('mm-active');
                }
                else {
                    jQuery('.megamenu.wrap').hide();
                    jQuery('.site-navigation li').removeClass('active');
                }
            }, 500);

        }, function(){
            clearTimeout(naviTimeout );
        });


        jQuery('.megamenu.wrap').hover(function(){
            if (jQuery('.megamenu .second-level-list').siblings('.mm-active').length > 0) {
                jQuery('.megamenu.wrap').show();
            } else {
                jQuery('.megamenu.wrap').hide();
            }
        });

        jQuery('.megamenu.wrap, header').mouseleave(function() {
            setTimeout(function() {
                jQuery('.megamenu.wrap').hide(); jQuery('.site-navigation li').removeClass('active');
            }, 500);
        });

    },

    init: function(){
        megamenu.toggle();
    }

};



/* -- 1.15 Funnelback Main Search - AJAX -- */

var main_search_ajax = {

    submit_button: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();
                detachTypeahead();
                //var query = jQuery('.search-container form.site-search input.tt-input').val();
                var query = jQuery('.search-container form.site-search input.home-search-input').val();
                jQuery('.search-page').animate({opacity: 0.5});

                jQuery.ajax({
                    url: GlobalVars.url.funnelback_global_url+"?collection="+GlobalVars.url.funnelback_collection_global+"&query="+query,
                    dataType: "html",
                    cache: true,
                }).done(function(data) {
                        jQuery('.search-page').html(data);
                        jQuery('.search-page').animate({opacity: 1});
                        attachTypeahead();
                        search_page.closeFilters();
                        multi_images();
                    });

            }
        }, '.search-page .search-container form.site-search .site-search-submit');
    },

    suggestion_text: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();

                jQuery('.search-page').animate({opacity: 0.5});
                var fb_query = jQuery(this).attr('href');

                jQuery.ajax({
                    url: GlobalVars.url.funnelback_global_url+fb_query, dataType: "html", cache: true }).done(function(data) {
                        jQuery('.search-page').html(data);
                        jQuery('.search-page').animate({opacity: 1});
                    });
            }
        }, '.search-intro .search-keyword a');
    },

    pagination: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();
                detachTypeahead();
                jQuery('.search-page').animate({opacity: 0.5});
                var fb_query = jQuery(this).attr('href');

                jQuery.ajax({
                    url: GlobalVars.url.funnelback_global_url+fb_query, dataType: "html", cache: true }).done(function(data) {
                        jQuery('.search-page').html(data);
                        jQuery('.search-page').animate({opacity: 1});
                        jQuery("html, body").animate({ scrollTop: jQuery('.search-count').offset().top-65 }, 600);
                        attachTypeahead();
                        search_page.closeFilters();
                        multi_images();
                    });
            }
        }, '.search-page .search-pagination a.page-item');
    },

    tabs: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();
                detachTypeahead();
                jQuery('.search-page').animate({opacity: 0.5});
                var fb_query = jQuery(this).attr('href');

                jQuery.ajax({
                    url: GlobalVars.url.funnelback_global_url+fb_query, dataType: "html", cache: true }).done(function(data) {
                        jQuery('.search-page').html(data);
                        jQuery('.search-page').animate({opacity: 1});
                        attachTypeahead();
                        search_page.closeFilters();
                        multi_images();
                    });
            }
        }, '.search-page .tabbed-navigation a.main-search-tab');
    },

    search_filters: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();

                var query = jQuery('.search-container form.site-search input.typeahead').attr('value');
                var filters = '';

                if (jQuery(this).hasClass('checked')){
                    jQuery(this).removeClass('checked');
                }
                else {
                    var filters = "&"+jQuery(this).prev().attr('name')+"="+jQuery(this).prev().attr('value');
                }

                jQuery('.search-aside .search-filters label').each(function(){
                    if (jQuery(this).hasClass('checked')){
                        filters += "&"+jQuery(this).prev().attr('name')+"="+jQuery(this).prev().attr('value');
                    }
                });
                jQuery('.search-page').animate({opacity: 0.5});
                detachTypeahead();
                jQuery.ajax({
                    url: GlobalVars.url.funnelback_global_url+"?query="+query+filters, dataType: "html", cache: true }).done(function(data) {
                        jQuery('.search-page').html(data);
                        jQuery('.search-page').animate({opacity: 1});
                        attachTypeahead();
                        search_page.closeFilters();
                        multi_images();
                    });

            }
        }, '.search-aside .search-filters .filters label');
    },

    init: function(){
        main_search_ajax.submit_button();
        main_search_ajax.suggestion_text();
        main_search_ajax.pagination();
        main_search_ajax.tabs();
        main_search_ajax.search_filters();
    }

};


/* -- 1.16 Funnelback Related Results - AJAX -- */
var related_results = {

    funnelback: function(){

        if (jQuery('.funnelback-results')){
            jQuery('.funnelback-results').each(function(){

                //GlobalVars.url.funnelback_url
                var component_type = jQuery(this).attr('data-type');
                var column_type = jQuery(this).attr('data-layout');
                var layout_type = jQuery(this).attr('data-layout-version');
                var results_amount = jQuery(this).attr('data-amount');

                var this_item = jQuery(this);
                var global_page_type = jQuery(this).attr('data-page-type');
                var param_name = jQuery(this).attr('data-param');
                var param_value = jQuery(this).attr('data-param-value');

                var collection = GlobalVars.url.funnelback_collection_global;
                var funnelback_url = GlobalVars.url.funnelback_url;
                var funnelback_get = GlobalVars.url.funnelback_related_url;

                /*
                 jQuery.ajax({ url: funnelback_get+"?collection="+collection+"&"+global_page_type+"&"+param_name+"="+param_value+"&num_ranks="+results_amount, dataType: "json", cache: false }).success(function(data) {
                 */
                jQuery.ajax({ url: funnelback_get+"?collection="+collection+"&"+global_page_type+"&"+param_name+"&num_ranks="+results_amount, dataType: "json", cache: true }).success(function(data) {

                    var json_ob = data;
                    //var no_results = json_ob.results.noResults;

                    try {
                        // print error
                        if(json_ob.results.noResults) {
                            var source   = no_results_found;
                            var template = Handlebars.compile(source);
                            this_item.append(template(json_ob));
                            this_item.find('.loading').remove();
                            this_item.closest('.component').hide();

                            // print results
                        } else {
                            if (column_type === "sidebar") {

                                // check type of component and select proper template
                                if (component_type === "related_areas" || component_type === "related_groups" || component_type === "related_projects" || component_type === "related_centers"){
                                    var source = related_areas_groups_projects_centres_sidebar_template;
                                }
                                else if (component_type === "related_subjects"){
                                    var source = related_subjects_template;
                                }
                                else if (component_type === "related_schools"){
                                    var source = related_schools_template;
                                }
                                else if (component_type === "related_facilities"){
                                    var source = related_facilities_sidebar_template;
                                }
                                else if (component_type === "related_courses"){
                                    if (layout_type === "single"){
                                        var source = related_courses_sidebar_single_template;
                                    } else {
                                        var source = related_courses_sidebar_multiple_template;
                                    }
                                }
                                else if (component_type === "related_news"){
                                    if (layout_type === "single"){
                                        var source = related_news_sidebar_single;
                                    } else {
                                        var source = related_news_sidebar_multiple;
                                    }
                                }
                                else if (component_type === "related_events"){
                                    if (layout_type === "single"){
                                        var source = related_events_sidebar_single;
                                    } else {
                                        var source = related_events_sidebar_multiple;
                                    }
                                }
                                else if (component_type === "departments"){
                                    var source = departments_template;
                                }
                                else if (component_type === "business_services_knowledge_transfer"){
                                    var source = business_services_knowledge_transfer_template;
                                }
                                else if (component_type === "staff_profiles"){
                                    var source = staff_profiles_sidebar_template;
                                }
                                else if (component_type === "featured_profiles"){
                                    var source = featured_profiles_sidebar_template;
                                }

                            }

                            else if (column_type === "middle") {

                                // check type of component and select proper template
                                if (component_type === "related_areas" || component_type === "related_groups" || component_type === "related_projects" || component_type === "related_centers"){
                                    var source = related_areas_groups_projects_centres_middle_template;
                                }
                                else if (component_type === "related_subjects"){
                                    var source = related_subjects_template;
                                }
                                else if (component_type === "related_schools"){
                                    var source = related_schools_template;
                                }
                                else if (component_type === "related_facilities"){
                                    var source = related_facilities_middle_template;
                                }
                                else if (component_type === "related_courses"){
                                    if (layout_type === "single"){
                                        var source = related_courses_middle_single_template;
                                    } else {
                                        var source = related_courses_middle_multiple_template;
                                    }
                                }
                                else if (component_type === "related_news"){
                                    if (layout_type === "single"){
                                        var source = related_news_middle_normal;
                                    } else {
                                        var source = related_news_middle_large;
                                    }
                                }
                                else if (component_type === "related_events"){
                                    if (layout_type === "single"){
                                        var source = related_events_middle_normal;
                                    } else if (layout_type === "multiple") {
                                        var source = related_events_middle_large;
                                    } else {
                                        var source = related_events_middle_two_columns;
                                    }
                                }
                                else if (component_type === "departments"){
                                    var source = departments_template;
                                }
                                else if (component_type === "business_services_knowledge_transfer"){
                                    var source = business_services_knowledge_transfer_template;
                                }
                                else if (component_type === "staff_profiles"){
                                    var source = staff_profiles_middle_template;
                                }
                                else if (component_type === "featured_profiles"){
                                    var source = featured_profiles_middle_template;
                                }
                            }

                            var template = Handlebars.compile(source);
                            this_item.append(template(json_ob));
                            this_item.find('.loading').remove();
                            multi_images();

                        }
                    } catch (e) { }

                });
            });
        }

    },
    init: function(){
        related_results.funnelback();
    }
};


/* -- 1.17 Positioning components on home page -- */
var ResponsiveHome = {
    init: function(){
        if((jQuery('body').hasClass('homepage') === true ) && ((jQuery(window).width() < 801) || (jQuery(document).width() < 801))) {
            ResponsiveHome.reorder();
        }
    },
    reorder: function(){
        if (jQuery(".quick-links")){
            jQuery('.sidebar-right').prepend(jQuery('.quick-links'));
        }
        if (jQuery(".mdx-schools")){
            jQuery('.sidebar-right').prepend(jQuery('.mdx-schools'));
        }
        if (jQuery(".call-to-action-btns")){
            jQuery('.sidebar-left').prepend(jQuery('.call-to-action-btns'));
        }
    }
};


/* -- 1.18 Positioning components on course page -- */
var ResponsiveCourse = {
    init: function(){
        if((jQuery('body').hasClass('course') === true ) && ((jQuery(window).width() < 801) || (jQuery(document).width() < 801))) {
            ResponsiveCourse.reorder();
        }
    },
    reorder: function(){
        if (jQuery(".course-header-image .multi-images")){
            jQuery('.course-header-image .multi-images').hide();
        }
        if (jQuery(".call-to-action-btns")){
            jQuery('.content-container').prepend(jQuery('.call-to-action-btns'));
        }
        if (jQuery(".promotional")){
            jQuery('.content-container').prepend(jQuery('.promotional'));
        }
        if (jQuery(".course-box")){
            jQuery('.tabbed-content li.active, .tabbed-navigation li.active').removeClass('active');
            jQuery('.content-container .tabbed-navigation').append('<li><a href="http://mdx-web01.squiz.co.uk/mdx/showcase-2/course-page?tab=key-facts" data-tab-name="key-facts"><span>Key facts</span><div class="arrow"></div></a></li>');
            jQuery('.content-container .tabbed-content').append('<li data-tab="0000" data-tab-name="key-facts"><div class="tabbed-content-text">' + jQuery('.course-box').html() + '</div></li>');
            jQuery('.sidebar-right .course-box').remove();

            jQuery('.tabbed-navigation li:last-of-type a').click(function(e) {
                e.preventDefault();
                jQuery('.tabbed-navigation li').removeClass('active');
                jQuery('.tabbed-content li').removeClass('active');
                jQuery(this).parent().addClass('active');
                jQuery('.tabbed-content li:last-of-type').addClass('active');
            });

        }
        if (jQuery(".related-courses-f")){
            jQuery('.sidebar-right').prepend(jQuery('.related-courses-f'));
        }
        if (jQuery(".kis-widget")){
            jQuery('.sidebar-right').prepend(jQuery('.kis-widget'));
        }
    }
};

/* -- 1.19 Sitewide search - query change -- */

var sitewide_search_query_changer = {
    check_page: function(){
        if (jQuery('form.site-search input.typeahead')) {
            sitewide_search_query_changer.init();
        }
    },
    init: function(){
        jQuery(document).on({
            keyup: function(){
                search_value = this.value;
                jQuery(this).attr('value', search_value);
            }
        }, 'form.site-search input.typeahead');
    }
};


/* -- 1.20 Calendar - Events Page -- */

var calendar_setup = {
    check_event_page: function(){
        if (jQuery('#datepicker').length) {
            calendar_setup.init();
        }
    },
    init: function(){
        jQuery('#datepicker').datepicker({
            inline:true,
            showOtherMonths: true,
            altField: '#filter-date',
            onSelect: function() {
                jQuery('#filter-form').submit();
            },
            dateFormat: "dd/mm/yy"
        });
        jQuery('.events-filter-reset').click(function(){
            jQuery.datepicker._clearDate('#datepicker');
        });

        var url = window.location.href;
        var date = url.substring(url.indexOf('?date=') + 6);
        date = decodeURIComponent(date);
        jQuery('#datepicker').datepicker("setDate", date);
    }
};


/* -- 1.21 Gap between components: departments, business and knowledge -- */

var add_gaps = {
    width_check: function(){
        if((jQuery(window).width() > 767) || (jQuery(document).width() > 767)) {
            add_gaps.init();
        }
    },
    init: function() {
        if (jQuery('.content-container').find('.departments-f').next().is('.businesss-and-knowledge-f')) {
            jQuery('.content-container .departments-f').css({
                'margin-left':'0',
                'width': '49%'
            });
            jQuery('.content-container .businesss-and-knowledge-f').css({
                'margin-right':'0',
                'width': '49%'
            });
        } else if (jQuery('.content-container').find('.businesss-and-knowledge-f').next().is('.departments-f')) {
            jQuery('.content-container .departments-f').css({
                'margin-right':'0',
                'width': '49%'
            });
            jQuery('.content-container .businesss-and-knowledge-f').css({
                'margin-left':'0',
                'width': '49%'
            });
        }
    }
};

/* -- 1.22 Share button on mobile -- */

var mobile_share_button = {
    mobile_only: function(){
        if((jQuery(window).width() < 767) || (jQuery(document).width() < 767)) {
            mobile_share_button.init();
        }
    },
    init: function(){
        jQuery('.mobile-nav-button-share > a').click(function(event) { event.preventDefault(); });
        jQuery('.mobile-nav-button-share').hover(function() { jQuery('.social_buttons').toggle(); });
    }
};


/* -- 1.23 Border color on black tabs when mouse enter on li -- */

var border_color = {
    check_width: function(){
        if((jQuery(window).width() > 767) || (jQuery(document).width() > 767)) {
            border_color.init();
        }
    },
    init: function(){
        jQuery('.tabbed-navigation li').click(function () {
            jQuery('.tabbed-navigation li').find('a').removeClass("right-bar-black");
        });
        jQuery('.tabbed-navigation li').hover(function() {
                jQuery(this).prev().find('a').addClass("right-bar-black");
            },
            function() {
                jQuery(this).prev().find('a').removeClass("right-bar-black");
                jQuery('.tabbed-navigation li.active').prev().find('a').addClass("right-bar-black");
            });
    }
};


/* -- 1.24 Map our campuses collapse on mobile -- */

var map_campuses_toggle = {
    init: function(){
        if (jQuery('.responsive-map-campuses')){
            jQuery('.responsive-map-campuses .map-header').click( function() { jQuery(this).parent().toggleClass('collapse-mobile'); });
        }
    }
};


/* -- 1.25 Funnelback AZ Results - AJAX -- */
var az_results = {

    funnelback: function(){

        if (jQuery('.funnelback-results-az')){
            jQuery('.funnelback-results-az').each(function(){

                var this_item = jQuery(this);
                var global_page_type = jQuery(this).attr('data-page-type');

                if (global_page_type === "meta_A=Staff profile") {
                    var collection = GlobalVars.url.funnelback_collection_profiles;
                    global_page_type = '';
                } else {
                    var collection = GlobalVars.url.funnelback_collection_global;
                }
                var funnelback_get = GlobalVars.url.funnelback_az_url;
                var param_name = jQuery(this).attr('data-param');

                jQuery.ajax({ url: funnelback_get+"?collection="+collection+"&"+global_page_type+"&"+param_name, dataType: "json", cache: false }).done(function(data) {

                    var json_ob = data;
                    var noResults =  (json_ob.results[0].errorMsg !== undefined) ? 1 : 0;

                    try {
                        // print error

                        if(noResults > 0) {
                            var source   = no_results_found;
                            this_item.find('.loading').remove();
                            this_item.closest('.component').hide();
                            // print results
                        } else {
                            var source = az_listing_template;
                            var template = Handlebars.compile(source);
                            this_item.append(template(json_ob));
                            this_item.find('.loading').remove();
                            wrap_list('.funnelback-results-az .az-listing-results-box h5 + li');
                            wrap_h5_with_list('.funnelback-results-az .az-listing-results-box h5, .funnelback-results-az .az-listing-results-box .ul-list');
                            split_results_for_two_equal_columns('.funnelback-results-az .az-listing-results-box div .ul-list');

                            var all_button = this_item.find('.alphabet ul li').first().addClass('current');
                            all_button.find('a').trigger('click');
                        }
                    } catch (e) { }

                });
            })
        }

    },
    init: function(){
        az_results.funnelback();
    }
};


/* -- 1.26 Upcoming Events - Matrix Items - AJAX -- */
var upcoming_events = {

    get_items: function(){

        if (jQuery('.upcoming-events-results')){
            jQuery('.upcoming-events-results').each(function(){

                var component_type = jQuery(this).attr('data-type');
                var column_type = jQuery(this).attr('data-layout');
                var layout_type = jQuery(this).attr('data-layout-version');
                var results_amount = jQuery(this).attr('data-amount');

                var this_item = jQuery(this);
                var global_page_type = jQuery(this).attr('data-page-type');
                var root_node = jQuery(this).attr('data-root-node');
                var param_value = jQuery(this).attr('data-param-value');
                var param_name = jQuery(this).attr('data-param');

                var events_json = GlobalVars.url.upcoming_events_json;

                jQuery.ajax({ url: events_json+"?"+root_node+"&"+param_name+"&num_ranks="+results_amount, dataType: "json", cache: true }).success(function(data) {

                    var json_ob = data;

                    try {
                        // print error
                        if(json_ob.results.noResults) {
                            var source   = no_results_found;
                            var template = Handlebars.compile(source);
                            this_item.append(template(json_ob));
                            this_item.find('.loading').remove();
                            this_item.closest('.component').hide();

                            // print results
                        } else {
                            var json_length = json_ob.results.result.length;
                            if (results_amount === "0") { results_amount = json_length; }
                            if (results_amount > json_length) {
                                length_all = json_length
                            } else {
                                length_all = results_amount;
                            }

                            for(var k in json_ob.results.result) {
                                var time = json_ob.results.result[k]['timestamp'] - json_ob.results.result[k]['today'];
                                if (time < 0) {
                                    json_ob.results.result.splice(k, 1);
                                }
                            }

                            for(var k in json_ob.results.result) {
                                if (k >= length_all) {
                                    json_ob.results.result.splice(k, 1);
                                }
                            }

                            if (column_type === "sidebar") {

                                // check type of component and select proper template
                                if (component_type === "related_events"){
                                    if (layout_type === "single"){
                                        var source = related_events_sidebar_single;
                                    } else {
                                        var source = related_events_sidebar_multiple;
                                    }
                                }
                            }

                            else if (column_type === "middle") {

                                // check type of component and select proper template
                                if (component_type === "related_events"){
                                    if (layout_type === "single"){
                                        var source = related_events_middle_normal;
                                    } else if (layout_type === "multiple") {
                                        var source = related_events_middle_large;
                                    } else {
                                        var source = related_events_middle_two_columns;
                                    }
                                }
                            }

                            var template = Handlebars.compile(source);
                            this_item.append(template(json_ob));
                            this_item.find('.loading').remove();
                        }
                    } catch (e) { }

                });
            });
        }

    },
    init: function(){
        upcoming_events.get_items();
    }
};



/* -- 1.27 A-Z Listing - changing letters, hide/show content -- */

var az_letters = {
    change_letter: function(){
        jQuery(document).on({
            click: function(e){
                e.preventDefault();
                var letter = jQuery(e.target).text();
                if (letter == 'All') {
                    jQuery(this).closest('ul').find('li').removeClass("current");
                    jQuery(this).closest('.az-listing-content').find('.az-listing-results-box').find('div').show();
                    jQuery(this).closest('li').addClass("current");
                    jQuery(this).closest('.az-listing-content').find('.az-listing-results').find('.hidden').removeClass('hidden');
                } else {
                    jQuery(this).closest('ul').find('li').removeClass("current");
                    jQuery(this).closest('.az-listing-content').find('.az-listing-results-box').children().hide();
                    jQuery(this).closest('.az-listing-content').find('.az-listing-results-box').find('.'+ letter).show();
                    jQuery(this).closest('li').addClass("current");
                    jQuery(this).closest('.az-listing-content').find('.az-listing-results').find('.hidden').removeClass('hidden');
                }
            }
        }, '.alphabet a');
    },

    all_by_default: function(){
        var all_button = jQuery('.az-listing-content .alphabet ul li').first().addClass('current');
        all_button.find('a').trigger('click');
    },

    init: function(){
        az_letters.change_letter();
        az_letters.all_by_default();
    }
};

/* -- 1.28 Hide components if no results -- */
var hide_noResults = {
    init: function(){
        jQuery('.component-no-results').parent('.component').hide();
    }
}

/* -- 1.29 Search page - Filters -- */
var search_page = {
    closeFilters: function(){
        if (jQuery('.search-page .search-aside .search-filters').length > 0) {
            thisEl = jQuery('.search-page .search-aside .search-filters > li');
            jQuery(thisEl).each(function(i,j){
                if (i === 0) {
                    jQuery(this).addClass('active active-filter');
                } else {
                    if (!jQuery(this).find('.filters label.checked').length > 0) {
                        jQuery(this).addClass('inactive-filter');
                    } else {
                        jQuery(this).addClass('active');
                        // jQuery(this).addClass('active-filter');
                    }
                }
            });
        }
    },
    toggleFilters: function(){
        jQuery(document).on({
            click: function (e) {
                e.preventDefault();
                var thisEl = jQuery(this);
                thisEl.siblings('.filters').slideToggle();
                if (thisEl.parent().is(':first-of-type')) {
                    thisEl.parent().toggleClass('active active-filter');
                } else if (thisEl.parent().hasClass('inactive-filter')) {
                    thisEl.parent().toggleClass('active');
                }
            }
        }, '.search-filters > li > a');
    },
    init: function(){
        if (jQuery('.search-page .search-aside .search-filters').length > 0) {
            search_page.closeFilters();
            search_page.toggleFilters();
        }
    }
};


/* -- 1.30 Funnelback autocomplete + typeahead -- */

var fb_server = GlobalVars.url.funnelback_server_url;
var fb_collection = GlobalVars.url.funnelback_collection_global;

var fbbaseUrl    = fb_server,
    suggestPath   = '/s/suggest.json',
    fbcollection = fb_collection;
var bestResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote:  {
        url:fbbaseUrl + suggestPath + '?collection=' + fbcollection + '&partial_query=%QUERY&callback=?',
        ajax: {
            dataType:'jsonp'
        },
        filter: function(list) {
            return $.map(list, function(el) { return { value: el }; });
        }
    }
});
bestResults.initialize();
var ttadapter = bestResults.ttAdapter();


var detachTypeahead = function() {
    jQuery('.search-container .typeahead, #home-fb-queryform .home-search-input').typeahead('destroy');
}
var attachTypeahead = function() {
    jQuery('.search-container .typeahead, #home-fb-queryform .home-search-input').typeahead(null, {
        displayKey:'value',
        source: ttadapter
    });
};
$(function() {
    attachTypeahead();
});


/* -- 1.31 Pausing players -- */
var pausePlayers = function() {
    jQuery('.carousel-navigation .slides li').on('click',function() {
        if (!jQuery(this).hasClass('flex-active-slide')) {
            //flowplayer
            jQuery('.flowplayer').each(function(){
                api = $(this).data("flowplayer");
                api.pause();
            })
            //youtube
            jQuery('.youtube_player').each(function() {
                this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            })
            //vimeo
            jQuery('.vimeo_player').each(function() {
                this.contentWindow.postMessage('{"method":"pause"}', '*');
            })
        }
    });
}


/*
 --------------------
 2. On window load
 --------------------
 */

jQuery(window).load(function(){ });


/*
 --------------------
 3. On window resize
 --------------------
 */

jQuery(window).resize(function () {
    //  onResize.init();
    if (!jQuery('body').hasClass('profile')) {
        tabs.scrolling_tabs();
    }
});


/*
 --------------------
 4. Document ready
 --------------------
 */

jQuery(document).ready(function(){
    pausePlayers();
    tabs.init();
    share_widget.init();
    announcement.init();
    cookies_notification.init();
    sticky_menu.init();
    saved_pages.init();
    mobile_navigation.init();
    showcase_component.init();
    promo_sliders.init();
    gallery_component.init();
    custom.init();
    rwd_image_maps.init();
    onResize.init();
    megamenu.init();
    form_inputs.init();

    main_search_ajax.init();
    related_results.init();
    az_results.init();
    az_letters.init();
    upcoming_events.init();
    search_page.init();

    sitewide_search_query_changer.check_page();
    calendar_setup.check_event_page();
    add_gaps.width_check();
    mobile_share_button.mobile_only();
    border_color.check_width();
    map_campuses_toggle.init();
    ResponsiveHome.init(); // Positioning components on home page 
    ResponsiveCourse.init(); // Positioning components on course page

    wrap_list('.az-listing-results-box h5 + li');
    wrap_h5_with_list('.az-listing-results-box h5, .az-listing-results-box .ul-list');
    split_results_for_two_equal_columns('.az-listing-results-box div .ul-list');

    hide_noResults.init();

});


/*
 --------------------
 5. Functions
 --------------------
 */


/* -- 5.1 Get Parameter -- */
function getParam(source, name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( source );
    if( results === null ) {
        return null;
    }
    else {
        return results[1];
    }
}

/* -- 5.2 Tabs scrolling -- */
function scroll_forward(){ jQuery('.tabbed-menu-scroll').animate({scrollLeft: '+=500'}, scroll_forward); }
function scroll_back(){ jQuery('.tabbed-menu-scroll').animate({scrollLeft: '-=500'}, scroll_back); }
function stopScrolling(){ jQuery('.tabbed-menu-scroll').stop(); }

/* -- 5.3 AZ Columns -- */
/* A-Z Listing - wrap list */
function wrap_list(elements) {
    jQuery(elements).each(function(){
        jQuery(this).nextUntil('h5').andSelf().wrapAll('<div class="ul-list"/>');
    });
}

/* A-Z Listing - wrap h5 with list */
function wrap_h5_with_list(elements) {
    var divs = jQuery(elements);
    var h5;
    for(var i = 0; i < divs.length; i+=2) {
        h5  = jQuery(divs[i]).children('a').html();
        divs.slice(i, i+2).wrapAll("<div class='"+h5+"'></div>");
    }
}

/*A-Z Listing - split results for two equal columns */
function split_results_for_two_equal_columns(elements) {
    /*Function to check if number is integer*/
    function isInt(n) {
        return n % 1 === 0;
    }

    jQuery(elements).each(function(){
        var $ul = $(this).addClass("left-column"), // Let original be first column
            $lis = $ul.children(), // Find all children `li` elements
            help_mid = $lis.length / 2;

        if (isInt(help_mid)) {
            mid_val = Math.floor(help_mid); // Calculate where to split
        } else {
            mid_val = Math.floor(help_mid) + 1; // Calculate where to split
        }
        mid = mid_val,
            $newCol = $('<div />', {"class": "ul-list right-column"}).insertAfter($ul); // Create new column and add after original. "class" needs to be in quotes because it's a reserved keyword

        $lis.each(function(i) {
            i >= mid && $(this).appendTo($newCol); // Move `li` elements with index greater than middle
        });
    });
}



// old paralax 

/*
 jQuery('body').css('background', 'url("http://mdx-web01.squiz.co.uk/__data/assets/image/0014/4217/schools_BG.png") repeat left top').attr('id','bg');

 var parallax = {
 variables: {
 eHeight: 0,
 pHeight: 0,
 wHeight: 0,
 wPosition: 0
 },
 init: function() {
 parallax['variables']['eHeight'] = jQuery('#bg').height();
 parallax['variables']['pHeight'] = jQuery('body').height();
 parallax['variables']['wHeight'] = jQuery(window).height();
 parallax['variables']['wPosition'] = jQuery(window).scrollTop();
 },
 move: function() {
 parallax['variables']['wHeight'] = jQuery(window).height();
 parallax['variables']['wPosition'] = jQuery(window).scrollTop();
 var top = (-1) * ((parallax['variables']['wPosition']/(parallax['variables']['pHeight']-parallax['variables']['wHeight']))*parallax['variables']['eHeight']);
 jQuery('#bg').css('background-position','center '+parseInt(top, 10)+'px');
 }
 };


 jQuery(window).load(function(){
 if ( jQuery('#bg').length ) {
 parallax.init();
 jQuery(window).scroll(function(){
 parallax.move();
 });
 jQuery(window).resize(function(){
 parallax.init();
 parallax.move();
 });
 }
 });

 */
