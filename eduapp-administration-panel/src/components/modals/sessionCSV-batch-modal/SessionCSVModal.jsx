import React, { useState } from "react";
import CSVReader from "react-csv-reader";
import BatchPreviewTable from "../../BatchPreviewTable";
import sessionsTemplate from "../../../assets/sessionsTemplate.png";
import sessionsTemplateBatch from "../../../assets/sessionsTemplateBatch.png";
import ImageModal from "../../ImageModal";
import "./SessionCSVModal.css";

/**
 * Modal used to upload sessions to the databse from a CSV file.
 *
 * @param {Function} closed Executes a function on modal closed.
 */
export default function SessionCSVModal({ closed }) {
  const [template, setTemplate] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [csvTemplateActive, setCsvTemplateActive] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [type, setType] = useState("");
  const showCSVTemplate = () => {
    setCsvTemplateActive(true);
  };
  const beforeLoad = (data) => {
    data.map((x) => {
      if (x[0] !== "") return setCsvData((csvData) => [...csvData, x]);
      return false;
    });
    setModalActive(true);
  };
  const closeCSVTemplate = () => {
    setCsvTemplateActive(false);
  };
  const closeModal = () => {
    setModalActive(false);
    window.location.reload();
  };
  return (
    <>
      <div className="selected-modal-container" id="sessionCSVModal">
        <div className="selected-session-option">
          <div className="modal-button">
            <div className="closed-button" onClick={closed}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
            <div className="modal-body">
              <p>What type of information is it?</p>
              <div className="option-button">
                {template === "sessions" ? (
                  <ImageModal
                    imageRoute={sessionsTemplate}
                    show={csvTemplateActive}
                    close={closeCSVTemplate}
                  />
                ) : (
                  <ImageModal
                    imageRoute={sessionsTemplateBatch}
                    show={csvTemplateActive}
                    close={closeCSVTemplate}
                  />
                )}

                <div
                  className="session-button"
                  onClick={() => {
                    setTemplate("sessions");
                  }}
                >
                  <CSVReader
                    cssClass="csvLoaderSingle"
                    onFileLoaded={(data, fileInfo, originalFile) => {
                      beforeLoad(data);
                      setType("sessions");
                    }}
                  />
                  <button className="csvTemplate" onClick={showCSVTemplate}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-patch-question-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627z" />
                    </svg>
                  </button>
                </div>
                <div
                  className="session-button"
                  onClick={() => {
                    setTemplate("sessionsBatch");
                  }}
                >
                  <CSVReader
                    cssClass="csvLoaderBatch"
                    onFileLoaded={(data, fileInfo, originalFile) => {
                      beforeLoad(data);
                      setType("sessionsBatch");
                    }}
                  />
                  <button className="csvTemplate" onClick={showCSVTemplate}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-patch-question-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BatchPreviewTable
        type={type}
        data={csvData}
        show={modalActive}
        close={closeModal}
      />
    </>
  );
}
