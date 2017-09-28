(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('statsAgreaGlobals', statsAgreaGlobals);

    /** @ngInject */
    function statsAgreaGlobals(api,standardizer,$filter)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/agreage/stats/directives/stats-agrea-globals/stats-agrea-globals.html',
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
                scope.refreshStatsAgreaGlobals = function()
                {
                     scope.cDonutProducteurs = {
                        labels:[],
                        series: [],
                        colors: [],
                        data:[],
                        options:{
                            legend: {display: false}
                        }
                    };
                    scope.cDonutStations = {
                        labels:[],
                        series: [],
                        colors: [],
                        data:[],
                        options:{
                            legend: {display: false}
                        }
                    };
                    scope.cDonutProdutks = {
                        labels:[],
                        series: [],
                        colors: [],
                        data:[],
                        options:{
                            legend: {display: false}
                        }
                    };

                    var args = { producteurs:[],dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo  }
                     api.bons.getStatGlobal.post( args ,
                        // Success

                        function (response)
                        {
                            angular.forEach(response.byProduits, function(value) {
                                var line = value;
                                angular.forEach(response.produits, function(value) {
                                    if (value._id == line._id.produit)
                                    {
                                        scope.cDonutProdutks.labels.push(value.lib);
                                    }
                                });
                                scope.cDonutProdutks.data.push(value.count);
                            });
                            angular.forEach(response.byStations, function(value) {
                                var line = value;
                                angular.forEach(response.stations, function(value) {
                                    if (value._id == line._id.station)
                                    {
                                        scope.cDonutStations.labels.push(value.lib);
                                    }
                                });
                                scope.cDonutStations.data.push(value.count);
                            });
                            angular.forEach(response.byProducteurs, function(value) {
                                var line = value;
                                angular.forEach(response.producteurs, function(value) {
                                    if (value._id == line._id.producteur)
                                    {
                                        scope.cDonutProducteurs.labels.push(value.name + " " + value.surn);
                                    }
                                });
                                scope.cDonutProducteurs.data.push(value.count);
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
                scope.refreshStatsAgreaGlobals();             
            }
        };
    }
})();