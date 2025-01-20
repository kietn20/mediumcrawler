import { useEffect, useRef, useState } from "react";
import { Slot } from "./Slot";
import { useEditModalStore } from "../store/editStore";
import { useMediaStore } from "../store/mediaStore";
import toast, { Toaster } from "react-hot-toast";
import { motion, useAnimation } from "framer-motion";

export const EditModal = () => {
	// Edit Modal State Store
	const showEditModal = useEditModalStore((state) => state.showEditModal);
	const setShowEditModal = useEditModalStore((state) => state.setShowEditModal);

	// Media Item State Store
	const slotIndexClicked = useMediaStore((state) => state.slotIndexClicked);
	const setSlotIndexClicked = useMediaStore((state) => state.setSlotIndexClicked);
	const currentMediaList = useMediaStore((state) => state.currentMediaList);
	const setMediaItem = useMediaStore((state) => state.setMediaItem);

	// Local state for input values
	const [title, setTitle] = useState("");
	const [rating, setRating] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const defaultMediaObject = { title: "", rating: "", description: "", imageUrl: "" };


	const editModalRef = useRef(null);
	const controls = useAnimation();

	useEffect(() => {
		const mediaItem = currentMediaList.items[slotIndexClicked];
		if (mediaItem) {
			setTitle(mediaItem.title);
			setRating(mediaItem.rating || "");
			setDescription(mediaItem.description || "");
			setImageUrl(mediaItem.imageUrl || "");
		}
	}, [currentMediaList, slotIndexClicked]);

	const validateTitle = (value) => {
		if (!value || value.trim() === "") {
			toast.error("Title is required");
			controls.start({
				x: [0, -10, 10, -10, 10, 0],
				transition: { duration: 0.4 },
			});
			return false;
		}
		return true;
	};

	const validateRating = (value) => {
		if (value && (isNaN(value) || value < 0 || value > 10)) {
			toast.error("Rating must be a number between 0 and 10");
			controls.start({
				x: [0, -10, 10, -10, 10, 0],
				transition: { duration: 0.4 },
			});
			setRating("");
			return false;
		}
		return true;
	};

	const validateImageUrl = (value) => {
		if (value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(value)) {
			toast.error(
				"Image URL must be a valid URL ending with .jpg, .jpeg, .png, .webp, or .gif"
			);
			controls.start({
				x: [0, -10, 10, -10, 10, 0],
				transition: { duration: 0.4 },
			});
			setImageUrl("");
			return false;
		}
		setImageUrl(value);
		return true;
	};

	// const handleSave = () => {
	// 	const isTitleValid = validateTitle(title);
	// 	const isRatingValid = validateRating(rating);
	// 	const isImageUrlValid = validateImageUrl(imageUrl);

	// 	if (isTitleValid && isRatingValid && isImageUrlValid) {
	// 		// const updatedMediaItem = {
	// 		// 	...mediaItem,
	// 		// 	title,
	// 		// 	rating,
	// 		// 	description,
	// 		// 	imageUrl,
	// 		// };
	// 		// setMediaItem(currentEditIndex, updatedMediaItem);
	// 		// setShowEditModal(false);
	// 		const updatedMediaItem = {
	// 			...mediaItem,
	// 			title,
	// 			rating,
	// 			description,
	// 			imageUrl,
	// 		};
	// 		setMediaItem(slotIndexClicked, updatedMediaItem);
	// 		setShowEditModal(false);
	// 	}
	// 	resetEditStates();
	// };

	const resetEditStates = () => {
		setTitle("");
		setRating("");
		setDescription("");
		setImageUrl("");
	};

	const handleClose = () => {
		const isTitleValid = validateTitle(title);
		const isRatingValid = validateRating(rating);
		const isImageUrlValid = validateImageUrl(imageUrl);

		if (isTitleValid && isRatingValid && isImageUrlValid) {
			// const updatedMediaItem = {
			// 	...mediaItem,
			// 	title,
			// 	rating,
			// 	description,
			// 	imageUrl,
			// };
			// setMediaItem(currentEditIndex, updatedMediaItem);
			// setShowEditModal(false);
			const updatedMediaItem = {
				...currentMediaList.items[slotIndexClicked],
				title,
				rating,
				description,
				imageUrl,
			};
			setShowEditModal(false);
			setMediaItem(slotIndexClicked, updatedMediaItem);
			resetEditStates();
		}
	};

	return (
		<>
			{showEditModal && (
				<div
					className="fixed inset-0 bg-black bg-opacity-70 z-30"
					onClick={handleClose}
				></div>
			)}
			<motion.div
				ref={editModalRef}
				animate={controls}
				className={`fixed top-56 w-[700px] h-[470px] bg-[B1FA63] bg-[#151518] flex-col rounded-[30px] border-8 border-lime-900 justify-center z-50 transition-opacity duration-300 font-heading text-white ${showEditModal
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none"
					} `}
			>
				<div className="flex justify-start items-center w-full h-16 bg-pink-200 bg-opacity-0 px-7 text-3xl">
					Edit Media
				</div>
				<div className="flex px-7 justify-between">
					<div className="w-[250px] h-96 bg-orange-400 bg-opacity-0 flex justify-around items-center flex-col text-[14px]">
						<div
							className={`w-[165px] h-[280px] rounded-[30px] flex items-center justify-center text-[#B1FA63] text-9xl font-heading cursor-pointer duration-300 overflow-hidden border-white border`}
							onClick={() =>
								toast(
									'Paste an image URL in the "Web Image URL" field to change the image\n ("https://www.example.com/image.jpg")\n\n ONLY [.jpg, .jpeg, .png, .gif, and .webp] images are supported',
									{
										duration: 6000,
										style: {
											border: "2px solid #B1FA63",
											padding: "10px",
											color: "#151518",
											background: "#B1FA63",
										},
										id: "drag-drop-toast",
									}
								)
							}
						>
							{imageUrl ? (
								<img
									src={imageUrl}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="mb-10">+</div>
							)}
						</div>
					</div>
					<div className="flex-col justify-start items-start gap-5 w-[350px] h-96 bg-blue-300 bg-opacity-0">
						<div className="p-1 bg-pink-0 bg-opacity-40 h-80 text-xl">
							<form action="/" className="flex-col text">
								<div className="flex w-full justify-between items-center pb-2">
									<div className="flex-col w-56 justify-between items-center">
										<label htmlFor="" className="p-1">
											Title*
										</label>
										<input
											type="text"
											placeholder="Parasite"
											className="w-64 text-black"
											value={title}
											onChange={(e) =>
												setTitle(e.target.value)
											}
										/>
									</div>
									<div className="flex-col w-20">
										<label htmlFor="" className="p-1">
											Rating
										</label>
										<input
											type="text"
											placeholder="0.0"
											className="w-20"
											value={rating}
											onChange={(e) =>
												setRating(e.target.value)
											}
											onBlur={(e) =>
												validateRating(e.target.value)
											}
										/>
									</div>
								</div>

								<label htmlFor="" className="p-1">
									Description / Review
								</label>
								<textarea
									name=""
									id=""
									placeholder="Enter description here..."
									className="w-full h-28 text-base"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
								></textarea>
								<label htmlFor="" className="p-1">
									Web Image URL
								</label>
								<input
									type="text"
									className="w-full"
									placeholder="https://www.imdb.com/title/tt6751668/"
									value={imageUrl}
									onChange={(e) =>
										setImageUrl(e.target.value)
									}
									onBlur={(e) =>
										validateImageUrl(e.target.value)
									}
								/>
							</form>
						</div>
						<div className="flex justify-end gap-5 items-center h-10 p-1">
							<button
								className="w-32 bg-red-600 bg-opacity-50 hover:bg-opacity-100 duration-150 border rounded-[30px] p-2 hover:text-black"
								onClick={() => {
									setShowEditModal(false);
									setMediaItem(slotIndexClicked, defaultMediaObject);
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
};
