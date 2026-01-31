import React, { useState, useEffect } from 'react';

const PasswordGame = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [rules, setRules] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [wordleWord, setWordleWord] = useState('');
    const [colorHex, setColorHex] = useState(null);
    const [wordleGuesses, setWordleGuesses] = useState(Array(6).fill(''));
    const [currentGuess, setCurrentGuess] = useState(0);
    const [showWordle, setShowWordle] = useState(false);
    const [wordleCompleted, setWordleCompleted] = useState(false);
    const [completedWordleWord, setCompletedWordleWord] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Sample data
    const wordleWords = ['CRANE', 'SLATE', 'CRATE', 'INDIA', 'AUDIO'];
    const today = new Date();
    const dateFormats = [
        `${today.getDate()}/${today.getMonth() + 1}`,
        `${today.getDate()}.${today.getMonth() + 1}`,
        `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`
    ];

    // Generate a random color
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Check if a number is prime
    const isPrime = (num) => {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    };

    // Check if a string contains a palindrome of at least 3 characters
    const hasPalindrome = (str) => {
        for (let i = 0; i <= str.length - 3; i++) {
            const substr = str.substring(i, i + 3);
            if (substr === substr.split('').reverse().join('')) {
                return true;
            }
        }
        return false;
    };

    // Reset the entire game state
    const resetGame = () => {
        setPassword('');
        setCurrentLevel(0);
        setHasStartedTyping(false);
        setWordleGuesses(Array(6).fill(''));
        setCurrentGuess(0);
        setShowWordle(false);
        setWordleCompleted(false);
        setCompletedWordleWord('');
        // Generate new Wordle word
        setWordleWord(wordleWords[Math.floor(Math.random() * wordleWords.length)]);
        // Generate new color
        setColorHex(generateRandomColor());
        // Reinitialize rules
        initializeRules();
    };

    // Initialize rules
    const initializeRules = () => {
        const initialRules = [
            {
                id: 1,
                description: "Must be at least 5 characters long",
                status: "pending",
                validate: (pw) => pw.length >= 5
            },
            {
                id: 2,
                description: "Must contain a number (0-9)",
                status: "pending",
                validate: (pw) => /\d/.test(pw)
            },
            {
                id: 3,
                description: "Must contain an uppercase letter (A-Z)",
                status: "pending",
                validate: (pw) => /[A-Z]/.test(pw)
            },
            {
                id: 4,
                description: "Must contain a special character (!@#$%^&*)",
                status: "pending",
                validate: (pw) => /[!@#$%^&*]/.test(pw)
            },
            {
                id: 5,
                description: `Must include its length (${password.length}) as a number`,
                status: "pending",
                validate: (pw) => pw.includes(pw.length.toString())
            },
            {
                id: 6,
                description: "Length must be divisible by 5",
                status: "pending",
                validate: (pw) => pw.length % 5 === 0
            },
            {
                id: 7,
                description: `Must include today's date (${dateFormats[0]})`,
                status: "pending",
                validate: (pw) => dateFormats.some(format => pw.includes(format))
            },
            {
                id: 8,
                description: "Sum of digits must be a prime number",
                status: "pending",
                validate: (pw) => {
                    const digitSum = pw.split('').reduce((sum, char) => {
                        if (/\d/.test(char)) return sum + parseInt(char);
                        return sum;
                    }, 0);
                    return isPrime(digitSum);
                }
            },
            {
                id: 9,
                description: "Must not contain lowercase vowels (a,e,i,o,u)",
                status: "pending",
                validate: (pw) => !/[aeiou]/.test(pw)
            },
            {
                id: 10,
                description: "No character should appear 3 times in a row",
                status: "pending",
                validate: (pw) => !/(.)\1\1/.test(pw)
            },
            {
                id: 11,
                description: "Must not start with special char but must end with one",
                status: "pending",
                validate: (pw) => !/^[!@#$%^&*]/.test(pw) && /[!@#$%^&*]$/.test(pw)
            },
            {
                id: 12,
                description: "Must have even number of letters (A-Za-z)",
                status: "pending",
                validate: (pw) => (pw.match(/[A-Za-z]/g) || []).length % 2 === 0
            },
            {
                id: 13,
                description: "Must contain a palindrome of 3+ characters",
                status: "pending",
                validate: (pw) => hasPalindrome(pw)
            },
            {
                id: 14,
                description: "Your password must include the hex code of the shown color.",
                status: "pending",
                validate: (pw) => {
                    if (!colorHex) return false;
                    const hexPattern = new RegExp(colorHex.slice(1), 'i');
                    return hexPattern.test(pw);
                }
            },
            {
                id: 15,
                description: "Must include the Wordle answer (click to play)",
                status: "pending",
                validate: (pw) => {
                    // If Wordle hasn't been completed yet, this rule can't be satisfied
                    if (!wordleCompleted || !completedWordleWord) {
                        return false;
                    }
                    // Check if the password contains the completed Wordle word (case-insensitive)
                    const pwUpper = pw.toUpperCase();
                    const wordUpper = completedWordleWord.toUpperCase();
                    return pwUpper.includes(wordUpper);
                },
                action: () => setShowWordle(true)
            }
        ];
        setRules(initialRules);
    };

    // Initialize game on mount
    useEffect(() => {
        setWordleWord(wordleWords[Math.floor(Math.random() * wordleWords.length)]);
        setColorHex(generateRandomColor());
        initializeRules();
    }, []);

    // Update Rule 14's validate function whenever colorHex changes
    useEffect(() => {
        if (colorHex) {
            setRules(prevRules =>
                prevRules.map(rule =>
                    rule.id === 14
                        ? {
                            ...rule,
                            validate: (pw) => {
                                const hexPattern = new RegExp(colorHex.slice(1), 'i');
                                return hexPattern.test(pw);
                            }
                        }
                        : rule
                )
            );
        }
    }, [colorHex]);

    // Update Rule 15's validate function when Wordle is completed
    useEffect(() => {
        if (wordleCompleted && completedWordleWord) {
            setRules(prevRules =>
                prevRules.map(rule =>
                    rule.id === 15
                        ? {
                            ...rule,
                            validate: (pw) => {
                                const pwUpper = pw.toUpperCase();
                                const wordUpper = completedWordleWord.toUpperCase();
                                return pwUpper.includes(wordUpper);
                            }
                        }
                        : rule
                )
            );
        }
    }, [wordleCompleted, completedWordleWord]);

    // When Rule 14 becomes visible, generate a color if not already set
    useEffect(() => {
        if (
            rules.some(rule => rule.id === 14 && rule.id <= currentLevel) &&
            !colorHex
        ) {
            const newColor = generateRandomColor();
            setColorHex(newColor);
        }
    }, [currentLevel, rules, colorHex]);

    // Evaluate rules when password or dependencies change
    useEffect(() => {
        if (password.length > 0 && !hasStartedTyping) {
            setHasStartedTyping(true);
            setCurrentLevel(1);
        }

        if (hasStartedTyping) {
            const updatedRules = rules.map(rule => {
                if (rule.id <= currentLevel) {
                    const isValid = rule.validate(password);
                    return {
                        ...rule,
                        status: isValid ? 'passed' : rule.status === 'passed' ? 'violated' : 'pending',
                        description: rule.id === 5 ? `Must include its length (${password.length}) as a number` : rule.description
                    };
                }
                return rule;
            });
            setRules(updatedRules);

            // Check if all current level rules are passed to advance
            const allCurrentRulesPassed = updatedRules
                .filter(rule => rule.id <= currentLevel)
                .every(rule => rule.status === 'passed');

            if (allCurrentRulesPassed && currentLevel < 15) {
                setCurrentLevel(currentLevel + 1);
                const nextRule = updatedRules.find(r => r.id === currentLevel + 1);
                if (nextRule?.action) nextRule.action();
            }
        }
    }, [password, hasStartedTyping, currentLevel, completedWordleWord, wordleCompleted]);

    const getLetterColor = (letter, index) => {
        if (!letter) return 'bg-[#111111] border border-[#33ff33] text-[#33ff33]';
        if (wordleWord[index] === letter) return 'bg-[#33ff33] text-black border border-[#33ff33] font-bold';
        if (wordleWord.includes(letter)) return 'bg-yellow-600 text-black border border-yellow-600';
        return 'bg-[#222] border border-gray-600 text-gray-400';
    };

    const handleWordleSubmit = (guess) => {
        const newGuesses = [...wordleGuesses];
        newGuesses[currentGuess] = guess;
        setWordleGuesses(newGuesses);

        if (guess === wordleWord) {
            setWordleCompleted(true);
            setCompletedWordleWord(wordleWord);
            setShowWordle(false);

            // Force immediate rule re-evaluation by updating the rules
            setTimeout(() => {
                setRules(prevRules =>
                    prevRules.map(rule => {
                        if (rule.id === 15) {
                            return {
                                ...rule,
                                validate: (pw) => {
                                    const pwUpper = pw.toUpperCase();
                                    const wordUpper = wordleWord.toUpperCase();
                                    return pwUpper.includes(wordUpper);
                                }
                            };
                        }
                        return rule;
                    })
                );
            }, 100);
        } else if (currentGuess < 5) {
            setCurrentGuess(currentGuess + 1);
        } else {
            setTimeout(() => {
                // Reset wordle part for retry
                setWordleGuesses(Array(6).fill(''));
                setCurrentGuess(0);
            }, 1500)
        }
    };

    const handleSubmit = async () => {
        if (rules.every(rule => rule.status === 'passed')) {
            setShowSuccessModal(true);
            if (onComplete) onComplete();
        }
    };

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, "");
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return `RGB(${r}, ${g}, ${b})`;
    }

    // Only show relevant rules
    const visibleRules = rules
        .filter(rule => rule.id <= currentLevel || rule.status === 'passed')
        .sort((a, b) => b.id - a.id);

    return (
        <div className="bg-black text-[#33ff33] w-full h-full flex flex-col font-mono text-sm relative selection:bg-[#33ff33] selection:text-black">
            {/* Retro CRT Scanline Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] contrast-125 brightness-110 opacity-20"></div>

            {/* Header */}
            <div className="border-b-2 border-[#33ff33] p-4 text-center flex justify-between items-center bg-[#001100]">
                <h2 className="text-xl font-bold uppercase tracking-[0.2em] animate-pulse flex-1 text-center pl-8">
                    &gt;&gt; ACCESS CONTROL_
                </h2>
                <button
                    onClick={() => window.open('/password-game', '_blank')}
                    className="text-xs border border-[#33ff33] px-2 py-1 hover:bg-[#33ff33] hover:text-black uppercase"
                    title="Open in New Tab"
                >
                    ↗ OPEN_TAB
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            background: #001100;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #33ff33;
            border: 1px solid #000;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #002200;
            border-left: 1px solid #33ff33;
          }
        `}</style>

                <div className="max-w-3xl mx-auto space-y-6 pb-20">
                    {/* Input Section */}
                    <div className="border-2 border-[#33ff33] p-1 bg-[#001100]">
                        <div className="flex items-center gap-2 p-2 relative">
                            <span className="text-[#33ff33] font-bold animate-pulse">&gt;</span>
                            <input
                                type="text"
                                className="w-full bg-transparent border-none outline-none text-[#33ff33] text-lg font-mono placeholder-[#33ff33]/30"
                                placeholder="ENTER_PASSWORD..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 border border-[#33ff33] px-2 py-0.5 text-xs bg-black">
                                LEN: {password.length}
                            </div>
                        </div>
                    </div>

                    {/* Rules Feed */}
                    <div className="space-y-3">
                        {visibleRules.map((rule) => {
                            // Check completion state
                            const isPassed = rule.status === 'passed';
                            const isCurrent = rule.id === currentLevel;
                            const isViolated = rule.status === 'violated';

                            return (
                                <div
                                    key={rule.id}
                                    className={`border-l-4 p-3 transition-all duration-300 ${isPassed
                                        ? 'border-[#33ff33] bg-[#002200]/50 opacity-60 hover:opacity-100'
                                        : isCurrent
                                            ? 'border-yellow-500 bg-[#332200]/30'
                                            : 'border-red-600 bg-[#220000]/30'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`px-2 py-0.5 text-xs font-bold border ${isPassed ? 'border-[#33ff33] text-[#33ff33]' :
                                            isCurrent ? 'border-yellow-500 text-yellow-500' :
                                                'border-red-600 text-red-600'
                                            }`}>
                                            RULE_{String(rule.id).padStart(2, '0')}
                                        </div>

                                        <div className="flex-1">
                                            <p className={`text-sm ${isPassed ? 'text-[#33ff33] line-through decoration-1 opacity-70' :
                                                isCurrent ? 'text-yellow-500 font-bold' :
                                                    'text-red-500'
                                                }`}>
                                                {rule.description}
                                            </p>

                                            {/* --- SPECIAL GAME INTEGRATIONS --- */}

                                            {/* WORDLE Integration */}
                                            {rule.id === 15 && showWordle && (
                                                <div className="mt-4 border border-[#33ff33] p-4 bg-black w-full max-w-sm mx-auto">
                                                    <div className="text-center text-xs mb-2 text-[#33ff33]/70">-- SECURE WORD DECRYPTION --</div>
                                                    <div className="space-y-1 mb-4 flex flex-col items-center">
                                                        {wordleGuesses.map((guess, guessIndex) => (
                                                            <div key={guessIndex} className="flex gap-1 justify-center">
                                                                {Array(5).fill(0).map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${guessIndex < currentGuess ? getLetterColor(guess[i], i) : 'border border-[#33ff33]/30 text-[#33ff33]'
                                                                            }`}
                                                                    >
                                                                        {guess[i] || ''}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {currentGuess < 6 && !wordleCompleted && (
                                                        <div className="flex gap-2 justify-center mt-2">
                                                            <input
                                                                type="text"
                                                                value={wordleGuesses[currentGuess] || ''}
                                                                onChange={(e) => {
                                                                    const newGuesses = [...wordleGuesses];
                                                                    newGuesses[currentGuess] = e.target.value.toUpperCase().slice(0, 5);
                                                                    setWordleGuesses(newGuesses);
                                                                }}
                                                                maxLength={5}
                                                                className="w-24 bg-black border border-[#33ff33] text-[#33ff33] text-center p-1 uppercase outline-none focus:bg-[#002200]"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleWordleSubmit(wordleGuesses[currentGuess])}
                                                                disabled={wordleGuesses[currentGuess]?.length !== 5}
                                                                className="bg-[#33ff33] text-black px-3 py-1 text-xs font-bold hover:bg-white disabled:opacity-50"
                                                            >
                                                                ENTER
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Play Button for Wordle */}
                                            {rule.id === 15 && !showWordle && !wordleCompleted && (
                                                <button
                                                    onClick={() => setShowWordle(true)}
                                                    className="mt-2 text-xs border border-yellow-500 text-yellow-500 px-3 py-1 hover:bg-yellow-500 hover:text-black uppercase animate-pulse"
                                                >
                                                    [ INITIALIZE DECRYPTION ]
                                                </button>
                                            )}

                                            {/* Color Picker Integration */}
                                            {rule.id === 14 && colorHex && (
                                                <div className="mt-2 flex items-center gap-4 border border-[#33ff33]/30 p-2 bg-black/50">
                                                    <div className="w-12 h-12 border-2 border-white" style={{ backgroundColor: colorHex }}></div>
                                                    <div>
                                                        <div className="text-xs text-[#33ff33] mb-1">TARGET_COLOR_MATCH</div>
                                                        <div className="text-xs text-gray-400 font-mono">{hexToRgb(colorHex)}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setColorHex(generateRandomColor())}
                                                        className="ml-auto text-xs border border-[#33ff33] text-[#33ff33] px-2 py-1 hover:bg-[#33ff33] hover:text-black"
                                                    >
                                                        REROLL
                                                    </button>
                                                </div>
                                            )}


                                        </div>
                                        <div className={`text-lg font-bold ${isPassed ? 'text-[#33ff33]' : 'text-transparent'}`}>
                                            [OK]
                                        </div>
                                    </div>
                                </div>
                            );
                        })}


                        {/* Submit Button - Only visible when all rules are passed */}
                        {rules.every(r => r.status === 'passed') && (
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-4 mt-8 border-2 text-lg font-bold tracking-[0.2em] transition-all duration-200 uppercase
                            border-[#33ff33] bg-[#33ff33] text-black hover:bg-white hover:border-white cursor-pointer shadow-[0_0_20px_rgba(51,255,51,0.5)] animate-pulse`}
                            >
                                &gt;&gt; EXECUTE SEQUENCE &lt;&lt;
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="border-4 border-[#33ff33] bg-black p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(51,255,51,0.3)] relative overflow-hidden">
                        {/* Scanline background inside modal */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,0,0.03),rgba(0,255,0,0.01))] bg-[length:100%_4px,3px_100%]"></div>

                        <h3 className="text-3xl font-bold text-[#33ff33] mb-4 animate-pulse">MISSION ACCOMPLISHED</h3>
                        <div className="w-full h-1 bg-[#33ff33] mb-6"></div>
                        <p className="text-white font-mono text-sm mb-8 leading-relaxed">
                            ACCESS GRANTED.<br />
                            SYSTEM INTEGRITY VERIFIED.<br />
                            WELCOME TO THE NETWORK, AGENT.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                // Reset game or close app logic/callback could go here
                            }}
                            className="bg-[#33ff33] text-black font-bold py-3 px-8 text-lg hover:bg-white hover:scale-105 transition-transform uppercase tracking-widest"
                        >
                            PROCEED
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordGame;
