/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:
* [--Change history--]
* [19Mar18:ESC] Added the encoding logic to handle \n in query string
*/

//--------------------------------------------------------------
//Form Submissions thru Buttons & Anchors
//Author : Vinay & Madhavi
//--------------------------------------------------------------
function getName(event){
	event = event || window.event;
	if (window.event){
		obj = event.srcElement;
	}else{
		obj = event.target;
	}
	g_ancrObject =null;
	if(obj.tagName == "A")	{
		g_ancrLinkName = obj.name
		g_ancrObject = obj
		g_oops="";

		if(obj.getAttribute("OOOPS"))
		g_oops=obj.getAttribute("OOOPS");
		if(obj.getAttribute("OWAIT")) g_owait=obj.getAttribute("OWAIT"); //added by madhavi on 12aug02
		return;
	}else if(obj.tagName == "IMG"){
		g_ancrLinkName = obj.name
		g_ancrObject =  obj.parentElement
		g_oops="";
		if(obj.getAttribute("OOOPS"))
		g_oops=obj.getAttribute("OOOPS");
		if(obj.getAttribute("OWAIT")) g_owait=obj.getAttribute("OWAIT"); //added by madhavi on 12aug02
		return;
	}
	if (!g_ancrObject)
		if(obj.parentElement.tagName == "A")
			g_ancrObject = obj.parentElement
}


//--------------------------------------------------------------
//Form-level scripts
//Author : Madhavi
//--------------------------------------------------------------
function formReset() { 
	if(doc.forms[0]) 	{ doc.forms[0].reset(); } 
}

function checkChanges(docObj) {
	var dfd1 = $.Deferred();	
	//Condition added by ESC on 13Oct06 for "C" type check change flag 
	if( document.forms[0].CHKCHG.value == 'A' || document.forms[0].CHKCHG.value == 'C' )	{	
		sweetConfirm("Are you Sure","Changes will not be saved.Do you want to proceed ?").done(function (value){
			if (value){
				dfd1.resolve(true);										
			}else{
				g_HitCount=1;
				dfd1.resolve(false);
			}
		});	
	}else if( docObj.forms[0].CHKCHG.value == 'Y' ) 	{
		var finalFldValues = concatFieldValues(docObj);
		var initVal = docObj.forms[0].initFieldVals.value
		initVal = initVal.toUpperCase();
		finalFldValues = finalFldValues.toUpperCase();
		if(finalFldValues != initVal){
			sweetConfirm("Are you Sure","Changes will not be saved.Do you want to proceed ?").done(function (value){
				if (value){
					dfd1.resolve(true);										
				}else{
					g_HitCount=1;
					dfd1.resolve(false);
				}
			});			
		}else{
			dfd1.resolve(true);										
		}
	}else{
		dfd1.resolve(true);
	}
	return dfd1;
	//return choice;
}

function sweetConfirm(title,msg){
	var dfd = $.Deferred();	
	swal({   
		title: title,   
		text: msg,   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No",   
		closeOnConfirm: true,   
		closeOnCancel: true},
		function (isConfirm){
			dfd.resolve(isConfirm);
	});
	return dfd; 
}
function getFieldValues(docObj) {
	docObj.forms[0].initFieldVals.value = concatFieldValues(docObj);
}

function validateForm(frm,keyword) {
	//BA Change var docObj = frm.document;
	var docObj =frm.ownerDocument;
	for(var j=0; j < docObj.forms.length ; j++){
		var f = docObj.forms[j];   
		if (f.getAttribute("OTID"))	{
			if(f.getAttribute("OSCROLLTYPE")=="P"){
				var vdiv=getChildObjByTag(f,"DIV");
				var vtab=getChildObjByTag(vdiv,"TABLE");
				if (!validateRow(vtab,f))
					return false;
			}
			continue;
		}
		if	(!(validateSingleForm(f))){
			g_VFlag=false; //added by bhanu on 28jan01
			return false;
		}
			
	}
	if (keyword=="submit" ||keyword=="cancel" ||keyword=="delete" ||keyword=="copy")
	if (!validateFormEdits())	return false;
	return true
}


