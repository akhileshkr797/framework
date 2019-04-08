/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:
* [--Change history--]
*	changed all the .document refernce to .ownerDocument for the form objects
*[9Apr18:ESC] Resolved the Null expression check in the if condition.
*[21May18:ESC] Logic added to send the moved row flag in data
*/
g_rp= new Object()
g_rp=top.content.document.getElementById("rightpane");

g_cp= new Object()
g_cp=top.content;

var nn=(document.layers)?true:false;
var ie=(document.all)?true:false;

document.onkeydown=keyDown;
if(nn) document.captureEvents(Event.KEYDOWN);

function ancrSubmit(ancr,evt) {
	ancrSubmit(ancr);
}
function ancrSubmit(ancr) {
	var param1;
	if(g_oops =='Y'){
		if (obj.getAttribute("OOOPSTEXT")){
		//	if(!confirm(obj.getAttribute("OOOPSTEXT")+" \n Are you sure?"))return; before adding the sweet alert
		param1 = {
			  title: obj.getAttribute("OOOPSTEXT"),
			  text:  "Are you sure?",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes",
			  closeOnConfirm: false
		}
		}else{
		//	if(! confirm(" Are you sure3?"))return; before adding the sweet alert
		param1 = {
				  title: "Are you sure?",
				  text: "You will not be able to recover the file!",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes",
				  closeOnConfirm: false
			}
		}//Code added by ESC on 13Oct06 for handling OOPS Text
		//ancrSubmit_handler(ancr,""); before adding the sweet alert
		swal(param1,
			function(){
				 ancrSubmit_handler(ancr,"");
			});
	}else if(g_oops =='C'){
		if (comment_obj){
				var comment_button = {};
				comment_button['Submit'] = function(){
					if ($("#div_comment_text").val()==""){
						sweetAlert("","Please Enter the Comment","error");
						$("#div_comment_text").focus();
					}else{
						ancrSubmit_handler(ancr,$("#div_comment_text").val()); 
						$(this).dialog('close');
					}					
				}
				comment_button['Cancel'] = function(){$(this).dialog('close');}

				$("#div_comment_text").val('');
				comment_obj.dialog('option', 'buttons',comment_button);
				if (obj.OOOPSTEXT){
					$("#div_comment_title").html(obj.OOOPSTEXT);
					//comment_obj.dialog('option', 'title', +" \n Are you sure?"); 
				}			
				comment_obj.dialog('open');
		}		
	}else{
		ancrSubmit_handler(ancr,"");
	}
}
function ancrSubmit_handler(ancr,comment) {
	doc=ancr.document;
//ESC 09Apr18	if(!g_ancrObject.getAttribute("name")&& g_ancrObject.getAttribute("name").toUpperCase()=="REALIGN"){
	if(g_ancrObject.getAttribute("name")!=null && g_ancrObject.getAttribute("name").toUpperCase()=="REALIGN"){
		var table_id=$('.realign').attr('id');
			var data_col=$('.realign').attr('odatacol');		
			if ($.trim(table_id)!=""){
				//var return_data=table_id+g_ch253;
				var return_data=""
				if ($.trim(data_col)!=""){
					var temp_array=data_col.split(",");
					for (i=0;i<temp_array.length;i++){
						$('#'+table_id+'>tbody>tr>td:nth-child('+temp_array[i]+')').each( function(){
							if($.trim($(this).text())!=""){
//ESC 21May18 Logic added to send the moved row flag in data
								var data=$(this).text();
								if($($(this)[0].parentElement).attr('class')){
									if($($(this)[0].parentElement).attr('class')=='rowchanged'){
										data=data+g_ch252+'Y';
									}
								}
//ESC end of code to send moved row flag in data
								//return_data=return_data+$(this).text()+g_ch253;
								return_data=return_data+data+g_ch253;
							}					   
						});
						return_data=return_data.substring(0,return_data.length-1);
						return_data=return_data+g_ch254;
					}
					return_data=return_data.substring(0,return_data.length-1);
				}else{
						$('#'+table_id+'>tbody>tr>td:nth-child(1)').each( function(){
							if($.trim($(this).text())!=""){
								return_data=return_data+$(this).text()+g_ch253;
							}					   
						});
						return_data=return_data.substring(0,return_data.length-1);
				}
				//alert(return_data);			
			}
		ancr.document.forms[0].linkName.value = "REALIGN";
		ancr.document.forms[0].fldValues.value =return_data;
		ancr.document.forms[0].submit();	
	}

	if(g_owait!="") call_err(null,g_owait);
	//added on 13june02 to add next/prev functionality to normal windows
	if(g_ancrObject){
		if(g_ancrObject.getAttribute("UVSUBR")){
			var url=g_gkURL+"ESC=23&funcName="+g_ancrObject.getAttribute("UVSUBR")+"&fldValues="+g_ancrObject.getAttribute("OI1")+"&linkName="+g_ancrObject.getAttribute("OI2")+"&thirdParam="+g_ancrObject.getAttribute("OI3")+"&isModal=false";
			if(g_owait!="") url+="&owait="+g_owait;
			if (countCheck()==true){return;}
			location.href=url;
			return;
		}
	}
	if( !validateForm(ancr.document.forms[0],g_ancrLinkName) )	{
			return;
	}
	ancr.document.forms[0].fldValues.value =  concatFieldValues(ancr.document);

	if (comment==""){
		ancr.document.forms[0].linkName.value = g_ancrLinkName;
	}else{
		ancr.document.forms[0].linkName.value = g_ancrLinkName+g_ch254+comment;
	}

	if( ancr.document.forms[0].linkName.value.toUpperCase() == "DELETE"){
	
		if(  !confirm("Are you sure you want to delete this record ?") ) {	
				return ;
			}
			else{
				if (countCheck()==true){return;}
				ancr.document.forms[0].submit();
			}
	}else if(ancr.document.forms[0].linkName.value.toUpperCase() == "CANCEL"){
			/*if( checkChanges(document) ){
				if (countCheck()==true){return;}
				document.location.href = g_escUrlStr;
			}*/
			checkChanges(document).done(function (value){
				if(value){
					if (countCheck()==true){return;}
					document.location.href = g_escUrlStr;			
				}
			});

	}else{
		if(g_owait!="") ancr.document.forms[0].action += "?owait="+g_owait;
		if (countCheck()==true){return;}
		ancr.document.forms[0].submit();
		if (top.g_IdleTime==null){
			var winopener = window.dialogArguments;
			if (winopener != null){
				while(winopener.top.g_IdleTime==null)
				{
					winopener=winopener.dialogArguments;
				}
				winopener.top.divWait.style.visibility="visible";
			}
		}
		else{
			top.divWait.style.visibility="visible";
		}
		return true;
	}
	
}

