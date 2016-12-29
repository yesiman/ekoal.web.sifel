(function ()
{
    'use strict';

    angular
        .module('app.planifs.list')
        .controller('PlanifsListController',PlanifsListController);

    /** @ngInject */
    function PlanifsListController($scope,$state, api,$mdDialog,$rootScope,standardizer)
    {
        var vm = this;
        // Data
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste planifications"
        };
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };
        var actionsHtml = standardizer.getHtmlActions();
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
                { field: 'datePlant', displayName: 'Date plantation' },
                { field: 'produit', displayName: 'Produit' },
                { field: 'producteur', displayName: 'Producteur' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }]
        };
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            api.planifs.getAll.get({ pid:$scope.paginationOptions.pageNumber,nbp:$scope.paginationOptions.pageSize },
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
            $state.go("app.planifs_edit", { id:-1 });
        };
        $scope.edit = function(id) {
            $state.go("app.planifs_edit", { id:id });
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
                api.planifs.delete.delete({ id:id } ,
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