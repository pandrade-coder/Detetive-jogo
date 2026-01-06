
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameCard, GameState, DossierState } from './types';
import { INITIAL_CARDS } from './constants';
import { GameCardUI } from './components/GameCardUI';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    hours: 12,
    deck: [],
    revealedCards: [],
    hand: [],
    dossiers: [],
    isGameOver: false,
  });

  const [showBriefing, setShowBriefing] = useState(true);
  const [zoomedCard, setZoomedCard] = useState<GameCard | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Initialize game
  useEffect(() => {
    const dossiers = INITIAL_CARDS.filter(c => c.type === 'dossier').map(d => ({
      id: d.id,
      dossierCard: { ...d },
      assignedCards: []
    }));

    const mainDeck = INITIAL_CARDS.filter(c => c.type !== 'dossier');
    // Fisher-Yates shuffle
    for (let i = mainDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mainDeck[i], mainDeck[j]] = [mainDeck[j], mainDeck[i]];
    }

    setState({
      hours: 12,
      deck: mainDeck,
      revealedCards: [],
      hand: [],
      dossiers,
      isGameOver: false,
    });
  }, []);

  const handleInvestigate = useCallback(() => {
    if (state.hours <= 0 || state.deck.length === 0) return;

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) return prev;

      const newHours = prev.hours - 1;
      const isResource = drawnCard.type === 'resource';

      return {
        ...prev,
        hours: newHours,
        deck: newDeck,
        revealedCards: isResource ? prev.revealedCards : [...prev.revealedCards, drawnCard],
        hand: isResource ? [...prev.hand, drawnCard] : prev.hand,
        isGameOver: newHours <= 0
      };
    });
  }, [state.hours, state.deck]);

  const handleUseResource = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setState(prev => ({
      ...prev,
      hand: prev.hand.filter(c => c.id !== cardId)
    }));
    setZoomedCard(null);
    alert("Recurso tático ativado.");
  };

  const handleImageUpload = (dossierId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setState(prev => ({
          ...prev,
          dossiers: prev.dossiers.map(d => 
            d.id === dossierId 
              ? { ...d, dossierCard: { ...d.dossierCard, imageUrl: base64String } } 
              : d
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openZoom = (card: GameCard) => {
    setZoomedCard(card);
  };

  const closeZoom = () => {
    setZoomedCard(null);
  };

  // Drag and Drop Logic
  const onDragStart = (e: React.DragEvent, card: GameCard) => {
    e.dataTransfer.setData('cardId', card.id);
  };

  const onDropOnDossier = (e: React.DragEvent, dossierId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    
    setState(prev => {
      const cardToMove = prev.revealedCards.find(c => c.id === cardId);
      if (!cardToMove) return prev;

      const newRevealed = prev.revealedCards.filter(c => c.id !== cardId);
      const newDossiers = prev.dossiers.map(d => {
        if (d.id === dossierId) {
          return { ...d, assignedCards: [...d.assignedCards, cardToMove] };
        }
        return d;
      });

      return {
        ...prev,
        revealedCards: newRevealed,
        dossiers: newDossiers
      };
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-mono selection:bg-olive-800">
      
      {/* Briefing Overlay */}
      {showBriefing && (
        <div className="fixed inset-0 z-[300] bg-zinc-950 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#f4ece1] p-10 shadow-[20px_20px_0px_rgba(0,0,0,0.5)] border-2 border-zinc-800 text-zinc-900 relative paper-texture">
            <div className="absolute top-10 right-10 border-4 border-red-800 text-red-800 font-stencil px-4 py-2 rotate-[15deg] opacity-60 pointer-events-none text-4xl">TOP SECRET</div>
            
            <div className="mb-10 border-b-2 border-zinc-900 pb-4">
              <h2 className="font-stencil text-3xl tracking-widest text-zinc-900 mb-2">ORDEM DE OPERAÇÃO: ÍCARO</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Diretoria de Inteligência e Contra-Espionagem</p>
            </div>

            <div className="space-y-6 text-sm leading-relaxed">
              <div className="flex gap-4">
                <span className="font-bold min-w-[120px] uppercase">Classificação:</span>
                <span className="bg-zinc-900 text-white px-2">TOP SECRET / ACESSO RESTRITO</span>
              </div>
              
              <div className="flex gap-4">
                <span className="font-bold min-w-[120px] uppercase">Data:</span>
                <span>05 de Janeiro de 2026 – 02:30 AM</span>
              </div>

              <div className="flex gap-4">
                <span className="font-bold min-w-[120px] uppercase">Local:</span>
                <span>Base Aérea de Alta Segurança – Hangar 7</span>
              </div>

              <div className="pt-4 border-t border-zinc-300">
                <p className="font-bold uppercase mb-4 text-xs tracking-widest">Relatório de Situação:</p>
                <p className="mb-4">
                  Às 23h25 de ontem, o <span className="font-bold">Major Silas</span> (Chefe de Segurança) reportou a descoberta de um corpo no laboratório de propulsão do Hangar 7. 
                </p>
                <p className="mb-4">
                  A vítima foi identificada como o <span className="font-bold text-red-900 underline">Dr. Arnaldo Rossi</span>, cientista-chefe do Projeto Ícaro. O projeto, que envolve uma tecnologia de controle neural ultra-secreta, foi roubado.
                </p>
                <p className="italic bg-zinc-200 p-4 border-l-4 border-zinc-500">
                  "Os sistemas de segurança sofreram um apagão seletivo. O culpado sabia exatamente onde as câmeras falhariam. O protótipo V-4 desapareceu e Rossi foi silenciado antes de conseguir acionar o alarme de emergência."
                </p>
              </div>

              <div className="pt-6">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-4">Objetivo dos Agentes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compilar evidências nos dossiês dos 5 suspeitos principais.</li>
                  <li>Identificar o autor do crime e o paradeiro do protótipo antes que o rastro esfrie.</li>
                  <li>Vocês têm exatamente <span className="font-bold">12 HORAS</span> antes que a base seja evacuada e o protocolo de trituração de dados seja ativado.</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={() => setShowBriefing(false)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-stencil px-10 py-4 text-xl tracking-widest transition-all hover:translate-x-1 hover:-translate-y-1 shadow-[5px_5px_0px_#555] active:shadow-none active:translate-x-0 active:translate-y-0"
              >
                INICIAR INVESTIGAÇÃO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-40">
        <h1 className="font-stencil text-2xl tracking-widest text-olive-500">
          OPERAÇÃO ÍCARO <span className="text-[10px] text-zinc-600 ml-2 font-mono tracking-normal">STABLE-BUILD_V1.1</span>
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end border-r border-zinc-800 pr-6">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Tempo de Operação</span>
            <div className={`text-2xl font-stencil ${state.hours <= 3 ? 'text-red-600 animate-pulse' : 'text-zinc-100'}`}>
              {state.hours.toString().padStart(2, '0')}:00H RESTANTES
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] hover:text-red-500 text-zinc-600 transition-colors uppercase font-bold border border-zinc-800 px-3 py-1"
          >
            Abortar Missão
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 gap-8 overflow-y-auto">
        
        {/* Dossiers Zone */}
        <section>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <div className="text-[11px] uppercase font-bold text-olive-500 tracking-[0.3em] whitespace-nowrap">ARQUIVO DE DOSSIÊS ATIVOS</div>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {state.dossiers.map(d => (
              <div 
                key={d.id} 
                className="flex flex-col gap-3 p-3 border border-zinc-800 bg-zinc-900/40 rounded-sm relative group hover:border-zinc-600 transition-colors"
                onDrop={(e) => onDropOnDossier(e, d.id)}
                onDragOver={onDragOver}
              >
                <GameCardUI card={d.dossierCard} onClick={() => openZoom(d.dossierCard)} />
                
                {/* Upload Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRefs.current[d.id]?.click(); }}
                  className="absolute top-6 right-6 w-8 h-8 bg-olive-700/90 hover:bg-olive-600 text-white rounded-sm flex items-center justify-center border border-olive-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                  title="Atualizar Foto"
                >
                  <span className="text-sm">📷</span>
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={el => fileInputRefs.current[d.id] = el}
                  onChange={(e) => handleImageUpload(d.id, e)}
                />

                <div className="min-h-[80px] border-t border-zinc-800 pt-3 flex flex-col gap-1.5">
                  <div className="text-[9px] text-zinc-600 font-bold mb-1">PROVAS VINCULADAS:</div>
                  {d.assignedCards.length === 0 ? (
                    <div className="text-[9px] text-zinc-700 italic px-2 py-1 bg-black/20">Aguardando evidências...</div>
                  ) : (
                    d.assignedCards.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => openZoom(c)}
                        className="w-full text-[9px] bg-zinc-800/40 px-2 py-1.5 border-l-2 border-olive-600 flex justify-between cursor-help hover:bg-zinc-800 transition-colors"
                      >
                        <span className="font-bold">{c.code}</span>
                        <span className="opacity-40">{c.title.substring(0, 15)}...</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Central Mesa (Table) */}
        <section className="flex-1 grid grid-cols-12 gap-8 mt-4">
          
          {/* Deck Pile (Left) */}
          <div className="col-span-3 flex flex-col items-center justify-start pt-10">
             <div className="text-[10px] uppercase font-bold text-zinc-600 mb-4 tracking-widest">ACERVO DE EVIDÊNCIAS</div>
             <div 
               className={`
                 w-56 h-80 border-2 border-dashed border-zinc-800 
                 flex flex-col items-center justify-center gap-6
                 bg-zinc-900/20 rounded-sm cursor-pointer hover:bg-zinc-900/40 transition-all group
                 ${state.deck.length === 0 ? 'opacity-30 pointer-events-none' : ''}
               `}
               onClick={handleInvestigate}
             >
               <div className="w-40 h-56 bg-zinc-900 border-2 border-zinc-800 shadow-[8px_8px_0px_#000] rotate-[-3deg] flex items-center justify-center group-hover:rotate-0 transition-transform">
                 <div className="flex flex-col items-center opacity-40">
                    <span className="font-stencil text-zinc-400 text-3xl mb-1 tracking-tighter">ÍCARO</span>
                    <span className="text-[8px] text-zinc-500 font-bold tracking-[0.5em]">CONFIDENTIAL</span>
                 </div>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <button className="bg-olive-800 hover:bg-olive-700 px-6 py-2.5 font-stencil text-sm tracking-widest uppercase transition-colors shadow-lg">
                   Investigar
                 </button>
                 <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">{state.deck.length} ARQUIVOS RESTANTES</span>
               </div>
             </div>
          </div>

          {/* Revealed Cards (Center) */}
          <div className="col-span-6 border-x border-zinc-900/80 px-8 bg-zinc-900/10 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-zinc-600 mb-6 text-center tracking-[0.5em]">MESA DE ANÁLISE TÁTICA</div>
            <div className="flex flex-wrap justify-center gap-8 min-h-[400px] content-start">
              {state.revealedCards.length === 0 && (
                <div className="mt-28 text-zinc-800 font-stencil text-2xl uppercase opacity-10 tracking-[0.2em] animate-pulse">
                  Nenhuma Prova Revelada
                </div>
              )}
              {state.revealedCards.map(card => (
                <GameCardUI 
                  key={card.id} 
                  card={card} 
                  draggable 
                  onDragStart={(e) => onDragStart(e, card)}
                  onClick={() => openZoom(card)}
                />
              ))}
            </div>
          </div>

          {/* Tactical Hand (Right) */}
          <div className="col-span-3">
            <div className="text-[10px] uppercase font-bold text-olive-600 mb-4 tracking-widest">BOLSO DE RECURSOS</div>
            <div className="flex flex-col gap-6 items-center">
              {state.hand.length === 0 && (
                <div className="mt-10 text-[9px] text-zinc-800 uppercase font-bold border-2 border-dashed border-zinc-900 p-8 w-full text-center tracking-widest">
                  SEM SUPORTE<br/>NO MOMENTO
                </div>
              )}
              {state.hand.map(card => (
                <div key={card.id} className="relative group">
                  <GameCardUI card={card} small onClick={() => openZoom(card)} />
                  <button 
                    onClick={(e) => handleUseResource(card.id, e)}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-olive-700 hover:bg-olive-600 text-[9px] font-bold py-1.5 px-4 shadow-xl opacity-0 group-hover:opacity-100 transition-all border border-olive-400 whitespace-nowrap tracking-widest"
                  >
                    ATIVAR RECURSO
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* Zoom Modal */}
      {zoomedCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
          onClick={closeZoom}
        >
          <div className="relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <GameCardUI card={zoomedCard} isZoomed />
            <button 
              onClick={closeZoom}
              className="absolute -top-12 right-0 text-zinc-400 hover:text-white flex items-center gap-2 uppercase text-xs font-bold"
            >
              FECHAR [ESC] <span className="text-xl">×</span>
            </button>
            {zoomedCard.type === 'resource' && (
              <button 
                onClick={() => handleUseResource(zoomedCard.id)}
                className="w-full mt-4 bg-olive-700 hover:bg-olive-600 text-white font-stencil py-3 tracking-[0.2em] shadow-2xl border border-olive-400 uppercase"
              >
                Ativar Este Recurso Agora
              </button>
            )}
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {state.isGameOver && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl border-4 border-red-950 m-4">
          <div className="mb-4 text-red-600 font-mono text-sm tracking-[0.5em] animate-pulse">ALERTA CRÍTICO: FALHA NA MISSÃO</div>
          <h2 className="text-7xl font-stencil text-red-700 mb-6 tracking-tighter shadow-red-900/20 shadow-2xl">TEMPO ESGOTADO</h2>
          <p className="text-zinc-500 max-w-lg mb-12 font-mono leading-relaxed uppercase text-xs tracking-widest">
            As 12 horas da Operação Ícaro se dissiparam. Os arquivos foram triturados e o culpado escapou pelo perímetro. O rastro do Protótipo V-4 foi perdido definitivamente.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="border-2 border-red-700 text-red-700 px-12 py-4 font-stencil text-2xl hover:bg-red-700 hover:text-white transition-all shadow-[0_0_50px_rgba(185,28,28,0.2)] uppercase tracking-widest"
          >
            Reiniciar Operação
          </button>
        </div>
      )}

      {/* Footer / Info */}
      <footer className="h-8 bg-zinc-900 border-t border-zinc-800 flex items-center px-8 text-[9px] text-zinc-600 gap-10 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-900 rounded-full animate-pulse"></div>
          SISTEMA OPERACIONAL ATIVO
        </div>
        <div>MODO: COOPERATIVO LOCAL [P1 & P2]</div>
        <div className="ml-auto text-zinc-700">COORDENADAS: 52.5200° N, 13.4050° E // HANGAR-07</div>
      </footer>
    </div>
  );
};

export default App;
