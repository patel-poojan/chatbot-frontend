// utils/dataProcessing.ts

import {
  StatisticsDataItem,
  ProcessedStats,
  ChatbotStat,
  ChartData,
  SessionDisplayData,
} from './types';

export const processStatisticsData = (
  rawStatisticsData: StatisticsDataItem[] = []
): ProcessedStats => {
  if (
    !rawStatisticsData ||
    !Array.isArray(rawStatisticsData) ||
    rawStatisticsData.length === 0
  ) {
    return {
      uniqueChatbots: 0,
      uniqueCreators: 0,
      totalSessions: 0,
      totalRequests: 0,
      totalUsageTime: 0,
      chatbotStats: [],
      chatbotDistributionData: [],
      sessionsData: [],
    };
  }

  // Count unique chatbots using bot IDs
  const uniqueChatbots = new Set<string>();
  rawStatisticsData.forEach((item: StatisticsDataItem) => {
    uniqueChatbots.add(item.chatbot._id);
  });

  // Count unique creators
  const uniqueCreators = new Set<string>();
  rawStatisticsData.forEach((item: StatisticsDataItem) =>
    uniqueCreators.add(item.user._id)
  );

  // Count total sessions
  let totalSessions = 0;
  let totalRequests = 0;
  let totalUsageTime = 0;
  const sessionsData: SessionDisplayData[] = [];

  // Create per chatbot data
  const chatbotMap = new Map<string, ChatbotStat>();
  const usersByChatbot = new Map<string, Set<string>>();

  // Process all data
  rawStatisticsData.forEach((item: StatisticsDataItem) => {
    const chatbotId = item.chatbot._id;
    const userId = item.user._id;
    const sessionIds = Object.keys(item.data || {});

    totalSessions += sessionIds.length;

    // Track unique users per chatbot
    if (!usersByChatbot.has(chatbotId)) {
      usersByChatbot.set(chatbotId, new Set<string>());
    }
    usersByChatbot.get(chatbotId)?.add(userId);

    // Initialize chatbot stats if not already present
    if (!chatbotMap.has(chatbotId)) {
      chatbotMap.set(chatbotId, {
        id: chatbotId,
        name: item.chatbot.name,
        type: item.chatbot.type,
        isActive: item.chatbot.isActive,
        creator: item.user.username,
        sessions: 0,
        requests: 0,
        usageTime: 0,
        uniqueUsers: 0,
      });
    }

    const chatbot = chatbotMap.get(chatbotId);
    if (!chatbot) return; // TypeScript safety

    chatbot.sessions += sessionIds.length;

    // Process session data
    sessionIds.forEach((sessionId) => {
      const session = item.data[sessionId];
      if (!session) return;

      const requests = session.totalChatbotAPIRequests || 0;
      const usageTime = session.totalChatbotUsedTime || 0;

      totalRequests += requests;
      totalUsageTime += usageTime;

      chatbot.requests += requests;
      chatbot.usageTime += usageTime;

      // Add to sessions display data
      sessionsData.push({
        id: sessionId,
        chatbotName: item.chatbot.name,
        creator: item.user.username,
        requests,
        usageTime,
      });
    });
  });

  // Update unique users count for each chatbot
  usersByChatbot.forEach((users, chatbotId) => {
    const chatbot = chatbotMap.get(chatbotId);
    if (chatbot) {
      chatbot.uniqueUsers = users.size;
    }
  });

  const chatbotStats: ChatbotStat[] = Array.from(chatbotMap.values());

  // Create data for charts with percentage calculation
  const chatbotDistributionData: ChartData[] = chatbotStats.map((chatbot) => {
    const percentage =
      totalRequests > 0
        ? Math.round((chatbot.requests / totalRequests) * 100)
        : 0;

    return {
      name: chatbot.name,
      value: chatbot.requests,
      percentage,
    };
  });

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessionsData].sort((a, b) => {
    return b.id.localeCompare(a.id);
  });

  const result = {
    uniqueChatbots: uniqueChatbots.size,
    uniqueCreators: uniqueCreators.size,
    totalSessions,
    totalRequests,
    totalUsageTime,
    chatbotStats,
    chatbotDistributionData,
    sessionsData: sortedSessions,
  };

  return result;
};

// Colors for charts - using a distinct color palette
export const CHART_COLORS = [
  '#58C8DD', // Cyan
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#34D399', // Green
];