function countCheck(){
	if	(g_HitCount>1){
		 return true;
	 }else{
		g_HitCount=2
	 }
	 return false;
}
function formSubmit(frm,perform,obj)  {
	var sOOPS="";

	if (isVisible(document.all.err_msg)){
		return false;
	}
	if (g_div && g_div !=null && isVisible(g_div))  {
	  return false;
	}
	 if (!obj && window.event!=null){
			obj=window.event.srcElement;
	}
	if(obj && obj.getAttribute("OOOPS")) sOOPS=obj.getAttribute("OOOPS");
	if(sOOPS =='Y'){
		if (obj.getAttribute("OOOPSTEXT")){
			if(! confirm(obj.getAttribute("OOOPSTEXT")+" \n Are you sure?"))return;
		}else{
			if(! confirm(" Are you sure?"))return;
		}//Code added by ESC on 13Oct06 for handling OOPS Text
		formSubmit_handler(frm,perform,obj,"");
	}else if(sOOPS =='C'){
		if (comment_obj){
				var comment_button = {};
				comment_button['Submit'] = function(){
					if ($("#div_comment_text").val()==""){
						sweetAlert("","Please Enter the Comment","error");
						$("#div_comment_text").focus();
					}else{
						formSubmit_handler(frm,perform,obj,$("#div_comment_text").val()); 
						$(this).dialog('close');
					}
				}
				comment_button['Cancel'] = function(){$(this).dialog('close');}

				$("#div_comment_text").val('');
				comment_obj.dialog('option', 'buttons',comment_button);
				if (obj.OOOPSTEXT){
					$("#div_comment_title").html(obj.OOOPSTEXT);
					//comment_obj.dialog('option', 'title', +" \n Are you sure?"); 
				}			
				comment_obj.dialog('open');
		}		
	}else{
		formSubmit_handler(frm,perform,obj,"");
	}
}
function formSubmit_handler(frm,perform,obj,comment) {

	var docObj=null;
	//BA Change if(frm != null)docObj=frm.document
	if(frm != null)docObj=frm.ownerDocument;


    //code added by bhanu ends
	switch( perform.toUpperCase() )	{
		case "COPY":
			var uri = applURL + "/jsp/app/confirm.jsp?copysize=" + copySize + "&time=?+(new Date().getTime())";
			var return_value = window.showModalDialog(uri,"","dialogWidth=400px;dialogHeight=200px;center=1;maximize=0;help=0;resizable=0;border=thin;status=0;")
			retArray = return_value.split("þ");
			if(trimString(retArray[0]) != ""){
				docObj.forms[0].linkName.value = perform +g_ch254+ retArray[0]+g_ch254+retArray[1];
				docObj.forms[0].fldValues.value = concatFieldValues(docObj);
				filterModifiedData(docObj);
				if (countCheck()==true){return;}
				docObj.forms[0].submit();
			}
			break;
		case "LOGTO":
			if( document.forms[0].CHKCHG.value == 'C' )	{	
				sweetAlert("","This action is not allowed \n Please click \"Cancel\" button or link ","error");
				return false;
			}//Code added by ESC on 13Oct06 allow the programer to prevent user exit in middle of some function
			checkChanges(docObj).done(function (value){
				if(value){
					top.content.document.getElementById("rightpane").src= applURL +  "/jsp/login/logto.jsp";
				return;				
				}else{
					return false;
				}
			});
			
			/*if( checkChanges(docObj) )			{
				// BA Change top.content.rightpane.location.href = applURL +  "/jsp/login/logto.jsp"
				top.content.document.getElementById("rightpane").src= applURL +  "/jsp/login/logto.jsp";
				return;
			}	else	{
				return false;
			}*/
			break;
		case "ENTITY":
		checkChanges(docObj).done(function (value){
					if(value){
						top.content.document.getElementById("rightpane").src= applURL +  "/jsp/login/entity.jsp";
				return;				
					}else{
						return false;
					}
			});	
		
		/*if( checkChanges(docObj) )			{
				//BA Change top.content.rightpane.location.href = applURL +  "/jsp/login/entity.jsp"
				top.content.document.getElementById("rightpane").src= applURL +  "/jsp/login/entity.jsp";
				return;
			}	else	{
				return false;
			}*/
			break;
		case "HOME":
			if( document.forms[0].CHKCHG.value == 'C' )	{	
				sweetAlert("","This action is not allowed \n Please click \"Cancel\" button or link ","error");
				return false;
			}//Code added by ESC on 13Oct06 allow the programer to prevent user exit in middle of some function
			checkChanges(docObj).done(function (value){
					if(value){
						top.content.document.getElementById("rightpane").src= applURL + "/jsp/home/rightpane.jsp?homepage=Y";
						return;				
					}else{
						return false;
					}
			});
			/*
			if(checkChanges(docObj) )	{
				//BA Change top.content.rightpane.location.href = applURL + "/jsp/home/rightpane.jsp?homepage=Y"
				top.content.document.getElementById("rightpane").src= applURL + "/jsp/home/rightpane.jsp?homepage=Y";
				return;
			}else{
				return false;
			}*/
			break;
		case "REALIGN":
			var table_id=$('.realign').attr('id');
			var data_col=$('.realign').attr('odatacol');		
			if ($.trim(table_id)!=""){
				//var return_data=table_id+g_ch253;
				var return_data="";
				if ($.trim(data_col)!=""){
					var temp_array=data_col.split(",");
					for (i=0;i<temp_array.length;i++){
						$('#'+table_id+'>tbody>tr>td:nth-child('+temp_array[i]+')').each( function(){
//ESC 21May18 Logic added to send the moved row flag in data
								var data=$(this).text();
								if($($(this)[0].parentElement).attr('class')){
									if($($(this)[0].parentElement).attr('class')=='rowchanged'){
										data=data+g_ch252+'Y';
									}
								}
//ESC end of code to send moved row flag in data
								//return_data=return_data+$(this).text()+g_ch253;
								return_data=return_data+data+g_ch253;
						});
						return_data=return_data.substring(0,return_data.length-1);
						return_data=return_data+g_ch254;
					}
					return_data=return_data.substring(0,return_data.length-1);
				}else{
						$('#'+table_id+'>tbody>tr>td:nth-child(1)').each( function(){
							if($.trim($(this).text())!=""){
								return_data=return_data+$(this).text()+g_ch253;
							}					   
						});
						return_data=return_data.substring(0,return_data.length-1);
				}						
			}
docObj.forms[0].linkName.value = perform;
docObj.forms[0].fldValues.value =return_data;
docObj.forms[0].submit();
			break;
		case "CANCEL":			
			if(docObj != null){
				checkChanges(docObj).done(function (value){
					if(value){
						top.content.document.getElementById("rightpane").src= g_escUrlStr;
						return;				
					}else{
						return false;
					}
				});
				/*
				if (checkChanges(docObj)){
					//BA Change top.content.rightpane.location.href = g_escUrlStr;
					top.content.document.getElementById("rightpane").src= g_escUrlStr;
					return;
				}else{
					return false;
				}*/
			}else{
				//BA Chnage top.content.rightpane.location.href = g_escUrlStr;
				top.content.document.getElementById("rightpane").src= g_escUrlStr;
			}
			break;
		case "SUBMIT":
			if(document.forms[0].frmAuthenticate && document.forms[0].frmAuthenticate.value=='Y'){	
				url=applURL+"/jsp/login/field_login.jsp";
				var retrn_val = window.showModalDialog(url,window,"dialogWidth=300px;dialogHeight=150px;center=0;maximize=1;help=0;resizable=1;border=thin;status=0;")				
				if (!retrn_val){
				//Code added on 31Aug09 by ESC for handling form level authentication on submit button
			
					return false;
				}
			}
			if (comment==""){
				docObj.forms[0].linkName.value = perform;
			}else{
				docObj.forms[0].linkName.value = perform+g_ch254+comment;
			}
			if( frm.nodeName == 'FORM' )	{
				if( !validateForm(frm,"submit") ){
					return false;
				}
				docObj.forms[0].fldValues.value = concatFieldValues(docObj);
				if((getObjectReference(perform))){
					if((getObjectReference(perform)).OWAIT){
						docObj.forms[0].owait.value = (getObjectReference(perform)).OWAIT;
						if(docObj.forms[0].owait.value!=""){
							call_err(null,docObj.forms[0].owait.value);
						}
					}
				}
				filterModifiedData(docObj);
				if (countCheck()==true){return;}
				docObj.forms[0].submit();
			}
			break;
		
		case "ACTION":
			docObj.forms[0].fldValues.value = del_action_msg(docObj);
			if (comment==""){
				docObj.forms[0].linkName.value = 'submit';
			}else{
				docObj.forms[0].linkName.value = 'submit'+g_ch254+comment;
			}
			filterModifiedData(docObj);
			if (countCheck()==true){return;}
       		docObj.forms[0].submit();
			break;
		case "DELETE":
			/*if(!confirm("Are you sure you want to delete this record ?")){	
				return false;
			}*/
			swal({
			  title: "Are you sure?",
			  text: "You will not be able to recover the file!",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes",
			  closeOnConfirm: false
			},
			function(){
				docObj.forms[0].fldValues.value = concatFieldValues(docObj);
				filterModifiedData(docObj);
				docObj.forms[0].linkName.value = perform;
				if (countCheck()==true){return;}
				docObj.forms[0].submit();
			});

			/*docObj.forms[0].fldValues.value = concatFieldValues(docObj);
			filterModifiedData(docObj);
			docObj.forms[0].linkName.value = perform;
			if (countCheck()==true){return;}
			docObj.forms[0].submit();
			*/
		break;	
		case "RESET" :
			if(confirm("Are you sure1 ?")){	
				docObj.forms[0].linkName.value = perform;
				docObj.forms[0].fldValues.value = concatFieldValues(frm.ownerDocument);
				filterModifiedData(docObj);
				if (countCheck()==true){return;}
				docObj.forms[0].submit();
				return true;
			}
			else
				return false;
		default:
			docObj.forms[0].fldValues.value = concatFieldValues(docObj);
			filterModifiedData(docObj);
			if (comment==""){
				docObj.forms[0].linkName.value = perform;
			}else{
				docObj.forms[0].linkName.value = perform+g_ch254+comment;
			}
			if (countCheck()==true){return;}
       		docObj.forms[0].submit();
	}
	g_focusFlag=false;
	return false;
}

