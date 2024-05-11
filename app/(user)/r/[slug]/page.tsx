import { cn } from "@/lib/utils";
import { prisma } from "@/prisma";
import { pageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { ReviewStep } from "./ReviewStep";

export default async function RoutePage(props: pageParams<{ slug: string }>) {
	const product = await prisma.product.findFirst({
		where: { slug: props.params.slug },
	});

	if (!product) {
		notFound();
	}

	return (
		<div
			className={cn(
				"h-full w-full flex flex-col items-center",
				product.backgroundColor
			)}
		>
			<div className="flex items-center gap-2 py-4">
				{product.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						className="size-8"
						src={product.image}
						alt={product.name}
					/>
				) : null}
				<h1 className="text-lg font-bold">{product.name}</h1>
			</div>
			<div className="flex-1">
				<ReviewStep product={product} />
			</div>
		</div>
	);
}
