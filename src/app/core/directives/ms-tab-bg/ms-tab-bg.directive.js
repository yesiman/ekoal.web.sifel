(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('tagBg', tagbgDirective);

    /** @ngInject */
    var colors = [
        '#E53935',
        '#FF8A80',
        '#B39DDB',
        '#2196F3',
        '#0D47A1',
        '#26A69A',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFF176',
        '#FF8F00'
    ];
    function tagbgDirective()
    {
        return {
            restrict: 'A',
            scope: { item:'=' },
            link: function (scope, el, attrs) {
                if (!(scope.item.bgColor)){
                    scope.item.bgColor = colors[Math.floor(Math.random()*colors.length)];
                }
                el.parent().parent().css('background-color',scope.item.bgColor);
            }
        };
    }
})();