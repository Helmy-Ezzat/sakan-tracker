export type SessionStatus = "active" | "archived";
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  status: SessionStatus;
  created_at: string;
  ended_at: string | null;
}

export interface SessionMember {
  session_id: string;
  user_id: string;
  joined_at: string;
}

export interface Expense {
  id: string;
  session_id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface SettlementLine {
  userId: string;
  userName: string;
  paid: number;
  share: number;
  /** Positive = owed money, negative = owes money */
  balance: number;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: {
          id?: string;
          name: string;
          phone_number: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<User>;
      };
      sessions: {
        Row: Session;
        Insert: {
          id?: string;
          status?: SessionStatus;
          created_at?: string;
          ended_at?: string | null;
        };
        Update: Partial<Session>;
      };
      session_members: {
        Row: SessionMember;
        Insert: {
          session_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: Partial<SessionMember>;
      };
      expenses: {
        Row: Expense;
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          amount: number;
          description: string;
          created_at?: string;
        };
        Update: Partial<Expense>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      session_status: SessionStatus;
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
