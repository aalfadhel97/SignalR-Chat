using Microsoft.AspNetCore.SignalR;
using System.Timers;

namespace SignalRChatApp.Hubs
{

    public class ChatHub : Hub
    {
        // In-memory storage for chat messages
        private static List<string> _messages = new List<string>();

        // Timer to reset chat history every 24 hours
        private static System.Timers.Timer _resetTimer;

        // Static constructor to set up the daily reset timer
        static ChatHub()
        {
            _resetTimer = new System.Timers.Timer
            {
                Interval = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
                AutoReset = true,
                Enabled = true
            };
            _resetTimer.Elapsed += (sender, e) => ClearChatHistory();
        }

        // Method to clear chat history
        private static void ClearChatHistory()
        {
            _messages.Clear();
        }

        public async Task SendMessage(string user, string message)
        {
            // Store message in the list
            var fullMessage = $"{user}: {message}";
            _messages.Add(fullMessage);

            // Send message to all connected clients
            await Clients.All.SendAsync("ReceiveMessage", fullMessage);
        }

        public async Task LoadChatHistory()
        {
            // Send existing chat history to the connecting client
            foreach (var message in _messages)
            {
                await Clients.Caller.SendAsync("ReceiveMessage", message);
            }
        }
    }
}