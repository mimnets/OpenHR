
# OpenHR Supabase Setup Playbook

This document details the configuration and operational steps required to use Supabase as your backend.

## Phase 1: Database Initialization
Run the following SQL in your **Supabase SQL Editor** to create the required tables.

```sql
-- [Existing SQL Tables omitted for brevity, see previous versions]
```

## Phase 2: Schema Repair
Run this if you get "Column Not Found" errors.
```sql
-- [Existing SQL Repair omitted for brevity]
```

## Phase 3: Row Level Security (RLS)
```sql
-- [Existing RLS Setup omitted for brevity]
```

## Phase 4: Email Relay (Bypass CORS)
To fix "Delivery Error" or "CORS BLOCKED", you must deploy an Edge Function.

1. In your **Supabase Dashboard**, go to **Edge Functions** > **New Function**.
2. Name it `mail-relay`.
3. Go to **Settings** > **Secrets** in Supabase and add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: `your_re_api_key_here`
4. Paste the following code into the `index.ts` of your new function:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipientEmail, to, subject, body, filters, reportType } = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')
    
    const targetTo = recipientEmail || to;
    const targetSubject = subject || `[OpenHR] ${reportType || 'Notification'}`;
    const htmlContent = body || `<h2>Report: ${reportType}</h2><p>Data attached.</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'OpenHR <onboarding@resend.dev>',
        to: [targetTo],
        subject: targetSubject,
        html: htmlContent,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.status,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

5. **Copy the URL** of the function (e.g., `https://xyz.supabase.co/functions/v1/mail-relay`) and paste it into the **Relay URL** in OpenHR Settings.
