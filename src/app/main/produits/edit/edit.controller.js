(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController);

    /** @ngInject */
    function ProduitsEditController($scope,$state, api,$stateParams,prodResolv)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour produit"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.products.add.post({ id:$scope.id, product: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.item = prodResolv;
    }
})();