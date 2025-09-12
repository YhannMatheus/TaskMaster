export class PermissionNotFoundError extends Error {
  constructor() {
    super("Permission not found");
  }
}
