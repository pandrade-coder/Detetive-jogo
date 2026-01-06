
import React from 'react';
import { GameCard } from '../types';

interface GameCardUIProps {
  card: GameCard;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: () => void;
  small?: boolean;
  isZoomed?: boolean;
}

export const GameCardUI: React.FC<GameCardUIProps> = ({ card, draggable, onDragStart, onClick, small, isZoomed }) => {
  const typeColors = {
    dossier: 'border-zinc-800 bg-[#f4ece1]',
    evidence: 'border-zinc-700 bg-[#eaddca]',
    interrogation: 'border-zinc-700 bg-[#eaddca]',
    resource: 'border-olive-600 bg-olive-950 text-white'
  };

  const isDark = card.type === 'resource';
  
  // Aumentando tamanhos base: 
  // Pequena: de w-32/h-44 para w-40/h-56
  // Normal: de w-40/h-56 para w-52/h-72
  // Zoom: w-96/h-[32rem]
  const sizeClasses = isZoomed 
    ? 'w-96 h-[32rem]' 
    : small 
      ? 'w-40 h-56' 
      : 'w-52 h-72';

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer select-none
        border-2 shadow-2xl paper-texture
        ${sizeClasses}
        ${typeColors[card.type]}
        ${draggable && !isZoomed ? 'hover:scale-105 active:rotate-2 transition-transform' : ''}
        flex flex-col p-3 gap-2
      `}
    >
      <div className={`confidential-watermark font-stencil ${isZoomed ? 'text-6xl' : 'text-3xl'}`}>CONFIDENCIAL</div>
      
      <div className={`flex justify-between items-center border-b pb-1 ${isDark ? 'border-white/20 text-olive-300' : 'border-black/20 text-zinc-500'}`}>
        <span className="text-[10px] font-bold">REGISTRO: {card.code}</span>
        <span className="text-[8px] uppercase tracking-tighter">DEPT_FORENSIC</span>
      </div>
      
      <div className={`${isZoomed ? 'text-xl' : 'text-sm'} font-stencil mt-1 uppercase leading-tight font-bold ${isDark ? 'text-olive-100' : 'text-zinc-900'}`}>
        {card.title}
      </div>

      <div className="flex-1 flex flex-col justify-start items-center text-center px-1 pt-2 gap-3">
         {card.type === 'dossier' && (
           <div className={`${isZoomed ? 'w-56 h-56' : small ? 'w-28 h-28' : 'w-36 h-36'} overflow-hidden bg-black/10 rounded-sm flex items-center justify-center border border-black/30 shadow-inner`}>
             {card.imageUrl ? (
               <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover grayscale contrast-125 brightness-90" />
             ) : (
               <span className={`${isZoomed ? 'text-7xl' : 'text-5xl'} opacity-30`}>👤</span>
             )}
           </div>
         )}
         
         <div className="w-full text-left">
           <p className={`
             ${isZoomed ? 'text-sm' : 'text-[10px]'} 
             italic leading-relaxed whitespace-pre-line font-medium
             ${isDark ? 'text-zinc-200' : 'text-zinc-900'}
           `}>
             {card.description}
           </p>
         </div>
      </div>

      <div className={`mt-auto pt-2 border-t flex justify-between items-end ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <div className={`text-[7px] font-mono opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
          SEC_LEVEL: ALPHA<br/>
          AUTH: EXEC_01
        </div>
        <div className={`text-[9px] uppercase tracking-widest font-bold ${isDark ? 'text-olive-300' : 'text-zinc-600'}`}>
          {card.type}
        </div>
      </div>
    </div>
  );
};
