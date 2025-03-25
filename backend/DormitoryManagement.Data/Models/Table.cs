namespace DormitoryManagement.Data.Models
{
    public partial class Table
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public TableType Type { get; set; }
        public string RoomNumber { get; set; }

        public Room? Room { get; set; }
    }
}
