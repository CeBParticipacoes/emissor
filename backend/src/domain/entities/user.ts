export class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    /** Nunca guarde a senha. Só o hash (bcrypt). */
    readonly passwordHash: string,
    readonly createdAt: Date,
  ) {}
}
