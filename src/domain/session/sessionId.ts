export class SessionId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('SessionId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SessionId): boolean {
    return this.value === other.value;
  }

  static generate(): SessionId {
    return new SessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }
}