using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public partial class Table
    {
        [Key]
        [MaxLength(50)]
        public int SerialNumber { get; set; }
        [MaxLength(50)]
        public int ConditionId { get; set; }
        public Condition Condition { get; set; }
        [MaxLength(50)]
        public int TypeId { get; set; }
        public TableType Type { get; set; }
        [MaxLength(50)]
        public string RoomNumber { get; set; }
        public Room? Room { get; set; }
    }
}
