import React, { useEffect, useState } from "react";
import * as API from "../API";
import axios from "axios";
import "../styles/institutionConfig.css";

export default function InstitutionConfig() {
  const [institutions, setInstitutions] = useState(null);

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.INSTITUTIONS).then((i) => {
        setInstitutions(i.data);
      });
    });
  };

  const createInstitution = () => {
    let name = document.getElementById("i_name").value;
    if (name) {
      swapIcons(true);
      API.asynchronizeRequest(async function () {
        await axios.post(API.endpoints.INSTITUTIONS, { name: name });
        swapIcons(false);
        fetchInstitutions();
      });
    }
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <tr>
            <th>Code</th>
            <th>Name</th>
          </tr>
          {institutions && institutions.length === 0 ? (
            <tr>
              <td>
                <button onClick={createInstitution}>
                  <svg
                    xmlns="http://www.w3.org/2000/ svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    id="ins-add-icon"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                  <div id="submit-loader" class="loader">
                    Loading...
                  </div>
                </button>
              </td>
              <td>
                <input id="i_name" type="text" placeholder="Name" />
              </td>
            </tr>
          ) : institutions ? (
            institutions.map((x) => {
              return (
                <tr className="institution-entries" key={x.id}>
                  <td>
                    <input type="text" value={x.id} disabled />
                  </td>
                  <td>
                    <input type="text" value={x.name} disabled />
                  </td>
                </tr>
              );
            })
          ) : null}
        </table>
      </div>
    </>
  );
}
