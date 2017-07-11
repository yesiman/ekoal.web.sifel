(function ()
{
    'use strict';

    angular
        .module('app.clients', [
            'app.clients.list','app.clients.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();