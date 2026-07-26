/** Raised by the action layer (data/actions) when a mutation would break an invariant. */
export class InvariantViolationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'InvariantViolationError'
  }
}
