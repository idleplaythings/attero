angular.module('attero')
    .factory('brushSizeMenuService', function() {
        var selectedItem = null;

        return {
            getItems: function(menu) {
                return [
                    new BrushSize(1, '/assets/textures/small.png', 'Small'),
                    new BrushSize(2, '/assets/textures/medium.png', 'Medium'),
                    new BrushSize(3, '/assets/textures/large.png', 'Large'),
                    new BrushSize(4, '/assets/textures/spray.png', 'Spray')
                ];
            },
            select: function(item) {
                selectedItem = item;

                window.landscaping.selectedBrushSize = item.getId();
            },
            getSelected: function() {
                return selectedItem;
            }
        }
    });
