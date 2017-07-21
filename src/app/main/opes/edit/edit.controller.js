(function ()
{
    'use strict';

    angular
        .module('app.opes.edit')
        .controller('OpesEditController',OpesEditController);

    /** @ngInject */
    function OpesEditController($scope,$state, api,$stateParams,orgaResolv,$rootScope)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour organisation de producteurs"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            $rootScope.loadingProgress = true;
            api.orgas.add.post({ id:$scope.id, orga: $scope.item } ,
                // Success
                function (response)
                {
                    $rootScope.loadingProgress = false;
                    //
                    if ($rootScope.user.type == 1)
                    {
                        $state.go("app.opes_list");
                    }
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    $rootScope.loadingProgress = false;
                    console.error(response);
                }
            );
        }
        $scope.item = orgaResolv;
    }
})();