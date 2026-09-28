using Microsoft.EntityFrameworkCore;
using PushNotifications.Api.Models;

namespace PushNotifications.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; }
        public DbSet<Notification> Notifications { get; set; }
    }
}
