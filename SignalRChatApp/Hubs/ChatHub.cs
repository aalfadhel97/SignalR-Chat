using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;

namespace SignalRChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private static List<(string User, string Message, string Timestamp)> _messages = new List<(string, string, string)>();

        // Counter for connected clients
        private static int _connectedClients = 0;

        // Timer to reset chat history every 24 hours
        private static System.Timers.Timer _resetTimer;

        // Static constructor to set up the daily reset timer
        static ChatHub()
        {
            _resetTimer = new System.Timers.Timer
            {
                Interval = 1 * 60 * 60 * 1000, // 24 hours in milliseconds
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

        // Override OnConnectedAsync to increment the client counter
        public override async Task OnConnectedAsync()
        {
            _connectedClients++;
            await Clients.All.SendAsync("UpdateClientCount", _connectedClients);
            await base.OnConnectedAsync();
        }

        // Override OnDisconnectedAsync to decrement the client counter
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _connectedClients--;
            await Clients.All.SendAsync("UpdateClientCount", _connectedClients);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message, string timestamp)
        {
            // Store message in the list
            _messages.Add((user, message, timestamp));

            // Send message to all connected clients
            await Clients.All.SendAsync("ReceiveMessage", user, message, timestamp);
        }

        public async Task LoadChatHistory()
        {
            foreach (var (user, message, timestamp) in _messages)
            {
                await Clients.Caller.SendAsync("ReceiveMessage", user, message, timestamp);
            }
        }
    }
}