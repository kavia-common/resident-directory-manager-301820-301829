import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Resident Directory title", () => {
  render(<App />);
  expect(screen.getByText(/Resident Directory/i)).toBeInTheDocument();
});
