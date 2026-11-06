import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

/**
 * Dobles de prueba del catálogo.
 * Se aíslan la API (react-query) y el enrutador para verificar solo cómo la
 * página arma los filtros y qué habitaciones muestra.
 */
const useListRooms = vi.fn();

vi.mock("wouter", () => ({
  useSearch: () => "",
  Link: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@workspace/api-client-react", () => ({
  useListRooms: (...args: unknown[]) => useListRooms(...args),
}));

import Rooms from "@/pages/Rooms";

const rooms = [
  { id: "r1", nombre: "Suite Volcán", tipo: "suite", precioNoche: "500.00", capacidad: 2, activo: true, imageUrl: null, descripcion: "Vista al volcán" },
  { id: "r2", nombre: "Doble Inactiva", tipo: "doble", precioNoche: "300.00", capacidad: 2, activo: false, imageUrl: null, descripcion: null },
];

describe("Rooms (catálogo de habitaciones)", () => {
  beforeEach(() => {
    useListRooms.mockReset();
    useListRooms.mockReturnValue({ data: rooms, isLoading: false });
  });

  it("muestra solo las habitaciones activas", () => {
    render(<Rooms />);
    expect(screen.getByText("Suite Volcán")).toBeTruthy();
    expect(screen.queryByText("Doble Inactiva")).toBeNull();
  });

  it("al buscar con fechas envía los filtros y calcula las noches", () => {
    render(<Rooms />);
    fireEvent.change(screen.getByTestId("filter-check-in"), { target: { value: "2026-12-10" } });
    fireEvent.change(screen.getByTestId("filter-check-out"), { target: { value: "2026-12-13" } });
    fireEvent.click(screen.getByTestId("button-apply-filters"));

    const [params] = useListRooms.mock.calls.at(-1)!;
    expect(params).toMatchObject({ fechaEntrada: "2026-12-10", fechaSalida: "2026-12-13" });
    expect(screen.getByText(/Mostrando disponibilidad para/).textContent).toContain("3");
  });

  it("limpiar los filtros vuelve a la búsqueda sin parámetros", () => {
    render(<Rooms />);
    fireEvent.change(screen.getByTestId("filter-check-in"), { target: { value: "2026-12-10" } });
    fireEvent.click(screen.getByTestId("button-apply-filters"));
    fireEvent.click(screen.getByTestId("button-clear-filters"));

    const [params] = useListRooms.mock.calls.at(-1)!;
    expect(params).toEqual({});
  });

  it("avisa cuando no hay habitaciones disponibles", () => {
    useListRooms.mockReturnValue({ data: [], isLoading: false });
    render(<Rooms />);
    expect(screen.getByText("No hay habitaciones disponibles")).toBeTruthy();
  });
});
