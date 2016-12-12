(function ()
{
    'use strict';

    angular
        .module('app.stats', [
            'app.stats.prevs'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
            msNavigationServiceProvider.saveItem('stats', {
                title : 'STATISTIQUES',
                group : true,
                weight: 1
            });
            msNavigationServiceProvider.saveItem('stats.prevs', {
                title : 'Prévisions',
                icon  : 'icon-view-list',
                state    : 'app.stats_prevs',
                weight: 1
            });
     
    }
})();