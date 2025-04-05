using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DormitoryManagement.Data.DTOs
{
    public class RoomDto
    {
        public string RoomNumber { get; set; }
        public int NumberOfPlaces { get; set; }
    }
    public class CreateRoomDto
    {
        public string RoomNumber { get; set; }
        public int NumberOfPlaces { get; set; }
    }
    public class UpdateRoomDto
    {
        public int NumberOfPlaces { get; set; }
    }

}
