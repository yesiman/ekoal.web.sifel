(function ()
{
    'use strict';

    angular
        .module('app.planifs.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.planifs_edit', {
            url      : '/planifs/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/planifs/edit/edit.html',
                    controller : 'PlanifsEditController as vm'
                }
            },
            resolve  : {
                planifResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                        return apiResolver.resolve('planifs.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                    
                }
            }
        });

         

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/planifs/edit');

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