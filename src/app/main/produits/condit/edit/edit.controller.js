(function ()
{
    'use strict';

    angular
        .module('app.produits.condit.edit')
        .controller('ProduitsConditEditController',ProduitsConditEditController);

    /** @ngInject */
    function ProduitsConditEditController($scope,$state, api,$stateParams,groupResolv)
    {
        $scope.item = groupResolv;
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour conditionnement produit"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.productsCondits.add.post({ id:$scope.id, condit: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_condit_list");
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