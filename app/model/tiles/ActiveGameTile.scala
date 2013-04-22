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

    def getConcealment(): Int = {
        this.texture.concealment + this.element.concealment;
    }
}

object ActiveGameTile
{
    implicit def boolToInt(b: Boolean) = if (b) 1 else 0

    def getTileConcealment(details: (Byte,Byte,Byte), tileDefinition: TileDefinition): Short =
    {
        val (texture, element, elevation) = details;
        val textureObject = tileDefinition.getTexture(texture);
        val elementObject = tileDefinition.getElement(element);

        val concealment = (textureObject.concealment + elementObject.concealment).toShort;
        val unique:Int = elementObject.hasTrait("unique");
        val height = elementObject.height.toShort;

        val bit = ((unique << 14) + (height << 13) + concealment).toShort;
        if (concealment > 0)
            println("tile detais (c,con,h): " + concealment + ", " + unique + ", " + height + " bit: " + bit);

        bit
    }

    def buildTile(id: Int, pos: (Int, Int), details: (Byte,Byte,Byte), tileDefinition: TileDefinition) =
    {
        val (x, y) = pos
        val (texture, element, elevation) = details

        new ActiveGameTile(
            id,
            x,
            y,
            tileDefinition.getTexture(texture),
            elevation.toInt,
            tileDefinition.getElement(element)
        )
    }
}