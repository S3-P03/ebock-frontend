import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpecificationForm from "components/admin/SpecificationForm";
import { SpecificationInfo } from "interfaces/Specification";

describe("CategoryForm", () => {
    const specifications: SpecificationInfo[] = [
        {
            specificationId: 1,
            name: "Parent 1",
            parentSpecification: null,
        },
        {
            specificationId: 2,
            name: "Parent 2",
            parentSpecification: null,
        },
    ];

    const setup = (props = {}) => {
        const onSave = jest.fn();
        const onCancel = jest.fn();

        render(
            <SpecificationForm
                specifications={specifications}
                specification={null}
                onSave={onSave}
                onCancel={onCancel}
                {...props}
            />
        );

        return {
            onSave,
            onCancel,
        };
    };
    

    test("affiche le formulaire de création", () => {
        setup();

        expect(
            screen.getByText("Créer une spécification")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Créer" })
        ).toBeInTheDocument();
    });


    test("affiche le formulaire de modification", () => {
        const specification = {
            specificationId: 5,
            name: "Catégorie test",
            parentSpecification: 1,
        };

        setup({ specification });

        expect(
            screen.getByText("Modifier une spécification")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Modifier" })
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("Catégorie test")
        ).toBeInTheDocument();
    });


    test("permet de modifier le nom", async () => {
        setup();

        const input = screen.getByLabelText(
            "Nom de la spécification"
        );

        await userEvent.type(input, "Nouvelle spécification");

        expect(input).toHaveValue("Nouvelle spécification");
    });


    test("appelle onSave avec le nom et parentId", async () => {
        const { onSave } = setup({
            showParent: true,
        });

        const input = screen.getByLabelText(
            "Nom de la spécification"
        );

        await userEvent.type(input, "Catégorie enfant");


        fireEvent.mouseDown(
            screen.getByLabelText("Catégorie parente")
        );

        const option = await screen.findByText("Parent 1");
        await userEvent.click(option);


        await userEvent.click(
            screen.getByRole("button", { name: "Créer" })
        );


        expect(onSave).toHaveBeenCalledWith(
            "Catégorie enfant",
            1
        );
    });


    test("appelle onSave avec parentId null si aucune catégorie parente", async () => {
        const { onSave } = setup();

        await userEvent.type(
            screen.getByLabelText("Nom de la spécification"),
            "Catégorie racine"
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Créer" })
        );

        expect(onSave).toHaveBeenCalledWith(
            "Catégorie racine",
            null
        );
    });


    test("réinitialise le formulaire après sauvegarde", async () => {
        const { } = setup();

        const input = screen.getByLabelText(
            "Nom de la spécification"
        );

        await userEvent.type(input, "Test");

        await userEvent.click(
            screen.getByRole("button", { name: "Créer" })
        );

        expect(input).toHaveValue("");
    });


    test("appelle onCancel au clic sur Annuler", async () => {
        const { onCancel } = setup();

        await userEvent.click(
            screen.getByRole("button", { name: "Annuler" })
        );

        expect(onCancel).toHaveBeenCalledTimes(1);
    });


    test("n'affiche pas la sélection parent si showParent est false", () => {
        setup({
            showParent: false,
        });

        expect(
            screen.queryByLabelText("Catégorie parente")
        ).not.toBeInTheDocument();
    });


    test("affiche la sélection parent si showParent est true", () => {
        setup({
            showParent: true,
        });

        expect(
            screen.getByLabelText("Catégorie parente")
        ).toBeInTheDocument();
    });
});