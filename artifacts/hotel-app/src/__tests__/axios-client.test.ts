import { describe, it, expect, beforeEach, vi } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";

/**
 * Stub de localStorage.
 * Por qué se aísla: el interceptor lee el token guardado en el navegador. En la
 * prueba no queremos depender del almacenamiento real ni de lo que dejó otra
 * prueba; el stub nos deja decidir si hay token o no y verificar que se lee la
 * clave correcta.
 */
const store: Record<string, string> = {};
const localStorageStub = {
  getItem: vi.fn((k: string) => store[k] ?? null),
  setItem: vi.fn((k: string, v: string) => { store[k] = v; }),
  removeItem: vi.fn((k: string) => { delete store[k]; }),
};
vi.stubGlobal("localStorage", localStorageStub);

import { axiosInstance } from "@/lib/axios-client";

type Handler = { fulfilled: (c: InternalAxiosRequestConfig) => InternalAxiosRequestConfig };
const interceptor = () =>
  (axiosInstance.interceptors.request as unknown as { handlers: Handler[] }).handlers[0].fulfilled;
const cfg = () => ({ headers: {} }) as InternalAxiosRequestConfig;

describe("Cliente HTTP (axios)", () => {
  beforeEach(() => { for (const k of Object.keys(store)) delete store[k]; vi.clearAllMocks(); });

  it("apunta a la ruta relativa /api", () => {
    expect(axiosInstance.defaults.baseURL).toBe("/api");
  });

  it("agrega el encabezado Authorization cuando hay sesión", () => {
    store["hotel_token"] = "abc.def.ghi";
    const out = interceptor()(cfg());
    expect(localStorageStub.getItem).toHaveBeenCalledWith("hotel_token");
    expect(out.headers.Authorization).toBe("Bearer abc.def.ghi");
  });

  it("no agrega Authorization cuando no hay sesión", () => {
    const out = interceptor()(cfg());
    expect(out.headers.Authorization).toBeUndefined();
  });
});
