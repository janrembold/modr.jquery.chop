(function($) {
    'use strict';

    var config = {
        plugin: 'chop',
        module: 'url',
        defaults: {
            active: true,
            urlencode: false
        }
    };

    // the modules constructor
    function Plugin( rootContext ) {
        this.root = rootContext;

        var self = this;
        var root = this.root;
        var param = root.$element.data('param');

        if( root.options.url.active && param && param !== '' && self.historyAvailable() ) {
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

                    root.currentItem = params[self.param];

                    console.log('found start index in url param "'+self.param+'" = '+params[self.param]);
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
                console.log('after.open.accordion.chop');

                clearInterval( self.timeout );
                self.set( self.$items.index(this)+1 );
            });

            self.$items.on('after.close.accordion.chop', function() {

                // wait for possible open event before removing param
                clearInterval( self.timeout );
                self.timeout = setTimeout(function() {
                    console.log('after.close.accordion.chop');
                    self.remove();
                }, 250);

            });

            // tabs listener
            self.$items.on('after.open.tab.chop', function() {
                console.log('after.open.tab.chop');

                self.set( self.$items.index(this)+1 );
            });

        },

        set: function( id ) {

            var self = this;
            var params = self.deparam();

            if( typeof(params[self.param]) === 'undefined' || params[self.param] !== id ) {
                params[self.param] = id;
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

            var root = this.root;
            var params = $.param( paramObject );

            // urlencode the params
            if( root.options.core.urlencode ) {
                params = urlencode(params);
            }

            //TOD add anchor support

            // replace history state
            history.replaceState(null, '', '?' + params);

            console.log( paramObject );
            console.log( params );

        },

        deparam: function() {
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
            console.log('exec destroy in url');

            clearInterval( self.timeout );

            // delete variables
            delete this.param;
            delete this.$items;
            delete this.timeout;
        }

    };

    // extend plugins prototype
    $.extend( Plugin.prototype, methods );

    // store module for modr
    modr.registerPlugin( config, Plugin );

})(jQuery);