(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('prevsByProdukteur', prevsByProdukteur);

    /** @ngInject */
    function prevsByProdukteur(api)
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/stats/prevs/directives/prevs-by-produkteur/prevs-by-produkteur.html',
            link: function(scope) {
                
                
                scope.refreshPrevsByProdukteur = function()
                {
                    scope.clinesProducteurs = {
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
                    }
                    var args = { prodsIds:scope.getProdsIds(),dateFrom:scope.filters.dateFrom,dateTo:scope.filters.dateTo, dateFormat:scope.filters.groupMode }
                    api.stats.prevsByProd.post( args ,
                        // Success
                        function (response)
                        {   
                            scope.producteurs = response.producteurs;
                            scope.clinesProducteurs.labels = scope.getLabels(scope.clinesProducteurs.labels);
                            //scope.clinesProducteurs.series = scope.getSeries(scope.clinesProducteurs.series,scope.clinesProducteurs.colors);
                            //scope.clinesProducteurs.colors = scope.getColors(scope.clinesProducteurs.series,scope.clinesProducteurs.colors);
                            for (var i = 0;i < scope.producteurs.length;i++)
                            {   
                                var sumP = 0;
                                var dataTmp = [];
                                var found= false;
                                scope.clinesProducteurs.series.push(scope.producteurs[i].name + " " + scope.producteurs[i].surn);
                                switch(scope.groupMode)
                                {
                                    case "w":
                                        for (var i3 = 0;i3<scope.clinesProducteurs.labels.length;i3++)
                                        {
                                            found = false;
                                            for (var i2 = 0;i2<response.items.length;i2++)
                                            {
                                                var o = response.items[i2];
                                                if (o._id.producteur == scope.producteurs[i]._id)
                                                {
                                                    if (("S" + o._id.week + "/" + o._id.year) === scope.clinesProducteurs.labels[i3]) 
                                                    {
                                                        sumP+= o.count;
                                                        dataTmp.push(o.count);
                                                        found = true;
                                                    }
                                                }
                                            }
                                            if (!found) { dataTmp.push(0); }
                                        }
                                        break;
                                    case "m":
                                        for (var i3 = 0;i3<scope.clinesProducteurs.labels.length;i3++)
                                        {
                                            found = false;
                                            for (var i2 = 0;i2<response.items.length;i2++)
                                            {
                                                var o = response.items[i2];
                                                if (o._id.producteur == scope.producteurs[i]._id)
                                                {
                                                    if ((o._id.month + "/" + o._id.year) === scope.clinesProducteurs.labels[i3]) 
                                                    {
                                                        sumP+= o.count;
                                                        dataTmp.push(o.count);
                                                        found = true;
                                                    }
                                                }
                                            }
                                            if (!found) { dataTmp.push(0); }
                                        }
                                        break;
                                }
                                scope.clinesProducteurs.data.push(dataTmp);
                                scope.clinesProducteurs.datasetOverride.push({type: 'bar'})
                            }

                            if (scope.filters.showObjectifs) {
                                for (var iprods = 0;iprods<scope.filters.selectedItems.length;iprods++)
                                {
                                
                                    var objs = [];
                                    //scope.cLines.colors.push(scope.filters.selectedItems[i].bgColor);
                                    for (var ilabs = 0;ilabs<scope.clinesProducteurs.labels.length;ilabs++)
                                    {
                                        objs.push(scope.getObjectif(scope.clinesProducteurs.labels[ilabs],scope.filters.selectedItems[iprods]._id));
                                    }
                                    scope.clinesProducteurs.datasetOverride.push({label:"Obj. " + scope.filters.selectedItems[iprods].lib,type: 'line',borderWidth: 1})
                                    scope.clinesProducteurs.data.push(objs);
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
                scope.refreshPrevsByProdukteur();             
            }
        };
    }
})();