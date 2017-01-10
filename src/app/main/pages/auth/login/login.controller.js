(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController',LoginController);

    /** @ngInject */
    function LoginController($scope,$state, api,$rootScope,$http,$cookies,msNavigationService, dynamicMenu)
    {
        //var vm = this;
        // Data
        $scope.user = {
            login:"",
            pass:""
        };
        // Methods
        $scope.login = function() {
            api.users.login.post({ user:$scope.user },
                // Success
                function (response)
                {
                    if (response.success)
                    {
                        $rootScope.user = response;
                        dynamicMenu.init();
                        $cookies.putObject("appAuth",response);
                        $http.defaults.headers.common['x-access-token'] = response.token;
                        $state.go("app.dashboards_server");
                    }
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        //////////
    }
})();