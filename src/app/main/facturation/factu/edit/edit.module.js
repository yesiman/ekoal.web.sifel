(function ()
{
    'use strict';

    angular
        .module('app.factu.edit', ['ui.grid.selection'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.factu_edit', {
            url      : '/factu/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/facturation/factu/edit/edit.html',
                    controller : 'FactuEditController as vm'
                }
            },
            resolve: {
                factuResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('facturation.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {
                            bons:[],
                            dateDoc:new Date()
                        }
                    }
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/factu/edit');

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