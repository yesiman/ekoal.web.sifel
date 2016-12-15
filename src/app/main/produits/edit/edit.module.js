(function ()
{
    'use strict';

    angular
        .module('app.produits.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.produits_edit', {
            url      : '/produits/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/produits/edit/edit.html',
                    controller : 'ProduitsEditController as vm'
                }
            },
            resolve  : {
                prodResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('products.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                   
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/produits/edit');

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