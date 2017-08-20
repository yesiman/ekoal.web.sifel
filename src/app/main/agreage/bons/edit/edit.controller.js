(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonsEditController',BonsEditController);

    /** @ngInject */
    function BonsEditController($scope,$state, api,$stateParams,$q,bonResolv,standardizer, reports,$http)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour bon"
        };

        $scope.getPaleteHtml = function(data)
        {
            return (data.isPal?data.no:"");
        }
        $scope.getProdHtml = function(data)
        {
            return (data.isPal?"":data.produit.lib);
        }
        var prodCellHtml = '<div class="ui-grid-cell-contents">';
            prodCellHtml += '{{grid.appScope.getProdHtml(row.entity)}}';
            prodCellHtml += '</div>';
        var palCellHtml = '<div class="ui-grid-cell-contents">';
            palCellHtml += '{{grid.appScope.getPaleteHtml(row.entity)}}';
            palCellHtml += '</div>';
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removePlanifLine($event,row.entity)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        $scope.gridProduits = standardizer.getGridOptionsStd();
        $scope.gridProduits.rowTemplate='<div ng-class="{\'palRow\':row.entity.isPal }" ><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        
        var poidNetHtml = '<div class="ui-grid-cell-contents">';
            poidNetHtml += '{{row.entity.poid + row.entity.tare}}';
            poidNetHtml += '</div>';

        $scope.gridProduits.useExternalPagination = false;
        $scope.gridProduits.useExternalSorting = false;
        $scope.gridProduits.columnDefs = [
            { field: 'iid', enableCellEdit: false, width: '0%' },
            { field: 'no',grouping: { groupPriority: 0 } , sort:{priority:0}, displayName: 'N° palette', cellTemplate:palCellHtml, enableCellEdit: true, type: 'number',cellEditableCondition: function($scope){return $scope.row.entity.isPal;} },
            { field: 'produit', displayName: 'Produit', cellTemplate:prodCellHtml, enableCellEdit: false },
            { field: 'poidNet', displayName: 'Poid brut (kgs)', cellTemplate:poidNetHtml, enableCellEdit: true, type: 'number' },
            { field: 'tare', displayName: 'Tare (kgs)', enableCellEdit: true, type: 'number' },
            { field: 'poid', displayName: 'Poid net (kgs)', enableCellEdit: true, type: 'number' },
            { field: 'prixAchat', displayName: 'Prix achat', enableCellEdit: true, type: 'number',cellEditableCondition: function($scope){return !$scope.row.entity.isPal;} },
            { field: 'prixVente', displayName: 'Prix vente', enableCellEdit: true, type: 'number',cellEditableCondition: function($scope){return !$scope.row.entity.isPal;} }];
        $scope.gridProduits.onRegisterApi =  function(gridApi) {
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
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                angular.forEach($scope.item.palettes, function(value) {
                    var pal = value;
                    if ((rowEntity.iid == pal.no) || rowEntity.iid.startsWith(pal.no + "/")) 
                    {
                        
                        if (rowEntity.iid.indexOf("/") > -1)
                        {
                            angular.forEach(pal.produits, function(value) {
                                if (rowEntity.iid.indexOf("/" + value.produit._id) > -1)
                                {
                                    value[colDef.name] = newValue;
                                }
                            });
                        }
                        else {
                            value[colDef.name] = newValue;
                        }
                    }
                });
            });
        }



        $scope.item = bonResolv;
        $scope.gridProduits.data = [];
        angular.forEach($scope.item.palettes, function(value) {
            var pal = value;
            pal.isPal = true;
            pal.iid = pal.no;
            $scope.gridProduits.data.push(pal);
            angular.forEach(pal.produits, function(value) {
                value.iid = pal.no + "/" + value.produit._id;
                $scope.gridProduits.data.push(value);
            });
        });
        $scope.item.dateDoc = new Date($scope.item.dateDoc);
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            $scope.item.dateDoc = new Date($scope.item.dateDoc);
            $scope.item.producteur = $scope.item.producteur._id;
            $scope.item.station = $scope.item.station._id;
            $scope.item.client = $scope.item.client._id;
            delete $scope.item.producteurSearch;
            angular.forEach($scope.item.palettes, function(value) {
                delete value.iid;
                var pal = value;
                //value.condit =  value.condit._id;
                angular.forEach(pal.produits, function(value) {
                    delete value.iid;
                    value.categorie =  value.categorie._id;
                    value.produit =  value.produit._id;
                    value.prixAchat =  value.prixAchat;
                    value.prixVente =  value.prixVente;
                    $scope.gridProduits.data.push(value);
                });
            });
            $http.post('https://sifel-srv.herokuapp.com/bons/add/' + $scope.item._id, {
                bon: $scope.item
            }).
            then(function (response) {
                 $state.go("app.bons_list");
            }, function (response) {
                console.error(response);
            });


            
        }


        $scope.doReport = function(type) {
            reports.ba.make(exportthis,$scope.item,type);
        };
        $scope.doFact = function(type) {
            reports.fact.make(exportthis,$scope.item,type);
        };
        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.stations.getAll;
                    methodArgs = { pid:1,nbp:1000 };
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
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4,req:$scope.item.producteurSearch };
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
                    break;
                
            }
           
            return deferred.promise;
        }
    }
})();