import { Hono } from "hono";
import { verify } from "hono/jwt";

const authMiddleware = async (c: any, next: any) => {
    const header = await c.req.header("Authorization")
    const token: string | undefined = await header?.split(" ")[1]
    // console.log(token)
  
    //now verify the token that we got from the request.
    try 
    {

      const decodedData = await verify( token? token: "", "medium-clone");
      await c.set('userId', decodedData.id)
      console.log("Access granted!")
      await next()
    }
    catch(err)
    {
      console.log("Access denied!")
      c.status(403)
      return c.json({message: "Access denied!"})
    }
  
}

  export default authMiddleware;