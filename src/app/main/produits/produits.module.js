(function ()
{
    'use strict';

    angular
        .module('app.produits', [
            'app.produits.list','app.produits.edit',
            'app.produits.groups.list','app.produits.groups.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();