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

    def getConcealment(elevation:Double): Int = {

        if (elevation < this.elevation + element.height)
            this.texture.concealment + this.element.concealment;

        0
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
            case 0  => new TileElement(0, 0, 0, 0, 0, 0)
            case 1  => new TileElement(1, 100, 30, 5, 10, 2)
            case 2  => new TileElement(2, 20, 20, 15, 20, 3)
            case 4  => new TileElement(4, 100, 30, 5, 10, 1)
            case 21 => new TileElement(21, 100, 100, 40, 150, 1)
            case 31 => new TileElement(31, 100, 100, 40, 300, 40)
            case 41 => new TileElement(41, -25, -20, -20, 0, 0)
            case 42 => new TileElement(42, -50, -50, -30, 0, 0)
            case 51 => new TileElement(51, 20, 20, 60, 50, 1) with Continious
            case 52 => new TileElement(52, 200, 40, 70, 100, 1 ) with Continious
        }
    }

    def getTextureByType(texture: Byte) : TileTexture =
    {
        texture match
        {
            case 1  => new TileTexture(1, 20, 0, 0, 0)
            case 5  => new TileTexture(5, 40, 10, 0, 0)
            case 2  => new TileTexture(2, 20, 0, 0, 0)
            case 21 => new TileTexture(21, 150, 10, 20, 0)
            case 31 => new TileTexture(31, 20, 0, 0, 0)
            case 41 => new TileTexture(41, 40, 10, 0, 0)
            case 42 => new TileTexture(42, 40, 10, 0, 0)
            case 43 => new TileTexture(43, 40, 0, 0, 0)
            case 44 => new TileTexture(44, 40, 0, 0, 0)
            case 51 => new TileTexture(51, 40, 0, 0, 0)
        }
    }
}