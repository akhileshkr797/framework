$(document).ready(function() {
$("#register").click(function() {
var name = $("#name").val();
var email = $("#email").val();
var password = $("#password").val();
var cpassword = $("#cpassword").val();
if (name == '' || email == '' || password == '' || cpassword == '') {
alert("Please fill all fieldssss...!!!!!!");
} else if ((password.length) < 2) {
alert("Password should be atleast 3 character in length...!!!!!!");
} else if (!(password).match(cpassword)) {
alert("Your passwords don't match. Try again?");
} 
else
{
alert("Successful Registration")
window.open("index.html","_self");
}
});
});