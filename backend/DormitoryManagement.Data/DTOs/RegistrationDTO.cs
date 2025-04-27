using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DormitoryManagement.Data.DTOs
{
    namespace DormitoryManagement.Api.Dtos
    {
        public class CreateRegistrationDto
        {
            public int RegistrationId { get; set; }
            public string StudentNumber { get; set; }
            public string RoomNumber { get; set; }
            public DateOnly? CheckInDate { get; set; }
            public DateOnly? CheckOutDate { get; set; }
        }
    }
    public class UpdateRegistrationDto
    {
        public string StudentNumber { get; set; }
        public string RoomNumber { get; set; }
        public DateOnly? CheckInDate { get; set; }
        public DateOnly? CheckOutDate { get; set; }
    }

    public class RegistrationDto
    {
        public int RegistrationId { get; set; }
        public string StudentNumber { get; set; }
        public string RoomNumber { get; set; }
        public DateOnly? CheckInDate { get; set; }
        public DateOnly? CheckOutDate { get; set; }
    }
}
