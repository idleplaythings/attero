angular.module('attero')
    .factory('tileElementMenuService', function() {
        function getTextures() {
            var textures = [];

            Object.keys(window.availableTileElements).forEach(function(element) {
                textures.push(window.availableTileElements[element]);
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

                window.landscaping.selectedElement = item.getId();
            },
            getSelected: function() {
                return selectedItem;
            }
        }
    });
