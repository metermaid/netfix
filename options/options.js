const storage = chrome.storage.sync;
var defaultRating = "2.5";

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#erase').addEventListener('click', eraseOptions);

function loadCheckbox(name) {
  storage.get(name, function(o) { 
    if (name in o)
      document.getElementById(name).checked = o[name];
    else
      document.getElementById(name).checked = true;
  });
}

function loadOptions() {
  loadCheckbox("noInstantPlay");
  loadCheckbox("hideSliders");
  loadCheckbox("hideBadMovies");
  loadCheckbox("displayRatings");

  loadCheckbox("ratedMovies");

  storage.get("hiddenRatings", function(hiddenRatings) { 
    value = hiddenRatings.hiddenRatings || defaultRating;
    var select = document.getElementById("hiddenRatings");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == value) {
        child.selected = "true";
        break;
      }
    }
  });
}

function saveCheckbox(name) {
  var a = new Object();
  a[name] = document.getElementById(name).checked;
  storage.set(a,function(){
       chrome.extension.sendRequest({action: 'reload'});
  });
}

function saveOptions() {
  saveCheckbox("noInstantPlay");
  saveCheckbox("hideSliders");
  saveCheckbox("displayRatings");
  saveCheckbox("hideBadMovies");

  saveCheckbox("ratedMovies");

  var select = document.getElementById("hiddenRatings");
  var hiddenRatings = select.children[select.selectedIndex].value;
  storage.set({"hiddenRatings": hiddenRatings},function(){
    alert("Options Saved.");
  });
}

function eraseOptions() {
  storage.remove("noInstantPlay");
  storage.remove("hideSliders");
  storage.remove("displayRatings");
  storage.remove("hideBadMovies");
  storage.remove("ratedMovies");
  storage.remove("hiddenRatings");
  location.reload();
}
