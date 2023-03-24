import { createContext, useState } from "react";

/**
 * React context used to pass information from the MainChat view to
 * the ChatInformation component.
 */
export const MainChatInfoCtx = createContext();

export function MainChatInfoCtxProvider({ children }) {
  const [chatInfo, setChatInfo] = useState(null);

  return (
    <MainChatInfoCtx.Provider value={[chatInfo, setChatInfo]}>
      {children}
    </MainChatInfoCtx.Provider>
  );
}
