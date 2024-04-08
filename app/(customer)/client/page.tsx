import { Layout } from "@/components/layout";
import type { pageParams } from "@/types/next";

export default async function RoutePage(props: pageParams<{}>) {
	return (
		<Layout>
			<p>Hello word</p>
		</Layout>
	);
}
