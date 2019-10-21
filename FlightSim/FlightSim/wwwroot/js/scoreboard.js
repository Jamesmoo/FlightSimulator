$(function(){
    function getLeaderboard(){
        $.ajax({
            url: "/scoreboardlisting",
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
    
    function loadResults(data){
        var count = 1;
        for(const record of data){
            var htmlRecord = "";
            var classStyle = "even";

            if (count % 2 != 0) {
                classStyle = "odd";
            }


            if (record.rank === 1) {
                htmlRecord += "<tr class='record winner " + classStyle + " num-" + count + "'>"; //open user
                htmlRecord += "<td><img src='./images/star.png' class='star-align'>";
            } else {
                htmlRecord += "<tr class='record " + classStyle + " num-" + count + "'><td>";
            }

            htmlRecord += record.rank + "</td>";
            htmlRecord += "<td>" + record.user + "</td>";
            htmlRecord += "<td>" + record.score + "</td>";
            htmlRecord += "<td>" + record.time + "</td></tr>"; //close user

            /* hiden stats panel */
            htmlRecord += "<tr class='record-stats num-" + count + "'>" +
                "<td class='stats' style='display:none;' colspan='4' >" +
                "Kills: " + record.userScore.kills +
                " - Deaths: " + record.userScore.deaths +
                " - Assists: " + record.userScore.assists + 
                "</td ></tr > ";
            
            $(htmlRecord).appendTo('tbody').hide().show(2000);  
            count++;
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
  
    $(window).bind("load", function(){
        getLeaderboard();
    });
});