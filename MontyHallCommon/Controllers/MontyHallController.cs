using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MontyHall.Models;

namespace MontyHall.Controllers
{
	[ApiController]
	public class MontyHallController : ControllerBase
	{
		const int CellCount = 3;
		private readonly string DoorsCacheKey = "DoorsCacheKey";
		private DoorRowCommon[] DoorRowsCommon = null!;
		private IMemoryCache _doorsCache;

		public MontyHallController(IMemoryCache doorsCache)
		{
			_doorsCache = doorsCache;
		}

		//Common solution
		[HttpGet]
		[Route("[controller]/common/{simulationsNumber}/")]
		//Generate exact number of lines (simulations);
		public IEnumerable<DoorRowCommon> GenerateCommon(int simulationsNumber)
		{
			if (simulationsNumber == 0)
			{
				throw new ApplicationException("Sended incorrect number of simulations");
			}
			int i = 0;
			DoorRowsCommon = new DoorRowCommon[simulationsNumber];
			for (int row = 0; row < simulationsNumber; row++)
			{
				DoorRowsCommon[row] = new()
				{
					Doors = new DoorCommon[CellCount]
				};
				var carId = (Random.Shared.Next(0, CellCount - 1));
				var choiseId = (Random.Shared.Next(0, CellCount - 1));
				for (int cell = 0; cell < CellCount; cell++)
				{
					DoorRowsCommon[row].Doors[cell] = new DoorCommon
					{
						IsCar = (carId == cell),
						IsChoise = (choiseId == cell),
						CellId = i,
					};
					i++;
				}
			}
			return DoorRowsCommon;
		}

		//Interactive solution
		[HttpGet]
		[Route("[controller]/interactive/{simulationsNumber}/")]
		//Generate exact number rows of simulations;
		public IEnumerable<DoorRowInteractive> GenerateInteractive(int simulationsNumber) 
		{
			if (simulationsNumber == 0)
			{
				throw new Exception("Sended incorrect number of simulations");
			}
			int i = 0;
			var DoorRowsInteractive = new DoorRowInteractive[simulationsNumber];
			for (int row = 0; row < simulationsNumber; row++) 
			{
				DoorRowsInteractive[row] = new() 
				{
					Doors = new DoorInteractive[CellCount]
				};
				int carId = Random.Shared.Next(0, CellCount - 1);
				for (int cell = 0; cell < CellCount; cell++) 
				{
					DoorRowsInteractive[row].Doors[cell] = new DoorInteractive 
					{
						IsCar = (cell == carId),
						CellId = i,
						IsOpened = false,
					};
					i++;
				}
			}
			_doorsCache.Set(DoorsCacheKey, DoorRowsInteractive);
			return DoorRowsInteractive;
		}

		[HttpGet]
		[Route("[controller]/choose/{cellId}/{simulationNumber}/")]
		//Choose door for opening
		public int ChooseDoor(int cellId = -1, int simulationNumber = -1)
		{
			DoorRowInteractive[] _doorRowsInteractive;
			if (!_doorsCache.TryGetValue(DoorsCacheKey, out _doorRowsInteractive))
			{
				throw new Exception("Error while get cached doors data");
			}
			if (cellId < 0 || simulationNumber < 0)
			{
				throw new Exception("Incorrect values for cell id or simulation number");
			}
			if (_doorRowsInteractive.Length <= simulationNumber)
			{
				throw new Exception("Simulation number \"" + simulationNumber + "\" ");
			}
			var row = _doorRowsInteractive[simulationNumber];
			var found = row.Doors.Where(s => s.CellId == cellId).FirstOrDefault();
			var wasChoised = row.Doors.Where(s => s.IsChoise == true).FirstOrDefault();
			if (found == null)
			{
				throw new Exception("Cell id #\"" + cellId + "\" not found");
			}
			if (wasChoised != null)
			{
				throw new Exception("Simulation #\"" + simulationNumber + "\" was choised earlier");
			}
			var foundEmpty = row.Doors.Where(s => s.CellId != cellId && s.IsCar == false).FirstOrDefault();
			if (foundEmpty == null) 
			{
				throw new Exception("At simulation #\"" + simulationNumber + "\" no empty door");
			}
			found.IsChoise = true;
			return foundEmpty.CellId;
		}

		[HttpGet]
		[Route("[controller]/open/{simulationNumber}/")]
		//Return car cell ID
		public int OpenCar(int simulationNumber = -1)
		{
			DoorRowInteractive[] _doorRowsInteractive;
			if (!_doorsCache.TryGetValue(DoorsCacheKey, out _doorRowsInteractive))
			{
				throw new Exception("Error while get cached doors data");
			}
			if (simulationNumber < 0)
			{
				throw new Exception("Incorrect value for simulation number");
			} else if (_doorRowsInteractive.Length <= simulationNumber)
			{
				throw new Exception("Simulation number \"" + simulationNumber + "\" not found");
			}
			var row = _doorRowsInteractive[simulationNumber];
			var wasOpened = row.Doors.Where(s => s.IsOpened == true).FirstOrDefault();
			if (wasOpened != null)
			{
				throw new Exception("Simulation #\"" + simulationNumber + "\" was not choosed earlier");
			}
			var wasChoosed = row.Doors.Where(s => s.IsChoise == true).FirstOrDefault();
			if (wasChoosed == null)
			{
				throw new Exception("Simulation #\"" + simulationNumber + "\" was not choised earlier");
			}
			var carCellId = row.Doors.Where(s => s.IsCar == true).FirstOrDefault();
			if (carCellId == null)
			{
				throw new Exception("Simulation #\"" + simulationNumber + "\" car not found");
			}
			wasChoosed.IsOpened = true;
			return carCellId.CellId;
		}

	}
}