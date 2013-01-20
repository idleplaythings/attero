
CREATE FUNCTION distance(x1 integer, y1 integer, x2 integer, y2 integer)
  RETURNS real
AS $$
  import math
  return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2))
$$ LANGUAGE plpythonu IMMUTABLE;

