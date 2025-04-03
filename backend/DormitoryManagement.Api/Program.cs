using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    // Політика для розробки (дозволяє все)
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    // Політика для продакшену (обмежена конкретним джерелом)
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Зміни на твій фронтенд URL
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Додаємо сервіси
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Налаштування DbContext
var connectionString = builder.Configuration.GetConnectionString("DormitoryManagementDb");
builder.Services.AddDbContext<DormitoryManagementContext>(options =>
    options.UseSqlServer(connectionString, b => b.MigrationsAssembly("DormitoryManagement.Data")));

// Налаштування Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
    .AddEntityFrameworkStores<DormitoryManagementContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigAuthentication(builder.Configuration);
var app = builder.Build();

// Налаштування pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
    app.UseCors("AllowAll"); 
}
else
{
    app.UseCors("AllowSpecificOrigin"); 
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();