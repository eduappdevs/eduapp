/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { genericRequestParser } from "../constants/search_fields";
import { SearchBarCtx } from "../hooks/SearchBarContext";

export default function useFilter(
  mainInfo,
  fieldParserFn = null,
  filterRequest = null,
  requestFields = null
) {
  const [filter, setFilter] = useState(null);
  const [searchParams] = useContext(SearchBarCtx);

  const localFilter = () => {
    if (!mainInfo) return;
    if (mainInfo.length < 1) return;

    if (searchParams.query === "") setFilter(null);
    else {
      let temp = [];
      for (let m of mainInfo) {
        if (
          fieldParserFn(m, searchParams.selectedField).includes(
            searchParams.query
          )
        )
          temp.push(m);
      }
      setFilter(temp);
    }
  };

  const remoteFilter = async () => {
    if (searchParams.query === "") return setFilter(null);
    else if (requestFields === null)
      throw new Error("No fields provided for remote filtration.");

    setFilter(
      (
        await filterRequest(
          genericRequestParser(
            requestFields,
            searchParams.query,
            searchParams.selectedField
          )
        )
      ).data.filtration
    );
  };

  const matchFilter = async () => {
    if (fieldParserFn !== null) return localFilter();
    if (filterRequest !== null) return await remoteFilter();
    throw new Error("No type of filtration was passed to the filtration hook.");
  };

  useEffect(() => {
    const searchTimeout = setTimeout(async () => await matchFilter(), 250);
    return () => clearTimeout(searchTimeout);
  }, [searchParams]);

  return filter;
}
