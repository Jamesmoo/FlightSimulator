$(function () {

    var globalEventId;
    var globalPortId = 45458; 

    window.getLeaderboard = function getLeaderboard(eventId) {
        $.ajax({
            url: 'https://localhost:5001/ScoreByEventID.json',
            type : 'GET',
            dataType : 'json',
            success : function(data) {              
                loadResults(data);
            },
            error : function(request, error){
                console.error("Could not Retrieve Leaderboard scores");
            }
        });
    }

    function getEventListing() {
        $.ajax({
            url:'https://localhost:5001/GetAllEvents.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadEvents(data.EventVM);
            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    }

    function getUserScoresByEventId() {
        $.ajax({
            url: './ScoreByEventID.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadEvents(data);
            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    }

    window.viewStats = function viewStats(user) {
        this.localStorage.setItem("userId", user);
        this.localStorage.setItem("eventId", globalEventId);
        //getAttemptsByEventUser(globalEventId, user);
        window.location.href = "playerStats.html";
    }; 

    function loadEvents(events) {
        var eventList = "";

        
        for (const record of events) {
            eventList += "<option class='event' value='" + record.Event_ID + "' label='"  + record.Event_Name.replace("'", "") + "'/>"; 
        }
        $(eventList).appendTo('select');  


        $('.event').on('click', function (event) {
            //alert("Yes");
          /*  var $recordStats = $(".record-stats.num-" + $(this).attr('class').split('num-')[1]);
            var $stats = $recordStats.find('td');

            $('tbody td.stats').each(function () {
                var $element = $(this);
                if ($element.is(':visible')) {
                    $element.slideUp(100, function () { });
                }
            });*/

            //handle only the clicked one
           /* if ($stats.is(':visible')) {
                $stats.slideUp(100, function () { });
            } else {
                $stats.slideDown(100, function () { });
            }*/
        });

        getLeaderboard(events[0].Event_ID);
        globalEventId = events[0].Event_ID;
        document.getElementById('eventTitle').innerHTML = (events[0].Event_Name); 
  
    };
    
    function loadResults(data) {
        
        var count = 1;
        $('tbody').empty();
        console.log(data);
        for (const record of data.results) {
            console.log(record, "THIS IS A RECORD");
           
            var htmlRecord = "";
            var classStyle = "even";

            if (count % 2 != 0) {
                classStyle = "odd";
            }

            console.log("rank" + record.UserScoreVM.Rank);
            //if (record.Rank === 1) {
            if (record.UserScoreVM.Rank == 1) {
                htmlRecord += "<tr class='record winner " + classStyle + " num-" + count + "'" + " onclick = viewStats(\'" + record.UserID + "\')" + ">"; //open user
                htmlRecord += "<td><img src='./images/star.png' class='star-align'>";
            } else {
                htmlRecord += "<tr class='record " + classStyle + " num-" + count + "'" + " onclick = viewStats(\'" + record.UserID + "\')" + "><td>";
            }

            htmlRecord += record.UserScoreVM.Rank + "</td>";
            htmlRecord += "<td>" + record.UserScoreVM.Callsign + "</td>";
            htmlRecord += "<td>" + record.UserScoreVM.Score + "</td>";
            htmlRecord += "<td>" + record.UserScoreVM.Delta_TimeAtTOT + "</td></tr>"; //close user

            /* hiden stats panel */
         /* htmlRecord += "<tr class='record-stats num-" + count + "'>" +
                "<td class='stats' style='display:none;' colspan='4' >" +
                "<div class='stats-style'>" + 
                "Kills: " + record.userScore.kills +
                " - Deaths: " + record.userScore.deaths +
                " - Assists: " + record.userScore.assists +
                "</div>" + 
                "</td ></tr > ";*/

           /* $('tr').click(function () {
               viewStats(record.Callsign);
               // window.location.href = "playerStats.html";
            });*/

            $(htmlRecord).appendTo('tbody').hide().show(2000);  
            
            count++;

            console.log(record); 
        }

        $('.record').mouseenter(function () {
    
        });

        $('.record').mouseleave(function () {
        });

        $('.record').on('click', function (event) {
            var $recordStats = $(".record-stats.num-" + $(this).attr('class').split('num-')[1]);
            var $stats = $recordStats.find('td');

            $('tbody td.stats').each(function () {
                var $element = $(this);
                if ($element.is(':visible')) {
                    $element.slideUp(100, function () { });
                }
            });

            //handle only the clicked one
            if ($stats.is(':visible')) {
                $stats.slideUp(100, function () { });
            } else {
                $stats.slideDown(100, function () { });
            }
        });

    }

    window.selectEvent = function selectEvent() {
        var selectDropdown = document.getElementById("eventDropdown");
        globalEventId = selectDropdown.options[selectDropdown.selectedIndex].value;
        var selectedValueName = "<label>" + selectDropdown.options[selectDropdown.selectedIndex].label + "</label>";
        getLeaderboard(globalEventId);
        document.getElementById('eventTitle').innerHTML = selectedValueName;

    }



 
  
    $(window).bind("load", function () {
        getEventListing();
      //  getLeaderboard();
    });
});