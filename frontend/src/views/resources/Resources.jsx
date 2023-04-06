import React from "react";
import * as RESOURCE_SERVICE from "../../services/resource.service";
import { useEffect, useState } from "react";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { GetSubjects } from "../../hooks/GetSubjects";
import { getOfflineUser } from "../../utils/OfflineManager";
import { Select } from "antd";
import ResourcesModal from "../../components/modals/ResourcesModal";
import Loader from "../../components/loader/Loader";
import SubjectDropdown from "../../components/subjectSelector/SubjectDropdown";
import RequireAuth from "../../components/auth/RequireAuth";
import useViewsPermissions from "../../hooks/useViewsPermissions";
import useRole from "../../hooks/useRole";
import useLanguage from "../../hooks/useLanguage";
import "./Resources.css";

export default function Resources() {
  const language = useLanguage();
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [resourcesFilter, setResourcesFilter] = useState("");
  const [resources, setResources] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [showResources, setShowResources] = useState(true);

  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  let subjects = GetSubjects(getOfflineUser().user.id);
  let isTeacher = useRole(userInfo, "eduapp-teacher");
  let isAdmin = useRole(userInfo, "eduapp-admin");

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.innerWidth < 1100) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 750);
  };

  const getResources = async (id) => {
    let resources = await RESOURCE_SERVICE.fetchSubjectResources(id);
    resources.data.map((x) => {
      if (x.firstfile != null) {
        x.firstfile = x.firstfile.url;
      }
      if (x.secondfile != null) {
        x.secondfile = x.secondfile.url;
      }
      if (x.thirdfile != null) {
        x.thirdfile = x.thirdfile.url;
      }
      return true;
    });
    setResources(resources.data);
  };

  const createResource = () => {
    document.getElementsByClassName(
      "resourceModal-container"
    )[0].style.display = "flex";

    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "flex";

    setTimeout(() => {
      document
        .getElementsByClassName("resources__createResourceModal")[0]
        .classList.add("resourceModalScale1");
      document.body.classList.remove("overflow-show");
      document.body.classList.add("overflow-hide");
      document.getElementById("resource-list").classList.add("hide-rest-res");
    }, 1);
  };

  const handleSearchResources = (e) => {
    setResourcesFilter(e.target.value);
  };

  const handleChangeSelector = (id) => {
    setSubjectSelected(id);
    setResources([]);
    getResources(id);
  };

  useViewsPermissions(userInfo, "resources");
  useEffect(() => {
    RequireAuth();
    checkMediaQueries();

    //First check
    if (window.innerWidth < 1100) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);

  return subjects && userInfo ? (
    <>
      <div className="resources-main-container">
        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <h3 className="resources-page-label">{language.resources_select_subject}</h3>
          <Select
            showSearch
            className="subject-ant-select"
            placeholder={language.resources_select_subject}
            optionFilterProp="children"
            onChange={(e) => {
              console.log(e);
              handleChangeSelector(e.split("_")[1]);
              setCurrentSubject(e.split("_")[2]);
              setShowResources(false);
            }}
            options={subjects.map((subject) => ({
              value: `subject_${subject.id}_${subject.name}`,
              label: subject.name,
            }))}
          />
          <h2 className="subject-title">{currentSubject}</h2>
          <div className="resources-toolbar">
            <div className="resourcesSearchBar">
              <form action="">
                <input type="text" onChange={handleSearchResources} />
                <div className="searchInputIcon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                  >
                    <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"></path>
                  </svg>
                </div>
              </form>
            </div>
            {subjectSelected &&
            (isAdmin ||
              (isTeacher &&
                userInfo.teaching_list.includes(subjectSelected))) ? (
              <div
                className="resources__addNewResource"
                onClick={createResource}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-plus-square-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                </svg>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="resources-container">
            {subjects.length > 0 ? (
              <ul id="resource-list">
                {resources.map((data) => {
                  if (
                    data.name
                      .toLowerCase()
                      .includes(resourcesFilter.toLowerCase()) ||
                    resourcesFilter === ""
                  ) {
                    return (
                      <>
                        <li
                          key={"res" + data.name + subjectSelected}
                          id={"res" + data.name + subjectSelected}
                          className="resources resourceitem"
                          onClick={() => {
                            window.location.href = "/resource/" + data.id;
                          }}
                        >
                          <div
                            id={"res" + data.name + subjectSelected}
                            className="resource-name-container"
                          >
                            <span
                              id={"res" + data.name + subjectSelected}
                              className="resource-name"
                            >
                              {data.name}
                            </span>
                          </div>
                          <div className="resourceInfo-container">
                            <div className="resourceInfo__creationDate">
                              <div className="resourceInfo__creationDate__icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-clock-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                </svg>
                              </div>
                              <div className="resourceInfo__creationDate__content">
                                <div className="resourceInfo__cretionDate_date">
                                  {data.created_at.split("T")[0]}
                                </div>
                                <div className="resourceInfo__cretionDate_time">
                                  {data.created_at.split("T")[1].split(".")[0]}
                                </div>
                              </div>
                            </div>
                            <div className="resourceInfo__createdBy">
                              <div className="resourceInfo__createdBy__icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-person-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>
                              </div>
                              <div className="resourceInfo__createdBy__content">
                                {data.user.email}
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  }
                  return true;
                })}
              </ul>
            ) : (
              ""
            )}
            <div
              className="select-subject"
              style={{ display: subjectSelected !== "" ? "none" : "block" }}
            >
              <h3>{language.resources_select_subject}</h3>
            </div>
          </div>
        </section>
        <ResourcesModal
          subject={subjectSelected}
          userInfo={userInfo}
          language={language}
        />
      </div>
    </>
  ) : (
    <Loader />
  );
}
