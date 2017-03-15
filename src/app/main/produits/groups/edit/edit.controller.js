(function ()
{
    'use strict';

    angular
        .module('app.produits.groups.edit')
        .controller('ProduitsGroupsEditController',ProduitsGroupsEditController);

    /** @ngInject */
    function ProduitsGroupsEditController($scope,$rootScope,$state, api,$stateParams,groupResolv,standardizer)
    {
        var vm = this;
        
        vm.item = groupResolv;
        
        vm.cpOptions = {
            format: 'hex',
            swatchOnly:true 
        }
        
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour groupe produit"
        };
        vm.id = $stateParams.id;
        $scope.valid = function(){
            api.productsGroups.add.post({ id:vm.id, group: vm.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_groups_list");
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