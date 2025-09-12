export class NotAppropriateRoleError extends Error {
  constructor() {
    super("User does not have the appropriate role.");
  }
}
