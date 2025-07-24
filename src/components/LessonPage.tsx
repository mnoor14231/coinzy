'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { useCharacterStore } from '@/store/characterStore';
import XPProgress from './XPProgress';
import Amazing3DCharacter from './Amazing3DCharacter';
import Confetti from 'react-confetti';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useEnhancedSounds } from '@/hooks/useEnhancedSounds';
import { Volume2, VolumeX, RotateCcw, LogOut } from 'lucide-react';

type StoryPhase = 'intro' | 'situation' | 'question' | 'result' | 'outcome';

const LessonPage: React.FC = () => {
  const { questions, currentQuestionIndex, addXP, completeQuestion, updateStreak } = useGameStore();
  const { logout, currentUser } = useAuthStore();
  const { selectedCharacter } = useCharacterStore();
  const router = useRouter();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [characterEmotion, setCharacterEmotion] = useState<'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating'>('idle');
  const [characterAction, setCharacterAction] = useState<'idle' | 'speaking' | 'celebrating' | 'thinking' | 'encouraging'>('idle');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const { speakWithCharacter, speakGreeting, stop, isSpeaking, isProcessing } = useEnhancedVoice();
  const { playSound } = useEnhancedSounds();
  const currentQuestion = questions[currentQuestionIndex];

  // Auto-select character if none selected (single character system)
  useEffect(() => {
    if (isMounted && !selectedCharacter) {
      // Character is auto-selected in the store, no need to redirect
      console.log('Character should be auto-selected');
    }
  }, [selectedCharacter, router, isMounted]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    updateStreak();
  }, [updateStreak, isMounted]);

  // Greet ONLY ONCE when character is first loaded
  useEffect(() => {
    if (!isMounted || !selectedCharacter || !audioEnabled || hasGreeted) return;
    
    // Greet and ask to start playing - ONLY ONCE
    setTimeout(() => {
      speakWithCharacter(
        'مرحباً بك! هيا نلعب ونتعلم عن المال معاً. هل أنت مستعد؟',
        selectedCharacter,
        'happy'
      );
      setHasGreeted(true);
    }, 1000);
  }, [selectedCharacter, audioEnabled, isMounted, speakWithCharacter, hasGreeted]);

  // Update character emotion based on speaking state
  useEffect(() => {
    if (!isMounted || !selectedCharacter) return;
    
    if (isSpeaking) {
      setCharacterEmotion('speaking');
      setCharacterAction('speaking');
    } else {
      if (showResult && selectedAnswer !== null && currentQuestion) {
        const isCorrect = currentQuestion.options[selectedAnswer].isCorrect;
        setCharacterEmotion(isCorrect ? 'celebrating' : 'encouraging');
        setCharacterAction(isCorrect ? 'celebrating' : 'encouraging');
      } else if (showQuestion) {
        setCharacterEmotion('thinking');
        setCharacterAction('thinking');
      } else {
        setCharacterEmotion('idle');
        setCharacterAction('idle');
      }
    }
  }, [isSpeaking, showResult, showQuestion, selectedAnswer, currentQuestion, isMounted, selectedCharacter]);

  const handleStartPlaying = () => {
    if (!selectedCharacter || !currentQuestion) return;
    
    setShowQuestion(true);
    setCharacterEmotion('thinking');
    setCharacterAction('thinking');
    
    // Character asks the question
    if (audioEnabled) {
      setTimeout(() => {
        speakWithCharacter(
          currentQuestion.question,
          selectedCharacter,
          'thinking'
        );
      }, 500);
    }
  };

  // Step 1: When child clicks a choice, just select it and read it aloud
  const handleAnswerSelect = (answerIndex: number) => {
    if (!showQuestion || !selectedCharacter || !currentQuestion || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowConfirmButton(true);
    setCharacterEmotion('speaking');
    setCharacterAction('speaking');
    
    const selectedOption = currentQuestion.options[answerIndex];
    
    // Character reads the choice aloud
    if (audioEnabled) {
      speakWithCharacter(
        `اخترت: ${selectedOption.text}. هل أنت متأكد من إجابتك؟`,
        selectedCharacter,
        'speaking'
      );
    }
  };

  // Step 2: When child clicks "Sure/Confirm", process the answer
  const handleConfirmAnswer = () => {
    if (!selectedCharacter || !currentQuestion || selectedAnswer === null) return;
    
    setShowConfirmButton(false);
    setShowResult(true);
    
    const selectedOption = currentQuestion.options[selectedAnswer];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setShowConfetti(true);
      setCharacterEmotion('celebrating');
      setCharacterAction('celebrating');
      
      // Only celebration sound for correct answers
      playSound('celebration', selectedCharacter);
      addXP(currentQuestion.xpReward);
      completeQuestion(currentQuestion.id);
      
      // Character celebrates and gives feedback
      if (audioEnabled) {
        setTimeout(() => {
          speakWithCharacter(
            `${selectedOption.feedback} أحسنت! إجابة ممتازة!`,
            selectedCharacter,
            'celebrating'
          );
        }, 500);
      }
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } else {
      setCharacterEmotion('encouraging');
      setCharacterAction('encouraging');
      
      // Only wrong sound for incorrect answers
      playSound('error', selectedCharacter);
      
      // Character provides encouraging feedback
      if (audioEnabled) {
        setTimeout(() => {
          speakWithCharacter(
            `${selectedOption.feedback} لا تقلق، سنتعلم معاً!`,
            selectedCharacter,
            'encouraging'
          );
        }, 500);
      }
    }
  };

  // Allow child to change their selection
  const handleChangeSelection = () => {
    setSelectedAnswer(null);
    setShowConfirmButton(false);
    setCharacterEmotion('thinking');
    setCharacterAction('thinking');
    
    if (audioEnabled) {
      setTimeout(() => {
        speakWithCharacter(
          'اختر إجابة أخرى إذا أردت',
          selectedCharacter!,
          'encouraging'
        );
      }, 200);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedCharacter) return;
    
    setSelectedAnswer(null);
    setShowQuestion(false);
    setShowResult(false);
    setShowConfirmButton(false);
    setCharacterEmotion('idle');
    setCharacterAction('idle');
  };

  const handleRepeatQuestion = () => {
    if (!audioEnabled || !currentQuestion || !selectedCharacter) return;
    
    setCharacterEmotion('speaking');
    setCharacterAction('speaking');
    
    // Only repeat the current question if we're in question mode
    if (showQuestion && currentQuestion) {
      speakWithCharacter(
        currentQuestion.question,
        selectedCharacter,
        'thinking'
      );
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Will auto-speak when audio is re-enabled
    } else {
      stop();
    }
  };

  const handleLogout = () => {
    logout();
  };



  // Show loading during SSR
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🪙</div>
          <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  // Redirect if no character selected
  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">🎭</div>
          <div className="text-xl font-bold">جاري التوجيه لاختيار الشخصية<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6 flex items-center justify-center">
        <div className="text-center">
          <Amazing3DCharacter 
            character={selectedCharacter}
            emotion="celebrating" 
            size="large"
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
          />
          <div className="card sparkle mt-6">
            <h2 className="text-3xl font-bold gradient-text mb-4">أحسنت!</h2>
            <p className="text-gray-600 text-lg">لقد أكملت جميع الأسئلة المتاحة</p>
            <div className="mt-6">
              <span className="text-4xl">🏆✨🌟</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-28 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 animate-gradient">
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 15 + 10}s`
            }}
          />
        ))}
      </div>

      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 400}
          height={typeof window !== 'undefined' ? window.innerHeight : 800}
          recycle={false}
          numberOfPieces={300}
          gravity={0.1}
        />
      )}
      
      {/* Enhanced Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            audioEnabled 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-400 text-white hover:bg-gray-500'
          }`}
        >
          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <div className="flex gap-2">
          <button
              onClick={handleRepeatQuestion}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
              title="إعادة السؤال"
            >
              <RotateCcw size={20} />
            </button>

          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
            title="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Floating background elements */}
      <div className="fixed top-20 left-5 w-16 h-16 bg-yellow-300/30 rounded-full blur-xl animate-ping delay-500" />
      <div className="fixed top-40 right-3 w-12 h-12 bg-pink-300/30 rounded-full blur-xl animate-ping delay-1000" />
      
      <div className="max-w-md mx-auto space-y-8 mt-16">
        {/* Enhanced Header */}
        <div className="text-center py-4">
          <div className="relative">
            <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
              <span className="emoji-bounce text-4xl mr-3">{currentQuestion.emoji}</span>
              <span className="gradient-text">{currentQuestion.title}</span>
            </h1>
            <div className="text-white/80 font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              السؤال {currentQuestionIndex + 1} من {questions.length} • مع {selectedCharacter.nameArabic}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="transform hover:scale-105 transition-transform duration-300">
          <XPProgress />
        </div>

        {/* Enhanced Character */}
        <div className="text-center">
          <Amazing3DCharacter 
            character={selectedCharacter}
            emotion={characterEmotion}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            size="large"
          />
        </div>

        {/* Enhanced Welcome Message */}
        {!showQuestion && !showResult && (
          <div className="ultra-modern-card rounded-3xl modern-shadow">
            <div className="text-center p-8">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">👋</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                  أهلاً وسهلاً!
                </h2>
              </div>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                {selectedCharacter.nameArabic} مستعد لتعليمك أشياء مهمة عن المال بطريقة ممتعة!
              </p>
              <button
                onClick={handleStartPlaying}
                className="btn-primary w-full text-xl py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-500 modern-shadow rounded-2xl"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl animate-pulse">🎮</span>
                  هيا نبدأ اللعب!
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Question Display */}
        {showQuestion && !showResult && (
          <div className="ultra-modern-card rounded-3xl modern-shadow">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-pulse">💭</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
                فكر معي
              </h2>
              <p className="text-white/80 text-sm font-medium">
                {selectedCharacter.nameArabic} يسألك سؤالاً مهماً
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-3xl mb-8 border-2 border-white/20">
              <p className="text-xl leading-relaxed text-white text-center font-bold">
                {currentQuestion.question}
              </p>
            </div>

            {/* Enhanced Answer Options */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white text-center mb-6">
                اختر الإجابة الصحيحة:
              </h3>
              
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-6 rounded-3xl border-2 text-right font-bold transition-all duration-500 transform modern-shadow
                    ${selectedAnswer === index 
                      ? 'glass-morphism border-yellow-400 text-white scale-105 ring-4 ring-yellow-400/50' 
                      : 'glass-morphism border-white/30 text-white hover:border-yellow-300/50 hover:scale-105 hover:ring-2 hover:ring-white/30'
                    } 
                    ${showResult ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 hover:shadow-2xl'}`}
                  style={{
                    background: selectedAnswer === index 
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))' 
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg leading-relaxed flex-1 pr-4">{option.text}</span>
                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">
                        {selectedAnswer === index ? '✅' : '💡'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Confirm Selection Buttons */}
            {showConfirmButton && selectedAnswer !== null && (
              <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
                <div className="card bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🤔</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-3">
                      اخترت: &ldquo;{currentQuestion.options[selectedAnswer].text}&rdquo;
                    </h3>
                    <p className="text-blue-600 mb-4">هل أنت متأكد من إجابتك؟</p>
                    
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleConfirmAnswer}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                      >
                        <span className="text-lg">✅ نعم، متأكد</span>
                      </button>
                      
                      <button
                        onClick={handleChangeSelection}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                      >
                        <span className="text-lg">🔄 أريد التغيير</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Display */}
        {showResult && selectedAnswer !== null && (
          <div className="space-y-6">
            <div className={`card text-center p-6 ${
              currentQuestion.options[selectedAnswer].isCorrect 
                ? `bg-gradient-to-r ${selectedCharacter.color}` 
                : 'bg-gradient-to-r from-orange-400 to-orange-500'
            }`}>
              <div className="text-5xl mb-3">
                {currentQuestion.options[selectedAnswer].isCorrect ? '🎉' : '💭'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {currentQuestion.options[selectedAnswer].isCorrect 
                  ? 'ممتاز! إجابة صحيحة!' 
                  : 'لا بأس، تعلمنا شيئاً جديداً!'}
              </h3>
              <p className="text-white text-lg mb-4">
                {currentQuestion.options[selectedAnswer].feedback}
              </p>
              {currentQuestion.options[selectedAnswer].isCorrect && (
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                  <p className="text-white font-bold">
                    +{currentQuestion.xpReward} نقطة خبرة ⭐
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full btn-primary text-xl py-4"
            >
              {currentQuestionIndex < questions.length - 1 ? '➡️ السؤال التالي' : '🏆 إنهاء'}
            </button>
          </div>
        )}

        {/* Question Progress */}
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-gray-700">🎯 تقدمك مع {selectedCharacter.nameArabic}</span>
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold">
              {questions.filter(q => q.completed).length} / {questions.length}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(questions.filter(q => q.completed).length / questions.length) * 100}%` 
              }}
            />
          </div>
          <div className="text-center mt-3">
            <span className="text-3xl">
              {Array.from({length: questions.filter(q => q.completed).length}, (_, i) => '⭐').join('')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage; 