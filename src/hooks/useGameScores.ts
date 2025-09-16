import { supabase } from '@/integrations/supabase/client';

export interface GameScore {
  id: string;
  user_id: string;
  correct_answers: number;
  total: number;
  time: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  correct_answers: number;
  total: number;
  time: number;
  created_at: string;
  users: {
    name: string;
    country: string;
  };
}

export function useGameScores() {
  const saveScore = async (score: {
    user_id: string;
    correct_answers: number;
    total: number;
    time: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([score])
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: 'Failed to save score' };
    }
  };

  const getLeaderboard = async (limit = 10): Promise<{ data: LeaderboardEntry[] | null; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          id,
          user_id,
          correct_answers,
          total,
          time,
          created_at,
          users (
            name,
            country
          )
        `)
        .order('correct_answers', { ascending: false })
        .order('time', { ascending: true })
        .limit(limit);

      return { data: data as LeaderboardEntry[] | null, error: error?.message || null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch leaderboard' };
    }
  };

  const getUserBestScore = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('correct_answers', { ascending: false })
        .order('time', { ascending: true })
        .limit(1)
        .maybeSingle();

      return { data, error: error?.message || null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch user best score' };
    }
  };

  return {
    saveScore,
    getLeaderboard,
    getUserBestScore,
  };
}