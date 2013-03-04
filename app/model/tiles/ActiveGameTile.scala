package models.tiles;

case class ActiveGameTile(
  val id: Int,
  val x: Int,
  val y: Int,
  val texture: TileTexture,
  val elevation: Int,
  val element: TileElement
)
{
    def getPosition: (Int, Int) = {(this.x, this.y)}

    def getMovementDifficulty: Int = {
        texture.terrainDifficulty + element.terrainDifficulty;
    }
}

object ActiveGameTile
{
    def buildTile(id: Int, pos: (Int, Int), details: (Byte,Byte,Byte)) =
    {
        val (x, y) = pos
        val (texture, element, elevation) = details

        new ActiveGameTile(
            id,
            x,
            y,
            getTextureByType(texture),
            elevation.toInt,
            getElementByType(element)
        )
    }

    def getElementByType(element: Byte) : TileElement =
    {
        element match
        {
            case 0 => new TileElement()
            case 1 => new SmallTrees()
            case 2 => new Tree()
            case 4 => new Bushes()
            case 21 => new SmallHouse()
            case 31 => new LargeHouse()
            case 41 => new DirtRoad()
            case 42 => new PavedRoad()
            case 51 => new LowRockWall()
            case 52 => new TallRockWall()
        }
    }

    def getTextureByType(texture: Byte) : TileTexture =
    {
        texture match
        {
            case 1 => new Grass()
            case 5 => new LongGrass()
            case 2 => new ForrestFloor()
            case 21 => new RockyGround()
            case 31 => new Dirt()
            case 41 => new LongGrass()
            case 42 => new LongGrass()
            case 43 => new LongGrass()
            case 44 => new LongGrass()
            case 51 => new LongGrass()
        }
    }
}