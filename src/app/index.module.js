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
            'app.opes',
            'app.planifs',
            'app.stats',
            'app.produits',
            'app.rules',
            'app.dashboards.server'
        ]);
})();