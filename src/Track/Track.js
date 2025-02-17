import React from "react";
import styles from "./Track.module.css";
import { Spotify } from "../Spotify/Spotify";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
	function passTrack() {
		onAdd(track);
	}

	function passTrackToRemove() {
		onRemove(track);
	}

	function playPreview() {
		Spotify.playTrackPreview(track.uri);
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
					Play it on Spotify
				</button>
			</div>
		</div>
	);
};

export default Track;
