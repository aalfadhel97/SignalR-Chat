﻿const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

const userColors = {}; // Dictionary to store colors for each username

// Function to generate a random color
function getRandomColor() {
    const colors = ['#007bff', '#28a745', '#dc3545', '#17a2b8', '#ffc107', '#6610f2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to get or assign a color for a user
function getUserColor(username) {
    if (!userColors[username]) {
        userColors[username] = getRandomColor();
    }
    return userColors[username];
}

// Receive messages from the server
connection.on("ReceiveMessage", (message) => {
    const li = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString(); // Get current time

    // Extract username from the message
    const [username, ...messageParts] = message.split(':');
    const userMessage = messageParts.join(':').trim();

    // Create a span for the username
    const usernameSpan = document.createElement("span");
    usernameSpan.className = "username";
    usernameSpan.textContent = `${username}: `;
    usernameSpan.style.color = getUserColor(username); // Assign color

    // Create a span for the actual message
    const messageSpan = document.createElement("span");
    messageSpan.textContent = userMessage;

    // Create a span for the timestamp
    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = timestamp;

    // Append the username, message, and timestamp to the list item
    li.appendChild(usernameSpan);
    li.appendChild(messageSpan);
    li.appendChild(timestampSpan);

    document.getElementById("messagesList").appendChild(li);

    // Auto-scroll to the latest message
    const messagesList = document.getElementById("messagesList");
    messagesList.scrollTop = messagesList.scrollHeight;
});

// Update client count
connection.on("UpdateClientCount", (count) => {
    document.getElementById("clientCount").textContent = `Clients connected: ${count}`;
});

// Start the connection and load chat history
connection.start().then(() => {
    connection.invoke("LoadChatHistory").catch(err => console.error(err.toString()));
}).catch(err => console.error(err.toString()));

// Send a new message
document.getElementById("sendButton").addEventListener("click", () => {
    const user = document.getElementById("userInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    // Check if user and message fields are not empty
    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
        // Clear input fields after sending the message
        document.getElementById("messageInput").value = '';
    } else {
        alert('Both name and message fields are required.');
    }
});