import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10], [10, 11], [10, 12]];
const INITIAL_DIRECTION = [0, -1];
const SPEED = 120; // Slightly faster for spy thrill

// --- Windows 98 Style Constants ---
const WIN98_BG = "bg-[#c0c0c0]";
const WIN98_TEXT = "font-sans text-sm";
const BEVEL_OUT = "shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf,inset_-2px_-2px_#808080,inset_2px_2px_#ffffff]";
const BEVEL_IN = "shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#ffffff,inset_2px_2px_#808080,inset_-2px_-2px_#dfdfdf]";
const BLUE_HEADER = "bg-[#000080]";

const SnakeGame = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState([5, 5]);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameState, setGameState] = useState('START'); // START, RUNNING, PAUSED, GAMEOVER
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('snake_high_score');
        return saved ? parseInt(saved) : 0;
    });
    const lastDirection = useRef(INITIAL_DIRECTION);

    // --- Game Logic ---

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snake_high_score', score.toString());
        }
    }, [score, highScore]);

    const generateFood = useCallback((currentSnake) => {
        let newFood;
        while (true) {
            newFood = [
                Math.floor(Math.random() * GRID_SIZE),
                Math.floor(Math.random() * GRID_SIZE)
            ];
            const isOnSnake = currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]);
            if (!isOnSnake) break;
        }
        return newFood;
    }, []);

    const moveSnake = useCallback(() => {
        if (gameState !== 'RUNNING') return;

        setSnake(prevSnake => {
            const head = prevSnake[0];
            const newHead = [
                (head[0] + direction[0] + GRID_SIZE) % GRID_SIZE,
                (head[1] + direction[1] + GRID_SIZE) % GRID_SIZE
            ];

            // Check self-collision
            if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
                setGameState('GAMEOVER');
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            // Check food
            if (newHead[0] === food[0] && newHead[1] === food[1]) {
                setScore(s => s + 1); // 1 Data packet
                setFood(generateFood(newSnake));
            } else {
                newSnake.pop();
            }

            lastDirection.current = direction;
            return newSnake;
        });
    }, [direction, food, generateFood, gameState]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent default scrolling for arrow keys
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (lastDirection.current[1] !== 1) setDirection([0, -1]);
                    break;
                case 'ArrowDown':
                    if (lastDirection.current[1] !== -1) setDirection([0, 1]);
                    break;
                case 'ArrowLeft':
                    if (lastDirection.current[0] !== 1) setDirection([-1, 0]);
                    break;
                case 'ArrowRight':
                    if (lastDirection.current[0] !== -1) setDirection([1, 0]);
                    break;
                case ' ':
                    setGameState(prev => {
                        if (prev === 'RUNNING') return 'PAUSED';
                        if (prev === 'PAUSED') return 'RUNNING';
                        if (prev === 'START' || prev === 'GAMEOVER') {
                           // We need to trigger reset manually if space is hit here, 
                           // but usually space just pauses. Let's keep it simple.
                           return prev; 
                        }
                        return prev;
                    });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const gameLoop = setInterval(moveSnake, SPEED);
        return () => clearInterval(gameLoop);
    }, [moveSnake]);

    const startGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood([5, 5]);
        setDirection(INITIAL_DIRECTION);
        setGameState('RUNNING');
        setScore(0);
        lastDirection.current = INITIAL_DIRECTION;
    };

    // --- Render Helpers ---

    const StatusOrb = ({ active, color }) => (
        <div className={`w-3 h-3 rounded-full border border-gray-600 ${active ? color : 'bg-gray-800'}`} />
    );

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] font-[Tahoma,sans-serif] overflow-hidden">
            {/* Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 p-2 overflow-hidden">
                
                {/* Left: The Radar/Game Grid */}
                <div className={`flex-[2] relative ${BEVEL_IN} bg-black p-[2px] h-full flex items-center justify-center`}>
                    <div 
                        className="relative"
                        style={{ 
                            width: 'min(100%, 340px)', 
                            aspectRatio: '1/1',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                            backgroundImage: 'linear-gradient(rgba(0, 50, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 50, 0, 0.5) 1px, transparent 1px)',
                            backgroundSize: '17px 17px'
                        }}
                    >
                        {/* CRT Scanline Overlay Effect */}
                        <div className="absolute inset-0 pointer-events-none z-10 opacity-10" 
                                style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

                        {/* Food (Target) */}
                        <div 
                            className="bg-red-600 rounded-sm animate-pulse shadow-[0_0_10px_#f00]"
                            style={{ gridColumnStart: food[0] + 1, gridRowStart: food[1] + 1 }}
                        />
                        
                        {/* Snake (Agent) */}
                        {snake.map((segment, i) => (
                            <div 
                                key={i}
                                className={`${i === 0 ? 'bg-green-400 z-10' : 'bg-green-700'} border border-black/30`}
                                style={{ gridColumnStart: segment[0] + 1, gridRowStart: segment[1] + 1 }}
                            >
                                {i === 0 && <div className="w-full h-full opacity-50 bg-white/30" />}
                            </div>
                        ))}

                        {/* OVERLAYS */}
                        {gameState === 'START' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 text-green-500 font-mono flex-col text-center p-4">
                                <h2 className="text-lg font-bold mb-4 tracking-widest text-white">MISSION BRIEFING</h2>
                                <p className="text-[10px] mb-4">COLLECT INTEL (RED TARGETS)<br/>WALLS ARE PERMEABLE // WATCH YOUR TAIL</p>
                                <button onClick={startGame} className={`px-4 py-1 bg-[#c0c0c0] text-black font-sans ${BEVEL_OUT} active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#ffffff,inset_2px_2px_#808080,inset_-2px_-2px_#dfdfdf] text-xs`}>ACCEPT MISSION</button>
                            </div>
                        )}

                        {gameState === 'PAUSED' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                <div className={`bg-[#c0c0c0] p-1 ${BEVEL_OUT} w-40 text-xs`}>
                                    <div className={`${BLUE_HEADER} text-white px-1 mb-2`}>System Alert</div>
                                    <div className="text-center p-2 text-black translate-y-[1px]">
                                        Transmission Paused...
                                    </div>
                                    <div className="flex justify-center pb-2">
                                        <button onClick={() => setGameState('RUNNING')} className={`px-4 py-1 bg-[#c0c0c0] text-black ${BEVEL_OUT} active:shadow-inset text-[10px]`}>RESUME</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {gameState === 'GAMEOVER' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 z-20 backdrop-blur-[2px]">
                                <div className={`bg-[#c0c0c0] p-1 ${BEVEL_OUT} w-48 text-xs`}>
                                    <div className={`${BLUE_HEADER} text-white px-1 mb-2 flex justify-between`}>
                                        <span>CRITICAL FAILURE</span>
                                        <span>X</span>
                                    </div>
                                    <div className="text-center p-4 flex flex-col items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg border-2 border-red-800">!</div>
                                        <p className="text-black font-bold">SIGNAL LOST</p>
                                        <div className="text-black text-[10px] space-y-1">
                                            <p>Intel Secured: {score}</p>
                                            <p className="text-blue-800 font-bold">Record: {highScore}</p>
                                        </div>
                                        <button onClick={startGame} className={`mt-2 px-6 py-1 bg-[#c0c0c0] text-black ${BEVEL_OUT} active:shadow-inset text-[10px]`}>RETRY</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Spy Dossier / Controls */}
                <div className="flex-1 flex flex-col gap-2 min-w-[140px] h-full overflow-hidden">
                    
                    {/* Status Panel */}
                    <div className={`flex-1 ${BEVEL_IN} bg-[#fff] p-3 flex flex-col gap-2`}>
                        <h3 className="font-bold border-b-2 border-gray-300 pb-1 text-[11px] text-gray-700">MISSION STATUS</h3>
                        
                        <div className="flex justify-between items-center text-[10px]">
                            <span>STATUS:</span>
                            <span className={`font-mono font-bold ${gameState === 'RUNNING' ? 'text-green-600' : 'text-red-600'}`}>
                                {gameState}
                            </span>
                        </div>

                        <div className="bg-gray-100 border border-gray-400 p-2">
                            <div className="text-[9px] text-gray-500 mb-0.5">INTEL PACKETS</div>
                            <div className="font-mono text-2xl text-right text-black tracking-widest leading-none">
                                {score.toString().padStart(3, '0')}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-2">
                            <div className="text-[9px] text-blue-600 mb-0.5">ESTABLISHED RECORD</div>
                            <div className="font-mono text-xl text-right text-blue-900 tracking-widest leading-none">
                                {highScore.toString().padStart(3, '0')}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[8px] uppercase">Encryption</span>
                                <StatusOrb active={gameState === 'RUNNING'} color="bg-green-500" />
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[8px] uppercase">Uplink</span>
                                <StatusOrb active={true} color="bg-orange-400 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Controls Hint */}
                    <div className={`${BEVEL_IN} bg-gray-200 p-2 text-[9px] font-mono leading-tight`}>
                        <p> KEYS: ARROWS</p>
                        <p> PAUSE: SPACE</p>
                    </div>

                </div>
            </div>

            {/* Status Bar */}
            <div className={`mt-auto ${BEVEL_IN} py-0.5 px-2 flex gap-4 text-[10px] text-gray-600 bg-[#c0c0c0]`}>
                <span className="flex-1">Secure Uplink Established</span>
                <span className={`win95-border-inset px-2 bg-gray-100 w-16 text-center shadow-none border-gray-400`}>OP_SNK</span>
            </div>
        </div>
    );
};

export default SnakeGame;