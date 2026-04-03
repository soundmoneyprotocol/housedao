export const dynamic = 'force-dynamic';

// In-memory storage for bookings (in production, use a database)
const bookings: Map<string, any> = new Map();

export async function GET(request: Request) {
  try {
    // Return all bookings for the CRM dashboard
    const allBookings = Array.from(bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return Response.json({ bookings: allBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.propertyId ||
      !body.startDate ||
      !body.duration ||
      !body.totalPrice ||
      !body.name ||
      !body.email ||
      !body.phone
    ) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create booking object
    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      bookingType: body.bookingType,
      startDate: body.startDate,
      startTime: body.startTime || '09:00',
      duration: body.duration,
      durationUnit: body.durationUnit || 'hours',
      totalPrice: body.totalPrice,
      name: body.name,
      email: body.email,
      phone: body.phone,
      bookingStatus: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store booking
    bookings.set(booking.id, booking);

    // Log for CRM
    console.log('📅 New Booking Created:', {
      id: booking.id,
      property: booking.propertyName,
      date: booking.startDate,
      customer: booking.name,
      email: booking.email,
      amount: booking.totalPrice,
    });

    return Response.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
