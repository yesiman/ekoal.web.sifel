(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('douanesProducts', douanesProductsDirective);

    /** @ngInject */
    function douanesProductsDirective(standardizer,api,$rootScope,$mdDialog)
    {
        return {
            restrict   : 'E',
            transclude : true,
            scope: {
                onSelect:'&',
                mode:'@'
            },
            templateUrl: 'app/core/directives/fabio-ui/templates/douanes-products/douanes-products.html',
            link: function(scope) {
                var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
                switch (scope.mode)
                {
                    case "sel":
                        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.loadChildsViaGrid(row.entity)"><md-tooltip>Voir enfants</md-tooltip><md-icon class="rem" md-font-icon="icon-dots-horizontal"></md-icon></md-button>';
                        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.select(row.entity)"><md-tooltip>Sélectionner</md-tooltip><md-icon class="rem" md-font-icon="icon-check"></md-icon></md-button>';
                        break;
                    default:
                        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.edit(row.entity._id)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
                        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.loadChildsViaGrid(row.entity)"><md-tooltip>Voir enfants</md-tooltip><md-icon class="rem" md-font-icon="icon-dots-horizontal"></md-icon></md-button>';
                }
                actionsHtml += '</div>';
                scope.gridOptions = standardizer.getGridOptionsStd();
                scope.gridOptions.columnDefs = [
                        { field: 'code', displayName: 'Code' },
                        { field: 'lib', displayName: 'Libellé' },
                        { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }];
                         
                scope.curLevel = 0;
                scope.pile = [];
                
                scope.select = function(it) {
                    scope.onSelect({myParam:it});
                }

                scope.loadChildsViaGrid = function(parent) {
                    scope.pile.push(parent);
                    scope.loadChilds(parent.code);
                }
                
                scope.loadChilds = function(parent) {
                    scope.curLevel++;
                    $rootScope.loadingProgress = true;
                    //var pCode = -1;
                   
                    //console.log("pCpode",pCode);
                    api.products.getAllFromDouane.get({ level:scope.curLevel,parent:parent },
                        // Success
                        function (response)
                        {
                            scope.data = response.items;
                            //scope.parents = response.parents;
                            scope.gridOptions.data = scope.data;
                            $rootScope.loadingProgress = false;
                        },
                        // Error
                        function (response)
                        {
                            $rootScope.loadingProgress = false;
                        }
                    );
                    
                };
                scope.rootCateg = function() {
                    scope.curLevel = 0;
                    scope.pile = [];
                    scope.loadChilds(-1);                    
                }
                scope.backParent = function(it,level) {
                    scope.curLevel = level;
                    if (it.parents.length > 0)
                    {
                        scope.loadChilds(it.parents[it.parents.length-1]);   
                    }
                    else {
                        if (level == 1)
                        {
                            scope.loadChilds(it.code);  
                        }
                        else {
                            scope.curLevel = 0;
                            scope.pile = [];
                            scope.loadChilds(-1);      
                        }
                    }
                    scope.pile.splice(scope.curLevel-1) 
                }
                scope.loadChilds(-1);
            }            
        };
    }
    
})();