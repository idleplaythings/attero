'use strict';

angular.module('attero')
    .factory('tileElementMenuService', ['landscapingToolService', 'landscapingTileElements', function(landscapingTool, tileElements) {
        return {
            getItems: function(menu) {
                var items = [];

                Object.keys(tileElements).forEach(function(key) {
                    items.push(tileElements[key]);
                });

                return items;
            },
            select: function(item) {
                landscapingTool.setTileElement(item);
            },
            getSelected: function() {
                return landscapingTool.getTileElement();
            }
        };
    }]);
