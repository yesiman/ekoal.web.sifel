(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('statsAgreaStations', statsAgreaStations);

    /** @ngInject */
    function statsAgreaStations(api,standardizer,$filter)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/agreage/stats/directives/stats-agrea-stations/stats-agrea-stations.html',
            link: function(scope) {
                
                
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
                scope.refreshStatsAgreaStations = function()
                {
                    var args = { producteurs:[],dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo  }
                     api.bons.getStatStations.post( args ,
                        // Success
                        function (response)
                        {
                            scope.cPrevsByStation = {
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
                                }
                            };
                            scope.cPrevsByStation.labels = scope.getLabels(response.result);
                            angular.forEach(response.stations, function(value) {
                                var stat = value;
                                scope.cPrevsByStation.series.push(stat.lib);
                                scope.cPrevsByStation.colors.push(stat.color);
                                var tA = [];
                                angular.forEach(scope.cPrevsByStation.labels, function(value) {
                                    var label = value;
                                    var found = false;
                                    
                                    angular.forEach(response.result, function(value) {
                                        var data = value;
                                        if (
                                            ((data._id.day + "/" + data._id.month + "/" + data._id.year) == label) && 
                                            (data._id.station == stat._id))
                                        {
                                            found = true;
                                            tA.push(data.count);
                                        }
                                    });
                                    if (!found) { tA.push(0); }
                                });
                                scope.cPrevsByStation.data.push(tA);
                            });

                            
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
                //
                scope.refreshStatsAgreaStations();             
            }
        };
    }
})();