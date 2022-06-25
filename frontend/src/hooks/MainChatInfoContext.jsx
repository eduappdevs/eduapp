import { createContext, useState } from "react";

export const MainChatInfoCtx = createContext();

export function MainChatInfoCtxProvider({ children }) {
  const [chatInfo, setChatInfo] = useState(null);

  return (
    <MainChatInfoCtx.Provider value={[chatInfo, setChatInfo]}>
      {children}
    </MainChatInfoCtx.Provider>
  );
}
