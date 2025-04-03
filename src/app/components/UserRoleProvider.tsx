'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Define the context type
export type UserRoleContextType = {
  userRole: string;
  userName: string;
  email: string;
  permissions: string[];
  isLoading: boolean;
};

// Create the context with default values
const UserRoleContext = createContext<UserRoleContextType>({
  userRole: '',
  userName: '',
  email: '',
  permissions: [],
  isLoading: true,
});

// Create a hook for using the context
export const useUserRole = () => {
  const context = useContext(UserRoleContext);

  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

// Create the provider component
export const UserRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data from cookies on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get data from cookies
        const storedUsername = Cookies.get('username');
        const storedEmail = Cookies.get('email');
        const storedRole = Cookies.get('userRole');
        const storedPermissions = Cookies.get('permissions');

        // Set state with appropriate fallbacks
        setUserName(storedUsername || '');
        setEmail(storedEmail || '');
        setRole(storedRole || '');

        // Parse permissions safely
        if (storedPermissions) {
          try {
            const parsedPermissions = JSON.parse(storedPermissions);

            if (Array.isArray(parsedPermissions)) {
              setPermissions(parsedPermissions);
            } else {
              console.warn('Permissions cookie exists but is not an array');
              setPermissions([]);
            }
          } catch (e) {
            console.error('Error parsing permissions from cookie:', e);
            setPermissions([]);
          }
        } else {
          setPermissions([]);
        }
      } catch (error) {
        console.error('Error loading user data from cookies:', error);
        // Set default values in case of error
        setPermissions([]);
      } finally {
        // Always mark loading as complete
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadUserData();
    }
  }, []);

  // Create context value
  const contextValue: UserRoleContextType = {
    userRole: role,
    userName,
    email,
    permissions,
    isLoading,
  };

  // Return the provider with the current context value
  return (
    <UserRoleContext.Provider value={contextValue}>
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleProvider;
