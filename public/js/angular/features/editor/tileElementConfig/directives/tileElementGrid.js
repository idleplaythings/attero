'use strict';

angular.module('attero')
    .directive('tileElementGrid', ['$parse', function($parse) {
        function buildOffsetArray(rowCount, columnCount) {
            console.log(rowCount, columnCount);
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

        return {
            scope: true,
            templateUrl: '/assets/js/angular/features/editor/tileElementConfig/views/tileElementGrid.html',
            replace: true,
            link: function (scope, element, attrs) {
                // console.log('source', attrs.source)
                // var tileElementParser = $parse(attrs.source);

                // scope.tileElement = tileElementParser(scope);

                scope.$watch('tileElement', function(tileElement) {
                    console.log(tileElement)
                    if (tileElement) {
                        scope.offsetArray = buildOffsetArray(
                            tileElement.getRowCount(),
                            tileElement.getColumnCount()
                        );
                    } else {
                        scope.offsetArray = [];
                    }
                });
            }
        };
    }]);
