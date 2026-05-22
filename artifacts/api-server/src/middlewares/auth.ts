import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "hotel-secret-key-2025";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; rol: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized", message: "Token requerido" });
    return;
  }
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; rol: string };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized", message: "Token inválido o expirado" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.rol !== "admin") {
      res.status(403).json({ error: "Forbidden", message: "Solo administradores" });
      return;
    }
    next();
  });
}

export function signToken(payload: { id: string; email: string; rol: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}
