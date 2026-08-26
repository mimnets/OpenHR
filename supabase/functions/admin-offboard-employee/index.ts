// OpenHRApp — Admin Offboard / Reactivate Employee Edge Function
// Requires ADMIN / HR / SUPER_ADMIN caller.
// Sets profiles.status to 'INACTIVE' (offboard) or 'ACTIVE' (reactivate).
// INACTIVE accounts are blocked from logging in by auth.service.ts.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type OffboardAction = 'offboard' | 'reactivate';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonError(405, 'Method not allowed');
  }

  try {
    // Verify caller JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonError(401, 'Missing Authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const anonClient = createClient(
      supabaseUrl,
      anonKey,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user: caller }, error: authErr } = await anonClient.auth.getUser();
    if (authErr || !caller) return jsonError(401, 'Invalid token');

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch caller's profile to verify role + org
    const { data: callerProfile, error: profileErr } = await adminClient
      .from('profiles')
      .select('role, organization_id')
      .eq('id', caller.id)
      .single();

    if (profileErr || !callerProfile) return jsonError(403, 'Caller profile not found');
    if (!['ADMIN', 'HR', 'SUPER_ADMIN'].includes(callerProfile.role)) {
      return jsonError(403, 'Only ADMIN or HR can offboard employees');
    }

    const body = await req.json().catch(() => ({}));
    const userId = body?.userId?.toString()?.trim() ?? '';
    const action: OffboardAction = body?.action === 'reactivate' ? 'reactivate' : 'offboard';

    if (!userId) return jsonError(400, 'Missing required field: userId');

    // Prevent self-offboarding
    if (userId === caller.id) {
      return jsonError(400, 'You cannot offboard your own account');
    }

    // Resolve target profile and enforce same-org (super admins bypass).
    const { data: targetProfile, error: targetErr } = await adminClient
      .from('profiles')
      .select('organization_id, role')
      .eq('id', userId)
      .single();

    if (targetErr || !targetProfile) return jsonError(404, 'Employee not found');

    if (callerProfile.role !== 'SUPER_ADMIN' &&
        targetProfile.organization_id !== callerProfile.organization_id) {
      return jsonError(403, 'Cannot offboard an employee from another organization');
    }

    // Prevent offboarding the last admin
    if (action === 'offboard' && targetProfile.role === 'ADMIN' && targetProfile.organization_id) {
      const { count, error: countErr } = await adminClient
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', targetProfile.organization_id)
        .eq('role', 'ADMIN')
        .eq('status', 'ACTIVE');

      if (!countErr && count !== null && count <= 1) {
        return jsonError(400, 'Cannot offboard the last active admin. Promote another user to ADMIN first.');
      }
    }

    const newStatus = action === 'reactivate' ? 'ACTIVE' : 'INACTIVE';

    const { error: updateErr } = await adminClient
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);

    if (updateErr) {
      console.error('[ADMIN-OFFBOARD-EMPLOYEE] Failed to update status:', updateErr);
      return jsonError(400, 'Failed to update employee status: ' + updateErr.message);
    }

    const label = action === 'reactivate' ? 'reactivated' : 'offboarded';

    return new Response(
      JSON.stringify({ success: true, userId, status: newStatus, message: `Employee ${label} successfully` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[ADMIN-OFFBOARD-EMPLOYEE]', msg);
    return jsonError(500, msg);
  }
});

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
