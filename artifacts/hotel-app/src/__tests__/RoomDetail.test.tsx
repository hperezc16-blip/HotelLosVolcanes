import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

/**
 * Dobles de prueba de la página de detalle.
 * Se aíslan la API (react-query), el enrutador, la sesión, axios y los toasts
 * para probar solo el flujo de la página: detalle → pago → confirmación.
 */
const setLocation = vi.fn();
const toast = vi.fn();
const mutate = vi.fn();
const post = vi.fn();
let roomState: { data?: unknown; isLoading: boolean } = { isLoading: false };
let user: { email: string } | null = null;
let mutationOptions: { onSuccess: (d: unknown) => Promise<void>; onError: (e: unknown) => void };

vi.mock("wouter", () => ({
  useParams: () => ({ id: "r1" }),
  useLocation: () => ["/rooms/r1", setLocation],
}));
vi.mock("@workspace/api-client-react", () => ({
  useGetRoom: () => roomState,
  getGetRoomQueryKey: (id: string) => ["room", id],
  useCreateReservation: (opts: { mutation: typeof mutationOptions }) => {
    mutationOptions = opts.mutation;
    return { mutate, isPending: false };
  },
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user }) }));
vi.mock("@/lib/axios-client", () => ({ axiosInstance: { post: (...a: unknown[]) => post(...a) } }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

import RoomDetail from "@/pages/RoomDetail";

const room = {
  id: "r1", nombre: "Suite Volcán", tipo: "suite", precioNoche: "500.00",
  capacidad: 2, activo: true, imageUrl: null, amenidades: "Wifi, Jacuzzi", descripcion: null,
};

function fillDates() {
  fireEvent.change(screen.getByTestId("input-check-in"), { target: { value: "2026-12-10" } });
  fireEvent.change(screen.getByTestId("input-check-out"), { target: { value: "2026-12-12" } });
}

describe("RoomDetail (página de detalle y reservación)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    roomState = { data: room, isLoading: false };
    user = null;
  });
  afterEach(() => vi.useRealTimers());

  it("muestra el estado de carga", () => {
    roomState = { isLoading: true };
    const { container } = render(<RoomDetail />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("muestra 'no encontrada' y permite volver al catálogo", () => {
    roomState = { data: undefined, isLoading: false };
    render(<RoomDetail />);
    fireEvent.click(screen.getByText("Volver a Habitaciones"));
    expect(setLocation).toHaveBeenCalledWith("/rooms");
  });

  it("usa la imagen por defecto y las amenidades de la habitación", () => {
    render(<RoomDetail />);
    expect(screen.getByAltText("Suite Volcán").getAttribute("src")).toContain("unsplash");
    expect(screen.getByText("Jacuzzi")).toBeTruthy();
  });

  it("pide iniciar sesión antes de pasar al pago", async () => {
    render(<RoomDetail />);
    fillDates();
    fireEvent.click(screen.getByTestId("button-continue-payment"));
    await waitFor(() => expect(setLocation).toHaveBeenCalledWith("/login"));
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Inicie sesion" }));
  });

  it("completa el flujo de pago y muestra la confirmación", async () => {
    user = { email: "maria@example.com" };
    render(<RoomDetail />);
    fillDates();
    fireEvent.click(screen.getByTestId("button-continue-payment"));
    await screen.findByTestId("button-confirm-payment");

    fireEvent.click(screen.getByText("Pago por correo"));
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-confirm-payment"));
    expect(screen.getByText("Procesando su pago")).toBeTruthy();
    await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
    vi.useRealTimers();

    expect(mutate).toHaveBeenCalledWith({
      data: { habitacionId: "r1", fechaEntrada: "2026-12-10", fechaSalida: "2026-12-12", notas: "" },
    });

    post.mockResolvedValue({ data: { codigoAutorizacion: "ABC123", numeroFactura: "FV-1" } });
    await act(async () => { await mutationOptions.onSuccess({ id: "res-1", estado: "confirmada" }); });
    expect(post).toHaveBeenCalledWith("/reservations/res-1/pay", { metodoPago: "factura" });

    fireEvent.click(await screen.findByTestId("button-view-reservations"));
    expect(setLocation).toHaveBeenCalledWith("/my-reservations");
  });

  it("si el pago falla, igual muestra la reservación confirmada", async () => {
    user = { email: "maria@example.com" };
    render(<RoomDetail />);
    fillDates();
    post.mockRejectedValue(new Error("sin red"));
    await act(async () => { await mutationOptions.onSuccess({ id: "res-2", estado: "confirmada" }); });
    expect(await screen.findByTestId("button-view-reservations")).toBeTruthy();
  });

  it("muestra el mensaje de la API cuando la reservación falla", () => {
    render(<RoomDetail />);
    act(() => mutationOptions.onError({ response: { data: { message: "La habitación no está disponible" } } }));
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      variant: "destructive",
      description: "La habitación no está disponible",
    }));
  });

  it("usa un mensaje genérico si la API no envía uno", () => {
    render(<RoomDetail />);
    act(() => mutationOptions.onError(new Error("timeout")));
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      description: "No se pudo procesar la reservacion.",
    }));
  });

  it("permite regresar del pago a los detalles", async () => {
    user = { email: "maria@example.com" };
    render(<RoomDetail />);
    fillDates();
    fireEvent.click(screen.getByTestId("button-continue-payment"));
    fireEvent.click(await screen.findByTestId("button-back-details"));
    expect(screen.getByTestId("button-continue-payment")).toBeTruthy();
  });
});
