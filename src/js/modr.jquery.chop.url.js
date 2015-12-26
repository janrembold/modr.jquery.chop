(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'url',
        prio: 1000
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;

        var self = this;
        var root = this.root;

        // prepare url module after all modules are locked and loaded
        root.$element.one('ready.'+config.plugin, function() {

            // grab data attribute "data-param" for later usage
            self.param = root.$element.data('param');
            if( self.param && self.param !== '' ) {
                self.init();
            } else {
                self.destroy();
            }

        });

    }

    // the modules methods
    var methods = {

        init: function() {
            console.log('init url chopper');

            var self = this;
            var root = this.root;

            // set start item from url param
            root.$element.one('before.set.start.chop', function(e) {

                var params = self.deparam();
                if( typeof( params[self.param] ) !== 'undefined' ) {
                    e.preventDefault();
                    root.options.core.start = params[self.param];
                }

            });

            // init listeners for set/unset param
            self.initListeners();
        },

        initListeners: function() {
            var root = this.root;

            // set new param
            root.$element.on('', function() {

            });
        },

        deparam: function() {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            var params = {};

            for (var i= 0, len=vars.length; i<len; ++i) {
                var pair = vars[i].split('=');

                if( typeof(params[pair[0]]) === 'undefined' ) {
                    params[pair[0]] = pair[1];
                } else {
                    if ( !$.isArray( params[pair[0]] ) ) {
                        params[pair[0]] = [ params[pair[0]] ]
                    }

                    params[pair[0]].push(pair[1]);
                }
            }

            return params;
        },

        destroy: function() {
            console.log('exec destroy in url');

            // delete variables
            delete this.param;
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);