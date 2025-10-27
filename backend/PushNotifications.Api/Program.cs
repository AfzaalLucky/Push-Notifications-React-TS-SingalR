// using Microsoft.EntityFrameworkCore;
// using PushNotifications.Api.Data;
// using PushNotifications.Api.Hubs;

// var builder = WebApplication.CreateBuilder(args);

// // Add DB
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddControllers();
// builder.Services.AddSignalR();

// // CORS for local dev - adjust for production
// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.WithOrigins("http://localhost:3000")
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials();
//     });
// });

// var app = builder.Build();
// // app.UseCors();
// app.UseCors("AllowReactApp");
// app.UseRouting();
// app.MapControllers();
// app.MapHub<NotificationHub>("/notificationHub");
// app.Run();



using PushNotifications.Api.Hubs;
using PushNotifications.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Controllers
builder.Services.AddControllers();

// Add SignalR
builder.Services.AddSignalR();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Needed for SignalR
    });
});

var app = builder.Build();

// Use CORS BEFORE MapControllers/MapHub
app.UseCors("ReactPolicy");

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();
