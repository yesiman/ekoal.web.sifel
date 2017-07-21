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
                        fillColor: function(row, col, node) { return row > 0 && row % 2 ? 'yellow' : null; },
                        widths: ["14%","14%","14%","14%","14%","14%","14%"],
                        body: [
                            [{ text: "Palette",  style: 'tableHead'}, { text: "Produit",  style: 'tableHead'}, { text: "Calibre",  style: 'tableHead'}, { text: 'Nbre colis',  style: 'tableHead'},{ text: 'Poid brut',  style: 'tableHead'},{ text: 'tare',  style: 'tableHead'},{ text: 'poid net',  style: 'tableHead'}]
                        ]
                    };
                    wkbon.palettes.forEach(function(element) {  
                        var pal = element;
                        element.produits.forEach(function(element) {
                            var ltab = [];
                            ltab.push(pal.no);
                            ltab.push(element.produit);
                            ltab.push(element.categorie);
                            ltab.push(element.colisNb);
                            ltab.push(0);
                            ltab.push(0);
                            ltab.push(element.poid);
                            lines.body.push(ltab);
                        }, this);
                    }, this);
                    return lines;
                },
                getContent: function getContent()
                {
                    return [
                            {
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                text : 'Date:' + wkbon.dateDoc
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                
                                                text : "BON d'APPORT N°"
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                text : "\n"
                            },
                            {
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            {
                                                alignment: 'center',
                                                text : [
                                                    
                                                    { text: "PRODUCTEUR\n\n", fontSize: 15},
                                                    { text: "N°" + wkbon.producteur.codeAdh + "\n"}
                                                ]
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment: 'center',
                                                text : [
                                                    { text: "SCA Fruits de la Réunion\n", fontSize: 15},
                                                    { text: "7, chemin de l'Océan - 97450 Saunt Louis\n"},
                                                    { text: "97450 Saint Louis\n"},
                                                    { text: "SCA Fruits de la Réunion\n"}
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                text : "\n"
                            },
                            {
                                table: {
                                    
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                text : [
                                                    { text: "Station de conditionnement: " + wkbon.station.code }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },{
                                text : "\n"
                            },
                            {
                                table: service.ba.getTableLines()
                            }
                        ];
                },
                getFooter: function getFooter()
                {
                    return function(currentPage, pageCount) { 
                        if (currentPage == pageCount)
                        {
                        return  {
                                table: {
                                    widths: ["1%","32%","1%","32%","1%","32%","1%"],
                                    body: [
                                        [
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
                                                    width:200
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
                                                    width:200
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
                                                    width:200
                                                }
                                            ],
                                            {
                                                border:[false, false, false, false],
                                                text : "\n"
                                            }
                                        ]
                                    ]
                                }
                            }
                        }   
                    }
                },
                make: function make(el,bon){
                    wkbon = bon;
                    html2canvas(document.getElementById('exportthis'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        dd.pageMargins = [40, 80, 40, 150];
                        dd.styles = service.ba.getStyles();
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