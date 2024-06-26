import { requiredCurrentUser } from "@/auth/current-user";
import { Layout, LayoutTitle } from "@/components/layout";
import { prisma } from "@/prisma";
import { pageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { ProductForm } from "./ProductForm";

export default async function RoutePage(
	props: pageParams<{
		productId: string;
	}>
) {
	const user = await requiredCurrentUser();

	const product = await prisma.product.findUnique({
		where: {
			id: props.params.productId,
			userId: user.id,
		},
	});

	if (!product) {
		notFound();
	}

	return (
		<Layout>
			<LayoutTitle>Create Product</LayoutTitle>
			<ProductForm defaultValues={product} productId={product.id} />
		</Layout>
	);
}
