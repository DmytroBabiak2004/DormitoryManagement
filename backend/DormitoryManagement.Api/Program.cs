using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DormitoryManagement.Data.Context;
using DormitoryManagement.Api;// Твій DbContext

var builder = WebApplication.CreateBuilder(args);

// Додаємо CORS
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
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Dormitory API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

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
    app.UseCors("AllowAll"); // У розробці дозволяємо все
}
else
{
    app.UseCors("AllowSpecificOrigin"); // У продакшені обмежуємо
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();