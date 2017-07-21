(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController)
        .directive('objectifLine', objectifLine);

    /** @ngInject */
    function ProduitsEditController($scope,$rootScope,$state, api,$stateParams,prodResolv,standardizer,monthsResolv,$mdDialog,$document)
    {
        var vm = this;
        
        vm.item = prodResolv;
        //
        vm.ruleTxtFilter = "";
        vm.rulePsize = 10;
//
        vm.conditTxtFilter = "";
        vm.conditPsize = 10;

        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.addRule($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removeRule($event,row.entity)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        vm.gridRulesOptions = standardizer.getGridOptionsStd();
        vm.gridRulesOptions.columnDefs = [
            { field: 'lib', sort:{priority:0}, displayName: 'Libellé' },
            { field: 'delai', sort:{priority:0}, displayName: 'Délai avant récolte (jours)' },
            { field: 'nbWeek', sort:{priority:0}, displayName: 'Numéro semaine de récolte' },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];   
               

        
        vm.gridRulesOptions.onRegisterApi =  function(gridApi) {
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
                vm.rulePsize = pageSize;
                vm.loadRulesPage(newPage,pageSize);
            });
        }

        vm.gridConditsOptions = standardizer.getGridOptionsStd();
        vm.gridConditsOptions.columnDefs = [
            { field: 'selected', name: '',cellEditableContition: false, width:"40",type: 'boolean',cellTemplate:'<div class="ui-grid-cell-contents text-center"><md-checkbox ng-click="grid.appScope.addProducteur(row.entity._id)" ng-model="row.entity.selected" ng-checked="grid.appScope.isConditForMe(row.entity)" class="md-warn"></md-checkbox></div>' },
            { field: 'lib', sort:{priority:0}, displayName: 'Libellé' }];   
               
        vm.gridConditsOptions.onRegisterApi =  function(gridApi) {
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
                vm.conditPsize = pageSize;
                vm.loadConditsPage(newPage,pageSize);
            });
        }

        if (vm.item.objectif)
        {
            vm.mois = vm.item.objectif.lines;
        }
        else {
            vm.mois = monthsResolv;
        }
        vm.cpOptions = {
            format: 'hex',
            swatchOnly:true 
        }
        function setParent(it)
        {
            vm.item.parent = it;
        }
        function ParentsDialogController($scope, $mdDialog) {
            $scope.select = function(it) {
                setParent(it);
                $mdDialog.hide();
            } 
            $scope.close = function() {
                $mdDialog.hide();
            } 
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
            $mdDialog.hide(answer);
            };
        }

        
        vm.loadRulesPage = function (id, psize)
        {
            $rootScope.loadingProgress = true;
            api.rules.getAllByProduit.post({ pid:id, nbp:psize, id: vm.item._id,req:vm.ruleTxtFilter } ,
                // Success
                function (response)
                {
                    vm.gridRulesOptions.totalItems = response.count;
                    vm.gridRulesOptions.data = response.items;
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
        }
        vm.loadConditsPage = function (id, psize)
        {
            $rootScope.loadingProgress = true;
            api.productsCondits.getAll.get({ pid:id, nbp:psize } ,
                // Success
                function (response)
                {
                    vm.gridConditsOptions.totalItems = response.count;
                    vm.gridConditsOptions.data = response.items;
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
        }

        vm.clearParentProduct = function() {
            vm.item.parent = null;
        }

        vm.showParentsDialog = function(ev) {
            $mdDialog.show({
                controller         : ParentsDialogController,
                controllerAs       : 'vm',
                templateUrl        : 'app/main/produits/edit/dialogs/produit-parent/produit-parent.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true})
                .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                $scope.status = 'You cancelled the dialog.';
                });
        }

        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour produit"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            vm.item.objectif = vm.mois;
            api.products.add.post({ id:$scope.id, product: vm.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_list");
                    
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.removeRule = function(ev,rule) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer cette ligne?')
                .textContent('(Cette action est irréversible))')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                api.rules.delete.delete({ id:rule._id } ,
                // Success
                function (response)
                {
                    vm.loadRulesPage(1,10);
                    $rootScope.loadingProgress = false;
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
        }
        $scope.addRule = function(ev,r) {
            $mdDialog.show({
                controller         : 'RulesEditController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/produits/edit/dialogs/rule/rule-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Rule : (r?r:{produit:$scope.id,weeks:[],_id:-1}),
                    Rules: vm.rules,
                    event: ev
                }
            }).then(function (rule) {
                vm.loadRulesPage(1,10);
            }, function () {
                //$scope.status = 'You cancelled the dialog.';
            });;
            //$state.go("app.produits_edit.rules_edit", {id:-1,idProduit:$scope.item._id, prod:$scope.item });
        }
        if (vm.item._id)
        {
            vm.loadRulesPage(1,10);
        }
        vm.loadConditsPage(1,10);
    }

    /** @ngInject */
    function objectifLine()
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/produits/edit/templates/objectifLine.html',
            link: function(scope) {
                scope.it = scope.m;
                if (!scope.it.rendements)
                {scope.it.rendements = {};}
                scope.expandStateIco = "icon-plus";
                scope.expanded = false;
                scope.expandClick = function()
                {
                    if (scope.expanded)
                    {
                        scope.expandStateIco = "icon-plus";
                        scope.expanded = false;
                    }
                    else {
                        scope.expandStateIco = "icon-minus";
                        scope.expanded = true;
                    }
                }
                scope.recalc = function(t,o)
                {
                    if (t === "m")
                    {
                        angular.forEach(scope.it.weeks, function(value) {
                            //console.log(scope.it.rendements[value]);
                           
                            scope.it.rendements[value] = {
                                val:scope.it.rendement.val / scope.it.weeks.length,
                                unit:scope.it.rendement.unit
                            }; 
                        });
                    }
                    else {
                        scope.it.rendement = {
                            val:0,
                            unit:scope.it.rendement.unit
                        };
                        angular.forEach(scope.it.weeks, function(value) {
                            scope.it.rendement = {
                                val:scope.it.rendement.val + scope.it.rendements[value].val,
                                unit:scope.it.rendement.unit
                            };
                        });
                    }
                }
            }
        };
    }
})();