using DormitoryManagement.Data.Models;

namespace DormitoryManagement.Data.DTOs
{
    public class CreateMattressDto
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public MattressType Type { get; set; }
        public string StudentNumber{ get; set; }
    }

    public class UpdateMattressDto
    {
        public Condition Condition { get; set; }
        public MattressType Type { get; set; }
        public string StudentNumber { get; set; }
    }

    public class MattressDto
    {
        public int SerialNumber { get; set; }
        public Condition Condition { get; set; }
        public MattressType Type { get; set; }
        public string StudentNumber { get; set; }
    }
}

