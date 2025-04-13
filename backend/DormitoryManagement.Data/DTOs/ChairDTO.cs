using DormitoryManagement.Data.Models;

namespace DormitoryManagement.Data.DTOs
{
    public class CreateChairDto
    {
        public int ConditionId { get; set; } // Змінено на Id
        public int TypeId { get; set; } // Змінено на Id
        public string RoomNumber { get; set; }
    }

    public class UpdateChairDto
    {
        public int ConditionId { get; set; }
        public int TypeId { get; set; }
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

