import { fireEvent, render, screen } from "@testing-library/react";
import RoomList from "components/RoomList";
import { Room } from "interfaces/Message";
import { User } from "interfaces/User";
 
const mockRooms: Room[] = [
  {
    roomId: 1,
    itemId: 3,
    itemName: "Item test 1",
    sellerCip: "larj4236",
    sellerFirstName: "Jean-Félix",
    sellerLastName: "Larouche",
    sellerProfilePicUrl: null,
    buyerCip: "boum7113",
    buyerFirstName: "Milo",
    buyerLastName: "Boucher",
    buyerProfilePicUrl: null
  },
  {
    roomId: 2,
    itemId: 5,
    itemName: "Item test 2",
    sellerCip: "larj4236",
    sellerFirstName: "Jean-Félix",
    sellerLastName: "Larouche",
    sellerProfilePicUrl: null,
    buyerCip: "boum7113",
    buyerFirstName: "Milo",
    buyerLastName: "Boucher",
    buyerProfilePicUrl: null
  },
  {
    roomId: 3,
    itemId: 1,
    itemName: "Item test 3",
    sellerCip: "boum7113",
    sellerFirstName: "Milo",
    sellerLastName: "Boucher",
    sellerProfilePicUrl: null,
    buyerCip: "larj4236",
    buyerFirstName: "Jean-Félix",
    buyerLastName: "Larouche",
    buyerProfilePicUrl: null
  },
];

const mockUser : User = {
    cip: "larj4236",
    firstName: "Jean-Félix",
    lastName: "Larouche",
    email: "",
    profilePictureUrl: ""
};

const mockFunction = jest.fn();
 
const renderList = (rooms: Room[] = mockRooms, user: User = mockUser, parentFunction: Function = mockFunction) => {
  return render(<RoomList rooms={rooms} user={user} parentCallBack={parentFunction}/>);
};
 
describe("RoomList Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
 
    test("renders first room", () => {
      renderList();
      expect(screen.getByText("Item test 1 - Milo Boucher")).toBeInTheDocument();
    });

    test("renders second room", () => {
      renderList();
      expect(screen.getByText("Item test 2 - Milo Boucher")).toBeInTheDocument();
    });

    test("renders third message", () => {
      renderList();
      expect(screen.getByText("Item test 3 - Milo Boucher")).toBeInTheDocument();
    });
  });
 
  // Test Group 2: Room information
  describe("Room information", () => {
    test("displays item name", () => {
        renderList();
        expect(screen.getByText(/Item test 1/)).toBeInTheDocument();
    });

    test("displays other user name", () => {
      renderList();
      expect(screen.getAllByText(/Milo Boucher/)[0]).toBeInTheDocument();
    });

    test("displays avatar and initials", () => {
      renderList();
      expect(screen.getAllByText(/MB/)[0]).toBeInTheDocument();
    });
  });

  // Test Group 3: Redirection
  describe("Redirection on click", () => {
    test("click room item triggers function", () => {
        renderList();

        const itemButton = screen.getAllByRole('button');
        fireEvent.click(itemButton[0]);
        expect(mockFunction).toHaveBeenCalledTimes(1);
    })
  })
});