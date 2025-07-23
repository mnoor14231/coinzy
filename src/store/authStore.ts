import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Family {
  id: string;
  name: string;
  parentPassword: string;
  childPassword: string;
  createdAt: Date;
}

export interface User {
  familyId: string;
  familyName: string;
  role: 'parent' | 'child';
  loginTime: Date;
}

interface AuthState {
  families: Family[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Actions
  createFamily: (name: string, parentPass: string, childPass: string) => boolean;
  login: (familyName: string, password: string, role: 'parent' | 'child') => boolean;
  logout: () => void;
  getFamilyByName: (name: string) => Family | undefined;
}

const defaultFamilies: Family[] = [
  {
    id: 'hakeem-family',
    name: 'حكيم',
    parentPassword: '12',
    childPassword: '123',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'ahmed-family', 
    name: 'أحمد',
    parentPassword: 'parent123',
    childPassword: 'child123',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'sara-family',
    name: 'سارة', 
    parentPassword: 'mama456',
    childPassword: 'sara456',
    createdAt: new Date('2024-01-01')
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      families: defaultFamilies,
      currentUser: null,
      isAuthenticated: false,

      createFamily: (name: string, parentPass: string, childPass: string) => {
        const existingFamily = get().families.find(f => f.name.toLowerCase() === name.toLowerCase());
        if (existingFamily) {
          return false; // Family already exists
        }

        const newFamily: Family = {
          id: `${name.toLowerCase()}-family`,
          name,
          parentPassword: parentPass,
          childPassword: childPass,
          createdAt: new Date()
        };

        set(state => ({
          families: [...state.families, newFamily]
        }));

        return true;
      },

      login: (familyName: string, password: string, role: 'parent' | 'child') => {
        const family = get().families.find(f => f.name.toLowerCase() === familyName.toLowerCase());
        
        if (!family) {
          return false; // Family not found
        }

        const correctPassword = role === 'parent' ? family.parentPassword : family.childPassword;
        
        if (password !== correctPassword) {
          return false; // Wrong password
        }

        const user: User = {
          familyId: family.id,
          familyName: family.name,
          role,
          loginTime: new Date()
        };

        set({
          currentUser: user,
          isAuthenticated: true
        });

        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        });
      },

      getFamilyByName: (name: string) => {
        return get().families.find(f => f.name.toLowerCase() === name.toLowerCase());
      }
    }),
    {
      name: 'coinzy-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 