import { z } from "zod";

export const ReviewSchemas = z.object({
	id: z.string().optional(),
	review: z.string().optional(),
	rating: z.number().optional(),
	text: z.string().optional(),
	audio: z.string().optional(),
	socialLink: z.string().optional(),
	name: z.string().optional(),
	productId: z.string(),
});

export type ReviewType = z.infer<typeof ReviewSchemas>;
