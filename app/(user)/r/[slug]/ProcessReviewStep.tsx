"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import RatingSelector from "./RatingSelector";
import { ReviexTextSelector } from "./ReviewTextSelector";
import { SocialSelector } from "./SocialSelector";
import { ReviewType } from "./review.schema";
import { getReviewAction, updateReviewAction } from "./reviews.action";

export const ProcessReviewStep = ({ product }: { product: Product }) => {
	const [reviewId, serReviewId, removeReviewId] = useLocalStorage(
		`review-id-${product.id}`,
		null
	);

	const queryClient = useQueryClient();
	const reviewData = useQuery({
		queryKey: ["review", reviewId, "product", product.id],
		enabled: Boolean(reviewId),
		queryFn: async () =>
			getReviewAction({ id: reviewId ?? "", productId: product.id }),
	});

	const mutateReview = useMutation({
		mutationFn: async (data: Partial<ReviewType>) => {
			const { data: actionData, serverError } = await updateReviewAction({
				...data,
				productId: product.id,
				id: reviewId ?? undefined,
			});

			if (!actionData || serverError) {
				toast.error("Failed to update review");
				return;
			}

			await queryClient.invalidateQueries({
				queryKey: ["review", reviewId, "product", product.id],
			});
		},
	});

	const [step, setStep] = useState(0);

	const updateData = (partial: Partial<ReviewType>) => {
		mutateReview.mutate(partial);
	};

	return (
		<AnimatePresence mode="wait">
			{step === 0 && (
				<motion.div
					key="step-0"
					exit={{ opacity: 0, x: -100 }}
					className="flex h-full flex-col items-center justify-center gap-4"
				>
					<h2 className="text-lg font-bold">
						{product.noteText ??
							`How much did you like ${product.name} ?`}
					</h2>
					<RatingSelector
						onSelect={(review) => {
							setStep(1);
							updateData({ rating: review });
						}}
					/>
				</motion.div>
			)}
			{step === 1 && (
				<motion.div
					key="step-1"
					exit={{
						opacity: 0,
						x: -100,
					}}
					initial={{
						opacity: 0,
						x: 100,
					}}
					animate={{
						opacity: 1,
						x: 0,
					}}
					className="flex h-full flex-col items-center justify-center gap-4"
				>
					<h2 className="text-lg font-bold">
						{product.informationText ??
							"I need more information about you"}
					</h2>
					<SocialSelector
						onSelect={(name, url) => {
							setStep(2);
							updateData({ name, socialLink: url });
						}}
					/>
				</motion.div>
			)}
			{step === 2 && (
				<motion.div
					key="step-2"
					exit={{
						opacity: 0,
						x: -100,
					}}
					initial={{
						opacity: 0,
						x: 100,
					}}
					animate={{
						opacity: 1,
						x: 0,
					}}
					className="flex h-full flex-col items-center justify-center gap-4"
				>
					<h2 className="text-lg font-bold">
						{product.reviewText ??
							"Tell me what you liked and what you disliked?"}
					</h2>
					<ReviexTextSelector />
				</motion.div>
			)}
		</AnimatePresence>
	);
};
