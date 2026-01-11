import { text } from 'drizzle-orm/pg-core';
import { serial, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password'),
});
