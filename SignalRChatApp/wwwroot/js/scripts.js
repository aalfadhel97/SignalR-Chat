const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

// Generate a random color for each new username
const userColors = {};

function getUsernameColor(username) {
    if (!userColors[username]) {
        const colors = ["#007bff", "#e83e8c", "#28a745", "#ffc107", "#17a2b8", "#6f42c1", "#fd7e14"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        userColors[username] = randomColor;
    }
    return userColors[username];
}

// Receive messages from the server
connection.on("ReceiveMessage", (user, message, timestamp) => {
    const li = document.createElement("li");

    // Username with unique color
    const usernameSpan = document.createElement("span");
    usernameSpan.className = "username";
    usernameSpan.style.color = getUsernameColor(user);
    usernameSpan.textContent = `${user}: `;

    // Message text
    const messageText = document.createElement("span");
    messageText.className = "message-text";
    messageText.textContent = message;

    // Timestamp (display time only in Arabic)
    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";

    // Parse timestamp only if it's a valid date
    const dateObj = new Date(timestamp);
    if (!isNaN(dateObj.getTime())) {
        timestampSpan.textContent = ` ${dateObj.toLocaleTimeString('ar-EG')}`;
    } else {
        timestampSpan.textContent = 'Invalid Time'; // Handle invalid dates
    }

    // Append elements
    li.appendChild(usernameSpan);
    li.appendChild(messageText);
    li.appendChild(timestampSpan);

    document.getElementById("messagesList").appendChild(li);
});

connection.on("UpdateClientCount", (count) => {
    document.getElementById("clientCount").textContent = `عدد المتصلين: ${count}`;
});

// Start the connection and load chat history
connection.start().then(() => {
    connection.invoke("LoadChatHistory").catch(err => console.error(err.toString()));
}).catch(err => console.error(err.toString()));

// Send a new message
document.getElementById("sendButton").addEventListener("click", () => {
    const user = document.getElementById("userInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    if (user && message) {
        const timestamp = new Date().toISOString(); // Send the timestamp in a standard format
        connection.invoke("SendMessage", user, message, timestamp).catch(err => console.error(err.toString()));
        document.getElementById("messageInput").value = ''; // Clear message input
    } else {
        alert('Both username and message fields are required.');
    }
});