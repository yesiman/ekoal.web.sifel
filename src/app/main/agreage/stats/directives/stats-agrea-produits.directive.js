(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('statsAgreaProduits', statsAgreaProduits);

    /** @ngInject */
    function statsAgreaProduits(api,standardizer,$filter)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/agreage/stats/directives/stats-agrea-produits/stats-agrea-produits.html',
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
                scope.refreshStatsAgreaProduits = function()
                {
                    var args = { producteurs:[],dateFrom:scope.filters.dateFrom,
                        dateTo:scope.filters.dateTo  }
                     api.bons.getStatProduits.post( args ,
                        // Success
                        function (response)
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
                                }
                            };
                            scope.cPrevsByProdukt.labels = scope.getLabels(response.result);
                            angular.forEach(response.produits, function(value) {
                                var prod = value;
                                scope.cPrevsByProdukt.series.push(prod.lib);
                                scope.cPrevsByProdukt.colors.push(prod.color);
                                var tA = [];
                                angular.forEach(scope.cPrevsByProdukt.labels, function(value) {
                                    var label = value;
                                    var found = false;
                                    
                                    angular.forEach(response.result, function(value) {
                                        var data = value;
                                        if (
                                            ((data._id.day + "/" + data._id.month + "/" + data._id.year) == label) && 
                                            (data._id.produit == prod._id))
                                        {
                                            found = true;
                                            tA.push(data.count);
                                        }
                                    });
                                    if (!found) { tA.push(0); }
                                });
                                scope.cPrevsByProdukt.data.push(tA);
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
                scope.refreshStatsAgreaProduits();             
            }
        };
    }
})();