(function ()
{
    'use strict';

    angular
        .module('app.produits.categories.edit')
        .controller('ProduitsCategoriesEditController',ProduitsCategoriesEditController);

    /** @ngInject */
    function ProduitsCategoriesEditController($scope,$rootScope,$state, api,$stateParams,groupResolv,standardizer)
    {
        var vm = this;
        
        vm.item = groupResolv;
        if (!vm.item.produits)
        {
            vm.item.produits = [];
        }

        vm.cpOptions = {
            format: 'hex',
            swatchOnly:true 
        }
        
        //
        vm.gridOptions = standardizer.getGridOptionsStd();
        vm.gridOptions.columnDefs = [
            { field: 'selected', name: '',cellEditableContition: false, width:"40",type: 'boolean',cellTemplate:'<div class="ui-grid-cell-contents text-center"><md-checkbox ng-click="grid.appScope.addProduit(row.entity._id)" ng-model="row.entity.selected" ng-checked="grid.appScope.isItemForMe(row.entity)" class="md-warn"></md-checkbox></div>' },
            { field: 'codeProd', sort:{priority:0}, displayName: 'Code' },
            { field: 'lib', sort:{priority:0}, displayName: 'Libellé' }];
        vm.gridOptions.totalItems = 100;        
        vm.gridOptions.onRegisterApi =  function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                //paginationOptions.sort = null;
                } else {
                //paginationOptions.sort = sortColumns[0].sort.direction;
                }
                //getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                vm.produitsPsize = pageSize;
                $scope.loadPage(newPage,pageSize);
            });
        }
        vm.produitsTxtFilter = "";
        vm.reloadProduits = function()
        {
            $scope.loadPage(1,10);
        }
        // Methods
        $scope.isItemForMe = function(it) {
            for (var i = 0;i < vm.item.produits.length;i++)
            {
                if (vm.item.produits[i] == it._id)
                {
                    it.selected = true;
                    return true;
                }
            }
            it.selected = false;
            return false;
        }
        $scope.addProduit = function(id) {
            for (var i = 0;i < vm.item.produits.length;i++)
            {
                if (vm.item.produits[i] == id)
                {
                    vm.item.produits.splice(i,1);
                    return;
                }
            }
            vm.item.produits.push(id);
        }
        $scope.loadPage = function(newPage,pageSize) {

            var methodBase;
            var methodArgs;
            
            if (vm.produitsTxtFilter.trim() == "")
            {
                methodBase = api.products.getAll;
                methodArgs = { pid:newPage,
                nbp:pageSize };
            }
            else {
                methodBase = api.products.getAllByLib;
                methodArgs = { pid:newPage,
                nbp:pageSize,req:vm.produitsTxtFilter };
            }
            methodBase.get(methodArgs,
                // Success
                function (response)
                {
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    vm.gridOptions.totalItems = response.count;
                    vm.gridOptions.data = response.items;
                    //$scope.paginationOptions.total = Math.ceil(response.count / $scope.paginationOptions.pageSize);
                    //$scope.items = response.items;
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
        };

        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour catégorie produit"
        };
        vm.id = $stateParams.id;
        $scope.valid = function(){
            api.productsCategories.add.post({ id:vm.id, categ: vm.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_categories_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        
        $scope.loadPage(1,10);
        
    }

    
})();