'use strict';

angular.module('attero')
    .directive('iconMenu', ['$injector', function ($injector) {
        function getMenuService(menu) {
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
                columns: '=',
            },
            templateUrl: '/assets/js/angular/features/ui/iconMenu/views/iconMenu.html',
            replace: true,
            link: function (scope, element, attrs) {
                var menuService = getMenuService(attrs.service);

                scope.selected = null;

                scope.rows = splitMenuItemsIntoRows(
                    menuService.getItems(),
                    attrs.columns
                );

                scope.$watch(menuService.getSelected, function(newValue, oldValue) {
                    scope.selected = newValue;
                });

                scope.select = function(item) {
                    menuService.select(item);
                }
            }
        };
    }]);
