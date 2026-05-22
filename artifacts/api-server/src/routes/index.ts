import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import roomsRouter from "./rooms.js";
import reservationsRouter from "./reservations.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(roomsRouter);
router.use(reservationsRouter);
router.use(adminRouter);

export default router;
