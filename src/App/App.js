import React, { useState } from "react";
import styles from "./App.module.css";

//components
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearcResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { Spotify } from "../Spotify/Spotify";

const App = () => {
	//hardcoded codes for the searchResults
	const [searchResults, setSearchResults] = useState([
		{
			artist: "Example Artist 1",
			name: "Example Song 1",
			album: "Example Album 1",
			id: 1,
		},
		{
			artist: "Example Artist 2",
			name: "Example Song 2",
			album: "Example Album 2",
			id: 2,
		},
		{
			artist: "Example Artist 3",
			name: "Example Song 3",
			album: "Example Album 3",
			id: 3,
		},
	]);

	// //Methods for the Search Bar: state for the search query entered by the user
	// //Simulate search results (this function it will replace on API call later on)
	// const [searchQuery, setSearchQuery] = useState("");
	// const handleSearch = () => {
	// 	if (!searchQuery) return;
	// 	setSearchResults(
	// 		searchResults.filter((track) =>
	// 			track.song.toLowerCase().includes(searchQuery.toLowerCase())
	// 		)
	// 	);
	// };

	// //update the state based on the input field value

	// const handleSearchChange = (e) => {
	// 	setSearchQuery(e.target.value);
	// };
	//to update the playlist name
	const [playlistName, setPlaylistName] = useState("My Custom Playlist");

	//updating the playlistTracks with hardcoded codes
	const [playlistTracks, setPlaylistTracks] = useState([
		{
			artist: "Example Artist 1",
			name: "Example Song 1",
			album: "Example Album 1",
			id: 1,
		},
		{
			artist: "Example Artist 2",
			name: "Example Song 2",
			album: "Example Album 2",
			id: 2,
		},
		{
			artist: "Example Artist 3",
			name: "Example Song 3",
			album: "Example Album 3",
			id: 3,
		},
	]);

	//Add track to the playlist
	const onAdd = (track) => {
		//it checks if the track already existed in the playlist
		const existingTrack = playlistTracks.find(
			(currentTrack) => currentTrack.id === track.id
		);

		if (!existingTrack) {
			//add track to the playlist if it doesn't already exist
			setPlaylistTracks((prevTracks) => [...prevTracks, track]);
		} else {
			alert("Track already exists in the playlist!"); //alternative action for console.log
		}
	};

	const removeTrack = (track) => {
		const updatedPlaylist = playlistTracks.filter(
			(currentTrack) => currentTrack.id !== track.id
		);
		setPlaylistTracks(updatedPlaylist);
	};

	//updating the name
	const updatePlaylistName = (name) => {
		setPlaylistName(name);
	};

	//Save the playlist (simulating saving with hardcoded data)
	const savePlaylist = () => {
		//simulate track URIs (using ID as a placeholder for the URI)
		const trackURIs = playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(playlistName, trackURIs).then(() => {
			updatePlaylistName("New Playlist");
			setPlaylistTracks([]);
		});
	};

	//search tracks
	const search = (term) => {
		if (!term) return; //avoid searching with empty term

		//start searching
		console.log(`Searching for: ${term}`);
		Spotify.search(term)
			.then((result) => {
				console.log("Search Results:", result); //log the api result
				setSearchResults(result);
			})
			.catch((error) => {
				console.error("Error during search", error); //handle api errors
			});
	};

	//updating the savePlaylist Function for Hardcoded Data:
	return (
		<div className={styles.App}>
			<h1>
				Ja<span className={styles.mm}>mm</span>ing
			</h1>
			<SearchBar onSearch={search} />
			<div className={styles.appPlaylist}>
				<SearchResults userSearchResults={searchResults} onAdd={onAdd} />
				<Playlist
					playlistName={playlistName}
					playlistTracks={playlistTracks}
					onRemove={removeTrack}
					onNameChange={updatePlaylistName}
					onSave={savePlaylist}
				/>
			</div>
		</div>
	);
};

export default App;
