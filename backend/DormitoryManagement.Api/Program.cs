using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using DormitoryManagement.Data.Context;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DormitoryManagementDb");

builder.Services.AddDbContext<DormitoryManagementContext>(options =>
    options.UseSqlServer(connectionString, b => b.MigrationsAssembly("DormitoryManagement.Data")));



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
