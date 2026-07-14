import { render, screen } from "@testing-library/react";
import SpecificationList from "components/admin/SpecificationList";

describe("CategoryList", () => {
    const categories = [
        {
            categoryId: 1,
            name: "Catégorie A",
            parentCategory: null,
        },
        {
            categoryId: 2,
            name: "Catégorie B",
            parentCategory: 1,
        },
    ];

    test("affiche toutes les catégories", () => {
        render(
            <SpecificationList
                categories={categories}
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
                categories={[]}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(
            screen.queryByText("Catégorie A")
        ).not.toBeInTheDocument();
    });
});