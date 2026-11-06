import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const maria = { id: "cli-1", nombre: "María López", email: "maria@example.com", rol: "cliente" } as never;

describe("AuthContext (sesión del usuario)", () => {
  beforeEach(() => localStorage.clear());

  it("inicia sin sesión y termina de cargar", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("login guarda el usuario y el token en estado y en localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login("tok-123", maria));
    expect(result.current.token).toBe("tok-123");
    expect(result.current.user).toMatchObject({ email: "maria@example.com" });
    expect(localStorage.getItem("hotel_token")).toBe("tok-123");
  });

  it("restaura la sesión guardada al recargar la página", async () => {
    localStorage.setItem("hotel_token", "tok-guardado");
    localStorage.setItem("hotel_user", JSON.stringify(maria));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.token).toBe("tok-guardado");
  });

  it("descarta una sesión guardada dañada", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("hotel_token", "tok");
    localStorage.setItem("hotel_user", "{no es json");
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("hotel_token")).toBeNull();
  });

  it("logout borra la sesión", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login("tok-123", maria));
    act(() => result.current.logout());
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("hotel_user")).toBeNull();
  });

  it("updateUser actualiza los datos del perfil", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login("tok-123", maria));
    act(() => result.current.updateUser({ ...(maria as object), nombre: "María L." } as never));
    expect(result.current.user).toMatchObject({ nombre: "María L." });
    expect(JSON.parse(localStorage.getItem("hotel_user")!).nombre).toBe("María L.");
  });

  it("useAuth fuera del AuthProvider lanza un error claro", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
  });
});
