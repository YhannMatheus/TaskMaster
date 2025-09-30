export class InvalidProjectDataError extends Error {
  constructor() {
    super("Dados do projeto inválidos.");
  }
}
