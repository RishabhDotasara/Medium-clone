import { Hono } from "hono";
import { PrismaClient, User } from "@prisma/client/edge";
import z from "zod";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { Bindings } from "hono/types";
import { signInSchema, signUpSchema } from "@rishabhdotasara/common";
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  //it's better to intialise the prisma client on every request as it's a serverless function
  //and most probably on serverless services all the routes are deployed as separate functions
  //so it's better to initialise the prisma client on every request
  //not only the prisma client but any variable that you wanna use in the route should be initialised in the route itself

  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const { success, error } = await signUpSchema.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid input", error });
    } else {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.username,
        },
      });
      const jwt = await sign(
        { id: user.id, username: user.name, member: user.member },
        "medium-clone"
      );
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
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success, error } = await signInSchema.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: "Invalid input", error });
  } else {
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
        const jwt = await sign(
          { id: user.id, username: user.name },
          "medium-clone"
        );
        return c.json({ jwt });
      } else {
        c.status(403);
        return c.json({ message: "No such user exists" });
      }
    } catch (err) {
      c.status(403);
      c.json({ error: "error while signing in" });
    }
  }
});

//bookmarks route
//route to bookmark a blog
userRouter.post("/bookmark/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  //create a bookmark object
  try {
    const bookmark = await prisma.bookMark.create({
      data: {
        byID: c.var.userId,
        postID: id,
      },
    });
    c.status(201);
    return c.json({ message: "Bookmark added!" });
  } catch (err) {
    c.status(500);
    return c.json({ message: "Server Error!" + err });
  }
});

//delete all the bookmark
userRouter.delete("/bookmark/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    await prisma.bookMark.delete({
      where: {
        id: id,
      },
    });
    return c.json({ message: "Bookmark deleted!" });
  } catch (err) {
    c.json({ message: "Error deleting the bookmark, try again!" + err });
  }
});

userRouter.get("/bookmarks", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());
  try {
    const bookmarks = await prisma.bookMark.findMany({
      where: {
        byID: c.var.userId,
      },
      include: {
        post: true,
      },
    });

    return c.json({ message: "Bookmarks retreived!", bookmarks });
  } catch (err) {
    c.status(500);
    return c.json({ message: "Error on the server while fetching bookmarks." });
  }
});

//get a bookmark by the userID and the postID
userRouter.get("/bookmark/post/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  try {
    const bookmark = await prisma.bookMark.findMany({
      where: {
        byID: c.var.userId,
        postID: id,
      },
    });
    if (bookmark) {
      // console.log(bookmark);
      c.status(200);
      return c.json({ message: "Successful", bookmark: bookmark[0] });
    } else {
      return c.json({ message: "Some error occured!" });
    }
  } catch (err) {
    c.json({ message: "Error fetching the bookmark!" + err });
  }
});

//followers routes

//create a follow
userRouter.post("/follow/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  const followeeID = c.req.param("id");
  const followerID = c.var.userId;

  try {
    const follow = await prisma.follow.create({
      data: {
        followerID: followerID,
        followeeID: followeeID,
      },
    });

    //add the followee to the users follwers list.
    const user = await prisma.user.findUnique({
      where:{
        id:c.var.userId
      },
      select:{
        following:true
      }
    })
    const prevFollowing = user?.following
    const following = [...prevFollowing || "",followeeID]
    // now update the followers list
    await prisma.user.update({
      where:{
        id:c.var.userId
      },
      data:{
        following:following
      }
    })

    c.status(201);
    return c.json({ message: "Follow request created successfully!" });
  } catch (err) {
    c.status(500);
    c.json({ message: "Error creating a follow request." });
  }
});

