angular.module('attero')
    .factory('textureMenuService', function() {
        function getTextures() {
            var textures = [];

            Object.keys(window.availableTextures).forEach(function(element) {
                textures.push(window.availableTextures[element]);
            });

            return textures;
        }

        var selectedItem = null;

        return {
            getItems: function(menu) {
                return getTextures();
            },
            select: function(item) {
                console.log(item)
                selectedItem = item;

                window.landscaping.selectedTexture = item.getId();
            },
            getSelected: function() {
                return selectedItem;
            }
        }
    });
