import { render, screen } from "@testing-library/react";
import ApiErrorAlert from "components/ApiErrorAlert";

describe("ApiErrorAlert", () => {
  it("renders an API error message", () => {
    render(<ApiErrorAlert error="Service indisponible" status={503} onClose={() => {}} />);

    expect(screen.getByText("Service indisponible (Statut: 503)")).toBeInTheDocument();
  });
});
