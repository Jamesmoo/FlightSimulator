$(function(){
  function getLeaderboard(){
    $.ajax({
        url : "http://127.0.0.1:5000/getlist",
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
    for(const record of data.results){
      var htmlRecord = "";

      if(record.rank === 1){
        htmlRecord = "<tr><td class='winner record-"+ count +"'>" 
          + "<img src='./static/images/star.png' class='star-align'>"
          + record.rank 
          + "</td><td>" 
          + record.user + "</td><td>" 
          + record.score + "</td><td>" 
          + record.time + "</td></tr>";
      
      }else{
        htmlRecord = "<tr><td class='record-"+ count +"'>" 
          + record.rank + "</td><td>" 
          + record.user + "</td><td>" 
          + record.score + "</td><td>" 
          + record.time + "</td></tr>";
      }

      $(htmlRecord).appendTo('tbody').hide().show(2000);  
      count++;
    }
  }
  
  $(window).bind("load", function(){
    getLeaderboard();
  });
});