import { Layout, LayoutTitle } from "@/components/layout";
import { pageParams } from "@/types/next";
import { ProductForm } from "../[productId]/edit/ProductForm";

export default async function RoutePage(props: pageParams<{}>) {
	return (
		<Layout>
			<LayoutTitle>Create Product</LayoutTitle>
			<ProductForm />
		</Layout>
	);
}
