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

app.use(
  router,
)
app.use('/profile', profileRouter)
app.use('/distric', districRouter)

app.listen(3000, () => {
  console.log('Server on port', 3000);
});
