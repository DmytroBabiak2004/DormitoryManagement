using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
    public partial class Room
    {
        [Key]
        [MaxLength(50)]
        public string RoomNumber { get; set; }
        [MaxLength(50)]
        public int NumberOfPlaces { get; set; }     
        public  ICollection<Chair>? Chairs { get; set; }
        public  ICollection<Registration>? Registrations { get; set; }
        public  ICollection<Table>? Tables { get; set; }
    }
}
