import React, { useEffect, useState } from "react";
import styles from "./App.module.css";

//components
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { Spotify } from "../Spotify/Spotify";

const App = () => {
	const [searchResults, setSearchResults] = useState([]);

	const [playlistName, setPlaylistName] = useState("My Custom Playlist");

	// Fetch initial set of songs from Spotify (e.g., a "featured" playlist)
	useEffect(() => {
		// This will get a predefined set of tracks from Spotify when the app loads
		Spotify.search("Ariana Grande")
			.then((result) => {
				console.log("Initial Tracks from Spotify:", result); // Log the API result
				setSearchResults(result);
			})
			.catch((error) => {
				console.error("Error fetching initial tracks from Spotify", error);
			});
	}, []); // Empty dependency array means it runs only once when the component mounts
	//updating the playlistTracks with hardcoded codes
	const [playlistTracks, setPlaylistTracks] = useState([]);

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
				<SearchResults
					userSearchResults={searchResults}
					onAdd={onAdd}
					onTrackClick={Spotify.playTrackPreview}
				/>
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
