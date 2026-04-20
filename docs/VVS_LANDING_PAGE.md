# VVS Flawless Landing Page

Complete implementation of the VVS Flawless luxury villa experience booking landing page with Supabase form integration.

## What's New

### Pages Created

1. **`/` (Home)** → Redirects to `/vvs`
2. **`/vvs`** → Full VVS Flawless landing page with application form
3. **`/api/vvs/applications`** → API endpoint for form submissions

### Components Created

1. **`VVSApplicationForm.tsx`** → Multi-section application form
   - Section 1: Identity (name, email, WhatsApp, Instagram)
   - Section 2: Fit (experience type, group size, goals)
   - Section 3: Budget & Timeline (budget, dates, commitment level)
   - Section 4: Quality Filter (luxury experience, exceptional wish, notes)
   - Success page after submission

## Landing Page Structure

The `/vvs` page includes all sections from the briefing:

```
1. Navigation (sticky header)
2. Hero Section ("A Private Oceanfront Villa Experience")
3. Positioning ("This isn't a hotel. This isn't an Airbnb.")
4. What's Included (checklist + property overview)
5. Experience Types (3 packages with pricing)
6. Social Proof (testimonials)
7. Scarcity & Urgency ("Only 2–3 spots available")
8. Pricing Frame ("Investment, not expense")
9. Who It's For / Not For (hard filter)
10. Application Form (with success page)
11. FAQ (6 common questions)
12. Footer CTA
13. Footer
```

## Getting Started

### 1. Set up Supabase Table

See `VVS_SUPABASE_SETUP.md` for detailed instructions. Quick version:

```bash
# Copy the SQL from VVS_SUPABASE_SETUP.md
# Go to Supabase Dashboard > SQL Editor
# Paste and run the migration
```

### 2. Verify Environment Variables

Ensure these are in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Form

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/vvs
# Fill out form and submit
```

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Home (redirects to /vvs)
│   ├── vvs/
│   │   └── page.tsx                      # VVS landing page (complete)
│   └── api/
│       └── vvs/
│           └── applications/
│               └── route.ts              # API endpoint (POST)
│
├── components/
│   └── VVSApplicationForm.tsx            # Application form component
│
└── lib/
    └── supabase.ts                       # Supabase client (already exists)

docs/
├── VVS_SUPABASE_SETUP.md                 # Database setup guide
└── VVS_LANDING_PAGE.md                   # This file
```

## Application Form Fields

### Section 1: Identity

- **Full Name** (required) — Text input
- **Email** (required) — Email input
- **WhatsApp** (required) — Phone input
- **Instagram / LinkedIn** (optional) — Text input

### Section 2: Fit

- **Experience Type** (required) — Dropdown (Wellness, Buyout, Founder House)
- **Group Size** (required) — Dropdown (Solo, 2-3, 4-5, 6-8, 9+)
- **Goals** (optional) — Checkboxes (Rest & Recovery, Learning, Team Bonding, etc.)

### Section 3: Budget & Timeline

- **Budget per person** (required) — Dropdown (<$2.5K, $2.5-5K, $5-7K, $7K+)
- **When are you thinking?** (required) — Dropdown (ASAP, 1-3 months, 3-6 months, Flexible)
- **How committed?** (required) — Dropdown (Exploring, Considering, Ready)

### Section 4: Quality Filter

- **Luxury experience** (optional) — Checkbox
- **What would make this exceptional?** (optional) — Textarea
- **Anything else we should know?** (optional) — Textarea

## Lead Scoring

Applications are scored automatically (0-100 points):

- **Budget** (30 points): $7K+ = 30, $5-7K = 25, $2.5-5K = 15, <$2.5K = 5
- **Urgency** (15 points): ASAP = 15, 1-3 months = 10, 3-6 months = 5, Flexible = 0
- **Group Size** (15 points): 6-8 = 15, 4-5 = 10, 2-3 = 10, Solo = 5, 9+ = 5
- **Experience Fit** (15 points): Buyout/Founder House = 15, Wellness = 12
- **Intent Level** (10 points): Ready = 10, Considering = 5, Exploring = 0
- **Luxury Exp** (10 points): Yes = 10, No = 0
- **Intent Quality** (5 points): Clear/specific = 5, Vague = 0

