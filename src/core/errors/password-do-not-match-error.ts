export class PasswordDoNotMatchError extends Error {
  constructor() {
    super("Passwords do not match.");
  }
}
