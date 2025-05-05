// types.ts
export interface SessionData {
  visitedWebsiteCount: number;
  chatbotAPIRequests: number[];
  totalChatbotAPIRequests: number;
  averageChatbotAPIRequests: number;
  chatbotUsedTime: number[];
  totalChatbotUsedTime: number;
  totalVisitedWebsites: number;
  pageVisitedCount?: { [url: string]: number }; // Add this property
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
  pageVisits?: { [url: string]: number }; // Add this property to store aggregated page visits
}

export interface ChartData {
  name: string;
  value: number;
  percentage: number;
  isOthers?: boolean;
  items?: ChartData[];
}

export interface SessionDisplayData {
  id: string;
  chatbotName: string;
  creator: string;
  requests: number;
  usageTime: number;
  visitedWebsiteCount: number;
  pageVisits?: { [url: string]: number }; // Add this property to store page visits for each session
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
