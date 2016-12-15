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
                }
            };
            return service;
        };
    }
})();