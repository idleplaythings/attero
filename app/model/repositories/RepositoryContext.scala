package models.repositories;

trait RepositoryContext
{
    protected val playerRepository: PlayerRepository;
    def getPlayerRepository: PlayerRepository = playerRepository;

    protected val unitRepository: UnitRepository;
    def getUnitRepository: UnitRepository = unitRepository;

    protected val tileRepository: TileRepository;
    def getTileRepository: TileRepository = tileRepository;
}