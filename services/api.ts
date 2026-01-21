
import { User, UserRole, ShoutOut, ReactionType, Comment, AdminStats, Reaction, Report, AdminLog } from '../types';

const getInitialUsers = (): User[] => {
  const stored = localStorage.getItem('bragboard_all_users');
  if (stored) return JSON.parse(stored);
  return [
    { id: 1, name: 'Alice Smith', email: 'alice@company.com', department: 'Engineering', role: UserRole.ADMIN, joined_at: '2023-01-15' },
    { id: 2, name: 'Bob Johnson', email: 'bob@company.com', department: 'Sales', role: UserRole.EMPLOYEE, joined_at: '2023-02-20' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@company.com', department: 'Product', role: UserRole.EMPLOYEE, joined_at: '2023-03-05' },
    { id: 4, name: 'Diana Prince', email: 'diana@company.com', department: 'Engineering', role: UserRole.EMPLOYEE, joined_at: '2023-04-12' },
    { id: 5, name: 'Vinod Kumar', email: 'siripuramvinodkumar333@gmail.com', department: 'IT Operations', role: UserRole.ADMIN, joined_at: '2024-01-01' },
  ];
};

let MOCK_USERS: User[] = getInitialUsers();
let MOCK_REPORTS: Report[] = [];
let MOCK_ADMIN_LOGS: AdminLog[] = [];

let MOCK_SHOUTOUTS: ShoutOut[] = [
  {
    id: 1,
    sender_id: 1,
    sender: MOCK_USERS[0],
    message: "Huge thanks to @Bob Johnson for helping with the server migration! We couldn't have done it without your late-night debugging session. 🚀",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    recipients: [MOCK_USERS[1]],
    reactions: [
      { id: 1, shoutout_id: 1, user_id: 3, type: ReactionType.CLAP },
      { id: 2, shoutout_id: 1, user_id: 4, type: ReactionType.LIKE }
    ],
    comments_count: 1
  }
];

let MOCK_COMMENTS: Comment[] = [
  { id: 1, shoutout_id: 1, user_id: 4, user: MOCK_USERS[3], content: "Well deserved Bob! You rock!", created_at: new Date().toISOString() }
];

const saveUsers = () => localStorage.setItem('bragboard_all_users', JSON.stringify(MOCK_USERS));
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getCurrentUser = async (): Promise<User | null> => {
  const user = localStorage.getItem('bragboard_user');
  return user ? JSON.parse(user) : null;
};

export const registerUser = async (user: User): Promise<void> => {
  await delay(200);
  if (!MOCK_USERS.find(u => u.email === user.email)) {
    MOCK_USERS.push(user);
    saveUsers();
  }
};

export const getUsers = async (): Promise<User[]> => [...MOCK_USERS];

export const getShoutouts = async (filters?: { department?: string, sender_id?: number, recipient_id?: number, query?: string }): Promise<ShoutOut[]> => {
  await delay(300);
  let filtered = [...MOCK_SHOUTOUTS];
  if (filters?.department) filtered = filtered.filter(s => s.sender?.department === filters.department);
  if (filters?.sender_id) filtered = filtered.filter(s => s.sender_id === filters.sender_id);
  if (filters?.recipient_id) filtered = filtered.filter(s => s.recipients?.some(r => r.id === filters.recipient_id));
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(s => s.message.toLowerCase().includes(q) || s.sender?.name.toLowerCase().includes(q));
  }
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createShoutout = async (sender_id: number, message: string, recipientIds: number[], image_url?: string): Promise<ShoutOut> => {
  await delay(500);
  const sender = MOCK_USERS.find(u => u.id === sender_id) || MOCK_USERS[0];
  const recipients = MOCK_USERS.filter(u => recipientIds.includes(u.id));
  const newSo: ShoutOut = {
    id: MOCK_SHOUTOUTS.length > 0 ? Math.max(...MOCK_SHOUTOUTS.map(s => s.id)) + 1 : 1,
    sender_id,
    sender,
    message,
    image_url,
    created_at: new Date().toISOString(),
    recipients,
    reactions: [],
    comments_count: 0
  };
  MOCK_SHOUTOUTS = [newSo, ...MOCK_SHOUTOUTS];
  return newSo;
};

export const toggleReaction = async (shoutout_id: number, user_id: number, type: ReactionType): Promise<Reaction[]> => {
  const shoutout = MOCK_SHOUTOUTS.find(s => s.id === shoutout_id);
  if (!shoutout) return [];
  const existingIndex = shoutout.reactions.findIndex(r => r.user_id === user_id && r.type === type);
  if (existingIndex > -1) shoutout.reactions.splice(existingIndex, 1);
  else shoutout.reactions.push({ id: Math.random(), shoutout_id, user_id, type });
  return [...shoutout.reactions];
};

export const getComments = async (shoutout_id: number): Promise<Comment[]> => MOCK_COMMENTS.filter(c => c.shoutout_id === shoutout_id);

export const addComment = async (shoutout_id: number, user_id: number, content: string): Promise<Comment> => {
  const user = MOCK_USERS.find(u => u.id === user_id) || MOCK_USERS[0];
  const newComment: Comment = { id: Math.max(0, ...MOCK_COMMENTS.map(c => c.id)) + 1, shoutout_id, user_id, user, content, created_at: new Date().toISOString() };
  MOCK_COMMENTS.push(newComment);
  const shoutout = MOCK_SHOUTOUTS.find(s => s.id === shoutout_id);
  if (shoutout) shoutout.comments_count++;
  return newComment;
};

export const deleteComment = async (comment_id: number, admin_id?: number): Promise<void> => {
  const comment = MOCK_COMMENTS.find(c => c.id === comment_id);
  if (comment) {
    const shoutout = MOCK_SHOUTOUTS.find(s => s.id === comment.shoutout_id);
    if (shoutout) shoutout.comments_count--;
    MOCK_COMMENTS = MOCK_COMMENTS.filter(c => c.id !== comment_id);
    
    if (admin_id) {
      const admin = MOCK_USERS.find(u => u.id === admin_id);
      MOCK_ADMIN_LOGS.push({
        id: MOCK_ADMIN_LOGS.length + 1,
        admin_id,
        admin_name: admin?.name || 'Admin',
        action: 'DELETED_COMMENT',
        target_id: comment_id,
        target_type: 'comment',
        timestamp: new Date().toISOString()
      });
    }
  }
};

export const reportShoutout = async (shoutout_id: number, reported_by: number, reason: string): Promise<void> => {
  const newReport: Report = {
    id: MOCK_REPORTS.length + 1,
    shoutout_id,
    reported_by,
    reason,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  MOCK_REPORTS.push(newReport);
};

export const getPendingReports = async (): Promise<(Report & { shoutout?: ShoutOut })[]> => {
  return MOCK_REPORTS
    .filter(r => r.status === 'pending')
    .map(r => ({
      ...r,
      shoutout: MOCK_SHOUTOUTS.find(s => s.id === r.shoutout_id)
    }))
    .filter(r => !!r.shoutout);
};

export const resolveReport = async (report_id: number, admin_id: number): Promise<void> => {
  const report = MOCK_REPORTS.find(r => r.id === report_id);
  if (report) {
    report.status = 'resolved';
    const admin = MOCK_USERS.find(u => u.id === admin_id);
    MOCK_ADMIN_LOGS.push({
      id: MOCK_ADMIN_LOGS.length + 1,
      admin_id,
      admin_name: admin?.name || 'Admin',
      action: 'RESOLVED_REPORT',
      target_id: report.shoutout_id,
      target_type: 'shoutout',
      timestamp: new Date().toISOString()
    });
  }
};

export const getAdminStats = async (): Promise<AdminStats> => {
  return {
    totalShoutouts: MOCK_SHOUTOUTS.length,
    totalActiveUsers: MOCK_USERS.length,
    topContributors: MOCK_USERS.map(u => ({ name: u.name, count: MOCK_SHOUTOUTS.filter(s => s.sender_id === u.id).length })).sort((a,b) => b.count - a.count).slice(0, 5),
    mostTaggedUsers: MOCK_USERS.map(u => ({ name: u.name, count: MOCK_SHOUTOUTS.filter(s => s.recipients.some(r => r.id === u.id)).length })).sort((a,b) => b.count - a.count).slice(0, 5),
    departmentEngagement: [
      { department: 'Engineering', count: MOCK_SHOUTOUTS.filter(s => s.sender?.department === 'Engineering').length || 25 },
      { department: 'Sales', count: MOCK_SHOUTOUTS.filter(s => s.sender?.department === 'Sales').length || 18 },
      { department: 'Product', count: MOCK_SHOUTOUTS.filter(s => s.sender?.department === 'Product').length || 12 },
      { department: 'HR', count: MOCK_SHOUTOUTS.filter(s => s.sender?.department === 'HR').length || 5 }
    ]
  };
};

export const getAdminLogs = async (): Promise<AdminLog[]> => {
  return [...MOCK_ADMIN_LOGS].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getLeaderboard = async () => {
  await delay(200);
  return MOCK_USERS.map(u => {
    const sentCount = MOCK_SHOUTOUTS.filter(s => s.sender_id === u.id).length;
    const receivedCount = MOCK_SHOUTOUTS.filter(s => s.recipients.some(r => r.id === u.id)).length;
    return {
      ...u,
      points: (sentCount * 10) + (receivedCount * 5)
    };
  }).sort((a, b) => (b.points || 0) - (a.points || 0));
};

export const updateUser = async (user: User): Promise<User> => {
  await delay(200);
  const index = MOCK_USERS.findIndex(u => u.id === user.id);
  if (index !== -1) {
    MOCK_USERS[index] = { ...user };
    saveUsers();
    const stored = localStorage.getItem('bragboard_user');
    if (stored) {
      const currentUser = JSON.parse(stored) as User;
      if (currentUser.id === user.id) {
        localStorage.setItem('bragboard_user', JSON.stringify(user));
      }
    }
  }
  return user;
};

export const deleteShoutout = async (id: number, admin_id?: number): Promise<void> => {
  MOCK_SHOUTOUTS = MOCK_SHOUTOUTS.filter(s => s.id !== id);
  MOCK_REPORTS = MOCK_REPORTS.filter(r => r.shoutout_id !== id);
  
  if (admin_id) {
    const admin = MOCK_USERS.find(u => u.id === admin_id);
    MOCK_ADMIN_LOGS.push({
      id: MOCK_ADMIN_LOGS.length + 1,
      admin_id,
      admin_name: admin?.name || 'Admin',
      action: 'DELETED_SHOUTOUT',
      target_id: id,
      target_type: 'shoutout',
      timestamp: new Date().toISOString()
    });
  }
};

export const exportStatsToCSV = () => {
  const headers = ['User', 'Department', 'Role', 'Joined At'];
  const rows = MOCK_USERS.map(u => [u.name, u.department, u.role, u.joined_at]);
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `bragboard_report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
