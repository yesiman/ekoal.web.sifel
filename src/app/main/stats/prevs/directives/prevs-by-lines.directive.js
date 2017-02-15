(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('prevsByLines', prevsByLines);

    /** @ngInject */
    function prevsByLines(api,standardizer,$filter)
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
                semaineHtml += '{{row.entity.semaine}} / {{row.entity.startAt | date : "yyyy"}}';
                semaineHtml += '</div>';
                var qteHtml = '<div class="ui-grid-cell-contents">';
                qteHtml += '{{grid.appScope.getGoodQte(row.entity)}}';
                qteHtml += '</div>';
                scope.gridPlanifOptions = standardizer.getGridOptionsStd();
                scope.gridPlanifOptions.columnDefs = [
                        { field: 'semaine', sort:{priority:0}, displayName: 'Semaine', cellTemplate:semaineHtml },
                        { field: 'producteur', displayName: 'Producteur', cellTemplate:producteurHtml },
                        { field: 'qte.val', displayName: 'Quantité', cellTemplate:qteHtml }];   
                
                
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
                scope.refreshPrevsByLines();             
            }
        };
    }
})();