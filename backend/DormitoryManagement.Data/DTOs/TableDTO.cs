using DormitoryManagement.Data.Models;

namespace DormitoryManagement.Data.DTOs
{
    public class CreateTableDto
    {
        public int ConditionId { get; set; } 
        public int TypeId { get; set; } 
        public string RoomNumber { get; set; }
    }

    public class UpdateTableDto
    {
        public int ConditionId { get; set; }
        public int TypeId { get; set; }
        public string RoomNumber { get; set; }
    }

    public class TableDto
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public TableType Type { get; set; }
        public string RoomNumber { get; set; }
    }
}

