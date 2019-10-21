using System;
namespace FlightSim
{
    public class UserScore
    {
        public int kills { get; set; }
        public int deaths { get; set; }
        public int assists { get; set; }

        public UserScore(int kills, int deaths, int assists) {
            this.kills = kills;
            this.deaths = deaths;
            this.assists = assists;
        }
    }
}
