export class InvalidEmailFormatError extends Error {
  constructor() {
    super("Formato de e-mail inválido.");
  }
}
