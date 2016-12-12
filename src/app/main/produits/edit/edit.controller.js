(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController);

    /** @ngInject */
    function ProduitsEditController($scope,$state, api,$stateParams,prodResolv)
    {
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