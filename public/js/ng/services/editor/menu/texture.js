'use strict';

angular.module('attero')
    .factory('textureMenuService', ['landscapingToolService', 'landscapingTextures', function(landscapingTool, textures) {
        return {
            getItems: function(menu) {
                var items = [];

                Object.keys(textures).forEach(function(key) {
                    items.push(textures[key]);
                });

                return items;
            },
            select: function(item) {
                landscapingTool.setTexture(item);
            },
            getSelected: function() {
                return landscapingTool.getTexture();
            }
        };
    }]);
