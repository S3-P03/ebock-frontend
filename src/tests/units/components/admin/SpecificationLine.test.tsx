import { render, screen, fireEvent } from "@testing-library/react";
import SpecificationLine from "components/admin/SpecificationLine";
import { SpecificationInfo } from "interfaces/Specification";

describe("CategoryLine", () => {
    const category: SpecificationInfo = {
        specificationId: 1,
        name: "Informatique",
        parentSpecification: null,
    };

    const setup = (
        props = {}
    ) => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();

        render(
            <SpecificationLine
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                {...props}
            />
        );

        return {
            onEdit,
            onDelete,
        };
    };


    test("affiche le nom de la catégorie", () => {
        setup();

        expect(
            screen.getByText("Informatique")
        ).toBeInTheDocument();
    });


    test("n'affiche pas le Chip si showParent est false", () => {
        setup({
            showParent: false,
        });

        expect(
            screen.queryByText("Catégorie")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Sous-catégorie")
        ).not.toBeInTheDocument();
    });


    test("affiche 'Catégorie' pour une catégorie racine", () => {
        setup({
            showParent: true,
        });

        expect(
            screen.getByText("Catégorie")
        ).toBeInTheDocument();
    });


    test("affiche 'Sous-catégorie' pour une sous-catégorie", () => {
        setup({
        category: {
            categoryId: 2,
            name: "Ordinateurs",
            parentCategory: 1,
        },
        showParent: true,
        });

        expect(
            screen.getByText("Sous-catégorie")
        ).toBeInTheDocument();
    });


    test("appelle onEdit avec la bonne catégorie", () => {
        const { onEdit } = setup();

        const buttons = screen.getAllByRole(
            "button"
        );

        fireEvent.click(buttons[0]);

        expect(onEdit).toHaveBeenCalledWith(
            category
        );
    });


    test("appelle onDelete avec la bonne catégorie", () => {
        const { onDelete } = setup();

        const buttons = screen.getAllByRole(
            "button"
        );

        fireEvent.click(buttons[1]);

        expect(onDelete).toHaveBeenCalledWith(
            category
        );
    });


    test("affiche correctement une sous-catégorie avec showParent", () => {
        const subCategory: SpecificationInfo = {
            specificationId: 3,
            name: "Claviers",
            parentSpecification: 1,
        };

        setup({
            category: subCategory,
            showParent: true,
        });

        expect(
            screen.getByText("Claviers")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Sous-catégorie")
        ).toBeInTheDocument();
    });
});