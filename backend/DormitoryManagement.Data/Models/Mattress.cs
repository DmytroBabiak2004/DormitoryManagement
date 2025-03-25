
namespace DormitoryManagement.Data.Models
{
    public partial class Mattress
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public MattressType Type { get; set; }
        public string StudentNumber { get; set; }
        public Student? Student { get; set; }
    }
}
