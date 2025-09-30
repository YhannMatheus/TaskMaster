export class ProjectNotFoundError extends Error {
  constructor() {
    super("Projeto não encontrado.");
  }
}
