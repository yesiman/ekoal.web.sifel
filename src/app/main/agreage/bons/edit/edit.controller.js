(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonsEditController',BonsEditController);

    /** @ngInject */
    function BonsEditController($scope,$state, api,$stateParams)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour bon"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.orgas.add.post({ id:$scope.id, orga: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.bons_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
    }
})();