"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/appStore";

const displayMedia = [
	{
		image: "/media0.png",
		url: "https://letterboxd.com/film/dune-part-two/",
	},
	{
		image: "/media16.png",
		url: "https://store.steampowered.com/app/2161700/Persona_3_Reload/",
	},
	{
		image: "/media2.png",
		url: "https://letterboxd.com/film/look-back-2024/",
	},
	{
		image: "/media15.png",
		url: "https://letterboxd.com/film/perfect-blue/",
	},
	{
		image: "/media14.png",
		url: "https://letterboxd.com/film/shogun-2024/",
	},
	{
		image: "/media12.png",
		url: "https://letterboxd.com/film/longlegs/",
	},
	{
		image: "/media17.png",
		url: "https://store.steampowered.com/app/2358720/Black_Myth_Wukong/",
	},
	{
		image: "/media18.png",
		url: "https://letterboxd.com/film/shin-godzilla-orthochromatic/",
	},
];

export default function ImageStack() {
	const [isInView, setIsInView] = useState(false);
	const imageStackRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsInView(true);
					} else {
						setIsInView(false);
					}
				});
			},
			{ threshold: 0.1 } // Adjust the threshold as needed
		);

		if (imageStackRef.current) {
			observer.observe(imageStackRef.current);
		}

		return () => {
			if (imageStackRef.current) {
				observer.unobserve(imageStackRef.current);
			}
		};
	}, []);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isSpread, setIsSpread] = useState(false); // State to spread images
	const [setshowArrow, setSetshowArrow] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const animationDuration = 0.5;

	const loading = useAppStore((state) => state.loading);
	const setLoading = useAppStore((state) => state.setLoading);

	useEffect(() => {
		if (isInView) {
			if (currentIndex < displayMedia.length - 1) {
				const timer = setTimeout(() => {
					setCurrentIndex((prev) => prev + 1);
				}, animationDuration + 500); // Add 500ms delay between animations
				return () => clearTimeout(timer);
			} else {
				const spreadTimer = setTimeout(() => {
					setIsSpread(true);

					// Show arrow after spreading
					const arrowTimer = setTimeout(() => {
						setSetshowArrow(true);
					}, animationDuration * 1000 + 8000); // Add 500ms delay after spreading
					return () => clearTimeout(arrowTimer);
				}, animationDuration + 1000); // Add 1s delay before spreading
				return () => clearTimeout(spreadTimer);
			}
		}
	}, [currentIndex, animationDuration, isInView]);

	const getSpreadPosition = (index) => {
		if (!isSpread) return 0;
		const totalImages = displayMedia.length;
		const spreadWidth = 550; // percentage of container width to spread across
		const step = spreadWidth / (totalImages - 1);
		return (index - (totalImages - 1) / 2) * step;
	};

	return (
		<div
			ref={imageStackRef}
			className="relative w-screen h-screen overflow-hidden bg-[#0A0B06]"
		>
			{!loading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<AnimatePresence>
						{displayMedia
							.slice(0, currentIndex + 1)
							.map((item, index) => (
								<motion.div
									key={index}
									className="absolute w-64 h-96"
									initial={{
										scale: 0.3,
										opacity: 0,
										rotate: 0,
									}}
									animate={{
										scale:
											hoveredIndex === index && isSpread
												? 1.2
												: 1,
										opacity: 1,
										rotate: isSpread
											? hoveredIndex === index
												? 0
												: -15
											: (index -
													(displayMedia.length - 1) /
														2) *
											  5,
										// x: `calc(${getSpreadPosition(index)}% - 32px)`, // Subtracting half the width of the image
										x: `${getSpreadPosition(index)}%`,
										y:
											isSpread && hoveredIndex === index
												? "-5%"
												: "0%",
										zIndex:
											isSpread && hoveredIndex === index
												? 10
												: 1,
									}}
									transition={{
										duration: animationDuration / 1000,
										ease: [0.32, 0.72, 0, 1], // Custom easing for warping effect
										type: "spring",
										stiffness: 260,
										damping: 20,
									}}
									onMouseEnter={() =>
										isSpread && setHoveredIndex(index)
									}
									onMouseLeave={() => setHoveredIndex(null)}
								>
									<div className="w-64 h-96 hover:cursor-pointer">
										<img
											src={item.image}
											alt={`Poster ${index + 1}`}
											className="object-cover w-full h-full rounded-3xl shadow-lg"
											style={{
												width: "100%",
												height: "100%",
											}}
											loading={
												index === 0 ? "eager" : "lazy"
											}
											onClick={() =>
												window.open(item.url, "_blank")
											}
										/>
									</div>
								</motion.div>
							))}
					</AnimatePresence>

					<AnimatePresence>
						{setshowArrow && (
							<motion.div
								className="absolute bottom-0 left-0 right-0 flex justify-center mb-8"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0, duration: 0.5 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
							>
								<img
									src="/arrow-down 1.png"
									alt="arrowdown"
									className="h-32 animate-bounce opacity-40"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
