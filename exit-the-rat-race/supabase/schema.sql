-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Sessions
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES public.users(id),
  mode TEXT NOT NULL CHECK (mode IN ('single', 'competitive', 'cooperative', 'mentor')),
  status TEXT NOT NULL CHECK (status IN ('waiting', 'active', 'paused', 'completed')),
  current_round INTEGER DEFAULT 1,
  max_rounds INTEGER DEFAULT 55,
  market_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Player Sessions (Players in a game)
CREATE TABLE public.player_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  player_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores the full Player object
  is_retired BOOLEAN DEFAULT FALSE,
  retirement_age INTEGER,
  final_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Events Log
CREATE TABLE public.game_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_game_sessions_status ON public.game_sessions(status);
CREATE INDEX idx_player_sessions_user ON public.player_sessions(user_id);
CREATE INDEX idx_player_sessions_session ON public.player_sessions(session_id);
CREATE INDEX idx_game_events_session ON public.game_events(session_id);

-- RLS Policies (Basic)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone for now (simplify for MVP)
CREATE POLICY "Allow public read access" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.player_sessions FOR SELECT USING (true);

-- Allow authenticated users to insert/update their own data
CREATE POLICY "Allow auth insert" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = host_id);
