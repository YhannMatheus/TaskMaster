export class TeamAlreadyExistsError extends Error {
  constructor() {
    super("Equipe já existe.");
  }
}
