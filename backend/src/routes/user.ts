import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import z from "zod";
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from "hono/jwt";
import { Bindings } from "hono/types";
import { signInSchema, signUpSchema } from "@rishabhdotasara/common";

const userRouter = new Hono<
    {
      Bindings:{
      DATABASE_URL: string,
      JWT_SECRET: string
    } 
    
  }
>();

userRouter.post("/signup", async (c) => {
  //it's better to intialise the prisma client on every request as it's a serverless function
  //and most probably on serverless services all the routes are deployed as separate functions
  //so it's better to initialise the prisma client on every request
  //not only the prisma client but any variable that you wanna use in the route should be initialised in the route itself

  const prisma = new PrismaClient({
    datasourceUrl:"prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0"
  }).$extends(withAccelerate());

  
  const body = await c.req.json();
  try {
    const {success,error} = await signUpSchema.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid input" ,error});
    }
    else {

      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name:body.username
        },
      });
      const jwt = await sign({ id: user.id }, "medium-clone");
      return c.json({ jwt });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" + e });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0"
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const {success, error} = await signInSchema.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({message:"Invalid input",error});
  }
  else 
  {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
          // password: body.password
        },
      });
      if (user != null && user.password !== body.password) {
        c.status(403);
        return c.json({ message: "Invalid credentials!" });
      }
      if (user != null) {
        const jwt = await sign({ id: user.id }, "medium-clone");
        return c.json({ jwt });
      } else {
        c.status(403);
        return c.json({ message: "No such user exists" });
      }
      
    } 
    catch (err) {
      c.status(403);
      c.json({ error: "error while signing in" });
    }
  }
});

export default userRouter;
