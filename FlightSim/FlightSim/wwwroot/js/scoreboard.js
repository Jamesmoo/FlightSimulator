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

      if(record.rank === 1){
        htmlRecord = "<tr class='record'><td class='winner num-"+ count +"'>" 
          + "<img src='./images/star.png' class='star-align'>"
          + record.rank 
          + "</td><td>" 
          + record.user + "</td><td>" 
          + record.score + "</td><td>" 
          + record.time + "</td></tr>";
      
      }else{
        htmlRecord = "<tr class='record'><td class='num-"+ count +"'>" 
          + record.rank + "</td><td>" 
          + record.user + "</td><td>" 
          + record.score + "</td><td>" 
          + record.time + "</td></tr>";
      }

      $(htmlRecord).appendTo('tbody').hide().show(2000);  
      count++;
    }

      $('.record').mouseenter(function () {
        $(this).addClass('record-focus');
    });

    $('.record').mouseleave(function () {
        $(this).removeClass('record-focus');
    });

      $('.record').on('click', function () {
          var user = $(this).find('td')[1].innerText.replace(" ", "_");
          window.location.href = "/track.html?user=" + user;
      });
  }
  
  $(window).bind("load", function(){
    getLeaderboard();
  });
});