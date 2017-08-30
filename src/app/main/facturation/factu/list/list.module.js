(function ()
{
    'use strict';

    angular
        .module('app.factu.list', ['ui.grid.pagination'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.factu_list', {
            url      : '/factu/list',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/facturation/factu/list/list.html',
                    controller : 'FactuListController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/factu/list');

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