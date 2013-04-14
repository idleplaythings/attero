'use strict';

angular.module('attero')
    .value('landscapingTools', {
        brush: new Brush(1, '/assets/textures/brush.png', 'Brush'),
        eraser: new Brush(2, '/assets/textures/eraser.png', 'Eraser'),
        up: new Brush(3, '/assets/textures/up.png', 'Up'),
        down: new Brush(4, '/assets/textures/down.png', 'Down')
    })
    .value('landscapingBrushSizes', {
        small: new BrushSize(1, '/assets/textures/small.png', 'Small'),
        medium: new BrushSize(2, '/assets/textures/medium.png', 'Medium'),
        large: new BrushSize(3, '/assets/textures/large.png', 'Large'),
        spray: new BrushSize(4, '/assets/textures/spray.png', 'Spray')
    })
    .factory('landscapingTextures', function() {
        return window.TileRepository.getTextures();
    })
    .factory('landscapingTileElements', function() {
        return window.TileRepository.getElements();
    })
    .factory('landscapingToolService', ['$rootScope', 'landscapingTools', 'landscapingBrushSizes', function($rootScope, tools, brushSizes) {
        var tool = tools.up;
        var brushSize = brushSizes.medium;
        var texture = null;
        var tileElement = null;

        return {
            getTool: function() {
                return tool;
            },
            setTool: function(newTool) {
                window.landscaping.selectedBrush = newTool.getId();
                tool = newTool;
            },
            getBrushSize: function() {
                return brushSize;
            },
            setBrushSize: function(newBrushSize) {
                window.landscaping.selectedBrushSize = newBrushSize.getId();
                brushSize = newBrushSize;
            },
            getTexture: function() {
                return texture;
            },
            setTexture: function(newTexture) {
                this.setTool(tools.brush);
                this.unsetTileElement();

                window.landscaping.selectedTexture = newTexture.getId();
                texture = newTexture;
            },
            unsetTexture: function() {
                window.landscaping.selectedTexture = null;
                texture = null;
            },
            getTileElement: function() {
                return tileElement;
            },
            setTileElement: function(newTileElement) {
                this.setTool(tools.brush);
                this.unsetTexture();

                window.landscaping.selectedElement = newTileElement.getId();
                tileElement = newTileElement;
            },
            unsetTileElement: function() {
                window.landscaping.selectedElement = null;
                tileElement = null;
            }
        }
    }]);
