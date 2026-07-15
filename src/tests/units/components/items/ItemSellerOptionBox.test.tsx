import { render, screen, fireEvent } from "@testing-library/react";
import ItemSellerOptionBox from "components/items/ItemSellerOptionBox";
import { DetailedItem } from "interfaces/Item";

describe("ItemSellerOptionBox", () => {
  const mockItemBase: DetailedItem = {
    itemId: 1,
    name: "Test Item",
    description: "A test item",
    price: 100,
    addedAt: new Date().toISOString(),
    quantity: 1,
    category: "Test Category",
    wear: "Factory New",
    sellerCip: "test1234",
    paymentOptions: ["Cash"],
    deliveryOptions: ["Ramassage"],
    tags: [1, 2],
  };

  test("shows stock depleted text when quantity is 0", () => {
    const item = { ...mockItemBase, quantity: 0 };
    const changeItemQuantity = jest.fn();

    render(<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />);

    expect(screen.getByText("Stock épuisé")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Marquer comme vendu/i })).toBeNull();
  });

  test("shows mark as sold button when quantity is 1 and calls changeItemQuantity(1)", () => {
    const item = { ...mockItemBase, quantity: 1 };
    const changeItemQuantity = jest.fn();

    render(<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />);

    const button = screen.getByRole("button", { name: /Marquer comme vendu/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(changeItemQuantity).toHaveBeenCalledTimes(1);
    expect(changeItemQuantity).toHaveBeenCalledWith(1);
  });

  test("renders quantity input and keeps button disabled when quantity is greater than 1", () => {
    const item = { ...mockItemBase, quantity: 5 };
    const changeItemQuantity = jest.fn();

    render(<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />);

    expect(screen.getByText(/Qté restante: 5/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/Quantité à retirer/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Diminuer quantité/i });
    expect(button).toBeDisabled();
  });

  test("enables the decrement button for valid remove quantity and calls changeItemQuantity with the input value", () => {
    const item = { ...mockItemBase, quantity: 5 };
    const changeItemQuantity = jest.fn();

    render(<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />);

    const input = screen.getByLabelText(/Quantité à retirer/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Diminuer quantité/i });

    fireEvent.change(input, { target: { value: "3" } });

    expect(input.value).toBe("3");
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(changeItemQuantity).toHaveBeenCalledTimes(1);
    expect(changeItemQuantity).toHaveBeenCalledWith(3);
  });

  test("shows validation error and keeps button disabled for invalid remove quantity values", () => {
    const item = { ...mockItemBase, quantity: 5 };
    const changeItemQuantity = jest.fn();

    render(<ItemSellerOptionBox item={item} changeItemQuantity={changeItemQuantity} />);

    const input = screen.getByLabelText(/Quantité à retirer/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /Diminuer quantité/i });

    fireEvent.change(input, { target: { value: "0" } });
    expect(screen.getByText(/Doit être supérieur à 0/i)).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "10" } });
    expect(screen.getByText(/Supérieur à la quantité restante/i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
