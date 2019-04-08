/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description	formsubmit() syntax has been changed
* [ -- Change History -- ]

* [18Feb19:ESC]Condition added to handle ESC in search window not working properly
*/
resetSessionTimer();//For reseting the session timer

 var nn=(document.layers)?true:false;
 var ie=(document.all)?true:false;

document.onkeypress=trapKey;
document.onkeyup = keyUp;
document.onmousedown=mouseDown;

if(nn) document.captureEvents(Event.KEYPRESS);
if(nn) document.captureEvents(Event.KEYUP);
if(nn) document.captureEvents(Event.MOUSEDOWN);


//Added on 24Apr02 to address OVALIDATE doubleclick issue


function mouseDown(e){

	if (document.all.err_msg && document.all.err_msg.style.visibility=="visible"){
   			document.all.err_msg.style.visibility="hidden";
			clearInterval(g_hand);
	}
	/*
	if (window.event){
		if (event.srcElement.value=="...")	show_Dialog(event.srcElement);
	}else{
		if (e.traget.value=="...")	show_Dialog(event.srcElement);
	}*/

}
//--------------------------------------------------------------
//Function to handle the body click event
//--------------------------------------------------------------
function getName(e){
	var obj;
	var evt=(e)?e:(window.event)?window.event:null;
	if (window.event){
		obj = evt.srcElement;
	}else{
		obj= evt.target;
	}
	g_ancrObject =null
	if(obj.tagName == "A")	{
		g_ancrLinkName = obj.name
		g_ancrObject = obj
		g_oops="";
		if(obj.getAttribute("OOOPS"))	g_oops=obj.getAttribute("OOOPS");
		if(obj.getAttribute("OWAIT")) g_owait=obj.getAttribute("OWAIT"); 
		return;
	}else if(obj.tagName == "IMG"){
		g_ancrLinkName = obj.name
		g_ancrObject =  obj.parentElement
		g_oops="";
		if(obj.getAttribute("OOOPS")) g_oops=obj.getAttribute("OOOPS");
		if(obj.getAttribute("OWAIT")) g_owait=obj.getAttribute("OWAIT"); 
		return;
	}
	if (!g_ancrObject)
		if(obj.parentElement.tagName == "A")
			g_ancrObject = obj.parentElement
}

//--------------------------------------------------------------
//KeyBoard functions
//--------------------------------------------------------------

//To set some variables depending on the button released.
function keyUp(e) {
	var evt=(e)?e:(window.event)?window.event:null;
	var key=(evt.charCode)?evt.charCode:((evt.keyCode)?evt.keyCode:((evt.which)?evt.which:0));

	switch(key){		
		case 18:
			top.log = false;   
			break;
	}
}

