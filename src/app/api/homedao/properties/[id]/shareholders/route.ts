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
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
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
      shares: 200,
      percentage: 16.7,
      earnings: 10800,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 150,
      percentage: 12.5,
      earnings: 8100,
    },
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
      shares: 100,
      percentage: 8.3,
      earnings: 5400,
    },
  ],
  '3': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 150,
      percentage: 25.0,
      earnings: 11250,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 120,
      percentage: 20.0,
      earnings: 9000,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 100,
      percentage: 16.7,
      earnings: 7500,
    },
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
      shares: 80,
      percentage: 13.3,
      earnings: 6000,
    },
  ],
  '4': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 200,
      percentage: 30.8,
      earnings: 4800,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 150,
      percentage: 23.1,
      earnings: 3600,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 100,
      percentage: 15.4,
      earnings: 2400,
    },
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
      shares: 75,
      percentage: 11.5,
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
      shares: 400,
      percentage: 7.6,
      earnings: 60000,
    },
    {
      address: '0xcafecafecafecafecafecafecafecafecafecafe',
      shares: 200,
      percentage: 3.8,
      earnings: 30000,
    },
  ],
  '6': [
    {
      address: '0x1234567890123456789012345678901234567890',
      shares: 1200,
      percentage: 21.8,
      earnings: 190800,
    },
    {
      address: '0x0987654321098765432109876543210987654321',
      shares: 1000,
      percentage: 18.2,
      earnings: 159000,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      shares: 800,
      percentage: 14.5,
      earnings: 127200,
    },
    {
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
      shares: 500,
      percentage: 9.1,
      earnings: 79500,
    },
    {
      address: '0xcafecafecafecafecafecafecafecafecafecafe',
      shares: 200,
      percentage: 3.6,
      earnings: 31800,
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
