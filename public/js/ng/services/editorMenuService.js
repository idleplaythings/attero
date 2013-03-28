
angular.module('attero')
    .factory('editorMenuService', function() {
        return {
            getItems: function(menu) {
                switch (menu) {
                    case 'tools':
                        return [
                            new Brush(1, '/assets/textures/brush.png', 'Brush'),
                            new Brush(2, '/assets/textures/eraser.png', 'Eraser'),
                            new Brush(3, '/assets/textures/up.png', 'Up'),
                            new Brush(4, '/assets/textures/down.png', 'Down')
                        ];
                }
            }
        };
    });