function assignOldValue(c){
	var docObj = c.ownerDocument;
	var k = 0;
	outer:
	for(var i=0;i < docObj.forms.length; i++)	{
		var frm = docObj.forms[i]
		for(var j=0; j < frm.elements.length; j++)		{
			if(  (frm.elements[j].getAttribute("ODSND") == 'Y' ) || (frm.elements[j].type == 'hidden') || (frm.elements[j].type == 'reset') || (frm.elements[j].type == 'submit') || (frm.elements[j].type == 'button') )			{                       
				continue;	
			}
			//radio is added on june 5th
			if(  frm.elements[j].type == 'radio'){
				if(j!=0 && frm.elements[j-1].name == frm.elements[j].name )continue;
			}
			k++;
			//textarea is added on June 5th by madhavi
			if( (frm.elements[j].type == 'text' || frm.elements[j].type == 'password' || frm.elements[j].type == 'textarea') && (frm.elements[j].name == c.name) )	{
					break outer;
			}
		}
	}
	var initFldValues = docObj.forms[0].initFieldVals.value
	var fieldValuesArray = initFldValues.split(g_ch254);
	var repval = fieldValuesArray[k-1];
	var token,rIndex
	if (g_form && g_form.getAttribute("OSCROLLTYPE") && g_form.getAttribute("OSCROLLTYPE").toUpperCase()=="L"  && g_div && isVisible(g_div))	{		  
          repval = g_fieldVals
		  token= repval.split("þ")
		  if(g_decide) 
			c.value="";
		  else {
			if (token.length>1)    {
                    var j=0;
					for (var i=0;i<g_form.elements.length;i++ )
					{ 
	                   switch	(g_form.elements[i].type.toLowerCase())								  
					    {		
						case "select":
						case "text":
							   j++
							 if (g_form.elements[i].name == c.name)
							  {
							   c.value = token[j]
							   break;
							   }				 
                         }
					}
			   }	
			
		   }
		
	} 
	else {
	   var scrolType=""
	   if (getParentObjByTag(c,"FORM").getAttribute("OSCROLLTYPE"))
	   {
			scrolType = getParentObjByTag(c,"FORM").getAttribute("OSCROLLTYPE")
		 if(scrolType.toUpperCase()=="P" ) {
			token= repval.split("ý")
			c.value = token[getParentObjByTag(c,"TR").rowIndex-1]
	
		 }
	   }
	   else
		 c.value =  repval
	 }
   c.focus();

g_focusFlag=true;

}
function setFocus(docObj){
  doc = docObj;
  window.focus();
	var focusCtl = trimString(document.forms[0].FOCUSCTL.value);
	if(   focusCtl!= '' ){
		var obj;
		obj =getObjectReference(focusCtl);
 		if(obj != null && obj.disabled!=true){
			//Add disabled condition check on 10-feb-2012 by ESC
			obj.focus();
		}else {			
			obj = 	getEnabledControl();
			if(obj != null)obj.focus();
		}
	}
	else{
		if(document.buttonsform && document.buttonsform.cancel)
			document.buttonsform.cancel.focus();
	}
}
//till here


