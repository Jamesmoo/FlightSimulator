$(function(){
    function getLeaderboard(){
        $.ajax({
            url : requestUrl,
            type : 'GET',
            crossDomain: true,
            data: JSON.stringify(somejson),
            dataType: "json",
            success : function(data) {              
                displayData();
            },
            error : function(request, error){
                alert("Could not Retrieve Leaderboard scores");
            }
        });
    }
    function displayData(){

    }
});