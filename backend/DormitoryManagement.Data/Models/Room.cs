namespace DormitoryManagement.Data.Models
{
    public partial class Room
    {
        public string RoomNumber { get; set; }
        public int NumberOfPlaces { get; set; }     
        public  ICollection<Chair>? Chairs { get; set; }
        public  ICollection<Registration>? Registrations { get; set; }
        public  ICollection<Table>? Tables { get; set; }
    }
}
