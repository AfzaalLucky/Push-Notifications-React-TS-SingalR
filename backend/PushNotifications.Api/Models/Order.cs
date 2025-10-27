using System;
using System.ComponentModel.DataAnnotations;

namespace PushNotifications.Api.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; }
        public string? CustomerName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Category { get; set; }
    }
}
