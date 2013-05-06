'use strict';

angular.module('attero')
    .directive('anglePicker', function () {
        return {
            template: '<div class="angle-picker"></div>',
            link: function (scope, element, attrs) {
                $('.angle-picker', element).slider({
                    min: 0,
                    max: 360,
                    step: 5
                });
            }
        };
    });
