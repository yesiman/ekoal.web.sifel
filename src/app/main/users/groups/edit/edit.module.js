(function ()
{
    'use strict';

    angular
        .module('app.users.groups.edit', ['color.picker'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.users_groups_edit', {
            url      : '/users/groups/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/users/groups/edit/edit.html',
                    controller : 'UsersGroupsEditController as vm'
                }
            },
            resolve  : {
                groupResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('productsGroups.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }  
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/users/groups/edit');

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