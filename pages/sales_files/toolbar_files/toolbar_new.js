/*Function for logout*/
function showConfirm(){

	if (top.content.rightpane && top.content.rightpane.document && top.content.rightpane.document.forms[0] && top.content.rightpane.document.forms[0].CHKCHG){
		if( top.content.rightpane.document.forms[0].CHKCHG.value == 'C' )	{	
			//alert("This action is not allowed \n Please click \"Cancel\" button or link ");
			var msg="This action is not allowed \n\n\n Please click \"Cancel\" button or link ";
			top.newPopup(msg);
			return false;
		}
	}//Code added by ESC on 13Oct06 allow the programer to prevent user exit in middle of some function
	//Added for new sweet alert logout --- Abhi 08 june 15
	if(top.newLogout("Really want to LogOut?"))	{
			//top.location.href = top.applURL +  "/jsp/login/logout.jsp";
	}
}

/*Function for Home,Back,Cancel,Submit,about us,refresh and Logto*/
function formSubmit(perform){
	var frm=top.content.document.getElementById("rightpane").contentWindow.document.forms[0];	
		switch(perform.toUpperCase()){
			case "LOGTO":
//Code added by ESC on 22July09 for handling check changes in logto
				if(top.content.document.getElementById("rightpane").contentWindow.document.forms[0]){
					if( top.content.document.getElementById("rightpane").contentWindow.document.forms[0].CHKCHG.value == 'C' )	{	
						//alert("This action is not allowed \n Please click \"Cancel\" button or link ");
						var msg="This action is not allowed \n\n\n Please click \"Cancel\" button or link ";
						top.newPopup(msg);
						return false;
					}
				}
				window.top.showPanel("panelLogto",1);
				return true;
			case "ABOUTUS":	
				window.top.showPanel("panelAboutUs",1);
				return true;					
			case "ENTITY":
				//top.content.document.body.cols = '1,*';
				top.content.document.getElementById("rightpane").src = top.applURL +  "/jsp/login/entity.jsp";
				return true;
			default:
					if( frm && top.content.document.getElementById("rightpane").contentWindow.formSubmit ){			
						top.content.document.getElementById("rightpane").contentWindow.formSubmit(frm,perform);
					}
					else{
						top.content.document.getElementById("leftpane").contentDocument.location.reload();
						return true;
					}
		}
		return true;
	}
/*Function for rolodex*/
function rolodex(){
	var vHeight = (screen.height * 70)/100 
	var vWidth = (screen.width * 90)/100 
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=JUI.ROLODEX&first=Y&modalTitle=Rolodex";
	var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:1;resizable=1;border:thin;statusbar:no;")
}

/*Function for searching*/
function keySearch(){
    var vHeight = (screen.height * 70)/100 
  	var vWidth = (screen.width * 90)/100 
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=JUI.SEARCH&thirdParam=START&first=Y&modalTitle=OHM Search Window";
	var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;")
}
/*Function for alert message*/
function checkMsg(){
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=8&funcName=" + pgmCheckAction + "&thirdParam=START&first=Y&modalTitle=Action Messages";
	var ret_val = window.showModalDialog(url,window,"status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;dialogWidth:900px;")
	if(ret_val==0){
		document.getElementById("div_alert").style.backgroundImage="url("+top.applURL+"/images/toolbar/alert.png)";
	}
}

/*Function for showing logs*/
function showLogs(){
	//var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=" + pgmExport + "&first=Y&modalTitle=Export";
	//var ret_val = window.showModalDialog(url,null,"dialogHeight:10px;dialogWidth:10px;status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;")
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=21&first=Y&modalTitle=View logs";
	var ret_val = window.showModalDialog(url,window,"dialogWidth = 750px;dialogHeight:600px;status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;")
	//top.content.rightpane.location.href = top.applURL +  "/jsp/login/entity.jsp"
}

/*Function for showing reports*/
function showRpts(){
	var ht = (screen.height* 80)/100; //570;
	var wd = (screen.width * 90)/100; //600;
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=22&first=Y&modalTitle=View Reports ";
	var ret_val = window.showModalDialog(url,window,"dialogWidth="+wd+"px;dialogHeight:"+ht+"px;status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;")
	//top.content.rightpane.location.href = top.applURL +  "/jsp/user/chat.jsp"
}

/*Function for showing printer*/
function showPrinters(){
  var vHeight = (screen.height * 50)/100 
  var vWidth = (screen.width * 50)/100 
  var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=JUI.PRINTERS&first=Y&modalTitle=Printers";
  var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:1;resizable=1;border:thin;statusbar:no;")
 }

/*Function for preferences*/
  function showEntity(){
	if (top.content.document.getElementById("tblBody").rows[0].cells[1].width=='100%'){
		var msg = "Setting can be changed when you are in menu page only";
		top.newPopup(msg);
		return false;
	}
	var vHeight = (screen.height * 50)/100 
	var vWidth = (screen.width * 50)/100 
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=12&funcName=JUI.ENTITY&first=Y&modalTitle=Entity";
	var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:1;resizable=1;border:thin;statusbar:no;")
	if(ret_val){	
		top.window.location.reload();
	}
}

/*Function for Navigation Shortcusts and Help*/
function showShortcut(sUrl){
window.open(sUrl,'mywindow','status=1,toolbar=1,resizable=no,scrollbars=1 width=860,height=620 toolbar=0');
}

/*Function for Search Knowledge Base*/
function knowledgebase(flag){
	if (!flag){
	  var vHeight = (screen.height * 70)/100 
	  var vWidth = (screen.width * 80)/100 
	  var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=JUI.KNOWLEDGEBASE&first=Y&modalTitle=Knowledge Base";
	 var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:1;resizable=1;border:thin;statusbar:no;")
	}else{
		if (flag=="1"){
		 if(window.event && window.event.keyCode!=13){
			 return false;
			 }
		}
	  var search_text=document.getElementById("faq_search").value;
	  var vHeight = (screen.height * 70)/100 
	  var vWidth = (screen.width * 80)/100 
	  var url = top.applURL + "/jsp/app/modal.jsp?ESC=7&funcName=JUI.KNOWLEDGEBASE&fldValues="+search_text+"&linkName=submit&thirdParam=PROCESS&first=Y&modalTitle=Knowledge Base";
	  var ret_val = window.showModalDialog(url,window,"dialogHeight:" + vHeight + "px;dialogWidth:" + vWidth + "px;status:no;center:yes;help:no;minimize:0;maximize:1;resizable=1;border:thin;statusbar:no;");
	}
 }

/*Function for Instant Messaging among Users*/
function checkSysMsg(){
	var ht = (screen.height* 80)/100; //570;
	var wd = (screen.width * 90)/100; //600;
	var url = top.applURL + "/jsp/app/modal.jsp?ESC=23&first=Y&modalTitle=View Messages ";
	var ret_val = window.showModalDialog(url,window,"dialogWidth="+wd+"px;dialogHeight:"+ht+"px;status:no;center:yes;help:no;minimize:0;maximize:no;resizable=1;border:thin;statusbar:no;")
}

