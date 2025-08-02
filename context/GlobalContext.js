'use client';
import getUnreadMessageCount from '@/app/actions/getUnreadMessageCount';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount()
        .then((res) => {
          setUnreadCount(res.count ?? 0);
        })
        .catch((error) => {
          console.error('Failed to fetch unread count:', error);
          setUnreadCount(0);
        });
    }
  }, [session]);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
