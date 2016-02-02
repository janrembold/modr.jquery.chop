(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'url',
        defaults: {
            active: true,
            urlencode: false,
            onDeparam: null
        }
    };

    // the modules constructor
    function Module( rootContext, options ) {

        var self = this;
        var root = self.root = rootContext;
        self.options = options;
        var param = root.$element.data('param');

        if( self.options.active && param && param !== '' && self.historyAvailable() ) {
            self.param = param;
            self.init();
        }

    }

    // the modules methods
    var methods = {

        init: function() {

            var self = this;
            var root = this.root;

            self.$items = root.$element.find('.chop__item');

            // set start item from url param
            root.$element.one('before.set.start.chop', function(e) {

                var params = self.deparam();
                if( typeof( params[self.param] ) !== 'undefined' && $.isNumeric(params[self.param]) ) {
                    e.preventDefault();

                    // index visible to end-user is always 1-based, internal index is 0-based
                    root.currentItem = params[self.param] - 1;
                }

            });

            // init listeners for set/unset param
            root.$element.one('ready.'+config.plugin, function() {
                self.initListeners();
            });

        },

        initListeners: function() {

            var self = this;

            // accordion open/close listeners
            self.$items.on('after.open.accordion.chop', function() {

                clearInterval( self.timeout );
                self.set( self.$items.index(this)+1 );

            });

            self.$items.on('after.close.accordion.chop', function() {

                // wait for possible open event before removing param
                clearInterval( self.timeout );
                self.timeout = setTimeout(function() {
                    self.remove();
                }, 250);

            });

            // tabs listener
            self.$items.on('after.open.tab.chop', function() {

                self.set( self.$items.index(this)+1 );

            });

        },

        set: function( index ) {

            var self = this;
            var params = self.deparam();

            if( typeof(params[self.param]) === 'undefined' || params[self.param] !== index ) {

                // index visible to end-user is always 1-based, internal index is 0-based
                params[self.param] = index + 1;
                self.replace( params );

            }

        },

        remove: function() {

            var self = this;
            var params = self.deparam();

            if( typeof(params[self.param]) !== 'undefined' ) {
                delete params[self.param];
                self.replace( params );
            }

        },

        replace: function( paramObject ) {

            var self = this;
            var params = $.param( paramObject );

            // urlencode the params
            if( self.options.urlencode ) {
                params = urlencode(params);
            }

            // replace history state
            history.replaceState(null, '', '?' + params + window.location.hash);

        },

        deparam: function() {

            var self = this;

            // override deparam function
            if( $.isFunction( self.options.onDeparam ) ) {
                return self.options.onDeparam();
            }

            var query = window.location.search.substring(1);
            var vars = query.split('&');
            var params = {};

            for (var i= 0, len=vars.length; i<len; ++i) {
                if( !vars[i] || vars[i] === '' ) {
                    continue;
                }

                var pair = vars[i].split('=');

                if( typeof(params[pair[0]]) === 'undefined' ) {
                    params[pair[0]] = pair[1];
                } else {
                    if ( !$.isArray( params[pair[0]] ) ) {
                        params[pair[0]] = [ params[pair[0]] ];
                    }

                    params[pair[0]].push(pair[1]);
                }
            }

            return params;

        },

        historyAvailable: function() {

            // from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
            var ua = navigator.userAgent;

            // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
            // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
            if ((ua.indexOf('Android 2.') !== -1 ||
                (ua.indexOf('Android 4.0') !== -1)) &&
                ua.indexOf('Mobile Safari') !== -1 &&
                ua.indexOf('Chrome') === -1 &&
                ua.indexOf('Windows Phone') === -1) {
                return false;
            }

            // Return the regular check
            return (window.history && 'pushState' in window.history);

        },

        destroy: function() {

            clearInterval( self.timeout );

            // delete variables
            delete this.param;
            delete this.$items;
            delete this.timeout;

        }

    };

    // extend plugins prototype
    $.extend( Module.prototype, methods );

    // store module for modr
    modr.registerModule( config, Module );

})(jQuery);