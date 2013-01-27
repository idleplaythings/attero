window.MathLib =
{
    getPointInDirection: function( r, a, cx, cy){

        x = cx + r * Math.cos(a* Math.PI / 180);
        y = cy + r * Math.sin(a* Math.PI / 180);

        return {x:Math.round(x), y:Math.round(y)};
    }
}