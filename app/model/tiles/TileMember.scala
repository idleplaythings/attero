package models.tiles

class TileMember(
    val id: Int,
    val terrainDifficulty: Int,
    val hide: Int,
    val cover: Int,
    val concealment: Int,
    val height: Int,
    protected val traits: Array[TileTrait])
{

    def hasTrait(traitName: String): Boolean =
    {
        this.traits.filter(_.name == traitName).length > 0;
    }
}

class TileElement(
    id: Int,
    terrainDifficulty: Int,
    hide: Int,
    cover: Int,
    concealment: Int,
    height: Int,
    traits: Array[TileTrait])
extends TileMember(
    id,
    terrainDifficulty,
    hide,
    cover,
    concealment,
    height,
    traits)
{}

class TileTexture(
    id: Int,
    terrainDifficulty: Int,
    hide: Int,
    cover: Int,
    concealment: Int,
    height: Int,
    traits: Array[TileTrait])
extends TileMember(
    id,
    terrainDifficulty,
    hide,
    cover,
    concealment,
    height,
    traits)
{}

object TileMember
{
    def getTileMember(
        id: Int,
        memberType: String,
        terrainDifficulty: Int,
        hide: Int,
        cover: Int,
        concealment: Int,
        height: Int,
        traits: String): TileMember =
    {
        memberType match {
            case element if element == "element" => new TileElement(id, terrainDifficulty, hide, cover, concealment, height, resolveTileTraits(traits))
            case texture if texture == "texture" => new TileTexture(id, terrainDifficulty, hide, cover, concealment, height, resolveTileTraits(traits))
        }
    }

    def resolveTileTraits(traits: String): Array[TileTrait] =
    {
        traits.split(",").map(resolveTileTrait(_)).filterNot(_.isEmpty).map(_.get);
    }

    def resolveTileTrait(tileTrait: String): Option[TileTrait] =
    {
        tileTrait match {
            case continuous if continuous == "continuous" => Some(new TileTraitContinuous())
            case unique if unique == "unique" => Some(new TileTraitUnique())
            case wall if wall == "wall" => Some(new TileTraitWall())
            case _ => None
        }

    }
}