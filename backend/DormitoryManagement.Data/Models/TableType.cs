using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public class TableType
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string NameOfTableType { get; set; }
    }
}
