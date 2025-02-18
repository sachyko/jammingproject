import React, { useRef, useState } from "react";
import styles from "./Track.module.css";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	function passTrack() {
		onAdd(track);
	}

	function passTrackToRemove() {
		onRemove(track);
	}

	function handleTrackClick(track) {
		if (track.preview_url) {
			const audioElement = new Audio(track.preview_url);
			audioElement.play();

			//stop the preview after 30 seconds
			setTimeout(() => {
				audioElement.pause();
				audioElement.currentTime = 0;
			}, 30000);
		} else {
			window.open(`https://open.spotify.com/track/${track.id}`, "_blank");
		}
	}
	function playPreview() {
		if (track.preview_url) {
			// Play the preview if available
			const audio = audioRef.current;
			if (isPlaying) {
				audio.pause();
				audio.currentTime = 0;
				setIsPlaying(false);
			} else {
				audio.play();
				setIsPlaying(true);
			}
		} else {
			handleTrackClick(track);
		}
	}

	function renderAction() {
		if (isRemoval) {
			return (
				<button className={styles.trackaction} onClick={passTrackToRemove}>
					-
				</button>
			);
		} else {
			return (
				<button className={styles.trackaction} onClick={passTrack}>
					+
				</button>
			);
		}
	}
	return (
		<div className={styles.track}>
			<div className={styles.trackContainer}>
				<h3>{track.name}</h3>
				<p>
					{track.artist} | {track.album}
				</p>
				{renderAction()}
				<button onClick={playPreview} className={styles.previewButton}>
					{track.preview_url ? "Play Preview" : "Play it on Spotify"}
				</button>
				{track.preview_url && <audio ref={audioRef} src={track.preview_url} />}
			</div>
		</div>
	);
};

export default Track;
