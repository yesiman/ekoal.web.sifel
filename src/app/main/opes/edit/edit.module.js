(function ()
{
    'use strict';

    angular
        .module('app.opes.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.opes_edit', {
            url      : '/opes/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/opes/edit/edit.html',
                    controller : 'OpesEditController as vm'
                }
            },
            resolve  : {
                orgaResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id != -1)
                    {
                         return apiResolver.resolve('orgas.get@get', {'id': $stateParams.id });
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