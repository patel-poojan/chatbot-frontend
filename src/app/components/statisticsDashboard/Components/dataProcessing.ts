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
      totalVisitedWebsites: 0,
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
  let totalVisitedWebsites = 0;
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
        visitedWebsiteCount: 0,
        pageVisits: {}, // Initialize empty page visits object
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
      const visitedWebsiteCount = session.visitedWebsiteCount || 0;
      const pageVisitedCount = session.pageVisitedCount || {};

      totalRequests += requests;
      totalUsageTime += usageTime;
      totalVisitedWebsites += visitedWebsiteCount;

      chatbot.requests += requests;
      chatbot.usageTime += usageTime;
      chatbot.visitedWebsiteCount =
        (chatbot.visitedWebsiteCount || 0) + visitedWebsiteCount;

      // Aggregate page visits for the chatbot
      if (chatbot.pageVisits && pageVisitedCount) {
        Object.entries(pageVisitedCount).forEach(([url, count]) => {
          if (!chatbot.pageVisits![url]) {
            chatbot.pageVisits![url] = 0;
          }
          chatbot.pageVisits![url] += count;
        });
      }

      // Add to sessions display data
      sessionsData.push({
        id: sessionId,
        chatbotName: item.chatbot.name,
        creator: item.user.username,
        requests,
        usageTime,
        visitedWebsiteCount,
        pageVisits: pageVisitedCount, // Add page visits to session data
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
    totalVisitedWebsites,
    chatbotStats,
    chatbotDistributionData,
    sessionsData: sortedSessions,
  };

  return result;
};

// Helper function to format page visits for display// Replace your current formatPageVisits function with this one:

export const formatPageVisits = (
  pageVisits: { [url: string]: number } | undefined
) => {
  if (!pageVisits || Object.keys(pageVisits).length === 0) {
    return 'None';
  }

  // Get top 3 most visited pages
  const sortedVisits = Object.entries(pageVisits)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);

  // Format each visit as a string with display and count
  const formattedVisits = sortedVisits.map(([url, count]) => {
    try {
      // Try to parse as URL
      const urlObj = new URL(url);

      // For dashboard paths, simplify to just show last part
      if (urlObj.pathname.includes('/dashboard/')) {
        const parts = urlObj.pathname.split('/');
        // Truncate IDs to make them shorter (show only first 8 chars)
        const id = parts[parts.length - 1];
        const display =
          id.length > 8
            ? `/dashboard/...${id.substring(0, 8)}`
            : urlObj.pathname;
        return { display, count };
      }

      // For other paths
      const displayUrl =
        urlObj.pathname === '/'
          ? urlObj.host
          : urlObj.pathname.length > 12
          ? `${urlObj.pathname.substring(0, 12)}...`
          : urlObj.pathname;

      return { display: displayUrl, count };
    } catch (e) {
      // If URL parsing fails, just use the string as is, but truncate if too long
      return {
        display: url.length > 15 ? `${url.substring(0, 15)}...` : url,
        count,
      };
    }
  });

  // Return a simple string that can be used directly (no JSX)
  return formattedVisits
    .map((item) => `${item.display} (${item.count})`)
    .join('\n');
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