function validateFormEdits(){
	try{
		if(!FormEdits) return true;
	}catch(exception){return true; }
	var rules=FormEdits.split("|");
	var rule,msg,operand1,operand2;
	for(var i=0;i<rules.length;i++){
		msg="";
		rule=rules[i].split("¶");
		operand1=evalExpression(rule[0]);
		operand2=evalExpression(rule[2]);

		switch (getDataType(operand1)){
			case 0: operand1=parseFloat(operand1); break;
			case 1: operand1=parseFloat(getDateValueOf(operand1));break;
		}
		switch (getDataType(operand2)){
			case 0: operand2=parseFloat(operand2); break;			
			case 1: operand2=parseFloat(getDateValueOf(operand2)); break
		}

/*		if(isFloat(operand1)) 
			operand1=parseFloat(operand1); 
		else 
			operand1=(new Date(operand1)).valueOf();

		if(isFloat(operand2)) 
			operand2=parseFloat(operand2); 
		else 
			operand2=(new Date(operand2)).valueOf();*/
		switch (rule[1]){
			case 'EQ':	if(operand1 == operand2) msg=rule[3]; break;
			case 'LT':	if(operand1 < operand2)	msg=rule[3]; break;
			case 'GT':	if(operand1 > operand2)	msg=rule[3]; break;
			case 'NE':	if(operand1 != operand2) msg=rule[3]; break;
			case 'LE':	if(operand1 <= operand2) msg=rule[3]; break;
			case 'GE':	if(operand1 >= operand2) msg=rule[3]; break;
		}
		if (msg!=""){
			call_err(null,msg);
			return false;
		}
	}
	return true;		
}


function validateSingleForm(f){
	 if (!(f))  {
	   sweetAlert("","FORM OBJECT IS NOT PASSED PROPERLY","error")
	   return false;
	  }
	outer:
	for(var i=0; i < f.elements.length ; i++){
		if(f.elements[i].getAttribute("REQ")=="Y" && !(f.elements[i].getAttribute("ODSND") == "Y")  && !( f.elements[i].disabled ) && !( f.elements[i].style.visibility=='hidden'))	{
			if (isEmpty(f.elements[i]))	{
				g_focusFlag=true;
				if (f.elements[i].getAttribute("OLABEL")){
					call_err(f.elements[i],"Entry for " + f.elements[i].getAttribute("OLABEL") + " is Mandatory!!!");
				}else{
					call_err(f.elements[i],"Entry for " + f.elements[i].name + " is Mandatory!!!");
				}
				assignOldValue(f.elements[i])
				return false;
			}
			if ( f.elements[i].type.toLowerCase() == "radio" )	{
	            var ob = eval("document.all."+f.elements[i].name)
		     	if (ob.length){
					str=""
		       		for (z=0; z<ob.length; z++ ){
					   	if (ob[z].checked){
							continue outer;
						}
			        }
					if (f.elements[i].getAttribute("OLABEL")){
						call_err(f.elements[i],"Entry for " + f.elements[i].getAttribute("OLABEL") + " is Mandatory!!!");
					}else{
						call_err(f.elements[i],"Entry for " + f.elements[i].name + " is Mandatory!!!");
					}
					findTab(f.elements[i]);
					return false;
 	   			}else{
				  	if (!f.elements[i].checked)	{
						if (f.elements[i].getAttribute("OLABEL")){
							call_err(f.elements[i],"Entry for " + f.elements[i].getAttribute("OLABEL") + " is Mandatory!!!");
						}else{
							call_err(f.elements[i],"Entry for " + f.elements[i].name + " is Mandatory!!!");
						}
						findTab(f.elements[i]);
						return false;
					}
				}
			}
		}
		/*
		if( f.elements[i].OBE || f.elements[i].OVALIDATE){
			continue;
		}
		*/

		//code added bh bhanu 28jan02
		if (f.elements[i].getAttribute("OVALIDATE") && f.elements[i].getAttribute("OSV") && !f.elements[i].getAttribute("OSV")){
			g_focusFlag=true;
			call_err(f.elements[i], f.elements[i].getAttribute("OSV"));
			findTab(f.elements[i]);
			return false;
		}
		//if(!(lfocus(f.elements[i]))){ return false; }   //bhanu comments this line
	}
	return true;
}

function concatSortableFormData(frm){
//get all the element values as per the tabindex
	var values=new Array();
	var fldvals="";
	for(var i=0; i<frm.elements.length; i++){		
		switch (frm.elements[i].type.toLowerCase()){
			case "select-multiple" :
				str="";
				for(var j =0; j < frm.elements[i].options.length; j++){
					if(frm.elements[i].options[j].selected)
						str = str +  frm.elements[i].options[j].value + g_ch252;						
				}				
				values[frm.elements[i].tabIndex-1]=str;
				break;
			case "select-one"	:
				if(frm.elements[i].options.selectedIndex == -1)
					str="";
				else
					str = frm.elements[i].options[frm.elements[i].options.selectedIndex].value	
					if (!str){
						str=" ";
					}
				values[frm.elements[i].tabIndex-1]=str;
				break
			case "checkbox"	:
					if (frm.elements[i].checked){
						str=frm.elements[i].value						
						values[frm.elements[i].tabIndex-1]=str;
					}else{
						values[frm.elements[i].tabIndex-1]=" ";
					}
				break
			case "radio"	:
					if (frm.elements[i].checked){
						str=frm.elements[i].value						
						values[frm.elements[i].tabIndex-1]=str;
					}else{
						values[frm.elements[i].tabIndex-1]=" ";
					}
				break				
			case "text"	:
				str =frm.elements[i].value				
				values[frm.elements[i].tabIndex-1]=str;
				break
			case "password"	: //added by BMM for Handling password Field 20Apr06
			case "textarea"	:
				str =frm.elements[i].value		
				//st=encodeURIComponent(st);/*19Mar18 added the encoding logic to handle \n in query string*/
				values[frm.elements[i].tabIndex-1]=str;
				break
			case "button"	:
			case "hidden"	:
			case "submit"	:
			case "reset"	:
			default:
		}
	}
	for(var i=0; i<values.length; i++){		
		if (values[i]=="" || values[i] ){		
			fldvals+=values[i]+g_ch254;
		}		
	}	
	return fldvals;
}

