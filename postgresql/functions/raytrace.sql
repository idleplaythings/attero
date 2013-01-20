
CREATE FUNCTION raytrace(x1 integer, y1 integer, x2 integer, y2 integer)
    RETURNS TABLE(x integer, y integer)
AS $$
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    x = x1
    y = y1
    n = 1 + dx + dy
    coords = []

    if x2 > x1:
        x_inc = 1
    else:
        x_inc = -1

    if y2 > y1:
        y_inc = 1
    else:
        y_inc = -1

    error = dx - dy
    dx = dx * 2
    dy = dy * 2

    while n > 0:
        coords.append((x, y))

        if error > 0:
            x = x + x_inc
            error = error - dy
        else:
            y = y + y_inc
            error = error + dx

        n = n - 1

    return coords
$$ LANGUAGE plpythonu IMMUTABLE;
