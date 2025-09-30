export class NoDataToUpdateError extends Error {
  constructor() {
    super("Nenhum dado para atualizar.");
  }
}
