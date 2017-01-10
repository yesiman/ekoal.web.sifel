(function ()
{
    'use strict';

    angular
        .module('app.dashboards.server')
        .controller('DashboardServerController', DashboardServerController);

    /** @ngInject */
    function DashboardServerController($scope, $interval, DashboardData)
    {
        var vm = this;

        // Data
        vm.dashboardData = DashboardData;

        // Widget 1
        /*
        vm.widget1 = {
            title: vm.dashboardData.widget1.title,
            chart: {
                options: {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#4caf50', '#3f51b5', '#ff5722'],
                        height                 : 320,
                        margin                 : {
                            top   : 32,
                            right : 32,
                            bottom: 32,
                            left  : 48
                        },
                        useInteractiveGuideline: true,
                        clipVoronoi            : false,
                        interpolate            : 'cardinal',
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + ' min.';
                            },
                            showMaxMin: false
                        },
                        yAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + ' MB';
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        },
                        legend                 : {
                            margin    : {
                                top   : 8,
                                right : 0,
                                bottom: 32,
                                left  : 0
                            },
                            rightAlign: false
                        }
                    }
                },
                data   : vm.dashboardData.widget1.chart
            }
        };
        */
        // Widget 2
        vm.widget2 = "Titre";

        // Widget 3
        vm.widget3 = "Titre";

        // Widget 5
        //vm.widget5 = vm.dashboardData.widget5;

        // Widget 6
        /*
        vm.widget6 = {
            title: vm.dashboardData.widget6.title,
            chart: {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#03A9F4'],
                        height                 : 140,
                        margin                 : {
                            top   : 8,
                            right : 32,
                            bottom: 16,
                            left  : 48
                        },
                        duration               : 1,
                        clipEdge               : true,
                        clipVoronoi            : false,
                        interpolate            : 'cardinal',
                        isArea                 : true,
                        useInteractiveGuideline: true,
                        showLegend             : false,
                        showControls           : false,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        yDomain                : [0, 100],
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + ' sec.';
                            },
                            showMaxMin: false
                        },
                        yAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + '%';
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data   : vm.dashboardData.widget6.chart
            },
            init : function ()
            {
                // Run this function once to initialize the widget

                // Grab the x value
                var lastIndex = vm.dashboardData.widget6.chart[0].values.length - 1,
                    x = vm.dashboardData.widget6.chart[0].values[lastIndex].x;

                
                function cpuTicker(min, max)
                {
                    // Increase the x value
                    x = x + 5;

                    var newValue = {
                        x: x,
                        y: Math.floor(Math.random() * (max - min + 1)) + min
                    };

                    vm.widget6.chart.data[0].values.shift();
                    vm.widget6.chart.data[0].values.push(newValue);
                }

                // Set interval
                var cpuTickerInterval = $interval(function ()
                {
                    cpuTicker(0, 100);
                }, 5000);

                // Cleanup
                $scope.$on('$destroy', function ()
                {
                    $interval.cancel(cpuTickerInterval);
                });
            }
        };
        */
        /* vm.widget7 = {
            title    : vm.dashboardData.widget7.title,
            table    : vm.dashboardData.widget7.table,
            dtOptions: {
                dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple',
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                autoWidth : false,
                responsive: true,
                columnDefs: [
                    {
                        width  : '20%',
                        targets: [0, 1, 2, 3, 4]
                    }
                ],
                columns   : [
                    {},
                    {},
                    {
                        render: function (data, type)
                        {
                            if ( type === 'display' )
                            {
                                return data + ' KB/s';
                            }
                            else
                            {
                                return data;
                            }
                        }
                    },
                    {
                        render: function (data, type)
                        {
                            if ( type === 'display' )
                            {
                                return data + '%';
                            }
                            else
                            {
                                return data;
                            }
                        }
                    },
                    {
                        render: function (data, type)
                        {
                            if ( type === 'display' )
                            {
                                var el = angular.element(data);
                                el.html(el.text() + ' MB');

                                return el[0].outerHTML;
                            }
                            else
                            {
                                return data;
                            }
                        }
                    }
                ]
            }
        };

        
        vm.widget8 = vm.dashboardData.widget8;
*/
        // Methods

        //////////

        // Init Widget 4
        //vm.widget4.init();

        // Init Widget 6
        //vm.widget6.init();
    }
})();