using Microsoft.AspNetCore.Mvc;
using PushNotifications.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using PushNotifications.Api.Hubs;
using PushNotifications.Api.Models;

namespace PushNotifications.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<NotificationHub> _hub;

        public NotificationsController(AppDbContext db, IHubContext<NotificationHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var count = await _db.Notifications.CountAsync(n => !n.IsRead);
            return Ok(new { count });
        }

        [HttpPost("markAllRead")]
        public async Task<IActionResult> MarkAllRead()
        {
            var unread = await _db.Notifications.Where(n => !n.IsRead).ToListAsync();
            unread.ForEach(n => n.IsRead = true);
            await _db.SaveChangesAsync();
            // notify clients that notifications were marked read (no category = all)
            await _hub.Clients.All.SendAsync("NotificationsMarkedRead", new { category = string.Empty });
            return Ok();
        }

        [HttpPost("markByCategory")]
        public async Task<IActionResult> MarkByCategory([FromQuery] string category)
        {
            if (string.IsNullOrWhiteSpace(category)) return BadRequest("category is required");

            //if (!Enum.TryParse<FoodCategory>(category, out var cat)) return BadRequest("invalid category");

            var unread = await _db.Notifications.Where(n => !n.IsRead && n.Category == category).ToListAsync();
            unread.ForEach(n => n.IsRead = true);
            await _db.SaveChangesAsync();

            // notify clients that notifications in this category were marked read
            await _hub.Clients.All.SendAsync("NotificationsMarkedRead", new { category = category });

            return Ok();
        }

        [HttpPost("{id:guid}/markRead")]
        public async Task<IActionResult> MarkRead(Guid id)
        {
            var notification = await _db.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                await _db.SaveChangesAsync();

                // notify clients that a single notification was marked read
                await _hub.Clients.All.SendAsync("NotificationMarkedRead", new { id });
            }

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var list = await _db.Notifications.OrderByDescending(n => n.CreatedAt).ToListAsync();
            return Ok(list);
        }
    }
}
