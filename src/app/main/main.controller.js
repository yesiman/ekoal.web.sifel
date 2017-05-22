(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $interval,$cookies, api,$http,$mdDialog,i18nService)
    {
        // Data
        i18nService.setCurrentLang('fr');

        $rootScope.filters = [];
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
        /*$rootScope.$on('$locationChangeStart', function (event, next, current) {
            event.preventDefault();
            if (current.endsWith("/edit"))
            {
                event.preventDefault();
                var confirm = $mdDialog.confirm()
                    .title('Êtes vous sur de vouloir supprimer cette ligne?')
                    .textContent('(Cette action est irréversible))')
                    .ariaLabel('Supprimer')
                    .targetEvent(event)
                    .ok('Valider')
                    .cancel('Annuler');

                $mdDialog.show(confirm).then(function() {
                        
                    }, function() {
                        
                    });
                    
            }
          
        });*/
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