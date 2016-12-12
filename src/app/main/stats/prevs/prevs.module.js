(function ()
{
    'use strict';

    angular
        .module('app.stats.prevs', ['chart.js'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.stats_prevs', {
            url      : '/stats/prevs',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/stats/prevs/prevs.html',
                    controller: 'StatsPrevsController as vm'
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/stats/prevs');

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