// types.ts
export interface PageVisitData {
  title: string;
  url: string;
  count: number;
}

// For dialog display
export interface PageVisitDialogData {
  title: string;
  url: string;
  count: number;
}

export interface SessionData {
  visitedWebsiteCount: number;
  chatbotAPIRequests: number[];
  totalChatbotAPIRequests: number;
  averageChatbotAPIRequests: number;
  chatbotUsedTime: number[];
  totalChatbotUsedTime: number;
  totalVisitedWebsites?: number;
  // The updated format is now an object with PageVisitData
  pageVisitedCount?: {
    [key: string]: PageVisitData;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Chatbot {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
  analyticsEnabled: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface StatisticsDataItem {
  _id: string;
  chatbotId: string;
  userId: string;
  data: {
    [sessionId: string]: SessionData;
  };
  createdAt: string;
  updatedAt: string;
  chatbot: Chatbot;
  user: User;
}

// Updated to support the new format
export interface ChatbotStat {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  creator: string;
  sessions: number;
  requests: number;
  usageTime: number;
  uniqueUsers: number;
  visitedWebsiteCount: number;
  pageVisits?: {
    [key: string]: PageVisitData;
  };
}

export interface ChartData {
  name: string;
  value: number;
  percentage: number;
  isOthers?: boolean;
  items?: ChartData[];
}

// Updated to support the new format
export interface SessionDisplayData {
  id: string;
  chatbotName: string;
  creator: string;
  requests: number;
  usageTime: number;
  visitedWebsiteCount: number;
  pageVisits?: {
    [key: string]: PageVisitData;
  };
}

export interface ProcessedStats {
  uniqueChatbots: number;
  uniqueCreators: number;
  totalSessions: number;
  totalRequests: number;
  totalUsageTime: number;
  chatbotStats: ChatbotStat[];
  chatbotDistributionData: ChartData[];
  sessionsData: SessionDisplayData[];
  totalVisitedWebsites: number;
}
