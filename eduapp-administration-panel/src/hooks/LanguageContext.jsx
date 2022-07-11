import { createContext, useState } from "react";
import LANGUAGES from "../constants/languages";

/**
 * React context used to globalize the language objects.
 */
export const LanguageCtx = createContext();

export function LanguageContextProvider({ children }) {
  const [language, setLanguage] = useState(LANGUAGES.en_en);

  return (
    <LanguageCtx.Provider value={[language, setLanguage]}>
      {children}
    </LanguageCtx.Provider>
  );
}
