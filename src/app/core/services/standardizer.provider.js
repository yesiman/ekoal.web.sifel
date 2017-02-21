(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('standardizer', standardizer);

    /** @ngInject **/
    function standardizer()
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
            var service = {
                getHtmlActions: function getHtmlActions(cust)
                {
                    var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
                    actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.edit(row.entity._id)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
                    actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.remove(row.entity._id,$event)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
                    if (cust) {actionsHtml += cust + '</div>';}
                    return actionsHtml;
                },
                getPoidsInAskVal: function getHtmlActions(element, askedUnit)
                {
                    if (element.unit === parseInt(askedUnit))
                    {
                        return element.val;
                    }
                    else {
                        if (askedUnit == 1)
                        {
                            return (element.val*1000);
                        }
                        else 
                        {
                            return (element.val/1000);
                        }
                    }
                },
                getGridOptionsStd: function getGridOptionsStd()
                {
                    return {
                        useExternalPagination: true,
                        useExternalSorting: true,
                        enableRowSelection: true,
                        enableSelectAll: true,
                        enableColumnMenus: false,
                        enableSorting: false,
                        saveSelection: false,
                        rowHeight: 35,
                        height:"100%",
                        enableGridMenu: false,
                        showGridFooter: false
                    };
                },
                getDatatableLanguages: function getDatatableLanguages() {
                    return {
                        "sEmptyTable":     "Aucunes données",
                        "sInfo":           "Affichage _START_ à _END_ de _TOTAL_ lignes",
                        "sInfoEmpty":      "Affichage 0 à 0 de 0 lignes",
                        "sInfoFiltered":   "(Filtré de _MAX_ lignes au total)",
                        "sInfoPostFix":    "",
                        "sInfoThousands":  ",",
                        "sLengthMenu":     "Affichage _MENU_ lignes",
                        "sLoadingRecords": "Chargement...",
                        "sProcessing":     "En cours...",
                        "sSearch":         "Rechercher:",
                        "sZeroRecords":    "Aucun enregistrement",
                        "oPaginate": {
                            "sFirst":    "Premier",
                            "sLast":     "Dernier",
                            "sNext":     "Suivant",
                            "sPrevious": "Précédent"
                        },
                        "oAria": {
                            "sSortAscending":  ": activer pour trier du plus petit au plus grand",
                            "sSortDescending": ": activer pour trier du plus grand au plus petit"
                        }
                    };
                }
            };
            return service;
        };
    }
})();