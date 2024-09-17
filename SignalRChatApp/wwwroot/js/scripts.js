const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

// Receive messages from the server
connection.on("ReceiveMessage", (message) => {
    const li = document.createElement("li");
    li.textContent = message;
    document.getElementById("messagesList").appendChild(li);
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