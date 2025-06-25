# generateDailyEntries Edge Function

This function triggers daily entry generation and summary refresh for a pay period.

## HTTP Endpoint

POST /functions/v1/generateDailyEntries

### Headers
- Authorization: Bearer <service-role-key>
- Content-Type: application/json

### Body
```
{
  "pay_period_id": "<uuid>"
}
```

### Example (curl)

```
curl -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pay_period_id": "00000000-0000-0000-0000-000000000000"}' \
  https://<your-project-id>.supabase.co/functions/v1/generateDailyEntries
```

## Deploy

```
supabase functions deploy generateDailyEntries
``` 