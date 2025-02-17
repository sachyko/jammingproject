import React from "react";
import Tracklist from "../Tracklist/Tracklist";

import styles from "./SearchResults.module.css";

const SearchResults = ({ userSearchResults, onAdd }) => {
	return (
		<div className={styles.searchresults}>
			<h2>Results</h2>
			<Tracklist
				userSearchResults={userSearchResults}
				onAdd={onAdd}
				isRemoval={false}
			/>
		</div>
	);
};

export default SearchResults;
