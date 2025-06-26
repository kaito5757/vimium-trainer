export class KeyBinding {
  constructor(
    private readonly _key: string,
    private readonly _description: string,
    private readonly _category: string
  ) {}

  get key(): string {
    return this._key;
  }

  get description(): string {
    return this._description;
  }

  get category(): string {
    return this._category;
  }

  equals(other: KeyBinding): boolean {
    return this._key === other._key;
  }
}