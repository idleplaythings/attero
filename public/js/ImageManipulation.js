ImageManipulation = 
{
    addImageDataToTileTexture: function(targetData, imageData )
    {
        var data = targetData.data;
        var textureData = imageData.data;

        var pixels = 6400;

        while (pixels) {
            var r = pixels-4;
            var g = pixels-3;
            var b = pixels-2;
            var a = pixels-1;

            if (textureData[a] == 0)
            {
                pixels -= 4;
                continue;
            }

            if (data[a] == 0)
            {
                data[a] = textureData[a];
                data[r] = textureData[r];
                data[g] = textureData[g];
                data[b] = textureData[b];
            }
            else
            {
                var m = textureData[a] / 255;
                data[r] = data[r] * (1-m) + textureData[r] * m;
                data[g] = data[g] * (1-m) + textureData[g] * m;
                data[b] = data[b] * (1-m) + textureData[b] * m;
            }

            pixels -= 4;
        }
        targetData.data = data;
    },
    
    addImageDataToTileTextureAsTransparent: function(targetData, imageData )
    {
        var data = targetData.data;
        var textureData = imageData.data;
        console.log("transparenting");
        var pixels = 6400;

        while (pixels) {
            var a = pixels-1;
            
            if (textureData[a] > 0)
            {
                data[a] = 255-textureData[a];
            }
            pixels -= 4;
            
        }
        targetData.data = data;
    },
    
    addImageDataToGridTexture: function( targetData, imageData, x, y, targetsize, imgsize, append )
    {
        var data = targetData.data;
        var textureData = imageData.data;

        for (var i=0;i<imgsize;i++)
        {
            if (y+i > targetsize || y+i < 0)
                continue;
            
            for (var a=1;a<=imgsize;a++)
            {
                if (x+a > targetsize || x+a < 1)
                    continue;
            
                var pixel = (i*imgsize+a)*4;
                var bigPixel = ((targetsize*(i+y))+x+a)*4;
                
                if (append)
                {
                    var m = (textureData[pixel-1] / 255);
                    data[bigPixel-4] = data[bigPixel-4] * (1-m) + textureData[pixel-4] * m;
                    data[bigPixel-3] = data[bigPixel-3] * (1-m) + textureData[pixel-3] * m;
                    data[bigPixel-2] = data[bigPixel-2] * (1-m) + textureData[pixel-2] * m;     
                }
                else
                {
                    data[bigPixel-1] = textureData[pixel-1];
                    data[bigPixel-4] = textureData[pixel-4];
                    data[bigPixel-3] = textureData[pixel-3];
                    data[bigPixel-2] = textureData[pixel-2];
                }//data[bigPixel-1] = 0;
            }
        }
        targetData.data = data;
    },
    
    addMaskedImageDataToTileTexture: function(textureImageData, mask, texture)
    {
        var maskData =  mask.data;
        var textureData = texture.data;
        var finalData = textureImageData.data;
        var pixels = 6400;

        while (pixels) {
            var r = pixels-4;
            var g = pixels-3;
            var b = pixels-2;
            var a = pixels-1;

            var maskAlpha = maskData[a];

            if (maskAlpha == 0)
            {
                pixels -= 4;
                continue;
            }

            if (finalData[a] == 0)
            {
                finalData[a] = maskAlpha;
                finalData[r] = textureData[r];
                finalData[g] = textureData[g];
                finalData[b] = textureData[b];
            }
            else
            {
                var m = maskAlpha / 255;
                finalData[r] = finalData[r] * (1-m) + textureData[r] * m;
                finalData[g] = finalData[g] * (1-m) + textureData[g] * m;
                finalData[b] = finalData[b] * (1-m) + textureData[b] * m;

                finalData[a] = (finalData[a] > maskAlpha) ? finalData[a] : maskAlpha;
            }

            pixels -= 4;
        }
        textureImageData.data = finalData;
    },
    
    drawBordersForTile: function( targetData )
    {
        var data = targetData.data;
        for (var i=0;i<40;i++)
        {
            for (var a=0;a<=40;a++)
            {
                if  (i==39 || a == 39)
                {
                    var pixel = (i*40+a)*4;
                    data[pixel-4] = 0;
                    data[pixel-3] = 0;
                    data[pixel-2] = 0; 
                }
            }
        }
        
        targetData.data = data;
    },
    
    drawAndRotate: function(canvas, ix, iy, w, h, width, height, angle, img, rolled){
		
        var x = Math.round(w/2);
        var y = Math.round(h/2);
        
        if (rolled)
            angle = 360 - angle;
        
        angle = angle * Math.PI / 180;              
        canvas.save();
        canvas.translate(x, y);
        if (rolled)
            canvas.scale(1, -1);
        canvas.rotate(angle);
        canvas.drawImage(img, ix, iy, width, height, -width / 2, -height / 2, width, height);
        canvas.rotate(-angle);
        canvas.translate(-x, -y);               
        canvas.restore();
    
    }
}