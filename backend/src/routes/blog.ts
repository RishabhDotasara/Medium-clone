import { Hono } from "hono";
import { Post, PrismaClient } from "@prisma/client/edge";
import z from "zod";
import { withAccelerate } from '@prisma/extension-accelerate'
import authMiddleware from "../middlewares/authMiddleware";
const blogRouter = new Hono<
    {
      Bindings:{
      DATABASE_URL: string,
      JWT_SECRET: string
    },
    Variables:{
        userId: string,
        isMember: boolean
    } 

    
  }
>();

blogRouter.post("/create",authMiddleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:
          "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
      }).$extends(withAccelerate());

    console.log("Before body")
    const body = await c.req.json()
    console.log("after body")

    //@ts-ignore
    const authorId: string = c.var.userId
    try {
        console.log("Before post")
        const post = await prisma.post.create({
            data:{
                title: body.title,
                content: body.content,
                authorId: authorId,
                published: body.published,
                memberOnly: body.memberOnly
            }
        })
        console.log("after post")
        c.status(201);
        return c.json({message:body.published?"Blog published successfully":"Blog saved as a Draft!",post})
    }
    catch(err)
    {
        c.status(500)
        c.json({message:"Internal server error"})
    }
    // return c.text("Hello from blog route")
})

blogRouter.put("/update/:id",authMiddleware,async (c)=>{
    const id = await c.req.param('id');
    type updatePost = Partial<Post>;

    console.log(id)
    const body = await c.req.json()
    const updatedData: updatePost = body;
    const prisma = new PrismaClient({
        datasourceUrl:
          "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
      }).$extends(withAccelerate());
      try 
      {

          await prisma.post.update({
              where:{
                  id: id
                },
                data:updatedData
            })

            return c.json({message:"Post updated successfully!"})
            
    }
    catch(err)
    {
        c.status(500)
        return c.json({message:"Internal server error"})
    }
      

})

blogRouter.get("/:id",authMiddleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:
          "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
      }).$extends(withAccelerate());
    const id = await c.req.param('id');
    try 
    {   
        const blog = await prisma.post.findUnique({
            where:
            {
                id:id
            },
            include:{
                author:true
            }
        })

        //check if bookmark exists
        const bookmark = await prisma.bookMark.findFirst({
            where:{
                byID:c.var.userId,
                postID:blog?.id
            }
        })

        let blogToSend = {...blog,bookmarked: false,bookmarkID:""}

        if (bookmark)
        {
            blogToSend.bookmarked = true;
            blogToSend.bookmarkID = bookmark.id
        }

        if ((blog?.memberOnly && c.var.isMember) || !blog?.memberOnly)
        {

            c.status(200)
            return c.json({message:"Blog retrieved!",blog:blogToSend})
        }
        else 
        {
            return c.json({message:"Sorry, Member only blog"})
        }
    }
    catch(err)
    {
        c.status(500)
        return c.json({message:"Internal server error"})
    }
})

//route to get posts and published blogs
blogRouter.get("/",authMiddleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:
         "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
      }).$extends(withAccelerate());
    try 
    {
        const drafts = c.req.query('drafts');
        const whereCondition = drafts === "true" ? {
            published: false,
            authorId: c.var.userId
        }: 
        {
            published: true
        }
        
        const blogs = await prisma.post.findMany({
            where:whereCondition,
            include:{
                author:true
            }
        });
        const blogsToSend: any = []
        //logic to label the bookmarked blogs.
        const bookmarks = await prisma.bookMark.findMany({
            where:
            {
                byID:c.var.userId
            }
        })

        await  blogs.map(blog=>{
            blogsToSend
            blogsToSend.push({...blog,bookmarked:bookmarks.find((bookmark)=>{return bookmark.postID == blog.id}) ? true: false})
        })

        c.status(200)
        return c.json({message:"Blogs retrieved!",blogsToSend})
    }
    catch(err)
    {
        c.status(500)
        return c.json({message:"Internal server error"})
    }
})


blogRouter.delete("/:id",authMiddleware,async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:
          "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0"
      }).$extends(withAccelerate());
    const id = await c.req.param('id');
    try 
    {
        await prisma.post.delete({
            where:{
                id:id
            }
        })
        c.status(200)
        return c.json({message:"Blog deleted!"})
    }
    catch(err)
    {
        c.status(500)
        return c.json({message:"Internal server error"})
    }
})

export default blogRouter;