using DormitoryManagement.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DormitoryManagement.Data.Context
{
    public class DormitoryManagementContext : IdentityDbContext<IdentityUser>

    {
        public DormitoryManagementContext(DbContextOptions<DormitoryManagementContext> options) : base(options) { }     
        
        public DbSet<Student> Students { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<Chair> Chairs { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Mattress> Mattresses { get; set; }
        public DbSet<Condition> Condition { get; set; }
        public DbSet<ChairType> ChairTypes { get; set; }
        public DbSet<TableType> TableTypes { get; set; }
        public DbSet<MattressType> MattressTypes { get; set; }

        public async Task GetGenderStatisticsLinqAsync()
        {
            throw new NotImplementedException();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>()
                .HasKey(n => n.StudentNumber);

            modelBuilder.Entity<Registration>()
                .HasKey(reg => reg.RegistrationId);

            modelBuilder.Entity<Registration>()
                .HasOne(reg => reg.Student)
                .WithOne(s => s.Registration)
                .HasForeignKey<Registration>(s => s.StudentNumber);

            modelBuilder.Entity<Registration>()
                .HasOne(reg => reg.Room)
                .WithMany(room => room.Registrations)
                .HasForeignKey(n => n.RoomNumber);

            modelBuilder.Entity<Registration>()
                .Property(r => r.CheckInDate)
                .HasColumnType("date");

            modelBuilder.Entity<Registration>()
                .Property(r => r.CheckOutDate)
                .HasColumnType("date");

            modelBuilder.Entity<Room>()
                .HasKey(room => room.RoomNumber);

            modelBuilder.Entity<Chair>()
                .HasKey(c => c.SerialNumber);

            modelBuilder.Entity<Chair>()
               .HasOne(c => c.Room)
               .WithMany(room => room.Chairs)
               .HasForeignKey(n => n.RoomNumber);

            modelBuilder.Entity<Table>()
               .HasKey(t => t.SerialNumber);

            modelBuilder.Entity<Table>()
              .HasOne(c => c.Room)
              .WithMany(room => room.Tables)
              .HasForeignKey(n => n.RoomNumber);

            modelBuilder.Entity<Mattress>()
                .HasKey(m => m.SerialNumber);

            modelBuilder.Entity<Mattress>()
                .HasOne(m => m.Student)
                .WithOne(s => s.Mattress)
                .HasForeignKey<Mattress>(m => m.StudentNumber);

            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Commandant", NormalizedName = "COMMANDANT" },
                new IdentityRole { Id = "2", Name = "Castelian", NormalizedName = "CASTELIAN" },
                new IdentityRole { Id = "3", Name = "Student", NormalizedName = "STUDENT" },
                new IdentityRole { Id = "4", Name = "Admin", NormalizedName = "ADMIN" }
            );
        }
    }
}
