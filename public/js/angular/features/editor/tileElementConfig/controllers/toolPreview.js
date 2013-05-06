'use strict';

angular.module('attero')
    .factory('tileSetBuilder', function() {
        return function (rowCount, columnCount) {
            var rows = [];
            var rowOffset = 0;

            for (var i=0; i<rowCount; i++) {
                var row = [];
                var columnOffset = 0;

                for (var j=0; j<columnCount; j++) {
                    row.push({ x: columnOffset, y: rowOffset });
                    columnOffset += 40;
                }

                rows.push(row);
                rowOffset += 40;
            }

            return rows;
        }
    })
    .controller('toolPreviewController', ['$scope', 'landscapingToolService', 'tileSetBuilder', function($scope, landscapingToolService, tileSetBuilder) {
        $scope.tileElement = null;

        $scope.$watch(landscapingToolService.getTileElement, function(tileElement) {
            $scope.tileElement = tileElement;

            if ($scope.tileElement) {
                $scope.tileSet = tileSetBuilder(
                    tileElement.getRowCount(),
                    tileElement.getColumnCount()
                );
            } else {
                $scope.tileSet = [];
            }
        });
    }]);
