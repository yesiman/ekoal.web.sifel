(function ()
{
    'use strict';

    angular
        .module('app.produits.condit.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.produits_condit_edit', {
            url      : '/produits/condit/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/produits/condit/edit/edit.html',
                    controller : 'ProduitsConditEditController as vm'
                }
            },
            resolve  : {
                groupResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('productsCondits.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }  
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/produits/condit/edit');

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