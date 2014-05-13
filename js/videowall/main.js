/*
 *     Middlesex Video Wall - JavaScript - main
 *     @author Jacek Skwarna (Squiz)
 *     -----------------------------------------------
 *
 *
 *     1. Functions.
 *       1.1 Video Wall control
 */

/*
 --------------------
 1. Functions
 --------------------
 */

/* -- 1.1 Video Wall control -- */
var videoWall = {
    api: null,

    featured_video_width: 450,
    featured_video_height: 253,
    corrupted_embeded_video_message: "This video file is corrupted. Please choose another one.",

    setApi: function () {
        this.api = flowplayer();
    },

    setBackground: function () {
        if (typeof GlobalVars.url.featured_video) {
            jQuery('.featured-video .flowplayer').css({'background-image': 'url(' + GlobalVars.url.featured_video + ')', 'background-repeat': 'no-repeat', 'background-size': '100%'});
        }
    },

    createEmbededVideoIframe: function video(e) {
        var url = e.attr('href');
        if ('' === url || !url) {
            if (jQuery('.featured-video .alert').length) {
                jQuery('.featured-video .alert').text(videoWall.corrupted_embeded_video_message);
            }
            else {
                jQuery('.featured-video').prepend('<p class="alert">' + videoWall.corrupted_embeded_video_message + '</p>');
            }
            return;
        }

        var html = '<iframe class="iframe-video" src="'+url+'" width="'+videoWall.featured_video_width+'" height="'+videoWall.featured_video_height+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        e.remove();
        if (jQuery('.featured-video iframe.iframe-video').length) {
            jQuery('.featured-video iframe.iframe-video').attr('src', url);
        }
        else {
            jQuery('.featured-video .alert').remove();
            jQuery('.featured-video .flowplayer').hide();
            jQuery('.featured-video').prepend(html);
        }

        //e.before('<p class="text-center" style="padding:15px 0 0;">'+html+'</p>');
        //e.remove();
    },

    reloadVideoHandler: function () {
        var tmp_api = flowplayer();
        jQuery(document).on('click', '.video-wall > li > a', function(e){
            e.preventDefault();
            var vid = jQuery(this).data('vid'),
                tmp_video_type = '',
                tmp_name = null,
                tmp_video_url = null,
                tmp_description = null,
                tmp_pdf = null,
                tmp_pdf_name = 'download pdf',
                tmp_video_extension = null,
                tmp_file_size = 0,
                tmp_thumbnail = null;

            jQuery('html, body').animate({
                scrollTop: jQuery('.site-logo').first().offset().top
            }, 200);

            jQuery.ajax({
                type: "GET",
                url: GlobalVars.url.load_video + '?vid=' + vid,
                dataType: "json",
                beforeSend: function(){
                    jQuery('.featured-video .flowplayer .ajax-loader').fadeIn();
                    tmp_api.stop();
                },
                success: function (data){
                    if (typeof data['video'] && data['video'].length > 0) {
                        tmp_video_type = data['video'][0]['type'] || '',
                        tmp_name = data['video'][0]['name'] || null,
                        tmp_video_url = data['video'][0]['url'] || null,
                        tmp_description = data['video'][0]['description'] || null,
                        tmp_pdf = data['video'][0]['pdf'] || null,
                        tmp_pdf_name = data['video'][0]['pdf_name'] || 'download pdf',
                        tmp_file_size = data['video'][0]['file_size'] || 0,
                        tmp_video_extension = null,
                        tmp_thumbnail = data['video'][0]['thumbnail'] || null;
                    }
                    else {
                        tmp_file_size = 0;
                    }

                },
                complete: function(xhr,status) {
                    //console.log('textStatus: ' + status);
                    if (status === 'success') {
                        jQuery('.flowplayer').first().find('.replacement').fadeOut();
                        if (tmp_thumbnail) {
                            jQuery('.flowplayer').first().css({'background-image': 'url(' + tmp_thumbnail + ')'});
                        }

                        if (tmp_name) {
                            jQuery('.featured-video h2').text(tmp_name);
                        }
                        if (tmp_description) {
                            jQuery('#featured-video-description').text(tmp_description);
                        }
                        else {
                            jQuery('#featured-video-description').text('');
                        }

                        if (tmp_pdf) {
                            if (jQuery('#featured-video-pdf').length) {
                                jQuery('#featured-video-pdf').attr('href', tmp_pdf);
                            }
                            else {
                                jQuery('.featured-video').append('<a id="featured-video-pdf" href="' + tmp_pdf + '" class="view-all">' + tmp_pdf_name + '</a>');
                            }
                            jQuery('#featured-video-pdf').attr('href', tmp_pdf);
                        }
                        else {
                            jQuery('#featured-video-pdf').remove();
                        }

                        if (tmp_video_url) {
                            if (tmp_video_type === 'youtube' || tmp_video_type === 'vimeo') {
                                jQuery('.featured-video .featured-external-video').remove();
                                jQuery('.featured-video').prepend('<a href="' + tmp_video_url + '" class="featured-external-video">' + tmp_name + '</a>');
                                videoWall.createEmbededVideoIframe(jQuery('a.featured-external-video').first());
                            }
                            else if (tmp_video_type === 'internal_video') {
                                jQuery('iframe.iframe-video').remove();
                                jQuery('.featured-video .flowplayer').show();
                                tmp_video_extension = tmp_video_url.split('.').pop();

                                switch (tmp_video_extension) {
                                    case 'mov':
                                        tmp_video_type = 'quicktime';
                                        tmp_api.unload();
                                        tmp_api.load([
                                            { mp4: tmp_video_url }
                                        ]);
                                        break;
                                    default:
                                        tmp_video_type = 'quicktime';
                                        tmp_api.unload();
                                        tmp_api.load([
                                            { mp4: tmp_video_url }
                                        ]);
                                        break;
                                }
                            }
                            else {
                            }
                        }

                        jQuery('.featured-video .flowplayer .ajax-loader').fadeOut();
                    }
                    else {
                        if (jQuery('.flowplayer').first().find('.replacement').length) {
                            jQuery('.flowplayer').first().find('.replacement').fadeIn();
                        }
                        else {
                            jQuery('.flowplayer').first().append('<p class="replacement">This video file is corrupted.</p>');
                        }
                        tmp_api.unload();
                    }
                }
            });
        });
    },

    paginationControl: function () {
        var pages_counter = jQuery('#video-wall-pagination .pagination-list > li').length,
            max_page_index = jQuery('#video-wall-pagination .pagination-list > li').length - 1,
            current_page = 0;

        jQuery(document).on('click', '#video-wall-pagination .pagination-list > li > a, #video-wall-pagination .pagination-previous, #video-wall-pagination .pagination-next', function(e){
            e.preventDefault();

            var previous_clicked = 0,
                next_clicked = 0,
                selected_page = 0;

            if (jQuery(this).parents('.pagination-list').length) {//user has clicked a page number
                selected_page = jQuery(this).parent().index();
            }
            else if (jQuery(this).hasClass('pagination-previous') && current_page > 0) {//user has clicked a previous button
                previous_clicked = 1;
            }
            else if (jQuery(this).hasClass('pagination-next') && current_page < max_page_index) {//user has clicked a previous button
                next_clicked = 1;
            }

            var target_url = jQuery(this).attr('href') || null;
            if (!target_url || target_url === '#' || target_url === '') {
                return 0;
            }
            else {
                target_url = GlobalVars.url.our_videos + '?' + target_url.split('?').pop();

                jQuery.ajax({
                    type: "GET",
                    url: target_url,
                    dataType: "html",
                    beforeSend: function(){
                        jQuery('#video-wall-our-videos .ajax-loader').fadeIn();
                    },
                    success: function(data) {
                        jQuery('#video-wall-our-videos ul.video-wall').html(jQuery(data).find('.video-wall').html());
                        jQuery('#video-wall-our-videos .ajax-loader').fadeOut();

                        if (previous_clicked) {
                            current_page -= 1;
                        }
                        else if (next_clicked) {
                            current_page +=1;
                        }
                        else {
                            current_page = selected_page;
                        }


                        //change selected page
                        jQuery('#video-wall-pagination .pagination-list > li').removeClass('active');
                        jQuery('#video-wall-pagination .pagination-list > li').eq(current_page).addClass('active');

                        //set first page href attribute
                        if (current_page > 0) {
                            var tmp_href = jQuery('#video-wall-pagination .pagination-list > li').eq(1).find('a').attr('href');
                            tmp_href = tmp_href.replace('result_page=2', 'result_page=1');
                            jQuery('#video-wall-pagination .pagination-list > li').eq(0).find('a').attr('href', tmp_href);
                        }
                        //set new value for previous button
                        if (current_page > 0) {
                            jQuery('#video-wall-pagination a.pagination-previous').attr('href', jQuery('#video-wall-pagination .pagination-list > li').eq(current_page - 1).find('a').attr('href'));
                        }
                        else {
                            jQuery('#video-wall-pagination a.pagination-previous').attr('href', '#');
                        }
                        //set new value for next button
                        if (current_page < max_page_index) {
                            jQuery('#video-wall-pagination a.pagination-next').attr('href', jQuery('#video-wall-pagination .pagination-list > li').eq(current_page + 1).find('a').attr('href'));
                        }
                        else {
                            jQuery('#video-wall-pagination a.pagination-next').attr('href', '#');
                        }
                    }
                });
            }
        });
    },

    init: function () {
        this.setApi();
        this.setBackground();
        this.reloadVideoHandler();
        this.paginationControl();
        if (jQuery('a.featured-external-video').length) {
            this.createEmbededVideoIframe(jQuery('a.featured-external-video').first());
        }
    }
};

/*
1. On window load
 */

jQuery(window).load(function(){

});

/*
 --------------------
 1. Document ready
 --------------------
 */

jQuery(document).ready(function(){
    //videoWall.flowplayerGlobalConfig();
    videoWall.init();
});
