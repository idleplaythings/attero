package models.tiles

abstract class TileTrait()
{
    val name:String;
}

class TileTraitWall() extends TileTrait
{
    override val name:String = "wall";
}

class TileTraitContinuous() extends TileTrait
{
    override val name:String = "continuous";
}

class TileTraitUnique() extends TileTrait
{
    override val name:String = "unique";
}