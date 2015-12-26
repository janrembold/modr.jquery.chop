/**
 * FEATURES
 *
 * Accordion opening/closing (jquery/css transition?) - css classes before/during animation
 * initialize callback
 * global hooks
 * before/after event callbacks
 * scroll to top - special method for top calculation
 * tabs fallback/alternative
 * historyAPI
 *
 * move destroy function (for all modules) to jquery wrapper
 *
 */

(function($) {
    'use strict';

    // the modules configuration object
    var config = {
        plugin: 'chop',
        module: 'core',
        wrapper: 'jquery',
        prio: 10,
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
            console.log('init core');

            var root = this.root;

            // init start item
            this.setStartItem();

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

            console.log('start with item #'+root.options.core.start);

            //root.modules.tabs.init();
            root.modules.accordion.init();

            // show accordion
            root.$element.removeClass(root.options.core.loadingClass);
        },

        setStartItem: function() {
            var root = this.root;

            // set start option
            root.wrapEvents('set.start.chop', function() {

                // override start option with data attribute "data-start"
                var start = root.$element.data('start');
                if( $.isNumeric(start) && start > 0 ) {
                    root.options.core.start = start;
                }

            });

            console.log('set current item to '+root.options.core.start);

            // set current item
            root.currentItem = root.options.core.start;
        },

        destroy: function() {
            console.log('exec destroy in core');

            // delete variables
            delete this.currentItem
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);