package models.tiles

class TileElement()
{
    val terrainDifficulty: Int = 0;
    val hide: Int = 0;
    val cover: Int = 0;
    val concealment: Int = 0;
    val height: Int = 1;
}

trait Continious
{
    val cornerWeight: Double;
}

class Bushes() extends TileElement
{
    override val terrainDifficulty: Int = 100;
    override val hide: Int = 30;
    override val cover: Int = 5;
    override val concealment: Int = 10;
}

class SmallTrees() extends TileElement
{
    override val terrainDifficulty: Int = 100;
    override val hide: Int = 50;
    override val cover: Int = 10;
    override val concealment: Int = 20;
    override val height: Int = 2;
}

class Tree() extends TileElement
{
    override val terrainDifficulty: Int = 20;
    override val hide: Int = 20;
    override val cover: Int = 15;
    override val concealment: Int = 20;
    override val height: Int = 3;
}

class SmallHouse() extends TileElement
{
    override val terrainDifficulty: Int = 100;
    override val hide: Int = 100;
    override val cover: Int = 40;
    override val concealment: Int = 150;
}

class LargeHouse() extends TileElement
{
    override val terrainDifficulty: Int = 100;
    override val hide: Int = 100;
    override val cover: Int = 40;
    override val concealment: Int = 300;
    override val height: Int = 2;
}

class DirtRoad() extends TileElement
{
    override val terrainDifficulty: Int = -25;
    override val hide: Int = -20;
    override val cover: Int = -20;
}

class PavedRoad() extends TileElement
{
    override val terrainDifficulty: Int = -50;
    override val hide: Int = -50;
    override val cover: Int = -30;
}

class LowRockWall() extends TileElement with Continious
{
    override val terrainDifficulty: Int = 20;
    override val hide: Int = 20;
    override val cover: Int = 60;
    override val concealment: Int = 50;

    val cornerWeight: Double = 0.2;
}

class TallRockWall() extends TileElement with Continious
{
    override val terrainDifficulty: Int = 200;
    override val hide: Int = 40;
    override val cover: Int = 70;
    override val concealment: Int = 100;

    val cornerWeight: Double = 0.2;
}

