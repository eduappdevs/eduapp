/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { SearchBarCtx } from "../hooks/SearchBarContext";

export default function useFilter(mainInfo, fieldParserFn) {
  const [filter, setFilter] = useState([]);
  const [searchParams] = useContext(SearchBarCtx);

  useEffect(() => {
    if (!mainInfo) return;
    if (mainInfo.length < 1) return;

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
  }, [searchParams]);

  return filter;
}
