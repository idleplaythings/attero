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
ContourHighlights['00000.u.'] = Contours.middleHighlight;
ContourHighlights['00.0u00.'] = Contours.middleHighlight;

//straight shadows
ContourShadows['.u.00000'] = Contours.middleShadow;
ContourShadows['.00u0.00'] = Contours.middleShadow;


//ContourHighlights['.d.00000'] = {s:4, c:Contours.hColor, a:Contours.hAlpha};
//ContourHighlights['.00d0.00'] = {s:4, c:Contours.hColor, a:Contours.hAlpha};