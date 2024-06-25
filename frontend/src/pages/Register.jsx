import axios from "axios";
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function Register({user}) {
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const [error, setError] = useState(null);

	const passwordsMatch = () => {
		if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
			setError(null);
		} else {
			setError("Passwords do not match!");
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const {name, surname, email, password} = e.target;
		const data = {
			name: name.value,
			surname: surname.value,
			email: email.value,
			password: passwordRef.current.value,
		};

		axios({
			method: "POST",
			url: "http://localhost:3001/auth/register",
			data,
			withCredentials: true,
		})
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				console.error(error);
				if (error.response.data.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error("Something went wrong!");
				}
			});
	};

	return (
		<>
			<div className='flex min-h-full flex-1'>
				<div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
					<div className='mx-auto w-full max-w-sm lg:w-96'>
						<div>
							<img
								className='h-10 w-auto'
								src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
								alt='Your Company'
							/>
							<h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900'>Sign Up</h2>
						</div>

						<div className='mt-10'>
							<div>
								<form
									onSubmit={onSubmit}
									className='space-y-6'>
									<div className='flex items-center gap-4'>
										<div className='flex-grow'>
											<label
												htmlFor='name'
												className='block text-sm font-medium leading-6 text-gray-900'>
												Name
											</label>
											<div className='mt-2'>
												<input
													id='name'
													name='name'
													type='name'
													autoComplete='current-name'
													required
													className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
												/>
											</div>
										</div>
										<div className='flex-grow'>
											<label
												htmlFor='surname'
												className='block text-sm font-medium leading-6 text-gray-900'>
												Surname
											</label>
											<div className='mt-2'>
												<input
													id='surname'
													name='surname'
													type='surname'
													autoComplete='current-surname'
													required
													className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
												/>
											</div>
										</div>
									</div>
									<div>
										<label
											htmlFor='email'
											className='block text-sm font-medium leading-6 text-gray-900'>
											Email address
										</label>
										<div className='mt-2'>
											<input
												id='email'
												name='email'
												type='email'
												autoComplete='email'
												required
												className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor='password'
											className='block text-sm font-medium leading-6 text-gray-900'>
											Password
										</label>
										<div className='mt-2'>
											<input
												id='password'
												name='password'
												type='password'
												ref={passwordRef}
												onChange={passwordsMatch}
												autoComplete='current-password'
												required
												className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
											/>
										</div>
										<label
											htmlFor='password'
											className='block text-sm font-medium leading-6 text-gray-900'>
											Confirm Password
										</label>
										<div className='mt-2'>
											<input
												id='password'
												name='password'
												type='password'
												ref={confirmPasswordRef}
												onChange={passwordsMatch}
												autoComplete='current-password'
												required
												className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2'
											/>
										</div>
									</div>
									{error && <div className='text-white text-base bg-red-700 rounded-lg p-2'>{error}</div>}
									<div>
										<button
											type='submit'
                                            disabled={!!error}
											className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50'>
											Sign Up
										</button>
									</div>
								</form>
							</div>

							<div className='mt-10'>
								<div className='relative'></div>

								<div className='mt-6 grid grid-cols-2 gap-4'></div>
							</div>
						</div>
					</div>
				</div>
				<div className='relative hidden w-0 flex-1 lg:block'>
					<img
						className='absolute inset-0 h-full w-full object-cover'
						src='https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80'
						alt=''
					/>
				</div>
			</div>
		</>
	);
}
