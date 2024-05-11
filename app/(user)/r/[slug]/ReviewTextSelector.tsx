import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export type ReviewTextSelectorProps = {};

export const ReviexTextSelector = (props: ReviewTextSelectorProps) => {
	return (
		<Tabs value="audio">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="audio">Audio note</TabsTrigger>
				<TabsTrigger value="text">Text</TabsTrigger>
			</TabsList>
			<TabsContent value="audio" className="flex flex-col gap-2">
				<AudioRecorderControl
					onAudioFinish={(audio) => console.log(audio)}
				/>
				<p className="max-w-sm text-center text-sm font-light text-muted-foreground">
					Just record your thoughts and we will convert it to text for
					you.
				</p>
			</TabsContent>
		</Tabs>
	);
};

const AudioRecorderControl = ({
	onAudioFinish,
}: {
	onAudioFinish: (audio: Blob) => void;
}) => {
	const recorderControls = useAudioRecorder();

	return (
		<div className="flex flex-col items-center gap-2">
			<AudioRecorder
				onRecordingComplete={(blob) => onAudioFinish(blob)}
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
		</div>
	);
};
