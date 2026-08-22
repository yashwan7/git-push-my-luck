import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, relationship, contactMethod, contactValue, avatarColor } = body;

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      const updateData: any = {};
      if (name) updateData.name = name.trim();
      if (relationship) updateData.relationship = relationship.trim();
      if (contactMethod) updateData.contact_method = contactMethod;
      if (contactValue) updateData.contact_value = contactValue.trim();
      if (avatarColor) updateData.avatar_color = avatarColor;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('trusted_contacts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ contact: data });
      }
    }

    return NextResponse.json({
      contact: {
        id,
        name,
        relationship,
        contactMethod,
        contactValue,
        avatarColor,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error updating trusted contact:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update trusted contact.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('Error deleting trusted contact:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete contact.' },
      { status: 500 }
    );
  }
}
