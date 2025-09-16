import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="min-h-screen bg-gradient-to-br from-background/95 via-transparent to-background/90 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <MapPin className="w-24 h-24 text-quiz-ocean mx-auto" />
          <h1 className="text-6xl font-bold text-quiz-ocean">404</h1>
          <div className="space-y-2">
            <p className="text-xl text-foreground font-semibold">Página não encontrada</p>
            <p className="text-muted-foreground">
              Parece que você se perdeu no mapa! Esta página não existe.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = "/"} 
            variant="quiz"
            className="mt-6"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