function trapKey(e){
	var srcObj;
	var evt=(e)?e:(window.event)?window.event:null;
	var key=(evt.charCode)?evt.charCode:((evt.keyCode)?evt.keyCode:((evt.which)?evt.which:0));
	if (window.event){
		srcObj = evt.srcElement;
	}else{
		srcObj = evt.target;
	}

    switch(key){
	case 27 :
		//event.cancelBubble = true
		//if( document.all.SFLayer1 && eval('document.all.SFLayer1.style.visibility=="visible"')){
		if (!isActionAllowed(srcObj)){
				change("cancel");
				return;
		}
		/*if( checkChanges(document) ){
			document.location.href = g_escUrlStr;
			return false;
			}*/
//		if( window.name == "MODAL_IFRAME" ){
/*	Condition added to handle ESC in search window not working properly  by ESC 18Feb19*/
		if( window.name == "MODAL_IFRAME" || window.name == "MyModalWin"){
			return checkChg(document);			
		}else{
			if( checkChanges(document) ){			
					document.location.href = g_escUrlStr;			
					return false;
				}
		}
		break;
	 
	case 13 :
		if((srcObj.tagName == 'INPUT' && srcObj.type == 'button') || srcObj.tagName == 'A' || srcObj.type=="textarea"){
                return;
		}
		if(srcObj.tagName == 'INPUT') {
//Code added and modified to handle CR in scroll fileds by ESC 15Jan09 
			var c=srcObj;
			var objForm=getParentObjByTag(c,"FORM");
			if(objForm.getAttribute("OSCROLLTYPE")){
				if(c.getAttribute("OCOL") && c.getAttribute("OCOL")=='L'){
					var CRFlag=lfocus(c);						
					if(c.getAttribute("OFLAG") && c.getAttribute("OFLAG")=="F"){
						return false;
					}else if(CRFlag==false){
						c.select();
						return false;
					}else{
						setNewLine(c);
					}							
				}else{
					var tobj=GetObjectByTabIndex(srcObj.tabIndex+1,document)
					if(tobj) {	
						if(!tobj.disabled){
							try{
								tobj.focus();
								}catch(Exception){
							}
						}
					}
				}
				 return false;
			}else if( document.forms[0].submitOnEnter && document.forms[0].submitOnEnter.value == 'N' ){
				 return false;
			}
			   
		}
		if (lfocus(srcObj,1)!=true){
			return false;
		}	
		if (!isActionAllowed(srcObj)){
			 return;
		}
		if( document.forms[0].submitOnEnter && document.forms[0].submitOnEnter.value == 'Y' ){
//Code modified to stop submitting the form if afterprompt returns error flag by ESC 21Jan09 
			var c = srcObj;
			var CRFlag=true;
			if (c.getAttribute("OVALIDATE") || c.getAttribute("OBE")) { 
				if(c.getAttribute("OCCR") ) convertCase(c) ;
				CRFlag=lfocus(c);
			}	
			if(c.getAttribute("OFLAG") && c.getAttribute("OFLAG")=="F"){
				return false;
			}else if(CRFlag==false){
				c.select();
				return false;
			}		
			formSubmit(document.forms[0],'submit');		
			return false;

		}
		break;
	default:
		if (document.all.err_msg && document.all.err_msg.style.visibility=="visible"){
   			eval('document.all.err_msg.style.visibility="hidden"');
			clearInterval(g_hand);
		}
    }
}
function resetSessionTimer(){
	//---------Code to Reset session Time Out value in each page :Senthil E -----
	if (top.g_IdleTime==null){
		var winopener = window.dialogArguments;
		if (winopener != null){
			while(winopener.top.g_IdleTime==null){
				winopener=winopener.dialogArguments;
			}
			winopener.top.g_IdleTime=0;
			//uncomment the following line for testing purpose
			//winopener.top.title.sessiontime.innerText=""
			winopener.top.document.getElementById("divWait").style.visibility="hidden";
		}
	}
	else{
		top.g_IdleTime=0;
		//uncomment the following line for testing purpose
		//top.title.sessiontime.innerText=""
		top.document.getElementById("divWait").style.visibility="hidden";
	}
}
//added for printing table header and footer on 10thSep03 by Madhavi.N
/*
function window.onbeforeprint(){
	var temp;
	if(document.all.headerline){
		temp=document.all.headerline.OTEXT;
		document.all.headerline.rows(0).cells(0).innerHTML=temp;
		document.all.headerline.style.visibility='visible';
		}
	if(document.all.footerline){
		temp=document.all.footerline.OTEXT;
		document.all.footerline.rows(0).cells(0).innerHTML=temp;
		document.all.footerline.style.visibility='visible';
	}
}
function window.onafterprint(){
		if(document.all.footerline){
			document.all.footerline.style.visibility='hidden';
			document.all.footerline.rows(0).cells(0).innerHTML="";
		}
		if(document.all.headerline){
			document.all.headerline.rows(0).cells(0).innerHTML="";
			document.all.headerline.style.visibility='hidden';
		}
}
*/
