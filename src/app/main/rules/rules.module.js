(function ()
{
    'use strict';

    angular
        .module('app.rules', [
            'app.rules.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();