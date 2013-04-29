'use strict';

angular.module('attero')
    .directive('slideMenu', ['$injector', function ($injector) {
        function getMenuService(menu) {
            console.log($injector.get(menu + 'MenuService'))
            return $injector.get(menu + 'MenuService');
        }

        function splitMenuItemsIntoRows(menuItems, columns) {
            var items = [];

            do {
                items.push(menuItems.splice(0, columns));
            } while (menuItems.length > 0);

            return items;
        }

        return {
            scope: {
                service: '=',
                dock: '=',
                columns: '=',
                top: '='
            },
            templateUrl: '/assets/js/angular/features/ui/slideMenu/views/menu.html',
            replace: true,
            controller: function($scope) {
                $scope.select = function(item) {
                    $scope.menuService.select(item);
                }
            },
            link: function (scope, element, attrs) {
                scope.menuService = getMenuService(attrs.service);
                scope.selected = null;
                scope.dock = attrs.dock;

                scope.rows = splitMenuItemsIntoRows(
                    scope.menuService.getItems(attrs.service),
                    attrs.columns
                );

                scope.$watch('menuService.getSelected()', function(newValue, oldValue) {
                    scope.selected = newValue;
                });

                element.css('top', attrs.top + 'px');
                element.css(attrs.dock, 20 - element.outerWidth());

                element.on('mouseover', function() {
                    element.css(attrs.dock, '0px');
                });
                element.on('mouseout', function() {
                    element.css(attrs.dock, 20 - element.outerWidth());
                });
            }
        };
    }]);
