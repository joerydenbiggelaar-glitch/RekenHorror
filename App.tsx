import React, { useState, useEffect } from 'react';
import { GameState, PlayerState, Puzzle } from './types.ts';
import { PUZZLES, MEMORIES, MAX_SANITY, SANITY_PENALTY, INTRO_TEXT, VICTORY_TEXT } from './constants.ts';
import { generateHorrorImage, generateGhostVoice } from './services/geminiService.ts';
import AudioController from './components/AudioController.tsx';
import { CircleAlert, Ghost, LockKeyhole, Skull, BrainCircuit, Share2, Printer, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentRoomIndex: 0,
    sanity: MAX_SANITY,
    collectedMemories: [],
    mistakes: 0,
  });
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [ghostAudioBuffer, setGhostAudioBuffer] = useState<AudioBuffer | null>(null);
  const [copied, setCopied] = useState(false);

  const currentPuzzle: Puzzle = PUZZLES[playerState.currentRoomIndex];
  const progress = (playerState.collectedMemories.length / PUZZLES.length) * 100;

  // Load initial room image when entering a room
  useEffect(() => {
    if (gameState === GameState.PLAYING && currentPuzzle) {
      loadRoomImage(currentPuzzle.imagePrompt);
    }
  }, [gameState, playerState.currentRoomIndex]);

  const loadRoomImage = async (prompt: string) => {
    setLoadingImage(true);
    const img = await generateHorrorImage(prompt);
    setCurrentImage(img);
    setLoadingImage(false);
  };

  const loadMemory = async (memoryIndex: number) => {
    setLoadingImage(true);
    const memory = MEMORIES[memoryIndex];
    
    // Parallel fetch for speed
    const [img, audio] = await Promise.all([
      generateHorrorImage(memory.imagePrompt),
      generateGhostVoice(memory.voiceText)
    ]);

    setCurrentImage(img);
    setGhostAudioBuffer(audio);
    setLoadingImage(false);
  };

  const handleStart = () => {
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = async (optionIndex: number) => {
    if (optionIndex === currentPuzzle.correctAnswerIndex) {
      // Correct
      const memoryId = currentPuzzle.id;
      setPlayerState(prev => ({
        ...prev,
        collectedMemories: [...prev.collectedMemories, memoryId]
      }));
      
      setGameState(GameState.MEMORY_REVEAL);
      await loadMemory(playerState.currentRoomIndex);
    } else {
      // Incorrect
      const newSanity = playerState.sanity - SANITY_PENALTY;
      setPlayerState(prev => ({
        ...prev,
        sanity: newSanity,
        mistakes: prev.mistakes + 1
      }));
      setFeedbackMessage("Je herinneringen vervagen... De schaduw komt dichterbij.");
      
      if (newSanity <= 0) {
        setGameState(GameState.GAME_OVER);
      }
      
      // Clear feedback after delay
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const nextRoom = () => {
    const nextIndex = playerState.currentRoomIndex + 1;
    if (nextIndex >= PUZZLES.length) {
      setGameState(GameState.VICTORY);
    } else {
      setPlayerState(prev => ({ ...prev, currentRoomIndex: nextIndex }));
      setGameState(GameState.PLAYING);
      setGhostAudioBuffer(null); // Clear audio
    }
  };

  const handleCopyResults = () => {
    const text = `🏆 Reken-Horror Voltooid!\n\nStatus: ONTSNAPT\nResterende Sanity: ${playerState.sanity}%\nAantal Fouten: ${playerState.mistakes}\n\nDe geest is bevrijd en het huis is verlaten.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderIntro = () => (
    <div className="max-w-2xl mx-auto text-center p-8 bg-black/80 border border-red-900/50 rounded-xl shadow-2xl shadow-red-900/20 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent opacity-50"></div>
      <h1 className="font-horror text-6xl text-red-600 mb-6 tracking-widest animate-pulse">Reken Horror</h1>
      <p className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">{INTRO_TEXT}</p>
      <button 
        onClick={handleStart}
        className="px-8 py-4 bg-red-900 hover:bg-red-700 text-white font-bold rounded transition-all duration-300 transform hover:scale-105 border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
      >
        Betreed het Huis
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-lg backdrop-blur-sm border border-gray-800">
        <div className="flex items-center space-x-2">
           <BrainCircuit className="text-blue-400" />
           <div className="flex flex-col">
             <span className="text-xs text-gray-400 uppercase">Geheugen</span>
             <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
             </div>
           </div>
        </div>
        <div className="flex items-center space-x-2">
           <div className={`flex flex-col items-end ${playerState.sanity < 40 ? 'animate-pulse text-red-500' : 'text-gray-300'}`}>
             <span className="text-xs uppercase">Mentale Status</span>
             <span className="font-bold">{playerState.sanity}%</span>
           </div>
           <Skull className={`${playerState.sanity < 40 ? 'text-red-600' : 'text-gray-500'}`} />
        </div>
      </div>

      {/* Main Room View */}
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl group">
        {loadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-red-600 font-horror text-2xl animate-pulse">De kamer manifesteert zich...</div>
            </div>
        )}
        {currentImage ? (
          <img src={currentImage} alt="Room" className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
             <span className="text-gray-600">Kamer wordt geladen...</span>
          </div>
        )}
        
        {/* Feedback Overlay */}
        {feedbackMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 z-30 backdrop-blur-sm animate-bounce">
             <h2 className="text-3xl text-white font-horror bg-black/80 px-6 py-3 rounded border border-red-500">{feedbackMessage}</h2>
          </div>
        )}
        
        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
           <h2 className="text-3xl text-red-500 font-horror mb-1">{currentPuzzle.roomName}</h2>
           <p className="text-gray-300 italic">{currentPuzzle.description}</p>
        </div>
      </div>

      {/* Puzzle Interface */}
      <div className="mt-6 bg-gray-900/90 border border-gray-700 p-6 rounded-lg shadow-lg relative overflow-hidden">
         <div className="absolute -right-4 -top-4 text-gray-800 opacity-20">
            <LockKeyhole size={120} />
         </div>
         
         <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-900/50 text-blue-200 text-xs font-bold px-2 py-1 rounded border border-blue-800 uppercase tracking-wider">
                    {currentPuzzle.category}
                </span>
                <span className="text-gray-500 text-sm">Puzzel {playerState.currentRoomIndex + 1} van {PUZZLES.length}</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
               {currentPuzzle.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPuzzle.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="p-4 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500 text-left text-gray-200 rounded transition-all duration-200 flex items-center group"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-black rounded-full text-gray-400 group-hover:text-white group-hover:bg-red-800 mr-3 font-bold text-sm border border-gray-600">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderMemoryReveal = () => {
      const memory = MEMORIES[playerState.currentRoomIndex];
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
            <div className="max-w-3xl w-full bg-gray-900 border border-blue-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col animate-in fade-in zoom-in duration-500">
                <div className="relative h-64 md:h-96 bg-black">
                   {loadingImage ? (
                       <div className="w-full h-full flex items-center justify-center text-blue-400 animate-pulse">Herinnering reconstrueren...</div>
                   ) : (
                       <img src={currentImage || ''} alt="Memory" className="w-full h-full object-contain" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-8 text-center relative">
                    <Ghost className="mx-auto text-blue-400 mb-4 animate-bounce" size={40} />
                    <h3 className="font-horror text-3xl text-blue-200 mb-4">Herinnering Hersteld</h3>
                    <p className="text-xl text-gray-300 italic mb-8">"{memory.text}"</p>
                    
                    <div className="bg-gray-800/50 p-4 rounded mb-6 text-sm text-left border border-gray-700">
                        <p className="text-green-400 font-bold mb-1">Correct!</p>
                        <p className="text-gray-400">{currentPuzzle.explanation}</p>
                    </div>

                    <button 
                        onClick={nextRoom}
                        className="px-8 py-3 bg-blue-900 hover:bg-blue-700 text-white rounded font-bold transition-colors"
                    >
                        {playerState.currentRoomIndex >= PUZZLES.length - 1 ? "Ontsnap uit het huis" : "Volgende Kamer"}
                    </button>
                </div>
            </div>
        </div>
      );
  };

  const renderGameOver = () => (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-950 text-center p-4">
          <Skull size={100} className="text-red-600 mb-6 animate-pulse" />
          <h1 className="font-horror text-6xl text-white mb-4">GAME OVER</h1>
          <p className="text-xl text-red-200 mb-8 max-w-md">Je geest is gebroken. De schaduwen hebben je overgenomen. Je zult hier voor altijd dwalen.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
          >
            Probeer Opnieuw
          </button>
      </div>
  );

  const renderVictory = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-center p-4 overflow-y-auto print:bg-white print:text-black print:absolute print:inset-0">
        <div className="max-w-2xl w-full">
            <h1 className="font-horror text-6xl text-yellow-500 mb-6 print:text-black">VRIJHEID</h1>
            <p className="text-lg text-gray-300 mb-8 whitespace-pre-line leading-relaxed print:text-gray-700">{VICTORY_TEXT}</p>
            
            <div className="bg-black/40 p-6 rounded-lg border border-yellow-900/30 mb-8 print:bg-white print:border-2 print:border-black">
                <h3 className="text-xl text-yellow-200 mb-4 font-horror print:text-black">Certificaat van Voltooiing</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="p-3 bg-slate-800 rounded print:bg-gray-100">
                        <div className="text-xs text-gray-500 print:text-gray-600">Sanity Over</div>
                        <div className="text-2xl font-bold text-blue-400 print:text-black">{playerState.sanity}%</div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded print:bg-gray-100">
                        <div className="text-xs text-gray-500 print:text-gray-600">Gemaakte Fouten</div>
                        <div className="text-2xl font-bold text-red-400 print:text-black">{playerState.mistakes}</div>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500 italic print:block hidden">
                    Datum: {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 no-print">
                <button 
                  onClick={handleCopyResults}
                  className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors min-w-[160px]"
                >
                  {copied ? <Check className="mr-2" size={20} /> : <Copy className="mr-2" size={20} />}
                  {copied ? "Gekopieerd!" : "Kopieer Score"}
                </button>
                
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded transition-colors"
                >
                  <Printer className="mr-2" size={20} />
                  Print Certificaat
                </button>

                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded transition-colors"
                >
                  Speel Opnieuw
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white selection:bg-red-900 selection:text-white flex flex-col print:bg-white print:text-black">
      <div className="no-print">
        <AudioController 
            playGhostVoiceBuffer={ghostAudioBuffer} 
            isSpooky={gameState === GameState.PLAYING} 
        />
      </div>
      
      {gameState === GameState.INTRO && renderIntro()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.MEMORY_REVEAL && renderMemoryReveal()}
      {gameState === GameState.GAME_OVER && renderGameOver()}
      {gameState === GameState.VICTORY && renderVictory()}
    </div>
  );
};

export default App;