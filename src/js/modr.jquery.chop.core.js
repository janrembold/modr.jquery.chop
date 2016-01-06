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
            onTypeDecision: null,
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

            var self = this;
            var root = this.root;

            // init start item
            self.setStartItem();

            // init chop type to load
            self.setStartType();

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

        setStartType: function() {

            var self = this;
            var root = this.root;

            if( $.isFunction( root.options.core.onTypeDecision ) ) {

                // do some special type handling
                root.options.core.onTypeDecision();

            } else {

                // start default handling
                root.wrapEvents('init.core.chop', function() {

                    // TODO add data-type override
                    var type = root.$element.data('type') || root.options.core.type;

                    switch( type ) {
                        case DisplayType.TABS:
                            root.modules.tabs.init();
                            break;

                        case DisplayType.ACCORDION:
                            root.modules.accordion.init();
                            break;

                        case DisplayType.HYBRID:
                            self.initHybrid();
                            break;

                        default:
                            throw 'Unknown display type: ' + type;
                    }

                });

            }

            // resize event?
            // min-breite der tabs

        },

        initHybrid: function() {

            var root = this.root;

            root.modules.tabs.init();

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