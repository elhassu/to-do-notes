import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import {Toaster} from "react-hot-toast";
import {useState} from "react";
import axios from "axios";
import NotesList from "./pages/Notes List";

function App() {
	const [user, setUser] = useState();

	useState(() => {
		axios({
			method: "GET",
			url: "http://localhost:3001/auth/status",
			withCredentials: true,
		})
			.then((response) => {
				setUser(response.data);
			})
			.catch((error) => {});
	}, []);

	return (
		<Router>
			<main>
				<Navbar user={user} />
				<Toaster containerClassName='mt-16' />
				<div className='h-[calc(100vb-64px)] overflow-auto'>
					<Routes>
						<Route
							path='/'
							element={
								user ? (
									<NotesList user={user} />
								) : (
									<Navigate
										to='/login'
										replace
									/>
								)
							}
						/>
						{!user && (
							<>
								<Route
									path='/login'
									element={<Login user={user} />}
								/>
								<Route
									path='/register'
									element={<Register user={user} />}
								/>
							</>
						)}
						<Route
							path='*'
							element={
								<Navigate
									to='/'
									replace
								/>
							}
						/>
					</Routes>
				</div>
			</main>
		</Router>
	);
}

export default App;
