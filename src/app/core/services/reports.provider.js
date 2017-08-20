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
        this.$get = function ($filter)
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
                                { text: "Calibre",  style: 'tableHead'}, 
                                { text: 'Nbre colis',  style: 'tableHead'},
                                { text: 'P. brut(kg)',  style: 'tableHead'},
                                { text: 'Tare',  style: 'tableHead'},
                                { text: 'P. net(kg)',  style: 'tableHead'},
                            ]:[
                                { text: "Palette",  style: 'tableHead'}, 
                                { text: "Produit",  style: 'tableHead'}, 
                                { text: "Calibre",  style: 'tableHead'}, 
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
                            ltab.push(element.produit.lib);
                            ltab.push(element.categorie.lib);
                            ltab.push({ text: $filter('number')((element.colisNb?element.colisNb:0), 2),alignment:'right'});
                            ltab.push({ text: $filter('number')(element.poid + (element.tare?element.tare:0), 2),alignment:'right'});
                            ltab.push({ text: $filter('number')((element.tare?element.tare:0), 2),alignment:'right'});
                            ltab.push({ text: $filter('number')(element.poid, 2),alignment:'right'});
                            if (type == "bl")
                            {
                                ltab.push({ text: $filter('number')(element.prixAchat, 2),alignment:'right'});
                                ltab.push({ text: $filter('number')(element.poid * element.prixAchat, 2),alignment:'right'});
                                prixTotal += (element.poid * element.prixAchat);
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
                        {text:totalNet,alignment:'right'}
                    ]:[
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"",border:[false, false, false, false]},
                        {text:"TOTAL",alignment:'right',border:[false, false, false, false]},
                        {text:totalNet,alignment:'right'},
                        {text:"",border:[false, false, false, false]},
                        {text:prixTotal,alignment:'right'}
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
                                                    { text: "Remarques: " + wkbon.station.remarques }
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
                            dd.pageMargins = (type=="ba"?[20, 155, 20, 140]:[20, 135, 20, 140]);
                            dd.styles = service.ba.getStyles();
                            dd.header = service.ba.getHeader(type);
                            dd.footer = service.ba.getFooter(type);
                            dd.content = service.ba.getContent(type);
                            console.log(dd);
                            pdfMake.createPdf(dd).open();
                        }
                    });
                }
            };
            service.fact = {
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
                       console.log("wkbon.palettes",wkbon.palettes);
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
                                table: service.fact.getTableLines(type)
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
                                                text : ""
                                            },
                                            {
                                                border:[false, false, false, false],
                                                text : ""
                                            },
                                            {
                                                alignment: 'center',
                                                border:[false, false, false, false],
                                                text : [
                                                    { text: "SCA Fruits de la Réunion\n", fontSize: 15},
                                                    { text: "7, chemin de l'Océan\n"},
                                                    { text: "97450 Saint Louis"},
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
                                                text: "FACTURE DE VENTE N° FA-" + wkbon.numBon, 
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
                    
                    html2canvas(document.getElementById('exportthis'), {
                        onrendered: function (canvas) {
                            var data = canvas.toDataURL();
                            dd.pageMargins = [20, 135, 20, 180];
                            dd.styles = service.fact.getStyles();
                            dd.header = service.fact.getHeader(type);
                            dd.footer = service.fact.getFooter();
                            dd.content = service.fact.getContent(type);
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