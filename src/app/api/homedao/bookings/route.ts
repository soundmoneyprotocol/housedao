export const dynamic = 'force-dynamic';

// In-memory storage for bookings with initial mock data
const bookings: Map<string, any> = new Map([
  ['booking_mock_001', {
    id: 'booking_mock_001',
    propertyId: '3',
    propertyName: 'Miami Recording Studio',
    bookingType: 'daily',
    startDate: '2026-04-10',
    startTime: '09:00',
    duration: 2,
    durationUnit: 'days',
    totalPrice: 3000,
    vvsMembership: false,
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (305) 555-0101',
    bookingStatus: 'confirmed',
    createdAt: '2026-04-02T10:30:00Z',
    updatedAt: '2026-04-02T10:30:00Z',
  }],
  ['booking_mock_002', {
    id: 'booking_mock_002',
    propertyId: '5',
    propertyName: 'Billionaires Row NYC',
    bookingType: 'hourly',
    startDate: '2026-04-15',
    startTime: '14:00',
    duration: 4,
    durationUnit: 'hours',
    totalPrice: 3000,
    vvsMembership: true,
    name: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '+1 (212) 555-0202',
    bookingStatus: 'confirmed',
    createdAt: '2026-04-01T15:45:00Z',
    updatedAt: '2026-04-01T15:45:00Z',
  }],
  ['booking_mock_003', {
    id: 'booking_mock_003',
    propertyId: '2',
    propertyName: 'Artist House LA',
    bookingType: 'daily',
    startDate: '2026-04-12',
    startTime: '00:00',
    duration: 1,
    durationUnit: 'days',
    totalPrice: 1800,
    vvsMembership: false,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (213) 555-0303',
    bookingStatus: 'pending_payment',
    createdAt: '2026-03-30T08:15:00Z',
    updatedAt: '2026-03-30T08:15:00Z',
  }],
  ['booking_mock_004', {
    id: 'booking_mock_004',
    propertyId: '6',
    propertyName: 'Billionaires Row London',
    bookingType: 'daily',
    startDate: '2026-04-20',
    startTime: '00:00',
    duration: 3,
    durationUnit: 'days',
    totalPrice: 7500,
    vvsMembership: true,
    name: 'Sophie Laurent',
    email: 'sophie@example.com',
    phone: '+44 (20) 7946 0958',
    bookingStatus: 'confirmed',
    createdAt: '2026-03-28T16:20:00Z',
    updatedAt: '2026-03-28T16:20:00Z',
  }],
  ['booking_mock_005', {
    id: 'booking_mock_005',
    propertyId: '4',
    propertyName: 'Nashville Music Venue',
    bookingType: 'hourly',
    startDate: '2026-04-18',
    startTime: '18:00',
    duration: 6,
    durationUnit: 'hours',
    totalPrice: 2100,
    vvsMembership: false,
    name: 'Marcus Davis',
    email: 'marcus@example.com',
    phone: '+1 (615) 555-0404',
    bookingStatus: 'confirmed',
    createdAt: '2026-03-25T12:00:00Z',
    updatedAt: '2026-03-25T12:00:00Z',
  }],
  ['booking_mock_006', {
    id: 'booking_mock_006',
    propertyId: '1',
    propertyName: 'Brooklyn Loft',
    bookingType: 'daily',
    startDate: '2026-04-22',
    startTime: '00:00',
    duration: 2,
    durationUnit: 'days',
    totalPrice: 2400,
    vvsMembership: true,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (718) 555-0505',
    bookingStatus: 'confirmed',
    createdAt: '2026-03-20T09:30:00Z',
    updatedAt: '2026-03-20T09:30:00Z',
  }],
]);

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
      vvsMembership: body.vvsMembership || false,
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
    console.log('Booking Created:', {
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
