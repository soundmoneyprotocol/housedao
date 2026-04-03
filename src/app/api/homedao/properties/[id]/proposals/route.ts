export const dynamic = 'force-dynamic';

const mockProposals: Record<string, any[]> = {
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [
    {
      id: '1',
      title: 'Approve dividend distribution of $150,000',
      description: 'Q4 earnings distribution to all shareholders',
      status: 'active',
      forVotes: 3200,
      againstVotes: 800,
      deadline: '2026-04-20',
    },
  ],
  '6': [
    {
      id: '1',
      title: 'Upgrade recording equipment',
      description: 'Install new Pro Tools suite and microphone array',
      status: 'active',
      forVotes: 4500,
      againstVotes: 1000,
      deadline: '2026-04-25',
    },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const proposals = mockProposals[id] || [];
  return Response.json({ proposals });
}
