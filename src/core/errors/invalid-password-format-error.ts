export class InvalidPasswordFormatError extends Error {
  constructor() {
    super("Formato de senha inválido.");
  }
}
