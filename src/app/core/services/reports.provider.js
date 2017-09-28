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
        this.$get = function ($filter   )
        {
            var service = {};
            var wkbon;
            //
            var dateDocFormated;
            var dd = {}
            var prixTotal = 0;
            service.ba = {
                getStyles: function getStyles()
                {
                    return {
                        tableHead: { fillColor: '#d2d2d2' }
                    };
                },
                getRowStation: function getRowStation(type)
                {
                    if (wkbon.destination == "export")
                    {
                        return {
                            widths: ["45%","10%","45%"],
                            body: [
                                    [
                                        (type == "ba"?
                                        { text: "Station: " + wkbon.station.lib}:
                                        { text: "Producteur: " + wkbon.producteur.codeAdh}), 
                                        { border:[false, false, false, false],text: ""}, 
                                    { text: "N° LTA: " + wkbon.noLta}
                                    ]
                                ]
                            };
                    }
                    else {
                        return {
                            widths: ["100%"],
                            body: [
                                    [
                                        { text: "Station: " + wkbon.station.lib}
                                    ]
                                ]
                            };
                    }
                },
                getTableLines: function getTableLines(type)
                {
                    var lines = {
                        widths: (type=="ba"?["10%","*","20%","10%","10%","10%","10%"]:
                            ["10%","*","10%","10%","10%","10%","10%","10%","10%"]),
                        body: [
                            (type=="ba"?
                            [
                                { text: "Palette",  style: 'tableHead'}, 
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: "Catégorie",  style: 'tableHead'}, 
                                { text: 'Nbre colis',  style: 'tableHead'},
                                { text: 'P. brut(kg)',  style: 'tableHead'},
                                { text: 'Tare',  style: 'tableHead'},
                                { text: 'P. net(kg)',  style: 'tableHead'},
                            ]:[
                                { text: "Palette",  style: 'tableHead'}, 
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: "Catégorie",  style: 'tableHead'}, 
                                { text: 'Nbre colis',  style: 'tableHead'},
                                { text: 'P. brut(kg)',  style: 'tableHead'},
                                { text: 'Tare',  style: 'tableHead'},
                                { text: 'P. net(kg)',  style: 'tableHead'},
                                { text: 'Px/kg(€)',  style: 'tableHead'},
                                { text: 'Px total(€)',  style: 'tableHead'}
                            ])
                        ]
                    };
                    var totalNet = 0;
                    prixTotal = 0;
                   //for (var i = 0;i < 100;i++)
                   //{
                       console.log("wkbon.palettes",wkbon.palettes);
                       wkbon.palettes.forEach(function(element) {  
                        var pal = element;
                        element.produits.forEach(function(element) {
                            var ltab = [];
                            ltab.push(pal.no);
                            ltab.push(element.produit.lib + " " + element.calibre);
                            ltab.push((element.categorie.lib?element.categorie.lib:""));
                            ltab.push( {text:element.colisNb,alignment:'right'});
                            ltab.push({ text: $filter('number')(element.poid + (element.tare?element.tare:0), 2),alignment:'right'});
                            ltab.push({ text: $filter('number')((element.tare?element.tare:0), 2),alignment:'right'});
                            ltab.push({ text: $filter('number')(element.poid, 2),alignment:'right'});
                            if (type == "bl")
                            {
                                ltab.push({ text: $filter('number')((element.prixAchat?element.prixAchat:0), 2),alignment:'right'});
                                ltab.push({ text: $filter('number')(element.poid * (element.prixAchat?element.prixAchat:0), 2),alignment:'right'});
                                prixTotal += (element.poid * (element.prixAchat?element.prixAchat:0));
                            }
                            totalNet += (element.poid);
                            lines.body.push(ltab);
                        }, this);
                    }, this); 
                   //}
                    
                    lines.body.push((type=="ba"?[
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:$filter('number')(totalNet, 2),alignment:'right'}
                    ]:[
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:$filter('number')(totalNet, 2),alignment:'right'},
                        {text:"",border:[false, false, false, false]},
                        {text:$filter('number')(prixTotal, 2),alignment:'right'}
                    ]));
                    return lines;
                },
                getContent: function getContent(type)
                {
                    return [
                            {
                                fontSize: 10,
                                table: service.ba.getTableLines(type)
                            }
                        ];
                },
                getHeader: function getHeader(type)
                {
                    return function(currentPage, pageCount) { 
                        //if (currentPage == pageCount)
                        //{
                            return  {stack:[{
                                margin: (type=="ba"?[ 0, 0, 0, 0 ]:[ 0, 0, 0, 5 ]),
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
                                                text : (type=="ba"?"BON D'APPORT N° BA-" + wkbon.numBon:"BON DE LIVRAISON N° BL-" + wkbon.numBon)
                                            }
                                        ]
                                    ]
                                }
                            },
                            (type=="ba"?
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
                            }:{
                                text: ""
                            }),
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            (type == "ba"?
                                            {
                                                alignment: 'center',
                                                text : [ 
                                                    { text: "PRODUCTEUR\n\n", fontSize: 15},
                                                    { text: "N°" + wkbon.producteur.codeAdh }
                                                ]
                                            }:
                                            {
                                                alignment: 'center',
                                                text : [
                                                    { text: "SCA Fruits de la Réunion\n", fontSize: 15},
                                                    { text: "7, chemin de l'Océan\n"},
                                                    { text: "97450 Saint Louis"},
                                                ]
                                            }),
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            (type == "bl"?
                                            {
                                                alignment: 'center',
                                                text : [ 
                                                     { text: wkbon.client.name + "\n", fontSize: 15},
                                                    { text: wkbon.client.adresse + "\n"},
                                                    { text: wkbon.client.adresse_cp + " " + wkbon.client.adresse_ville },
                                                ]
                                            }:
                                            {
                                                alignment: 'center',
                                                text : [
                                                    { text: "SCA Fruits de la Réunion\n", fontSize: 15},
                                                    { text: "7, chemin de l'Océan\n"},
                                                    { text: "97450 Saint Louis"},
                                                ]
                                            })
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: service.ba.getRowStation(type)
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
                getFooter: function getFooter(type)
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
                                            (type == "ba"?
                                            {
                                                height:100,
                                                text : [
                                                    { text: "Remarques: " + (wkbon.remarques?wkbon.remarques:"") }
                                                ]
                                            }:
                                            {
                                                border:[false, false, false, false],
                                                height:0,
                                                text : ""
                                            })
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    widths: ["33%","34%","33%"],
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
                make: function make(el,bon,type){
                    wkbon = bon;
                    //
                    wkbon.dateDoc = new Date(wkbon.dateDoc);
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
                    
                    //var win = window.open('', '_blank');

                    //html2canvas(document.getElementById('exportthis'), {
                    //    onrendered: function (canvas) {
                      //      var data = canvas.toDataURL();
                            dd.pageMargins = (type=="ba"?[20, 155, 20, 140]:[20, 135, 20, 140]);
                            dd.styles = service.ba.getStyles();
                            dd.header = service.ba.getHeader(type);
                            dd.footer = service.ba.getFooter(type);
                            dd.content = service.ba.getContent(type);    
                             pdfMake.createPdf(dd).open();
                      //  }
                    //});
                }
            };
            service.cfact = {
                getStyles: function getStyles()
                {
                    return {
                        tableHead: { fillColor: '#d2d2d2' }
                    };
                },
                getTableLines: function getTableLines(type)
                {
                    var lines = {
                        widths: ["10%","*","10%","10%","10%","10%"],
                        body: [
                            
                            [
                                { text: 'Nbre colis',  style: 'tableHead'},
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: 'P. brut(kg)',  style: 'tableHead'},
                                { text: 'P. net(kg)',  style: 'tableHead'},
                                { text: 'Prix(€)',  style: 'tableHead'},
                                { text: 'Total(€)',  style: 'tableHead'},
                            ]
                        ]
                    };
                    var totalNet = 0;
                    var totalBrut = 0;
                    prixTotal = 0;
                   //for (var i = 0;i < 100;i++)
                   //{
                    wkbon.prods.forEach(function(element) {  
                        var ltab = [];
                        ltab.push({text:element.colisNb});
                        ltab.push(element.lib + " " + element.calibre);
                        ltab.push({text:$filter('number')(element.poid + (element.tare?element.tare:0),2),alignment:"right"});
                        ltab.push({text:$filter('number')(element.poid,2),alignment:"right"});
                        ltab.push({text:$filter('number')((element.prix?element.prix:0),2),alignment:"right"});
                        ltab.push({text:$filter('number')(element.poid * (element.prix?element.prix:0),2),alignment:"right"});
                        totalNet += (element.poid);
                        totalBrut += (element.poid + (element.tare?element.tare:0));
                        prixTotal += (element.poid * element.prix);
                        lines.body.push(ltab);
                    }, this); 
                   //}
                    
                    lines.body.push([
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:$filter('number')(totalBrut,2),alignment:"right"},
                        {text:$filter('number')(totalNet,2),alignment:"right"},
                        {text:"",border:[false, false, false, false]},
                        {text:$filter('number')(prixTotal,2),alignment:"right"}
                    ]);
                    return lines;
                },
                getContent: function getContent(type)
                {
                    return [
                            {
                                fontSize: 10,
                                table: service.cfact.getTableLines(type)
                            }
                        ];
                },
                getHeader: function getHeader(type)
                {
                    return function(currentPage, pageCount) { 
                        //if (currentPage == pageCount)
                        //{
                            return  {stack:[
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                stack:[
                                                    {
                                                        image: getB64ScaLogo(),
                                                        fit: [100, 100]
                                                    },
                                                    { text: "\nSociété à Capital Variable\n", fontSize: 10,color:"#8bc53f"},
                                                    { text: "Agrément: 974.02.03",fontSize: 10,color:"#8bc53f"}
                                                ]
                                            }
                                            ,
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment: 'center',
                                                border:[false, false, false, false],
                                                text : [ 
                                                     { text: "\n\n\n" + wkbon.client.name + "\n", fontSize: 15},
                                                    { text: wkbon.client.adresse + "\n"},
                                                    { text: wkbon.client.adresse_cp + " " + wkbon.client.adresse_ville },
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    widths: ["100%"],
                                    body: 
                                    [
                                        [
                                            { 
                                                border:[false, false, false, false],
                                                text: "\nFACTURE DE VENTE N° FA-" + "" + " du " + wkbon.dateDocFormated + (type=="ba"?"\nLTA N° " + wkbon.noLta:""), 
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
                            return  {stack:[
                                {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["50%","50%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "ORIGINE: REUNION" }
                                                ]
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "TOTAL COUT & FRET (€): " + $filter('number')(prixTotal,2),alignment:"right" }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "Echeance: 30 jours\nMode de règlement: VIR" }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "Arrêtée la présente facture à la somme de :\n" },
                                                    { text:
                                                        (prixTotal.toString().indexOf(".") > -1
                                                        ?
                                                        NumberToLetter(prixTotal.toString().substring(0,prixTotal.toString().indexOf("."))).toUpperCase() + " EUROS et " + NumberToLetter(prixTotal.toString().substring(prixTotal.toString().indexOf(".")+1)).toUpperCase() + " CENTS"
                                                        :NumberToLetter(prixTotal).toUpperCase() + " EUROS" )
                                                    }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "Aucun escompte ne sera accordé en cas de paiement anticipé. Intêret de retard: 3 fois le taux légal en vigueur. Tout paiement de facture après la date d'échéance donne lieu à l'application de l'indemnité forfaitaire de 40€ au titre des frais de recouvrements article L441-3 D441-5 du code du commerce.", fontSize:9 }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "SCA Fruits de la Réunion . ", fontSize:11,color:"#8bc53f" },
                                                    { text: "7 chemin de l'océan, 97450 SAINT-LOUIS, Ile de la Réunion\n", fontSize:10,color:"#8bc53f" },
                                                    { text: "SIRET : 443 041 397 00037 . OP N° 97FL2439 . Tél : 0692 87 88 09", fontSize:10,color:"#8bc53f" }
                                                ]
                                            }  
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
                make: function make(el,bon,type){
                    wkbon = bon;
                    console.log("bon",bon);
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
                    
                    //html2canvas(document.getElementById('exportthis'), {
                     //   onrendered: function (canvas) {
                      //      var data = canvas.toDataURL();
                            dd.pageMargins = [20, 200, 20, 200];
                            dd.styles = service.cfact.getStyles();
                            dd.header = service.cfact.getHeader(type);
                            dd.footer = service.cfact.getFooter();
                            dd.content = service.cfact.getContent(type);
                            pdfMake.createPdf(dd).open();
                        //}
                    //});
                }
            };
            service.pfact = {
                getStyles: function getStyles()
                {
                    return {
                        tableHead: { fillColor: '#d2d2d2' }
                    };
                },
                getTableLines: function getTableLines(type)
                {
                    var lines = {
                        widths: ["10%","*","10%","10%","10%","10%","10%"],
                        body: [
                            
                            [
                                { text: 'Date apport',  style: 'tableHead'},
                                { text: 'Bon n°',  style: 'tableHead'},
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: 'Categorie',  style: 'tableHead'},
                                { text: 'Quantités(kg)',  style: 'tableHead'},
                                { text: 'Prix(€)',  style: 'tableHead'},
                                { text: 'Total(€)',  style: 'tableHead'},
                            ]
                        ]
                    };
                    var totalNet = 0;
                    var totalBrut = 0;
                    prixTotal = 0;
                   //for (var i = 0;i < 100;i++)
                   //{
                       wkbon.bons.forEach(function(element) { 
                           var bon = element;
                            element.palettes.forEach(function(element) { 
                                var pal = element;
                                element.produits.forEach(function(element) { 
                                    var prod = element;
                                    var ltab = [];
                                    console.log(prod);
                                    ltab.push({text:bon.dateDoc});
                                    ltab.push({text:bon.numBon});
                                    ltab.push({text:"prod.lib"});
                                    ltab.push({text:prod.categorie});
                                    ltab.push({text:prod.poid});
                                    ltab.push({text:"prod.prix"});
                                    ltab.push({text:"prod.prix"});
                                    lines.body.push(ltab);
                                });
                            });    
                        });
                       /*console.log("wkbon.palettes",wkbon.palettes);
                       wkbon.palettes.forEach(function(element) {  
                        var pal = element;
                        element.produits.forEach(function(element) {
                            var ltab = [];
                            ltab.push({text:element.colisNb});
                            ltab.push(element.produit.lib + " " + element.calibre);
                            ltab.push({text:$filter('number')(element.poid + (element.tare?element.tare:0),2),alignment:"right"});
                            ltab.push({text:$filter('number')(element.poid,2),alignment:"right"});
                            ltab.push({text:$filter('number')(element.prixVente,2),alignment:"right"});
                            ltab.push({text:$filter('number')(element.poid * element.prixVente,2),alignment:"right"});
                            totalNet += (element.poid);
                            totalBrut += (element.poid + (element.tare?element.tare:0));
                            prixTotal += (element.poid * element.prixVente);
                            lines.body.push(ltab);
                        }, this);
                    }, this);*/ 
                   //}
                    
                    lines.body.push([
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:$filter('number')(totalBrut,2),alignment:"right"},
                        {text:$filter('number')(totalNet,2),alignment:"right"},
                        {text:"",border:[false, false, false, false]},
                        {text:$filter('number')(prixTotal,2),alignment:"right"},
                        {text:"",border:[false, false, false, false]}
                    ]);
                    return lines;
                },
                getContent: function getContent(type)
                {
                    return [
                            {
                                fontSize: 10,
                                table: service.pfact.getTableLines(type)
                            }
                        ];
                },
                getHeader: function getHeader(type)
                {
                    return function(currentPage, pageCount) { 
                        //if (currentPage == pageCount)
                        //{
                            return  {stack:[
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    
                                    widths: ["45%","10%", "45%"],
                                    body: [
                                        [
                                            {
                                                border:[false, false, false, false],
                                                stack:[
                                                    {
                                                        image: getB64ScaLogo(),
                                                        fit: [100, 100]
                                                    },
                                                    { text: "\nSociété à Capital Variable\n", fontSize: 10,color:"#8bc53f"},
                                                    { text: "Agrément: 974.02.03",fontSize: 10,color:"#8bc53f"}
                                                ]
                                            }
                                            ,
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment: 'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "\nN° PRODUCTEUR:" + wkbon.producteur.codeAdh + "\n", }, 
                                                     { text: "\n" + wkbon.producteur.name + "\n", fontSize: 15},
                                                    { text: wkbon.producteur.adresse + "\n"},
                                                    { text: wkbon.producteur.adresse_cp + " " + wkbon.producteur.adresse_ville },
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    widths: ["50%"],
                                    body: 
                                    [
                                        [
                                            { 
                                                text: "AUTOFACTURATION",alignment:"center" 
                                            }
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    widths: ["100%"],
                                    body: 
                                    [
                                        [
                                            { 
                                                border:[false, false, false, false],
                                                text: "FACTURE D'APPORT' N° FAP-" + wkbon.numBon + " du " + wkbon.dateDocFormated, 
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
                            return  {stack:[
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "Arrêtée la présente facture à la somme de :\n" },
                                                    { text:
                                                        (prixTotal.toString().indexOf(".") > -1
                                                        ?
                                                        NumberToLetter(prixTotal.toString().substring(0,prixTotal.toString().indexOf("."))).toUpperCase() + " EUROS et " + NumberToLetter(prixTotal.toString().substring(prixTotal.toString().indexOf(".")+1)).toUpperCase() + " CENTS"
                                                        :NumberToLetter(prixTotal).toUpperCase() + " EUROS" )
                                                    }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "Délai de règlement: 30 jours date émission de la facture" }
                                                ]
                                            }  
                                        ]
                                    ]
                                }
                            },
                            {
                                margin: [ 0, 0, 0, 5 ],
                                table: {
                                    margin: [20, 20, 20, 20],
                                    widths: ["100%"],
                                    body: [
                                        [
                                            {
                                                alignment:'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "SCA Fruits de la Réunion . ", fontSize:11,color:"#8bc53f" },
                                                    { text: "7 chemin de l'océan, 97450 SAINT-LOUIS, Ile de la Réunion\n", fontSize:10,color:"#8bc53f" },
                                                    { text: "SIRET : 443 041 397 00037 . OP N° 97FL2439 . Tél : 0692 87 88 09", fontSize:10,color:"#8bc53f" }
                                                ]
                                            }  
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
                make: function make(el,bon,type){
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
                    
                    //html2canvas(document.getElementById('exportthis'), {
                     //   onrendered: function (canvas) {
                      //      var data = canvas.toDataURL();
                            dd.pageMargins = [20, 220, 20, 150];
                            dd.styles = service.pfact.getStyles();
                            dd.header = service.pfact.getHeader(type);
                            dd.footer = service.pfact.getFooter();
                            dd.content = service.pfact.getContent(type);
                            pdfMake.createPdf(dd).open();
                        //}
                    //});
                }
            };
            return service;
        };
    }
})();

function Unite( nombre ){
	var unite;
	switch( nombre ){
		case 0: unite = "zéro";		break;
		case 1: unite = "un";		break;
		case 2: unite = "deux";		break;
		case 3: unite = "trois"; 	break;
		case 4: unite = "quatre"; 	break;
		case 5: unite = "cinq"; 	break;
		case 6: unite = "six"; 		break;
		case 7: unite = "sept"; 	break;
		case 8: unite = "huit"; 	break;
		case 9: unite = "neuf"; 	break;
	}//fin switch
	return unite;
}//-----------------------------------------------------------------------

function Dizaine( nombre ){
	switch( nombre ){
		case 10: dizaine = "dix"; break;
		case 11: dizaine = "onze"; break;
		case 12: dizaine = "douze"; break;
		case 13: dizaine = "treize"; break;
		case 14: dizaine = "quatorze"; break;
		case 15: dizaine = "quinze"; break;
		case 16: dizaine = "seize"; break;
		case 17: dizaine = "dix-sept"; break;
		case 18: dizaine = "dix-huit"; break;
		case 19: dizaine = "dix-neuf"; break;
		case 20: dizaine = "vingt"; break;
		case 30: dizaine = "trente"; break;
		case 40: dizaine = "quarante"; break;
		case 50: dizaine = "cinquante"; break;
		case 60: dizaine = "soixante"; break;
		case 70: dizaine = "soixante-dix"; break;
		case 80: dizaine = "quatre-vingt"; break;
		case 90: dizaine = "quatre-vingt-dix"; break;
	}//fin switch
	return dizaine;
}//-----------------------------------------------------------------------

function NumberToLetter( nombre ){
	var i, j, n, quotient, reste, nb ;
	var ch
	var numberToLetter='';
	//__________________________________
	
	if(  nombre.toString().replace( / /gi, "" ).length > 15  )	return "dépassement de capacité";
	if(  isNaN(nombre.toString().replace( / /gi, "" ))  )		return "Nombre non valide";

	nb = parseFloat(nombre.toString().replace( / /gi, "" ));
	if(  Math.ceil(nb) != nb  )	return  "Nombre avec virgule non géré.";
	
	n = nb.toString().length;
	switch( n ){
		 case 1: numberToLetter = Unite(nb); break;
		 case 2: if(  nb > 19  ){
					   quotient = Math.floor(nb / 10);
					   reste = nb % 10;
					   if(  nb < 71 || (nb > 79 && nb < 91)  ){
							 if(  reste == 0  ) numberToLetter = Dizaine(quotient * 10);
							 if(  reste == 1  ) numberToLetter = Dizaine(quotient * 10) + "-et-" + Unite(reste);
							 if(  reste > 1   ) numberToLetter = Dizaine(quotient * 10) + "-" + Unite(reste);
					   }else numberToLetter = Dizaine((quotient - 1) * 10) + "-" + Dizaine(10 + reste);
				 }else numberToLetter = Dizaine(nb);
				 break;
		 case 3: quotient = Math.floor(nb / 100);
				 reste = nb % 100;
				 if(  quotient == 1 && reste == 0   ) numberToLetter = "cent";
				 if(  quotient == 1 && reste != 0   ) numberToLetter = "cent" + " " + NumberToLetter(reste);
				 if(  quotient > 1 && reste == 0    ) numberToLetter = Unite(quotient) + " cents";
				 if(  quotient > 1 && reste != 0    ) numberToLetter = Unite(quotient) + " cent " + NumberToLetter(reste);
				 break;
		 case 4 :  quotient = Math.floor(nb / 1000);
					  reste = nb - quotient * 1000;
					  if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
					  if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0    ) numberToLetter = NumberToLetter(quotient) + " mille";
					  if(  quotient > 1 && reste != 0    ) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
					  break;
		 case 5 :  quotient = Math.floor(nb / 1000);
					  reste = nb - quotient * 1000;
					  if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
					  if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0    ) numberToLetter = NumberToLetter(quotient) + " mille";
					  if(  quotient > 1 && reste != 0    ) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
					  break;
		 case 6 :  quotient = Math.floor(nb / 1000);
					  reste = nb - quotient * 1000;
					  if(  quotient == 1 && reste == 0   ) numberToLetter = "mille";
					  if(  quotient == 1 && reste != 0   ) numberToLetter = "mille" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0    ) numberToLetter = NumberToLetter(quotient) + " mille";
					  if(  quotient > 1 && reste != 0    ) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
					  break;
		 case 7: quotient = Math.floor(nb / 1000000);
					  reste = nb % 1000000;
					  if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
					  if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " millions";
					  if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
					  break;  
		 case 8: quotient = Math.floor(nb / 1000000);
					  reste = nb % 1000000;
					  if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
					  if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " millions";
					  if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
					  break;  
		 case 9: quotient = Math.floor(nb / 1000000);
					  reste = nb % 1000000;
					  if(  quotient == 1 && reste == 0  ) numberToLetter = "un million";
					  if(  quotient == 1 && reste != 0  ) numberToLetter = "un million" + " " + NumberToLetter(reste);
					  if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " millions";
					  if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
					  break;  
		 case 10: quotient = Math.floor(nb / 1000000000);
						reste = nb - quotient * 1000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " milliards";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
					    break;	
		 case 11: quotient = Math.floor(nb / 1000000000);
						reste = nb - quotient * 1000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " milliards";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
					    break;	
		 case 12: quotient = Math.floor(nb / 1000000000);
						reste = nb - quotient * 1000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un milliard";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " milliards";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
					    break;	
		 case 13: quotient = Math.floor(nb / 1000000000000);
						reste = nb - quotient * 1000000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " billions";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
					    break; 	
		 case 14: quotient = Math.floor(nb / 1000000000000);
						reste = nb - quotient * 1000000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " billions";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
					    break; 	
		 case 15: quotient = Math.floor(nb / 1000000000000);
						reste = nb - quotient * 1000000000000;
						if(  quotient == 1 && reste == 0  ) numberToLetter = "un billion";
						if(  quotient == 1 && reste != 0  ) numberToLetter = "un billion" + " " + NumberToLetter(reste);
						if(  quotient > 1 && reste == 0   ) numberToLetter = NumberToLetter(quotient) + " billions";
						if(  quotient > 1 && reste != 0   ) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
					    break; 	
	 }//fin switch
	 /*respect de l'accord de quatre-vingt*/
	 if(  numberToLetter.substr(numberToLetter.length-"quatre-vingt".length,"quatre-vingt".length) == "quatre-vingt"  ) numberToLetter = numberToLetter + "s";
	 
	 return numberToLetter;
}
function getB64ScaLogo()
{
return "data:image/png;base64,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";

}