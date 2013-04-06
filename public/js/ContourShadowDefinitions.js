Contours =
{
    sColor: Array(0,0,0),
    hColor: Array(255,255,155),
    sAlpha:0.8,
    hAlpha:0.5,

    match: function(key, list)
    {
        for (var i in list)
        {
            var regexp = Contours.mutilateRegExp(i);
            //regexp = str.replace("d","(d|0)");
            if (key.match(regexp))
                return list[i];
        }
        return false;
    },

    testMatches: function(key)
    {
        for (var i in ContourShadows)
        {
            var regexp = Contours.mutilateRegExp(i);
            if (key.match(regexp))
                console.log("   + ContourShadows: " + i);
        }

        for (var i in ContourHighlights)
        {
            var regexp = Contours.mutilateRegExp(i);
            if (key.match(regexp))
                console.log("   + ContourHighlights: " + i);
        }
    },

    mutilateRegExp: function(reg)
    {
        reg = reg.replace(/e/g,"(d|0)");
        reg = reg.replace(/o/g,"(u|0)");
        reg = reg.replace(/l/g,"(u|d)");

        return '^'+reg+'$';
    }
};

ContourShadows = [];
ContourHighlights = [];

Contours.middleShadow = {s:4, c:Contours.sColor, a:Contours.sAlpha};
Contours.middleHighlight = {s:4, c:Contours.hColor, a:Contours.hAlpha};

ContourShadows['uuu00d00'] = false;


//highlight corner
ContourHighlights['....0.0u'] = {s:8, c:Contours.hColor, a:Contours.hAlpha};

ContourHighlights['.0u.0...'] = {s:2, c:Contours.hColor, a:Contours.hAlpha};

//shadow corner
ContourShadows['u0.0....'] = {s:0, c:Contours.sColor, a:Contours.sAlpha};
ContourShadows['...0.u0.'] = {s:6, c:Contours.sColor, a:Contours.sAlpha};

//inverse shadow corner

ContourShadows['.0du0.u.'] = {s:2, c:Contours.sColor, a:Contours.sAlpha};

ContourShadows['.l.l0.0d'] = {s:8, c:Contours.sColor, a:Contours.sAlpha};

ContourHighlights['.u.0.d0.'] = {s:6, c:Contours.hColor, a:Contours.hAlpha};

//diagonal highlight
ContourHighlights['..0.u0u.'] = {s:0, c:Contours.hColor, a:Contours.hAlpha};

//inverse highlight corner
ContourHighlights['.0.0l.lu'] = {s:1, c:Contours.hColor, a:Contours.hAlpha};
ContourHighlights['.u.0u00.'] = {s:6, c:Contours.hColor, a:Contours.hAlpha};

//straight highlights
ContourHighlights['.e.00.u.'] = Contours.middleHighlight;
ContourHighlights['.d.00...'] = Contours.middleHighlight;

ContourHighlights['.0.eu.0.'] = Contours.middleHighlight;
ContourHighlights['.0.d..0.'] = Contours.middleHighlight;

//straight shadows
ContourShadows['.u.00.e.'] = Contours.middleShadow;
ContourShadows['.0.ue.0.'] = Contours.middleShadow;

ContourShadows['.0..d.0.'] = Contours.middleShadow;
