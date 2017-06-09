(function ()
{
    'use strict';

    angular
        .module('app.stations.edit')
        .controller('StationsEditController',StationsEditController);

    /** @ngInject */
    function StationsEditController($scope,$state, api,$stateParams,stationResolv)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour station"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.stations.add.post({ id:$scope.id, station: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.stations_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.item = stationResolv;
    }
})();