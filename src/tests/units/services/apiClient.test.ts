import { emitApiError } from "services/apiClient";

describe("emitApiError", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("sends an api_error CustomEvent with the provided error and status", () => {
    const receivedEvents: CustomEvent[] = [];
    const listener = (event: Event) => {
      receivedEvents.push(event as CustomEvent);
    };

    window.addEventListener("api_error", listener);
    emitApiError("Erreur de test", 404);
    window.removeEventListener("api_error", listener);

    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0].type).toBe("api_error");
    expect(receivedEvents[0].detail).toEqual({ error: "Erreur de test", status: 404 });
  });

  test("sends another api_error event with a different status", () => {
    const receivedEvents: CustomEvent[] = [];
    const listener = (event: Event) => {
      receivedEvents.push(event as CustomEvent);
    };

    window.addEventListener("api_error", listener);
    emitApiError("Deuxième erreur", 500);
    window.removeEventListener("api_error", listener);

    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0].type).toBe("api_error");
    expect(receivedEvents[0].detail).toEqual({ error: "Deuxième erreur", status: 500 });
  });
});
