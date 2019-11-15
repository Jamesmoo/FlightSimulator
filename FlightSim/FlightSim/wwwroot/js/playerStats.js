$(function () {

    var attempts = [];
    var globalPortId = 45458; 
    var currentAttempt = 0; 

    function getAttemptsByEventUser(eventId, userId) {
        $.ajax({
            /*url: "https://192.168.100.100:" + globalPortId + "/api/GetAttemptsByEventUser?EventID=" + eventId + "&UserID=" + userId,*/
            url: 'http://52.222.21.67:8888/api/GetAttemptsByEventUser?EventID=' +eventId+ '&UserID=' +userId,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                attempts = data;
                setPlayerAttemptList();

            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    }

    window.setPlayerAttemptList = function setPlayerAttemptList() {
        if (attempts) {
            //Sort function to order by 
            attempts.sort(function (a, b) {
                return Date(a.Date_Created) - new Date(b.Date_Created);
            });

            //Set the currentAttempt to the attempt that was selected on the scoreboard
            var counter = 0;
            attempts.forEach((attempt) => {
                if (attempt.TPScores.length > 0) {
                    if (attempt.TPScores[0].TotalScore == this.localStorage.getItem("score")) {
                        if (attempt.Date_Created == this.localStorage.getItem("dateCreated")) {
                            currentAttempt = counter;
                            //TIL: cant break out of a forEach loop
                        }
                    }
                }
                counter++;
            });

            var callsign = attempts[0].userVM.Callsign 
            document.getElementById("playerTitle").innerHTML = callsign;
            loadPlayerStats(attempts[currentAttempt]);
            renderAttemptButtons(currentAttempt);
        }
    }

    window.clickNext = function clickNext() {      
        loadPlayerStats(attempts[++currentAttempt]);
        if (currentAttempt >= attempts.length-1) {
            document.getElementById("nextAttempt").style.visibility = "hidden";
            document.getElementById("lastAttempt").style.visibility = "hidden";
        }
        document.getElementById("prevAttempt").style.visibility = "visible";
        document.getElementById("firstAttempt").style.visibility = "visible";
    }

    window.clickBack = function clickBack() {
        loadPlayerStats(attempts[--currentAttempt]);
        if (currentAttempt == 0) {
            document.getElementById("prevAttempt").style.visibility = "hidden";
            document.getElementById("firstAttempt").style.visibility = "hidden";
        }
        document.getElementById("nextAttempt").style.visibility = "visible";
        document.getElementById("lastAttempt").style.visibility = "visible";

    }

    window.clickFirst = function clickFirst() {
        currentAttempt = 0;
        loadPlayerStats(attempts[0]);
        
        document.getElementById("nextAttempt").style.visibility = "visible";
        document.getElementById("lastAttempt").style.visibility = "visible";

        document.getElementById("prevAttempt").style.visibility = "hidden";
        document.getElementById("firstAttempt").style.visibility = "hidden";
    }

    window.clickLast = function clickLast() {
        currentAttempt = attempts.length - 1;
        loadPlayerStats(attempts[attempts.length - 1]);
        
        document.getElementById("nextAttempt").style.visibility = "hidden";
        document.getElementById("lastAttempt").style.visibility = "hidden";

        document.getElementById("prevAttempt").style.visibility = "visible";
        document.getElementById("firstAttempt").style.visibility = "visible";

    }

    //window.playSound = function playSound() {
    //    document.getElementById("soundEffect").play(); 
    //}

    //window.stopSound = function stopSound() {
    //    var sound = document.getElementById("soundEffect"); 
    //    sound.pause(); 
    //    sound.currentTime = 0; 
    //}

    function renderAttemptButtons(startingAttempt) {
        if (attempts.length < 2) {
            document.getElementById("attemptNum").style.visibility = "hidden";
        }
        else {
            document.getElementById("buttonNavigation").style.display = "block";
            if (startingAttempt == (attempts.length - 1)) {
                document.getElementById("prevAttempt").style.visibility = "visible";
                document.getElementById("firstAttempt").style.visibility = "visible";
                document.getElementById("nextAttempt").style.visibility = "hidden";
                document.getElementById("lastAttempt").style.visibility = "hidden";
            }
            else if (startingAttempt == 0) {
                document.getElementById("nextAttempt").style.visibility = "visible";
                document.getElementById("lastAttempt").style.visibility = "visible";
                document.getElementById("prevAttempt").style.visibility = "hidden";
                document.getElementById("firstAttempt").style.visibility = "hidden";
            }
            else {
                document.getElementById("nextAttempt").style.visibility = "visible";
                document.getElementById("lastAttempt").style.visibility = "visible";
                document.getElementById("prevAttempt").style.visibility = "visible";
                document.getElementById("firstAttempt").style.visibility = "visible";
            }
        }
    }

    function buildMonthDayYearDateString(timestamp) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthDayYear = timestamp.substring(0, 10);
        var time = timestamp.substring(10, timestamp.length - 1);
        var t = new Date(timestamp);
        //return t.getDate() + '-' + monthNames[t.getMonth()] + '-' + t.getFullYear();
        return t.getDate() + '-' + monthNames[t.getMonth()] + '-' + t.getFullYear() + " "
            + (t.getHours() < 10 ? '0' : '') + + t.getHours() + ":" + (t.getMinutes() < 10 ? '0' : '') + t.getMinutes() + ":" + (t.getSeconds() < 10 ? '0' : '') + t.getSeconds();


    }

    function loadPlayerStats(attempt) {
        var attempList = "";
        var totalStats = ""; 

        $('#playerTotalsBody').empty();
        $('#tpTableBody').empty();

        //Build Attempt Title
        var date = buildMonthDayYearDateString(attempt.Date_Created);
        document.getElementById('attemptNum').innerHTML = 'Attempt ' + (currentAttempt+1) + ': ' + date;


        if (attempt.TPScores && attempt.TPScores.length > 0) {
            var len = attempt.TPScores.length;
            totalStats += "<tr>"
            totalStats += "<td class='count'>" + attempt.TPScores[len - 1].TotalPositScore + "</td>"; 
            totalStats += "<td class='count'>" + attempt.TPScores[len - 1].TotalTimeScore + "</td>"; 
            totalStats += "<td class='count'>" + attempt.TPScores[len - 1].TotalScore + "</td>"; 
            totalStats += "</tr>"
            $(totalStats).appendTo(document.getElementById('playerTotalsBody')).hide().show(2000);
        }

        $('.count').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 2500,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });



        var count = 1;

        console.log(attempt, "TPSCORES");
        for (const record of attempt.TPScores) {

            var htmlRecord = "";
            var classStyle = "even";

            if (count % 2 != 0) {
                classStyle = "odd";
            }

            htmlRecord += "<tr class='record " + classStyle + " num-" + count + "' onmouseover = 'playSound()' onmouseout='stopSound()'><td>" + record.TP + "</td>";
            htmlRecord += "<td>" + record.TP_Type + "</td>";
            htmlRecord += "<td> <p class='scoreValue'>" + record.PositionScore + "</p>" + " <p style='display:inline;'> / " + record.MaxPositionScore + "</p></td>";
            htmlRecord += "<td> <p class='scoreValue'>" + record.TimingScore +"</p>" + " <p style='display:inline;'> / " + record.MaxTimingScore + "</td>";
            htmlRecord += "<td>" + record.Delta_TimeAtTP + "</td>";
            htmlRecord += "<td>" + record.TimeArrivedAtTP + "</td>";
            htmlRecord += "<td>" + record.IdealTimeAtTP + "</td></tr>"; //close user

            //console.log(htmlRecord);

           
            $(htmlRecord).appendTo(document.getElementById('tpTableBody')).hide().show(2000);

             count++;
            }
   

        $('.record').mouseenter(function () {

        });

        $('.record').mouseleave(function () {
        });

        $('.record').on('click', function (event) {
            var $recordStats = $(".record-stats.num-" + $(this).attr('class').split('num-')[1]);
            var $stats = $recordStats.find('td');

            $('tpTableBody td.stats').each(function () {
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
    };


    

    $(window).bind("load", function () {
        getAttemptsByEventUser(this.localStorage.getItem("eventId"), this.localStorage.getItem("userId"));
        
    });
});