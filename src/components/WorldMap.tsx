import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { countries } from '@/data/countries';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface WorldMapProps {
  correctCountries: string[];
  isGameFinished?: boolean;
}

export function WorldMap({ correctCountries, isGameFinished = false }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { t } = useTranslation();

  // Carregar o conteúdo do SVG
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch('/world-map.svg');
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error('Erro ao carregar o mapa SVG:', error);
      }
    };

    loadSvg();
  }, []);

  // Atualizar cores dos países baseado nos acertos
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    // Aguardar um pouco para o SVG ser inserido no DOM
    setTimeout(() => {
      const svgElement = containerRef.current?.querySelector('svg');
      if (!svgElement) return;

      const countryPaths = svgElement.querySelectorAll('path[id]');
      const allCountryIds = countries.map(country => country.id);

      countryPaths.forEach(path => {
        const countryId = path.getAttribute('id');

        if (!countryId || !allCountryIds.includes(countryId)) {
          // Não é um país válido, manter cor padrão
          path.setAttribute('fill', '#e0e0e0');
          path.setAttribute('stroke', '#999');
          path.setAttribute('stroke-width', '0.5');
          return;
        }

        if (correctCountries.includes(countryId)) {
          // País correto - verde
          path.setAttribute('fill', '#22c55e');
          path.setAttribute('stroke', '#16a34a');
          path.setAttribute('stroke-width', '1.5');
        } else if (isGameFinished) {
          // Jogo terminou e país não foi acertado - vermelho
          path.setAttribute('fill', '#ef4444');
          path.setAttribute('stroke', '#dc2626');
          path.setAttribute('stroke-width', '1');
        } else {
          // Jogo em andamento, país não acertado - cor padrão
          path.setAttribute('fill', '#e0e0e0');
          path.setAttribute('stroke', '#999');
          path.setAttribute('stroke-width', '0.5');
        }
      });
    }, 100);
  }, [correctCountries, svgContent, isGameFinished]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = prev / 1.5;
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
        return 1;
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-b from-quiz-ocean/10 to-quiz-earth/10 rounded-lg p-4 border border-quiz-continent">
      <div className="bg-quiz-ocean/5 rounded-lg p-4 overflow-hidden relative">
        {svgContent ? (
          <>
            <div
              ref={containerRef}
              className="w-full h-full max-h-[80vh] overflow-hidden relative touch-none"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--quiz-ocean)/0.1), hsl(var(--quiz-earth)/0.05))',
                borderRadius: '8px',
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  // arrasto com 1 dedo
                  const touch = e.touches[0];
                  setIsDragging(true);
                  setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
                } else if (e.touches.length === 2) {
                  // pinça com 2 dedos -> zoom
                  const dx = e.touches[0].clientX - e.touches[1].clientX;
                  const dy = e.touches[0].clientY - e.touches[1].clientY;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  (containerRef.current as any).initialDistance = distance;
                  (containerRef.current as any).initialZoom = zoom;
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 1 && isDragging) {
                  const touch = e.touches[0];
                  setPosition({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y,
                  });
                } else if (e.touches.length === 2) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX;
                  const dy = e.touches[0].clientY - e.touches[1].clientY;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  const initialDistance = (containerRef.current as any).initialDistance || distance;
                  const initialZoom = (containerRef.current as any).initialZoom || zoom;
                  let newZoom = (distance / initialDistance) * initialZoom;
                  newZoom = Math.max(1, Math.min(newZoom, 4));
                  setZoom(newZoom);
                }
              }}
              onTouchEnd={() => {
                setIsDragging(false);
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />


            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 4}
                className="w-10 h-10 shadow-lg bg-background/80 backdrop-blur-sm border border-quiz-continent hover:bg-quiz-ocean/10"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="w-10 h-10 shadow-lg bg-background/80 backdrop-blur-sm border border-quiz-continent hover:bg-quiz-ocean/10"
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
            {t('loadingMap')}
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-muted-foreground text-center flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-quiz-correct inline-block" />
          {t('countriesDiscovered')}
        </span>

        {isGameFinished && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-destructive inline-block" />
            {t('countriesNotDiscovered')}
          </span>
        )}
      </div>


    </div>
  );
}