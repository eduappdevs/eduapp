/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "../componentStyles/PageSelect.css";

/**
 * Component used to display pagination in tables.
 *
 * @param {Function} onPageChange Function to executes when the page changes. Mostly used to refetch a page on change.
 * @param {Number} maxPages Max number of pages available to page.
 */
export default function PageSelect({ onPageChange, maxPages }) {
  const minPages = 1;
  const [page, setPage] = useState(1);
  const [canGoUp, setCanGoUp] = useState(true);
  const [canGoDown, setCanGoDown] = useState(false);

  const pageUp = () => {
    if (page < maxPages) {
      setPage(page + 1);
    }
  };

  const pageDown = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (page > minPages) {
      setCanGoDown(true);
    } else setCanGoDown(false);

    if (page < maxPages) {
      setCanGoUp(true);
    } else setCanGoUp(false);

    if (page === maxPages) {
      setCanGoUp(false);
    } else setCanGoUp(true);
    onPageChange(page);
  }, [page]);

  useEffect(() => {
    if (page < maxPages) {
      setCanGoUp(true);
    } else setCanGoUp(false);
  }, [maxPages]);

  return (
    <div className="page-selector">
      <button
        className="page-up-button"
        onClick={pageDown}
        style={{ opacity: canGoDown ? 1 : 0.4 }}
      >
        &lt;
      </button>
      <span>{page}</span>
      <button
        className="page-down-button"
        onClick={pageUp}
        style={{ opacity: canGoUp ? 1 : 0.4 }}
      >
        &gt;
      </button>
    </div>
  );
}
