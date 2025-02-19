let accessToken = "";
const clientID = "12269140a5844a9381d8c4205be5c6e6";

// Simple function to set the redirect URI based on the environment
const getRedirectUri = () => {
	return window.location.hostname === "localhost"
		? "http://localhost:3000" // Local environment
		: "https://sachyko.github.io/jammingproject/"; // Production environment
};

const redirectUri = getRedirectUri();

const Spotify = {
	// Get the access token, either from sessionStorage or URL
	getAccessToken() {
		if (accessToken) return accessToken;

		// Check if access token is saved in local storage
		accessToken = localStorage.getItem("access_token");
		const expiryTime = localStorage.getItem("expires_in");

		if (accessToken && expiryTime) {
			const expiresIn = Number(expiryTime);
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

		if (tokenInURL && expiryTimeInURL) {
			// Store token and expiry time in sessionStorage
			accessToken = tokenInURL[1];
			const expiresIn = Number(expiryTimeInURL[1]);

			localStorage.setItem("access_token", accessToken);
			localStorage.setItem("expires_in", expiresIn);

			// Clear the URL after token is fetched
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

	// Example search method
	search(term) {
		const accessToken = Spotify.getAccessToken();
		if (!accessToken) return;

		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			method: "GET",
			headers: { Authorization: `Bearer ${accessToken}` },
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				if (!jsonResponse) return [];
				return jsonResponse.tracks.items.map((track) => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri,
				}));
			});
	},
};

export { Spotify };
