export const dynamic = 'force-dynamic';

// In-memory storage for messages (in production, this would be a database)
const messages: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.senderEmail || !body.message) {
      return Response.json(
        { error: 'Missing required fields: senderEmail, message' },
        { status: 400 }
      );
    }

    // Create message object
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      senderName: body.senderName || 'Anonymous',
      senderEmail: body.senderEmail,
      senderPhone: body.senderPhone || '',
      message: body.message,
      bookingType: body.bookingType,
      bookingDate: body.bookingDate,
      createdAt: new Date().toISOString(),
      status: 'new', // new, read, replied
    };

    // Store message
    messages.push(newMessage);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send email notification to venue owner
    // 3. Add to CRM dashboard
    console.log('New message from venue inquiry:', newMessage);

    return Response.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Get all messages (for admin/CRM dashboard)
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');
  const status = searchParams.get('status');

  let filtered = messages;

  if (propertyId) {
    filtered = filtered.filter((m) => m.propertyId === propertyId);
  }

  if (status) {
    filtered = filtered.filter((m) => m.status === status);
  }

  return Response.json({ messages: filtered });
}
