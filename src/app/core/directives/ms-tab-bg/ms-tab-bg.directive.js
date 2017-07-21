(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('tagBg', tagbgDirective);

    /** @ngInject */
    var colors = ["#7289da",
    "#99aab5","#2c2f33","#ffe47a","#ffa07a","#ff7a97","#7affa1","#7ad9ff","#aaaaaa","#dd9e00","#669900","#002e9b","#97008a"
    ];
    function tagbgDirective()
    {
        return {
            restrict: 'A',
            scope: { item:'=' },
            link: function (scope, el, attrs) {
                if (scope.item.color){
                    scope.item.bgColor = scope.item.color;
                }
                if (!(scope.item.bgColor)){
                    scope.item.bgColor = colors[Math.floor(Math.random()*colors.length)];
                }
                el.css('color',scope.item.bgColor);
            }
        };
    }
})();