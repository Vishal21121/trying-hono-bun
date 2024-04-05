import { Hono } from 'hono'
import connectToDB from './db/dbConfig'
import userRoutes from "./routes/user.routes"

const app = new Hono()

connectToDB()

app.route("/api/v1/user", userRoutes)


export default app
