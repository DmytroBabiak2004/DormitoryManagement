using DormitoryManagement.Data.Models;

namespace DormitoryManagement.Data.DTOs
{
    public class CreateChairDto
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public ChairType Type { get; set; }
        public string RoomNumber { get; set; }
    }

    public class UpdateChairDto
    {
        public Condition Condition { get; set; }
        public ChairType Type { get; set; }
        public string RoomNumber { get; set; }
    }

    public class ChairDto
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public ChairType Type { get; set; }
        public string RoomNumber { get; set; }
    }
}

