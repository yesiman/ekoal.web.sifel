(function ()
{
    'use strict';

    angular
        .module('app.dashboards.server')
        .controller('DashboardServerController', DashboardServerController);

    /** @ngInject */
    function DashboardServerController($scope, $interval, DashboardData, api,$http,$sce)
    {
        var vm = this;

        // Data
        vm.dashboardData = DashboardData;
        vm.chat = [];
 
        var script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "googleMaps";
                script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyAKuOtLqUR5I6LaqCMNADzppolXaH8w2JE&libraries=geometry&callback=mapInit';

                //script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyAKuOtLqUR5I6LaqCMNADzppolXaH8w2JE&libraries=geometry&callback=mapInit';

                document.body.appendChild(script);
            //}
            //else {
                //$scope.mapInit();
                //$scope.drawParc();
            //}
            window.mapInit = function () {
                var map = new google.maps.Map(document.getElementById('map'), {center: {lat: -34.397, lng: 150.644},zoom: 8});
            
            var bounds = new google.maps.LatLngBounds();
            api.users.getParcellesGeo.get({},
                    function (response)
                    {
                        for (var i = 0;i< response.items.length;i++)
                        {
                            var triangleCoords = [];
                            if (response.items[i].coordonnees)
                            {
                                angular.forEach(response.items[i].coordonnees.coordinates, function(value) {
                                    triangleCoords.push({ lat: value[1], lng: value[0] });
                                    console.log(value[1] + ":",value[0])
                                    bounds.extend(new google.maps.LatLng(value[1], value[0]));
                                });
                                var parcelleDraw = new google.maps.Polygon({
                                    paths: triangleCoords,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35
                                });
                                parcelleDraw.setMap(map);
                                map.fitBounds(bounds);
                            }
                        }
                        console.log(response.count);
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                        //return null;
                    }
                );
            };



        var socket = io.connect('http://sifel-srv.herokuapp.com');
        socket.on('numessag', function (data) {
            vm.chat.push({
                replyMessage:data.Body,
                type:"user"
            });
            $scope.$apply();
        });


        vm.addChat = function(){
            
            api.twilio.testTwilio.post({ message:{text:vm.replyMessage} },
                // Success
                function (response)
                {
                    vm.chat.push({
                        replyMessage:vm.replyMessage,
                        type:"contact"
                    });
                    vm.replyMessage = "";
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }

        $scope.uploadProduitsFile = function(){

            var file = $scope.myFileProduits;
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("https://sifel-srv.herokuapp.com/importer/produits/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            console.log("success!!");
            })
            .error(function(){
            console.log("error!!");
            });
        };
        $scope.uploadProducteursFile = function(){

            var file = $scope.myFileProducteurs;
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("https://sifel-srv.herokuapp.com/importer/producteurs/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            console.log("success!!");
            })
            .error(function(){
            console.log("error!!");
            });
        };
        $scope.uploadObjectifFiles = function(){

            var file = $scope.myFileObjectifs;
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("https://sifel-srv.herokuapp.com/importer/objectifs/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            console.log("success!!");
            })
            .error(function(){
            console.log("error!!");
            });
        };
        $scope.uploadParcellesFiles = function(){

            var file = $scope.myFileParcelles;
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("https://sifel-srv.herokuapp.com/importer/parcelles/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            console.log("success!!");
            })
            .error(function(){
            console.log("error!!");
            });
        };
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
        vm.senSms = function() {
            api.twilio.testTwilio.post({ },
                // Success
                function (response)
                {
                    //console.log(response.tk);
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        vm.checkToken = function()
        {
            api.users.refreshToken.get({ },
                // Success
                function (response)
                {
                    console.log(response.tk);
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        vm.clearDb = function()
        {
            api.users.clearAll.get({ },
                // Success
                function (response)
                {
                    //console.log(response.tk);
                },
                // Error
                function (response)
                {
                    //console.error(response);
                }
            );
        }

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