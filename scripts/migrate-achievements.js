const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { eq } = require("drizzle-orm");

async function migrateAchievements() {
  // 创建数据库连接
  console.log(234242,process.env.DATABASE_URL)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log("开始迁移数据...");

    // 获取所有账户
    const accounts = await pool.query('SELECT * FROM "account"');
    console.log(`找到 ${accounts.rows.length} 个账户需要处理`);

    // 为每个账户创建或更新成就记录
    for (const acc of accounts.rows) {
      await pool.query(
        `INSERT INTO "achievement" ("accountId", "achievementId", "complete", "complete_time")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("accountId", "achievementId") 
         DO UPDATE SET 
           complete = EXCLUDED.complete,
           "complete_time" = EXCLUDED."complete_time"`,
        [acc.id, 1, true, new Date().toISOString()]
      );
      console.log(`处理账户 ${acc.address} 完成`);
    }

    console.log("数据迁移完成！");
  } catch (error) {
    console.error("迁移过程中发生错误:", error);
  } finally {
    await pool.end();
  }
}

// 执行迁移
migrateAchievements();
