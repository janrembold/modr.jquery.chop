(function($) {
    'use strict';

    // the choppers display type
    var DisplayType = {
        ACCORDION: 'accordion',
        TABS:      'tabs',
        HYBRID:    'hybrid'
    };

    // the modules configuration object
    var config = {
        plugin: 'chop',
        module: 'core',
        wrapper: 'jquery',
        defaults: {
            start: 1,
            type: DisplayType.HYBRID,
            loadingClass: 'chop--loading'
        }
    };

    // the modules constructor
    function Plugin( globalContext ) {
        var root = this.root = globalContext;
        var self = this;

        // init core module after all modules are locked and loaded
        root.$element.one('ready.'+config.plugin, function() {
            self.init();
        });
    }

    // the modules methods
    var methods = {

        init: function() {
            var root = this.root;

            // init start item
            this.setStartItem();

            root.wrapEvents('init.core.chop', function() {

                // TODO remove this - this is only a quickfix for showing different modules on startup
                if( root.$element.data('type') === 'tabs' ) {
                    root.modules.tabs.init();
                } else {
                    root.modules.accordion.init();
                }

            });

            // TODO add some more intelligent features depending on breakpoints and/or tabbed nav min-width
            //if( typeof(enquire) === 'undefined' ) {
            //    throw 'enquire.js was not initialized';
            //}
            //
            //enquire.register('screen and (min-width:768px)', {
            //    match: function() {
            //
            //    },
            //    unmatch: function() {
            //
            //    }
            //});

            // show accordion
            if( root.options.core.loadingClass && root.options.core.loadingClass !== '' ) {
                root.$element.removeClass(root.options.core.loadingClass);
            }
        },

        setStartItem: function() {

            var root = this.root;

            // set default start item
            root.currentItem = root.options.core.start;

            // set start option
            root.wrapEvents('set.start.chop', function() {

                // override start option with data attribute "data-start"
                var start = root.$element.data('start');
                if( $.isNumeric(start) && start > 0 ) {
                    root.currentItem = start;
                }

            });

        },

        destroy: function() {

            var root = this.root;

            // delete variables
            delete root.currentItem;

        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);