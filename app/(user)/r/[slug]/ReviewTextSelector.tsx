import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export type ReviewTextSelectorProps = {};

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
}: {
	onAudioFinish: (audio: Blob) => void;
}) => {
	const [blob, setBlob] = useState<Blob | null>(null);

	const recorderControls = useAudioRecorder();

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
