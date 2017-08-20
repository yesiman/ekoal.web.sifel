(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('statsAgreaProducteurs', statsAgreaProducteurs);

    /** @ngInject */
    function statsAgreaProducteurs(api,standardizer,$filter)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/agreage/stats/directives/stats-agrea-producteurs/stats-agrea-producteurs.html',
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
                scope.refreshStatsAgreaProducteurs = function()
                {
                    var args = { producteurs:[],dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo  }
                     api.bons.getStatProducteurs.post( args ,
                        // Success
                        function (response)
                        {
                            scope.cPrevsByProducteur = {
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
                            scope.cPrevsByProducteur.labels = scope.getLabels(response.result);
                            angular.forEach(response.producteurs, function(value) {
                                var prod = value;
                                scope.cPrevsByProducteur.series.push(prod.name);
                                scope.cPrevsByProducteur.colors.push(prod.color);
                                var tA = [];
                                angular.forEach(scope.cPrevsByProducteur.labels, function(value) {
                                    var label = value;
                                    var found = false;
                                    
                                    angular.forEach(response.result, function(value) {
                                        var data = value;
                                        if (
                                            ((data._id.day + "/" + data._id.month + "/" + data._id.year) == label) && 
                                            (data._id.producteur == prod._id))
                                        {
                                            found = true;
                                            tA.push(data.count);
                                        }
                                    });
                                    if (!found) { tA.push(0); }
                                });
                                scope.cPrevsByProducteur.data.push(tA);
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
                scope.refreshStatsAgreaProducteurs();             
            }
        };
    }
})();