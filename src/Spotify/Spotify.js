let accessToken = "";
const clientID = "12269140a5844a9381d8c4205be5c6e6";
const redirectUri = "http://localhost:3000";

const Spotify = {
	getAccessToken() {
		// First check for the access token
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

		// Check the URL for access token and expiry time (for first-time redirect)
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

			// **Force reload after saving the access token to make sure the token is available for subsequent actions**
			window.location.reload(); // Trigger reload
			return accessToken;
		}

		// If no access token, redirect to Spotify authorization page
		const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
		window.location = redirect;
	},

	// Modified this function to check for access token first before performing search
	search(term) {
		const accessToken = Spotify.getAccessToken(); // **Access token check here**
		if (!accessToken) {
			return; // If no access token, prevent search and stop further execution
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

	// Modified this function to check for access token first before allowing track click
	handleTrackClick(trackUri) {
		const accessToken = Spotify.getAccessToken(); // **Access token check here**
		if (!accessToken) {
			// If no access token, redirect to Spotify login
			const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = redirect;
			return;
		}

		// Open the track in Spotify web player if authenticated
		window.open(
			`https://open.spotify.com/track/${trackUri.split(":")[2]}`,
			"_blank"
		);
	},

	// Modified this function to check for access token before saving playlist
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
};

export { Spotify };
