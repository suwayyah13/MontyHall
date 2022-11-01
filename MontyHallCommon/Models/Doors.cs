using System.Text.Json.Serialization;

namespace MontyHall.Models
{
	public class DoorCommon
	{
		public bool IsCar { get; set; }
		public bool IsChoise { get; set; }
		public int CellId { get; set; }
	}
	public class DoorInteractive : DoorCommon
	{
		[JsonIgnore]
		public new bool IsCar { get; set; }
		public bool IsOpened { get; set; }
		public bool IsMontyChoise { get; set; }
	}
	public class DoorRowCommon
	{
		public DoorCommon[] Doors { get; set; } = null!;
	}
	public class DoorRowInteractive
	{
		public DoorInteractive[] Doors { get; set; } = null!;
	}
}