(function ()
{
    'use strict';

    angular
        .module('app.bons.list')
        .controller('BonsListController',BonsListController);

    /** @ngInject */
    function BonsListController($scope,$state, api,$mdDialog,$rootScope,standardizer,$q)
    {
        var vm = this;
        // Data
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste bons d'apports/livraisons",
            btimport:false
        };
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };
        

        var filters = $rootScope.filters.bonsController;
        
        if (filters)
        {
            filters.dateFrom = new Date(filters.dateFrom);
            filters.dateTo = new Date(filters.dateTo);
            $scope.filters = filters;
        }
        else {
            var monday = new Date;
            monday.setHours(0);
            monday.setMinutes(0);
            monday.setSeconds(0);
            var sunday = new Date(monday);
            sunday.setMonth(sunday.getMonth() + 6);
            sunday.setHours(23);
            sunday.setMinutes(59);
            sunday.setSeconds(59);
            sunday.setMilliseconds(59);
            $scope.filters = {
                lta: "",
                selectedProducteurs:[],
                dateFrom: monday,
                dateTo: sunday,
                showObjectifs:true,
                groupMode:"w",
                unitMode:1,
                producteurs: {
                    selectedItem:null,
                    searchText: "",
                    selectedItems:[],
                    change: function(it)
                    {
                        if (!it) { return; }
                        var found = false;
                        for (var i = 0;i< $scope.filters.producteurs.selectedItems.length;i++)
                        {
                            if ($scope.filters.producteurs.selectedItems[i]._id == it._id)
                            {
                                found = true;
                                break;
                            }
                        }
                        if (!found) { $scope.filters.producteurs.selectedItems.push(it);$scope.loadPageAction(1); }
                        $scope.filters.producteurs.searchText = "";
                    }
                }
            }
        }

        $scope.getStatusIcon = function(it) {
            if (it.factu)
            {
                return 'icon-check-circle';
            }
            else {
                return 'icon-close-circle-outline';
            }
        }
        $scope.getStatusToolT = function(it) {
            if (it.factu)
            {
                return 'Facture éditée';
            }
            else {
                return 'Facture non éditée';
            }
        }

        var typeHtml = '<div class="ui-grid-cell-contents text-center">';
        typeHtml += '<md-button class="md-icon-button" aria-label="Settings"><md-tooltip>{{grid.appScope.getStatusToolT(row.entity)}}</md-tooltip><md-icon class="warn" md-font-icon="{{grid.appScope.getStatusIcon(row.entity)}}"></md-icon></md-button>';
        typeHtml += '</div>'
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [
                { field: 'dateDoc', displayName: 'Date' },
                { field: 'numBon', displayName: 'Bon n°' },
                { field: 'destination', displayName: 'Destination' },
                { field: 'station.lib', displayName: 'Station' },
                { field: 'producteur.name', displayName: 'Producteur' },
                { field: 'satus', displayName:"Status",cellTemplate:typeHtml},
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
                $scope.paginationOptions.pageSize = pageSize;
                $scope.loadPageAction(newPage);
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }

        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.products.getAllByLib;
                    methodArgs = { pid:1,nbp:20,req:$scope.filters.produits.searchText };
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:20, idt:4,req:$scope.filters.producteurs.searchText };
                    break;
                case 3:
                    methodBase = api.users.getParcelles;
                    methodArgs = { pid:1,nbp:100,id:$scope.item.producteur._id,req:"" };
                    break;
            }
            methodBase.get(methodArgs,
                function (response)
                {
                    deferred.resolve( response.items );
                },
                // Error
                function (response)
                {
                    console.error(response);
                    //return null;
                }
            );
            return deferred.promise;
        }

        $scope.removeProducteur = function(it) {
            for (var i = 0;i< $scope.filters.producteurs.selectedItems.length;i++)
            {
                if ($scope.filters.producteurs.selectedItems[i]._id == it)
                {
                    $scope.filters.producteurs.selectedItems.splice(i,1);
                    break;
                }
            }
            $scope.loadPageAction(1);
        }

        $scope.loadPageAction = function(id)
        {
            $rootScope.filters.bonsController = $scope.filters;
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            var producteursTmp = [];
            angular.forEach($scope.filters.producteurs.selectedItems, function(value) {
                producteursTmp.push(value._id);
            });
            api.bons.getAll.post({ 
                pid:$scope.paginationOptions.pageNumber,
                nbp:$scope.paginationOptions.pageSize,
                lta:$scope.filters.lta,
                producteurs:producteursTmp,
                dateFrom:$scope.filters.dateFrom,
                dateTo:$scope.filters.dateTo
             },
                // Success
                function (response)
                {
                    console.log(response);
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
                    $rootScope.loadingProgress = false;
                }
            );
        };
        $scope.add = function() {
            $state.go("app.bons_edit", { id:-1 });
        };
        $scope.edit = function(id) {
            $state.go("app.bons_edit", { id:id });
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
                api.orgas.delete.delete({ id:id } ,
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