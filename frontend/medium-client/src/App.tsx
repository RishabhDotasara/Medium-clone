import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
// import Signin from './pages/Signin'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs/Blogs'
import BlogCreate from './pages/BlogCreate'
import Drafts from './pages/Blogs/Drafts'
import EditBlog from './pages/Blogs/EditBlog'



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Blogs/>}/>
          <Route path="/signup" element={<Signup config="signup"/>} />
          <Route path="/signin" element={<Signup config= "signin"/>} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/create" element={<BlogCreate />} />
          <Route path="/blog/drafts" element={<Drafts />} />
          <Route path="/blog/edit/:id" element={<EditBlog />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App