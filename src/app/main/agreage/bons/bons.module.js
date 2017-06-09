(function ()
{
    'use strict';

    angular
        .module('app.bons', [
            'app.bons.list','app.bons.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();