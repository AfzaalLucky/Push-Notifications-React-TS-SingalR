using System;
using System.ComponentModel.DataAnnotations;

namespace PushNotifications.Api.Models
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public string? Payload { get; set; }
        public string? Category { get; set; }
    }
}
