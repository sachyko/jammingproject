let accessToken = "";
const clientID = "12269140a5844a9381d8c4205be5c6e6";
const redirectUri = "http://localhost:3000"; // Make sure this matches exactly with your Spotify Developer Dashboard

const Spotify = {
	getAccessToken() {
		// First check for the access token in the session
		if (accessToken) return accessToken;

		// Check if access token is saved in sessionStorage
		accessToken = sessionStorage.getItem("access_token");
		const expiryTime = sessionStorage.getItem("expires_in");

		// If access token is in sessionStorage and is still valid
		if (accessToken && expiryTime) {
			const expiresIn = Number(expiryTime);
			// Setting the access token to expire at the value for expiration time
			window.setTimeout(() => {
				accessToken = "";
				sessionStorage.removeItem("access_token");
				sessionStorage.removeItem("expires_in");
			}, expiresIn * 1000);
			return accessToken;
		}

		// Check the URL for access token and expiry time (for first time redirect)
		const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
		const expiryTimeInURL = window.location.href.match(/expires_in=([^&]*)/);

		if (tokenInURL && expiryTimeInURL) {
			// setting access token and expiry time variables
			accessToken = tokenInURL[1];
			const expiresIn = Number(expiryTimeInURL[1]);

			// Store token and expiry time in sessionStorage
			sessionStorage.setItem("access_token", accessToken);
			sessionStorage.setItem("expires_in", expiresIn);

			// Setting the access token to expire at the value for expiration time
			window.setTimeout(() => {
				accessToken = "";
				sessionStorage.removeItem("access_token");
				sessionStorage.removeItem("expires_in");
			}, expiresIn * 1000);

			// Clearing the URL after the access token expires
			window.history.pushState("Access token", null, "/");
			return accessToken;
		}

		// If no access token, redirect to Spotify authorization page
		const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
		window.location = redirect;
	},

	search(term) {
		const accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${accessToken}` },
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch data from Spotify");
				}
				return response.json();
			})
			.then((jsonResponse) => {
				if (!jsonResponse || !jsonResponse.tracks) {
					console.error("No tracks found or invalid response");
					return [];
				}
				return jsonResponse.tracks.items.map((t) => ({
					id: t.id,
					name: t.name,
					artist: t.artists[0].name,
					album: t.album.name,
					uri: t.uri,
					onClick: () => Spotify.handleTrackClick(t.uri),
				}));
			})
			.catch((error) => {
				console.error("Error during search:", error.message);
				return [];
			});
	},

	handleTrackClick(trackUri) {
		const accessToken = Spotify.getAccessToken();
		// If no access token, redirect to Spotify login
		if (!accessToken) {
			const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = redirect;
			return;
		}

		// Open the track in the Spotify web player if authenticated
		window.open(
			`https://open.spotify.com/track/${trackUri.split(":")[2]}`,
			"_blank"
		);
	},

	savePlaylist(name, trackUris) {
		if (!name || !trackUris) return;
		const accessToken = Spotify.getAccessToken();
		const header = { Authorization: `Bearer ${accessToken}` };
		let userId;

		return fetch(`https://api.spotify.com/v1/me`, { headers: header })
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch user info");
				}
				return response.json();
			})
			.then((jsonResponse) => {
				userId = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
					headers: header,
					method: "POST",
					body: JSON.stringify({ name: name }),
				});
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to create playlist");
				}
				return response.json();
			})
			.then((jsonResponse) => {
				const playlistId = jsonResponse.id;
				return fetch(
					`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
					{
						headers: header,
						method: "POST",
						body: JSON.stringify({ uris: trackUris }),
					}
				);
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to add tracks to playlist");
				}
				return response.json();
			})
			.catch((error) => {
				console.error("Error saving playlist:", error.message);
			});
	},
};

export { Spotify };
