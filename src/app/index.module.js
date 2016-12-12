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
            'app.sample',
            'app.pages',
            'app.users',
            'app.opes',
            'app.planifs',
            'app.stats',
            'app.produits'
        ]);
})();