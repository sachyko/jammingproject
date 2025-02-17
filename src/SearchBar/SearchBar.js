import React, { useState } from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
	const [term, setTerm] = useState("");

	function passTerm() {
		onSearch(term);
	}

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
				<button className={styles.button} onClick={passTerm}>
					Track it!
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
