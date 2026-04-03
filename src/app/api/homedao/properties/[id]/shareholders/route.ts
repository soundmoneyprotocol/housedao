export const dynamic = 'force-dynamic';

const mockShareholders: Record<string, any[]> = {
  '1': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 200,
      percentage: 22.2,
      earnings: 15000,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 150,
      percentage: 16.7,
      earnings: 11250,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 100,
      percentage: 11.1,
      earnings: 7500,
    },
  ],
  '2': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 250,
      percentage: 20.8,
      earnings: 13500,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 70,
      percentage: 5.8,
      earnings: 3780,
    },
  ],
  '3': [],
  '4': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 75,
      percentage: 50,
      earnings: 1800,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 75,
      percentage: 50,
      earnings: 1800,
    },
  ],
  '5': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 800,
      percentage: 15.2,
      earnings: 120000,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 600,
      percentage: 11.4,
      earnings: 90000,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 500,
      percentage: 9.5,
      earnings: 75000,
    },
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
      shares: 200,
      percentage: 3.8,
      earnings: 30000,
    },
  ],
  '6': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 1000,
      percentage: 18.2,
      earnings: 159000,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 800,
      percentage: 14.5,
      earnings: 127200,
    },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shareholders = mockShareholders[id] || [];
  return Response.json({ shareholders });
}
