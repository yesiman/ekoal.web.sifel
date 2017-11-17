(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonsEditController',BonsEditController);

    /** @ngInject */
    function BonsEditController($scope,$state, api,$stateParams,$q,bonResolv,standardizer, reports,$http,$mdDialog,$document)
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
        $scope.getPaleteConditHtml = function(data)
        {
            return (data.isPal?(data.condit?data.condit.lib:""):"");
        }
        $scope.getProdHtml = function(data)
        {
            return (data.isPal?"":data.produit.lib);
        }
        $scope.getProdCategHtml = function(data)
        {
            return (data.isPal?"":(data.categorie?data.categorie.lib:""));
        }
        var prodCellHtml = '<div class="ui-grid-cell-contents">';
            prodCellHtml += '{{grid.appScope.getProdHtml(row.entity)}}';
            prodCellHtml += '</div>';
        var prodCategCellHtml = '<div class="ui-grid-cell-contents">';
            prodCategCellHtml += '{{grid.appScope.getProdCategHtml(row.entity)}}';
            prodCategCellHtml += '</div>';
        var palCellHtml = '<div class="ui-grid-cell-contents">';
            palCellHtml += '{{grid.appScope.getPaleteHtml(row.entity)}}';
            palCellHtml += '</div>';
        var palConditCellHtml = '<div class="ui-grid-cell-contents">';
            palConditCellHtml += '{{grid.appScope.getPaleteConditHtml(row.entity)}}';
            palConditCellHtml += '</div>';
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removePlanifLine($event,row.entity)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        $scope.gridProduits = standardizer.getGridOptionsStd();
        $scope.gridProduits.rowTemplate='<div ng-class="{\'palRow\':row.entity.isPal }" ><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        
        var poidNetHtml = '<div class="ui-grid-cell-contents">';
            poidNetHtml += '{{row.entity.poid + row.entity.tare}}';
            poidNetHtml += '</div>';

        $scope.item = bonResolv;
        $scope.gridProduits.data = [];

        $scope.gridProduits.useExternalPagination = false;
        $scope.gridProduits.useExternalSorting = false;
        
        $scope.gridProduits.columnDefs = [
            { field: 'condit', sort:{priority:0}, displayName: 'Conditionnement', cellTemplate:palConditCellHtml, enableCellEdit: true, type: 'number',cellEditableCondition: function($scope){return $scope.row.entity.isPal;} },
            { field: 'produit', displayName: 'Produit', cellTemplate:prodCellHtml, enableCellEdit: false },
            { field: 'calibre', displayName: 'Calibre', enableCellEdit: true,cellEditableCondition: function($scope){return !$scope.row.entity.isPal;} },
            { field: 'categorie', displayName: 'Categorie', cellTemplate:prodCategCellHtml, enableCellEdit: true,cellEditableCondition: function($scope){return !$scope.row.entity.isPal;} },
            { field: 'poidNet', displayName: 'Poid brut (kgs)', cellTemplate:poidNetHtml, enableCellEdit: false, type: 'number' },
            { field: 'tare', displayName: 'Tare (kgs)', enableCellEdit: true, type: 'number' },
            { field: 'poid', displayName: 'Poid net (kgs)', enableCellEdit: true, type: 'number' },
            { field: 'colisNb', displayName: 'Nombre de colis', enableCellEdit: true, type: 'number' }];
        if ($scope.item.destination == "export")
        {
            $scope.gridProduits.columnDefs.unshift(
                { field: 'no', sort:{priority:0}, displayName: 'N° palette', cellTemplate:palCellHtml, enableCellEdit: true, type: 'number',cellEditableCondition: function($scope){return $scope.row.entity.isPal;} }
            )

        }
            
        $scope.addProd = function(ev,r) {
            $mdDialog.show({
                controller         : 'BonProdEditController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/agreage/bons/edit/dialogs/addProd/bon-prod.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            }).then(function (prod) {
                if (!$scope.item.palettes)
                {
                    $scope.item.palettes = [];
                }
                $scope.item.palettes.push({
                    no:1,
                    poid:0,
                    tare:0,
                    poidBrut:0,
                    colisNb:0,
                    produits:[{
                        poid:0,
                        tare:0,
                        poidBrut:0,
                        colisNb:0,
                        produit:prod
                    }]
                });
                $scope.bindGridProduits();
            }, function () {
            });;
            //$state.go("app.produits_edit.rules_edit", {id:-1,idProduit:$scope.item._id, prod:$scope.item });
        }
        
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
                            angular.forEach(pal.produits, function(value, key) {
                                if (rowEntity.iid == pal.no + "/" + value.produit._id + "/" + key)
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

        $scope.bindGridProduits = function(){
            angular.forEach($scope.item.palettes, function(value) {
                var pal = value;
                pal.isPal = true;
                pal.iid = pal.no;
                $scope.gridProduits.data.push(pal);
                angular.forEach(pal.produits, function(value,key) {
                    //console.log();
                    value.iid = pal.no + "/" + value.produit._id + "/" + key;
                    $scope.gridProduits.data.push(value);
                });
            });
        }
        
        if ($stateParams.id != -1)
        {
            $scope.item.dateDoc = new Date($scope.item.dateDoc);
        }
        else {
            $scope.item.dateDoc = new Date();
        }
        $scope.id = $stateParams.id;
        $scope.bindGridProduits();
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
        $scope.docFact = function(type) {
            //reports.cfact.make(exportthis,$scope.item,type);
        };
        $scope.dopFact = function(type) {
            //reports.pfact.make(exportthis,$scope.item,type);
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
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4,req:$scope.item.producteurSearch };
                    break;
                case 3:
                    methodBase = api.clients.getAll;
                    methodArgs = { pid:1,nbp:1000 };
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
    }
})();