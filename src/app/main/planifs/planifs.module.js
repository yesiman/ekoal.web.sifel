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
        
            msNavigationServiceProvider.saveItem('planifs', {
                title : 'PLANIFICATIONS',
                group : true,
                weight: 1
            });
            
            msNavigationServiceProvider.saveItem('planifs.list', {
                title : 'Liste',
                icon  : 'icon-view-list',
                state    : 'app.planifs_list',
                weight: 1,
            });
            msNavigationServiceProvider.saveItem('planifs.edit', {
                title : 'Nouveau',
                icon  : 'icon-plus-circle-outline',
                state    : 'app.planifs_edit',
                weight: 1
            });
    }
})();