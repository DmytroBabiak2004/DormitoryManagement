using DormitoryManagement.Data;
using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public class Chair
    {
        [Key]
        [MaxLength(50)]
        public int SerialNumber { get; set; } // Первинний ключ
        [MaxLength(50)]
        public int ConditionId { get; set; } // Зовнішній ключ
        public Condition Condition { get; set; } // Навігаційна властивість
        [MaxLength(50)]
        public int TypeId { get; set; } // Зовнішній ключ
        public ChairType Type { get; set; } // Навігаційна властивість
        [MaxLength(50)]
        public string RoomNumber { get; set; }
        public Room? Room { get; set; }
    }
}
