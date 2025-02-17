import React from "react";
import styles from "./Track.module.css";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
	function passTrack() {
		onAdd(track);
	}

	function passTrackToRemove() {
		onRemove(track);
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
			</div>
		</div>
	);
};

export default Track;
