'use strict';

angular.module('attero')
    .directive('modalDialog', ['dialogService', function (dialogService) {
        return {
            transclude: true,
            template:
                '<div class="modal-dialog">' +
                    '<div backdrop></div>' +
                    '<div class="dialog" style="overflow: auto">' +
                        '<div ng-transclude />' +
                    '</div>' +
                '</div>',
            link: function (scope, element, attrs) {
                var options = {
                    height: attrs.height,
                    width: attrs.width
                }

                scope.$watch(attrs.showCondition, function(isShown) {
                    if (isShown) {
                        dialogService.show(element, options);
                        scope.$broadcast('ShowDialog');
                    } else {
                        dialogService.hide(element);
                        scope.$broadcast('HideDialog');
                    }
                });
            }
        };
    }]);
