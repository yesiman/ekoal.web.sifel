(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonsEditController',BonsEditController);

    /** @ngInject */
    function BonsEditController($scope,$state, api,$stateParams,$q,bonResolv,standardizer, reports)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour bon"
        };
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removePlanifLine($event,row.entity)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        $scope.gridProduits = standardizer.getGridOptionsStd();
        $scope.gridProduits.useExternalPagination = false;
        $scope.gridProduits.useExternalSorting = false;
        $scope.gridProduits.columnDefs = [
            { field: 'no', sort:{priority:0}, displayName: 'N° palette' },
            { field: 'poidBrut', displayName: 'Poid brut (kilos)' },
            { field: 'tare', displayName: 'Tare (kilos)' },
            { field: 'poidNet', displayName: 'Poid net (kilos)' },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];   
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
        }



        $scope.item = bonResolv;
        console.log("$scope.item",$scope.item);
        $scope.gridProduits.data = $scope.item.palettes;
        $scope.item.dateDoc = new Date($scope.item.dateDoc);
        console.log("$scope.gridProduits.data",$scope.gridProduits.data);
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.bons.add.post({ id:$scope.id, bon: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.bons_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }


        $scope.doReport = function() {
            reports.ba.make(exportthis,$scope.item);

            html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var dd = {
                pageMargins: [40, 80, 40, 150],
                footer:reports.ba.getFooter()
}//pdfMake.createPdf(dd).download("Score_Details.pdf");
                //var mdocument = pdfMake.createPdf(dd);
                //var docBlob = null;

                //mdocument.getDataUrl( function (result) {
                    
                    //var fileURL = URL.createObjectURL(result);
                     
                     //$scope.pdf = $sce.trustAsResourceUrl(result);
                //});

               //pdfMake.createPdf(dd).open();
            }
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
                    methodBase = api.stations.getAll;
                    methodArgs = { pid:1,nbp:1000 };
                    methodBase.get(methodArgs,
                        function (response)
                        {
                            console.log("response",response);
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