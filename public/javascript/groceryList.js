// ===============================
// GLOBALS
// ===============================

var groceryList = [];
var ingrList;
var ingrListText;
var showHideBtn;
var viewRecipeBtn;
var deleteBtn;

// ===============================
// GET USER INFO FROM LOCAL STORAGE
// ===============================

var user = {
  userId: localStorage.getItem("userId"),
  userEmail: localStorage.getItem("userEmail"),
  userName: localStorage.getItem("userName")
};

// ===============================
// GET RECIPE LIST FROM DATABASE
// ===============================

$(document).ready(function() {

  $.ajax({
    url: "/api/getRecipes/" + user.userId,
    method: "GET"
  })
    .then(function(res) {
      for (var recipe in res) {
        addToGroceryList(res[recipe]);
      }
    })
    .catch((err) => {
      console.log("Error getting recipes", err);
    });
});

// ===============================
// ADD items to Grocery List
// ===============================

// This function is called when user chooses SELECT from recipe search results page

function addToGroceryList(recipe) {

  // console.log(recipe);

  if (recipe != "" && recipe != null && recipe != "undefined") {

    // Create div to hold ingredient list
    ingrList = $("<div>")
      .addClass("ingrList")
      .attr("data-name", recipe.recipeName)
      .attr("data-id", recipe.id);
      // .attr("data-status", "closed");

    // Set up div to hold text for ingredient list
    // Separate div so it can be hidden when box is collapsed
    // ingrListText = $("<div>")
    //   .addClass("ingrListText");

    // Populate list of ingredients
    // for (var item in recipe.ingredients) {
    //   ingrListText
    //     .append(recipe.ingredients[item])
    //     .append("<br>");
    // }

    deleteBtn = $("<div>")
      .addClass("deleteBtn")
      .addClass("fas fa-times fa-2x");

    // Add recipe title and list of ingredients to list div
    ingrList
      .append(`<h4 class="gListName" data-recipeId="${recipe.id}">${recipe.recipeName}</h4>`)
      .append(deleteBtn);

    // Add recipe to list
    $("#groceryList").append(ingrList);

    let recipeEntry = {
      id: recipe.id,
      recipeName: recipe.recipeName,
      ingredients: recipe.ingredients,
      rating: recipe.rating,
      recipeId: recipe.recipeId
    }

    groceryList.push(recipeEntry);

    // Update local storage
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
  }
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselct recipe using button in Recipe Detail View

function removeFromGroceryList(recipe) {

  // var selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var gList = $("#groceryList");
  var length = gList.children().length; 
  var index = -1; 
  
  // Find recipe in grocery list and store its index
  for (var i=0; i<length; i++) {

    if (gList.children()[i].dataset.id == recipe.id) {
      index = i;
    }
  }

  // Delete recipe div from grocery list
  gList.children()[index].remove();  

  for (var i=0; i<groceryList.length; i++) {
    if (groceryList[i].id == recipe.id) {
      groceryList.splice(i, 1);
    }
  }

  // Delete recipe from local storage
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
}

// ===============================
// EXPAND / COLLAPSE ITEMS IN LIST
// ===============================

// $(document).on("click", ".showHideBtn", showHideList);

// function showHideList() {

//   // Identify list whose button was clicked
//   var targetList = $(this).parent();
//   var showHideBtn = targetList.children(".showHideBtn");
//   var listStatus = targetList.attr("data-status");

//   // If list is collapsed, expand it
//   if (listStatus == "closed") {

//     // Calculate required height for expansion based on number of ingredients
//     // 16 is font size
//     // 50 is initial div height
//     // 40 is padding-top and bottom
//     var height = targetList.children(".ingrListText").attr("data-numItems") * 16 + 50 + 40 + 20;

//     // Expand the list
//     targetList.animate({
//       height: height
//     }, 500);

//     // Flip arrow icon
//     showHideBtn
//       .removeClass("fas fa-angle-down")
//       .addClass("fas fa-angle-up");

//     // Fade in ingredient list
//     targetList.children(".ingrListText")
//       .show()
//       .animate({
//         opacity: 1
//       }, 500);

//     // Fade in delete button
//     targetList.children(".deleteBtn")
//       .show()
//       .animate({
//         opacity: 1
//       }, 500);

//     // Update attribute to show this div is expanded
//     targetList.attr("data-status", "open");
//   }

//   // If list is expanded, collapse it
//   else if (listStatus == "open") {

//     // Collapse list
//     targetList.animate({
//       height: 50
//     }, 500);

//     // Flip arrow icon
//     showHideBtn
//       .removeClass("fas fa-angle-up")
//       .addClass("fas fa-angle-down");

//     // Fade out ingredient list
//     targetList.children(".ingrListText")
//       .animate({
//         opacity: 0
//       }, 500)
//       .hide();

//     // Fade out delete button
//     targetList.children(".deleteBtn")
//       .animate({
//         opacity: 0
//       }, 500)
//       .hide();

//     // Update attribute to show div is collapsed
//     targetList.attr("data-status", "closed");
//   }
// }

// ===============================
// Grocery List Functionality
// ===============================

//** Event listener for when an ingredient is tapped by user

// $(document).on("click", ".ingredient", crossOffList);

// // This function toggles whether or not an item in grocery list is crossed out or not.
// // Called when user taps individual item in list.

// function crossOffList() {

//   var ingredient = $(this);

//   // If ingredient not yet crossed off, cross it off list
//   if (ingredient.attr("data-crossed") == "false") {
//     ingredient.css("color", "lightgray");
//     ingredient.css("text-decoration", "line-through");
//     ingredient.attr("data-crossed", "true");
//   }

//   // If ingredient already crossed off, uncross it
//   else {
//     ingredient.css("color", "#086DE0");
//     ingredient.css("text-decoration", "none");
//     ingredient.attr("data-crossed", "false");
//   }
// }

// =========================================
// DELETE Individual Entry from Grocery List
// =========================================

$(document).on("click", ".deleteBtn", function (event) {
  event.preventDefault();

  removeFromGroceryList($(this).parent()[0].dataset);

  $(this).parent().remove();

});

// ===============================
// CLEAR Grocery List
// ===============================

// $(document).on("click", "#clearGroceryList", function (event) {
//   event.preventDefault();

//   $("#groceryList").empty();
//   $(".clipart").detach();

//   localStorage.removeItem("selectedArray");

//   $(".listButton").attr("disabled", true);
// });

// ======================================
// HIDE ALL Button for Grocery List
// ======================================

// $(document).on("click", "#hideAll", hideAll);

// function hideAll() {
//   Array.from(document.querySelector('#groceryList').children)
//     .forEach(item => {
//       if (item.expanded) {
//         item.hideExpansion();
//       }
//     });
// }

// ===============================
// EMAIL Grocery List
// ===============================

// $("#email").on("click", function() {

//   let href = 
//     `mailto:${user.userEmail}?subject=Grocery List&body=${JSON.stringify(groceryList)}`;

//   $(this).attr("href", href);
// });


