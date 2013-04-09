'use strict';

angular.module('attero')
    .directive('tileElementGrid', ['$parse', function($parse) {
        return {
            scope: true,
            templateUrl: '/assets/js/angular/views/includes/tileElementGrid.html',
            replace: true,
            link: function (scope, element, attrs) {
                var tileElementParser = $parse(attrs.source);
                var tileElement = tileElementParser(scope);

                scope.rowCount = tileElement.getRowCount();
                scope.columnCount = tileElement.getColumnCount();

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
