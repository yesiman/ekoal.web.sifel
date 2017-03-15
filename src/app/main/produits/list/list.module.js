(function ()
{
    'use strict';

    angular
        .module('app.produits.list', ['ui.grid.pagination'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.produits_list', {
            url      : '/produits/list',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/produits/list/list.html',
                    controller : 'ProduitsListController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/produits/list');

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