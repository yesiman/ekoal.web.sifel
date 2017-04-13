(function ()
{
    'use strict';

    angular
        .module('app.produits.list')
        .controller('ProduitsListController',ProduitsListController);

    /** @ngInject */
    function ProduitsListController($scope,$state, api,$mdDialog,$rootScope,standardizer)
    {
        var vm = this;
        // Data
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste produits"
        };
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };

        vm.filters = {
            text:""
        };
        vm.filterTextOnChange = function() {
                $scope.loadPageAction(1);
            
        }
        var customBts = '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showStats(row.entity)"><md-tooltip>Prévisions</md-tooltip><md-icon class="prevs" md-font-icon="icon-chart-line"></md-icon></md-button>';
                    
        var actionsHtml = standardizer.getHtmlActions(customBts);
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [
                { field: 'codeProd', displayName: 'Code', width: "150" },
                { field: 'lib', displayName: 'Libellé' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }];
        $scope.gridOptions.onRegisterApi =  function(gridApi) {
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
                $scope.loadPageAction(newPage);
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }
        
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {

            var methodBase;
            var methodArgs;
            
            if (vm.filters.text.trim() == "")
            {
                methodBase = api.products.getAll;
                methodArgs = { pid:$scope.paginationOptions.pageNumber,
                nbp:$scope.paginationOptions.pageSize };
            }
            else {
                methodBase = api.products.getAllByLib;
                methodArgs = { pid:$scope.paginationOptions.pageNumber,
                nbp:$scope.paginationOptions.pageSize,req:vm.filters.text };
            }
            methodBase.get(methodArgs,
                // Success
                function (response)
                {
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;
                    $scope.paginationOptions.total = Math.ceil(response.count / $scope.paginationOptions.pageSize);
                    $scope.items = response.items;
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
        $scope.add = function() {
            $state.go("app.produits_edit", { id:-1 });
        };
        $scope.edit = function(id) {
            $state.go("app.produits_edit", { id:id });
        };
        $scope.showStats = function(it) {
            $state.go("app.stats_prevs", { selectedItems:[it] });
        };
        $scope.remove = function(id,ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer cette ligne?')
                .textContent('(Cette action est irréversible))')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                api.products.delete.delete({ id:id } ,
                // Success
                function (response)
                {
                    $scope.loadPage();
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
            }, function() {
                
            });
        };
        //INIT
        $scope.loadPage();
        //////////
    }
})();