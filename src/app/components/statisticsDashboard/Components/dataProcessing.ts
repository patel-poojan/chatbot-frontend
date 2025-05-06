// utils/dataProcessing.ts
import {
  StatisticsDataItem,
  ProcessedStats,
  ChatbotStat,
  ChartData,
  SessionDisplayData,
  PageVisitData,
  PageVisitDialogData,
} from './types';

// Helper function to check if we have page visit data in the new format
export const hasDetailedPageVisits = (
  pageVisits: Record<string, unknown> | undefined
): boolean => {
  if (!pageVisits || Object.keys(pageVisits).length === 0) {
    return false;
  }

  const firstValue = Object.values(pageVisits)[0];
  return (
    typeof firstValue === 'object' &&
    firstValue !== null &&
    'url' in firstValue &&
    'title' in firstValue
  );
};

// Function to get formatted page visits data for the dialog
export const getDetailedPageVisitsData = (
  pageVisits: Record<string, unknown> | undefined
): PageVisitDialogData[] => {
  if (!pageVisits || Object.keys(pageVisits).length === 0) {
    return [];
  }

  // Check if it's the new format with page visit data objects
  if (hasDetailedPageVisits(pageVisits)) {
    return Object.entries(pageVisits)
      .map(([pageName, pageData]) => {
        if (
          typeof pageData === 'object' &&
          pageData !== null &&
          'url' in pageData &&
          'title' in pageData
        ) {
          // Safe access with type checking
          const typedData = pageData as PageVisitData;

          return {
            title: typedData.title || pageName,
            url: typedData.url,
            count: typedData.count || 0,
          };
        }
        return null;
      })
      .filter((item): item is PageVisitDialogData => item !== null);
  }

  // If it's the old format, return empty array as we don't have detailed data
  return [];
};

// Format page visits for display
export const formatPageVisits = (
  pageVisits: Record<string, unknown> | undefined
): string => {
  if (!pageVisits || Object.keys(pageVisits).length === 0) {
    return 'None';
  }

  // Check if it's the new format
  const isNewFormat = hasDetailedPageVisits(pageVisits);

  if (isNewFormat) {
    // New format handling - pageVisitData objects
    const pageEntries = Object.entries(pageVisits);

    // Sort by count and take top 3
    const sortedVisits = pageEntries
      .sort(([, a], [, b]) => {
        // Type assertions to handle the object structure
        const aObj = a as PageVisitData;
        const bObj = b as PageVisitData;

        const countA = aObj && typeof aObj === 'object' ? aObj.count || 0 : 0;
        const countB = bObj && typeof bObj === 'object' ? bObj.count || 0 : 0;

        return countB - countA;
      })
      .slice(0, 3);

    // Format each visit as a string
    const formattedVisits = sortedVisits.map(([pageName, pageData]) => {
      if (typeof pageData !== 'object' || pageData === null) {
        return `${pageName} (0)`;
      }

      const typedData = pageData as PageVisitData;
      const title = typedData.title || pageName;
      const count = typedData.count || 0;

      // Truncate long titles
      const displayTitle =
        title.length > 20 ? `${title.substring(0, 20)}...` : title;

      return `${displayTitle} (${count})`;
    });

    // Join with newlines
    return formattedVisits.join('\n');
  } else {
    // Legacy format handling (url: number)
    const sortedVisits = Object.entries(pageVisits)
      .sort(([, countA], [, countB]) => {
        const numA = typeof countA === 'number' ? countA : 0;
        const numB = typeof countB === 'number' ? countB : 0;
        return numB - numA;
      })
      .slice(0, 3);

    // Format each visit
    const formattedVisits = sortedVisits.map(([url, count]) => {
      const numCount = typeof count === 'number' ? count : 0;

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
          return `${display} (${numCount})`;
        }

        // For other paths
        const displayUrl =
          urlObj.pathname === '/'
            ? urlObj.host
            : urlObj.pathname.length > 12
            ? `${urlObj.pathname.substring(0, 12)}...`
            : urlObj.pathname;

        return `${displayUrl} (${numCount})`;
      } catch (e) {
        // If URL parsing fails, just use the string as is, but truncate if too long
        const display = url.length > 15 ? `${url.substring(0, 15)}...` : url;
        return `${display} (${numCount})`;
      }
    });

    // Join with newlines
    return formattedVisits.join('\n');
  }
};

// Process statistics data
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
        // Process pageVisitedCount entries and add to chatbot.pageVisits
        if (hasDetailedPageVisits(pageVisitedCount)) {
          // Handle new format (objects with title, url, count)
          Object.entries(pageVisitedCount).forEach(([key, data]) => {
            // Type safety check
            if (
              typeof data === 'object' &&
              data !== null &&
              'url' in data &&
              'count' in data
            ) {
              const pageData = data as PageVisitData;

              // Initialize if not exists
              if (!chatbot.pageVisits![key]) {
                chatbot.pageVisits![key] = {
                  title: pageData.title,
                  url: pageData.url,
                  count: 0,
                };
              }

              // Add counts
              chatbot.pageVisits![key].count += pageData.count;
            }
          });
        } else {
          // Handle old format (url: number) - keep for backward compatibility
          Object.entries(pageVisitedCount).forEach(([url, count]) => {
            const numCount = typeof count === 'number' ? count : 0;

            // In case of old format being migrated to new format
            if (!chatbot.pageVisits![url]) {
              chatbot.pageVisits![url] = {
                title: url,
                url: url,
                count: numCount,
              };
            } else {
              // Update existing entry
              chatbot.pageVisits![url].count += numCount;
            }
          });
        }
      }

      // Add to sessions display data
      sessionsData.push({
        id: sessionId,
        chatbotName: item.chatbot.name,
        creator: item.user.username,
        requests,
        usageTime,
        visitedWebsiteCount,
        pageVisits: pageVisitedCount,
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
