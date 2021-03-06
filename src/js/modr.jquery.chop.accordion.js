(function($, undefined) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'accordion',
        defaults: {
            autoClose: true,
            duration: 300,
            scroll: true,
            scrollDuration: 500,
            onScrollAddTopOffset: function() { return 0; },
            predictHeaderTop: null
        },
        dependencies: {
            'helper': [ 'events' ]
        }
    };

    // the modules methods
    modr.registerModule( config, {

        prepare: function() {

            var self = this;

            // overwrite options with data attributes
            if( self.$element.data('auto-close') !== undefined ) {
                self.options.autoClose = self.$element.data('auto-close');
            }

            if( self.$element.data('scroll') !== undefined ) {
                self.options.scroll = self.$element.data('scroll');
            }

            if( self.$element.data('duration') !== undefined ) {
                self.options.duration = self.$element.data('duration');
            }

            if( self.$element.data('scroll-duration') !== undefined ) {
                self.options.scrollDuration = self.$element.data('scroll-duration');
            }
        },

        init: function( openItems ) {

            var self = this;

            // set event helper for later usage
            self.eventHelper = self.root.modules.helper.events;

            // init accordion
            self.eventHelper.wrapEvents('init.accordion.chop', function() {

                // set accordion style class
                self.$element.addClass('chop--accordion');

                // init elements
                self.$items = self.$element.find('.chop__item');

                // trigger possible external items to open (e.g. from URL)
                var externalOpenItems = {};
                self.$element.trigger('open.items.chop', [externalOpenItems]);
                if( typeof(externalOpenItems.openItems) !== 'undefined' ) {
                    openItems = externalOpenItems.openItems;
                }

                // open initial item
                if( typeof(openItems) !== 'undefined' ) {

                    if( !$.isArray(openItems) ) {
                        openItems = [openItems];
                    }

                    // open all pre-selected items
                    for(var i=0, len=openItems.length; i<len; ++i) {
                        self.open( openItems[i], 0 );
                    }
                }

                // init listeners
                self.initListeners();

            });

            // remove loading class
            self.$element.removeClass('chop--loading');
        },

        initListeners: function() {

            var self = this;
            var root = self.root;

            self.$element.on('click.item.accordion.chop', '.chop__header', function(e) {

                e.preventDefault();

                // prevent multiple calls
                if( self.isActive ) {
                    return;
                }

                self.isActive = true;
                var $item = $(this).closest('.chop__item');
                var index = self.$items.index( $item );
                var duration = self.options.duration;

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
            var root = self.root;
            var $item = self.$items.eq( index );
            var nextTopPosition = self.predictHeaderTop( index );

            // check animation duration
            if( typeof(duration) === 'undefined' || !$.isNumeric(duration) ) {
                duration = self.options.duration;
            }

            // close items
            self.close( index, duration );

            // don't open item again
            if( $item.hasClass('chop__item--active') ) {
                return;
            }

            var $content = $item.find( '.chop__content' );

            // open clicked item and wrap events
            self.eventHelper.wrapEvents('open.item.chop', function() {

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
                self.animateScroll( nextTopPosition, duration );

            }, $item);

            // set global current item index
            root.currentItem = index;
        },

        close: function( index, duration ) {

            var self = this;

            // check animation duration
            if( typeof(duration) === 'undefined' || !$.isNumeric(duration) ) {
                duration = self.options.duration;
            }

            // close all open items
            self.$element.find('.chop__item--active').each(function() {

                var $item = $(this);
                var $content = $item.find('.chop__content');

                // if autoClose is disabled only close the active item
                if( !self.options.autoClose && $item.get(0) !== self.$items.eq(index).get(0) ) {
                    return true;
                }

                self.eventHelper.wrapEvents('close.item.chop', function() {

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

            if( $.isFunction( self.options.predictHeaderTop ) ) {
                return self.options.predictHeaderTop();
            }

            // is scrolling active or is item just closing or autoClose is disabled
            if( !self.options.scroll ||
                !self.options.autoClose ||
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

                var scrollTo = nextItemTopOffset - totalOpenContentHeight + self.options.onScrollAddTopOffset();
                if( scrollTo < window.pageYOffset ) {
                    return scrollTo;
                }
            }

            return -1;
        },

        animateScroll: function( top, duration ) {

            var self = this;
            if( !self.options.scroll || top < 0 ) {
                return;
            }

            // animate scrolling
            $('html, body').animate({
                scrollTop: top
            }, duration);
        },

        destroy: function() {

            var self = this;

            // add loading class
            self.$element.addClass( 'chop--loading' );

            // remove classes
            self.$element.removeClass('chop--accordion');
            self.$items.removeClass('chop__item--active');

            // remove listeners
            self.$element.off('click.item.accordion.chop');

            // delete variables
            delete self.isActive;
            delete self.$items;
            delete self.eventHelper;
        }

    });

})(jQuery);
