(function ()
{
    'use strict';

    angular
        .module('app.rules.edit', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.rules_edit', {
            url      : '/rules/edit',
            params : {
                id:null,
                prod:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/rules/edit/edit.html',
                    controller : 'RulesEditController as vm'
                }
            },
            resolve  : {
                ruleResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                        return apiResolver.resolve('rules.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }
                }
            }
        });

         

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/rules/edit');

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