function concatFieldValues(docObj){
	var fldVals = "";
	for(var k=0; k < docObj.forms.length; k++){
		var f = docObj.forms[k];
		if(f.getAttribute("OSF")=="Y"){
			//alert("Form " + k + "::" + f.OSF);
			if(concatSortableFormData(f)){ //added this condition to avoid undefined bmm 02apr05
				fldVals = fldVals + concatSortableFormData(f);
			}
		}else if( f.getAttribute("OTID") ){
			//alert("sfdata-"+k+":"+ sfdata(f));
			fldVals = fldVals  + sfdata(f)  + g_ch254 ;
		}else {
			for(var i=0; i < f.elements.length; i++){
				var str=""
			if (f.elements[i].type!=null){ //Codition added to not prcess filedset object			
				if( !(f.elements[i].getAttribute("ODSND") == 'Y')) {
					switch (f.elements[i].type.toLowerCase()){
						case "select-multiple" :
							str="";
							for(var j =0; j < f.elements[i].options.length; j++){
								if(f.elements[i].options[j].selected)
									str = str +  f.elements[i].options[j].value + g_ch252;
							}
							str= str.substr(0,str.length-1);
							fldVals = fldVals + str + g_ch254;
							break;
						case "select-one"	:
							if(f.elements[i].options.selectedIndex == -1)
								str="";
							else
								str = f.elements[i].options[f.elements[i].options.selectedIndex].value
							fldVals = fldVals  + str + g_ch254
							break
						case "checkbox"	:
							var ob =  eval("docObj.forms[k]." + f.elements[i].name)
							if (ob.length) {
								str=""
								for (z=0; z<ob.length; z++ ){									
									if (ob[z].checked)
										str= str + ob[z].value + g_ch252;
                                   else
                                       str= str + "" + g_ch252;
								}
								i=i+(ob.length-1)
								str= str.substr(0,str.length-1)
							}else {
								if (f.elements[i].checked){
									str=f.elements[i].value
								}
							}
							fldVals = fldVals + str + g_ch254
							break
						case "radio"	:
							var ob = eval("docObj.forms[k]." + f.elements[i].name)
							if (ob.length){
								str=""
								for (z=0; z<ob.length; z++){  
									if (ob[z].checked)
										str= str + ob[z].value + g_ch253
								}
								i=i+(ob.length-1)
								str= str.substr(0,str.length-1)
							} else	{
								if (f.elements[i].checked){
									str=f.elements[i].value
								}
							}
							fldVals = fldVals + str + g_ch254	
							break				
						case "text"	:
							str =f.elements[i].value
							fldVals = fldVals + str + g_ch254							
							break
						case "password"	: //added by BMM for Handling password Field 20Apr06
						case "textarea"	:
							str =f.elements[i].value
							fldVals = fldVals + str + g_ch254
							break
						case "hidden"	: 							
						case "button"	:						
						case "submit"	:
						case "reset"	:
						default:
					}
					if (f.elements[i].getAttribute("OUSER")){	
						fldVals= fldVals.substr(0,fldVals.length-1)+ g_ch251+f.elements[i].getAttribute("OUSER")+ g_ch254;
					}
				}
			}
			}
		}
	}
	fldVals= fldVals.substr(0,fldVals.length-1)
	//alert("Concatenated data:" + fldVals);
	return fldVals;
}
function authenticateform(){
//Code Modifyed on 31Aug09 by ESC for handling form level authentication on submit button

	if(document.forms[0].frmAuthenticate){	
		document.forms[0].frmAuthenticate.value ="Y";
	}
	/*
	url=applURL+"/jsp/login/field_login.jsp";
	var retrn_val = window.showModalDialog(url,window,"dialogWidth=300px;dialogHeight=150px;center=0;maximize=1;help=0;resizable=1;border=thin;status=0;")				
	if (!retrn_val){
//Code added on 11Aug09 by ESC for handling form level authentication in modal window
		if (top.content){
			top.content.rightpane.location.href = g_escUrlStr;
		}else{
			document.forms[0].linkName.value = "CANCEL";
			document.forms[0].submit();
			if (document.forms[0].closeOnsubmit && document.forms[0].closeOnsubmit.value=="Y"){
				if( window.name == "MODAL_IFRAME" ){
					parent.close();
				}else{
					window.close();
				} 				
			}
		}
	}*/
}
