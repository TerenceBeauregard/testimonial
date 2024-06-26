import { requiredCurrentUser } from "@/auth/current-user";
import { Layout, LayoutTitle } from "@/components/layout";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/prisma";
import { pageParams } from "@/types/next";
import Link from "next/link";

export default async function RoutePage(props: pageParams<{}>) {
	const user = await requiredCurrentUser();

	const product = await prisma.product.findMany({
		where: { userId: user.id },
	});
	return (
		<Layout>
			<LayoutTitle>Products</LayoutTitle>
			<Card className="p-4">
				{product.length ? (
					<Table>
						<TableHeader>
							<TableHead>Name</TableHead>
							<TableHead>Slug</TableHead>
						</TableHeader>
						<TableBody>
							{product.map((product) => (
								<TableRow key={product.id}>
									<Link
										href={`/products/${product.id}`}
										key={product.id}
									>
										<TableCell>{product.name}</TableCell>
									</Link>
									<TableCell className="font-mono">
										{product.slug}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<Link
						href="/products/new"
						className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-primary p-8 transition-colors hover:bg-accent/40 lg:p-12"
					>
						Create Product
					</Link>
				)}
			</Card>
		</Layout>
	);
}
