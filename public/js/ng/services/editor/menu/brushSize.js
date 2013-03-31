'use strict';

angular.module('attero')
    .factory('brushSizeMenuService', ['landscapingBrushSizes', 'landscapingToolService', function(brushSizes, landscapingTool) {
        return {
            getItems: function(menu) {
                var items = [];

                Object.keys(brushSizes).forEach(function(key) {
                    items.push(brushSizes[key]);
                });

                return items;
            },
            select: function(item) {
                landscapingTool.setBrushSize(item);
            },
            getSelected: function() {
                return landscapingTool.getBrushSize();
            }
        };
    }]);
