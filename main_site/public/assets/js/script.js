$(document).ready(function() {
  $(".lettering").lettering();
  $(".first").addClass('active');
  $(".first p").addClass('active');
  setTimeout(function(){
   $(".first p").removeClass('active').addClass('hide');
  }, 1500);
  setTimeout(function(){
   $(".first").removeClass('active').addClass('hide');
   $(".second").addClass('active');
  }, 3000);
  setTimeout(function(){
   $(".second h1").addClass('active');
  }, 3400);
});