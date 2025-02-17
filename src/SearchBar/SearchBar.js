import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { Spotify } from "../Spotify/Spotify";

const SearchBar = ({ onSearch }) => {
	const [term, setTerm] = useState("");

	//function to trigger search and handle login if necessary
	const handleSearchAndLogin = () => {
		const accessToken = Spotify.getAccessToken();
		//if not logged in, this will redirect the user to Spotify
		if (!accessToken) {
			return;
		}
		onSearch(term);
	};

	function handleTermChange({ target }) {
		setTerm(target.value);
	}
	return (
		<div className={styles.searchbackground}>
			<div className={styles.searchbar}>
				<h2>Tune In. Stream On. Never Miss a Beat</h2>
				<input
					placeholder="Search Artist, Album, Song"
					type="text"
					onChange={handleTermChange}
				/>
				<button className={styles.button} onClick={handleSearchAndLogin}>
					Track it!
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
