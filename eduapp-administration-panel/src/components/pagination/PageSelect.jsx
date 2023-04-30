/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "../componentStyles/PageSelect.css";

/**
 * Component used to display pagination in tables.
 *
 * @param {Function} onPageChange Function to executes when the page changes. Mostly used to refetch a page on change.
 * @param {Number} actualPage The actual page.
 * * @param {Number} maxPages Max number of pages available to page.
 */
export default function PageSelect({ onPageChange, actualPage, maxPages }) {
  const minPages = 1;
  const [canGoUp, setCanGoUp] = useState(true);
  const [canGoDown, setCanGoDown] = useState(false);

  const pageUp = () => {
    if (actualPage < maxPages) {
      onPageChange(actualPage + 1);
    }
  };

  const pageDown = () => {
    if (actualPage > 1) {
      onPageChange(actualPage - 1);
    }
  };

  const canGoUpOrDown = () => {
    if (actualPage === maxPages) {
      setCanGoUp(false);
    } else setCanGoUp(true);

    if (actualPage === minPages) {
      setCanGoDown(false);
    } else setCanGoDown(true);
  };

  useEffect(() => {
    canGoUpOrDown();
  }, [actualPage]);

  useEffect(() => {
    if (actualPage < maxPages) {
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
      <span>{actualPage}</span>
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
