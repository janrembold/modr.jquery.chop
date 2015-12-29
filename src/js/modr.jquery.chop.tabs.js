/**
 * TODO
 * Test nested chops
 *
 */

(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'tabs'
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;
    }

    // the modules methods
    var methods = {

        init: function() {
            console.log('init tabs');

            var self = this;
            var root = this.root;

            root.wrapEvents('init.tabs.chop', function() {

                // set tabs style class
                root.$element.addClass('chop--tabs');

                // init elements
                self.$tabs = root.$element.find('.chop__tab');
                self.$items = root.$element.find('.chop__item');

                // open current item
                self.open( root.currentItem-1 );

                // init listeners
                self.initListeners();

            });

        },

        initListeners: function() {
            var self = this;
            var root = this.root;

            root.$element.on('click.navigation.tabs.chop', '.chop__tab', function(e) {
                e.preventDefault();
                console.log('tab clicked');

                self.open( self.$tabs.index( $(this) ) );
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

        destroy: function() {
            console.log('exec destroy in tabs');

            var root = this.root;

            // remove classes
            root.$element.removeClass('chop--tabs');

            // remove listeners
            root.$element.off('click.navigation.tabs.chop');

            // remove elements
            delete this.$tabs;
            delete this.$items;
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);