'use strict';

angular.module('attero')
    .directive('tileElementGrid', ['$parse', function($parse) {
        function buildOffsetArray(rowCount, columnCount) {
            var rows = [];
            var rowOffset = 0;

            for (var i=0; i<rowCount; i++) {
                console.log('row')
                var row = [];
                var columnOffset = 0;

                for (var j=0; j<columnCount; j++) {
                    console.log('column')
                    row.push({ x: columnOffset, y: rowOffset });
                    columnOffset += 40;
                }

                rows.push(row);
                rowOffset += 40;
            }

            return rows;
        }

        return {
            scope: true,
            templateUrl: '/assets/js/angular/views/includes/tileElementGrid.html',
            replace: true,
            link: function (scope, element, attrs) {
                var tileElementParser = $parse(attrs.source);

                scope.tileElement = tileElementParser(scope);
                scope.offsetArray = buildOffsetArray(
                    scope.tileElement.getRowCount(),
                    scope.tileElement.getColumnCount()
                );

                console.log(scope.offsetArray)

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