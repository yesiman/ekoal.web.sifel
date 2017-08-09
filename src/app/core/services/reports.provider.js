(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('reports', reports);

    /** @ngInject **/
    function reports()
    {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        //var $rootScope = angular.injector(['ng']).get('$rootScope');
        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = function ()
        {
            var service = {};
            var wkbon;
            //
            var dateDocFormated;
            var dd = {}
            service.ba = {
                getStyles: function getStyles()
                {
                    return {
                        tableHead: { fillColor: '#d2d2d2' }
                    };
                },
                getTableLines: function getTableLines()
                {
                    var lines = {
                        widths: ["10%","*","20%","10%","10%","10%","10%"],
                        body: [
                            [
                                { text: "Palette",  style: 'tableHead'}, 
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: "Calibre",  style: 'tableHead'}, 
                                { text: 'Nbre colis',  style: 'tableHead'},
                                { text: 'Poid brut',  style: 'tableHead'},
                                { text: 'tare',  style: 'tableHead'},
                                { text: 'poid net',  style: 'tableHead'}
                            ]
                        ]
                    };
                    var totalNet = 0;
                   for (var i = 0;i < 100;i++)
                   {
                       wkbon.palettes.forEach(function(element) {  
                        var pal = element;
                        element.produits.forEach(function(element) {
                            var ltab = [];
                            ltab.push(pal.no);
                            ltab.push(element.produit.lib);
                            ltab.push(element.categorie.lib);
                            ltab.push(element.colisNb);
                            ltab.push(element.poid);
                            ltab.push((element.tare?element.tare:0));
                            ltab.push(element.poid + (element.tare?element.tare:0));
                            totalNet += (element.poid + (element.tare?element.tare:0));
                            lines.body.push(ltab);
                        }, this);
                    }, this); 
                   }
                    
                    lines.body.push([
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:totalNet}
                    ]);

                    return lines;
                },
                getContent: function getContent()
                {
                    return [
                            {
                                table: service.ba.getTableLines()
                            }
                        ];
                },
                getHeader: function getHeader()
                {
                    return function(currentPage, pageCount) { 
                        //if (currentPage == pageCount)
                        //{
                            return  {stack:[{
                                margin: [ 0, 0, 0, 0 ],
                                table: {
                                    
                                    widths: ["45%","10%","45%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                text : 'Date: ' + wkbon.dateDocFormated
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment:'center',
                                                text : "BON D'APPORT N° " + wkbon.numBon
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    
                                    widths: ["45%","10%","45%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                text : ''
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ''
                                            },
                                            {
                                                border:[true, false, true, true],
                                                alignment:'center',
                                                text : "VAUT TICKET DE PESEE"
                                                ,style: 'tableHead'
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 10 ],
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            {
                                                text : [ 
                                                    { text: "STATION: " + wkbon.station.code + "\n" },
                                                    { text: "PRODUCTEUR: " + wkbon.producteur.codeAdh + "\n"},
                                                    { text: (wkbon.destination == "export"?"LTA : " + wkbon.noLta + "\n":"") },
                                                    { text: (wkbon.destination == "export"?"LOT: " + wkbon.noLot:"") }
                                                ]
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment: 'center',
                                                text : [
                                                    { text: "SCA Fruits de la Réunion\n\n", fontSize: 15},
                                                    { text: "7, chemin de l'Océan\n"},
                                                    { text: "97450 Saint Louis\n"},
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            }], margin: [20,20,20,0]}
                        //}   
                        //else {
                        //    return  {
                        //        text:"test",
                        //            height:1000
                        //    }
                        //}
                    }
                },
                getFooter: function getFooter()
                {
                    return function(currentPage, pageCount) { 
                        //if (currentPage == pageCount)
                        //{
                            return  {stack:[{
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                height:100,
                                                text : [
                                                    { text: "Remarques: " + wkbon.station.remarques }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    widths: ["32%","1%","32%","1%","33%"],
                                    body: [
                                        [
                                            [
                                                {
                                                    text : "Signature Agréeur"
                                                },
                                                { 
                                                    image: wkbon.signatures.sigTechnicien,
                                                    fit: [100, 100]
                                                }
                                            ],
                                            {
                                                border:[false, false, false, false],
                                                text : "\n"
                                            },
                                        [
                                                {
                                                    text : "Signature Agréeur"
                                                },
                                                { 
                                                    image: wkbon.signatures.sigTechnicien,
                                                    fit: [100, 100]
                                                }
                                            ],
                                            {
                                                border:[false, false, false, false],
                                                text : "\n"
                                            },
                                            [
                                                {
                                                    text : "Signature Producteur"
                                                },
                                                { 
                                                    image: wkbon.signatures.sigProducteur,
                                                    fit: [100, 100]
                                                }
                                            ]
                                        ]
                                    ]
                                }
                            },
                            {
                            table: {
                                    
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                text : [
                                                    { 
                                                        text: currentPage + "/" + pageCount,
                                                    fontSize: 8,
                                                    alignment:'center'
                                                    }
                                                ],
                                                border:[false, false, false, false] 
                                            }  
                                        ]
                                    ]
                                }}], margin: [20,0,20,0]}
                        //}   
                        //else {
                        //    return  {
                        //        text:"test",
                        //            height:1000
                        //    }
                        //}
                    }
                },
                make: function make(el,bon){
                    wkbon = bon;
                    //
                    var ddd = wkbon.dateDoc.getDate();
                    var mm = wkbon.dateDoc.getMonth()+1;
                    var yyyy = wkbon.dateDoc.getFullYear();
                    if(ddd<10){
                        ddd='0'+ddd;
                    } 
                    if(mm<10){
                        mm='0'+mm;
                    } 
                    wkbon.dateDocFormated = ddd+'/'+mm+'/'+yyyy;
                    
                    html2canvas(document.getElementById('exportthis'), {
                        onrendered: function (canvas) {
                            var data = canvas.toDataURL();
                            dd.pageMargins = [20, 140, 20, 140];
                            dd.styles = service.ba.getStyles();
                            dd.header = service.ba.getHeader();
                            dd.footer = service.ba.getFooter();
                            dd.content = service.ba.getContent();
                            console.log(dd);
                            pdfMake.createPdf(dd).open();
                        }
                    });
                }
            };
            return service;
        };
    }
})();