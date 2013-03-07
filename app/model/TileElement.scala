package models

object TileElement
{
    val definition: Map[Int, Tuple4[Int, Int, Int, Int]] = Map(
        //concealment, cover, terrain, height,
        //default
        0 -> (0, 0, 0, 0),
        //1-20 trees
        1 -> (20, 20, 20,  2),
        2 -> (30, 30, 10,  3),
        4 -> (10, 10, 30,  1),
        //21-30 small houses
        21 -> (150, 40, 20,  1),
        //31-40 large houses
        31 -> (300, 60, 20,  2),
        //41-50 roads
        41 -> (0, 0, 0, 1),
        42 -> (0, 0, 0, 1),
        43 -> (0, 30, 0, 1),
        //51-60 fences
        51 -> (50, 30, 0, 1),
        52 -> (100, 40, 0, 1)
    )
}