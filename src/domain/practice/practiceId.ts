export class PracticeId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('PracticeId cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PracticeId): boolean {
    return this.value === other.value;
  }

  static generate(): PracticeId {
    return new PracticeId(`practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }
}