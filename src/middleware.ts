import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" })
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: number
    }
    ;(req as any).user = decoded
    next()
  } catch (err) {
    res.status(403).json({ message: "Token inválido o expirado" })
  }
}

export default verifyJWT
