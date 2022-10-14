/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import {
  extraFieldsParser,
  genericRequestParser,
} from "../constants/search_fields";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import { interceptExpiredToken } from "../utils/OfflineManager";

/**
 * Custom hook used to retrieve a filtrated list of the information passed.
 *
 * @param {Object} mainInfo The main information to filter.
 * @param {*} fieldParserFn Parser used for local filtration.
 * @param {*} filterRequest Request to be executed for remote filtration.
 * @param {*} requestFields Fields to be sent for filtration.
 * @returns {Object[]} filter
 */
export default function useFilter(
  mainInfo,
  fieldParserFn = null,
  filterRequest = null,
  requestFields = null
) {
  const [filter, setFilter] = useState(null);
  const [searchParams] = useContext(SearchBarCtx);
  const page =  requestFields.find(f => f?.page)?.page | 1;

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
    if (
      searchParams.query === "" &&
      extraFieldsParser(searchParams.extras) === null
    )
      return setFilter(null);
    else if (requestFields === null)
      throw new Error("No fields provided for remote filtration.");

    try {
      setFilter(
        (
          await filterRequest(
            {
              ...genericRequestParser(
                requestFields,
                searchParams.query,
                searchParams.selectedField,
                extraFieldsParser(searchParams.extras)
              ),
              page: page
            }
          )
        ).data.filtration
      );
    } catch (err) {
      await interceptExpiredToken(err);
    }
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
