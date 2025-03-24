namespace DormitoryManagement.Data.Models
{
    public partial class Registration
    {
        public int RegistrationId { get; set; }
        public string StudentNumber { get; set; }
        public string RoomNumber { get; set; }
        public DateOnly? CheckInDate { get; set; }
        public DateOnly? CheckOutDate { get; set; }

        public Student Student { get; set; }
        public Room Room { get; set; }
    }
}
