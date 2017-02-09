(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('prevsByProdukt', prevsByProdukt);

    /** @ngInject */
    function prevsByProdukt(api)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/stats/prevs/directives/prevs-by-produkt/prevs-by-produkt.html',
            link: function(scope) {
                
                
                scope.refreshPrevsByProdukt = function()
                {
                    scope.cPrevsByProdukt = {
                        labels:[],
                        series: [],
                        colors: [],
                        data:[],
                        options:{
                            legend: {display: true},
                            maintainAspectRatio:false,
                            size: {
                                height: 300,
                                width: 400
                            }
                        },
                        datasetOverride:[]
                    };
                    var args = { prodsIds:scope.getProdsIds(),dateFrom:scope.filters.dateFrom,dateTo:scope.filters.dateTo, dateFormat:scope.filters.groupMode }
                    api.stats.prevsByDay.post( args ,
                        // Success
                        function (response)
                        {   
                            scope.cPrevsByProdukt.labels = scope.getLabels(scope.cPrevsByProdukt.labels);
                            scope.cPrevsByProdukt.series = scope.getSeries(scope.cPrevsByProdukt.series,scope.cPrevsByProdukt.colors);
                            scope.cPrevsByProdukt.colors = scope.getColors(scope.cPrevsByProdukt.series,scope.cPrevsByProdukt.colors);
                            var dataTmp = [];
                            for (var iprods = 0;iprods<scope.filters.selectedItems.length;iprods++)
                            {
                                var prod = scope.filters.selectedItems[iprods];
                                for (var ilabs = 0;ilabs<scope.cPrevsByProdukt.labels.length;ilabs++)
                                {
                                    var lab = scope.cPrevsByProdukt.labels[ilabs];
                                    var found = false;
                                    for (var iresp = 0;iresp<response.items.length;iresp++)
                                    {
                                        var o = response.items[iresp];
                                        if (o._id.produit == prod._id)
                                        {
                                            var tester;
                                            switch (scope.filters.groupMode)
                                            {
                                                case "w":
                                                    tester = "S" + o._id.week + "/" + o._id.year;
                                                    break;
                                                case "m":
                                                    tester = o._id.month + "/" + o._id.year;
                                                    break;
                                            }
                                            if (tester === lab) 
                                            {
                                                dataTmp.push(o.count);
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!found) { dataTmp.push(0); }
                                }
                                scope.cPrevsByProdukt.data.push(dataTmp);
                                scope.cPrevsByProdukt.datasetOverride.push({type: 'bar'})
                            }
                            if (scope.filters.showObjectifs) {
                                for (var iprods = 0;iprods<scope.filters.selectedItems.length;iprods++)
                                {
                                
                                    var objs = [];
                                    //$scope.cLines.colors.push($scope.filters.selectedItems[i].bgColor);
                                    for (var ilabs = 0;ilabs<scope.cPrevsByProdukt.labels.length;ilabs++)
                                    {
                                        objs.push(scope.getObjectif(scope.cPrevsByProdukt.labels[ilabs],scope.filters.selectedItems[iprods]._id));
                                    }
                                    scope.cPrevsByProdukt.datasetOverride.push({label:"Obj. " + scope.filters.selectedItems[iprods].lib,type: 'line',borderWidth: 1})
                                    scope.cPrevsByProdukt.data.push(objs);
                                }
                            }
                        },
                        function (response)
                        {
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
                scope.refreshPrevsByProdukt();             
            }
        };
    }
})();