(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'accordion',
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

            root.wrapEvents('init.accordion.chop', function() {

                // set accordion style class
                root.$element.addClass('chop--accordion');

                // init elements
                self.$items = root.$element.find('.chop__item');

                // open initial item
                self.close();
                self.open( root.currentItem-1, 0 );

                // init listeners
                self.initListeners();

            });
        },

        initListeners: function() {
            var self = this;
            var root = this.root;

            root.$element.on('click.item.accordion.chop', '.chop__header', function(e) {
                console.log('item clicked');
                e.preventDefault();

                // prevent multiple calls
                if( self.isActive ) {
                    return;
                }

                self.isActive = true;
                var $item = $(this).closest('.chop__item');
                var index = self.$items.index( $item );

                // check if current item is already open
                if( $item.hasClass('chop__item--active') ) {

                    // close active item
                    self.close( index );

                } else {

                    // close others and open clicked item
                    self.close();
                    self.open( index );

                }

                // reset active flag
                setTimeout(function() {
                    self.isActive = false;
                }, self.getDuration());
            });
        },

        open: function( index, duration ) {
            var self = this;
            var root = this.root;
            var $item = self.$items.eq( index );
            var $content = $item.find( '.chop__content' );
            duration = self.getDuration( duration );

            // open clicked item and wrap events
            root.wrapEvents('open.accordion.chop', function() {

                // open item
                $item.addClass('chop__item--opening');

                // init opening animation
                $content.slideDown(duration, function() {

                    $item.addClass('chop__item--active')
                        .removeClass('chop__item--opening');

                });

            }, $item);
        },

        close: function( index, duration ) {
            var self = this;
            var root = this.root;
            duration = self.getDuration( duration );

            root.$element.find('.chop__item--active').each(function() {

                var $item = $(this);
                var $content = $item.find('.chop__content');

                root.wrapEvents('close.accordion.chop', function() {

                    // close active item
                    $item.addClass('chop__item--closing');

                    // init closing animation
                    $content.slideUp(duration, function() {
                        $item.removeClass('chop__item--active chop__item--closing');
                    });

                }, $item);

            });
        },

        getDuration: function( duration ) {
            var root = this.root;

            // set default duration if not explicitly set
            if( typeof(duration) === 'undefined' || !$.isNumeric(duration) || duration < 0 ) {
                return root.options[config.module].duration;
            }

            return duration;
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