
angular.module('attero').directive('slideMenu', ['editorMenuService', function (editorMenuService) {
    return {
        scope: {
            slideMenu: '=',
            dock: '=',
            columns: '='
        },
        templateUrl: '/assets/js/ng/views/includes/slideMenu.html',
        replace: true,
        link: function (scope, element, attrs) {
            var menuItems = editorMenuService.getItems(attrs.slideMenu);
            scope.menuRows = [];

            do {
                scope.menuRows.push(menuItems.splice(0, attrs.columns));
            } while (menuItems.length > 0);

            element.on('mouseover', function() {
                element.css(attrs.dock, '0px');
            });

            element.on('mouseout', function() {
                element.css(attrs.dock, 20 - element.outerWidth());
            });
        }
    };
}]);
