export const dynamic = 'force-dynamic';

const mockDividends: Record<string, any[]> = {
  '1': [
    {
      id: '1',
      quarter: 'Q3 2025',
      totalAmount: 50000,
      amountPerShare: 50,
      distributedAt: '2025-10-15',
    },
    {
      id: '2',
      quarter: 'Q2 2025',
      totalAmount: 45000,
      amountPerShare: 45,
      distributedAt: '2025-07-15',
    },
  ],
  '2': [
    {
      id: '1',
      quarter: 'Q3 2025',
      totalAmount: 65000,
      amountPerShare: 54,
      distributedAt: '2025-10-15',
    },
  ],
  '3': [],
  '4': [
    {
      id: '1',
      quarter: 'Q3 2025',
      totalAmount: 38000,
      amountPerShare: 48,
      distributedAt: '2025-10-15',
    },
  ],
  '5': [
    {
      id: '1',
      quarter: 'Q4 2025',
      totalAmount: 750000,
      amountPerShare: 150,
      distributedAt: '2026-01-15',
    },
    {
      id: '2',
      quarter: 'Q3 2025',
      totalAmount: 625000,
      amountPerShare: 125,
      distributedAt: '2025-10-15',
    },
  ],
  '6': [
    {
      id: '1',
      quarter: 'Q4 2025',
      totalAmount: 875000,
      amountPerShare: 159,
      distributedAt: '2026-01-15',
    },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dividends = mockDividends[id] || [];
  return Response.json({ dividends });
}
