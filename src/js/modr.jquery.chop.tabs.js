(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'tabs',
        defaults: {
            resizeEvent: 'resize',
            tabMinWidthRoundingErrorAddon: 2
        }
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;
    }

    // the modules methods
    var methods = {

        init: function() {

            var self = this;
            var root = this.root;

            root.wrapEvents('init.tabs.chop', function() {

                // set tabs style class
                root.$element.addClass('chop--tabs');

                // init elements
                self.$tabs = root.$element.find('.chop__tab');
                self.$items = root.$element.find('.chop__item');

                // check navigation min width
                self.checkNavigationMinWidth();

                // open current item
                self.open( root.currentItem-1 );

                // init listeners
                self.initListeners();

            });

        },

        initListeners: function() {

            var self = this;
            var root = this.root;

            // clicks on navigation tab
            root.$element.on('click.navigation.tabs.chop', '.chop__tab', function(e) {

                e.preventDefault();
                self.open( self.$tabs.index( $(this) ) );

            });

            // resize events
            $(window).on( root.options.tabs.resizeEvent, function() {
                self.getNavigationMinWidth();
            });

        },

        open: function( index ) {

            var self = this;
            var root = this.root;
            var $newTab = self.$tabs.eq(index);

            // does item index exist or is active already?
            if( index >= self.$tabs.length || $newTab.hasClass('chop__tab--active') ) {
                return;
            }

            var $item = self.$items.eq(index);

            root.wrapEvents('open.tab.chop', function() {

                // activate tabbed navigation
                self.$tabs.removeClass('chop__tab--active');
                $newTab.addClass('chop__tab--active');

                // TODO add css3 opacity transition
                // toggle content items
                self.$items.removeClass('chop__item--active');
                $item.addClass('chop__item--active');

            }, $item);


            // set current item
            root.currentItem = index+1;

        },

        checkNavigationMinWidth: function( recalculateMinWidth ) {

            var self = this;
            var root = this.root;

            // calculate min width only if needed
            if( typeof( self.tabsMinWidth ) === 'undefined' || recalculateMinWidth ) {

                self.tabsMinWidth = 0;
                self.$tabs.each(function(){
                    self.tabsMinWidth += $(this).outerWidth(true);
                });

                // add some pixels in options for browser rounding errors while resizing the page
                self.tabsMinWidth += root.options.tabs.tabMinWidthRoundingErrorAddon;

            }

            console.log( 'tabs min-width = ' + self.tabsMinWidth + ' | element width = ' + root.$element.width() );

            if( self.tabsMinWidth > root.$element.width() ) {
                root.$element.trigger('reached.minwidth.tabs.chop');
                return false;
            }

            return true;

        },

        destroy: function() {

            var root = this.root;

            // remove classes
            root.$element.removeClass('chop--tabs');

            // remove listeners
            root.$element.off('click.navigation.tabs.chop');

            // remove elements
            delete this.$tabs;
            delete this.$items;
            delete this.tabsMinWidth;

        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);