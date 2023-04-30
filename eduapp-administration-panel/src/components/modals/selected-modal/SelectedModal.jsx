import React from "react";
import "./SelectedModal.css";

export default function SelectedModal({
  show,
  editGlobal,
  deleteGlobal,
  editOne,
  deleteOne,
  selectTypeModal,
  onCloseModal,
  language,
}) {
  return (
    <>
      <div
        className="selected-main-container"
        style={{ display: show ? "flex" : "none" }}
      >
        <div className="selected-container">
          <div className="selected-container-body">
            <div className="selected-container-body-title">
              {selectTypeModal ? (
                <h4>{language.selectedModalEdi}</h4>
              ) : (
                <h4>{language.selectedModalDel}</h4>
              )}
            </div>
            <div className="selected-container-body-option">
              <button
                onClick={
                  selectTypeModal
                    ? () => {
                        editGlobal();
                      }
                    : () => {
                        deleteGlobal();
                      }
                }
              >
                {language.all}
              </button>
              <button
                onClick={
                  selectTypeModal
                    ? () => {
                        editOne();
                      }
                    : () => {
                        deleteOne();
                      }
                }
              >
                {language.justOne}
              </button>
            </div>
            <div className="select-modal-button-close">
              <button
                onClick={() => {
                  onCloseModal();
                }}
              >
                {language.cancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
