import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Question {
  id: string;
  title: string;
  emoji: string;
  question: string; // The question to ask
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string; // Feedback for this choice
  }[];
  xpReward: number;
  completed: boolean;
  topic: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  dateUnlocked?: Date;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  emoji: string;
}

export interface BankTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'interest' | 'bonus' | 'real_money_deposit';
  date: Date;
  description: string;
}

export interface FamilyNotification {
  id: string;
  message: string;
  amount: number;
  date: Date;
  type: 'milestone' | 'achievement' | 'goal_reached';
  read: boolean;
}

interface GameState {
  // User Progress
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  
  // Questions
  questions: Question[];
  currentQuestionIndex: number;
  
  // Daily Missions
  dailyMissions: DailyMission[];
  
  // Virtual Bank
  bankBalance: number;
  savingsGoal: number;
  transactions: BankTransaction[];
  interestRate: number;
  
  // Family Notifications
  familyNotifications: FamilyNotification[];
  
  // Achievements
  achievements: Achievement[];
  
  // Actions
  addXP: (amount: number) => void;
  completeQuestion: (questionId: string) => void;
  updateDailyMission: (missionId: string, progress: number) => void;
  depositToBank: (amount: number) => void;
  depositRealMoney: (amount: number, description: string) => void;
  withdrawRealMoney: (amount: number, description: string) => void;
  setSavingsGoal: (goal: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  resetDailyMissions: () => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'توفير المال',
    emoji: '💰',
    question: 'ليلى لديها ٥٠ ريال وتريد شراء لعبة بـ ٤٠ ريال، لكنها تحتاج مال لهدية أختها. ماذا تفعل؟',
    options: [
      {
        text: 'تشتري اللعبة فوراً',
        isCorrect: false,
        feedback: 'ليس هذا قرار حكيم! يجب التفكير في الحاجات الأخرى قبل الشراء.'
      },
      {
        text: 'تشتري شيئاً أرخص وتحفظ الباقي',
        isCorrect: true,
        feedback: 'ممتاز! هذا تفكير ذكي. التوفير يساعدنا على شراء أشياء أخرى مهمة.'
      },
      {
        text: 'تطلب مال إضافي من والديها',
        isCorrect: false,
        feedback: 'من الأفضل أن نتعلم إدارة المال الذي معنا أولاً.'
      }
    ],
    xpReward: 15,
    completed: false,
    topic: 'saving'
  },
  {
    id: '2',
    title: 'قرارات الإنفاق',
    emoji: '🎯',
    question: 'أحمد ادخر ١٠٠ ريال في حصالته. أصدقاؤه يريدون الذهاب لمدينة الألعاب بـ ١٠٠ ريال. ماذا يفعل؟',
    options: [
      {
        text: 'يكسر الحصالة ويأخذ كل المال',
        isCorrect: false,
        feedback: 'هذا سيضيع كل توفيره! الأفضل أن نحافظ على جزء من المال المدخر.'
      },
      {
        text: 'يرفض الذهاب ويحافظ على كل المال',
        isCorrect: false,
        feedback: 'الرفض تماماً ليس ضرورياً. يمكن الاستمتاع والتوفير في نفس الوقت.'
      },
      {
        text: 'يستخدم نصف المال ويحتفظ بالنصف الآخر',
        isCorrect: true,
        feedback: 'ممتاز! هذا توازن رائع بين الاستمتاع والتوفير للمستقبل.'
      }
    ],
    xpReward: 20,
    completed: false,
    topic: 'spending'
  }
];

const initialDailyMissions: DailyMission[] = [
  {
    id: '1',
    title: 'مكمل القصص',
    description: 'أكمل قصتين اليوم',
    target: 2,
    current: 0,
    completed: false,
    xpReward: 20,
    emoji: '📖'
  },
  {
    id: '2',
    title: 'نجم الادخار',
    description: 'ادخر 50 عملة في بنك بابا',
    target: 50,
    current: 0,
    completed: false,
    xpReward: 25,
    emoji: '⭐'
  },
  {
    id: '3',
    title: 'متعلم متميز',
    description: 'احصل على 100 نقطة خبرة',
    target: 100,
    current: 0,
    completed: false,
    xpReward: 30,
    emoji: '🏆'
  }
];

