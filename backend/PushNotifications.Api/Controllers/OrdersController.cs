using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PushNotifications.Api.Data;
using PushNotifications.Api.Hubs;
using PushNotifications.Api.Models;

namespace PushNotifications.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<NotificationHub> _hub;

        public OrdersController(AppDbContext db, IHubContext<NotificationHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            order.Id = Guid.NewGuid();
            order.CreatedAt = DateTime.UtcNow;
            _db.Orders.Add(order);

            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                Title = "New Order",
                Message = $"Order from {order.CustomerName}",
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                Payload = order.Id.ToString(),
                 Category = order.Category
            };

            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();

            // Broadcast to connected clients
            await _hub.Clients.All.SendAsync("NewOrder", new {
                id = notification.Id,
                title = notification.Title,
                message = notification.Message,
                createdAt = notification.CreatedAt,
                payload = notification.Payload,
                category = notification.Category
            });

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }
    }
}
