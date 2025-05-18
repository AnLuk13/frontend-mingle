import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header/Header";
import { Provider } from "react-redux";
import store from "../lib/redux/store";
import { BrowserRouter } from "react-router-dom";

const renderWithProviders = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>,
  );
};

describe("Header component", () => {
  test("renders MINGLE title", () => {
    renderWithProviders();
    expect(screen.getByText("MINGLE®")).toBeInTheDocument();
  });

  test("renders navigation links for logged out users", () => {
    renderWithProviders();
    expect(screen.getByText("Collection")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("mobile menu toggles", () => {
    renderWithProviders();
    const menuIcon = screen.getByTestId("mobile-menu-icon");
    fireEvent.click(menuIcon);
  });
});
