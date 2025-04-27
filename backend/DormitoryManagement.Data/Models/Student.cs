using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public partial class Student
    {
        [Key]
        [MaxLength(50)]
        public string StudentNumber { get; set; }
        [MaxLength(100)]
        public string FirstName { get; set; }
        [MaxLength(100)]
        public string LastName { get; set; }
        [MaxLength(20)]
        public string Phone { get; set; }
        public bool? Gender { get; set; }
        public DateOnly? BirthDate { get; set; }
        public Registration? Registration { get; set; }
        public Mattress? Mattress { get; set; }

    }
}
