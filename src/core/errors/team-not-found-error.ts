export class TeamNotFoundError extends Error {
  constructor() {
    super("Team not found.");
  }
}
