export class FailedToRegisterToken extends Error {
  constructor() {
    super("Falha ao registrar token.");
  }
}
