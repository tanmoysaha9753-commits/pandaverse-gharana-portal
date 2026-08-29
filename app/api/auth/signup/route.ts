import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      full_name,
      phone,
      shop_name,
      shop_type,
      village_town,
      district,
      state,
      country,
      years_in_business,
      introduction,
    } = body;

    if (!email || !password || !full_name || !shop_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use a service-role-style admin client for the signup flow.
    // We still only use it to (1) create the auth user and
    // (2) read/write the profile + partner rows. RLS still applies
    // to all browser sessions.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role: 'partner' },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'Signup failed' },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Step 2: Wait briefly for any database trigger to fire
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Step 3: Ensure a profile row exists (insert as fallback if trigger didn't run)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          full_name,
          email,
          phone: phone || null,
          role: 'partner',
        });
      if (profileError) {
        return NextResponse.json(
          { error: 'Could not create profile: ' + profileError.message },
          { status: 500 }
        );
      }
    }

    // Step 4: Ensure a partner row exists (insert as fallback if trigger didn't run)
    const { data: existingPartner } = await supabaseAdmin
      .from('partners')
      .select('id')
      .eq('profile_id', userId)
      .maybeSingle();

    if (!existingPartner) {
      const { error: partnerError } = await supabaseAdmin
        .from('partners')
        .insert({
          profile_id: userId,
          shop_name,
          shop_type: shop_type || null,
          village_town: village_town || null,
          district: district || null,
          state: state || null,
          country: country || 'India',
          years_in_business: years_in_business ? parseInt(years_in_business) : 0,
          introduction: introduction || null,
        });
      if (partnerError) {
        return NextResponse.json(
          { error: 'Could not create partner record: ' + partnerError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (err as Error).message },
      { status: 500 }
    );
  }
}
