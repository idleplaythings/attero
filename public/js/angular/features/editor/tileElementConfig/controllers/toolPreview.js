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
        $scope.tileElement = null;
        $scope.angle = 0;
        $scope.offsetX = 0;
        $scope.offsetY = 0;

        var renderPreview = function renderPreview() {
            if ($scope.tileElement === null) {
                return false;
            }

            tileElementPreviewService.renderPreviewForTileElement($scope.tileElement, $scope.offsetX, $scope.offsetY, $scope.angle);
        };

        $scope.$watch('landscapingToolService.getTileElement()', function(tileElement) {
            $scope.tileElement = tileElement;
            renderPreview();
        });
        $scope.$watch('angle', renderPreview);
        $scope.$watch('offsetX', renderPreview);
        $scope.$watch('offsetY', renderPreview);
    }]);
