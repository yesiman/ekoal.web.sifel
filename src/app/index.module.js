(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            // Core
            'app.core',
            // Navigation
            'app.navigation',
            // Toolbar
            'app.toolbar',
            // Quick Panel
            'app.quick-panel',
            //CUSTOMS
            
            'app.pages', //To Remove
            'app.users',
            'app.planifs',
            'app.stats',
            'app.stats.agreag',
            'app.produits',
            'app.stations', 
            'app.bons',
            'app.opes',
            'app.facturation',
            'app.dashboards.server'
        ]);
})();