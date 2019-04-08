/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E	
* @description		
* @version history	
* 
*/

//changed on Dec20th
function r_changesize(e){	
	var temp;
	var evt=(e)?e:(window.event)?window.event:null;
	if (window.event){
		srcElement = evt.srcElement;
	}else{
		srcElement = evt.target;
	}
	if(srcElement && srcElement.tagName == "A")	{
		//var frm=top.content.rightpane.document.forms[0];
		if (top.content.rightpane.document){
			var frm=top.content.rightpane.document.forms[0];
		}else{
			var frm= top.content.rightpane.contentDocument.forms[0];
		}
		var docObj=null;
		if(frm != null){
			//docObj=frm.document
			docObj=	frm.ownerDocument;
			/*if(top.content.rightpane.checkChanges){
				if(!top.content.rightpane.checkChanges(docObj))
					return
			}else{
				if(!top.content.rightpane.contentWindow.checkChanges(docObj))
					return;
			}*/
		}
		var str = srcElement.getAttribute("text");
		split = str.split("#");
		sfunctions = securedFunctions.split("þ")


		for(var i=0;i < sfunctions.length ; i++){
			if(sfunctions[i] == split[0]){
				top.content.document.getElementById("rightpane").src=top.applURL +"/jsp/login/security.jsp?ESC=0&fldValues="+split[0] + "&time="+(new Date()).getTime();
				top.content.document.all.tblBody.rows[0].cells[0].width="1px";
				top.content.document.all.tblBody.rows[0].cells[1].width="100%";
				return;
			}
		}
		sfunctions = menuComponent.split("þ");
		for(var i=0;i < sfunctions.length ; i++){
			temp=sfunctions[i].split("#");
			if(temp[0] == split[1]){				
				top.content.rightpane.location.href=top.applURL +temp[1];
				top.content.document.all.tblBody.rows[0].cells[0].width="1px";
				top.content.document.all.tblBody.rows[0].cells[1].width="100%";
				return;
			}
		}
		top.title.document.all.err_msg.style.visibility="hidden";
		top.content.document.getElementById("rightpane").src=top.applURL +"/jsp/app/gk.jsp?fldValues="+split[0]+"&ESC=0&time="+(new Date()).getTime();
	}
}
/**
*	To assign function name to hidden variable to call relevant JSP for execution of the function
*/
function DoOver(e) {
	var evt=(e)?e:(window.event)?window.event:null;
	if (window.event){
		srcElement = evt.srcElement;
	}else{
		srcElement = evt.target;
	}

	if((srcElement.tagName == "A" || srcElement.tagName == "TD") && srcElement.parentElement.className !='menuitems') {
				document.r_RPFORM.r_hide.value = srcElement.text;
	}	

}