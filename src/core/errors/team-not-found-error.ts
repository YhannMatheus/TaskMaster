export class TeamNotFoundError extends Error {
  constructor() {
    super("Equipe não encontrada.");
  }
}
