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
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            totalItems: 0,
            sort: null
        };
        var customBts = '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showStats(row.entity)"><md-tooltip>Prévisions</md-tooltip><md-icon class="prevs" md-font-icon="icon-chart-line"></md-icon></md-button>';
                    
        var actionsHtml = standardizer.getHtmlActions(customBts);
        $scope.gridOptions = {
            useExternalPagination: true,
            useExternalSorting: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableSorting: false,
            saveSelection: false,
            rowHeight: 35,
            height:"100%",
            enableGridMenu: false,
            showGridFooter: false,
            columnDefs: [
                { field: '_id', displayName: 'mongo ID' },
                { field: 'lib', displayName: 'Lib' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }]
        };
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            api.products.getAll.get({ pid:paginationOptions.pageNumber,nbp:paginationOptions.pageSize },
                // Success
                function (response)
                {
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;
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