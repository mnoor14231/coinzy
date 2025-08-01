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

export interface WeeklySavingGoal {
  id: string;
  description: string;
  totalAmount: number;
  weeklyTarget: number;
  currentWeek: number;
  achieved: boolean;
  dateCreated: Date;
  dateAchieved?: Date;
}

export interface FamilyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dateCompleted?: Date;
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
  type: 'deposit' | 'interest' | 'bonus' | 'real_money_deposit' | 'real_money_withdraw';
  date: Date;
  description: string;
}

export interface FamilyNotification {
  id: string;
  message: string;
  amount: number;
  date: Date;
  type: 'milestone' | 'achievement' | 'goal_reached' | 'parent_transfer';
  read: boolean;
}

export interface RewardTransaction {
  id: string;
  type: 'earned' | 'converted_to_cash' | 'spent_on_store';
  points: number;
  description: string;
  date: Date;
  storeType?: 'apple' | 'roblox' | 'ps';
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
  
  // Reward Points System
  rewardPoints: number;
  rewardTransactions: RewardTransaction[];
  
  // Weekly Saving Goals
  weeklySavingGoal: WeeklySavingGoal | null;
  weeklyProgress: number;
  
  // Family Tasks
  familyTasks: FamilyTask[];
  
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
  setWeeklySavingGoal: (description: string, totalAmount: number) => void;
  updateWeeklyProgress: (amount: number) => void;
  markWeeklyGoalAchieved: () => void;
  addFamilyTask: (title: string, description: string) => void;
  completeFamilyTask: (taskId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  resetDailyMissions: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  
  // Reward Points Actions
  addRewardPoints: (points: number, description: string) => void;
  convertPointsToCash: (points: number) => void;
  spendPointsOnStore: (points: number, storeType: 'apple' | 'roblox' | 'ps') => void;
}

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'توفير المال',
    emoji: '💰',
    question: 'ليلى لديها ٥٠ ريال وتريد شراء لعبة بـ ٤٠ ريال، لكنها تحتاج المال لهدية أختها. ماذا تفعل؟',
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
    emoji: '��',
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

const initialFamilyTasks: FamilyTask[] = [
  {
    id: '1',
    title: 'تحديد هدف الشهر',
    description: 'اطلب من طفلك تحديد شيء يريد ادخاره هذا الشهر',
    completed: false
  },
  {
    id: '2',
    title: 'شرح الحاجة والرغبة',
    description: 'اشرح الفرق بين الحاجة والرغبة باستخدام أمثلة من المنزل',
    completed: false
  },
  {
    id: '3',
    title: 'التسوق المشترك',
    description: 'اصطحب طفلك للتسوق واشرح له قرارات الشراء',
    completed: false
  },
  {
    id: '4',
    title: 'حصالة المنزل',
    description: 'ساعد طفلك في إنشاء حصالة خاصة به في المنزل',
    completed: false
  },
  {
    id: '5',
    title: 'مراجعة أسبوعية',
    description: 'ناقش مع طفلك تقدمه في الادخار كل أسبوع',
    completed: false
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
      rewardPoints: 0,
      rewardTransactions: [],
      weeklySavingGoal: null,
      weeklyProgress: 0,
      familyTasks: initialFamilyTasks,
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
        const question = state.questions.find(q => q.id === questionId);
        const updatedQuestions = state.questions.map((question: Question) =>
          question.id === questionId ? { ...question, completed: true } : question
        );

        // Add reward points for completing question (100 points per question)
        const rewardPoints = 100;
        const newRewardPoints = state.rewardPoints + rewardPoints;
        const newRewardTransaction: RewardTransaction = {
          id: Date.now().toString(),
          type: 'earned',
          points: rewardPoints,
          description: `إكمال درس: ${question?.title || 'درس جديد'}`,
          date: new Date()
        };

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
          achievements: updatedAchievements,
          rewardPoints: newRewardPoints,
          rewardTransactions: [newRewardTransaction, ...state.rewardTransactions]
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

        // Calculate reward points (10 riyal = 1 point, 100 riyal = 10 points)
        const rewardPoints = Math.floor(amount / 10);
        const newRewardPoints = state.rewardPoints + rewardPoints;
        
        let newRewardTransaction: RewardTransaction | null = null;
        if (rewardPoints > 0) {
          newRewardTransaction = {
            id: Date.now().toString(),
            type: 'earned',
            points: rewardPoints,
            description: `مكافأة إيداع ${amount} ريال`,
            date: new Date()
          };
        }

        // Create family notifications for milestones
        const newNotifications: FamilyNotification[] = [];
        
        // Check for parent transfer notification
        if (description.includes('تحويل من الأهل') || description.includes('مكافأة سريعة من الأهل')) {
          newNotifications.push({
            id: `parent_transfer_${Date.now()}`,
            message: `💰 ${description} - أرسل لك الأهل ${amount} ريال! 🎁`,
            amount: amount,
            date: new Date(),
            type: 'parent_transfer',
            read: false
          });
        }
        
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
          rewardPoints: newRewardPoints,
          rewardTransactions: newRewardTransaction 
            ? [newRewardTransaction, ...state.rewardTransactions]
            : state.rewardTransactions,
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
          type: 'real_money_withdraw', // Correct type for withdrawal
          date: new Date(),
          description: `إنفاق: ${description}`
        };

        return {
          bankBalance: newBalance,
          transactions: [newTransaction, ...state.transactions]
        };
      }),

      setWeeklySavingGoal: (description: string, totalAmount: number) => set((state) => ({
        weeklySavingGoal: {
          id: Date.now().toString(),
          description,
          totalAmount,
          weeklyTarget: Math.ceil(totalAmount / 4), // 4 weeks
          currentWeek: 1,
          achieved: false,
          dateCreated: new Date()
        },
        weeklyProgress: 0
      })),

      updateWeeklyProgress: (amount: number) => set((state) => ({
        weeklyProgress: state.weeklyProgress + amount
      })),

      markWeeklyGoalAchieved: () => set((state) => ({
        weeklySavingGoal: state.weeklySavingGoal ? {
          ...state.weeklySavingGoal,
          achieved: true,
          dateAchieved: new Date()
        } : null
      })),

      addFamilyTask: (title: string, description: string) => set((state) => ({
        familyTasks: [...state.familyTasks, {
          id: Date.now().toString(),
          title,
          description,
          completed: false
        }]
      })),

      completeFamilyTask: (taskId: string) => set((state) => ({
        familyTasks: state.familyTasks.map(task =>
          task.id === taskId 
            ? { ...task, completed: true, dateCompleted: new Date() }
            : task
        )
      })),

      // Reward Points Actions
      addRewardPoints: (points: number, description: string) => set((state) => {
        const newPoints = state.rewardPoints + points;
        const newTransaction: RewardTransaction = {
          id: Date.now().toString(),
          type: 'earned',
          points,
          description,
          date: new Date()
        };

        return {
          rewardPoints: newPoints,
          rewardTransactions: [newTransaction, ...state.rewardTransactions]
        };
      }),

      convertPointsToCash: (points: number) => set((state) => {
        if (state.rewardPoints < points) {
          throw new Error('نقاط غير كافية');
        }

        const cashAmount = points * 0.1; // 1 point = 0.1 riyal
        const newPoints = state.rewardPoints - points;
        
        const newRewardTransaction: RewardTransaction = {
          id: Date.now().toString(),
          type: 'converted_to_cash',
          points: -points,
          description: `تحويل ${points} نقطة إلى ${cashAmount.toFixed(2)} ريال`,
          date: new Date()
        };

        const newBankTransaction: BankTransaction = {
          id: Date.now().toString(),
          amount: cashAmount,
          type: 'real_money_deposit',
          date: new Date(),
          description: `تحويل نقاط المكافآت (${points} نقطة)`
        };

        return {
          rewardPoints: newPoints,
          rewardTransactions: [newRewardTransaction, ...state.rewardTransactions],
          bankBalance: state.bankBalance + cashAmount,
          transactions: [newBankTransaction, ...state.transactions]
        };
      }),

      spendPointsOnStore: (points: number, storeType: 'apple' | 'roblox' | 'ps') => set((state) => {
        if (state.rewardPoints < points) {
          throw new Error('نقاط غير كافية');
        }

        const newPoints = state.rewardPoints - points;
        const storeNames = {
          apple: 'متجر Apple',
          roblox: 'متجر Roblox',
          ps: 'متجر PlayStation'
        };

        const newTransaction: RewardTransaction = {
          id: Date.now().toString(),
          type: 'spent_on_store',
          points: -points,
          description: `شراء من ${storeNames[storeType]} (${points} نقطة)`,
          date: new Date(),
          storeType
        };

        return {
          rewardPoints: newPoints,
          rewardTransactions: [newTransaction, ...state.rewardTransactions]
        };
      })
    }),
    {
      name: 'coinzy-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 