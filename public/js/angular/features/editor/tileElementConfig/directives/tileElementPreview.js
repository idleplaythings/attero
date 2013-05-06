'use strict';

angular.module('attero')
    .directive('tileElementPreviewxx', function ($parse) {
        return {
            scope: true,
            template:
                '<div class="tile-element-preview">' +
                    '<div class="preview"></div>' +
                '</div>',
            link: function (scope, element, attrs) {
                var preview = $('.preview', element);

                preview.css('width', 40);
                preview.css('height', 40);
                preview.css('background-image', 'url("' + scope.tileElement.img.src + '")');
                preview.css('background-position', -1 * scope.column.x + 'px ' + -1 * scope.column.y + 'px');
            }
        };
    });
