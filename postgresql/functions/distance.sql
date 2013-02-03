
CREATE FUNCTION distance(x1 integer, y1 integer, x2 integer, y2 integer)
  RETURNS real
AS $$
  from math import sqrt, pow
  return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))
$$ LANGUAGE plpythonu IMMUTABLE;

