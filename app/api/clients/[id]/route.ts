import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/src/lib/supabaseServer';

// GET /api/clients/[id] - Get a specific client
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    // Get client with credits and workouts (RLS will enforce access)
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        *,
        credits (
          id,
          package_name,
          total_sessions,
          used_sessions,
          price,
          purchased_at,
          expires_at,
          is_active
        ),
        workouts (
          id,
          workout_date,
          start_time,
          end_time,
          duration_minutes,
          workout_type,
          status,
          notes
        )
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (clientError) {
      if (clientError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, date_of_birth, height_cm, weight_kg, goals, notes, is_active } = body;

    const resolvedParams = await params;
    // Update client (RLS will enforce access)
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .update({
        name,
        email,
        phone,
        date_of_birth,
        height_cm,
        weight_kg,
        goals,
        notes,
        is_active
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (clientError) {
      if (clientError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    // Delete client (RLS will enforce access)
    const { error: clientError } = await supabase
      .from('clients')
      .delete()
      .eq('id', resolvedParams.id);

    if (clientError) {
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
