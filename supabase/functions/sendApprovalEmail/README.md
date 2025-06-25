# sendApprovalEmail Edge Function

This function sends an email to the contractor and manager when a change notification is approved or rejected.

## Setup

1. **Environment Variables**
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: The email address to send from (must be verified in Resend)

2. **Deploy the Function**
   ```sh
   supabase functions deploy sendApprovalEmail
   ```

3. **Create the Trigger**
   In your Supabase SQL editor, run:
   ```sql
   create or replace function public.trigger_send_approval_email()
   returns trigger as $$
   begin
     if new.status in ('applied', 'rejected') then
       perform net.http_post(
         'http://localhost:54321/functions/v1/sendApprovalEmail',
         json_build_object('record', row_to_json(new))::text,
         'application/json'
       );
     end if;
     return new;
   end;
   $$ language plpgsql;

   drop trigger if exists send_approval_email on change_notifications;
   create trigger send_approval_email
     after update on change_notifications
     for each row execute procedure public.trigger_send_approval_email();
   ```

4. **Resend API**
   - Sign up at https://resend.com/
   - Get your API key and verify your sending domain/email.

## Example Event

The function expects a payload like:
```json
{
  "record": {
    "id": "...",
    "status": "applied",
    "contractor_email": "contractor@example.com",
    "manager_email": "manager@example.com",
    "notes": "..."
  }
}
``` 