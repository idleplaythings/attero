'use strict';

angular.module('attero')
    .factory('tileElementPreviewService', function() {
        var domElement = $('#tile-element-preview')[0];
        return {
            renderPreviewForTileElement: function(tileElement) {
                tileElement.getPreview(domElement, 0, 0, 200);
            }
        }
    })
    .controller('toolPreviewController', [ '$scope', 'landscapingToolService', 'tileElementPreviewService', function($scope, landscapingToolService, tileElementPreviewService) {
        $scope.landscapingToolService = landscapingToolService;

        $scope.$watch('landscapingToolService.getTileElement()', function(tileElement) {
            if (tileElement === null) {
                return false;
            }

            tileElementPreviewService.renderPreviewForTileElement(tileElement);
        });
    }]);
