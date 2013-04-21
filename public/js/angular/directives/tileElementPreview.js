'use strict';

angular.module('attero')
    .directive('tileElementPreview', ['$parse', function($parse) {
        return {
            scope: true,
            templateUrl: '/assets/js/angular/views/includes/tileElementPreview.html',
            // replace: true,
            link: function (scope, element, attrs) {
                var preview = $('.preview', element);

                preview.css('width', 40);
                preview.css('height', 40);
                preview.css('background-image', 'url("' + scope.tileElement.img.src + '")');
                preview.css('background-position', scope.column.x + 'px ' + scope.column.y + 'px');

                // console.log(scope.tileElement)
                // var tileElementParser = $parse(attrs.source);

                // scope.tileElement = tileElementParser(scope);
                // scope.offsetArray = buildOffsetArray(
                //     scope.tileElement.getRowCount(),
                //     scope.tileElement.getColumnCount()
                // );

                // console.log(scope.offsetArray)

                // scope.rowCount = scope.tileElement.getRowCount();
                // scope.columnCount = scope.tileElement.getColumnCount();

                // scope.menuService = getMenuService(attrs.service);

                // scope.rows = splitMenuItemsIntoRows(
                //     scope.menuService.getItems(attrs.service),
                //     attrs.columns
                // );

                // scope.select = function(item) {
                //     scope.menuService.select(item);
                // }

                // scope.selected = null;

                // scope.$watch('menuService.getSelected()', function(newValue, oldValue) {
                //     scope.selected = newValue;
                // });

                // element.css('top', attrs.top + 'px');

                // element.on('mouseover', function() {
                //     element.css(attrs.dock, '0px');
                // });
                // element.on('mouseout', function() {
                //     element.css(attrs.dock, 20 - element.outerWidth());
                // });
            }
        };
    }]);
