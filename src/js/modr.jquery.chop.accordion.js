(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'accordion',
        defaults: {
            autoClose: true,
            duration: 300,
            scroll: true,
            scrollDuration: 500,
            onScrollAddTopOffset: function() { return 0; }
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

            root.wrapEvents('init.accordion.chop', function() {

                // set accordion style class
                root.$element.addClass('chop--accordion');

                // init elements
                self.$items = root.$element.find('.chop__item');

                // open initial item
                self.close();
                self.open( root.currentItem, 0 );

                // remove loading class
                root.$element.removeClass( 'chop--loading' );

                // init listeners
                self.initListeners();

            });

        },

        initListeners: function() {

            var self = this;
            var root = this.root;

            root.$element.on('click.item.accordion.chop', '.chop__header', function(e) {

                e.preventDefault();

                // prevent multiple calls
                if( self.isActive ) {
                    return;
                }

                self.isActive = true;
                var $item = $(this).closest('.chop__item');
                var index = self.$items.index( $item );
                var duration = root.options.accordion.duration;

                // open element and close others
                self.open( index, duration );

                // reset active flag
                setTimeout(function() {
                    self.isActive = false;
                }, duration);

            });

        },

        open: function( index, duration ) {

            var self = this;
            var root = this.root;
            var $item = self.$items.eq( index );
            var nextTopPosition = self.predictHeaderTop( index );

            // check animation duration
            if( typeof(duration) === 'undefined' || !$.isNumeric(duration) ) {
                duration = root.options.accordion.duration;
            }

            // close items
            self.close( index, duration );

            // don't open item again
            if( $item.hasClass('chop__item--active') ) {
                return;
            }

            var $content = $item.find( '.chop__content' );

            // open clicked item and wrap events
            root.wrapEvents('open.accordion.chop', function() {

                // open item
                $item.addClass('chop__item--opening');

                // init opening animation
                $content.slideDown(duration, function() {

                    $item.addClass('chop__item--active')
                        .removeClass('chop__item--opening');

                    // reset inline css from slideDown
                    $(this).css('display', '');

                });

                // start scrolling if necessary
                self.animateScroll( nextTopPosition, root.options.accordion.scrollDuration );


            }, $item);

            // set global current item index
            root.currentItem = index;
        },

        close: function( index, duration ) {

            var self = this;
            var root = this.root;

            // check animation duration
            if( typeof(duration) === 'undefined' || !$.isNumeric(duration) ) {
                duration = root.options.accordion.duration;
            }

            // close all open items
            root.$element.find('.chop__item--active').each(function() {

                var $item = $(this);
                var $content = $item.find('.chop__content');

                // if autoClose is disabled only close item if clicked
                if( !root.options.accordion.autoClose && $item.get(0) !== self.$items.eq( index).get(0) ) {
                    return true;
                }

                root.wrapEvents('close.accordion.chop', function() {

                    // close active item
                    $item.addClass('chop__item--closing');

                    // init closing animation
                    $content.slideUp(duration, function() {
                        $item.removeClass('chop__item--active chop__item--closing');

                        // reset inline css from slideUp
                        $(this).css('display', '');
                    });

                }, $item);

            });

        },

        predictHeaderTop: function( index ) {

            var self = this;
            var root = this.root;

            // is scrolling active or is item just closing or autoClose is disabled
            if( !root.options.accordion.scroll ||
                !root.options.accordion.autoClose ||
                self.$items.eq(index).hasClass('chop__item--active') )
            {
                return -1;
            }

            // only previous and open items are relevant
            var $item = self.$items.eq(index);
            var $prevItems = $item.prevAll('.chop__item--active');
            if( $prevItems.length > 0 ) {

                var totalOpenContentHeight = 0;
                var nextItemTopOffset = $item.offset().top;

                $prevItems.each(function() {
                    var $content = $(this).find('.chop__content');
                    totalOpenContentHeight += $content.innerHeight();
                });

                return nextItemTopOffset - totalOpenContentHeight + root.options.accordion.onScrollAddTopOffset();

            }

            return -1;

        },

        animateScroll: function( top, duration ) {

            if(top < 0) {
                return;
            }

            // animate scrolling
            $('html, body').animate({
                scrollTop: top
            }, duration);

        },

        destroy: function() {

            var root = this.root;

            // add loading class
            root.$element.addClass( 'chop--loading' );

            // remove classes
            root.$element.removeClass('chop--accordion');
            this.$items.removeClass('chop__item--active');

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