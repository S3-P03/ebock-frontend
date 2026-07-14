import { fireEvent, render, screen } from "@testing-library/react";
import ChipGroup from "components/ChipGroup";

const mockOptions = [
{
    id: 1,
    label: "Option 1"
},
{
    id: 2,
    label: "Option 2"
},]

const mockChange = jest.fn();

const renderChipGroup = () => {
  return render(<ChipGroup options={mockOptions} error={""} selected={[]} onChange={mockChange} />);
};

describe("ChipGroup Component", () => {

    describe("Rendering", () => {    
        test("renders first chip", () => {
          renderChipGroup();
          expect(screen.getByText("Option 1")).toBeInTheDocument();
        });
    
        test("renders second chip", () => {
          renderChipGroup();
          expect(screen.getByText("Option 2")).toBeInTheDocument();
        });
    });

    describe("Selection", () => {
        test("Selecting one chip", () => {
            renderChipGroup();
            const chip = screen.getByText("Option 1");
            fireEvent.click(chip);
            expect(mockChange).toHaveBeenCalledTimes(1);
        });

        test("Selecting both chips", () => {
            renderChipGroup();
            const chip1 = screen.getByText("Option 1");
            const chip2 = screen.getByText("Option 2");
            fireEvent.click(chip1);
            fireEvent.click(chip2);
            expect(mockChange).toHaveBeenCalledTimes(2);
        });
    });
});