(function ()
{
    'use strict';

    angular
        .module('app.stations.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.stations_edit', {
            url      : '/stations/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/agreage/stations/edit/edit.html',
                    controller : 'StationsEditController as vm'
                }
            },
            resolve  : {
                stationResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('stations.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                   
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/stations/edit');

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