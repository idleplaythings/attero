'use strict';

angular.module('attero')
    .directive('backdrop', function () {
        return {
            replace: true,
            template: '<div class="backdrop"></div>',
            link: function (scope, element, attrs) {
                element.css({
                    'position': 'fixed',
                    'top': '0',
                    'left': '0',
                    'right': '0',
                    'bottom': '0',
                    'background-color': '#000',
                    'opacity': '0.5'
                });
            }
        };
    });
