
using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public partial class Mattress
    {
        [Key]
        [MaxLength(50)]
        public int SerialNumber { get; set; }
        [MaxLength(50)]
        public int ConditionId { get; set; }
        public Condition Condition { get; set; }
        [MaxLength(50)]
        public int TypeId { get; set; }
        public MattressType Type { get; set; }
        [MaxLength(50)]
        public string StudentNumber { get; set; }
        public Student? Student { get; set; }
    }
}
