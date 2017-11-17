(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonProdEditController',BonProdEditController);

    /** @ngInject */
    function BonProdEditController($mdDialog, api, $rootScope)
    {
        var vm = this;
        var methodArgs = { pid:1, nbp:10 };
        
        api.products.getAll.get(methodArgs,
            // Success
            function (response)
            {
                vm.prods = response.items;
                //$scope.gridOptions.totalItems = response.count;
                //$scope.gridOptions.data = response.items;
                $rootScope.loadingProgress = false;
            },
            // Error
            function (response)
            {
                $rootScope.loadingProgress = false;
            }
        );
        vm.select = function(prd) {
            $mdDialog.hide(prd);
        }
    }
})();