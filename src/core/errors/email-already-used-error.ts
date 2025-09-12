export class EmailAlreadyUsedError extends Error {
  constructor() {
    super("Email is already in use.");
  }
}
