$(function () {

    var globalEventId;
    let currentTab = 'first';
    var sortedData;
    var userId;
    

    window.getLeaderboard = function getLeaderboard(eventId, uId) {
        $.ajax({
            /*url: 'https://192.168.100.100:' + globalPortId + '/api/Score?eventID=' + eventId, */
            url: 'http://52.222.21.67:8888/api/Score?eventID=' + eventId,
            type : 'GET',
            dataType : 'json',
            success: function (data) {
                globalEventId = eventId;
                userId = uId;
                sortedData = filterScoresByBestAndFirst(data);
                clickTab(currentTab, userId);
                //getEventListing();
            },
            error : function(request, error){
                console.error("Could not Retrieve Leaderboard scores");
            }
        });
    }

    window.clickTab = function clickTab(tabName) {
        loadResults(sortedData[tabName], userId);
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

    window.viewStats = function viewStats(user, score, dateCreated) {
        this.localStorage.setItem("userId", user);
        this.localStorage.setItem("eventId", globalEventId);
        this.localStorage.setItem("score", score);
        this.localStorage.setItem("dateCreated", dateCreated);
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
        if (data.length == 0)
            return;
        var count = 1;
        var currentRank = 1;
        var currentScore, rankScore;
        var currentCallsign;
        $('tbody').empty();
        document.getElementById('eventTitle').innerHTML = (data[0].EventName);
        document.getElementById('eventTitle').classList.add('selectedUser');
        for (const record of data) {
            if (count == 1) {
                rankScore = record.Score;
            }
            currentScore = record.Score;
            if (currentScore < rankScore) {
                currentRank++;
                rankScore = currentScore;
            }
            var htmlRecord = "";
            var classStyle = "even";

            if (count % 2 != 0) {
                classStyle = "odd";
            }

            if (currentRank == 1) {
                htmlRecord += "<tr class='record winner " + classStyle + " num-" + count + "'" + " onclick = viewStats(\'" + record.UserID + "\',\'"+record.Score+"\',\'"+record.DateCreated+"\')>";
                htmlRecord += "<td><img src='./images/star.png' class='star-align'>";
            } else {
                htmlRecord += "<tr class='record " + classStyle + " num-" + count + "'" + " onclick = viewStats(\'" + record.UserID + "\',\'"+record.Score+"\',\'"+record.DateCreated+"\')><td>";
            }
            
            htmlRecord += currentRank + "</td>";
            htmlRecord += "<td>" + record.Callsign + "</td>";
            htmlRecord += "<td>" + record.Score + "</td>";
            htmlRecord += "<td>" + record.Delta_TimeAtTOT + "</td></tr>"; //close user

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

            if (userId && record.UserID == userId) {
                currentCallsign = record.Callsign;
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

    function openTab(evt, tabName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    function filterScoresByBestAndFirst(data) {
        //var sortedScores = {
        //    userId: {
        //        first: { record },
        //        best: { record }
        //    }
        //};
        var userScores = {};
        data.map(record => {
            if (userScores[record.UserID] === undefined) {
                // new user
                userScores[record.UserID] = {
                    first: record,
                    best: record
                };
            }
            else {
                if (userScores[record.UserID].best.Score_P3D < record.Score_P3D) {
                    userScores[record.UserID].best = record;
                }
                if (new Date(userScores[record.UserID].first.DateCreated) > new Date(record.DateCreated)) {
                    userScores[record.UserID].first = record;
                }
            }
        });

        let sortedScores = { first: [], best: [] }

        // map through user scores and place them into the respective array in sortedScores
        Object.keys(userScores).map(userId => {
            sortedScores.first.push(userScores[userId].first);
            sortedScores.best.push(userScores[userId].best);
        });

        // sort each array in sorted scores
        sortedScores.first = sortedScores.first.sort(scoreComparator);
        sortedScores.best = sortedScores.best.sort(scoreComparator);

        return sortedScores;
    }

    var scoreComparator = (a, b) => {
        return b.Score - a.Score;
    };

  
    $(window).bind("load", function () {
        var vars = {};
        var parts = window.location.search.substring(1).split('&');
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        globalEventId = vars.eventID;
        getLeaderboard(vars.eventID, vars.userID);

    });
});