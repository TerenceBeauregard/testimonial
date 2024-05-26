"use server";

import { openai } from "@/openai";
import { prisma } from "@/prisma";
import { ActionError, action } from "@/safe-actions";
import { Review } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";
import { ReviewSchemas } from "./review.schema";

export const getReviewAction = action(
	z.object({
		productId: z.string(),
		id: z.string(),
	}),
	async (input) => {
		const review = await prisma.review.findUnique({
			where: {
				id: input.id,
				productId: input.productId,
			},
		});

		if (!review) {
			throw new ActionError("Review not found");
		}

		return review;
	}
);

export const updateReviewAction = action(ReviewSchemas, async (input) => {
	const headerList = headers();
	const userIp =
		headerList.get("x-real-ip") || headerList.get("x-forwarded-for");

	if (!userIp) {
		throw new ActionError("User IP not found");
	}

	let review: Review | null = null;
	if (input.id) {
		review = await prisma.review.findUnique({
			where: {
				id: input.id,
				ip: userIp,
				productId: input.productId,
			},
		});

		if (!review) {
			throw new ActionError("Review not found");
		}

		review = await prisma.review.update({
			where: {
				id: input.id,
			},
			data: {
				rating: input.rating ?? review.rating,
				audio: input.audio ?? review.audio,
				text: input.text ?? review.text,
				socialLink: input.socialLink ?? review.socialLink,
				name: input.name ?? review.name,
			},
		});
	} else {
		review = await prisma.review.create({
			data: {
				productId: input.productId,
				ip: userIp,
				rating: input.rating ?? 0,
				audio: input.audio,
				text: input.text,
				socialLink: input.socialLink,
				name: input.name,
			},
		});
	}

	return review;
});

export const processAudioAction = action(
	z.object({
		formData: z.instanceof(FormData),
		reviewId: z.string(),
		productId: z.string(),
	}),
	async (input) => {
		const headerList = headers();
		const userIp =
			headerList.get("x-real-ip") || headerList.get("x-forwarded-for");

		if (!userIp) {
			throw new ActionError("User IP not found");
		}

		const review = await prisma.review.findUnique({
			where: {
				id: input.reviewId,
				productId: input.productId,
				ip: userIp,
			},
			include: {
				product: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		if (!review) {
			throw new ActionError("Review not found");
		}

		if (review.text) {
			throw new ActionError("Review already has text");
		}

		const audioFile = input.formData.get("audio");

		const result = await openai.audio.transcriptions.create({
			file: audioFile as any,
			model: "whisper-1",
		});

		if (!result.text) {
			throw new ActionError("Failed to transcribe audio");
		}

		const finalResult = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			temperature: 0.7,
			messages: [
				{
					role: "system",
					content: `Context : Your are a transcriptionist and you are transcribing an audio for an product, the audiio is about the product ${review.product.name}. 
					Goal: You need to transcribe the audio into a written review for the product.
					Criteria: 1.The review should be detailed and informative. 2.The review must respect what the customer said in th audio`,
				},
				{
					role: "user",
					content: result.text,
				},
			],
		});

		const resultText = finalResult.choices[0].message.content;
		await prisma.review.update({
			where: {
				id: input.reviewId,
			},
			data: {
				text: resultText,
			},
		});

		return review;
	}
);
