package models.tiles

abstract class TileTexture()
{
    val terrainDifficulty: Int = 0;
    val hide: Int = 0;
    val cover: Int = 0;
    val concealment: Int = 0;
}

class Grass() extends TileTexture
{
    override val terrainDifficulty: Int = 20;
}

class LongGrass() extends TileTexture
{
    override val terrainDifficulty: Int = 40;
    override val hide: Int = 10;
}

class ForrestFloor() extends TileTexture
{
    override val terrainDifficulty: Int = 20;
}

class RockyGround() extends TileTexture
{
    override val terrainDifficulty: Int = 150;
    override val cover = 20;
    override val hide = 10;
}

class Dirt() extends TileTexture
{
    override val terrainDifficulty: Int = 20;
}