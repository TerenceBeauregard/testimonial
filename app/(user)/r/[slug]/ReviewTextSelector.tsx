import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { processAudioAction } from "./reviews.action";

export type ReviewTextSelectorProps = {
	productId: string;
};

export const ReviexTextSelector = (props: ReviewTextSelectorProps) => {
	return (
		<div className="w-full max-w-lg">
			<Tabs defaultValue="audio">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="audio">Audio note</TabsTrigger>
					<TabsTrigger value="text">Text</TabsTrigger>
				</TabsList>
				<TabsContent value="audio" className="flex flex-col gap-2">
					<AudioRecorderControl
						productId={props.productId}
						onAudioFinish={(audio) => console.log(audio)}
					/>
					<p className="max-w-sm text-center text-sm font-light text-muted-foreground">
						Just record your thoughts and we will convert it to text
						for you.
					</p>
				</TabsContent>
				<TabsContent value="text">
					<InputControl />
				</TabsContent>
			</Tabs>
		</div>
	);
};

const InputControl = ({}) => {
	const [input, setInput] = useState("");
	return (
		<div className="flex flex-col gap-2">
			<Textarea
				placeholder="Write your review here"
				className="w-full bg-accent/50"
				onChange={(e) => setInput(e.target.value)}
			/>
			<Button
				variant="default"
				size="sm"
				onClick={() => {
					console.log(input);
				}}
			/>
		</div>
	);
};

const AudioRecorderControl = ({
	onAudioFinish,
	productId,
}: {
	onAudioFinish: (audio: Blob) => void;
	productId: string;
}) => {
	const [blob, setBlob] = useState<Blob | null>(null);

	const recorderControls = useAudioRecorder();

	const mutation = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append("audio", blob!);
			const {} = await processAudioAction({
				formData,
				productId: "1",
				reviewId: localStorage.getItem(`rewiew-id-${productId}`)!,
			});
		},
	});

	return (
		<div className="flex flex-col items-center gap-2">
			{blob && <audio src={URL.createObjectURL(blob)} controls />},
			<AudioRecorder
				onRecordingComplete={(blob) => {
					onAudioFinish(blob);
					setBlob(blob);
				}}
				recorderControls={recorderControls}
			/>
			{recorderControls.isRecording && (
				<Button
					variant="ghost"
					size="sm"
					onClick={recorderControls.stopRecording}
				>
					Stop recording
				</Button>
			)}
			{blob ? (
				<Button
					variant="ghost"
					size="sm"
					onClick={recorderControls.stopRecording}
				>
					Submit
				</Button>
			) : null}
		</div>
	);
};
