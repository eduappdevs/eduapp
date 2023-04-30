/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/render-result-naming-convention */
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import Resources from "./resources";

describe("Resources View", () => {
  test("Search Bar display", () => {
    const component = render(<Resources />);
    const resourcesSearchBarIcon =
      component.container.getElementsByClassName("searchInputIcon")[0];
    expect(resourcesSearchBarIcon).toHaveStyle("display:block");
  });
  test("Check Search Bar In Focus", () => {
    const component = render(<Resources />);
    const resourcesSearchBar =
      component.container.getElementsByTagName("input")[0];
    act(() => resourcesSearchBar.focus());
    expect(resourcesSearchBar).toHaveFocus();
  });
});
