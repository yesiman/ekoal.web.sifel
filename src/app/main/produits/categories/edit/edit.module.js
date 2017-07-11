(function ()
{
    'use strict';

    angular
        .module('app.produits.categories.edit', ['color.picker'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.produits_categories_edit', {
            url      : '/produits/categories/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/produits/categories/edit/edit.html',
                    controller : 'ProduitsCategoriesEditController as vm'
                }
            },
            resolve  : {
                groupResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('productsCategories.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }  
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/produits/categories/edit');

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