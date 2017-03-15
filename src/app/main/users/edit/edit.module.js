(function ()
{
    'use strict';

    angular
        .module('app.users.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.users_edit', {
            url      : '/users/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/users/edit/edit.html',
                    controller : 'UsersEditController as vm'
                }
            },
            resolve  : {
                orgasResolv: function (apiResolver)
                {
                    return apiResolver.resolve('orgas.getAll@get', {pid:1,nbp:1000});
                },
                userResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                        return apiResolver.resolve('users.get@get', {'id': $stateParams.id,'withParc':false });
                    }
                    else {
                        return {};
                    }
                    
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/users/edit');

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