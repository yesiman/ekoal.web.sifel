(function ()
{
    'use strict';

    angular
        .module('app.opes', [
            'app.opes.list','app.opes.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();