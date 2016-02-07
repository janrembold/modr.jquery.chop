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

    // the modules methods
    modr.registerModule( config, {

        prepare: function() {

            var self = this;
            var param = self.$element.data('param');

            if( self.options.active && param && param !== '' && self.historyAvailable() ) {
                self.param = param;
                self.init();
            }
        },

        init: function() {

            var self = this;
            self.$items = self.$element.find('.chop__item');

            // set start item from url param
            self.$element.one('open.items.chop', function(e, returnObject) {
                e.stopImmediatePropagation();

                var params = self.deparam();
                if( typeof( params[self.param] ) !== 'undefined' ) {
                    e.preventDefault();

                    // clean params
                    self.normalizeParams( params );

                    // index visible to end-user is always 1-based, internal index is 0-based
                    returnObject.openItems = params[self.param];
                }

            });

            // init listeners for set/unset param
            self.$element.one('ready.'+config.plugin, function() {
                self.initListeners();
            });

        },

        initListeners: function() {

            var self = this;

            self.$items.on('after.open.item.chop', function() {

                clearInterval( self.timeout );
                self.set( self.$items.index(this) );

            });

            self.$items.on('after.close.item.chop', function() {

                var index = self.$items.index(this);

                // wait for possible open event before removing param
                clearInterval( self.timeout );
                self.timeout = setTimeout(function() {
                    self.remove( index );
                }, 250);

            });

        },

        set: function( index ) {

            var self = this;
            var params = self.deparam();
            self.normalizeParams( params );

            // verify that param is not set already
            if( $.inArray(index, params[self.param]) === -1 ) {

                params[self.param].push( index );
                self.replace( params );

            }
        },

        remove: function( index ) {

            var self = this;
            var params = self.deparam();
            self.normalizeParams( params );

            var paramIndex = $.inArray(index, params[self.param]);
            if( paramIndex > -1 ) {

                params[self.param].splice( paramIndex, 1 );
                self.replace( params );
            }

        },

        replace: function( paramObject ) {

            var self = this;
            var params = $.param( paramObject, true );

            // urlencode the params
            if( self.options.urlencode ) {
                params = urlencode(params);
            }

            // prevent lonely "?" in URL and set possible hash
            params = (params === '') ? window.location.pathname : '?' + params;
            params += window.location.hash;

            // replace history state
            window.history.replaceState({}, document.title, params);

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

        normalizeParams: function( params ) {

            var self = this;

            if( typeof( params[ self.param ] ) === 'undefined' ) {

                // create new and empty array
                params[ self.param ] = [];
            } else {

                // params must be an array
                if( !$.isArray( params[ self.param ] ) ) {
                    params[ self.param ] = [ params[ self.param ] ];
                }

                // parse all params
                for( var i=0, len=params[ self.param ].length; i<len; ++i ) {
                    params[ self.param ][i] = parseInt(params[ self.param ][i]);
                }
            }
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

            var self = this;

            clearInterval( self.timeout );

            self.$items.off('after.open.accordion.chop after.close.accordion.chop after.open.tab.chop');

            // delete variables
            delete self.param;
            delete self.$items;
            delete self.timeout;

        }

    });

})(jQuery);