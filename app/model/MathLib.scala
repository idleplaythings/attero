package models;

object MathLib
{
  def distance (p1: (Int, Int), p2: (Int, Int)) = {
    val (p1x, p1y) = p1
    val (p2x, p2y) = p2
    val dx = p1x - p2x
    val dy = p1y - p2y
    Math.sqrt(dx*dx + dy*dy)
  }
}