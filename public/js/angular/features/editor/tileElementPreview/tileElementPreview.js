'use strict';

angular.module('attero')
    .directive('tileElementPreview', ['landscapingToolService', function (landscapingToolService) {
        return {
            scope: true,
            template: '<div><canvas width="100px" height="100px" style="background-color: black;" /></div>',
            controller: function($scope, $attrs) {
                return {
                    draw: function(element) {
                        landscapingToolService.renderTileElementPreview($('canvas', $scope.element)[0]);
                    }
                }
            },
            link: function (scope, element, attrs, controller) {
                scope.element = element;
                scope.$watch(landscapingToolService.getTileElement, function(tileElement) {
                    if (tileElement) {
                        scope.tileElement = tileElement;
                        controller.draw();
                    }
                });
            }
        };
    }]);
