(function ()
{
    'use strict';

    angular
        .module('app.produits', [
            'app.produits.list','app.produits.edit'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        
    }
})();