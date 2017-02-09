(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('prevsByLines', prevsByLines);

    /** @ngInject */
    function prevsByLines(api,standardizer)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/stats/prevs/directives/prevs-by-lines/prevs-by-lines.html',
            link: function(scope) {
                
                scope.gridPlanifOptions = standardizer.getGridOptionsStd();
                scope.gridPlanifOptions.columnDefs = [
                        { field: 'semaine', displayName: 'Semaine' },
                        { field: 'qte.val', displayName: 'Quantité' }];   

                scope.refreshPrevsByLines = function()
                {
                    var args = { prodsIds:scope.getProdsIds(),dateFrom:scope.filters.dateFrom,dateTo:scope.filters.dateTo, dateFormat:scope.groupMode }
                    args.pid = 1;
                    args.nbp = 100;   
                    api.stats.prevsPlanifsLines.post( args ,
                        // Success
                        function (response)
                        {
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