import { Routes, Route } from "react-router-dom";

import FrontendLayout from './layouts/Frontend';
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Single from "./pages/Single";
import PostByCategory from "./pages/PostByCategory";
import PostByTag from "./pages/PostByTag";
import Page from "./pages/Page";
import Results from "./pages/Results";

import AuthLayout from './layouts/Auth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';

import AdminLayout from './layouts/Admin';
import Dashboard from './pages/admin/Dashboard';

import PrivateRoute from './components/PrivateRoute';
import NoPage from "./pages/NoPage";
import Unauthorized from "./pages/Unauthorized";

import Galleries from './pages/admin/galleries/index';
import SGalleries from './pages/admin/galleries/Single';

import Permissions from './pages/admin/permissions/index';
import Roles from './pages/admin/roles/index';

import Posts from './pages/admin/posts/index';
import SPost from './pages/admin/posts/Single';
import WPost from './pages/admin/posts/Write';

import Categories from './pages/admin/categories/index';
import CCategory from './pages/admin/categories/Write';

import Comments from './pages/admin/comments/index';
import Tags from './pages/admin/tags/index';
import Files from './pages/admin/files/index';

import Users from './pages/admin/users/index';
import SUsers from './pages/admin/users/Single';
import WUser from './pages/admin/users/Write';;

function App() {
	return (
	    <Routes>
			<Route element={<AuthLayout /> }>
		        <Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />
				<Route path="/auth/forget-password" element={<ForgetPassword />} />
				<Route path="/auth/reset-password" element={<ResetPassword />} />
			</Route>
			<Route path="/" element={<FrontendLayout /> }>
				<Route index element={<Home />} />
				<Route path="/blog" element={<Blog />}/>
				<Route path="/posts/:pseotitle" element={<Single />}/>
				<Route path="category/:category" element={<PostByCategory />} />
				<Route path="tag/:tag" element={<PostByTag />} />
				<Route path="/pages/:page" element={<Page />} />
				<Route path="/results" element={<Results />} />
			</Route>
			<Route element={<AdminLayout />}>

		        <Route element={<PrivateRoute />}>
		            <Route path="/dashboard/file-manager" element={<Files />} />
		            
		            <Route path="/dashboard/posts" element={<Posts />} />
		            <Route path="/dashboard/posts/:seotitle" element={<SPost />} />
		            <Route path="/dashboard/posts/write" element={<WPost />} />

		            <Route path="/dashboard/categories" element={<Categories />} />
		            <Route path="/dashboard/categories/write" element={<CCategory />} />

		            <Route path="/dashboard/comments" element={<Comments />} />		            
		            <Route path="/dashboard/tags" element={<Tags />} />

		            <Route path="/dashboard/users" element={<Users />} />
		            <Route path="/dashboard/users/:id" element={<SUsers />} />
		            <Route path="/dashboard/users/write" element={<WUser />} />		            
					<Route path="/dashboard/permissions" element={<Permissions />} />

					<Route path="/dashboard/roles" element={<Roles />} />

		            <Route path="/dashboard/galleries" element={<Galleries />} />
		            <Route path="/dashboard/galleries/:album_id" element={<SGalleries />} />
		        </Route>

		        <Route element={<PrivateRoute />}>
	        		<Route path="/dashboard" element={<Dashboard />} />
		        </Route>

	        </Route>

			<Route path="*" element={<NoPage />} />
			<Route path="/unauthorized" element={<Unauthorized />} />
	    </Routes>
	)
}

export default App;
