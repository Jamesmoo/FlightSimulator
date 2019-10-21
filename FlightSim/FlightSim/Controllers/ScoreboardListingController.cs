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
            Random rnd = new Random();
            string[] userNames = {"", "Maverick", "Goose", "Jester", "Merlin", "Snake", "Big Boss", "Rambo", "Terminator", "T-800", "Link", "Mario", "John Wick", "Neo", "Slayer" };
            
            return Enumerable.Range(1, 14).Select(index => new ScoreboardListing
            {
                userScore = new UserScore(rnd.Next(0,100), rnd.Next(0,100), rnd.Next(0,100)),
                rank = index,
                user = userNames[index],
                score = 5000 - (index * 100),
                time = rnd.Next(100, 2000)
            }).ToArray();
        }
    }
}
