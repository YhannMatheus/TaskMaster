export class InternalServerErrorError extends Error {
  constructor() {
    super("Internal server error.");
  }
}
