
using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public class ChairType
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string NameOfChairType { get; set; }
    }
}
