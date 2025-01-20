# Score API Documentation

## Get Scores API

Endpoint for retrieving game scores with flexible filtering options.

### Endpoint

```
GET /scores
```

### Query Parameters

| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| startTime  | string | No       | Filter scores after this time. Accepts two formats: ISO 8601 date string or Unix timestamp in milliseconds |
| endTime    | string | No       | Filter scores before this time. Accepts two formats: ISO 8601 date string or Unix timestamp in milliseconds |
| gameId     | number | No       | Filter scores by specific game ID |
| accountId  | number | No       | Filter scores by specific account ID |
| limit      | number | No       | Limit the number of returned results |
| offset     | number | No       | Number of results to skip for pagination |

### Time Format Support

The API supports two time formats for `startTime` and `endTime`:

1. **ISO 8601 Date String**
   - Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
   - Example: `2025-01-20T05:25:00.000Z`

2. **Unix Timestamp (milliseconds)**
   - Format: Number as string
   - Example: `1737349200000`

### Example Requests

1. Using ISO date format:
```
GET http://localhost:3000/scores?startTime=2025-01-20T05:25:00.000Z
```

2. Using timestamp format:
```
GET http://localhost:3000/scores?startTime=1737349200000
```

3. Using multiple filters:
```
GET http://localhost:3000/scores?startTime=2025-01-20T05:25:00.000Z&gameId=3&limit=10
```

### Response Format

```json
{
  "data": [
    {
      "id": 13,
      "score": 40,
      "gameId": 3,
      "accountId": 28,
      "createdAt": "2025-01-20T05:28:08.26159Z",
      "accountAddress": "0x897575",
      "gameName": "merge_game",
      "updatedAt": "2025-01-20T05:29:03.267581Z"
    }
  ],
  "total": 1
}
```

### Error Handling

The API will return appropriate error messages in the following cases:

1. Invalid date format:
```json
{
  "error": "Invalid startTime format"
}
```

2. Invalid timestamp:
```json
{
  "error": "Invalid date format"
}
```

### Notes

- All timestamps in responses are returned in ISO 8601 format
- The API uses UTC timezone for all date operations
- Results are ordered by updatedAt timestamp in descending order by default
- The time filter is inclusive (>=) for startTime and (<=) for endTime
