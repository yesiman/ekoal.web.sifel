(function ()
{
    'use strict';

    angular
        .module('app.users.list', ['ui.grid.pagination'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.users_list', {
            url      : '/users/list',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/users/list/list.html',
                    controller : 'UsersListController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/users/list');

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