**Tiers**:
- 🟢 **High Priority** (≥80): Immediate WhatsApp
- 🟡 **Warm** (60-79): Email nurture → WhatsApp
- 🔴 **Off-Peak** (<60): Graceful decline

## API Endpoint

### POST `/api/vvs/applications`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1 (555) 000-0000",
  "instagram": "@johndoe",
  "experienceType": "wellness",
  "groupSize": "6-8",
  "goals": ["Rest & Recovery", "Wellness & Health"],
  "budgetRange": "7k+",
  "dates": "asap",
  "intentLevel": "ready",
  "luxuryExperience": true,
  "exceptionalWish": "Looking for a deep reset...",
  "additionalInfo": "Prefer wellness focus..."
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "applicationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Application submitted successfully"
}
```

**Response (Error - 400/500)**:
```json
{
  "error": "Error message describing the issue"
}
```

## Customizing the Page

### Update Testimonials

Edit `testimonials` array in `/vvs/page.tsx`:

```tsx
const testimonials = [
  {
    quote: 'Your quote here',
    author: 'Name, Title',
    background: 'from-amber-500 to-orange-500',
  },
  // ... more
];
```

### Update Experience Types

Edit `experienceTypes` array:

```tsx
const experienceTypes = [
  {
    icon: '🧘',
    title: 'Wellness Retreat',
    description: '5–6 days...',
    price: '$3,500/person',
    // ... etc
  },
];
```

### Update Pricing

Edit the pricing frame section:

```tsx
<p className="text-6xl font-bold text-amber-600 mb-4">$2,500–$7,000+</p>
```

### Update Colors

The page uses Tailwind color classes:
- Primary: `amber-500`, `amber-600`, `amber-50`
- Secondary: `orange-500`, `orange-50`

To change theme, find and replace these classes throughout the files.

## Testing Checklist

- [ ] Form validation works (try submitting empty)
- [ ] All required fields are enforced
- [ ] Form submission succeeds and shows success page
- [ ] Data appears in Supabase dashboard
- [ ] Lead scoring calculates correctly
- [ ] Navigation links work
- [ ] Mobile responsiveness is good
- [ ] Form fields are accessible

## Monitoring Applications

### View all applications (Supabase SQL)

```sql
SELECT 
  full_name,
  email,
  experience_type,
  budget_range,
  score,
  tier,
  created_at
FROM vvs_applications
ORDER BY created_at DESC;
```

### View by tier

```sql
SELECT * FROM vvs_applications WHERE tier = '🟢' AND status = 'new';
```

### Track submission volume

```sql
SELECT 
  DATE(created_at) as day,
  COUNT(*) as count,
  AVG(score) as avg_score
FROM vvs_applications
GROUP BY DATE(created_at);
```

## Next Steps

1. **Set up Supabase table** using SQL from `VVS_SUPABASE_SETUP.md`
2. **Test form submission** at `http://localhost:3000/vvs`
3. **View submissions** in Supabase dashboard
4. **Integrate with Typeform** (optional) for more advanced forms
5. **Set up email notifications** for new high-priority applications
6. **Create admin dashboard** for viewing and managing applications
7. **Build out Notion integration** to sync applications to Notion database

## Troubleshooting

### Form submissions failing?

1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Ensure `vvs_applications` table exists
4. Check RLS policies allow inserts

### Form not showing?

1. Verify route is `/vvs` in browser
2. Check for TypeScript/build errors: `npm run build`
3. Clear Next.js cache: `rm -rf .next`

### Styling issues?

1. Verify Tailwind is configured correctly
2. Check that `lucide-react` is installed: `npm list lucide-react`
3. Rebuild: `npm run dev`

## Dependencies

- `react-hot-toast` — Toast notifications ✅
- `lucide-react` — Icons ✅
- `@supabase/supabase-js` — Supabase client ✅

All already in `package.json`.

## Support & References

- **VVS Briefing**: See `/soundmoney/HouseDAO/docs/` for full briefing
- **Supabase Setup**: `VVS_SUPABASE_SETUP.md`
- **Paperclip Agent**: See `/soundmoney/paperclip/.agents/companies/vvs-flawless/`

---

Last updated: April 20, 2026
