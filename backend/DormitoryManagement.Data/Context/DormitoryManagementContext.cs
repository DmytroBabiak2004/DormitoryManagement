using DormitoryManagement.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DormitoryManagement.Data.Context
{
    public class DormitoryManagementContext : DbContext
    {
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


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=DormitoryManagerDB;Trusted_Connection=True;");

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
        }
    }
}
