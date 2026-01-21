
export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

export enum ReactionType {
  LIKE = 'like',
  CLAP = 'clap',
  STAR = 'star'
}

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  joined_at: string;
  points?: number; // Calculated for leaderboard
}

export interface ShoutOut {
  id: number;
  sender_id: number;
  sender: User;
  message: string;
  image_url?: string;
  created_at: string;
  recipients: User[];
  reactions: Reaction[];
  comments_count: number;
}

export interface Reaction {
  id: number;
  shoutout_id: number;
  user_id: number;
  type: ReactionType;
}

export interface Comment {
  id: number;
  shoutout_id: number;
  user_id: number;
  user: User;
  content: string;
  created_at: string;
}

export interface Report {
  id: number;
  shoutout_id: number;
  reported_by: number;
  reason: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

export interface AdminLog {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  target_id: number;
  target_type: 'shoutout' | 'comment';
  timestamp: string;
}

export interface AdminStats {
  totalShoutouts: number;
  totalActiveUsers: number;
  topContributors: { name: string; count: number }[];
  mostTaggedUsers: { name: string; count: number }[];
  departmentEngagement: { department: string; count: number }[];
}