userRouter.delete("/follow/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  const followID = c.req.param("id");
  const followerID = c.var.userId;

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        id: followID,
      },
    });

    //remove from folowers list.
    const user = await prisma.user.findUnique({
      where:{
        id:c.var.userId
      },
      select:{
        following:true
      }
    })
    const prevFollowing = user?.following
    const following = prevFollowing?.filter(followee=>followee!=follow?.followeeID)
    // now update the followers list
    await prisma.user.update({
      where:{
        id:c.var.userId
      },
      data:{
        following:following
      }
    })
    await prisma.follow.delete({
      where:{
        id:follow?.id
      }
    })

    c.status(201);
    return c.json({ message: "Follow request deleted successfully!" });
  } catch (err) {
    c.status(500);
    c.json({ message: "Error deleting a follow request." });
  }
});

//return follow request id given follower id and blog id
userRouter.get("/follow/followee/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());
  const followeeID = c.req.param("id");
  try {
    const request = await prisma.follow.findFirst({
      where: {
        followerID: c.var.userId,
        followeeID: followeeID,
      },
    });
    if (request) {
      return c.json({ message: "Successfull retrieval", request });
    } else {
      c.status(500);
    }
  } catch (err) {
    c.status(500);
    c.json({ message: "Error on the server side." });
  }
});

//Notification routes
userRouter.post("/notify", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());
  const body = await c.req.json();
  let message: string;

  //first get the list of all followers
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: c.var.userId,
      },
    });

    if (body.type == "post") {

      //TODO: add a link to the new post in the notification

      message = "New post by " + user?.name;

      const followers = await prisma.follow.findMany({
        where: {
          followeeID: c.var.userId,
        },
      });
      //get the followers id in the followers list.
      const followerIDs: string[] = followers.map(
        (follow) => follow.followerID
      );

      //create the notificaton
      const notification = await prisma.notification.create({
        data: {
          generator: c.var.userId,
          recepients: followerIDs,
          message: message,
          blogLink:body.link 
        },
      });

      return c.json({
        message: "Successfull creation for new post!",
        followers: followerIDs,
      });
    }

    else if (body.type == "follow")
    {
        //create the notification
        const notification = await prisma.notification.create({
          data:{
            generator:c.var.userId,
            recepients:[body.followee],
            message: user?.name + " started following you!"
          }
        }) 

        return c.json({message:"Follow request successfull!"})
    }

  } catch (err) {
    c.status(500);
    return c.json({ message: "Error while creating notification." + err });
  }
});

//get the notifications
userRouter.get("/notifications", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  try {
    const notifications = await prisma.notification.findMany({});

    if (notifications) {
      return c.json({
        message: "Notifications retrieved successfully!",
        notifications,
        userID:c.var.userId
      });
    } else {
      return c.json({ message: "No notifications." });
    }
  } catch (err) {
    c.status(200);
    c.json({ message: "Error on server " + err });
  }
});

//delete the notification
userRouter.delete("/notification/:id",authMiddleware,async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl:
      "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZWMwZjk4ODItM2RkOC00ZGY5LTg5NzQtNWZmNWZkN2E0MjMxIiwidGVuYW50X2lkIjoiM2QyMzEzZjE0MmNmODFlYjY4Njc2NTRjN2NhMzkwMjRlODUxYzVjNDVmOGI5MjlmMjU2YzRhMzkyZGFkZWQyMyIsImludGVybmFsX3NlY3JldCI6IjNiNmQwNzg1LTE2NDgtNGZiMS04N2Q0LWEwZmVjODUxYmU4ZiJ9._5nBNLjJ99FIz_iEbeBX7V6CoqYgPYdYgntCPw7Prn0",
  }).$extends(withAccelerate());

  try {
    const id = c.req.param("id")
    const notification = await prisma.notification.findUnique({
      where:{
        id:id
      }
    });

    //now update the recepients list on the notification
    if (notification?.recepients.length || 0 > 1)
    {

      await prisma.notification.update({
        where:{
          id:notification?.id
        },
        data:{
          recepients:notification?.recepients.filter(r=>r!=c.var.userId)
        }
      })
    }
    else 
    {
      await prisma.notification.delete({
        where:{
          id:id
        }
      })
    }

    c.status(202);
    return c.json({message:"Notification deleted!"})
    
  } catch (err) {
    c.status(200);
    return c.json({ message: "Error on server " + err });
  }
})
export default userRouter;
