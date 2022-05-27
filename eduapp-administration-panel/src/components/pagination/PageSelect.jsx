import { useEffect, useState } from "react";
import "../componentStyles/PageSelect.css";

export default function PageSelect({ onPageChange, maxPages }) {
  const [page, setPage] = useState(1);

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

  useEffect(() => onPageChange(page), [page]);

  return (
    <div className="page-selector">
      <button className="page-up-button" onClick={pageDown}>
        &lt;
      </button>
      <span>{page}</span>
      <button className="page-down-button" onClick={pageUp}>
        &gt;
      </button>
    </div>
  );
}
