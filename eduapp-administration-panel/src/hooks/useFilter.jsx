/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export default function useFilter(searchParams, mainInfo, fieldParserFn) {
  const [filter, setFilter] = useState([]);

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
