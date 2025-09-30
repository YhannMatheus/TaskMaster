export class EmailAlreadyUsedError extends Error {
  constructor() {
    super("Email já está em uso.");
  }
}
