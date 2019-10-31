$(function () {

    var attempts = [];
    var globalPortId = 45458; 
    var currentAttempt = 0; 

    function getAttemptsByEventUser(eventId, userId) {
        $.ajax({
            /*url: "https://192.168.100.100:" + globalPortId + "/api/GetAttemptsByEventUser?EventID=" + eventId + "&UserID=" + userId,*/
            url: 'https://localhost:5001/GetAttemptsByEventUser.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                attempts = data;
                setPlayerAttemptList();
                renderAttemptButtons();

            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    }

    window.setPlayerAttemptList = function setPlayerAttemptList() {
        if (attempts) {
            //console.log(attempts, "ATTEMPTS");
            //attempts.AttemptVM.userVM.Callsign
            var callsign = attempts.attemps[0].AttemptVM.userVM.Callsign
            
            document.getElementById("playerTitle").innerHTML = callsign;
            loadPlayerStats(attempts.attemps[currentAttempt]);
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
        loadPlayerStats(attempts[0]);
        currentAttempt = 0;
        document.getElementById("nextAttempt").style.visibility = "visible";
        document.getElementById("lastAttempt").style.visibility = "visible";

        document.getElementById("prevAttempt").style.visibility = "hidden";
        document.getElementById("firstAttempt").style.visibility = "hidden";
    }

    window.clickLast = function clickLast() {
        loadPlayerStats(attempts[attempts.length - 1]);
        currentAttempt = attempts.length - 1;
        document.getElementById("nextAttempt").style.visibility = "hidden";
        document.getElementById("lastAttempt").style.visibility = "hidden";

        document.getElementById("prevAttempt").style.visibility = "visible";
        document.getElementById("firstAttempt").style.visibility = "visible";

    }



    window.playSound = function playSound() {
        document.getElementById("soundEffect").play(); 
    }

    window.stopSound = function stopSound() {
        var sound = document.getElementById("soundEffect"); 
        sound.pause(); 
        sound.currentTime = 0; 
    }


    function renderAttemptButtons() {
        if (attempts.length < 2) {
            document.getElementById("attemptNum").style.visibility = "hidden";
        }
        if (attempts.length > 1) {
            document.getElementById("buttonNavigation").style.display = "block"; 
            document.getElementById("nextAttempt").style.visibility = "visible";
            document.getElementById("lastAttempt").style.visibility = "visible";
        }
    }

   

    function loadPlayerStats(attempt) {
        var attempList = "";
        var totalStats = ""; 
        //console.log(attempt);

        $('#playerTotalsBody').empty();
        $('#tpTableBody').empty();


        if (attempt.AttemptVM.TPScores.TPScoreVM && attempt.AttemptVM.TPScores.TPScoreVM.length > 0) {
            var len = attempt.AttemptVM.TPScores.TPScoreVM.length;
            totalStats += "<tr>"
            totalStats += "<td class='count'>" + attempt.AttemptVM.TPScores.TPScoreVM[len - 1].TotalPositScore + "</td>"; 
            totalStats += "<td class='count'>" + attempt.AttemptVM.TPScores.TPScoreVM[len - 1].TotalTimeScore + "</td>"; 
            totalStats += "<td class='count'>" + attempt.AttemptVM.TPScores.TPScoreVM[len - 1].TotalScore + "</td>"; 
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
        //AttemptVM.TPScores.TPScoreVM
        for (const record of attempt.AttemptVM.TPScores.TPScoreVM) {

           

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