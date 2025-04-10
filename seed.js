import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0NDEwNzA5MywiZXhwIjoxNzQ0MTkzNDkzfQ.Soqrk9Mjmsd9MwRXJeX4CsVTMBvw8bDTUbDxiLoneXY"; // Replace with actual token
const baseURL = "http://localhost:3000/api";

const appNames = [
    "Github", "Netflix", "Gmail", "Banking", "Twitter", "Kilo", "Maximus",
    "Nexus Chat", "Flutter docs", "Js Docs", "All of us", "Clion", "Jetbrains"
];

const getRandomAppName = () => {
    const index = Math.floor(Math.random() * appNames.length);
    return appNames[index];
};

const savePasswordAndEntries = async (entryCount = 4) => {
    try {
        // Register a new password
        const passwordValue = `P@ss${Math.random().toString(36).slice(2, 10)}`;
        const passwordResponse = await axios.post(`${baseURL}/password`, {
            password: passwordValue
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const passwordId = passwordResponse.data.password.id;

        for (let i = 0; i < entryCount; i++) {
            const title = getRandomAppName();

            const entryResponse = await axios.post(`${baseURL}/entry`, {
                title,
                description: "Random description for " + title,
                passwordId: passwordId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(`Entry ${i + 1} saved:`, entryResponse.data);
        }

        console.log("All entries saved successfully.");

    } catch (error) {
        console.error("Error during save process:", error.response?.data || error.message);
    }
};

// Call the function
let times = 20;
while (times > 0) {
    savePasswordAndEntries(4);
    times--;
}
