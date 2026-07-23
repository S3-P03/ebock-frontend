import { render, screen } from "@testing-library/react";
import SpecificationList from "components/admin/SpecificationList";

describe("CategoryList", () => {
    const categories = [
        {
            specificationId: 1,
            name: "Catégorie A",
            parentSpecification: null,
        },
        {
            specificationId: 2,
            name: "Catégorie B",
            parentSpecification: 1,
        },
    ];

    test("affiche toutes les catégories", () => {
        render(
            <SpecificationList
                specifications={categories}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(
            screen.getByText("Catégorie A")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Catégorie B")
        ).toBeInTheDocument();
    });


    test("affiche une liste vide sans erreur", () => {
        render(
            <SpecificationList
                specifications={[]}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(
            screen.queryByText("Catégorie A")
        ).not.toBeInTheDocument();
    });
});