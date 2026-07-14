import { render, screen } from "@testing-library/react";
import CategoryList from "components/admin/CategoryList";

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
            <CategoryList
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
            <CategoryList
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