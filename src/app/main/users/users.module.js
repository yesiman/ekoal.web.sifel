(function ()
{
    'use strict';

    angular
        .module('app.users', [
            'app.users.list','app.users.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
            /*msNavigationServiceProvider.saveItem('users', {
                title : 'UTILISATEURS',
                group : true,
                weight: 1,
                hidden: function ()
                {
                    return true; // must be a boolean value
                }
            });
            msNavigationServiceProvider.saveItem('users.list', {
                title : 'Liste',
                icon  : 'icon-view-list',
                state    : 'app.users_list',
                weight: 1,
                hidden: function ()
                {
                    return true; // must be a boolean value
                }
            });*/
     
    }
})();