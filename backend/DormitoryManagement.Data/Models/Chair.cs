using DormitoryManagement.Data;

namespace DormitoryManagement.Data.Models
{
    public class Chair
    {
        public int SerialNumber { get; set; } // Первинний ключ
        public int ConditionId { get; set; } // Зовнішній ключ
        public Condition Condition { get; set; } // Навігаційна властивість
        public int TypeId { get; set; } // Зовнішній ключ
        public ChairType Type { get; set; } // Навігаційна властивість
        public string RoomNumber { get; set; }
        public Room? Room { get; set; }
    }
}
