using System;

namespace FlightSim
{
    public class ScoreboardListing
    {
        public int rank { get; set; }

        public string user { get; set; }

        public int score { get; set; }

        public double time { get; set; }

        public UserScore userScore {get; set;}
    }
}
