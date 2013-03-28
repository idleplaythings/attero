angular.module('attero')
    .factory('brushMenuService', function() {
        var selectedItem = null;

        return {
            getItems: function(menu) {
                return [
                    new Brush(1, '/assets/textures/brush.png', 'Brush'),
                    new Brush(2, '/assets/textures/eraser.png', 'Eraser'),
                    new Brush(3, '/assets/textures/up.png', 'Up'),
                    new Brush(4, '/assets/textures/down.png', 'Down')
                ];
            },
            select: function(item) {
                selectedItem = item;

                window.landscaping.selectedBrush = item.getId();
            },
            getSelected: function() {
                return selectedItem;
            }
        }
    });
