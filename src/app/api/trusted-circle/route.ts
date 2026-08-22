import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DEFAULT_TRUSTED_CONTACTS } from '@/lib/safetyData';
import { TrustedContact } from '@/types/safety';

export const dynamic = 'force-dynamic';

// In-memory fallback for resilient guest / demo mode
let guestContacts: TrustedContact[] = [...DEFAULT_TRUSTED_CONTACTS];

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || 'guest-citizen';

    // If Supabase is connected and authenticated
    if (user?.id) {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ contacts: data });
      }
    }

    // Fallback to guest contacts
    const userContacts = guestContacts.filter(c => c.userId === userId || userId === 'guest-citizen');
    return NextResponse.json({ contacts: userContacts });
  } catch (error) {
    console.error('Error fetching trusted contacts:', error);
    return NextResponse.json({ contacts: guestContacts });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, relationship, contactMethod, contactValue, avatarColor = '#1E3A2F' } = body;

    if (!name || !relationship || !contactMethod || !contactValue) {
      return NextResponse.json(
        { error: 'Name, relationship, contact method, and contact value are required.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest-citizen';

    // Enforce 1-3 contacts limit
    if (user?.id) {
      const { count } = await supabase
        .from('trusted_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count !== null && count >= 3) {
        return NextResponse.json(
          { error: 'You can add a maximum of 3 trusted contacts for focused privacy.' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert({
          user_id: user.id,
          name: name.trim(),
          relationship: relationship.trim(),
          contact_method: contactMethod,
          contact_value: contactValue.trim(),
          avatar_color: avatarColor,
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ contact: data }, { status: 201 });
      }
    }

    // Fallback in-memory
    const userContacts = guestContacts.filter(c => c.userId === userId || userId === 'guest-citizen');
    if (userContacts.length >= 3) {
      return NextResponse.json(
        { error: 'You can add a maximum of 3 trusted contacts for focused privacy.' },
        { status: 400 }
      );
    }

    const newContact: TrustedContact = {
      id: `tc-${Date.now()}`,
      userId,
      name: name.trim(),
      relationship: relationship.trim(),
      contactMethod,
      contactValue: contactValue.trim(),
      avatarColor,
      createdAt: new Date().toISOString(),
    };

    guestContacts.push(newContact);
    return NextResponse.json({ contact: newContact }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding trusted contact:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to add trusted contact.' },
      { status: 500 }
    );
  }
}
