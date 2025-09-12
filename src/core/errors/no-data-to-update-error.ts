export class NoDataToUpdateError extends Error {
  constructor() {
    super("No data to update.");
  }
}
