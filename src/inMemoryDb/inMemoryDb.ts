class DB {
  private _users: string[] = [];
  get users(): string[] {
    return this._users;
  }

  set users(users) {
    this._users = [...users];
  }

  updateUsers(user: string) {
    this._users = [...this._users, user];
  }
}

export const db = new DB();
