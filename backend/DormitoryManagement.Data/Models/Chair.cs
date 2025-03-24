using DormitoryManagement.Data;

namespace DormitoryManagement.Data.Models
{
    public partial class Chair
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public ChairType Type { get; set; }
        public string RoomNumber { get; set; }
        public Room Room { get; set; }
    }
}
