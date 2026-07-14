import { render, screen, fireEvent } from "@testing-library/react";
import DeleteSpecification from "components/admin/DeleteSpecification";

describe("DeleteCategory", () => {
    const category = {
        categoryId: 1,
        name: "Informatique",
        parentCategory: null,
    };

    test("affiche le message de suppression sans enfants", () => {
        render(
            <DeleteSpecification
                category={category}
                hasChildren={false}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            screen.getByText("Supprimer la catégorie")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Supprimer "Informatique" ? Cette action est irréversible.'
            )
        ).toBeInTheDocument();
    });


    test("affiche le message si la catégorie contient des enfants", () => {
        render(
            <DeleteSpecification
                category={category}
                hasChildren={true}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            screen.getByText(
                '"Informatique" contient des sous-catégories. Supprime ou déplace d\'abord ses sous-catégories.'
            )
        ).toBeInTheDocument();
    });


    test("désactive le bouton Supprimer si la catégorie a des enfants", () => {
        render(
            <DeleteSpecification
                category={category}
                hasChildren={true}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            screen.getByRole("button", {
                name: "Supprimer",
            })
        ).toBeDisabled();
    });


    test("appelle onConfirm au clic sur Supprimer", () => {
        const onConfirm = jest.fn();

        render(
            <DeleteSpecification
                category={category}
                hasChildren={false}
                onConfirm={onConfirm}
                onCancel={jest.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Supprimer",
            })
        );

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });


    test("appelle onCancel au clic sur Annuler", () => {
        const onCancel = jest.fn();

        render(
            <DeleteSpecification
                category={category}
                hasChildren={false}
                onConfirm={jest.fn()}
                onCancel={onCancel}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Annuler",
            })
        );

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});