export class InvalidPasswordFormatError extends Error {
  constructor() {
    super("Invalid password format.");
  }
}
