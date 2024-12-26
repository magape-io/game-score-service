import { FastifyInstance, FastifyReply } from "fastify";
import { account } from "../db/schema";
import { eq } from "drizzle-orm";

export class AccountController {
  constructor(private fastify: FastifyInstance) {}

  async getAllAccount() {
    return this.fastify.db.select().from(account);
  }

  async getAccountById(id: number | string, reply: FastifyReply) {
    const result = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.id, parseInt(id.toString())));
    if (!result.length) {
      reply.code(404);
      throw new Error("Account not found");
    }
    return result;
  }

  async createAccount(address: string) {
    return this.fastify.db.insert(account).values({
      address,
    });
  }

  async deleteAccount(id: number | string, reply: FastifyReply) {
    const deletedUser = await this.fastify.db
      .delete(account)
      .where(eq(account.id, parseInt(id.toString())))
      .returning();
    if (!deletedUser.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    return deletedUser[0];
  }

  async updateAccount(
    id: number | string,
    address: string,
    reply: FastifyReply
  ) {
    const updateAccount = await this.fastify.db
      .update(account)
      .set({
        address,
      })
      .where(eq(account.id, parseInt(id.toString())))
      .returning();

    if (!updateAccount.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    return updateAccount[0];
  }
}
