(function ()
{
    'use strict';

    angular
        .module('app.produits', [
            'app.produits.list','app.produits.edit',
            'app.produits.groups.list','app.produits.groups.edit',
            'app.produits.categories.list','app.produits.categories.edit',
            'app.produits.condit.list','app.produits.condit.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();