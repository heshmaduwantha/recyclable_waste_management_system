import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "./config/db";
import { HttpError } from "./domain";
export type Actor = { id: string; role: "admin" | "customer" | "picker" };
declare global {
  namespace Express {
    interface Request {
      actor: Actor;
    }
  }
}
export const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32)
  throw new Error("JWT_SECRET must contain at least 32 characters");
export function signToken(user: Actor) {
  return jwt.sign({ role: user.role }, secret!, {
    subject: user.id,
    expiresIn: "12h",
    issuer: "ecocollect",
    audience: "ecocollect-clients",
  });
}
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) throw new HttpError(401, "Please sign in.");
    const payload = jwt.verify(token, secret!, {
      issuer: "ecocollect",
      audience: "ecocollect-clients",
    }) as jwt.JwtPayload;
    const { rows } = await pool.query(
      "SELECT id,role FROM users WHERE id=$1 AND active=true",
      [payload.sub],
    );
    if (!rows[0]) throw new HttpError(401, "Account unavailable.");
    req.actor = rows[0];
    next();
  } catch (e) {
    next(
      e instanceof HttpError
        ? e
        : new HttpError(401, "Session expired. Please sign in again."),
    );
  }
}
export function roles(...allowed: string[]) {
  return (req: Request, _res: Response, next: NextFunction) =>
    allowed.includes(req.actor.role)
      ? next()
      : next(new HttpError(403, "This action is not available for your role."));
}
