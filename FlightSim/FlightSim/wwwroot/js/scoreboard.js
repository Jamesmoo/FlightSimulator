$(function () {

    var globalEventId;
    var globalPortId = 45458; 

    window.getLeaderboard = function getLeaderboard(eventId, userId) {
        $.ajax({
            /*url: 'https://192.168.100.100:' + globalPortId + '/api/Score?eventID=' + eventId, */
            url: 'https://localhost:5001/ScoreByEventID.json',
            type : 'GET',
            dataType : 'json',
            success : function(data) {              
                loadResults(data, userId);
                getEventListing();
            },
            error : function(request, error){
                console.error("Could not Retrieve Leaderboard scores");
            }
        });
    }

    function getEventListing() {
        $.ajax({
            /*url: 'https://192.168.100.100:' + globalPortId + '/api/GetAllEvents",',*/
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

    window.viewStats = function viewStats(user) {
        this.localStorage.setItem("userId", user);
        this.localStorage.setItem("eventId", globalEventId);
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
    };
    
    function loadResults(data, userId) {
        
        var count = 1;
        var currentCallsign;
        $('tbody').empty();
        document.getElementById('eventTitle').innerHTML = (data[0].UserScoreVM.EventName); 
        for (const record of data) {
           
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
            if (userId && record.UserScoreVM.UserID == userId) {
                currentCallsign = record.UserScoreVM.Callsign;
            }
            


        }

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

        if (userId) {
            var rowPos = $("#scoreboardTable tr:contains(" + currentCallsign + ")").position();
            var rowOffset = Number(rowPos.top) - 75;
            console.log(typeof row);
            $('#tableContainer').scrollTop(rowOffset);
        }

    }

    window.selectEvent = function selectEvent() {
        var selectDropdown = document.getElementById("eventDropdown");
        globalEventId = selectDropdown.options[selectDropdown.selectedIndex].value;
        var selectedValueName = "<label>" + selectDropdown.options[selectDropdown.selectedIndex].label + "</label>";
        getLeaderboard(globalEventId);
        document.getElementById('eventTitle').innerHTML = selectedValueName;

    }

  
    $(window).bind("load", function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        globalEventId = vars.eventId;
        getLeaderboard(globalEventId, vars.userId);


    });
});