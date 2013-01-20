

def bresenham_line((x, y), (x2, y2)):
    """Brensenham line algorithm"""
    steep = 0
    coords = []

    dx = abs(x2 - x)
    if (x2 - x) > 0:
        sx = 1
    else:
        sx = -1

    dy = abs(y2 - y)
    if (y2 - y) > 0:
        sy = 1
    else:
        sy = -1

    if dy > dx:
        steep = 1
        x, y = y, x
        dx, dy = dy, dx
        sx, sy = sy, sx

    d = (2 * dy) - dx

    for i in range(0, dx):
        if steep:
            coords.append((y, x))
        else:
            coords.append((x, y))
        while d >= 0:
            y = y + sy
            d = d - (2 * dx)
        x = x + sx
        d = d + (2 * dy)
    coords.append((x2, y2))
    return coords


def raytrace(x1, y1, x2, y2):
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

print bresenham_line((0, 0), (2, 2))
print raytrace(0, 0, 2, 2)
