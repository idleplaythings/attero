package models.repositories;

trait RepositoryContext
{
    protected val playerRepository: PlayerRepository;
    def getPlayerRepository: PlayerRepository = playerRepository;
}