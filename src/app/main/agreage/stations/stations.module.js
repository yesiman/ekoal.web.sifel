(function ()
{
    'use strict';

    angular
        .module('app.stations', [
            'app.stations.list','app.stations.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();