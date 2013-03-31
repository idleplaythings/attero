'use strict';

angular.module('attero')
    .controller('toolPreviewController', ['$scope', 'landscapingToolService', function($scope, landscapingTool) {
        $scope.landscapingTool = landscapingTool;

        $scope.tool = null;
        $scope.brushSize = null;
        $scope.texture = null;
        $scope.tileElement = null;

        $scope.$watch('landscapingTool.getTool()', function(newValue) {
            $scope.tool = newValue;
        });

        $scope.$watch('landscapingTool.getBrushSize()', function(newValue) {
            $scope.brushSize = newValue;
        });

        $scope.$watch('landscapingTool.getTexture()', function(newValue) {
            $scope.texture = newValue;
        });

        $scope.$watch('landscapingTool.getTileElement()', function(newValue) {
            $scope.tileElement = newValue;
        });
    }]);
