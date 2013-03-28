angular.module('attero').directive('slideMenu', ['$injector', function ($injector) {
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
            dock: '=',
            columns: '=',
            top: '='
        },
        templateUrl: '/assets/js/ng/views/includes/slideMenu.html',
        replace: true,
        link: function (scope, element, attrs) {
            scope.menuService = getMenuService(attrs.service);

            scope.rows = splitMenuItemsIntoRows(
                scope.menuService.getItems(attrs.service),
                attrs.columns
            );

            scope.select = function(item) {
                scope.menuService.select(item)
            }

            scope.selected = null;

            scope.$watch('menuService.getSelected()', function(newValue, oldValue) {
                scope.selected = newValue;
            });

            element.css('top', attrs.top + 'px');

            element.on('mouseover', function() {
                element.css(attrs.dock, '0px');
            });
            element.on('mouseout', function() {
                element.css(attrs.dock, 20 - element.outerWidth());
            });
        }
    };
}]);
