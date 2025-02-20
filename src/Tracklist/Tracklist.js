import React from "react";
import styles from "./Tracklist.module.css";
import Track from "../Track/Track";

const Tracklist = ({
	userSearchResults,
	onAdd,
	onRemove,
	isRemoval,
	onTrackClick,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.tracklist}>
				{userSearchResults.map((track) => (
					<Track
						track={track}
						key={track.id}
						isRemoval={isRemoval}
						onAdd={onAdd}
						onRemove={onRemove}
						onTrackClick={onTrackClick}
					/>
				))}
			</div>
		</div>
	);
};

export default Tracklist;
