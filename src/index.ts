import bodyParser from "body-parser"
import cors from "cors"
import { config as dotenv } from "dotenv"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import router from "./routes/auth/user.routes";   
import profileRouter from "./routes/auth/profile.routes";
import districRouter from "./routes/auth/utils/distric.routes";
import planRoute from "./routes/components/plans/plan.routes";
import foodRoute from "./routes/components/food/food.routes";
import orderRoute from "./routes/components/orders/order.routes";
import paymentRouter from './routes/components/payment/payment.routes';

import verifyJWT from './middleware';

dotenv()
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb" }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.use(router);
app.use('/profile', verifyJWT, profileRouter);
app.use('/plan', planRoute);
app.use('/distric', districRouter);
app.use('/food', verifyJWT, foodRoute);
app.use('/payment', verifyJWT, paymentRouter);
app.use('/order', verifyJWT, orderRoute);

app.listen(3000, () => {
  console.log('Server on port', 3000);
});
