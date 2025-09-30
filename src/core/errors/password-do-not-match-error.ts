export class PasswordDoNotMatchError extends Error {
  constructor() {
    super("As senhas não coincidem.");
  }
}
