# Email Setup for Contact Form

Your contact form now sends emails to your Gmail instead of storing messages in the database.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Resend offers 100 free emails per day, which should be plenty for a portfolio contact form
3. Get your API key from the dashboard

### 2. Configure Supabase Environment Variables

You need to add two environment variables to your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add the following secrets:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: Your Gmail address where you want to receive messages (e.g., `yourname@gmail.com`)

### 3. Deploy the Edge Function

Run this command from your project root to deploy the function:

```bash
npx supabase functions deploy send-contact-email
```

### 4. (Optional) Verify Your Domain

For production use, you should verify your own domain in Resend:

1. Add and verify your domain in Resend dashboard
2. Update the `from` field in `supabase/functions/send-contact-email/index.ts`:
   ```typescript
   from: 'Portfolio Contact <contact@yourdomain.com>',
   ```

## Alternative: Using Gmail SMTP Directly

If you prefer to use Gmail SMTP instead of Resend:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Let me know and I can update the edge function to use Nodemailer with Gmail SMTP

## Testing

After setup, test the contact form:
1. Fill out the form on your portfolio
2. Click send
3. Check your Gmail inbox for the message

## Troubleshooting

- **No email received**: Check Supabase Edge Function logs in dashboard
- **Error sending**: Verify your RESEND_API_KEY is correct
- **Wrong recipient**: Check CONTACT_EMAIL environment variable

## Current Implementation

The contact form:
- Uses a modal/dialog for user input
- Validates word limits (name: 6 words, subject: 12 words, message: 120 words)
- Calls the `send-contact-email` Supabase Edge Function
- Shows success/error toasts to the user
- Sends formatted HTML emails to your Gmail
