const CLIENT_ID = "1daf8d4ac6614f9fa6ba85fc46113601";
const CLIENT_SECRET = "57146e1485004882b030525913481215";

// Function to get Spotify API Token
async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
}

// Function to search for a song
async function searchSong(query, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.tracks.items.length > 0 ? data.tracks.items[0].id : null;
}

// Function to get song recommendations
async function getRecommendations(songId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${songId}&limit=5`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.tracks.map(track => `${track.name} - ${track.artists.map(a => a.name).join(", ")}`);
}

// Main function to execute the process
async function findSimilarSongs(songName) {
    const accessToken = await getAccessToken();
    const songId = await searchSong(songName, accessToken);
    if (!songId) {
        console.log("Song not found!");
        return;
    }
    const recommendations = await getRecommendations(songId, accessToken);
    console.log("Recommended Songs:", recommendations);
}

// Example Usage
findSimilarSongs("Blinding Lights");
