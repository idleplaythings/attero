'use strict';

angular.module('attero')
    .factory('tileElementPreviewService', function() {
        var domElement = $('#tile-element-preview')[0];
        return {
            renderPreviewForTileElement: function(tileElement, offsetX, offsetY, angle) {
                tileElement.getPreview(domElement, offsetX, offsetY, angle);
            }
        }
    })
    .controller('toolPreviewController', [ '$scope', 'landscapingToolService', 'tileElementPreviewService', function($scope, landscapingToolService, tileElementPreviewService) {
        $scope.landscapingToolService = landscapingToolService;
        $scope.angle = 0;
        $scope.offsetX = 0;
        $scope.offsetY = 0;

        $scope.$watch('landscapingToolService.getTileElement()', function(tileElement) {
            if (tileElement === null) {
                return false;
            }

            tileElementPreviewService.renderPreviewForTileElement(tileElement, $scope.offsetX, $scope.offsetY, $scope.angle);
        });
    }]);
