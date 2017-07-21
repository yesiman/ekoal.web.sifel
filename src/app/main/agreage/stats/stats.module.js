(function ()
{
    'use strict';

    angular
        .module('app.stats.agreag', ['chart.js','ngCsv'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.stats_agreag', {
            url      : '/stats/agreag',
            params : {
                id:null,
                selectedItems:[],
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/agreage/stats/stats.html',
                    controller: 'StatsAgreagController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/agreage/stats');

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