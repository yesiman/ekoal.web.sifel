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
        var monday = new Date();
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
                $scope.loadPageAction(newPage);
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }
        var originatorEv;

        vm.openMenu = function($mdOpenMenu,ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
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

        var mdDialogCtrl = function ($scope, title,mode,onCancel,onValid) { 
            $scope.nbDays=0;
            $scope.mode=mode;
            $scope.title = title;
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;   
        }
        var mdDialogCtrlRules = function ($scope,onCancel,onValid) { 
            $scope.selectedRule = {};
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;
            api.rules.getAllByProduit.post({ pid:1,nbp:100, id:vm.filters.produits.selectedItems[0]._id,req:""},
                function (response)
                {
                    $scope.rules = response.items;
                    console.log($scope.rules);
                },
                // Error
                function (response)
                {
                    console.error(response);
                    //return null;
                }
            );   
        }

        $scope.closeMe = function()
        {
            $mdDialog.hide();
        }
        //VALI NB JOURS POPUP
        $scope.validLine = function(val,mode)
        {    

            var produitsTmp = [];
            angular.forEach(vm.filters.produits.selectedItems, function(value) {
                produitsTmp.push(value._id);
            });
            var producteursTmp = [];
            angular.forEach(vm.filters.producteurs.selectedItems, function(value) {
                producteursTmp.push(value._id);
            });
            //TODO GET SELECTION SERVER SIDE
            var methodBase;
            var methodArgs = { produits:produitsTmp,producteurs:producteursTmp,dateFrom:vm.filters.dateFrom,dateTo:vm.filters.dateTo,decalIn:val };
           
            switch (mode)
            {
                case "dup":
                    methodBase = api.planifs.groupDup;
                    break;
                case "dec":
                    methodBase = api.planifs.groupDec;
                    break;
            }
            methodBase.post(methodArgs,
                // Success
                function (response)
                {
                    $scope.loadPageAction(1);
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
            $mdDialog.hide();
        }

        $scope.closeMeRule = function()
        {
            $mdDialog.hide();
        }
        //VALI NB JOURS POPUP
        $scope.validLineRule = function(rule)
        {    

            var produitsTmp = [];
            angular.forEach(vm.filters.produits.selectedItems, function(value) {
                produitsTmp.push(value._id);
            });
            var producteursTmp = [];
            angular.forEach(vm.filters.producteurs.selectedItems, function(value) {
                producteursTmp.push(value._id);
            });
            //TODO GET SELECTION SERVER SIDE
            var methodBase;
            var methodArgs = { produits:produitsTmp,producteurs:producteursTmp,dateFrom:vm.filters.dateFrom,dateTo:vm.filters.dateTo,newRule:rule };
            methodBase = api.planifs.groupChangeRule; 
            methodBase.post(methodArgs,
                // Success
                function (response)
                {
                    $scope.loadPageAction(1);
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
            $mdDialog.hide();
        }

        vm.groupDupDec = function(mode,ev)
        {
            var title = "";
            switch (mode)
            {
                case "dup":
                    title = "Dans combien de jours souhaitez vous dupliquer cette sélection ?";
                    break;
                case "dec":
                    title = "Dans combien de jours souhaitez vous décaler cette sélection ?";
                    break;
            }
            
            var locals = {title: title,mode:mode, onCancel: $scope.closeMe, onValid: $scope.validLine };
            $mdDialog.show({
                templateUrl: 'app/main/planifs/list/dialogs/nbDays.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: locals,
                controller: mdDialogCtrl,
                controllerAs: 'ctrl',
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                }, function() {
                
            });      

            

            /*var tmpA = [];
            for (var i = 0;i < $scope.items.length;i++)
            {
                tmpA.push($scope.items[i]._id);
            }
            api.planifs.groupDupDec.post({ pids:tmpA,decalIn:30,mode:mode },
                // Success
                function (response)
                {
                   
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );*/
        }

        vm.groupChangeRule = function(ev)
        {
            
            var locals = {onCancel: $scope.closeMeRule, onValid: $scope.validLineRule };
            $mdDialog.show({
                templateUrl: 'app/main/planifs/list/dialogs/rules.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: locals,
                controller: mdDialogCtrlRules,
                controllerAs: 'ctrl',
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                }, function() {
                
            });      

            

            /*var tmpA = [];
            for (var i = 0;i < $scope.items.length;i++)
            {
                tmpA.push($scope.items[i]._id);
            }
            api.planifs.groupDupDec.post({ pids:tmpA,decalIn:30,mode:mode },
                // Success
                function (response)
                {
                   
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );*/
        }

        $scope.loadPage = function() {
            var produitsTmp = [];
            angular.forEach(vm.filters.produits.selectedItems, function(value) {
                produitsTmp.push(value._id);
            });
            var producteursTmp = [];
            angular.forEach(vm.filters.producteurs.selectedItems, function(value) {
                producteursTmp.push(value._id);
            });
            api.planifs.getAll.post({ pid:$scope.paginationOptions.pageNumber,nbp:$scope.paginationOptions.pageSize,produits:produitsTmp,producteurs:producteursTmp,dateFrom:vm.filters.dateFrom,dateTo:vm.filters.dateTo },
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
                    methodArgs = { pid:1,nbp:20, idt:4,req:vm.filters.producteurs.searchText };
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