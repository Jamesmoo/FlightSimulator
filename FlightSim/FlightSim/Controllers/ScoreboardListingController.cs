using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightSim.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScoreboardListingController : ControllerBase
    {

        
        [HttpGet]
        public ScoreboardListing[] Get()
        {
            string[] userNames = {"", "Maverick", "Goose", "Jester", "Merlin","Snake","Big Boss", "Rambo", "Terminator" };
            int[] scores = { 0, 5000, 4000, 3000, 2000, 1000, 900, 800, 700 };
            double[] times = { 0, 100.00, 200.00, 300.00, 400.00, 500.00, 300.00, 300.00, 250.00 };

            return Enumerable.Range(1, 7).Select(index => new ScoreboardListing
            {
                rank = index,
                user = userNames[index],
                score = scores[index],
                time = times[index]
            }).ToArray();
        }
    }
}
