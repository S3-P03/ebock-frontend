import { render, screen } from "@testing-library/react";
import ImageDropzone from "components/ImageDropzone";

const renderDropzone = () => {
  return render(<ImageDropzone onFiles={() => {}} error={""} disabled={false} />);
};

describe("ImageDropzone Component", () => {

    describe("Rendering", () => {
        test("renders primary text", () => {
          renderDropzone();
          expect(
            screen.getByText("Glisser les images ici ou cliquer pour explorer les fichiers")
          ).toBeInTheDocument();
        });
    
        test("renders message", () => {
          renderDropzone();
          expect(screen.getByText(/Formats supportés/)).toBeInTheDocument();
        });
    
        test("renders formats", () => {
          renderDropzone();
          expect(screen.getByText(/PNG, JPG/)).toBeInTheDocument();
        });
    });
});