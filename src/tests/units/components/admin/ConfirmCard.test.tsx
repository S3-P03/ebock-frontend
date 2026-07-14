import { render, screen } from "@testing-library/react";
import ConfirmCard from "components/admin/ConfirmCard";

describe("ConfirmCard", () => {
    const item = {
        itemId: 3,
        name: "Ordinateur",
        description: "Portable Lenovo",
        price: 500,
        addedAt: "",
        quantity: 1,
        category: "",
        wear: "",
        sellerCip: "",
        paymentOptions: [""],
        deliveryOptions: [""],
        tags: [1]
    }

    test("affiche le nom, la description et le prix", () => {
        render(
            <ConfirmCard item={item} />
        );

        expect(
            screen.getByText("Ordinateur")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Portable Lenovo")
        ).toBeInTheDocument();

        expect(
            screen.getByText("500 $")
        ).toBeInTheDocument();
    });


    test("affiche Gratuit si le prix est 0", () => {
        render(
            <ConfirmCard
                item={{
                ...item,
                price: 0,
                }}
            />
        );

        expect(
            screen.getByText("Gratuit")
        ).toBeInTheDocument();
    });


    test("affiche la localisation Sherbrooke", () => {
        render(
            <ConfirmCard item={item} />
        );

        expect(
            screen.getByText("Sherbrooke")
        ).toBeInTheDocument();
    });
});