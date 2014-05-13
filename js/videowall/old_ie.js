var RepairIE = {
    clearOurVideosList: function() {
        jQuery('.video-wall > li').each(function(){
            if (!(jQuery(this).index() % 3) || jQuery(this).index() === 0) {
                jQuery(this).addClass('margin-left-0');
            }
        });
    },

    init: function() {
        this.clearOurVideosList();
    }
};

jQuery(document).ready(function(){
    RepairIE.init();
});