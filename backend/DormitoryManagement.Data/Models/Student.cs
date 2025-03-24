namespace DormitoryManagement.Data.Models
{
    public partial class Student
    {
        public string StudentNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool? Gender { get; set; }
        public DateOnly? BirthDate { get; set; }
        public Registration Registration { get; set; }
        public Mattress Mattress { get; set; }
    }
}
