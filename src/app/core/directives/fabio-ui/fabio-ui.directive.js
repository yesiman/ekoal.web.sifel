(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('editFormHeadsButtons', editFormButtonsDirective)
        .directive('formHeadIcoTitle', formHeadIcoTitleDirective)
        .directive('listHeadButtons', listHeadButtonsDirective);

    /** @ngInject */
    function editFormButtonsDirective()
    {
        return {
            restrict   : 'A',
            transclude : true,
            templateUrl: 'app/core/directives/fabio-ui/templates/edit-form-heads-buttons/edit-form-heads-buttons.html',
            link: function(scope) {
                scope.back = function() {
                    window.history.back();
                }
            }
        };
    }
    /** @ngInject */
    function listHeadButtonsDirective()
    {
        return {
            restrict   : 'A',
            transclude : true,
            templateUrl: 'app/core/directives/fabio-ui/templates/list-head-buttons/list-head-buttons.html'
        };
    }
    /** @ngInject */
    function formHeadIcoTitleDirective()
    {
        return {
            restrict   : 'A',
            transclude : true,
            templateUrl: 'app/core/directives/fabio-ui/templates/form-head-ico-title/form-head-ico-title.html'
        };
    }
})();