import { Context, Hono, Next } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import z from "zod"
import { decode, sign, verify } from 'hono/jwt'
import userRouter from './routes/user'
import blogRouter from './routes/blog'
import authMiddleware from './middlewares/authMiddleware'
import { cors } from 'hono/cors'
// import { parseBody } from 'hono/utils/body'
import bodyParser from "body-parser"

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

//auth middleware
// app.use(authMiddleware)




//user routes
app.use(cors())
// app.use(bodyParser.json()
app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)

app.get('/', (c) => {
  return c.text('Hello by Hono!')
})

export default app
