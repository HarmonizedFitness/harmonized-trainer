-- Database Schema for Trainer Management System
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  goals TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits table
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  package_name TEXT NOT NULL,
  total_sessions INTEGER NOT NULL,
  used_sessions INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  muscle_groups TEXT[],
  equipment TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  credit_id UUID REFERENCES credits(id) ON DELETE SET NULL,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_sets table
CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER,
  reps INTEGER,
  weight DECIMAL(6,2),
  rir INTEGER, -- Reps in Reserve
  duration_seconds INTEGER,
  side TEXT, -- For unilateral exercises (left, right, both)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assigned_workouts table
CREATE TABLE IF NOT EXISTS assigned_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  template_id UUID, -- Will reference workout_templates table when created
  name TEXT,
  notes TEXT,
  due_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id);
CREATE INDEX IF NOT EXISTS idx_credits_trainer_id ON credits(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workouts_client_id ON workouts(client_id);
CREATE INDEX IF NOT EXISTS idx_workouts_trainer_id ON workouts(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workouts_credit_id ON workouts(credit_id);
CREATE INDEX IF NOT EXISTS idx_workouts_performed_at ON workouts(performed_at);
CREATE INDEX IF NOT EXISTS idx_exercises_trainer_id ON exercises(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_id ON workout_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_trainer_id ON assigned_workouts(trainer_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_client_id ON assigned_workouts(client_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_status ON assigned_workouts(status);

-- Enable RLS on all tables
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_workouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trainers table
-- Trainers can only access their own profile
CREATE POLICY "Trainers can view own profile" ON trainers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Trainers can insert own profile" ON trainers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Trainers can update own profile" ON trainers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for clients table
-- Trainers can only access clients they own
CREATE POLICY "Trainers can view own clients" ON clients
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own clients" ON clients
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own clients" ON clients
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own clients" ON clients
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for credits table
-- Trainers can only access credits for their clients
CREATE POLICY "Trainers can view own credits" ON credits
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own credits" ON credits
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own credits" ON credits
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own credits" ON credits
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for workouts table
-- Trainers can only access workouts for their clients
CREATE POLICY "Trainers can view own workouts" ON workouts
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own workouts" ON workouts
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own workouts" ON workouts
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for exercises table
-- Trainers can only access exercises they own
CREATE POLICY "Trainers can view own exercises" ON exercises
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own exercises" ON exercises
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own exercises" ON exercises
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own exercises" ON exercises
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for workout_sets table
-- Trainers can only access workout sets for their workouts
CREATE POLICY "Trainers can view own workout sets" ON workout_sets
  FOR SELECT USING (
    workout_id IN (
      SELECT w.id FROM workouts w
      JOIN trainers t ON w.trainer_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own workout sets" ON workout_sets
  FOR INSERT WITH CHECK (
    workout_id IN (
      SELECT w.id FROM workouts w
      JOIN trainers t ON w.trainer_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own workout sets" ON workout_sets
  FOR UPDATE USING (
    workout_id IN (
      SELECT w.id FROM workouts w
      JOIN trainers t ON w.trainer_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own workout sets" ON workout_sets
  FOR DELETE USING (
    workout_id IN (
      SELECT w.id FROM workouts w
      JOIN trainers t ON w.trainer_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- RLS Policies for assigned_workouts table
-- Trainers can only access assignments they own
CREATE POLICY "Trainers can view own assignments" ON assigned_workouts
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can insert own assignments" ON assigned_workouts
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update own assignments" ON assigned_workouts
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can delete own assignments" ON assigned_workouts
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainers WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_updated_at BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assigned_workouts_updated_at BEFORE UPDATE ON assigned_workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create trainer profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO trainers (user_id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create trainer profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to get remaining sessions for a client
CREATE OR REPLACE FUNCTION get_client_remaining_sessions(client_uuid UUID)
RETURNS TABLE(
  total_sessions INTEGER,
  used_sessions INTEGER,
  remaining_sessions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(c.total_sessions), 0) as total_sessions,
    COALESCE(SUM(c.used_sessions), 0) as used_sessions,
    COALESCE(SUM(c.total_sessions - c.used_sessions), 0) as remaining_sessions
  FROM credits c
  WHERE c.client_id = client_uuid 
    AND c.is_active = true 
    AND (c.expires_at IS NULL OR c.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to adjust credits for a client
CREATE OR REPLACE FUNCTION adjust_credits(p_client_id UUID, p_delta INTEGER)
RETURNS TABLE(
  total_sessions INTEGER,
  used_sessions INTEGER,
  remaining_sessions INTEGER
) AS $$
DECLARE
  v_credit_record RECORD;
  v_remaining INTEGER;
  v_to_use INTEGER;
BEGIN
  -- Get the first available credit record with remaining sessions
  SELECT c.*, (c.total_sessions - c.used_sessions) as remaining
  INTO v_credit_record
  FROM credits c
  WHERE c.client_id = p_client_id 
    AND c.is_active = true 
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
    AND (c.total_sessions - c.used_sessions) > 0
  ORDER BY c.purchased_at ASC
  LIMIT 1;

  -- If no available credits, create a new credit record
  IF v_credit_record IS NULL THEN
    INSERT INTO credits (client_id, trainer_id, package_name, total_sessions, used_sessions, price)
    VALUES (
      p_client_id,
      (SELECT trainer_id FROM clients WHERE id = p_client_id),
      'Auto-generated',
      GREATEST(p_delta, 0),
      0,
      0.00
    );
  ELSE
    -- Update the existing credit record
    v_remaining := v_credit_record.remaining;
    v_to_use := LEAST(v_remaining, p_delta);
    
    UPDATE credits 
    SET used_sessions = used_sessions + v_to_use
    WHERE id = v_credit_record.id;
    
    -- If we need more credits than available, create additional credit
    IF p_delta > v_remaining THEN
      INSERT INTO credits (client_id, trainer_id, package_name, total_sessions, used_sessions, price)
      VALUES (
        p_client_id,
        (SELECT trainer_id FROM clients WHERE id = p_client_id),
        'Auto-generated',
        p_delta - v_remaining,
        0,
        0.00
      );
    END IF;
  END IF;

  -- Return updated credit summary
  RETURN QUERY SELECT * FROM get_client_remaining_sessions(p_client_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to start an assignment (creates a workout)
CREATE OR REPLACE FUNCTION start_assignment(p_assignment_id UUID)
RETURNS UUID AS $$
DECLARE
  v_assignment RECORD;
  v_workout_id UUID;
BEGIN
  -- Get the assignment
  SELECT * INTO v_assignment
  FROM assigned_workouts
  WHERE id = p_assignment_id
    AND status = 'assigned';
  
  IF v_assignment IS NULL THEN
    RAISE EXCEPTION 'Assignment not found or not in assigned status';
  END IF;

  -- Create a new workout
  INSERT INTO workouts (client_id, trainer_id, performed_at, status)
  VALUES (v_assignment.client_id, v_assignment.trainer_id, NOW(), 'completed')
  RETURNING id INTO v_workout_id;

  -- Update the assignment
  UPDATE assigned_workouts
  SET status = 'in_progress', workout_id = v_workout_id
  WHERE id = p_assignment_id;

  RETURN v_workout_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to complete an assignment
CREATE OR REPLACE FUNCTION complete_assignment(p_assignment_id UUID)
RETURNS VOID AS $$
DECLARE
  v_assignment RECORD;
BEGIN
  -- Get the assignment
  SELECT * INTO v_assignment
  FROM assigned_workouts
  WHERE id = p_assignment_id
    AND status = 'in_progress';
  
  IF v_assignment IS NULL THEN
    RAISE EXCEPTION 'Assignment not found or not in progress';
  END IF;

  -- Update the assignment status
  UPDATE assigned_workouts
  SET status = 'completed'
  WHERE id = p_assignment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
