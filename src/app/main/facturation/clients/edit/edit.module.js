(function ()
{
    'use strict';

    angular
        .module('app.clients.edit', ['ui.grid.selection'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.clients_edit', {
            url      : '/clients/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/facturation/clients/edit/edit.html',
                    controller : 'ClientsEditController as vm'
                }
            },
            resolve  : {
                clientResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('clients.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                   
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/opes/edit');

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