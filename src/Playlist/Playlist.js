import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";

const Playlist = ({
	playlistTracks,
	onAdd,
	onRemove,
	onSave,
	onNameChange,
	playlistName,
}) => {
	return (
		<div className={styles.playlistContainer}>
			<div className={styles.playlist}>
				<input
					defaultValue={playlistName}
					onChange={(e) => onNameChange(e.target.value)}
				/>
				<Tracklist
					userSearchResults={playlistTracks}
					onAdd={onAdd}
					onRemove={onRemove}
					isRemoval={true}
				/>
				<button className={styles.playlistSave} onClick={onSave}>
					Add To Your Library
				</button>
			</div>
		</div>
	);
};

export default Playlist;
