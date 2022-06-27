import React, { useState } from "react";
import StandardModal from "./modals/standard-modal/StandardModal";
import {
  getExtraFields,
  pushExtraFields,
  updateExtraFields,
  deleteExtraFields,
} from "../services/extrafields.service";

export default function ExtraFields(props) {
  const [extraFields, setExtraFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState("");
  const [show, setShow] = useState(false);
  let table = props.table;
  let id = props.id;

  const extrafields_parser = (data) => {
    if (typeof data === "object") {
      let extrafields = [];
      if (data.length > 1) {
        data.map((extrafield) => {
          extrafields.push(JSON.parse(extrafield));
        });
      } else if (data.length === 1) {
        try {
          extrafields.push(JSON.parse(data));
        } catch (error) {
          console.log(error);
          extrafields_parser(data);
        }
      } else {
        return false;
      }
      return extrafields;
    }
  };

  const GET_EXTRAFIELDS = async () => {
    setLoading(true);

    console.log(table, id);
    await getExtraFields({ table, id }).then((res) => {
      if (!res.data) {
        return false;
      }
      setExtraFields(extrafields_parser(res.data));
      setLoading(false);
    });
  };

  const UPDATE_EXTRAFIELD = (body) => {
    let ex = extraFields.find((f) => f.name === body.name);
    ex.value = body.value;

    updateExtraFields(
      {
        table,
        id,
      },
      ex
    ).then(() => GET_EXTRAFIELDS);
  };

  const PUSH_EXTRAFIELD = (body) => {
    pushExtraFields(
      { table, id },
      {
        name: body.name,
        type: body.type,
        value: "",
      }
    ).then(
      GET_EXTRAFIELDS(),
      (document.getElementById(`new_fieldName_${props.id}`).value = ""),
      (document.getElementById(`new_fieldType_${props.id}`).value = "")
    );
  };

  return (
    <>
      <StandardModal
        show={deleteModal}
        text={`Are you sure you want to delete ${deleteModal} ?`}
        hasTransition
        hasIconAnimation
        icon="error"
        isQuestion={true}
        onYesAction={() => {
          deleteExtraFields({ table, id, name: deleteModal })
            .then(() => {
              GET_EXTRAFIELDS();
              setDeleteModal(false);
            })
            .catch((err) => console.log(err));
        }}
        onNoAction={() => {
          setDeleteModal(false);
        }}
      />
      <StandardModal
        customOkay={"Close"}
        text={"Custom fields"}
        showLoader={loading}
        show={show && !deleteModal}
        hasTransition
        hasIconAnimation
        icon="success"
        onCloseAction={() => {
          setShow(false);
        }}
        isModalExtraFields
        form={
          <>
            <ul className="list">
              {" "}
              {extraFields &&
                extraFields.map((field, index) => {
                  return (
                    <li key={index}>
                      <div className="form">
                        <label>{field.name}</label>
                        <input
                          type={field.type}
                          id={`input_field_${field.name}`}
                          name={field.name}
                          defaultValue={field.value}
                          onChange={(e) =>
                            UPDATE_EXTRAFIELD({
                              name: field.name,
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                      <span
                        className="delete-span"
                        onClick={() => {
                          setDeleteModal(field.name);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                      </span>
                    </li>
                  );
                })}
            </ul>
            <li className="new_extrafield">
              <input
                type="text"
                placeholder="Name"
                id={`new_fieldName_${props.id}`}
              />
              <select id={`new_fieldType_${props.id}`}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <button
                onClick={() => {
                  let name = document.getElementById(
                    `new_fieldName_${props.id}`
                  ).value;
                  let type = document.getElementById(
                    `new_fieldType_${props.id}`
                  ).value;
                  name != "" &&
                    type != "" &&
                    PUSH_EXTRAFIELD({
                      name: name,
                      type: type,
                    });
                }}
              >
                +
              </button>
            </li>
          </>
        }
      />
      <button
        onClick={() => {
          setShow(true);
          GET_EXTRAFIELDS();
        }}
        className="extrafields_open_modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-card-list"
          viewBox="0 0 16 16"
        >
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
          <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        </svg>
      </button>
    </>
  );
}
