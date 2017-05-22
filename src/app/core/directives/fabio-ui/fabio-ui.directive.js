(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('editFormHeadsButtons', editFormButtonsDirective)
        .directive('formHeadIcoTitle', formHeadIcoTitleDirective)
        .directive('formHeadIcoTitleWithSideb', formHeadIcoTitleWithSidebDirective)
        .directive('listHeadButtons', listHeadButtonsDirective)
        .directive('datatableWrapper', datatableWrapperDirective)
        .directive('qteInput', qteInputDirective)
        .directive('surfInput', surfInputDirective)
        .directive('fileModel', fileModelDirective);

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
    function fileModelDirective($parse)
    {
        return {
            restrict   : 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
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
    function formHeadIcoTitleWithSidebDirective($mdSidenav)
    {
        return {
            restrict   : 'A',
            transclude : true,
            templateUrl: 'app/core/directives/fabio-ui/templates/form-head-ico-title-with-sideb/form-head-ico-title-with-sideb.html',
            link:link
        };
        
        function link(scope, element) {
            scope.toggleSidenav = function(sidenavId)
            {
                $mdSidenav(sidenavId).toggle();
            }
        }
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

    function qteInputDirective()
    {
        return {
            restrict   : 'A',
            templateUrl: 'app/core/directives/fabio-ui/templates/qte-input/qte-input.html',
            require: 'ngModel',
            scope: {
                changeFn: '&',
                inprequired: '='
            },
            link: function(scope, iElement, iAttrs, ngModel) {
                scope.units = [
                    { id: 1, name: 'Kilos' },
                    { id: 2, name: 'Tonnes' }
                ];
                //TODO SET DEFAULT USER CONFIG
                scope.value = {
                    value:0,
                    unit:1
                };
                ngModel.$render = function() {
                    if (ngModel.$modelValue)
                    {
                        scope.value = {
                            value:ngModel.$modelValue.val,
                            unit:ngModel.$modelValue.unit
                        };
                        ngModel.$setViewValue({val:scope.value.value, unit:scope.value.unit});
                    }
                    else {
                        ngModel.$setViewValue({val:0, unit:1});
                    }
                }
                scope.dataChange = function() {
                    var val = 0;
                    switch (scope.value.unit)
                    {
                        case 1:
                            val = scope.value.value;
                            break;
                        case 2:
                            val = scope.value.value * 1000;
                            break;
                    }   
                    ngModel.$setViewValue({val:scope.value.value, unit:scope.value.unit});
                    scope.changeFn();
                }
            }
        };
    }    

    function surfInputDirective()
    {
        return {
            restrict   : 'A',
            templateUrl: 'app/core/directives/fabio-ui/templates/surf-input/surf-input.html',
            require: 'ngModel',
            link: function(scope, iElement, iAttrs, ngModel) {
                scope.units = [
                    { id: 1, name: 'M²' },
                    { id: 2, name: 'Hectares' }
                ];
                ngModel.$render = function() {
                    scope.value = {
                        value:ngModel.$modelValue.val,
                        unit:ngModel.$modelValue.unit
                    };
                }
                scope.dataChange = function() {
                    var val = 0;
                    switch (scope.value.unit)
                    {
                        case 1:
                            val = scope.value.value;
                            break;
                        case 2:
                            val = scope.value.value * 10000;
                            break;
                    }   
                    ngModel.$setViewValue({val:scope.value.value, unit:scope.value.unit});
                }
            }
        };
    }   

})();