const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: 'أول قصة',
    description: 'أكمل أول قصة تفاعلية',
    emoji: '📚',
    unlocked: false
  },
  {
    id: '2',
    title: 'مدخر صغير',
    description: 'ادخر 100 عملة',
    emoji: '🐷',
    unlocked: false
  },
  {
    id: '3',
    title: 'راوي القصص',
    description: 'أكمل 5 قصص',
    emoji: '🎭',
    unlocked: false
  },
  {
    id: '4',
    title: 'ملك الخبرة',
    description: 'احصل على 500 نقطة خبرة',
    emoji: '👑',
    unlocked: false
  },
  {
    id: '5',
    title: 'متحدي الأسبوع',
    description: 'حافظ على سلسلة 7 أيام',
    emoji: '🔥',
    unlocked: false
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      questions: initialQuestions,
      currentQuestionIndex: 0,
      dailyMissions: initialDailyMissions,
      bankBalance: 0,
      savingsGoal: 500,
      transactions: [],
      interestRate: 0.05,
      familyNotifications: [],
      achievements: initialAchievements,

      // Actions
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        
        // Update daily mission progress
        const updatedMissions = state.dailyMissions.map(mission => {
          if (mission.id === '3' && !mission.completed) {
            const newCurrent = mission.current + amount;
            return {
              ...mission,
              current: Math.min(newCurrent, mission.target),
              completed: newCurrent >= mission.target
            };
          }
          return mission;
        });

        return {
          xp: newXP,
          level: newLevel,
          dailyMissions: updatedMissions
        };
      }),

      completeQuestion: (questionId: string) => set((state) => {
        const updatedQuestions = state.questions.map((question: Question) =>
          question.id === questionId ? { ...question, completed: true } : question
        );

        // Update daily mission progress
        const completedQuestionsToday = updatedQuestions.filter((q: Question) => q.completed).length;
        const updatedMissions = state.dailyMissions.map(mission => {
          if (mission.id === '1' && !mission.completed) {
            const newCurrent = completedQuestionsToday;
            return {
              ...mission,
              current: Math.min(newCurrent, mission.target),
              completed: newCurrent >= mission.target
            };
          }
          return mission;
        });

        // Check for achievements
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.id === '1' && !achievement.unlocked) {
            return { ...achievement, unlocked: true, dateUnlocked: new Date() };
          }
          if (achievement.id === '3' && !achievement.unlocked && completedQuestionsToday >= 2) {
            return { ...achievement, unlocked: true, dateUnlocked: new Date() };
          }
          return achievement;
        });

        return {
          questions: updatedQuestions,
          dailyMissions: updatedMissions,
          achievements: updatedAchievements
        };
      }),

      updateDailyMission: (missionId, progress) => set((state) => ({
        dailyMissions: state.dailyMissions.map(mission =>
          mission.id === missionId
            ? {
                ...mission,
                current: Math.min(mission.current + progress, mission.target),
                completed: mission.current + progress >= mission.target
              }
            : mission
        )
      })),

      depositToBank: (amount) => set((state) => {
        const newBalance = state.bankBalance + amount;
        const newTransaction: BankTransaction = {
          id: Date.now().toString(),
          amount,
          type: 'deposit',
          date: new Date(),
          description: 'إيداع في بنك بابا'
        };

        // Update daily mission progress
        const updatedMissions = state.dailyMissions.map(mission => {
          if (mission.id === '2' && !mission.completed) {
            const newCurrent = mission.current + amount;
            return {
              ...mission,
              current: Math.min(newCurrent, mission.target),
              completed: newCurrent >= mission.target
            };
          }
          return mission;
        });

        // Check for achievements
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.id === '2' && !achievement.unlocked && newBalance >= 100) {
            return { ...achievement, unlocked: true, dateUnlocked: new Date() };
          }
          return achievement;
        });

        return {
          bankBalance: newBalance,
          transactions: [newTransaction, ...state.transactions],
          dailyMissions: updatedMissions,
          achievements: updatedAchievements
        };
      }),

      setSavingsGoal: (goal) => set({ savingsGoal: goal }),

      unlockAchievement: (achievementId) => set((state) => ({
        achievements: state.achievements.map(achievement =>
          achievement.id === achievementId
            ? { ...achievement, unlocked: true, dateUnlocked: new Date() }
            : achievement
        )
      })),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (state.lastActiveDate === yesterday) {
          // Continue streak
          return { streak: state.streak + 1, lastActiveDate: today };
        } else if (state.lastActiveDate !== today) {
          // Reset streak
          return { streak: 1, lastActiveDate: today };
        }
        
        return { lastActiveDate: today };
      }),

      resetDailyMissions: () => set({
        dailyMissions: initialDailyMissions
      }),

      depositRealMoney: (amount: number, description: string) => set((state) => {
        const newBalance = state.bankBalance + amount;
        
        const newTransaction: BankTransaction = {
          id: Date.now().toString(),
          amount,
          type: 'real_money_deposit',
          date: new Date(),
          description
        };

        // Create family notifications for milestones
        const newNotifications: FamilyNotification[] = [];
        
        // Check for 50 riyal milestone
        if (state.bankBalance < 50 && newBalance >= 50) {
          newNotifications.push({
            id: `milestone_50_${Date.now()}`,
            message: `${description} - وصل إلى 50 ريال! حان وقت المكافأة 🎁`,
            amount: 50,
            date: new Date(),
            type: 'milestone',
            read: false
          });
        }

        // Check for 100 riyal milestone
        if (state.bankBalance < 100 && newBalance >= 100) {
          newNotifications.push({
            id: `milestone_100_${Date.now()}`,
            message: `${description} - وصل إلى 100 ريال! إنجاز رائع 🏆`,
            amount: 100,
            date: new Date(),
            type: 'milestone',
            read: false
          });
        }

        // Check for savings goal achievement
        if (state.bankBalance < state.savingsGoal && newBalance >= state.savingsGoal) {
          newNotifications.push({
            id: `goal_${Date.now()}`,
            message: `${description} - حقق هدف الادخار ${state.savingsGoal} ريال! 🎯`,
            amount: state.savingsGoal,
            date: new Date(),
            type: 'goal_reached',
            read: false
          });
        }

        return {
          bankBalance: newBalance,
          transactions: [newTransaction, ...state.transactions],
          familyNotifications: [...newNotifications, ...state.familyNotifications]
        };
      }),

      markNotificationAsRead: (notificationId: string) => set((state) => ({
        familyNotifications: state.familyNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      })),

      withdrawRealMoney: (amount: number, description: string) => set((state) => {
        if (state.bankBalance < amount) {
          throw new Error('رصيد غير كافي');
        }
        
        const newBalance = state.bankBalance - amount;
        
        const newTransaction: BankTransaction = {
          id: Date.now().toString(),
          amount: -amount, // Negative for withdrawal
          type: 'real_money_deposit', // Using same type but negative amount
          date: new Date(),
          description: `إنفاق: ${description}`
        };

        return {
          bankBalance: newBalance,
          transactions: [newTransaction, ...state.transactions]
        };
      })
    }),
    {
      name: 'coinzy-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 