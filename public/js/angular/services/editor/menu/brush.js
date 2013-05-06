'use strict';

angular.module('attero')
    .factory('brushMenuService', ['landscapingTools', 'landscapingToolService', function(tools, landscapingTool) {
        return {
            getItems: function() {
                var items = [];

                Object.keys(tools).forEach(function(key) {
                    items.push(tools[key]);
                });

                return items;
            },
            select: function(item) {
                landscapingTool.setTool(item);
            },
            getSelected: function() {
                return landscapingTool.getTool();
            }
        };
    }]);
