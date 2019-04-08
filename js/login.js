$(document).ready(function(){
	$(".block").click(function(){
		var username = $("li:nth-child(1)").val();
		var password = $("li:nth-child(2)").val();
		if ( username == "") {
			alert("Please enter the username.");
			return false;
		}
		if ( password == "") {
			alert("Please enter the password.");
			return false;
		}
document.write(username)
		if (username == "gbs" && password == "gbs"){
			alert('Login successful');
			
			localStorage["username"] = "gbs"
				
			if (username =='gbs')
			{
		
				window.open("home.html","_self");
			}
		

		}
		else{
		alert(' Invalid Username and Password ');
		}

	})
});