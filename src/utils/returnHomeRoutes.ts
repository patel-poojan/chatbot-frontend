type UserRole = string;

export const getRouteByRoleAndPermissions = (
  userRole: UserRole,
  permissions: string[]
): string | null => {
  if (userRole === 'user') {
    return '/statistics-dashboard-user';
  } else if (userRole === 'admin') {
    return '/statistics-dashboard';
  } else if (userRole === 'subadmin') {
    // Cascading permission checks for subadmin
    if (permissions.includes('ADMIN_DASHBOARD')) {
      return '/statistics-dashboard';
    } else if (permissions.includes('CREATE_CHATAGENTS')) {
      return '/statistics-dashboard-user';
    } else if (permissions.includes('MANAGE_USERS')) {
      return '/users';
    } else if (permissions.includes('BDA_QUESTION_MANAGEMENT')) {
      return '/bda';
    }
  }

  // If no conditions are met
  return null;
};
