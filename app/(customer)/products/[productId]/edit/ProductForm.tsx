"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProductAction, updateProductAction } from "./product.action";
import {
	GRADIENTS_CLASSES,
	ProductSchema,
	ProductType,
} from "./product.schema";

export type ProductFormProps = {
	defaultValues?: ProductType;
	productId?: string;
};

export const ProductForm = (props: ProductFormProps) => {
	const form = useZodForm({
		schema: ProductSchema,
		defaultValues: props.defaultValues,
	});

	const isCreate = !Boolean(props.defaultValues);
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: async (values: ProductType) => {
			const { data, serverError } = isCreate
				? await createProductAction(values)
				: await updateProductAction({
						id: props.productId ?? "-",
						data: values,
				  });

			if (serverError || !data) {
				toast.error(serverError);
				return;
			}

			toast.success("product created");
			router.push(`/products/${data.id}`);
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{isCreate
						? "Create Product"
						: `Edit Product ${props.defaultValues?.name}`}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form
					className="flex flex-col gap-4"
					form={form}
					onSubmit={async (values) => {
						await mutation.mutateAsync(values);
					}}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Iphone 12" {...field} />
								</FormControl>
								<FormDescription>
									The name of the product to review
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input
										placeholder="slug"
										{...field}
										onChange={(e) => {
											const value = e.target.value
												.replaceAll(" ", "-")
												.toLowerCase();

											field.onChange(value);
										}}
									/>
								</FormControl>
								<FormDescription>
									The slug is used in the URL of the review
									page
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="backgroundColor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background color</FormLabel>
								<FormControl>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
									>
										<SelectTrigger>
											<SelectValue></SelectValue>
										</SelectTrigger>
										<SelectContent>
											{GRADIENTS_CLASSES.map(
												(gradient) => (
													<SelectItem
														key={gradient}
														value={gradient}
														className="flex"
													>
														<span
															className={cn(
																gradient,
																"block w-80 h-8 rounded-md flex-1"
															)}
														></span>
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>
									The review page background color
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button>
						{isCreate ? "Create Product" : "Save product"}
					</Button>
				</Form>
			</CardContent>
		</Card>
	);
};
