import { describe, it, expect, vi, afterEach } from "vitest";
import { reducer, toast } from "@/hooks/use-toast";

const t = (id: string) => ({ id, title: `Aviso ${id}`, open: true });

describe("Reducer de notificaciones (toast)", () => {
  afterEach(() => vi.useRealTimers());

  it("ADD_TOAST muestra solo la notificación más reciente (límite 1)", () => {
    const s1 = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: t("1") });
    const s2 = reducer(s1, { type: "ADD_TOAST", toast: t("2") });
    expect(s2.toasts.map(x => x.id)).toEqual(["2"]);
  });

  it("UPDATE_TOAST cambia solo la notificación indicada", () => {
    const s = reducer({ toasts: [t("1")] }, { type: "UPDATE_TOAST", toast: { id: "1", title: "Nuevo" } });
    expect(s.toasts[0]).toMatchObject({ id: "1", title: "Nuevo", open: true });
  });

  it("DISMISS_TOAST la cierra (open=false) sin quitarla de inmediato", () => {
    vi.useFakeTimers();
    const s = reducer({ toasts: [t("1")] }, { type: "DISMISS_TOAST", toastId: "1" });
    expect(s.toasts).toHaveLength(1);
    expect(s.toasts[0].open).toBe(false);
  });

  it("REMOVE_TOAST sin id limpia todas las notificaciones", () => {
    const s = reducer({ toasts: [t("1"), t("2")] }, { type: "REMOVE_TOAST" });
    expect(s.toasts).toEqual([]);
  });

  it("REMOVE_TOAST con id quita solo esa notificación", () => {
    const s = reducer({ toasts: [t("1"), t("2")] }, { type: "REMOVE_TOAST", toastId: "1" });
    expect(s.toasts.map(x => x.id)).toEqual(["2"]);
  });

  it("toast() devuelve un id y funciones para cerrar y actualizar", () => {
    const r = toast({ title: "Reservación creada" });
    expect(typeof r.id).toBe("string");
    expect(typeof r.dismiss).toBe("function");
    expect(typeof r.update).toBe("function");
  });
});
