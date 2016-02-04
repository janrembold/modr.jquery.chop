(function($) {
    'use strict';

    // the modules configuration object
    var config = {
        plugin: 'chop',
        module: 'hybrid',
        defaults: {
            start: 0,
            type: 'hybrid',
            onTypeDecision: null
        }
    };

    // the modules constructor
    function Module( rootContext, options ) {

        var self = this;
        self.root = rootContext;
        self.options = options;

        // init core module after all modules are locked and loaded
        self.root.$element.one('ready.chop', function() {
            self.init();
        });
    }

    // the modules methods
    var methods = {

        init: function() {

            console.log('core init');

            var self = this;

            // init start item
            self.setStartItem();

            // init chop type to load
            self.setStartType();

        },

        setStartItem: function() {

            var self = this;
            var root = self.root;

            // set default start item
            root.currentItem = self.options.start;

            // set start option
            root.wrapEvents('set.start.chop', function() {

                // override start option with data attribute "data-start"
                var start = root.$element.data('start');
                if( $.isNumeric(start) && start > 0 ) {
                    root.currentItem = start;
                }

            });

        },

        setStartType: function() {

            var self = this;
            var root = this.root;

            if( $.isFunction( self.options.onTypeDecision ) ) {

                // do some special type handling
                self.options.onTypeDecision();

            } else {

                // start default handling
                root.wrapEvents('init.core.chop', function() {

                    // TODO add data-type override
                    var type = root.$element.data('type') || self.options.type;

                    switch( type ) {
                        case 'tabs':
                            root.modules.tabs.init();
                            break;

                        case 'accordion':
                            root.modules.accordion.init();
                            break;

                        case 'hybrid':
                            self.initHybridTabs();
                            break;

                        default:
                            throw 'Unknown display type: ' + type;
                    }

                });

            }

        },

        initHybridTabs: function() {

            var self = this;
            var root = this.root;

            // destroy tabs if width is insufficient
            root.$element.one('insufficient.width.tabs.chop', function(e, minWidth) {
                root.modules.tabs.destroy();
                self.initHybridAccordion( minWidth );
            });

            root.modules.chop.tabs.init();

        },

        initHybridAccordion: function( minWidth ) {

            var self = this;
            var root = this.root;

            $(window).on('resize.hybrid', function() {

                if( root.$element.width() >= minWidth  ) {

                    root.modules.accordion.destroy();
                    self.initHybridTabs();
                    $(window).off('resize.hybrid');

                }

            });

            root.modules.accordion.init();

        },

        destroy: function() {

            var root = this.root;

            // delete variables
            delete root.currentItem;

            // remove listeners
            $(window).off('resize.hybrid');
            root.$element.off('insufficient.width.tabs.chop');

        }

    };

    // extend plugins prototype
    $.extend( Module.prototype, methods );

    // store module for modr
    modr.registerModule( config, Module );

})(jQuery);