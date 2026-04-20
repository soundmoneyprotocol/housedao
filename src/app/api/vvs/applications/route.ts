import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('vvs_applications')
      .insert([
        {
          full_name: body.fullName,
          email: body.email,
          whatsapp: body.whatsapp,
          instagram: body.instagram || null,
          experience_type: body.experienceType,
          group_size: body.groupSize,
          goals: body.goals,
          budget_range: body.budgetRange,
          dates: body.dates,
          intent_level: body.intentLevel,
          luxury_experience: body.luxuryExperience,
          exceptional_wish: body.exceptionalWish,
          additional_info: body.additionalInfo,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    // Return success with application ID
    return NextResponse.json(
      {
        success: true,
        applicationId: data?.[0]?.id,
        message: 'Application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
