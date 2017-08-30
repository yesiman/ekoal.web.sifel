(function ()
{
    'use strict';

    angular
        .module('app.facturation', [
            'app.factu.edit','app.factu.list',
            'app.clients.list','app.clients.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();