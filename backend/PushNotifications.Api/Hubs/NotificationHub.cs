using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace PushNotifications.Api.Hubs
{
    public class NotificationHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task SubscribeCategory(string category)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, category);
    }

    public async Task UnsubscribeCategory(string category)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, category);
    }
    }
}
