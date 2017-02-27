(function ()
{
    'use strict';

    angular
        .module('app.planifs.list')
        .controller('PlanifsListController',PlanifsListController);

    /** @ngInject */
    function PlanifsListController($scope,$state, api,$mdDialog,$rootScope,standardizer,$q)
    {
        var vm = this;
        // Data
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
        vm.filters = {
            produits: {
                selectedItem:null,
                searchText: "",
                selectedItems:[],
                change: function(it)
                {
                    if (!it) { return; }
                    var found = false;
                    for (var i = 0;i< vm.filters.produits.selectedItems.length;i++)
                    {
                        if (vm.filters.produits.selectedItems[i]._id == it._id)
                        {
                            found = true;
                            break;
                        }
                    }
                    if (!found) { vm.filters.produits.selectedItems.push(it);$scope.loadPageAction(1); }
                    vm.filters.produits.searchText = "";
                }
            },
            producteurs: {
                selectedItem:null,
                searchText: "",
                selectedItems:[],
                change: function(it)
                {
                    if (!it) { return; }
                    var found = false;
                    for (var i = 0;i< vm.filters.producteurs.selectedItems.length;i++)
                    {
                        if (vm.filters.producteurs.selectedItems[i]._id == it._id)
                        {
                            found = true;
                            break;
                        }
                    }
                    if (!found) { vm.filters.producteurs.selectedItems.push(it);$scope.loadPageAction(1); }
                    vm.filters.producteurs.searchText = "";
                }
            },
            autocompleteDemoRequireMatch:true,
            dateFrom: new Date(),
            dateTo: sunday,
            showObjectifs:true,
            groupMode:"w",
            unitMode:1
        }
        var produitRendHtml = '<div class="ui-grid-cell-contents">';
            produitRendHtml += '{{grid.appScope.getProduitRend(row.entity.produitRend)}}';
            produitRendHtml += '</div>';
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [
                { field: 'datePlant', displayName: 'Date plantation', cellFilter: 'date:\'dd-MM-yyyy\'' },
                { field: 'produitLib', displayName: 'Produit' },
                { field: 'producteurLib', displayName: 'Producteur' },
                { field: 'produitRend', displayName: 'Rendement/hectare', cellTemplate:produitRendHtml },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }];

        var originatorEv;

        vm.openMenu = function($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        $scope.getProduitRend = function(rend)
        {
            return rend.val + " " + (rend.unit == 1?"kilos":"tonnes");
        }
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            var produitsTmp = [];
            angular.forEach(vm.filters.produits.selectedItems, function(value) {
                produitsTmp.push(value._id);
            });
            var producteursTmp = [];
            angular.forEach(vm.filters.producteurs.selectedItems, function(value) {
                producteursTmp.push(value._id);
            });
            api.planifs.getAll.post({ pid:$scope.paginationOptions.pageNumber,nbp:$scope.paginationOptions.pageSize,produits:produitsTmp,producteurs:producteursTmp },
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

        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.products.getAllByLib;
                    methodArgs = { pid:1,nbp:20,req:vm.filters.produits.searchText };
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4 };
                    break;
                case 3:
                    methodBase = api.users.getParcelles;
                    methodArgs = { id:$scope.item.producteur._id };
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