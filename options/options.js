var defaultRating = "2.5";

function toBool(str) {
   if ("false" === str)
      return false;
   else 
      return str;
}

function loadCheckbox(name) {
  var value = localStorage[name];
  if (value == undefined)
    document.getElementById(name).checked = true;
  else
    document.getElementById(name).checked = toBool(value);
}

function loadOptions() {
  loadCheckbox("noInstantPlay");
  loadCheckbox("hideSliders");
  loadCheckbox("displayRatings");

  loadCheckbox("ratedMovies");

  var hiddenRatings = localStorage["hiddenRatings"];
  if (hiddenRatings == undefined)
    hiddenRatings = defaultRating;

  var select = document.getElementById("hiddenRatings");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == hiddenRatings) {
      child.selected = "true";
      break;
    }
  }
}

function saveOptions() {
  localStorage["noInstantPlay"] = document.getElementById("noInstantPlay").checked;
  localStorage["hideSliders"] = document.getElementById("hideSliders").checked;
  localStorage["displayRatings"] = document.getElementById("displayRatings").checked;

  localStorage["ratedMovies"] = document.getElementById("ratedMovies").checked;

  var select = document.getElementById("hiddenRatings");
  var hiddenRatings = select.children[select.selectedIndex].value;
  localStorage["hiddenRatings"] = hiddenRatings;

  alert("Options Saved.");
}

function eraseOptions() {
  localStorage.removeItem("noInstantPlay");
  localStorage.removeItem("hideSliders");
  localStorage.removeItem("displayRatings");
  localStorage.removeItem("ratedMovies");
  localStorage.removeItem("hiddenRatings");
  location.reload();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#erase').addEventListener('click', eraseOptions);
