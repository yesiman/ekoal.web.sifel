(function ()
{
    'use strict';

    angular
        .module('app.bons.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.bons_edit', {
            url      : '/bons/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/agreage/bons/edit/edit.html',
                    controller : 'BonsEditController as vm'
                }
            },
            resolve  : {
                bonResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('bons.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                   
                },
                stationsResolv: function (apiResolver)
                {
                    return apiResolver.resolve('stations.getAll@get', {pid:1,nbp:1000});
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/bons/edit');

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