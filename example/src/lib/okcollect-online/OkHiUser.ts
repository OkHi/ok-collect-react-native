export default class OkHiUser {
  constructor(
    private readonly user: {
      firstName?: string;
      lastName?: string;
      phone: string;
    },
  ) {}

  public toJSON() {
    return JSON.stringify(this.user);
  }

  public get data(): {firstName?: string; lastName?: string; phone?: string} {
    return this.user;
  }
}
