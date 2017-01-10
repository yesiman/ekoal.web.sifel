(function ()
{
    'use strict';

    angular
        .module('app.planifs', [
            'app.planifs.edit','app.planifs.list'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
            
    }
})();