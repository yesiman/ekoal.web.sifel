(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $interval,$cookies, api,$http)
    {
        // Data
        //CHECK TOKEN EXPIRATION
        var checkDateDiff = function() {
            if ($rootScope.lastValidCall)
            {
                var dif = new Date().getTime() - $rootScope.lastValidCall.getTime();
                var Seconds_from_T1_to_T2 = dif / 1000;
                var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
                if (Seconds_Between_Dates < 55)
                {
                    api.users.refreshToken.get({ },
                        // Success
                        function (response)
                        {
                            var tmp = $cookies.getObject("appAuth");
                            tmp.token = response.tk;
                            $cookies.putObject("appAuth",tmp);
                            $http.defaults.headers.common['x-access-token'] = response.tk;
                        },
                        // Error
                        function (response)
                        {
                            console.error(response);
                        }
                    );
                }
            }
        }
        //$interval(checkDateDiff, 55000);
        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if ( event.targetScope.$id === $scope.$id )
            {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
})();