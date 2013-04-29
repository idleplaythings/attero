'use strict';

angular.module('attero')
    .directive('tileElementPreview', function ($parse) {
        return {
            scope: true,
            templateUrl: '/assets/js/angular/features/editor/tileElementConfig/views/tileElementPreview.html',
            link: function (scope, element, attrs) {
                var preview = $('.preview', element);

                preview.css('width', 40);
                preview.css('height', 40);
                preview.css('background-image', 'url("' + scope.tileElement.img.src + '")');
                preview.css('background-position', -1 * scope.column.x + 'px ' + -1 * scope.column.y + 'px');
            }
        };
    });
