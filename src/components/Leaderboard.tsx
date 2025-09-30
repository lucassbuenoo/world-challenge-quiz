import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGameScores, LeaderboardEntry } from '@/hooks/useGameScores';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Adicione a interface de props
interface LeaderboardProps {
  highlightTop?: boolean;
}

export function Leaderboard({ highlightTop = false }: LeaderboardProps) {
  const { t } = useTranslation();
  const { getLeaderboard } = useGameScores();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  
  const entriesPerPage = 10;
  const maxEntries = 50;
  const totalPages = Math.min(Math.ceil(totalEntries / entriesPerPage), Math.ceil(maxEntries / entriesPerPage));

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      const { data } = await getLeaderboard(maxEntries); // Fetch all 50 entries
      if (data) {
        setTotalEntries(data.length);
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        setLeaders(data.slice(startIndex, endIndex));
      }
      setLoading(false);
    };

    loadLeaderboard();
  }, [currentPage]);

  const getRankIcon = (index: number, actualRank: number) => {
    // Destacar top 1 se highlightTop for true
    if (highlightTop && actualRank === 1) {
      return <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />;
    }
    if (actualRank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (actualRank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (actualRank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{actualRank}</span>;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-quiz-gold/50 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-quiz-gold mb-4 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          {t('leaderboard')}
        </h2>
        <div className="text-center text-muted-foreground">{t('loading')}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-quiz-gold/50 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-quiz-gold mb-4 flex items-center justify-center gap-2">
        <Trophy className="w-6 h-6" />
        {t('leaderboard')}
      </h2>
      
      <div className="space-y-2">
        {leaders.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            {t('noScores')}
          </div>
        ) : (
          leaders.map((entry, index) => {
            const actualRank = (currentPage - 1) * entriesPerPage + index + 1;
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors 
                  ${highlightTop && actualRank === 1 ? 'bg-yellow-50' : 'bg-background/50'} 
                  hover:bg-background/70`}
              >
                {getRankIcon(index, actualRank)}
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {entry.users.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.users.country}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-quiz-ocean">
                    {entry.correct_answers}/196
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((entry.correct_answers / 196) * 100)}% • {formatTime(entry.time)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
