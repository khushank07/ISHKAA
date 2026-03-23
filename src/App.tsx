/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Keyboard, BookOpen, Settings, Info, ChevronRight, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from './lib/utils';
import { NOTES, KEY_TO_NOTE, SONG_ANUV_JAIN } from './constants';
import { harmoniumAudio } from './lib/audio';
import { NoteMode, SongNote } from './types';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [mode, setMode] = useState<'practice' | 'learn'>('practice');
  const [noteMode, setNoteMode] = useState<NoteMode>('Sargam');
  const [showHints, setShowHints] = useState(true);
  const [octaveShift, setOctaveShift] = useState(0);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Learn Mode State
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5
  const songTimerRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = useCallback((noteKey: string, freq: number) => {
    if (isMuted) return;
    setActiveKeys(prev => new Set(prev).add(noteKey));
    harmoniumAudio.playNote(freq, octaveShift);
  }, [isMuted, octaveShift]);

  const stopNote = useCallback((noteKey: string, freq: number) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(noteKey);
      return next;
    });
    harmoniumAudio.stopNote(freq, octaveShift);
  }, [octaveShift]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWelcome || showAbout) return;
      const key = e.key.toLowerCase();
      const note = NOTES.find(n => n.key === key);
      if (note && !activeKeys.has(key)) {
        playNote(key, note.frequency);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const note = NOTES.find(n => n.key === key);
      if (note) {
        stopNote(key, note.frequency);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKeys, playNote, stopNote, showWelcome, showAbout]);

  // Song Playback Logic
  const startSong = () => {
    setIsPlayingSong(true);
    playNextNote(currentSongIndex);
  };

  const pauseSong = () => {
    setIsPlayingSong(false);
    if (songTimerRef.current) clearTimeout(songTimerRef.current);
  };

  const resetSong = () => {
    pauseSong();
    setCurrentSongIndex(0);
  };

  const playNextNote = (index: number) => {
    if (index >= SONG_ANUV_JAIN.notes.length) {
      setIsPlayingSong(false);
      return;
    }

    const songNote = SONG_ANUV_JAIN.notes[index];
    setCurrentSongIndex(index);

    // Find the actual note to highlight
    const noteData = NOTES.find(n => n.sargam === songNote.note || n.western === songNote.note);
    
    // Auto-highlight logic for learning (optional, but requested)
    // In a real "learn" mode, we might wait for the user to press the key.
    // For now, let's just highlight it as a guide.

    const duration = songNote.duration / playbackSpeed;
    songTimerRef.current = setTimeout(() => {
      playNextNote(index + 1);
    }, duration);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3728] font-sans selection:bg-[#D4AF37]/20">
      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110%', x: `${i * 20}%`, rotate: 0 }}
            animate={{ 
              y: '-10%', 
              x: `${i * 20 + (Math.random() * 10 - 5)}%`,
              rotate: 360 
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2
            }}
            className="absolute text-[#D4AF37]"
          >
            <Music size={40 + Math.random() * 40} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col items-center justify-center text-center p-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl italic font-serif text-[#8B735B] mb-8"
            >
              "Some feelings are better played than spoken."
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-6xl font-bold tracking-widest text-[#4A3728] mb-2"
            >
              ISHKH <span className="text-[#D4AF37]">🎹</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="text-sm uppercase tracking-[0.3em] text-[#A68B6D] mb-12"
            >
              Welcome to ISHKH
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.5 }}
            >
              <button
                onClick={() => setShowWelcome(false)}
                className="px-10 py-4 bg-[#4A3728] text-[#FDFBF7] rounded-full hover:bg-[#5D4634] transition-all shadow-lg hover:shadow-xl active:scale-95 group flex items-center gap-3"
              >
                Start Playing
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-6 text-xs text-[#A68B6D] italic">made by khushank for ISHA &lt;3</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-[#4A3728]">ISHKH 🎹</h1>
            <p className="text-xs uppercase tracking-widest text-[#A68B6D]">Play Feelings Through Music</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full bg-white/50 hover:bg-white shadow-sm transition-all text-[#8B735B]"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={() => setShowAbout(true)}
              className="p-3 rounded-full bg-white/50 hover:bg-white shadow-sm transition-all text-[#8B735B]"
            >
              <Info size={20} />
            </button>
          </div>
        </header>

        {/* Mode Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#EFE9E1] p-1 rounded-2xl flex gap-1 shadow-inner">
            <button
              onClick={() => setMode('practice')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                mode === 'practice' ? "bg-white text-[#4A3728] shadow-sm" : "text-[#8B735B] hover:text-[#4A3728]"
              )}
            >
              <Keyboard size={18} />
              Practice Mode
            </button>
            <button
              onClick={() => setMode('learn')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                mode === 'learn' ? "bg-white text-[#4A3728] shadow-sm" : "text-[#8B735B] hover:text-[#4A3728]"
              )}
            >
              <BookOpen size={18} />
              Learn Songs
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-grow flex flex-col items-center">
          <AnimatePresence mode="wait">
            {mode === 'learn' ? (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-4xl"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#EFE9E1] mb-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Now Learning</span>
                      <h2 className="text-2xl font-bold text-[#4A3728]">{SONG_ANUV_JAIN.title}</h2>
                      <p className="text-sm text-[#8B735B]">{SONG_ANUV_JAIN.artist}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={resetSong}
                        className="p-3 rounded-xl bg-[#EFE9E1] hover:bg-[#E5DDD3] text-[#4A3728] transition-all"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <button 
                        onClick={isPlayingSong ? pauseSong : startSong}
                        className="px-6 py-3 rounded-xl bg-[#4A3728] text-white hover:bg-[#5D4634] transition-all flex items-center gap-2 shadow-md"
                      >
                        {isPlayingSong ? <Pause size={20} /> : <Play size={20} />}
                        {isPlayingSong ? 'Pause' : 'Play Song'}
                      </button>
                    </div>
                  </div>

                  {/* Lyrics & Note Guide */}
                  <div className="relative h-32 flex flex-col items-center justify-center overflow-hidden border-y border-[#EFE9E1] py-4">
                    <div className="text-center">
                      <motion.p 
                        key={currentSongIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-serif italic text-[#4A3728] mb-2"
                      >
                        {SONG_ANUV_JAIN.notes[currentSongIndex]?.lyrics}
                      </motion.p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase tracking-widest text-[#A68B6D]">Press Key</span>
                          <span className="text-xl font-bold text-[#D4AF37]">
                            {NOTES.find(n => n.sargam === SONG_ANUV_JAIN.notes[currentSongIndex]?.note)?.key.toUpperCase()}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-[#EFE9E1]" />
                        <div className="flex flex-col items-center opacity-50">
                          <span className="text-[10px] uppercase tracking-widest text-[#A68B6D]">Next</span>
                          <span className="text-sm font-bold">
                            {NOTES.find(n => n.sargam === SONG_ANUV_JAIN.notes[currentSongIndex + 1]?.note)?.key.toUpperCase() || '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EFE9E1]">
                      <motion.div 
                        className="h-full bg-[#D4AF37]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSongIndex + 1) / SONG_ANUV_JAIN.notes.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex gap-4">
                      {[0.5, 1, 1.5].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={cn(
                            "text-xs font-bold px-3 py-1 rounded-full transition-all",
                            playbackSpeed === speed ? "bg-[#D4AF37] text-white" : "bg-[#EFE9E1] text-[#8B735B]"
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-[#A68B6D]">Follow the highlighted keys below</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-4xl text-center mb-12"
              >
                <h2 className="text-2xl font-serif italic text-[#8B735B] mb-2">Free Practice Mode</h2>
                <p className="text-sm text-[#A68B6D]">Let your fingers find the melody.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Harmonium Keyboard */}
          <div className="relative mt-8 select-none">
            <div className="flex items-start bg-[#4A3728] p-4 rounded-b-2xl rounded-t-lg shadow-2xl border-t-8 border-[#5D4634]">
              <div className="flex gap-1">
                {NOTES.map((note, idx) => {
                  const isActive = activeKeys.has(note.key) || 
                    (mode === 'learn' && isPlayingSong && SONG_ANUV_JAIN.notes[currentSongIndex]?.note === note.sargam);
                  
                  if (note.type === 'white') {
                    return (
                      <div key={note.key} className="relative group">
                        <motion.button
                          onMouseDown={() => playNote(note.key, note.frequency)}
                          onMouseUp={() => stopNote(note.key, note.frequency)}
                          onMouseLeave={() => stopNote(note.key, note.frequency)}
                          className={cn(
                            "w-14 h-52 rounded-b-lg transition-all duration-75 relative flex flex-col justify-end items-center pb-6",
                            isActive 
                              ? "bg-[#EFE9E1] translate-y-1 shadow-inner" 
                              : "bg-white shadow-[0_6px_0_0_#E5DDD3] hover:bg-[#FDFBF7]"
                          )}
                        >
                          {showHints && (
                            <span className="text-[10px] font-bold text-[#A68B6D] mb-1 opacity-40 group-hover:opacity-100 uppercase">
                              {note.key}
                            </span>
                          )}
                          <span className={cn(
                            "text-sm font-bold transition-colors",
                            isActive ? "text-[#D4AF37]" : "text-[#4A3728]"
                          )}>
                            {noteMode === 'Sargam' ? note.sargam : note.western}
                          </span>
                        </motion.button>
                        
                        {/* Black Key Overlay */}
                        {NOTES[idx + 1]?.type === 'black' && (
                          <div className="absolute left-[70%] top-0 z-20">
                            <motion.button
                              onMouseDown={() => playNote(NOTES[idx + 1].key, NOTES[idx + 1].frequency)}
                              onMouseUp={() => stopNote(NOTES[idx + 1].key, NOTES[idx + 1].frequency)}
                              onMouseLeave={() => stopNote(NOTES[idx + 1].key, NOTES[idx + 1].frequency)}
                              className={cn(
                                "w-10 h-32 rounded-b-md transition-all duration-75 flex flex-col justify-end items-center pb-4",
                                (activeKeys.has(NOTES[idx + 1].key) || (mode === 'learn' && isPlayingSong && SONG_ANUV_JAIN.notes[currentSongIndex]?.note === NOTES[idx + 1].sargam))
                                  ? "bg-[#2A1F16] translate-y-1 shadow-inner" 
                                  : "bg-[#3D2E22] shadow-[0_4px_0_0_#1A130D] hover:bg-[#4A3728]"
                              )}
                            >
                              {showHints && (
                                <span className="text-[8px] font-bold text-[#8B735B] mb-1 opacity-40 uppercase">
                                  {NOTES[idx + 1].key}
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-[#EFE9E1]">
                                {noteMode === 'Sargam' ? NOTES[idx + 1].sargam : NOTES[idx + 1].western}
                              </span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-16 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/50 p-4 rounded-2xl border border-[#EFE9E1] flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#A68B6D] font-bold">Note Display</span>
              <div className="flex bg-[#EFE9E1] p-1 rounded-xl">
                {(['Sargam', 'Western'] as NoteMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setNoteMode(m)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      noteMode === m ? "bg-white text-[#4A3728] shadow-sm" : "text-[#8B735B]"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-2xl border border-[#EFE9E1] flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#A68B6D] font-bold">Octave Shift</span>
              <div className="flex items-center justify-between px-2">
                <button 
                  onClick={() => setOctaveShift(prev => Math.max(-1, prev - 1))}
                  className="w-8 h-8 rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#4A3728] hover:bg-[#D4AF37] hover:text-white transition-all"
                >
                  -
                </button>
                <span className="text-sm font-bold">{octaveShift === 0 ? 'Normal' : octaveShift > 0 ? `+${octaveShift}` : octaveShift}</span>
                <button 
                  onClick={() => setOctaveShift(prev => Math.min(1, prev + 1))}
                  className="w-8 h-8 rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#4A3728] hover:bg-[#D4AF37] hover:text-white transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-2xl border border-[#EFE9E1] flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#A68B6D] font-bold">Visual Hints</span>
              <button
                onClick={() => setShowHints(!showHints)}
                className={cn(
                  "w-full py-2 rounded-xl text-xs font-bold transition-all border-2",
                  showHints ? "bg-[#4A3728] text-white border-[#4A3728]" : "bg-transparent text-[#8B735B] border-[#EFE9E1]"
                )}
              >
                {showHints ? 'Hints Enabled' : 'Hints Disabled'}
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-[#EFE9E1] flex flex-col items-center gap-4">
          <p className="text-xs text-[#A68B6D] uppercase tracking-[0.4em]">made by khushank for ISHA &lt;3</p>
          <div className="flex gap-6 opacity-40">
            <Music size={16} />
            <div className="w-1 h-1 rounded-full bg-[#A68B6D]" />
            <Music size={16} />
            <div className="w-1 h-1 rounded-full bg-[#A68B6D]" />
            <Music size={16} />
          </div>
        </footer>
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#4A3728]/40 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FDFBF7] p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#4A3728] mb-6">About ISHKH</h2>
              <p className="text-[#8B735B] leading-relaxed mb-8">
                "This app was built with music and sincerity."
              </p>
              <div className="space-y-4 text-sm text-[#A68B6D] italic mb-10">
                <p className="font-bold text-[#D4AF37]">made by khushank for ISHA &lt;3</p>
                <p>A bridge between emotions and melody.</p>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="w-full py-4 bg-[#4A3728] text-white rounded-2xl hover:bg-[#5D4634] transition-all font-bold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
