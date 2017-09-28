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
            login:"nretheve@hotmail.fr",
            pass:"!nico2017"
        };
        // Methods
        $scope.login = function() {
            $scope.badCredentials = false;
            api.users.login.post({ user:$scope.user },
                // Success
                function (response)
                {
                    if (response.success)
                    {
                        $rootScope.user = response;
                        $rootScope.filters = [];
                        dynamicMenu.init();
                        $cookies.putObject("appAuth",response);
                        $http.defaults.headers.common['x-access-token'] = response.token;
                        $state.go("app.dashboards_server");
                    }
                    else {
                        $scope.badCredentials = true;
                    }
                },
                // Error
                function (response)
                {
                    $scope.badCredentials = true;
                    console.error(response);
                }
            );
        }
        
        $scope.login();
        //////////
    }
})();