import { createContext, useState } from "react";

/**
 * React context used to relay the search information for the different filters.
 */
export const SearchBarCtx = createContext();

export function SearchBarContextProvider({ children }) {
  // Example:
  const defaultParams = {
    query: "",
    fields: [],
    selectedField: "",
    extras: [["", ""]],
    order: "asc",
  };

  const [searchParams, setSearchParams] = useState(defaultParams);

  return (
    <SearchBarCtx.Provider value={[searchParams, setSearchParams]}>
      {children}
    </SearchBarCtx.Provider>
  );
}
