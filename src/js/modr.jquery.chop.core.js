(function($) {
    'use strict';

    // the modules configuration object
    var config = {
        plugin: 'chop',
        module: 'core',
        wrapper: 'jquery',
        defaults: {
            loadingClass: 'chop--loading',
            start: 1
        }
    };

    // the modules constructor
    function Plugin( globalContext ) {
        this.root = globalContext;
        var self = this;

        // init core module after all modules are locked and loaded
        this.root.$element.one('ready.'+config.plugin, function() {
            self.init();
        });
    }

    // the modules methods
    var methods = {

        init: function() {
            var root = this.root;

            // init start item
            this.setStartItem();

            // TODO remove this - this is only a quickfix for showing different modules on startup
            if( root.$element.data('type') === 'tabs' ) {
                root.modules.tabs.init();
            } else {
                root.modules.accordion.init();
            }

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
            root.$element.removeClass(root.options.core.loadingClass);
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

            console.log('start with item #'+root.currentItem);
        },

        destroy: function() {
            console.log('exec destroy in core');

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