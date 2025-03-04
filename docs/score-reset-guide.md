# 积分重置和恢复操作指南

本文档描述了如何使用积分重置和恢复功能。这些功能允许管理员重置所有用户的积分，并在需要时从备份文件恢复数据。

## 功能概述

1. **积分重置功能**
   - 将所有用户的积分重置为0
   - 自动备份当前数据到CSV文件
   - 更新所有记录的时间戳

2. **数据恢复功能**
   - 从之前的备份CSV文件恢复数据
   - 使用事务确保数据恢复的原子性
   - 保持原有的ID和时间戳

## API 接口

### 1. 获取备份文件列表

```bash
curl -X GET "http://localhost:3000/scores/backups" -H "accept: application/json"
```

**响应示例：**
```json
{
  "message": "Backup files retrieved successfully",
  "files": [
    {
      "fileName": "score_backup_2025-03-04T01-39-40-123Z.csv",
      "size": 1234,
      "createdAt": "2025-03-04T01:39:40.123Z",
      "modifiedAt": "2025-03-04T01:39:40.123Z"
    }
  ]
}
```

### 2. 重置积分

```bash
curl -X POST "http://localhost:3000/scores/reset-all" -H "accept: application/json"
```

**响应示例：**
```json
{
  "message": "All scores have been reset and backed up",
  "backupFile": "score_backup_2025-03-04T01-39-40-123Z.csv",
  "resetCount": 36
}
```

### 3. 恢复数据

```bash
curl -X POST "http://localhost:3000/scores/restore" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"backupFile":"score_backup_2025-03-04T01-39-40-123Z.csv"}'
```

**响应示例：**
```json
{
  "message": "Scores have been restored successfully",
  "restoredCount": 36
}
```

## 备份文件

- 备份文件保存在项目的 `backups` 目录下
- 文件名格式：`score_backup_YYYY-MM-DDTHH-mm-ss-SSSZ.csv`
- CSV文件包含以下字段：
  - ID：记录ID
  - Score：积分值
  - Game ID：游戏ID
  - Account ID：账户ID
  - Account Address：钱包地址
  - Game Name：游戏名称
  - Created At：创建时间
  - Updated At：更新时间

## 使用流程

1. **查看可用备份**
   - 使用 GET `/scores/backups` 接口获取所有备份文件列表
   - 列表按时间倒序排列，最新的备份在最前面
   - 可以查看文件大小和创建时间

2. **重置积分**
   - 调用 POST `/scores/reset-all` 接口
   - 系统会自动创建备份文件
   - 记录返回的备份文件名

3. **恢复数据**
   - 从备份列表中选择要恢复的文件
   - 使用文件名调用 POST `/scores/restore` 接口
   - 等待恢复完成

## 注意事项

1. **备份目录**
   - 确保 `backups` 目录存在且有写入权限
   - 建议定期清理旧的备份文件

2. **数据恢复**
   - 恢复操作会先清空当前所有数据
   - 使用事务确保数据恢复的完整性
   - 如果恢复过程中出错，所有更改都会回滚

3. **最佳实践**
   - 在重置积分前先测试备份文件是否可用
   - 保留最近几次的备份文件
   - 在低峰期进行重置操作

## 错误处理

如果遇到错误，API 会返回 500 状态码和错误信息。常见错误包括：
- 备份文件不存在
- 备份文件格式错误
- 数据库连接问题

## 开发者信息

- 代码位置：`src/controllers/score.controller.ts`
- 路由定义：`src/routes/score.route.ts`
- 依赖包：
  - csv-writer：用于生成CSV文件
  - csv-parse：用于解析CSV文件
