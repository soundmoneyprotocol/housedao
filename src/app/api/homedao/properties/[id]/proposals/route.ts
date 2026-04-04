export const dynamic = 'force-dynamic';

const mockProposals: Record<string, any[]> = {
  '1': [
    {
      id: '1',
      title: 'Approve quarterly dividend distribution',
      description: 'Distribute Q1 2026 earnings of $50,000 to all shareholders',
      status: 'active',
      forVotes: 450,
      againstVotes: 100,
      deadline: '2026-04-30',
    },
    {
      id: '2',
      title: 'Approve building renovations',
      description: 'Allocate $150,000 for kitchen and bathroom upgrades',
      status: 'active',
      forVotes: 380,
      againstVotes: 170,
      deadline: '2026-05-15',
    },
  ],
  '2': [
    {
      id: '1',
      title: 'Approve Q1 dividend payout',
      description: 'Distribute $65,000 earned in Q1 2026',
      status: 'active',
      forVotes: 680,
      againstVotes: 220,
      deadline: '2026-04-25',
    },
    {
      id: '2',
      title: 'Upgrade studio equipment',
      description: 'Purchase new mixing console and recording gear - $120,000',
      status: 'active',
      forVotes: 600,
      againstVotes: 300,
      deadline: '2026-05-10',
    },
  ],
  '3': [
    {
      id: '1',
      title: 'Approve dividend distribution',
      description: 'Distribute Q1 2026 earnings of $42,000 to shareholders',
      status: 'active',
      forVotes: 280,
      againstVotes: 70,
      deadline: '2026-04-28',
    },
    {
      id: '2',
      title: 'Approve new equipment purchase',
      description: 'Install new analog recording equipment - $85,000',
      status: 'pending',
      forVotes: 0,
      againstVotes: 0,
      deadline: '2026-05-05',
    },
  ],
  '4': [
    {
      id: '1',
      title: 'Quarterly dividend distribution',
      description: 'Distribute Q1 2026 earnings of $38,000',
      status: 'active',
      forVotes: 420,
      againstVotes: 80,
      deadline: '2026-04-22',
    },
  ],
  '5': [
    {
      id: '1',
      title: 'Approve dividend distribution of $750,000',
      description: 'Q4 earnings distribution to all shareholders',
      status: 'active',
      forVotes: 3200,
      againstVotes: 800,
      deadline: '2026-04-20',
    },
    {
      id: '2',
      title: 'Approve penthouse renovation project',
      description: 'Allocate $500,000 for comprehensive renovations',
      status: 'active',
      forVotes: 2800,
      againstVotes: 1200,
      deadline: '2026-05-01',
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
    {
      id: '2',
      title: 'Approve Q1 dividend of $875,000',
      description: 'Distribute Q1 2026 earnings to all shareholders',
      status: 'active',
      forVotes: 5200,
      againstVotes: 300,
      deadline: '2026-04-30',
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
