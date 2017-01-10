(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('editFormHeadsButtons', editFormButtonsDirective)
        .directive('formHeadIcoTitle', formHeadIcoTitleDirective)
        .directive('listHeadButtons', listHeadButtonsDirective)
        .directive('datatableWrapper', datatableWrapperDirective);

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
    /** @ngInject */
    function datatableWrapperDirective($timeout, $compile) {
        return {
            restrict: 'E',
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            link: link
        };

        function link(scope, element) {
            // Using $timeout service as a "hack" to trigger the callback function once everything is rendered
            $timeout(function () {
                // Compiling so that angular knows the button has a directive
                $compile(element.find('.datatable-add-button'))(scope);
            }, 0, false);
        }
    }

})();