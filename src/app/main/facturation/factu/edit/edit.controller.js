(function ()
{
    'use strict';

    angular
        .module('app.factu.edit')
        .controller('FactuEditController',FactuEditController);

    /** @ngInject */
    function FactuEditController($scope,$rootScope,$state, api,$stateParams,factuResolv,standardizer,$q,reports)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour facture",
            custFactHtml:true
        };
        $scope.id = $stateParams.id;
        $scope.item = factuResolv;
        $scope.item.dateDoc = new Date($scope.item.dateDoc);

        $scope.searchs = {
            clients:{
                change:function(it) {
                    $scope.item.client = it;
                    $scope.loadBons(it,"c");
                }
            },
            producteurs:{
                change:function(it) {
                    $scope.item.producteur = it;
                    $scope.loadBons(it,"p");
                }
            }
        };
        
        //
        $scope.loadBons = function(it,type)
        {
            $scope.item.bons = [];
            var methodArgs = {
                pid:1,
                nbp:1000,
                noLock:$scope.item._id
            };
            if (!$scope.item._id)
            {
                methodArgs.onlyNonUsed = true;

            }
            if (type == 'c')
            {
                methodArgs.clients = [it._id];
            }
            else {
                methodArgs.producteurs = [it._id];
            }
            api.bons.getAll.post(methodArgs,
                // Success  
                function (response)
                {
                    $scope.maxSize = 5;
                    $scope.produits = response.produits;
                    $scope.totalItems = response.count;
                    $scope.gridBons.totalItems = response.count;
                    $scope.gridBons.data = response.items;
                    $scope.gridBons.total = Math.ceil(response.count / $scope.gridBons.pageSize);
                    //$scope.items = response.items;
                    if ($scope.item._id)
                    {
                        $scope.gridApi.grid.modifyRows($scope.gridBons.data);
                        for (var i = 0;i < response.items.length;i++)
                        {
                            $scope.gridApi.selection.selectRow($scope.gridBons.data[i]);
                        }
                    }
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    $rootScope.loadingProgress = false;
                }
            );
        }
        //
            $scope.remove = function() {
                api.facturation.delete.delete({ id:$scope.id } ,
                    // Success
                    function (response)
                    {
                        $state.go("app.factu_list");
                        //$scope.item = response;
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                    }
                );
            }

        //
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridBons = standardizer.getGridOptionsStd();
        $scope.gridBons.columnDefs = [
                { field: 'dateDoc', displayName: 'Date' },
                { field: 'numBon', displayName: 'Bon n°' },
                { field: 'noLta', displayName: 'Lta n°' },
                { field: 'destination', displayName: 'Destination' },
                { field: 'station.lib', displayName: 'Station' },
                { field: 'producteur.name', displayName: 'Producteur' }];
        $scope.gridBons.onRegisterApi =  function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                //paginationOptions.sort = null;
                } else {
                //paginationOptions.sort = sortColumns[0].sort.direction;
                }
                //getPage();
            });
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var found = false;
                for(var i = 0;i < $scope.item.bons.length;i++)
                {
                    if ($scope.item.bons[i]._id == row.entity._id)
                    {
                        found = true;
                        if (!row.isSelected)
                        {
                            $scope.item.bons.splice(i,1);
                        }
                        break;
                    }
                }
                if (!found)
                {
                    $scope.item.bons.push(row.entity);
                }
                //Redraw prices
                $scope.item.prods = [];
                var found = false;
                $scope.item.paletsSum = 0;
                for(var i = 0;i < $scope.item.bons.length;i++)
                {
                    var b = $scope.item.bons[i];
                    for(var ipal = 0;ipal < b.palettes.length;ipal++)
                    {
                        $scope.item.paletsSum++;
                        var pal = b.palettes[ipal];
                        for(var iprod = 0;iprod < pal.produits.length;iprod++)
                        {
                            var prod = pal.produits[iprod];
                            for(var igprod = 0;igprod < $scope.item.prods.length;igprod++)
                            {
                                var gprod = $scope.item.prods[igprod];
                                if ((gprod._id == prod.produit) && (gprod.calibre == prod.calibre))
                                {
                                    found = true;
                                    gprod.poid += prod.poid;
                                    gprod.tare += prod.tare;
                                    gprod.colisNb += prod.colisNb;
                                    break;
                                }
                            }
                            if (!found)
                            {
                                $scope.item.prods.push(
                                    {
                                        _id:prod.produit,
                                        calibre:prod.calibre,
                                        lib:prod.produit.lib,
                                        poid:prod.poid,
                                        colisNb:prod.colisNb,
                                        tare:prod.tare,
                                    }
                                );
                            }

                        }
                    }
                }
                //LOAD produits
                
                $scope.gridTarifs.data = $scope.item.prods;
            });
        }
        //

        $scope.getProduit = function(it) {
            for (var i = 0;i < $scope.produits.length;i++)
            {
                var v = $scope.produits[i];
                if(v._id == it._id)
                {
                    it.lib = v.lib;
                    return v.lib;
                }
            }
        }

        var produitHtml = '<div class="ui-grid-cell-contents">';
        produitHtml += '{{grid.appScope.getProduit(row.entity)}}';
        produitHtml += '</div>'

        actionsHtml = standardizer.getHtmlActions();
        $scope.gridTarifs = standardizer.getGridOptionsStd();
        $scope.gridTarifs.columnDefs = [
                { field: 'produit.lib', displayName: 'Produit', cellTemplate:produitHtml, enableCellEdit: false },
                { field: 'calibre', displayName: 'Calibre', enableCellEdit: false },
                { field: 'poid', displayName: 'Poid net', enableCellEdit: false },
                { field: 'tare', displayName: 'Tare', enableCellEdit: false },
                { field: 'prix', displayName: 'Prix vente', enableCellEdit: true, type: 'number' }];
        $scope.gridTarifs.onRegisterApi =  function(gridApi) {
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
                    methodBase = api.clients.getAllByLib;
                    methodArgs = { pid:1,nbp:1000,req:$scope.searchs.clients.search };
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4,req:$scope.searchs.producteurs.search };
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
        $scope.valid = function() {
            $scope.item.dateDoc = new Date($scope.item.dateDoc);
            if ($scope.item.type == '0')
            {
                $scope.item.client = $scope.item.client._id;
            }
            else {
                $scope.item.producteur = $scope.item.producteur._id;
            }
            for(var i = 0;i < $scope.item.bons.length;i++)
            {
                $scope.item.bons[i] = $scope.item.bons[i]._id;
            }
            api.facturation.add.post({ id:$scope.id, facture: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.factu_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }

        $scope.doLc = function() {
            $rootScope.loadingProgress = true;
            var bs = [];
            for(var i = 0;i < $scope.item.bons.length;i++)
            {
                bs.push($scope.item.bons[i]._id);
            }
            api.bons.getLc.post({bons:bs},
                // Success
                function (response)
                {
                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.content),
                        target: '_blank',
                        download: 'liste_colisage.csv'
                    })[0].click();
                    $rootScope.loadingProgress = false; 
                },
                // Error
                function (response)
                {
                    $rootScope.loadingProgress = false;
                }
            );
        }
        $scope.doFact = function() {
            if ($scope.item.type == '0')
            {reports.cfact.make(exportthis,$scope.item,"");}
            else {
                reports.pfact.make(exportthis,$scope.item,"");
            }
            for (var b in $scope.gridBons.data){
                reports.ba.make(exportthis,$scope.gridBons.data[b],"ba");
            }
        }
        $scope.doBl = function() {
            for (var b in $scope.gridBons.data){
                reports.ba.make(exportthis,$scope.gridBons.data[b],"bl");
            }
            
        }
        //
        if($scope.item._id)
        {
            if ($scope.item.type == '0')
            {
                $scope.searchs.clients.client = $scope.item.client;
                $scope.loadBons($scope.searchs.clients.client,"c");
            }
            else {
                $scope.searchs.producteurs.producteur = $scope.item.producteur;
                $scope.loadBons($scope.searchs.producteurs.producteur,"p");
            }
        }
    }
})();