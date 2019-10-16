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
    var id = 1;
    for(const result of data.results){

      var thisMarkup = "<tr class='record-number-" + id;
      if(result.rank === 1){
        thisMarkup += " winner'>";
      }else{
        thisMarkup += ">";
      }

      thisMarkup += "<td>" + result.rank + "</td>";
      thisMarkup += "<td>" + result.user + "</td>";
      thisMarkup += "<td>" + result.score + "</td>";
      thisMarkup += "<td>" + result.time+ "</td>";
      thisMarkup += "</tr>";
      

      //add the result to the table
      $('tbody').append(thisMarkup);

      id++;
    }
  }
  
  getLeaderboard();
});