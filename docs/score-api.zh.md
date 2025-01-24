# 游戏分数 API 说明

## 1. 获取分数接口

### 接口地址
```
GET /scores
```

### 查询参数

| 参数名     | 说明           | 是否必填 | 示例值 |
|-----------|---------------|---------|--------|
| startTime | 开始时间 | 否 | `2025-01-20T05:25:00.000Z` 或 `1737349200000` |
| endTime   | 结束时间 | 否 | `2025-01-20T05:25:00.000Z` 或 `1737349200000` |
| gameId    | 游戏ID | 否 | 3 |
| accountId | 账号ID | 否 | 28 |
| address | 钱包地址 | 否 | 0x897575 |
| limit     | 返回数量限制 | 否 | 10 |
| offset    | 分页偏移量 | 否 | 0 |

### 时间格式说明

支持两种时间格式：
1. ISO格式：`2025-01-20T05:25:00.000Z`
2. 时间戳（毫秒）：`1737349200000`

### 请求示例

```
https://tcsc8wckk4kgwk000kkkoswg.whyindian.site/scores?startTime=2025-01-20T05:25:00.000Z
```

### 返回示例

```json
{
  "code": 200,
  "err": "",
  "data": [
    {
      "address": "0x897575888",
      "quantity": 18,
      "propName": "score",
      "propId": 1
    }
  ],
  "total": 1
}
```

## 2. 获取指定数量排名（POST）

### 接口地址
```
POST /scores/rank/{gameId}
```

### 路径参数

| 参数名  | 说明    | 是否必填 | 示例值 |
|--------|---------|---------|--------|
| gameId | 游戏ID  | 是      | 3      |

### 请求体参数

| 参数名 | 说明         | 是否必填 | 示例值 | 备注 |
|-------|--------------|---------|--------|------|
| propId | 属性ID | 是 | 1 | score_name表中的ID |
| rank | 返回排名数量 | 否 | 10 | 默认值为10 |
| startTime | 开始时间 | 否 | `2025-01-01T00:00:00Z` | ISO格式或时间戳 |
| endTime | 结束时间 | 否 | `2025-01-21T00:00:00Z` | ISO格式或时间戳 |

### 请求示例

```bash
curl -X POST 'https://tcsc8wckk4kgwk000kkkoswg.whyindian.site/scores/rank/3' \
-H 'Content-Type: application/json' \
-d '{
  "propId": 1,
  "rank": 10,
  "startTime": "2025-01-01T00:00:00Z",
  "endTime": "2025-01-21T00:00:00Z"
}'
```

### 返回示例

```json
{
  "code": 200,
  "err": "",
  "data": [
    {
      "address": "0x897575",
      "quantity": 40,
      "propId": 1,
      "propName": "Score"
    }
  ]
}

```

## 3. 查询用户成就完成状态

### 接口地址
```
POST /achievements/check
```

### 请求参数

| 参数名 | 说明 | 是否必填 | 示例值 |
|--------|------|---------|--------|
| address | 钱包地址 | 是 | 0xA34357486224151dDfDB291E13194995c22Df505 |
| achievementId | 成就ID | 是 | 1 |

### 请求示例

```bash
curl -X POST 'https://tcsc8wckk4kgwk000kkkoswg.whyindian.site/achievements/check' \
-H 'Content-Type: application/json' \
-d '{
  "address": "0xA34357486224151dDfDB291E13194995c22Df505",
  "achievementId": 1
}'
```

### 返回示例

```json
{
  "code": 200,
  "err": "",
  "data": true  // true表示已完成，false表示未完成
}