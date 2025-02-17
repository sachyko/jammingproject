import React, { useState } from "react";
import styles from "./TrackPreviewButton.module.css";

const TrackPreviewButton = ({ trackId, previewUrl, onPlay, onPause }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlayFor30Sec = () => {
		if (previewUrl) {
			// Start playback for 30 seconds
			onPlay(trackId, previewUrl);
			setIsPlaying(true);

			// Stop playback after 30 seconds
			setTimeout(() => {
				onPause(); // Pause after 30 seconds
				setIsPlaying(false);
			}, 30000);
		}
	};

	return (
		<div className={styles.trackpreviewbutton}>
			<button
				className={styles.previewbutton}
				onClick={handlePlayFor30Sec}
				disabled={!previewUrl}
			>
				{isPlaying ? "Pause" : previewUrl ? "Play" : "Preview Unavailable"}
			</button>
		</div>
	);
};

export default TrackPreviewButton;
