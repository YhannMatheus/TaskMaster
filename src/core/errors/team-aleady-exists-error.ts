export class TeamAlreadyExistsError extends Error {
  constructor() {
    super("Team already exists.");
  }
}
