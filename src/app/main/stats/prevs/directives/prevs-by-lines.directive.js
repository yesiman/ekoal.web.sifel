(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('prevsByLines', prevsByLines);

    /** @ngInject */
    function prevsByLines(api,standardizer,$filter,$mdDialog)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/stats/prevs/directives/prevs-by-lines/prevs-by-lines.html',
            link: function(scope) {
                var producteurHtml = '<div class="ui-grid-cell-contents">';
                producteurHtml += '{{grid.appScope.getProducteurName(row.entity.producteur)}}';
                producteurHtml += '</div>';
                var semaineHtml = '<div class="ui-grid-cell-contents">';
                semaineHtml += 'S{{row.entity.semaine}} / {{row.entity.startAt | date : "yyyy"}}';
                semaineHtml += '</div>';
                var qteHtml = '<div class="ui-grid-cell-contents">';
                qteHtml += "{{grid.appScope.getGoodQte(row.entity)}} {{(grid.appScope.filters.unitMode == '1'?'Kilos':'Tonnes')}}";
                qteHtml += '</div>';
                var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
                actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
                actionsHtml += '</div>';
                scope.gridPlanifOptions = standardizer.getGridOptionsStd();
                scope.gridPlanifOptions.columnDefs = [
                    { field: 'semaine', sort:{priority:0}, displayName: 'Semaine', cellTemplate:semaineHtml },
                    { field: 'producteur', displayName: 'Producteur', cellTemplate:producteurHtml },
                    { field: 'qte.val', displayName: 'Quantité', cellTemplate:qteHtml },
                    { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];
                    //
                scope.getGoodQte = function(el) {
                    return standardizer.getPoidsInAskVal(el.qte,scope.filters.unitMode);
                }
                scope.getProducteurName = function(id) {
                    for (var i = 0;i < scope.producteurs.length;i++)
                    {
                        if (scope.producteurs[i]._id === id)
                        {
                            return scope.producteurs[i].surn + " " + scope.producteurs[i].name;
                        }
                    }
                    return "";
                }

                scope.refreshPrevsByLines = function()
                {
                    var args = { prodsIds:scope.getProdsIds(),dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo, dateFormat:scope.groupMode,
                        unit:scope.filters.unitMode  }
                    args.pid = 1;
                    args.nbp = 100;   
                    api.stats.prevsPlanifsLines.post( args ,
                        // Success
                        function (response)
                        {
                            response.items = $filter('orderBy')(response.items, "startAt", false)
                            scope.gridPlanifOptions.data  = response.items;
                        },
                        // Error
                        function (response)
                        {
                            //$rootScope.loadingProgress = false;
                        }
                    );
                }
                scope.$watch('refreshMethod', function (value) {
                    /*Checking if the given value is not undefined*/
                    if(value){
                        scope.Obj = value;
                        /*Injecting the Method*/
                        scope.Obj.invoke = function(){
                            refreshMe();
                        }
                    }    
                });

                scope.closeMe = function()
                {
                    $mdDialog.hide();
                }
                scope.validLine = function(item)
                {
                    //Save planif line
                    //Update only line in grid
                    //Refresh graphs
                    console.log("iv",item);
                    $mdDialog.hide();
                }
                // MAJ PLANIF
                var mdDialogPlCtrl = function (scope, item,onCancel,onValid) { 
                    scope.dialog = { 
                        weeks:[],
                        years:[]
                    };
                    for (var i = 1;i < 53;i++)
                    {
                        scope.dialog.weeks.push(i);
                    }
                    for (var i = 2010;i < 2030;i++)
                    {
                        scope.dialog.years.push(i);
                    }
                    scope.item = item;
                    scope.onCancel = onCancel;
                    scope.onValid = onValid;   
                }

                scope.showPlanif = function(ev,il){
            
                    var item;
                    if (il)
                    {
                        item = il;
                    } 
                    else 
                    {
                        item = {qte:0};
                    }
                    //scope.dialogItems = response.items;
                    var locals = {item: item, onCancel: scope.closeMe, onValid: scope.validLine };
                    $mdDialog.show({
                        templateUrl: 'app/main/planifs/edit/dialogs/addEdit.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: locals,
                        controller: mdDialogPlCtrl,
                        controllerAs: 'ctrl',
                        clickOutsideToClose:true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                        })
                        .then(function(answer) {
                        scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                        scope.status = 'You cancelled the dialog.';
                    });            
                }
                //
                //PERCENT DEFALQ
                var mdDialogPcCtrl = function (scope,onCancel,onValid) { 
                    scope.percent=0;
                    scope.onCancel = onCancel;
                    scope.onValid = onValid;
                }

                scope.closeMe = function()
                {
                    $mdDialog.hide();
                }
                //VALI NB JOURS POPUP
                scope.validPercent = function(val,mode)
                {    

                    var args = { prodsIds:scope.getProdsIds(),dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo, dateFormat:scope.groupMode}
                    api.stats.prevsPlanifsLinesApplyPercent.post( args ,
                        // Success
                        function (response)
                        {
                            scope.refreshPrevsByLines();
                            $mdDialog.hide();
                        },
                        // Error
                        function (response)
                        {
                            
                            //$rootScope.loadingProgress = false;
                        }
                    );
                }

                scope.showPopPercent = function(ev)
                {
                    var locals = {onCancel: scope.closeMe, onValid: scope.validPercent };
                    $mdDialog.show({
                        templateUrl: 'app/main/stats/prevs/directives/prevs-by-lines/dialogs/percent.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: locals,
                        controller: mdDialogPcCtrl,
                        controllerAs: 'ctrl',
                        clickOutsideToClose:true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                        })
                        .then(function(answer) {
                        }, function() {
                        
                    });      

                }
                //
                scope.refreshPrevsByLines();             
            }
        };
    }
})();