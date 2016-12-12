(function ()
{
    'use strict';

    angular
        .module('app.planifs', [
            'app.planifs.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
            msNavigationServiceProvider.saveItem('planifs', {
                title : 'PLANIFICATIONS',
                group : true,
                weight: 1
            });
            msNavigationServiceProvider.saveItem('planifs.edit', {
                title : 'Nouvelle',
                icon  : 'icon-view-list',
                state    : 'app.planifs_edit',
                weight: 1
            });
     
    }
})();