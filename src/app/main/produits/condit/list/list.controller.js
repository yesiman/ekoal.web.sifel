(function ()
{
    'use strict';

    angular
        .module('app.produits.condit.list')
        .controller('ProduitsConditListController',ProduitsConditListController);

    /** @ngInject */
    function ProduitsConditListController($scope,$state, api,$mdDialog,$rootScope,standardizer)
    {
        var vm = this;
        // Data
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste conditionnements"
        };
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };
        
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [
                { field: 'code', displayName: 'Code' },
                { field: 'lib', displayName: 'Libellé' },
                { field: 'poid', displayName: 'Poid (kilos)' },
                { field: 'nbColis', displayName: 'Nombre colis' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }];
        
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            api.productsCondits.getAll.get({ pid:$scope.paginationOptions.pageNumber,nbp:$scope.paginationOptions.pageSize },
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
            $state.go("app.produits_condit_edit", { id:-1 });
        };
        $scope.edit = function(id) {
            $state.go("app.produits_condit_edit", { id:id });
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