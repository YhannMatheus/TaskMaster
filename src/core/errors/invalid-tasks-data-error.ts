export class InvalidTaskDataError extends Error {
  constructor() {
    super("Dados de tarefa inválidos.");
  }
}
