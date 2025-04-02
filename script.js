const accessToken = "1daf8d4ac6614f9fa6ba85fc46113601";

async function fetchSpotifyProfile() {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Check the response in the console

        // Display data in HTML
        document.getElementById("profile").innerHTML = `
            <p><strong>Name:</strong> ${data.display_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Followers:</strong> ${data.followers.total}</p>
            <p><strong>Spotify Profile:</strong> <a href="${data.external_urls.spotify}" target="_blank">Open</a></p>
        `;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("profile").innerHTML = "<p>Failed to load data.</p>";
    }
}

// Call the function
fetchSpotifyProfile();
