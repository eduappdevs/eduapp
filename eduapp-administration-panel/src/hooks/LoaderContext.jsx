import { createContext, useState } from "react";
import Loader from "../components/loader/Loader"

/**
 * React context used to relay the search information for the different filters.
 */
export const LoaderCtx = createContext();

export function LoaderContextProvider({ children }) {
  // Example:
  const defaultParams = {
    loading: false
  };

  const [loadingParams, setLoadingParams] = useState(defaultParams);

  return (
    <LoaderCtx.Provider value={[loadingParams, setLoadingParams]}>
      {loadingParams.loading ? <Loader /> : <></>}
      {children}
    </LoaderCtx.Provider>
  );
}
