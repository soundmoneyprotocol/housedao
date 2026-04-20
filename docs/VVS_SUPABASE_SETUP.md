# VVS Flawless Supabase Setup

This document outlines the Supabase configuration needed for the VVS Flawless landing page and application system.

## Table: vvs_applications

Create this table in Supabase to store VVS experience applications.

### SQL

```sql
-- Create vvs_applications table
CREATE TABLE vvs_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  
  -- Experience Preferences
  experience_type TEXT NOT NULL CHECK (experience_type IN ('wellness', 'buyout', 'founder-house')),
  group_size TEXT NOT NULL CHECK (group_size IN ('solo', '2-3', '4-5', '6-8', '9+')),
  goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Budget & Timeline
  budget_range TEXT NOT NULL CHECK (budget_range IN ('<2.5k', '2.5-5k', '5-7k', '7k+')),
  dates TEXT NOT NULL CHECK (dates IN ('asap', '1-3-months', '3-6-months', 'flexible')),
  intent_level TEXT NOT NULL CHECK (intent_level IN ('exploring', 'considering', 'ready')),
  
  -- Quality Indicators
  luxury_experience BOOLEAN DEFAULT false,
  exceptional_wish TEXT,
  additional_info TEXT,
  
  -- Admin Fields
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'whatsapp', 'deposit', 'booked', 'declined')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  tier TEXT DEFAULT '🔴' CHECK (tier IN ('🟢', '🟡', '🔴')),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  contacted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for faster queries
CREATE INDEX idx_vvs_applications_email ON vvs_applications(email);
CREATE INDEX idx_vvs_applications_status ON vvs_applications(status);
CREATE INDEX idx_vvs_applications_score ON vvs_applications(score DESC);
CREATE INDEX idx_vvs_applications_created_at ON vvs_applications(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vvs_applications_updated_at
BEFORE UPDATE ON vvs_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Authentication & Security

### Row Level Security (RLS)

Enable RLS for the table and add policies:

```sql
-- Enable RLS
ALTER TABLE vvs_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public application submission)
CREATE POLICY "Public can insert applications"
  ON vvs_applications
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view own applications (optional - for future portal)
CREATE POLICY "Users can view own applications"
  ON vvs_applications
  FOR SELECT
  USING (auth.uid()::text = email);  -- Match by email for now

-- Admin panel access (if needed later)
-- CREATE POLICY "Admins can view all applications"
--   ON vvs_applications
--   FOR SELECT
--   USING (auth.role() = 'admin');
```

## Viewing Applications

### In Supabase Dashboard

Navigate to **SQL Editor** and run:

```sql
-- View all applications
SELECT 
  id,
  full_name,
  email,
  experience_type,
  budget_range,
  score,
  tier,
  status,
  created_at
FROM vvs_applications
ORDER BY created_at DESC;

-- View high-priority applications
SELECT 
  id,
  full_name,
  email,
  whatsapp,
  experience_type,
  group_size,
  budget_range,
  dates,
  score,
  created_at
FROM vvs_applications
WHERE score >= 80 AND status = 'new'
ORDER BY score DESC;

-- View by status
SELECT 
  status,
  COUNT(*) as count,
  AVG(score) as avg_score
FROM vvs_applications
GROUP BY status;
```

## Application Scoring

Auto-calculate scores using a database function:

```sql
-- Function to calculate application score
CREATE OR REPLACE FUNCTION calculate_vvs_score(
  p_budget_range TEXT,
  p_dates TEXT,
  p_group_size TEXT,
  p_experience_type TEXT,
  p_intent_level TEXT
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
BEGIN
  -- Budget (30 points)
  v_score := v_score + CASE 
    WHEN p_budget_range = '7k+' THEN 30
    WHEN p_budget_range = '5-7k' THEN 25
    WHEN p_budget_range = '2.5-5k' THEN 15
    WHEN p_budget_range = '<2.5k' THEN 5
    ELSE 0
  END;
  
  -- Urgency (15 points)
  v_score := v_score + CASE 
    WHEN p_dates = 'asap' THEN 15
    WHEN p_dates = '1-3-months' THEN 10
    WHEN p_dates = '3-6-months' THEN 5
    ELSE 0
  END;
  
  -- Group Size (15 points)
  v_score := v_score + CASE 
    WHEN p_group_size = '6-8' THEN 15
    WHEN p_group_size IN ('4-5', '2-3') THEN 10
    ELSE 5
  END;
  
  -- Experience Fit (15 points)
  v_score := v_score + CASE 
    WHEN p_experience_type IN ('buyout', 'founder-house') THEN 15
    WHEN p_experience_type = 'wellness' THEN 12
    ELSE 5
  END;
  
  -- Intent Level (10 points)
  v_score := v_score + CASE 
    WHEN p_intent_level = 'ready' THEN 10
    WHEN p_intent_level = 'considering' THEN 5
    ELSE 0
  END;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

Then create a trigger to auto-calculate on insert/update:

```sql
CREATE OR REPLACE FUNCTION auto_calculate_vvs_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.score := calculate_vvs_score(
    NEW.budget_range,
    NEW.dates,
    NEW.group_size,
    NEW.experience_type,
    NEW.intent_level
  );
  
  -- Auto-set tier based on score
  NEW.tier := CASE 
    WHEN NEW.score >= 80 THEN '🟢'
    WHEN NEW.score >= 60 THEN '🟡'
    ELSE '🔴'
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_score_vvs_applications
BEFORE INSERT OR UPDATE ON vvs_applications
FOR EACH ROW
EXECUTE FUNCTION auto_calculate_vvs_score();
```

## Dashboard Views

### Create a "New Applications" view

```sql
CREATE VIEW vvs_new_applications AS
SELECT 
  id,
  full_name,
  email,
  whatsapp,
  experience_type,
  group_size,
  budget_range,
  dates,
  intent_level,
  score,
  tier,
  created_at
FROM vvs_applications
WHERE status = 'new'
ORDER BY score DESC, created_at DESC;
```

## Next Steps

1. **Copy the SQL above** into Supabase > SQL Editor
2. **Run the migration** to create the table and functions
3. **Enable Row Level Security** (RLS) if you need to protect data
4. **Test the API** by submitting a form at `/vvs`
5. **View submissions** in Supabase dashboard

## Monitoring

Check application volume and quality:

```sql
-- Daily application count
SELECT 
  DATE(created_at) as day,
  COUNT(*) as applications,
  AVG(score) as avg_score,
  COUNT(CASE WHEN tier = '🟢' THEN 1 END) as high_priority
FROM vvs_applications
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- Application quality by experience type
SELECT 
  experience_type,
  COUNT(*) as count,
  AVG(score) as avg_score,
  COUNT(CASE WHEN tier = '🟢' THEN 1 END) as high_priority_count
FROM vvs_applications
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY experience_type;
```

## Troubleshooting

### Form submissions not appearing?

1. Check Supabase connection in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

2. Verify RLS policy allows inserts:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'vvs_applications';
   ```

3. Check browser console for API errors

4. Verify the table was created:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'vvs_applications';
   ```

### Can't query applications?

Ensure RLS policies allow reads for your role:
```sql
ALTER TABLE vvs_applications DISABLE ROW LEVEL SECURITY;  -- Temporarily for testing
```

Then re-enable with proper policies after testing.

---

For more details, see the VVS Flawless briefing document.
