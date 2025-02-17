import React from "react";
import Tracklist from "../Tracklist/Tracklist";

import styles from "./SearchResults.module.css";

const SearchResults = ({ userSearchResults, onAdd, onTrackClick }) => {
	return (
		<div className={styles.searchresults}>
			<h2>Results</h2>
			<Tracklist
				userSearchResults={userSearchResults}
				onAdd={onAdd}
				isRemoval={false}
				onTrackClick={onTrackClick}
			/>
		</div>
	);
};

export default SearchResults;
