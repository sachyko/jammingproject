import React, { useEffect } from "react";

/* global Spotify */

function Player() {
	useEffect(() => {
		const accessToken = "your_access_token_here"; // Replace with actual access token
		initializeSpotifyPlayer(accessToken);
	}, []);

	function initializeSpotifyPlayer(token) {
		let player = new Spotify.Player({
			name: "My Web Player",
			getOAuthToken: (cb) => cb(token),
			volume: 0.5,
		});

		player.addListener("initialization_error", ({ message }) => {
			console.error(message);
		});
		player.addListener("authentication_error", ({ message }) => {
			console.error(message);
		});
		player.addListener("playback_error", ({ message }) => {
			console.error(message);
		});

		player.addListener("ready", ({ device_id }) => {
			console.log("Player is ready with device ID:", device_id);
		});

		player.connect();
	}

	return <div id="player-container">Spotify Player will appear here</div>;
}

export default Player;
