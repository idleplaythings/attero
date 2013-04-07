'use strict';

angular.module('attero')
    .controller('toolPreviewController', ['$scope', 'landscapingToolService', function($scope, landscapingToolService) {
        $scope.landscapingToolService = landscapingToolService;

        $scope.tool = null;
        $scope.brushSize = null;
        $scope.texture = null;
        $scope.tileElement = null;

        $scope.$watch('landscapingToolService.getTool()', function(newValue) {
            $scope.tool = newValue;
        });

        $scope.$watch('landscapingToolService.getBrushSize()', function(newValue) {
            $scope.brushSize = newValue;
        });

        $scope.$watch('landscapingToolService.getTexture()', function(newValue) {
            $scope.texture = newValue;
        });

        $scope.$watch('landscapingToolService.getTileElement()', function(newValue) {
            $scope.tileElement = newValue;
        });
    }]);
