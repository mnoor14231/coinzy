'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCharacterStore } from '@/store/characterStore';
import { useGameStore } from '@/store/gameStore';
import Navigation from '@/components/Navigation';
import AuthWrapper from '@/components/AuthWrapper';
import Amazing3DCharacter from '@/components/Amazing3DCharacter';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useEnhancedSounds } from '@/hooks/useEnhancedSounds';
import { BookOpen, Star, Trophy, Target, Clock, Award, LogOut } from 'lucide-react';
import Confetti from 'react-confetti';

// Course data structure
interface Course {
  id: string;
  title: string;
  ageGroup: string;
  skill: string;
  emoji: string;
  description: string;
  color: string;
  lessons: CourseLesson[];
  completed: boolean;
  xpReward: number;
}

interface CourseLesson {
  id: string;
  title: string;
  story: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  completed: boolean;
}

// Arabic financial literacy courses
const financialCourses: Course[] = [
  {
    id: 'course-4-5',
    title: 'الفهم الأساسي للمال',
    ageGroup: '٤–٥ سنوات',
    skill: 'التعرف على المال',
    emoji: '🪙',
    description: 'تعلم ما هو المال ولماذا نحتاجه',
    color: 'from-blue-400 to-cyan-500',
    xpReward: 50,
    completed: false,
    lessons: [
      {
        id: 'lesson-4-5-1',
        title: 'ما هو المال؟',
        story: 'ليلى تذهب مع ماما للمتجر. تريد شراء تفاحة. ماما تعطي البائع قطع معدنية صغيرة وورقة ملونة. البائع يعطي ليلى التفاحة ويبتسم.',
        question: 'فكر معي 🧠 ماذا أعطت ماما للبائع لتشتري التفاحة؟',
        options: [
          {
            text: 'لعبة جميلة',
            isCorrect: false,
            feedback: 'لا، اللعب لا نشتري بها الأشياء. نلعب بها!'
          },
          {
            text: 'مال (عملات وأوراق)',
            isCorrect: true,
            feedback: 'أحسنت! المال هو ما نستخدمه لشراء الأشياء التي نحتاجها'
          },
          {
            text: 'قصة جميلة',
            isCorrect: false,
            feedback: 'القصص جميلة لكن لا نشتري بها. نقرأها للمتعة!'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-4-5-2',
        title: 'لماذا نحتاج المال؟',
        story: 'أحمد جائع ويريد موزة. بابا يأخذه للمتجر. بابا يعطي البائع مالاً، والبائع يعطي أحمد موزة لذيذة. أحمد سعيد جداً!',
        question: 'فكر معي 🧠 لماذا احتاج بابا للمال؟',
        options: [
          {
            text: 'ليعطيه للبائع مجاناً',
            isCorrect: false,
            feedback: 'لا، المال ليس هدية. نعطي المال لنحصل على شيء نحتاجه'
          },
          {
            text: 'لشراء الموز لأحمد',
            isCorrect: true,
            feedback: 'ممتاز! نحتاج المال لشراء الطعام والأشياء المهمة'
          },
          {
            text: 'ليلعب به',
            isCorrect: false,
            feedback: 'المال ليس لعبة. هو شيء مهم نستخدمه للشراء'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-4-5-3',
        title: 'أين نحصل على المال؟',
        story: 'نور تسأل ماما: "من أين يأتي المال؟" ماما تقول: "بابا يذهب للعمل كل يوم، وعندما يعمل بجد يحصل على مال. هذا المال نستخدمه لشراء الطعام والملابس."',
        question: 'فكر معي 🧠 كيف يحصل بابا على المال؟',
        options: [
          {
            text: 'يجده في الشارع',
            isCorrect: false,
            feedback: 'لا، لا نجد المال في الشارع. المال نحصل عليه بالعمل'
          },
          {
            text: 'يعمل بجد في وظيفته',
            isCorrect: true,
            feedback: 'أحسنت! العمل الجاد هو الطريقة الصحيحة للحصول على المال'
          },
          {
            text: 'يطلبه من الجيران',
            isCorrect: false,
            feedback: 'لا، نحن لا نطلب المال من الناس. نعمل لنحصل عليه'
          }
        ],
        completed: false
      }
    ]
  },
  {
    id: 'course-6-7',
    title: 'الادخار واتخاذ القرار',
    ageGroup: '٦–٧ سنوات',
    skill: 'تعلم الادخار',
    emoji: '🏦',
    description: 'تعلم كيف ندخر المال ونتخذ قرارات ذكية',
    color: 'from-green-400 to-emerald-500',
    xpReward: 75,
    completed: false,
    lessons: [
      {
        id: 'lesson-6-7-1',
        title: 'ادخار لشراء لعبة',
        story: 'سارة تريد دراجة جديدة تكلف ١٠٠ ريال. ماما تعطيها ١٠ ريالات كل أسبوع. سارة تضع المال في حصالة على شكل خنزير وردي. بعد ١٠ أسابيع، صارت الحصالة ممتلئة!',
        question: 'فكر معي 🧠 كيف حصلت سارة على المال لشراء الدراجة؟',
        options: [
          {
            text: 'أخذت كل المال من ماما مرة واحدة',
            isCorrect: false,
            feedback: 'لا، هذا غير عادل. من الأفضل أن نجمع المال شيئاً فشيئاً'
          },
          {
            text: 'جمعت المال كل أسبوع في الحصالة',
            isCorrect: true,
            feedback: 'رائع! الادخار يعني جمع المال قليلاً قليلاً حتى نحصل على ما نريد'
          },
          {
            text: 'وجدت المال في الشارع',
            isCorrect: false,
            feedback: 'لا نأخذ مالاً من الشارع. نكسب المال بالعمل والادخار'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-6-7-2',
        title: 'الاختيار بين شيئين',
        story: 'معاذ لديه ٥٠ ريالاً. يرى في المتجر كرة قدم بـ ٥٠ ريالاً وكتاب قصص بـ ٣٠ ريالاً. إذا اشترى الكتاب، سيبقى معه ٢٠ ريالاً. إذا اشترى الكرة، لن يبقى معه شيء.',
        question: 'فكر معي 🧠 ماذا يجب أن يفعل معاذ؟',
        options: [
          {
            text: 'يشتري الكرة ولا يبقي شيئاً',
            isCorrect: false,
            feedback: 'قد يندم لاحقاً. من الأفضل أن نبقي بعض المال للطوارئ'
          },
          {
            text: 'يشتري الكتاب ويبقي ٢٠ ريالاً',
            isCorrect: true,
            feedback: 'قرار ذكي! شراء شيء أرخص والاحتفاظ ببعض المال فكرة ممتازة'
          },
          {
            text: 'لا يشتري أي شيء',
            isCorrect: false,
            feedback: 'يمكنه الاستمتاع بشراء شيء يحبه والادخار أيضاً'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-6-7-3',
        title: 'التخطيط للمستقبل',
        story: 'خالد يريد شراء حاسوب للدراسة يكلف ٥٠٠ ريال. يقرر أن يدخر ٥٠ ريالاً كل شهر من مصروفه. بعد ١٠ شهور، جمع المال كاملاً واشترى الحاسوب!',
        question: 'فكر معي 🧠 ما الذي ساعد خالد على شراء الحاسوب؟',
        options: [
          {
            text: 'التخطيط والصبر والادخار',
            isCorrect: true,
            feedback: 'ممتاز! التخطيط والصبر يساعداننا على تحقيق أهدافنا الكبيرة'
          },
          {
            text: 'طلب المال من أصدقائه',
            isCorrect: false,
            feedback: 'لا، الاعتماد على النفس أفضل من طلب المساعدة دائماً'
          },
          {
            text: 'انتظار هدية من أحد',
            isCorrect: false,
            feedback: 'الانتظار فقط لا يحقق الأهداف. العمل والادخار أهم'
          }
        ],
        completed: false
      }
    ]
  },
  {
    id: 'course-8-9',
    title: 'تحديد الأولويات والميزانية',
    ageGroup: '٨–٩ سنوات',
    skill: 'التخطيط المالي',
    emoji: '📊',
    description: 'تعلم كيف نخطط للمال ونحدد الأولويات',
    color: 'from-purple-400 to-pink-500',
    xpReward: 100,
    completed: false,
    lessons: [
      {
        id: 'lesson-8-9-1',
        title: 'خطة بسيطة للإنفاق',
        story: 'نور تحصل على ١٠٠ ريال مصروف شهري. تريد: حقيبة مدرسة (٤٠ ريال)، كتب (٣٠ ريال)، ألعاب (٤٠ ريال)، وحلوى (٢٠ ريال). المجموع ١٣٠ ريال، أكثر من مصروفها!',
        question: 'فكر معي 🧠 كيف تحل نور هذه المشكلة؟',
        options: [
          {
            text: 'تشتري كل شيء وتطلب مال إضافي',
            isCorrect: false,
            feedback: 'هذا ليس تخطيط جيد. يجب أن نعيش حسب إمكانياتنا'
          },
          {
            text: 'تختار الأهم أولاً: الحقيبة والكتب',
            isCorrect: true,
            feedback: 'ممتاز! الحاجات الأساسية أولاً، ثم الرغبات إذا بقي مال'
          },
          {
            text: 'تشتري الألعاب والحلوى فقط',
            isCorrect: false,
            feedback: 'الألعاب ممتعة، لكن الدراسة أهم. الحقيبة والكتب ضرورية'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-8-9-2',
        title: 'تقسيم ١٠٠ ريال',
        story: 'فيصل يحصل على ١٠٠ ريال من جده. جده ينصحه: "٥٠ ريال للادخار، ٣٠ ريال للأشياء المهمة، ٢٠ ريال للمرح." فيصل يقسم المال في ثلاث جيوب مختلفة.',
        question: 'فكر معي 🧠 لماذا قسم فيصل المال بهذه الطريقة؟',
        options: [
          {
            text: 'لأن جده قال له ذلك فقط',
            isCorrect: false,
            feedback: 'ليس فقط لأن جده قال. هذه طريقة ذكية لإدارة المال'
          },
          {
            text: 'ليضمن الادخار والحاجات والمتعة',
            isCorrect: true,
            feedback: 'رائع! تقسيم المال يضمن تحقيق أهداف مختلفة: ادخار، حاجات، ومتعة'
          },
          {
            text: 'لأنه لا يعرف ماذا يشتري',
            isCorrect: false,
            feedback: 'بل العكس! هو يخطط بذكاء لاستخدام المال أفضل استخدام'
          }
        ],
        completed: false
      },
      {
        id: 'lesson-8-9-3',
        title: 'المقارنة الذكية',
        story: 'ريم تريد شراء حقيبة مدرسة. تجد ثلاث حقائب: الأولى ب٨٠ ريال جميلة، الثانية ب٦٠ ريال عادية، والثالثة ب٤٠ ريال بسيطة. كلها جيدة للدراسة. ريم معها ٧٠ ريال فقط.',
        question: 'فكر معي 🧠 ما أفضل قرار تتخذه ريم؟',
        options: [
          {
            text: 'تطلب مال إضافي لشراء الأغلى',
            isCorrect: false,
            feedback: 'طلب مال إضافي ليس الحل الأمثل. تعلم العيش حسب الإمكانيات أهم'
          },
          {
            text: 'تشتري الحقيبة ب٦٠ ريال وتدخر ١٠',
            isCorrect: true,
            feedback: 'قرار ممتاز! اخترت حقيبة جيدة وادخرت مال للطوارئ'
          },
          {
            text: 'تنتظر حتى تجمع مال أكثر',
            isCorrect: false,
            feedback: 'الانتظار قد يؤثر على دراستها. أفضل أن تشتري ما تحتاجه الآن'
          }
        ],
        completed: false
      }
    ]
  }
];

export default function LessonsPage() {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const { selectedCharacter } = useCharacterStore();
  const { addXP } = useGameStore();
  const { speakWithCharacter, isSpeaking, isProcessing } = useEnhancedVoice();
  const { playSound } = useEnhancedSounds();
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [characterEmotion, setCharacterEmotion] = useState<'idle' | 'happy' | 'excited' | 'thinking' | 'speaking' | 'sad' | 'encouraging' | 'celebrating'>('idle');
  const [courseProgress, setCourseProgress] = useState(financialCourses);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasReadStory, setHasReadStory] = useState(false);
  const [hasReadQuestion, setHasReadQuestion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    if (currentUser?.role === 'parent') {
      router.replace('/parent');
      return;
    }
  }, [isAuthenticated, currentUser, router, isMounted]);

  // Greeting when first loading lessons page
  useEffect(() => {
    if (!isMounted || !selectedCharacter || hasGreeted || selectedCourse) return;
    if (isSpeaking || isProcessing) return;
    setHasGreeted(true);
    setTimeout(() => {
      speakWithCharacter(
        'اهلا بك في الدرس المالي! اختر الدرس المناسب لعمرك وهيا نتعلم الاشياء المهمة عن المال!',
        selectedCharacter,
        'happy'
      );
    }, 1000);
  }, [selectedCharacter, isMounted, hasGreeted, selectedCourse, isSpeaking, isProcessing, speakWithCharacter]);

  // Read story when lesson starts - prevent voice overlap
  useEffect(() => {
    if (!selectedCourse || !selectedCharacter || hasReadStory || isSpeaking || isProcessing) return;
    
    const currentLesson = selectedCourse.lessons[currentLessonIndex];
    if (currentLesson) {
      const timer = setTimeout(() => {
        if (!isSpeaking && !isProcessing) { // Double check before speaking
          speakWithCharacter(
            `درس ${currentLessonIndex + 1}: ${currentLesson.title}. ${currentLesson.story}`,
            selectedCharacter,
            'speaking'
          );
          setHasReadStory(true);
        }
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCourse, currentLessonIndex, selectedCharacter, hasReadStory, isSpeaking, isProcessing, speakWithCharacter]);

  // Read question after story - ensure story is finished
  useEffect(() => {
    if (!selectedCourse || !selectedCharacter || !hasReadStory || hasReadQuestion || isSpeaking || isProcessing) return;
    
    const currentLesson = selectedCourse.lessons[currentLessonIndex];
    if (currentLesson) {
      const timer = setTimeout(() => {
        if (!isSpeaking && !isProcessing) { // Double check before speaking
          speakWithCharacter(
            currentLesson.question,
            selectedCharacter,
            'thinking'
          );
          setHasReadQuestion(true);
        }
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCourse, currentLessonIndex, selectedCharacter, hasReadStory, hasReadQuestion, isSpeaking, isProcessing, speakWithCharacter]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentLessonIndex(0);
    setCharacterEmotion('happy');
    setHasReadStory(false);
    setHasReadQuestion(false);
    
    if (selectedCharacter) {
      setTimeout(() => {
        speakWithCharacter(
          `رائع! اخترت درس "${course.title}". هيا نبدأ بأول درس!`,
          selectedCharacter,
          'happy'
        );
      }, 500);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!selectedCourse || showResult || showConfirmation) return;
    
    setPendingAnswer(answerIndex);
    setShowConfirmation(true);
    setCharacterEmotion('thinking');
    
    const currentLesson = selectedCourse.lessons[currentLessonIndex];
    const selectedOption = currentLesson.options[answerIndex];
    
    // Read the selected answer
    if (selectedCharacter) {
      setTimeout(() => {
        if (!isSpeaking && !isProcessing) {
          speakWithCharacter(
            `اخترت: ${selectedOption.text}. هل أنت متأكد من إجابتك؟`,
            selectedCharacter,
            'thinking'
          );
        }
      }, 300);
    }
  };

  const handleConfirmAnswer = () => {
    if (pendingAnswer === null || !selectedCourse) return;
    
    setSelectedAnswer(pendingAnswer);
    setShowConfirmation(false);
    
    const currentLesson = selectedCourse.lessons[currentLessonIndex];
    const selectedOption = currentLesson.options[pendingAnswer];
    const isCorrect = selectedOption.isCorrect;
    
    setShowResult(true);
    
    if (isCorrect) {
      setShowConfetti(true);
      setCharacterEmotion('celebrating');
      addXP(25);
      setShowRetry(false);
      
      // Play success sound
      playSound('celebration', selectedCharacter);
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      if (selectedCharacter) {
        setTimeout(() => {
          speakWithCharacter(
            selectedOption.feedback,
            selectedCharacter,
            'celebrating'
          );
        }, 500);
      }
    } else {
      setCharacterEmotion('encouraging');
      setShowRetry(true);
      
      // Play wrong answer sound
      playSound('error', selectedCharacter);
      
      if (selectedCharacter) {
        setTimeout(() => {
          speakWithCharacter(
            `${selectedOption.feedback} هيا نحاول مرة أخرى لنجد الإجابة الصحيحة!`,
            selectedCharacter,
            'encouraging'
          );
        }, 500);
      }
    }
  };

  const handleRetryQuestion = () => {
    setSelectedAnswer(null);
    setPendingAnswer(null);
    setShowResult(false);
    setShowConfirmation(false);
    setShowRetry(false);
    setCharacterEmotion('thinking');
    
    // Re-read the question
    const currentLesson = selectedCourse?.lessons[currentLessonIndex];
    if (currentLesson && selectedCharacter) {
      setTimeout(() => {
        if (!isSpeaking && !isProcessing) {
          speakWithCharacter(
            `${currentLesson.question} فكر جيداً هذه المرة!`,
            selectedCharacter,
            'encouraging'
          );
        }
      }, 500);
    }
  };

  const handleChangeAnswer = () => {
    setPendingAnswer(null);
    setShowConfirmation(false);
    setCharacterEmotion('thinking');
  };

  const handleNextLesson = () => {
    if (!selectedCourse) return;
    
    // Mark current lesson as completed
    const updatedCourses = courseProgress.map(course => {
      if (course.id === selectedCourse.id) {
        const updatedLessons = course.lessons.map((lesson, index) => {
          if (index === currentLessonIndex) {
            return { ...lesson, completed: true };
          }
          return lesson;
        });
        
        const allLessonsCompleted = updatedLessons.every(lesson => lesson.completed);
        return {
          ...course,
          lessons: updatedLessons,
          completed: allLessonsCompleted
        };
      }
      return course;
    });
    
    setCourseProgress(updatedCourses);
    
    if (currentLessonIndex < selectedCourse.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedAnswer(null);
      setPendingAnswer(null);
      setShowResult(false);
      setShowConfirmation(false);
      setShowRetry(false);
      setCharacterEmotion('thinking');
      setHasReadStory(false);
      setHasReadQuestion(false);
    } else {
      // Course completed
      addXP(selectedCourse.xpReward);
      setCharacterEmotion('celebrating');
      setShowConfetti(true);
      
      if (selectedCharacter) {
        setTimeout(() => {
          speakWithCharacter(
            `مبروك! أكملت الدرس "${selectedCourse.title}" بنجاح! أنت بطل حقيقي!`,
            selectedCharacter,
            'celebrating'
          );
        }, 500);
      }
      
      setTimeout(() => {
        setSelectedCourse(null);
        setShowConfetti(false);
      }, 4000);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentLessonIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCharacterEmotion('idle');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || currentUser?.role === 'parent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🏠</div>
          <div className="text-xl font-bold">جاري التوجيه<span className="loading-dots"></span></div>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper requiredRole="child">
      <div className="min-h-screen pb-28 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700" dir="rtl">
        
        {showConfetti && (
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 400}
            height={typeof window !== 'undefined' ? window.innerHeight : 800}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
          />
        )}

        {/* Simplified Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <div className="text-6xl">📚</div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={18} />
              </button>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              <span className="gradient-text">الكورس المالي للأطفال</span>
            </h1>
            <p className="text-white/90 text-lg bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/30">
              تعلم إدارة المال بطريقة ممتعة وآمنة ✨
            </p>
          </div>

          {/* Character Display */}
          {selectedCharacter && (
            <div className="flex justify-center mb-6">
              <Amazing3DCharacter
                character={selectedCharacter}
                emotion={characterEmotion}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
                size="large"
              />
            </div>
          )}

          {!selectedCourse ? (
            // Course Selection
            <>
              {/* Skill Map Table */}
              <div className="ultra-modern-card sparkle modern-shadow">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                    <Target className="text-blue-400" size={28} />
                    خريطة المهارات المالية
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/30">
                          <th className="text-right p-3 text-blue-300">الفئة العمرية</th>
                          <th className="text-right p-3 text-green-300">المهارة الرئيسية</th>
                          <th className="text-right p-3 text-purple-300">أمثلة على المواضيع</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/20">
                          <td className="p-3 font-bold">٤–٥ سنوات</td>
                          <td className="p-3">الفهم الأساسي للمال</td>
                          <td className="p-3 text-sm">ما هو المال؟ / لماذا نحتاج المال؟</td>
                        </tr>
                        <tr className="border-b border-white/20">
                          <td className="p-3 font-bold">٦–٧ سنوات</td>
                          <td className="p-3">الادخار واتخاذ القرار</td>
                          <td className="p-3 text-sm">ادخار لشراء لعبة / الاختيار بين شيئين</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">٨–٩ سنوات</td>
                          <td className="p-3">تحديد الأولويات والميزانية</td>
                          <td className="p-3 text-sm">خطة بسيطة للإنفاق / تقسيم ١٠٠ ريال</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
                  <BookOpen className="text-yellow-400" size={28} />
                  اختر الكورس المناسب لعمرك
                </h3>
                
                {courseProgress.map((course, index) => (
                  <div
                    key={course.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 hover:bg-white/15 cursor-pointer hover:scale-105 hover:shadow-2xl ${
                      course.completed 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'hover:border-purple-400/50'
                    }`}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                                                     <div className="flex items-center gap-4 mb-4">
                             <div className="text-4xl">
                               {course.emoji}
                             </div>
                            <div>
                              <h4 className="text-xl font-bold text-white mb-1">
                                {course.title}
                              </h4>
                              <p className="text-green-300 font-bold text-sm mb-1">{course.ageGroup}</p>
                              <p className="text-white/80 text-sm">{course.skill}</p>
                            </div>
                          </div>
                          <p className="text-white/90 text-base leading-relaxed mb-4">{course.description}</p>
                        </div>
                        
                        {course.completed && (
                          <div className="flex flex-col items-center">
                            <span className="text-4xl mb-2 animate-bounce">🏆</span>
                            <span className="text-sm text-green-300 font-bold bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full border border-green-400/50">
                              مكتمل
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm font-bold text-white mb-2">
                          <span>التقدم</span>
                          <span>{course.lessons.filter(l => l.completed).length} / {course.lessons.length}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden border border-white/30">
                          <div 
                            className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-700`}
                            style={{ width: `${(course.lessons.filter(l => l.completed).length / course.lessons.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Lessons count and XP reward */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="text-blue-400" size={16} />
                          <span className="text-white/80 text-sm">{course.lessons.length} دروس</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-400" size={16} />
                          <span className="text-white/80 text-sm">{course.xpReward} نقطة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Lesson Content
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="ultra-modern-card sparkle modern-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handleBackToCourses}
                      className="text-white hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                      ← العودة للكورسات
                    </button>
                                         <div className="text-center">
                       <h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2>
                       <p className="text-white/80 text-sm">درس {currentLessonIndex + 1} من {selectedCourse.lessons.length}</p>
                     </div>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden border border-white/30">
                    <div 
                      className={`bg-gradient-to-r ${selectedCourse.color} h-3 rounded-full transition-all duration-700`}
                      style={{ width: `${((currentLessonIndex + 1) / selectedCourse.lessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Current Lesson */}
              {(() => {
                const currentLesson = selectedCourse.lessons[currentLessonIndex];
                return (
                  <div className="space-y-6">
                    {/* Story */}
                    <div className="ultra-modern-card sparkle modern-shadow">
                      <div className="p-6">
                                                 <h3 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
                           <BookOpen className="text-blue-400" size={28} />
                           درس {currentLessonIndex + 1}: {currentLesson.title}
                         </h3>
                        
                        <div className="glass-morphism p-6 rounded-2xl border-2 border-white/20 mb-6">
                          <p className="text-white text-lg leading-relaxed text-justify">
                            {currentLesson.story}
                          </p>
                        </div>
                        <div className="flex justify-center mt-2">
                          <button
                            onClick={() => {
                              if (!isSpeaking && !isProcessing && selectedCourse && selectedCharacter) {
                                setCharacterEmotion('speaking');
                                speakWithCharacter(
                                  selectedCourse.lessons[currentLessonIndex].story,
                                  selectedCharacter,
                                  'speaking'
                                );
                              }
                            }}
                            disabled={isSpeaking || isProcessing}
                            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            🔁 إعادة قراءة القصة
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="ultra-modern-card sparkle modern-shadow">
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <div className="text-5xl mb-4 animate-pulse">🧠</div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {currentLesson.question}
                          </h3>
                        </div>

                        <div className="flex justify-center mt-2">
                          <button
                            onClick={() => {
                              if (!isSpeaking && !isProcessing && selectedCourse && selectedCharacter) {
                                setCharacterEmotion('thinking');
                                speakWithCharacter(
                                  selectedCourse.lessons[currentLessonIndex].question,
                                  selectedCharacter,
                                  'thinking'
                                );
                              }
                            }}
                            disabled={isSpeaking || isProcessing}
                            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            🔁 إعادة قراءة السؤال
                          </button>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-4">
                          {currentLesson.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={showResult || showConfirmation}
                              className={`w-full p-4 rounded-2xl border-2 text-right font-bold transition-all duration-300 transform ${
                                pendingAnswer === index || selectedAnswer === index 
                                  ? 'border-yellow-400 text-white scale-105 ring-4 ring-yellow-400/50' 
                                  : 'border-white/30 text-white hover:border-yellow-300/50 hover:scale-105'
                              } ${showResult || showConfirmation ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                              style={{
                                background: pendingAnswer === index || selectedAnswer === index 
                                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))' 
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))'
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base leading-relaxed flex-1 pr-4">{option.text}</span>
                                <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                                  <span className="text-xl">
                                    {selectedAnswer === index && showResult 
                                      ? (option.isCorrect ? '✅' : '❌')
                                      : (pendingAnswer === index || selectedAnswer === index) ? '✅' : '💡'}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Confirmation Dialog */}
                        {showConfirmation && pendingAnswer !== null && (
                          <div className="mt-6 p-6 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl border-2 border-blue-400 text-center">
                            <div className="text-4xl mb-3">🤔</div>
                            <h4 className="text-lg font-bold text-white mb-3">
                              اخترت: "{currentLesson.options[pendingAnswer].text}"
                            </h4>
                            <p className="text-white/90 mb-4">هل أنت متأكد من إجابتك؟</p>
                            
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={handleConfirmAnswer}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                              >
                                ✅ نعم، متأكد
                              </button>
                              
                              <button
                                onClick={handleChangeAnswer}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                              >
                                🔄 أريد التغيير
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Result */}
                        {showResult && selectedAnswer !== null && (
                          <div className={`mt-6 p-6 rounded-2xl text-center ${
                            currentLesson.options[selectedAnswer].isCorrect 
                              ? 'bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-2 border-green-400' 
                              : 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-2 border-orange-400'
                          }`}>
                            <div className="text-4xl mb-3">
                              {currentLesson.options[selectedAnswer].isCorrect ? '🎉' : '💪'}
                            </div>
                            <p className="text-white text-lg mb-4 leading-relaxed">
                              {currentLesson.options[selectedAnswer].feedback}
                            </p>
                            
                            {currentLesson.options[selectedAnswer].isCorrect ? (
                              <button
                                onClick={handleNextLesson}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                              >
                                {currentLessonIndex < selectedCourse.lessons.length - 1 ? '➡️ الدرس التالي' : '🏆 إنهاء الكورس'}
                              </button>
                            ) : showRetry && (
                              <div className="space-y-3">
                                <button
                                  onClick={handleRetryQuestion}
                                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                  🔄 لنحاول مرة أخرى!
                                </button>
                                <button
                                  onClick={handleNextLesson}
                                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                                >
                                  ⏭️ التخطي للدرس التالي
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        
        <Navigation />
      </div>
    </AuthWrapper>
  );
} 