(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'accordion',
        prio: 250,
        defaults: {
            duration: 400
        }
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;
    }

    // the modules methods
    var methods = {

        init: function() {
            console.log('init accordion');

            var self = this;
            var root = this.root;

            this.root.wrapEvents('init.accordion.chop', function() {

                // set accordion style class
                root.$element.addClass('chop--accordion');

                // init elements
                self.$items = root.$element.find('.chop__item');

                // init listeners
                self.initListeners();

            });
        },

        initListeners: function() {
            var self = this;
            var root = this.root;

            root.$element.on('click.item.accordion.chop', '.chop__header', function(e) {
                e.preventDefault();
                console.log('item clicked');

                if( self.isActive ) {
                    return;
                }

                self.isActive = true;

                var $item = $(this).closest('.chop__item');
                if( $item.hasClass('chop__item--active') ) {

                    // close active item
                    self.closePanels( $item );

                } else {

                    // open item and close others
                    self.closePanels( root.$element.find('.chop__item--active') );
                    self.openPanel( $item );

                }

                // reset active flag
                setTimeout(function() {
                    self.isActive = false;
                }, root.options[config.module].duration);

            });
        },

        openPanel: function( $item ) {
            var root = this.root;
            var $content = $item.find('.chop__content');

            root.wrapEvents('open.accordion.chop', function() {

                // open item
                $item.addClass('chop__item--opening');

                $content.slideDown(root.options[config.module].duration, function() {

                    $item.addClass('chop__item--active')
                        .removeClass('chop__item--opening');

                });

            }, $item);
        },

        closePanels: function( $items ) {
            var root = this.root;

            $items.each(function() {

                var $item = $(this);
                var $content = $item.find('.chop__content');

                // close active item
                $item.trigger('before.close.accordion.chop')
                    .addClass('chop__item--closing');

                $content.slideUp(root.options[config.module].duration, function() {
                    $item.removeClass('chop__item--active chop__item--closing')
                        .trigger('after.close.accordion.chop');
                });

            });
        },

        destroy: function() {
            console.log('exec destroy in tabs');

            // remove classes
            root.$element.removeClass('chop--accordion');

            // remove listeners
            root.$element.off('click.item.accordion.chop');

            // delete variables
            delete this.isActive;
            delete this.$items;

        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);