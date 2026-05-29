import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, signToken, type AuthRequest } from "../middlewares/auth.js";

const router: Router = Router();

// In-memory store for password reset tokens (demo mode)
const resetTokens = new Map<string, { email: string; expiry: Date }>();

router.post("/auth/register", async (req, res) => {
  const { nombre, email, password, telefono } = req.body;
  if (!nombre || !email || !password) {
    res.status(400).json({ error: "Bad Request", message: "nombre, email y password son requeridos" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Bad Request", message: "La contraseña debe tener al menos 8 caracteres" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Conflict", message: "El email ya está registrado" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({
    nombre,
    email,
    passwordHash,
    telefono: telefono || null,
    rol: "cliente",
  }).returning();

  const token = signToken({ id: user.id, email: user.email, rol: user.rol });
  const { passwordHash: _, ...publicUser } = user;

  res.status(201).json({ token, user: publicUser });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Bad Request", message: "email y password son requeridos" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !user.activo) {
    res.status(401).json({ error: "Unauthorized", message: "Credenciales incorrectas" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Unauthorized", message: "Credenciales incorrectas" });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, rol: user.rol });
  const { passwordHash: _, ...publicUser } = user;
  res.json({ token, user: publicUser });
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Not Found", message: "Usuario no encontrado" });
    return;
  }
  const { passwordHash: _, ...publicUser } = user;
  res.json(publicUser);
});

router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const { nombre, telefono, passwordActual, passwordNueva } = req.body as {
    nombre?: string; telefono?: string; passwordActual?: string; passwordNueva?: string;
  };

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  if (!user) {
    res.status(404).json({ error: "Not Found", message: "Usuario no encontrado" });
    return;
  }

  if (passwordActual && passwordNueva) {
    if (passwordNueva.length < 8) {
      res.status(400).json({ error: "Bad Request", message: "La nueva contraseña debe tener al menos 8 caracteres" });
      return;
    }
    const valid = await bcrypt.compare(passwordActual, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: "Bad Request", message: "Contraseña actual incorrecta" });
      return;
    }
    const passwordHash = await bcrypt.hash(passwordNueva, 12);
    const [updated] = await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, user.id)).returning();
    const { passwordHash: _, ...publicUser } = updated;
    res.json(publicUser);
    return;
  }

  const updates: Partial<typeof user> = {};
  if (nombre !== undefined) updates.nombre = nombre.trim();
  if (telefono !== undefined) updates.telefono = telefono || null;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Bad Request", message: "No hay cambios para guardar" });
    return;
  }

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, user.id)).returning();
  const { passwordHash: _, ...publicUser } = updated;
  res.json(publicUser);
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) { res.status(400).json({ error: "Bad Request", message: "email es requerido" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  if (user) {
    resetTokens.set(token, { email: user.email, expiry: new Date(Date.now() + 3_600_000) });
  }

  res.json({
    message: "Si el correo existe en nuestro sistema, recibirá instrucciones.",
    ...(user ? { token, note: "Modo demo: en producción este token se enviaría por correo" } : {}),
  });
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, nuevaPassword } = req.body as { token?: string; nuevaPassword?: string };
  if (!token || !nuevaPassword) {
    res.status(400).json({ error: "Bad Request", message: "token y nuevaPassword son requeridos" }); return;
  }
  if (nuevaPassword.length < 8) {
    res.status(400).json({ error: "Bad Request", message: "La contraseña debe tener al menos 8 caracteres" }); return;
  }

  const entry = resetTokens.get(token);
  if (!entry || entry.expiry < new Date()) {
    res.status(400).json({ error: "Bad Request", message: "Token inválido o expirado" }); return;
  }

  const passwordHash = await bcrypt.hash(nuevaPassword, 12);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.email, entry.email));
  resetTokens.delete(token);

  res.json({ message: "Contraseña actualizada correctamente" });
});

export default router;
