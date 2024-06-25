import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Bars3Icon, BellIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {UserIcon} from "@heroicons/react/24/solid";
import axios from "axios";
import {Link, useLocation} from "react-router-dom";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

function NavItem({to, mobile, currentPath, children}) {
	const active = to === currentPath;

	if (mobile) {
		const className = active
			? "block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
			: "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700";
		return (
			<DisclosureButton
				as={Link}
				to='/'
				className={className}>
				Dashboard
			</DisclosureButton>
		);
	} else {
		const className = active
			? "text-sm font-medium text-gray-900"
			: "text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700";
		return (
			<Link
				to={to}
				className={classNames("inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1", className)}>
				{children}
			</Link>
		);
	}
}

export default function Navbar({user}) {
	const location = useLocation();
	const path = location.pathname;

	const signOut = () => {
		axios({
			method: "POST",
			url: "http://localhost:3001/auth/logout",
			withCredentials: true,
		})
			.then((response) => {
				window.location.reload();
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Disclosure
			as='nav'
			className='bg-white shadow sticky top-0 z-50'>
			{({open}) => (
				<>
					<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
						<div className='flex h-16 justify-between'>
							<div className='flex'>
								<div className='flex flex-shrink-0 items-center'>
									<img
										className='h-8 w-auto'
										src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
										alt='Your Company'
									/>
								</div>
								<div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
									{/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
									<NavItem
										currentPath={path}
										to='/'>
										Dashboard
									</NavItem>
								</div>
							</div>
							<div className='hidden sm:ml-6 sm:flex sm:items-center'>
								{/* Profile dropdown */}
								{user ? (
									<Menu
										as='div'
										className='relative ml-3'>
										<div>
											<MenuButton className='relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
												<span className='absolute -inset-1.5' />
												<span className='sr-only'>Open user menu</span>
												<UserIcon className='h-8 w-8 rounded-full text-indigo-200 ring-2 ring-indigo-200 p-1' />
											</MenuButton>
										</div>
										<MenuItems
											transition
											className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'>
											{/* <MenuItem>
											{({focus}) => (
												<a
													href='#'
													className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
													Your Profile
												</a>
											)}
										</MenuItem>
										<MenuItem>
											{({focus}) => (
												<a
													href='#'
													className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
													Settings
												</a>
											)}
										</MenuItem> */}
											<MenuItem>
												{({focus}) => (
													<a
														href='#'
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															signOut();
														}}
														className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
														Sign out
													</a>
												)}
											</MenuItem>
										</MenuItems>
									</Menu>
								) : (
									<> </>
								)}
							</div>
							<div className='-mr-2 flex items-center sm:hidden'>
								{/* Mobile menu button */}
								<DisclosureButton className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
									<span className='absolute -inset-0.5' />
									<span className='sr-only'>Open main menu</span>
									{open ? (
										<XMarkIcon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									) : (
										<Bars3Icon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									)}
								</DisclosureButton>
							</div>
						</div>
					</div>

					<DisclosurePanel className='sm:hidden'>
						<div className='space-y-1 pb-3 pt-2'>
							<NavItem
								currentPath={path}
								mobile={true}
								to='/'>
								Dashboard
							</NavItem>
						</div>
						<div className='border-t border-gray-200 pb-3 pt-4'>
							{user ? (
								<>
									<div className='flex items-center px-4'>
										<div className='flex-shrink-0'>
											<UserIcon className='h-10 w-10 rounded-full text-indigo-200 ring-2 ring-indigo-200 p-1' />
										</div>
										<div className='ml-3'>
											<div className='text-base font-medium text-gray-800'>{user?.fullName}</div>
											<div className='text-sm font-medium text-gray-500'>{user?.email}</div>
										</div>
									</div>
									<div className='mt-3 space-y-1'>
										<DisclosureButton
											as='a'
											href='#'
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												signOut();
											}}
											className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'>
											Sign out
										</DisclosureButton>
									</div>
								</>
							) : (
								<div className='mt-3 space-y-1'>
									<DisclosureButton
										as={Link}
										to='/login'
										className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'>
										Sign in
									</DisclosureButton>
								</div>
							)}
						</div>
					</DisclosurePanel>
				</>
			)}
		</Disclosure>
	);
}