//--------------------------------------------------------------
//KeyBoard functions
//Author : Madhavi N.
//--------------------------------------------------------------

//************************************  keyDown(e)  *******************************************
// To take specific actions depending on the button pressed.


function keyDown(e) {    
	var event=(e)?e:(window.event)?window.event:null;
	var ieKey=(event.charCode)?event.charCode:((event.keyCode)?event.keyCode:((event.which)?event.which:0));
	var srcObj;
	if (window.event){
		srcObj = event.srcElement;
	}else{
		srcObj = event.target;
	}

	hideErrLayer();
	

	switch(ieKey){
	//SHIFTKEY
	case 16:
		break;
	
	//F5
	case 116:
		return false;
		break;

	//BackSpace
	case 8:
	
		if(srcObj== document )
			return false;
		if(srcObj.type == "text" || srcObj.type == "password" || srcObj.type=="textarea" )	
			return true;
		else
			return false;
		
		break;

	
	//Tab key
	case 9:
		//this boolean variable will decide the execution of ovalidate function 
		g_isTabKey = true;
		if( window.name== 'leftpane'){	 
			if(lp.document.all.ie5menu.style.visibility == 'visible'){
				if(!(contextFlag)){
					document.all.ie5menu.document.links[0].focus()
					contextFlag=true
					return false
				}
			}
		}
		else if( window.name== 'rightpane'){
			if(g_rp.document.all.ie5menu){
				if(g_rp.document.all.ie5menu.style.visibility == 'visible'){
						if(!(contextFlag)){
							document.all.ie5menu.document.links[0].focus()
							contextFlag=true
							return false						
						}
						if(lp.document.all.ie5menu.style.visibility == 'visible')
						lp.document.all.ie5menu.style.visibility = 'hidden'
					}
			}
				 if ( srcObj.getAttribute("OAPC") && srcObj.getAttribute("OAPC").toUpperCase() == "Y")
			{
				oapcFlag =false;
				if(!checkDoubleQuotes(srcObj.value))
				{
				 call_err(srcObj, "NO DOUBLE QUOTES PLEASE  ");
				 srcObj.value="";
				 return;
				}
				 
				AfterPrompt(srcObj);
			
			}
			if (document.activeElement == document.forms[document.forms.length-1].elements[document.forms[document.forms.length-1].elements.length-1])
			{
				 
				
				setFrameFocus(top.content.document.getElementById("rightpane").contentWindow.document);
				callDefault();
				return false;
			}
			callDefault();
			return true;
			
	
		}
			
		break;

	case 93:  //Context Menu
		contextFlag=false
		if(!(window.name=='title')){
			if( window.name== 'rightpane'){
				if(g_rp.document.all.ie5menu)
				{
					showmenuie5()
				}
			}
			else showmenuie5()
			return false;
		}
		break;
	case 37: //left Arrow key
		if(top.log){
		event.keyCode=0;
		event.returnValue=false;
		//return false;
		}
		break;
	case 38: //Up Arrow key
		if(window.name=='leftpane')	event.keyCode=9;
		var ele=srcObj;
		var objTable=getParentObjByTag(ele,"TABLE");
		var objForm=getParentObjByTag(ele,"FORM");
		var objRow=getParentObjByTag(ele,"TR");
		if(objForm.getAttribute("OSCROLLTYPE")){
			if (objForm.getAttribute("OSCROLLTYPE").toUpperCase() == "P"){
				if(!g_sf_selRow) init_sf(ele);
				if (objRow.rowIndex >1){
					if (lfocus(ele)){
						moveElements(objRow.rowIndex,objRow.rowIndex-1,objTable,objForm);
						var elem=getObjectReference(ele.name);
						elem.focus();					
					}
				}
			}
		}
		break;
	case 40: //Down Arrow key
		var ele=srcObj;
		var objTable=getParentObjByTag(ele,"TABLE");
		var objForm=getParentObjByTag(ele,"FORM");
		var objRow=getParentObjByTag(ele,"TR");
		if(objForm.getAttribute("OSCROLLTYPE")){
			if (objForm.getAttribute("OSCROLLTYPE").toUpperCase() == "P"){
				if(!g_sf_selRow) init_sf(ele);
				if (objRow.rowIndex <	objTable.rows.length-2){
					if (lfocus(ele)){
						 moveElements(objRow.rowIndex,objRow.rowIndex+1,objTable,objForm);
						 var elem=getObjectReference(ele.name);
						 elem.focus();
					}	 				
				}		
			}
		}
		break;
	//LeftArrow
	case 37:
		break;
	//Right arrow
	case 39:
		break;
	
	// To ignore the character ' in the favorites text box.
	case 222:
		if(srcObj.name=='title_spl'){
				return false; 
		}
		callDefault();
		break;
	default: 
	callDefault();
		
}

}


function callDefault(){			
			if( (top.title.document.all.err_msg) )
			{
				if (top.title.document.all.err_msg.style.visibility=="visible")
				{
					top.title.document.all.err_msg.style.visibility="hidden"
					clearInterval(g_hand);
						//BA Change l=top.content.rightpane.location.href
						l=top.content.document.getElementById("rightpane").src;
					index=l.lastIndexOf("/")
					//BA Change if(top.content.rightpane.location.href.substring(index + 1).toUpperCase()== "RIGHTPANE.JSP" )
					if(top.content.document.getElementById("rightpane").src.substring(index + 1).toUpperCase()== "RIGHTPANE.JSP" )
					{	
									//BA Change top.content.rightpane.document.forms[0].title_spl.focus()
									//BA Change top.content.rightpane.document.forms[0].title_spl.value=""
									top.content.document.getElementById("rightpane").contentWindow.document.forms[0].title_spl.focus();
									top.content.document.getElementById("rightpane").contentWindow.document.forms[0].title_spl.value="";
									
					}
				}
			}
}
