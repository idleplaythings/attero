Contours =
{
    sColor: Array(0,0,0),
    hColor: Array(255,255,100),
    sAlpha:0.8,
    hAlpha:0.5,

    match: function(key, list)
    {
        for (var i in list)
        {
            var regexp = '^'+i+'$';
            //regexp = str.replace("d","(d|0)");
            if (key.match(regexp))
                return list[i];
        }
        return false;
    }
}

ContourShadows = [];
ContourHighlights = [];

Contours.middleShadow = {s:4, c:Contours.sColor, a:Contours.sAlpha};
Contours.middleHighlight = {s:4, c:Contours.hColor, a:Contours.hAlpha};

//highlight corner
ContourHighlights['.000000u'] = {s:8, c:Contours.hColor, a:Contours.hAlpha};
ContourHighlights['00u00.00'] = {s:2, c:Contours.hColor, a:Contours.hAlpha};

//shadow corner
ContourShadows['u0000000'] = {s:0, c:Contours.sColor, a:Contours.sAlpha};
ContourShadows['00000u00'] = {s:6, c:Contours.sColor, a:Contours.sAlpha};

//inverse shadow corner

ContourShadows['.00u0.u.'] = {s:2, c:Contours.sColor, a:Contours.sAlpha};
ContourShadows['.u.u0.00'] = {s:8, c:Contours.sColor, a:Contours.sAlpha};
ContourHighlights['.u.0u00.'] = {s:6, c:Contours.hColor, a:Contours.hAlpha};
//inverse highlight corner

ContourHighlights['00.0u.u.'] = {s:1, c:Contours.hColor, a:Contours.hAlpha};
ContourHighlights['.u.0100.'] = {s:6, c:Contours.hColor, a:Contours.hAlpha};

//straight highlights
ContourHighlights['.0.00.u.'] = Contours.middleHighlight;
ContourHighlights['.0.0u.0.'] = Contours.middleHighlight;

//straight shadows
ContourShadows['.u.00.0.'] = Contours.middleShadow;
ContourShadows['.0.u0.0.'] = Contours.middleShadow;

//uuu0uu00
//uuu0uu0u
//00uu0uuu
ContourHighlights['00000u0u'] = {s:7, c:Contours.hColor, a:Contours.hAlpha};
ContourShadows['u0u00000'] = {s:1, c:Contours.sColor, a:Contours.sAlpha};

ContourShadows['u0000u00'] = {s:3, c:Contours.sColor, a:Contours.sAlpha};
ContourHighlights['00u0000u'] = {s:5, c:Contours.hColor, a:Contours.hAlpha};

ContourShadows['..uu0uuu'] = {s:4, c:Contours.sColor, a:Contours.sAlpha, offset:7};
ContourHighlights['uuu0uu0.'] = {s:4, c:Contours.hColor, a:Contours.hAlpha, offset:7};

ContourShadows['.u.uu.u.'] = {s:4, c:Contours.sColor, a:Contours.sAlpha, offset:1};
ContourHighlights['.u.uu.u.'] = {s:4, c:Contours.hColor, a:Contours.hAlpha, offset:2};

ContourShadows['.u.u0...'] = {s:4, c:Contours.sColor, a:Contours.sAlpha, offset:1};
ContourShadows['.u.u0.0.'] = {s:4, c:Contours.sColor, a:Contours.sAlpha, offset:1};
ContourShadows['.u.u..0.'] = {s:4, c:Contours.sColor, a:Contours.sAlpha, offset:1};

ContourHighlights['.0.0u.u.'] = {s:4, c:Contours.hColor, a:Contours.hAlpha, offset:2};
ContourHighlights['.0..u.u.'] = {s:4, c:Contours.hColor, a:Contours.hAlpha, offset:2};
ContourHighlights['...0u.u.'] = {s:4, c:Contours.hColor, a:Contours.hAlpha, offset:2};

ContourShadows['.u.00.u.'] = {s:0, c:Contours.sColor, a:Contours.sAlpha, offset:3};
ContourShadows['.u.0..u.'] = {s:0, c:Contours.sColor, a:Contours.sAlpha, offset:3};
ContourShadows['.u..0.u.'] = {s:0, c:Contours.sColor, a:Contours.sAlpha, offset:3};

ContourHighlights['.u.00.u.'] = {s:7, c:Contours.hColor, a:Contours.hAlpha, offset:4};
ContourHighlights['.u.0..u.'] = {s:7, c:Contours.hColor, a:Contours.hAlpha, offset:4};
ContourHighlights['.u..0.u.'] = {s:7, c:Contours.hColor, a:Contours.hAlpha, offset:4};

ContourShadows['...uu...'] = {s:3, c:Contours.sColor, a:Contours.sAlpha, offset:5};
ContourHighlights['...uu...'] = {s:5, c:Contours.hColor, a:Contours.hAlpha, offset:6};
//ContourShadows['uuuuuu00'] = {s:3, c:Contours.sColor, a:Contours.sAlpha};

//u0uu0u00


//ContourHighlights['.d.00000'] = {s:4, c:Contours.hColor, a:Contours.hAlpha};
//ContourHighlights['.00d0.00'] = {s:4, c:Contours.hColor, a:Contours.hAlpha};