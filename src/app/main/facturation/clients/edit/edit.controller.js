(function ()
{
    'use strict';

    angular
        .module('app.clients.edit')
        .controller('ClientsEditController',ClientsEditController);

    /** @ngInject */
    function ClientsEditController($scope,$state, api,$stateParams,clientResolv,standardizer)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour Client"
        };
        $scope.id = $stateParams.id;

        $scope.gridBons = standardizer.getGridOptionsStd();
        $scope.gridBons.rowTemplate='<div ng-class="{\'palRow\':row.entity.isPal }" ><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        $scope.gridBons.useExternalPagination = false;
        $scope.gridBons.useExternalSorting = false;
        $scope.gridBons.enableRowSelection = true;
        $scope.gridBons.enableSelectAll = true;
        $scope.gridBons.selectionRowHeaderWidth = 35;
        $scope.gridBons = {
            pageNumber:1,
            pageSize:10
        };
        $scope.gridBons.columnDefs = [
            { field: 'dateDoc', enableCellEdit: false, width: '0%' },
            { field: 'numBon',grouping: { groupPriority: 0 } , sort:{priority:0}, displayName: 'N° bon' },
            { field: 'noLta', displayName: 'noLta'  },
            { field: 'noLot', displayName: 'noLta'  }];
        $scope.gridBons.onRegisterApi =  function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                //paginationOptions.sort = null;
                } else {
                //paginationOptions.sort = sortColumns[0].sort.direction;
                }
                
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.gridBon.pageNumber = newPage;
                $scope.gridBon.pageSize = pageSize;
                $scope.loadBons();
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
               
            });
        }
        //
        $scope.gridFactures = standardizer.getGridOptionsStd();
        $scope.gridFactures.rowTemplate='<div ng-class="{\'palRow\':row.entity.isPal }" ><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        $scope.gridFactures.useExternalPagination = false;
        $scope.gridFactures.useExternalSorting = false;
        $scope.gridFactures.paginationOptions = {
            pageNumber:1,
            pageSize:10
        };
        $scope.gridFactures.columnDefs = [
            { field: 'dateDoc', enableCellEdit: false, width: '0%' },
            { field: 'numBon',grouping: { groupPriority: 0 } , sort:{priority:0}, displayName: 'N° bon' },
            { field: 'noLta', displayName: 'noLta'  },
            { field: 'noLot', displayName: 'noLta'  }];
        $scope.gridFactures.onRegisterApi =  function(gridApi) {
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
                $scope.gridFactures.paginationOptions.pageNumber = newPage;
                $scope.gridFactures.paginationOptions.pageSize = pageSize;
                $scope.loadFactures();
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
               
            });
        }

        $scope.loadBons = function()
        {
            api.bons.getAll.post(
                { 
                    pid:$scope.gridBons.pageNumber,
                    nbp:$scope.gridBons.pageSize,
                    lta:"",
                    producteurs:[],
                    clients:[$scope.item._id],
                    dateFrom:new Date(1900,1,1),
                    dateTo:new Date()
                },
                // Success
                function (response)
                {
                    $scope.gridBons.maxSize = 5;
                    $scope.gridBons.totalItems = response.count;
                    $scope.gridBons.total = Math.ceil(response.count / $scope.pageSize);
                    $scope.gridBons.data = response.items;
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
        }
        $scope.loadFatures = function(id)
        {
            
        }

        $scope.loadBonsAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.gridBons.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        $scope.loadFaturesAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.gridFactures.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        
        $scope.valid = function(){
            api.clients.add.post({ id:$scope.id, client: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.clients_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.item = clientResolv;

        $scope.loadBons();
    }
})();