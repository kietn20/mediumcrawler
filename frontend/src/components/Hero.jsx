import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export const Hero = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 0.5 });
	const controls = useAnimation();

	useEffect(() => {
		if (isInView) {
			controls.start("visible");
		}
	}, [isInView, controls]);

	return (
		<div
			ref={ref}
			className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden bg-[#B1FA63] relative"
		>
			<motion.div
				className="flex flex-col items-center absolute top-24"
				initial={{ opacity: 0 }}
				animate={controls}
				variants={{
					visible: { opacity: 1 },
				}}
				transition={{ delay: 1, duration: 1.5 }}
			>
				<span className="font-heading text-[30px]">welcome to</span>
			</motion.div>
			<motion.div
				className="flex flex-col items-center absolute top-28"
				initial={{ opacity: 0 }}
				animate={controls}
				variants={{
					visible: { opacity: 1 },
				}}
				transition={{ delay: 1.8, duration: 1.5 }}
			>
				<span className="font-heading text-9xl">medium crawler</span>
			</motion.div>
			<motion.img
				src="/hero.svg"
				alt="hero"
				initial={{ y: 0, opacity: 1 }}
				animate={controls}
				variants={{
					visible: { y: 50 },
				}}
				transition={{ delay: 0.7, duration: 1.5 }}
				className="absolute mt-24"
			/>
		</div>
	);
};
