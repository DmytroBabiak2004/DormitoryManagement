using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public class MattressType
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string NameOfMattressType { get; set; }
    }
}
