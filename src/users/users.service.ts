import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from './entities/user';
import { eq } from 'drizzle-orm';
import { UpdateUserRequest } from './dto/update-user.request';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getUsers() {
    return this.database.query.users.findMany();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    if (!user) throw new NotFoundException(`User with ${id} not found`);
    return user;
  }

  // tells drizzle about the type to expect when we're about to create a new user in the users table schema.users.$inferInsert
  async createUser(user: typeof schema.users.$inferInsert) {
    await this.database.insert(schema.users).values(user);
  }

  async updateUser(id: number, body: UpdateUserRequest) {
    await this.database
      .update(schema.users)
      .set({ ...body })
      .where(eq(schema.users.id, id))
      .returning();
  }

  async deleteUser(id: number) {
    const deletedUsr = await this.database
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();
    if (!deletedUsr.length) {
      throw new NotFoundException(`User with ${id} not found to be deleted`);
    }
    return deletedUsr;
  }
}
