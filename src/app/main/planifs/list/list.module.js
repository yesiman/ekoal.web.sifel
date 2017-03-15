(function ()
{
    'use strict';

    angular
        .module('app.planifs.list', ['ui.grid.pagination'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.planifs_list', {
            url      : '/planifs/list',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/planifs/list/list.html',
                    controller : 'PlanifsListController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/planifs/list');

/*msNavigationServiceProvider.saveItem('users', {
            title : 'UTILISATEURS',
            group : true,
            state    : 'app.users_list',
            weight: 1
        });*/
        // Navigation
        
/*
        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();