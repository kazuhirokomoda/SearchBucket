
escapeSelectorString = function(val){
  //return val.replace(/[<>]/g, "\\$&");
  return val;
}

/* https://gist.github.com/kenju/cf64b1e11df9beb47999 */
searchCommentsList = function(event){

  var i, id, id_with_prefix, name, lists, module_names
  var input_text = $(this).val();

  // get DOM for comments
  lists = document.querySelectorAll('.review-comment');
  for (i = 0; i < lists.length; i++){
    id = lists[i].id;
    // get text inside the tag
    name = lists[i].innerText;
    // toggle the class (hidden), which has display: none; in css file
    if (!name.toLowerCase().includes(input_text.toLowerCase())){
      $('#' + id).addClass('hidden');
    } else {
      $('#' + id).removeClass('hidden');
    }
  }

  // get DOM for module names
  module_names = document.querySelectorAll('.module-name');
  for (i = 0; i < module_names.length; i++){
    id_with_prefix = module_names[i].id;
    id = id_with_prefix.replace(id_prefix,"");

    var review_comments = $("li[id^=\"" + id + "\"]");
    var num        = review_comments.length;
    var num_hidden = review_comments.filter(".hidden").length;

    if(num == num_hidden){
      $('#' + id_with_prefix).addClass('hidden');
    }else{
      $('#' + id_with_prefix).removeClass('hidden');
    }
  }

};


makeCommentBox = function(json_data){
  // if commentBox does not exist in DOM
  if(!$("#commentBox")[0]){

    $("<div></div>", { id:"commentBox"
    }).html(function(){
      var inText = "<input id=\"input_search\" type=\"text\" placeholder=\"Search!\"/>";
      inText += "<ul>";
      for(module in json_data){
        inText += "<li id=\"" + id_prefix + module +"\" class=\"module-name\"><span>module: </span> " + module + "</li>";
        var comments = json_data[module];
        var i = 0;
        for(comment in comments){
          inText += "<li id=\"" + module + String(i+1) + "\" class=\"review-comment\"><a href=\"" + comments[comment][1] + "\" target=\"_blank\">" // PR URL
          inText += escapeSelectorString(comments[comment][0][0]) + "</a>"; // comment
          inText += "<span class=\"dan2\">" + escapeSelectorString(comments[comment][0][1]) + "</span></li>"; // author name
          i = i + 1;          
        }
      }
      return inText;
    }).appendTo($("body"))
      .find("#closeBtn")
      .on("click",(function(){
        $(this).parent().fadeOut(1);
      }))

  }else{
    // if commentBox exists in DOM
    if($("#commentBox").css("display") !== "block"){
      $("#commentBox").fadeIn(1);
    }else{
      $("#commentBox").fadeOut(1);
    }
  }

}


var id_prefix = "module-name_";

$(function(){

  // read json asynchronously
  // TODO: list up json files
  $.when(
    $.getJSON(chrome.extension.getURL('/resources/modules_a.json')),
    $.getJSON(chrome.extension.getURL('/resources/modules_b.json'))
  )
  .done(function(data_a, data_b) {  // TODO: list up arguments as return value of getJSON function
    // all process success, then combine json files
    // TODO: list up return value of get JSON function as shown below
    var json_data = $.extend({}, data_a[0], data_b[0]);

    // make commentBox in DOM
    makeCommentBox(json_data);

    // instant search
    $('#input_search').on('input', searchCommentsList);

  })
  .fail(function() {
    // エラーがあった時
    console.log('BitBucketCodeReviewSearch error: reading json file failed.');
  });

});
