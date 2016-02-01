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
    function Module( rootContext, options ) {

        var self = this;
        self.root = rootContext;
        self.options = options;
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

                // check navigation min width for hybrid mode only
                if( root.options.core.type === 'hybrid' ) {
                    if( !self.checkNavigationMinWidth( true ) ) {
                        return;
                    }
                }

                // open current item
                self.open( root.currentItem );

                // remove loading class
                root.$element.removeClass( 'chop--loading' );

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
            $(window).on( root.options.tabs.resizeEvent+'.tabs.chop', function() {

                self.checkNavigationMinWidth();
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
            root.currentItem = index;
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

            // trigger width event
            if( self.tabsMinWidth > root.$element.width() ) {
                root.$element.trigger('insufficient.width.tabs.chop', [ self.tabsMinWidth ]);
                return false;
            } else {
                root.$element.trigger('enough.width.tabs.chop', [ self.tabsMinWidth ]);
                return true;
            }
        },

        destroy: function() {

            var root = this.root;

            // add loading class
            root.$element.addClass( 'chop--loading' );

            // remove classes
            root.$element.removeClass('chop--tabs');
            this.$tabs.removeClass('chop__tab--active');
            this.$items.removeClass('chop__item--active');

            // remove listeners
            root.$element.off( 'click.navigation.tabs.chop' );
            $(window).off( root.options.tabs.resizeEvent+'.tabs.chop' );

            // remove elements
            delete this.$tabs;
            delete this.$items;
            delete this.tabsMinWidth;
        }

    };

    // extend plugins prototype
    $.extend( Module.prototype, methods );

    // store module for modr
    modr.registerModule( config, Module );

})(jQuery);