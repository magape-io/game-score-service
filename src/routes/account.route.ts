import { FastifyPluginAsync } from "fastify";
import { AccountController } from "../controllers/account.controller";
import { AchievementController } from "../controllers/achievement.controller";

const accountRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const accountController = new AccountController(fastify);
  const achievementController = new AchievementController(fastify);

  // 获取所有账户
  fastify.get("/", {}, async () => {
    return accountController.getAllAccount();
  });

  // 获取单个账户
  fastify.get<{
    Params: {
      id: string;
    };
  }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", pattern: "^\\d+$" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return accountController.getAccountById(id, reply);
    }
  );

  // 创建账户
  fastify.post<{
    Body: {
      address: string;
    };
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["address"],
          properties: {
            address: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { address } = request.body;

      // 先检查账户是否存在
      const existingAccount = await accountController.getAccountByAddress(
        address,
        reply
      );
      if (existingAccount) {
        return existingAccount;
      }

      // 如果账户不存在，创建新账户
      const newAccount = await accountController.createAccount(address);
      // 创建成就记录
      await achievementController.createAchievement(
        {
          body: {
            accountId: newAccount[0].id,
            achievementId: 1,
            complete: true,
          },
        } as any,
        reply
      );
      return newAccount;
    }
  );

  // 根据地址查询账户
  fastify.get<{
    Querystring: {
      address: string;
    };
  }>(
    "/by-address",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["address"],
          properties: {
            address: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { address } = request.query;
      return accountController.getAccountByAddress(address, reply);
    }
  );

  // 更新账户
  fastify.put<{
    Params: {
      id: string;
    };
    Body: {
      address: string;
    };
  }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", pattern: "^\\d+$" },
          },
        },
        body: {
          type: "object",
          required: ["address"],
          properties: {
            address: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { address } = request.body;
      console.log("updateAccount", id, address);
      return accountController.updateAccount(id, address, reply);
    }
  );

  // 删除账户
  fastify.delete<{
    Params: {
      id: string;
    };
  }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", pattern: "^\\d+$" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return accountController.deleteAccount(id, reply);
    }
  );
};

export default accountRoutes;
