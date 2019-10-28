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
    public class EventListingController : ControllerBase
    {


        [HttpGet]
        public EventListing[] Get()
        {
            Random rnd = new Random();
            string[] events = { "", "Chowder Bowl", "Event 2", "Goose"};

            return Enumerable.Range(1,3).Select(index => new EventListing
            {
                eventId = 1,
                eventName = events[index]
            }).ToArray();
        }
    }
}
