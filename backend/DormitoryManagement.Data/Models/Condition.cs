using System.ComponentModel.DataAnnotations;

namespace DormitoryManagement.Data.Models
{
	public class Condition
	{
		public int Id { get; set; }
        [MaxLength(100)]
        public string NameOfCondition { get; set; }
	}
}
