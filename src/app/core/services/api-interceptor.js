(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('APIInterceptor', APIInterceptor);

    /** @ngInject **/
    function APIInterceptor()
    {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        //var $rootScope = angular.injector(['ng']).get('$rootScope');

        
        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = function ($rootScope,$q)
        {
            var service = {
                response: function(response) {
                    $rootScope.lastValidCall = new Date();
                    return response;
                },
                request: function(config) {
                    return config;
                },
                responseError: function(response) {
                    $rootScope.$broadcast('unauthorized');
                    return response;
                }
            };
            return service;
        };
    }
})();