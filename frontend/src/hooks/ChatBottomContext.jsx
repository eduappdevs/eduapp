import { createContext, useState } from "react";

/**
 * React context used to show/hide ChatBottoms
 */
export const ChatBottomCtx = createContext();

export function ChatBottomContextProvider({ children }) {
  const defaultParams = {
    showing: false
  };

  const [chatBottomParams, setChatBottomParams] = useState(defaultParams);

  return (
    <ChatBottomCtx.Provider value={[chatBottomParams, setChatBottomParams]}>
      {children}
    </ChatBottomCtx.Provider>
  );
}
