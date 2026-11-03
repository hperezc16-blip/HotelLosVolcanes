import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (combinación de clases CSS)", () => {
  it("une varias clases en una sola cadena", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("ignora valores falsos para clases condicionales", () => {
    const activo = false;
    expect(cn("btn", activo && "btn-activo", undefined, null)).toBe("btn");
  });

  it("resuelve conflictos de Tailwind dejando la última clase", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-green-600")).toBe("text-green-600");
  });
});
