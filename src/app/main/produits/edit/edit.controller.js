(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController);

    /** @ngInject */
    function ProduitsEditController($scope,$state, api,$stateParams,prodResolv,standardizer)
    {
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true,
            language: standardizer.getDatatableLanguages()
        };
        vm.rules = [];
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