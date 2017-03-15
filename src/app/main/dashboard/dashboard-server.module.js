(function ()
{
    'use strict';

    angular
        .module('app.dashboards.server',
            [
                // 3rd Party Dependencies
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider,msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.dashboards_server', {
            url      : '/dashboard-server',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboard/dashboard-server.html',
                    controller : 'DashboardServerController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return {};
                }
            },
            bodyClass: 'dashboard-server'
        });

        // Api
        //msApiProvider.register('dashboard.server', ['app/data/dashboard/server/data.json']);


        

    }

})();