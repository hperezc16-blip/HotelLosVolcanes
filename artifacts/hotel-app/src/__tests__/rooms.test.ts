import { describe, it, expect } from "vitest";
import { buildRoomQuery, countNights, calcStayPrice } from "@/lib/rooms";

describe("buildRoomQuery (filtros del catálogo)", () => {
  it("no envía el tipo cuando se elige 'all'", () => {
    expect(buildRoomQuery({ tipo: "all", capacidad: "", fechaEntrada: "", fechaSalida: "" })).toEqual({});
  });

  it("convierte la capacidad a número y conserva fechas y tipo", () => {
    expect(buildRoomQuery({ tipo: "suite", capacidad: "3", fechaEntrada: "2026-12-10", fechaSalida: "2026-12-12" }))
      .toEqual({ tipo: "suite", capacidad: 3, fechaEntrada: "2026-12-10", fechaSalida: "2026-12-12" });
  });
});

describe("countNights", () => {
  it("cuenta las noches entre dos fechas", () => {
    expect(countNights("2026-12-10", "2026-12-12")).toBe(2);
  });

  it("devuelve 0 si falta alguna fecha", () => {
    expect(countNights("2026-12-10", "")).toBe(0);
  });
});

describe("calcStayPrice (precio con impuesto del 12 %)", () => {
  it("calcula subtotal, impuesto y total", () => {
    expect(calcStayPrice("2026-12-10", "2026-12-12", "350.00")).toEqual({ nights: 2, subtotal: 700, impuesto: 84, total: 784 });
  });

  it("devuelve todo en 0 si la salida no es posterior a la entrada", () => {
    expect(calcStayPrice("2026-12-12", "2026-12-12", "350.00").total).toBe(0);
    expect(calcStayPrice("2026-12-12", "2026-12-10", "350.00").total).toBe(0);
  });

  it("devuelve todo en 0 mientras la habitación no ha cargado", () => {
    expect(calcStayPrice("2026-12-10", "2026-12-12", undefined).nights).toBe(0);
  });
});
