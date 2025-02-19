// // Import the Spotify Web Playback SDK
// import { Spotify } from "https://sdk.scdn.co/spotify-player.js";

let accessToken = "";
const clientID = "12269140a5844a9381d8c4205be5c6e6";
const redirectUri = "http://localhost:3000";

// //dynamically set the redirect URI based on the environment
// const isProduction = window.location.hostname !== "localhost";
// const redirectUri = isProduction
// 	? "https://sachyko.github.io/jammingproject/"
// 	: "http://localhost:3000";

const Spotify = {
	// Get the access token, either from sessionStorage or URL
	getAccessToken() {
		// First check if accessToken is already available
		if (accessToken) return accessToken;

		// Check if access token is saved in sessionStorage
		accessToken = localStorage.getItem("access_token");
		const expiryTime = localStorage.getItem("expires_in");

		// If access token is in sessionStorage and it's still valid
		if (accessToken && expiryTime) {
			const expiresIn = Number(expiryTime);
			// Setting the access token to expire after the given expiration time
			window.setTimeout(() => {
				accessToken = "";
				sessionStorage.removeItem("access_token");
				sessionStorage.removeItem("expires_in");
			}, expiresIn * 1000);
			return accessToken;
		}

		// If the access token is not in sessionStorage, check the URL for it
		const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
		const expiryTimeInURL = window.location.href.match(/expires_in=([^&]*)/);

		// If access token is found in the URL
		if (tokenInURL && expiryTimeInURL) {
			// Store token and expiry time in sessionStorage
			accessToken = tokenInURL[1];
			const expiresIn = Number(expiryTimeInURL[1]);

			sessionStorage.setItem("access_token", accessToken);
			sessionStorage.setItem("expires_in", expiresIn);

			// Setting the access token to expire after the given expiration time
			window.setTimeout(() => {
				accessToken = "";
				sessionStorage.removeItem("access_token");
				sessionStorage.removeItem("expires_in");
			}, expiresIn * 1000);

			// Clear the URL after token is fetched to prevent it from being visible
			window.history.pushState("Access token", null, "/");

			// Reload the page to ensure the access token is available
			window.location.reload(); // Trigger reload
			return accessToken;
		}

		// If no access token is found, redirect to Spotify authorization page
		const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
		window.location = redirect;

		if (window.innerWidth <= 768) {
			window.location = redirect;
		} else {
			window.open(redirect, "_blank");
		}
	},

	// Search for a track based on a search term
	search(term) {
		const accessToken = Spotify.getAccessToken(); // **Access token check here**
		if (!accessToken) {
			return; // If no access token, prevent search
		}

		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${accessToken}` },
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				if (!jsonResponse) {
					console.error("Response error");
				}
				return jsonResponse.tracks.items.map((t) => ({
					id: t.id,
					name: t.name,
					artist: t.artists[0].name,
					album: t.album.name,
					uri: t.uri,
					onClick: () => Spotify.handleTrackClick(t.uri),
				}));
			});
	},

	// Handle track click (redirect to Spotify player or open a Web Playback SDK player)
	handleTrackClick(trackUri) {
		const accessToken = Spotify.getAccessToken(); // **Access token check here**
		if (!accessToken) {
			// If no access token, redirect to Spotify login
			const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = redirect;
			return;
		}

		// Open the track in Spotify web player if authenticated (legacy behavior)
		window.open(
			`https://open.spotify.com/track/${trackUri.split(":")[2]}`,
			"_blank"
		);

		// Integrate Web Playback SDK to control playback behavior
		const player = new Spotify.Player({
			name: "Your Player Name",
			getOAuthToken: (cb) => {
				cb(accessToken);
			},
		});
		console.log(window.Spotify); // Should not be undefined if SDK is loaded correctly

		// When the player is ready
		player.addListener("ready", ({ device_id }) => {
			console.log("The Web Playback SDK is ready with device ID:", device_id);

			// Connect to the player and start playback
			player
				.connect()
				.then(() => {
					console.log("Successfully connected to the Web Playback SDK");
					player.play({ uris: [trackUri] }).then(() => {
						console.log("Started playing the track");

						// Seek to 30 seconds after the track starts playing
						setTimeout(() => {
							console.log("Seeking to 30 seconds...");
							player.seek(30 * 1000); // Seek to 30 seconds in milliseconds
						}, 1000); // Start seeking 1 second after the track starts
					});
				})
				.catch((error) => {
					console.error("Error connecting to Web Playback SDK:", error);
				});
		});

		// Error handling when the player is not ready
		player.addListener("not_ready", ({ device_id }) => {
			console.error("The Web Playback SDK is not ready");
		});

		// You can add more listeners for events like playback error, etc.
	},

	// Save a playlist with a name and track URIs
	savePlaylist(name, trackUris) {
		const accessToken = Spotify.getAccessToken(); // **Access token check here**
		if (!accessToken) {
			// If no access token, redirect to Spotify login
			const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = redirect;
			return;
		}

		if (!name || !trackUris) return;
		const header = { Authorization: `Bearer ${accessToken}` };
		let userId;
		return fetch(`https://api.spotify.com/v1/me`, { headers: header })
			.then((response) => response.json())
			.then((jsonResponse) => {
				userId = jsonResponse.id;
				let playlistId;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
					headers: header,
					method: "post",
					body: JSON.stringify({ name: name }),
				})
					.then((response) => response.json())
					.then((jsonResponse) => {
						playlistId = jsonResponse.id;
						return fetch(
							`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
							{
								headers: header,
								method: "post",
								body: JSON.stringify({ uris: trackUris }),
							}
						);
					});
			});
	},

	// Play a track preview (new method added)
	playTrackPreview(trackUri) {
		const accessToken = Spotify.getAccessToken(); // Ensure there's an access token

		if (!accessToken) {
			return; // If no access token, prevent playback
		}

		// Get preview URL from Spotify API
		fetch(`https://api.spotify.com/v1/tracks/${trackUri.split(":")[2]}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
			.then((response) => response.json())
			.then((trackData) => {
				const previewUrl = trackData.preview_url;

				if (!previewUrl) {
					console.error("No preview available for this track");
					return;
				}

				// Create an audio element and play the preview for 30 seconds
				const audio = new Audio(previewUrl);
				audio.play();

				// Stop the audio after 30 seconds
				setTimeout(() => {
					audio.pause();
					audio.currentTime = 0; // Reset the audio
				}, 30000); // 30 seconds in milliseconds
			})
			.catch((error) => {
				console.error("Error fetching track preview:", error);
			});
	},
};

export { Spotify };
