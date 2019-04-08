/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
*/
//--------------------------------------------------------------
//Error Layer functions
//Author : Madhavi & Jogi
//--------------------------------------------------------------

function hideErrLayer(){
	doc=document;
	if (document.getElementById("err_msg")){
			document.getElementById("err_msg").style.visibility='hidden';
	}
}	

function showFormMessage2(message){
	if(trimString(message)!="") sweetAlert("",message,"error");
}


function showFormMessage(message){
	if(trimString(message)!="") call_err(null,message);
}

function call_err(c,msg,type){
	if (document.getElementById("err_msg")==null){
		return;
	}
	if (type && type=="A"){ //Condition added by BMM on 20May06 for alert type Error Display
		sweetAlert("",msg,"error");
	}else{
		g_logo = document.getElementById("err_msg");
		if(msg==""){
			g_logo.className="err_msg round-a-gray";
			msg ="<img src='../../images/errmsg.gif'> &nbsp;Please Wait!!!";
			msg = "<div>"  + msg + "</div>"
		}else{
			g_logo.className="err_msg round-a-error";
			msg = "<div>"  + msg + "</div>"
		}
		if (c!=null){
				$("#err_msg").position({
					my:"left top+10",
					at:"left bottom",
					of: $(c), // or $("#otherdiv)      
					collision: "flip"
				});
		}else{
				$("#err_msg").position({
					of: document.body, // or $("#otherdiv)      
					collision: "flip"
				});
		}			
		document.getElementById("err_msg").innerHTML =  msg;
		document.getElementById("err_msg").style.visibility="visible";

	}
}

function updateLogo(c) {                // Resposition logo.
	var x, y;
	x= getWindowWidth()- getPageScrollX() - getWidth(eval('doc.all.err_msg')) - g_xOff
	if(arguments.length == 1){
		y = getPageScrollY() + getWindowHeight() - getHeight(eval('doc.all.err_msg')) ;
	}else{
		y = getPageScrollY() 
	}
	moveLayerTo(eval('doc.all.err_msg'),x,y)
}

function call_msg(doc1 , msg){
	 doc=doc1
	 msg= msg+" this is an exmaple.testing ;layer positiom. see this"
	 g_logo = getLayer("err_msg",doc);
     eval("doc.all.err_msg.innerText =  msg ")
     var col = "<span class=error> this is an exmaple.testing ;layer positiom. see this"  + eval( "doc.all.err_msg.innerText") + "</span>"
	 eval("doc.all.err_msg.innerHTML =  col ")
	 updateLogo('msg')
     eval("doc.all.err_msg.style.visibility='visible'")
}

//--------------------------------------------------------------
//Tab Control
//Author : Madhavi
//--------------------------------------------------------------

//added on 11th september
function ShowLayer(bobj,lobj) {
 try{
	if(!document.all.T1){
           setFocus(document);
           return;
    }

    for(var i=1;i<=parseInt(bobj.document.all.T1.style.layers);i++){
		eval("bobj.document.all.b"+i+".style.height=" + 24)//This line is added  on Sep10th2003 for headerline and footerline by Madhavi.N
		eval("bobj.document.all.b"+i+".style.fontWeight='normal'")//This line is added  on Sep10th2003 for headerline and footerline by Madhavi.N
		eval("bobj.document.all.div"+i+".style.visibility='hidden'")
		
		eval("bobj.document.all.b"+i+".style.borderTop='ridge 1px'")
       	eval("bobj.document.all.b"+i+".style.borderLeft='ridge 1px'")
		eval("bobj.document.all.b"+i+".style.borderRight='ridge 1px'")
		
	}
	doc=bobj.document;
	lobj.style.visibility='visible';
	lobj.style.left =bobj.document.all.T1.offsetLeft;
	lobj.style.top =parseInt( bobj.document.all.T1.offsetParent.offsetTop)+parseInt( bobj.document.all.T1.offsetTop) +  bobj.document.all.T1.offsetHeight -5;
	//lobj.style.top = bobj.document.all.T1.offsetTop+95;//This line is added  on Sep10th2003 for headerline and footerline by Madhavi.N
	lobj.style.width = bobj.document.all.blockDiv.offsetWidth;
	if( g_div && g_div != null)
                hideLayer(g_div);
        g_div=null;
	//document.all.SFLayer.style.visibility="hidden";
	lobj.style.zIndex=3;
	bobj.style.height=24;//This line is added  on Sep10th2003 for headerline and footerline by Madhavi.N
	bobj.style.fontWeight="bold";//This line is added  on Sep10th2003 for headerline and footerline by Madhavi.N  */
	bobj.style.borderTop="solid black 1px";
	bobj.style.borderLeft="solid black 1px";
	bobj.style.borderRight="solid black 1px";
	
	scroll(0,0);
	document.all.buttonsfrm.style.top=parseInt(lobj.style.top) + lobj.offsetHeight +20;
	document.all.buttonsfrm.style.left=lobj.offsetLeft +  (lobj.offsetWidth/2)-(document.all.buttonsfrm.offsetWidth/2);
	lobj.style.visibility="visible";
	lobj.focus();

	var focusCtl=""; 
	if (document.forms[0].FOCUSCTL){
			focusCtl = trimString(document.forms[0].FOCUSCTL.value)
	}

	if( focusCtl!= ''){
		if(event.type == 'load'){
        		var ctlObj = getObjectReference(focusCtl);
			if(ctlObj != null){
                                ctlObj.focus();
                                return;
                        }else{
				var ctlObj = getEnabledControl(getChildObjByTag(lobj,"FORM"));
				if (ctlObj!=null){
                                        ctlObj.focus();
			        }
		        }
	        }else{
                        var ctlObj = getEnabledControl(getChildObjByTag(lobj,"FORM"));
                        if (ctlObj!=null){
        		        ctlObj.focus();
		        }
	        }
	}else{
		if(document.buttonsform && document.buttonsform.cancel)
	        	document.buttonsform.cancel.focus();
	}
 }catch(exception){
        //alert(exception);
 }
	if(g_obpcFlag) BeforePrompt(g_obpcFlag);
}



//--------------------------------------------------------------
//Status Bar Messages
//Author : Madhavi
//--------------------------------------------------------------
function showStatus(c) { window.status=c.OSLT; }
function clearStatus() { window.status=""; }
function showMsg( Ctrl , msg ) { Ctrl.value="";	Ctrl.focus(); }
