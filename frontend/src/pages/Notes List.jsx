import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import axios from "axios";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;

function NotesModal({open, modalContent, setOpen, notesActions}) {
	const [status, setStatus] = useState("idle");
	const [data, setData] = useState(modalContent);

	const updateField = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	useEffect(() => {
		setData(modalContent);
	}, [open]);

	const action = (type) => {
		const actions = {
			adding: {
                method: "POST",
                url: "http://localhost:3001/notes",
                data
            },
			updating: {
                method: "PUT",
                url: `http://localhost:3001/notes/${data.id}`,
                data
            },
			deleting: {
                method: "DELETE",
                url: `http://localhost:3001/notes/${data.id}`,
            },
		};

		setStatus(type);
		axios({
            ...actions[type],
		})
			.then((response) => {
				notesActions[type](data, response?.data);
				setOpen(false);
			})
			.catch((error) => {
				console.error(error);
				if (error.response?.data?.message) {
					toast.error(error.response?.data?.message);
				} else {
					toast.error("Something went wrong!");
				}
			})
			.finally(() => {
				setStatus("idle");
			});
	};

	return (
		<Dialog
			className='relative z-50'
			open={open}
			onClose={setOpen}>
			<DialogBackdrop
				transition
				className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in z-40'
			/>

			<div className='fixed inset-0 w-screen overflow-y-auto z-50'>
				<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
					<DialogPanel
						transition
						className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								action(modalContent?.id ? "updating" : "adding");
							}}>
							<div className='sm:flex sm:items-start'>
								<div className='space-y-12 w-full'>
									<div className='border-b border-gray-900/10 pb-12'>
										<h2 className='text-base font-semibold leading-7 text-gray-900'>Note</h2>
										<p className='mt-1 text-sm leading-6 text-gray-600'>This note will be added to your account.</p>

										<div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
											<div className='sm:col-span-4'>
												<label
													htmlFor='title'
													className='block text-sm font-medium leading-6 text-gray-900'>
													Title
												</label>
												<div className='mt-2'>
													<div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600'>
														<input
															type='text'
															name='title'
															id='title'
															onChange={updateField}
															value={data?.title || ""}
															autoComplete='title'
															className='block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
														/>
													</div>
												</div>
											</div>

											<div className='col-span-full'>
												<label
													htmlFor='content'
													className='block text-sm font-medium leading-6 text-gray-900'>
													Content
												</label>
												<div className='mt-2'>
													<textarea
														id='content'
														name='content'
														onChange={updateField}
														value={data?.content || ""}
														rows={3}
														className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2'
														defaultValue={""}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='mt-5 sm:mt-4 sm:flex sm:justify-between sm:flex-row-reverse'>
								<button
									type='submit'
									className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto'
									disabled={["adding", "updating"].includes(status)}
									data-autofocus>
									{modalContent?.id ? "Update" : "Add"} Note
								</button>

								<div>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
										onClick={() => setOpen(false)}
										data-autofocus>
										Cancel
									</button>

									{modalContent?.id ? (
										<button
											type='button'
											className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
											disabled={status === "deleting"}
											onClick={() => action("deleting")}>
											Delete
										</button>
									) : null}
								</div>
							</div>
						</form>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}

export default function NotesList() {
	const [notes, setNotes] = useState([]);
	const [modalContent, setModalContent] = useState(null);

	const notesActions = {
		adding: (note, response) => setNotes([...notes, response]),
		updating: (note) => setNotes(notes.map((n) => (n.id === note.id ? note : n))),
		deleting: (note) => setNotes(notes.filter((n) => n.id !== note.id)),
	};

	useEffect(() => {
		axios({
			method: "GET",
			url: "http://localhost:3001/notes",
			withCredentials: true,
		})
			.then((response) => {
				setNotes(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<>
			<NotesModal
				open={!!modalContent}
				setOpen={setModalContent}
				modalContent={modalContent}
				notesActions={notesActions}
			/>
			<div className='px-4 sm:px-6 lg:px-8 mt-20'>
				<div className='sm:flex sm:items-center'>
					<div className='sm:flex-auto'>
						<h1 className='text-base font-semibold leading-6 text-gray-900'>Notes</h1>
						<p className='mt-2 text-sm text-gray-700'>A list of all the notes in your account.</p>
					</div>
					<div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
						<button
							type='button'
							onClick={() => {
								setModalContent({});
							}}
							className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
							Add Note
						</button>
					</div>
				</div>
				<div className='mt-8 flow-root'>
					<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
							<table className='min-w-full divide-y divide-gray-300'>
								<thead>
									<tr>
										<th
											scope='col'
											className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
											Title
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											Content
										</th>
										<th
											scope='col'
											className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
											<span className='sr-only'>Edit</span>
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{notes?.length > 0 ? notes.map((note) => (
										<tr key={note.id}>
											<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
												{note.title}
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{note.content}</td>
											<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
												<a
													href='#'
													onClick={() => {
														setModalContent(note);
													}}
													className='text-indigo-600 hover:text-indigo-900'>
													Edit<span className='sr-only'> note</span>
												</a>
											</td>
										</tr>
									)): (
										<tr>
											<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
												No notes found
											</td>
											<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'></td>
											<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'></td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
