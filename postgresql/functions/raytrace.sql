
CREATE FUNCTION raytrace(x1 integer, y1 integer, x2 integer, y2 integer)
    RETURNS TABLE(x integer, y integer)
AS $$
    # Source:
    # http://playtechs.blogspot.fi/2007/03/raytracing-on-grid.html
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
        coords.append((int(x), int(y)))

        if error > 0:
            x = x + x_inc
            error = error - dy
        else:
            y = y + y_inc
            error = error + dx

        n = n - 1

    return coords
$$ LANGUAGE plpythonu IMMUTABLE;

CREATE FUNCTION raytrace_tileids(x1 integer, y1 integer, x2 integer, y2 integer)
    RETURNS TABLE(tileid integer)
AS $$
    # Source:
    # http://playtechs.blogspot.fi/2007/03/raytracing-on-grid.html
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    x = x1
    y = y1
    n = 1 + dx + dy
    tile_ids = []

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
        tile_ids.append(y * 201 + x)

        if error > 0:
            x = x + x_inc
            error = error - dy
        else:
            y = y + y_inc
            error = error + dx

        n = n - 1

    return tile_ids
$$ LANGUAGE plpythonu IMMUTABLE;
