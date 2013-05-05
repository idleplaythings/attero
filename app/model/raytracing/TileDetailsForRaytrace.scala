package models.raytracing;

case class TileDetailsForRaytrace(
    position: (Int, Int),
    concealment: Int,
    element: Int,
    elevation: Int,
    height: Int,
    unique: Boolean)
