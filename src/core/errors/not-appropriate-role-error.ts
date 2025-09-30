export class NotAppropriateRoleError extends Error {
  constructor() {
    super("Usuário não possui a função apropriada.");
  }
}
