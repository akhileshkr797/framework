/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:This script file is included to both normal and modal windows and has common functions
* [--Change history--]
*[26Dec14:ESC] Codition added to avoid error message if the user has not entered any data in numeric validation field
*[08Dec16:ESC] Changed the syntax in the validateSubType to get the ODST attribute.
*[30Oct17:ESC] Added code not to refersh the page if user closes the window.
*/

//to trap keys

if (document.all)    {n=0;ie=1;fShow="visible";fHide="hidden";}
if (document.layers) { n=1;ie=0;fShow="show";   fHide="hide";}

if(document.all)
	g_ie4=true ;  //If browser is IE
else  
	g_ns4=true ;//If Browser is Netscape

function init() {   //To initialize the block variables
	/*
	if (g_ns4){
 		block = document.blockDiv
	}
	if (g_ie4){
        block = blockDiv.style 
	}
	block.active = false 	//To identify whether the Ctl key is pressed.
	*/
	top.log=false  //To identify whether the Alt key is pressed.
}


//**************** For All the Frames******************************

function styleButton(){
//-----------Depricated please handled it in style sheet---------------
/*
for( var j=0 ; j < document.forms.length ; j++){
	for( var i=0 ; i < document.forms[j].elements.length ; i++){
		if(document.forms[j].elements[i].type.toLowerCase() == "button" || document.forms[j].elements[i].type.toLowerCase() == "submit" ||document.forms[j].elements[i].type.toLowerCase() == "reset"){
			document.forms[j].elements[i].style.color="white";
		}
		else if(document.forms[j].elements[i].type.toLowerCase() == "select-multiple" ){
			document.forms[j].elements[i].style.height="68px";
	
			}
		}
	}
	*/
}

//--------------------------------------------------------------
//Field-Level Validation Scripts
//Author : Team
//--------------------------------------------------------------
//function gfocus code starts here
function gfocus(c,e){
	var temp;
	var oEvent=(e)?e:(window.event)?window.event:null;
	if (!c){
		if (window.event){
			c = oEvent.srcElement;
		}else{
			c = oEvent.target;
		}
	}
	if(g_VFlag)return;
	c.setAttribute("OFLAG","");
	var security=false;

	if (!c.getAttribute("OPREVIOUSVALUE") ) {
		temp=((c.value=="")?"#":c.value);
		c.setAttribute("OPREVIOUSVALUE",temp);

	}

	if (c && c.getAttribute("OAPC") && c.getAttribute("OAPC").toUpperCase() == "Y")
		oapcFlag=true;

	if(c.getAttribute("ODEFAULT")){ 	//check for any default values that are to copied from any other element of the page
		var obj=eval("c.form." + c.getAttribute("ODEFAULT") );
		if(trimString(c.value) == "") 
			c.value=obj.value;
	}

	if(c.type != 'button' && c.type != 'select-one' && c.type != 'select-multiple'){
		c.style.color="ff0050"
                c.select()
		//c.select() Commented to remove highlighting in input field onfocus by ESC on 18Apr06
	}

	if(c.getAttribute("ODT") == "N" || c.getAttribute("ODT")=="I" || c.getAttribute("ODT") =="F"){
		changeAlignment(c,"L");
	}
//Code added for filed level validation on [10-june-2009]
	
	if(c.getAttribute("ODST")){
		if (c.getAttribute("ODST")=="AR"){
				url=applURL+"/jsp/login/field_login.jsp";
				var retrn_val = window.showModalDialog(url,window,"dialogWidth=300px;dialogHeight=150px;center=0;maximize=1;help=0;resizable=1;border=thin;status=0;")				
				if (!retrn_val){
					if (c.getAttribute("OFAIL")) getObjectReference(c.getAttribute("OFAIL")).focus();
				}else{
					c.setAttribute("OUSER",retrn_val);
				}
		}		
	}
	if(c.getAttribute("OSLT")) 
		showStatus(c) ;

	if(c.getAttribute("OBE")){
		var ruleIndexes=(c.getAttribute("OBE")).split(",");
		for(var k=0;k<ruleIndexes.length;k++){
			for(var i=0;i<BusinessRules.length;i++)
				if(BusinessRules[i][0]==ruleIndexes[k])
					break;
		}
		if(BusinessRules[i][1]=="B" ) promptTags(c,BusinessRules[i]);
	}
}
//function gfocus code ends here
function lfocus(c,forceValidation,e){
	var oEvent=(e)?e:(window.event)?window.event:null;

	if (!c){
		if (window.event){
			c = oEvent.srcElement;
		}else{
			c = oEvent.target;
		}
	}
	var sField_label=""
	var sError="You entered <u>"+c.value+"</u><br>";

	if (c.getAttribute("OLABEL")){
		sField_label=c.getAttribute("OLABEL");
	}else{
		sField_label=c.NAME;
	}
	//c.style.color="black"
	doc = c.document;
	if(c.type=="select-multiple"){
		var multivalue ="";
		for(var n=0;n< c.options.length;n++){
			if(c.options[n].selected) multivalue += c.options[n].value + g_ch252;
		}
		multivalue= multivalue.substr(0,multivalue.length-1);

		//c.value = multivalue;
	//window.defaultStatus="select-multiple";
	}
	else c.value=trimString(c.value)

	//checking for g_VFlag(global variable) which returns true, if valid data
	if(g_VFlag){
		g_VFlag=false;
		//c.style.color="black";
		return false;
    }
	//continue with validations only if control value is not null else return
	//c.style.color="black"

	//code c.type.toLowerCase()!="radio" is added to perform afterpromts on radio

	if(forceValidation && forceValidation==1){
		// do not write any code here to force afterprompt server call even on no-data-change situation
	}else{
		if (c.value==""){
			c.setAttribute("OSV","");            
			return true;
		}
		// do not perform any validations unless data is changed
		if (c.getAttribute("OPREVIOUSVALUE")==c.value && c.type.toLowerCase()!="radio") {
			return true; //Commented out on 25Jan05
		}
	}
	//c.OPREVIOUSVALUE=c.value;

	if(c.getAttribute("OCCR") ){
		convertCase(c) ;
	}
	if (c && c.getAttribute("OAPC") && c.getAttribute("OAPC").toUpperCase() == "Y"  && !oapcFlag){
	    if(!checkDoubleQuotes(c.value)) {
		 call_err(c, "NO DOUBLE QUOTES FOR "+sField_label+" PLEASE  ");
		 setTimeout(function() {$(c).focus();},0);
		 c.value="";
		 
		 return false;
		}
		AfterPrompt(c);
	}
	if (c.value!=""){
	switch( c.getAttribute("ODT") ){
		case 'N':
		case 'I':
			if(!(isInteger(c.value))){
				g_VFlag=true;
				assignOldValue(c);
				g_formElement=c;

				call_err(c, sError+" Entry for "+sField_label+" should be Integer!!!");
				setTimeout(function() {$(c).focus();},0);
				return false;
			}
			changeAlignment(c);
			break;
		case 'F':
			if(!(isFloat(c.value))){
				g_VFlag=true;
				g_formElement=c;
				call_err(c, sError+" Entry for "+sField_label+" should be decimal number!!!");
				setTimeout(function() {$(c).focus();},0);
				assignOldValue(c);
				
				return false;
			}
			changeAlignment(c);
			break;
		case 'D':
			if(!(isDate(c)) )
			{
				g_VFlag=true; 
				g_formElement=c;
				call_err(c, sError+"Entry for "+sField_label+" should be a valid Date!!!");
				setTimeout(function() {$(c).focus();},0);
				assignOldValue(c);

				return false;
			}
			break;
		default:
	}
}
	if(c.getAttribute("ODST")){
		validateSubType(c);		
	}

	if(c.getAttribute("ORC") ){
		if(!(rangeCheck(c))){
			var error_msg="";
			if(c.getAttribute("ODT") == 'D'){
				if (c.getAttribute("OLABEL")){
					error_msg="Allowed Date Range for "+c.getAttribute("OLABEL")+" is " + formatDate(g_fir) + " " + formatDate(g_sec) +  " !!!";
				}else{
					error_msg="Allowed Date Range is " + formatDate(g_fir) + " " + formatDate(g_sec) +  " !!!";
				}
			}else{
				if (c.getAttribute("OLABEL")){
					error_msg=" Allowed Range for "+c.getAttribute("OLABEL")+" is " +g_RAarray.join('-') + "!!!";
				}else{
					error_msg=" Allowed Range is " +g_RAarray.join('-') + "!!!";
				}
			}
			call_err(c,sError+error_msg);

			g_VFlag=true;
			assignOldValue(c);
			g_formElement=c;
			return false;
		}
	}

	if(c.getAttribute("OAV") ){
		if (c.value== " ") c.value =""
		if(c.value != ""){
			if(!(isAllowed(c)))	{
				call_err(c,sError+" Entry for "+sField_label+" should be  " + g_AVarray.join(' or ')+" !!!");
				assignOldValue(c)
				g_VFlag=true
				//c.focus()
				setTimeout(function() {$(c).focus();},0);
				return false;
			}
		}
	}
	
	if(c.getAttribute("OCR") && (c.getAttribute("ODT") == 'F' || c.getAttribute("ODT") == 'N') ){
		ocr = c.getAttribute("OCR").charAt(2)
		if(c.value != ""){
			c.value=c.value.round(ocr); //madhavi
		}		
	}
  	if (c.getAttribute("OVALIDATE")){
		if(c.getAttribute("OCOL") && c.getAttribute("OCOL")=="L"){
			if (c.getAttribute("OFLAG") && c.getAttribute("OFLAG")!=""){
				return false;
			}
		}
	    var x=validateText(c);
		//Code added by ESC on 13Oct06 to move the focus to PASS/FAIL fields if defined by the programmer
		if (x==-1){			
			var tobj=c.nextSibling;
			while(tobj  && tobj.nodeName.toLowerCase()!="input")
			tobj=tobj.nextSibling;
			if (windowcount==1){
				a=show_Dialog(tobj,oEvent);
			//Code added by ESC on 28March2012 to call the validate text one more time to solve the filed not validating issue
				if (validateText(c)==1){
					c.setAttribute("OFLAG","F");
					//c.OPREVIOUSVALUE=c.value; //added on 24Apr02 to resolve OVALIDATE issue;
					//if (c.getAttribute("OFAIL")) getObjectReference(c.getAttribute("OFAIL")).focus();
					if (c.getAttribute("OFAIL")) setTimeout(function() {$(getObjectReference(c.getAttribute("OFAIL"))).focus();},0);
					return false;
				}
			}
			
		}else if (x==1){
			c.setAttribute("OFLAG","F");
			//c.OPREVIOUSVALUE=c.value; //added on 24Apr02 to resolve OVALIDATE issue;
			if (c.getAttribute("OFAIL")) getObjectReference(c.getAttribute("OFAIL")).focus();
			//if (c.getAttribute("OFAIL")) setTimeout(function() {$(getObjectReference(c.getAttribute("OFAIL"))).focus();},0);
			return false;
		}else{
			c.setAttribute("OFLAG","P");
			if (c.getAttribute("OPASS")) getObjectReference(c.getAttribute("OPASS")).focus();
			//if (c.getAttribute("OPASS"))  setTimeout(function() {$(getObjectReference(c.getAttribute("OPASS"))).focus();},0);
		}
	}

	if( c.getAttribute("OCF") )	{
		computeformulae(c);
	}
	
	if (c.getAttribute("OBPC"))	{
		switch (c.type.toLowerCase())	{
		case "checkbox":
			break;   //30APR02 - CHECK IF BREAK IS REQUIRED HERE
		case "radio":
			if (c.checked) BeforePrompt(c);
			break;
		case "select-multiple" :
		case "select-one"	:
		case "password"	: //added by BMM for Handling password Field 20Apr06
		case "text"	:
		case "textarea"	:
			if (c.value!="") BeforePrompt(c);
			break;
		}
	}
	if(c.getAttribute("OBE")){
		if(c.getAttribute("OCOL") && c.getAttribute("OCOL")=="L"){
			if (c.getAttribute("OFLAG") && c.getAttribute("OFLAG")!=""){
				return false;
			}
		}
		if(forceValidation && forceValidation==1){
		//added by ESC for force afterprompt server call even on data is null situation 04May10
			validateBusinessRules(c);  
		}else if (trimString(c.value)!=""){
			validateBusinessRules(c);  
		}
	}

	if(c.form.getAttribute("OSCROLLTYPE")){
		if(!g_sf_table) init_sf(c);
		calTot(g_sf_table);
		/*alert(g_sf_selRow);
		alert(g_sf_selRow.rowIndex);
		moveElements(g_sf_selRow.rowIndex, g_sf_selRow.rowIndex+1, g_sf_table,g_sf_form)*/
	}
			
	clearStatus();
	if (c.value!=""){
		//c.OPREVIOUSVALUE=c.value; 
	}
	g_VFlag=false;
	return true;
}
function validateSubType(obj){	
//	switch(obj.ODST){//Changed by ESC on 08Dec16 to fix the syntax
	switch(obj.getAttribute("ODST")){	
		case "V1":
			obj.value=convertString(obj.value);
			break;
		case "V3":
			obj.value=toDot(obj.value);
			break;
		case "V2":
			var x=isValidInput(obj.value," "+g_IDseparator);
			if (x==false){
				if (obj.getAttribute("OLABEL")){
					call_err(obj, "Spaces and '"+g_IDseparator+"' not allowed in " + obj.getAttribute("OLABEL") + " : " + obj.value);
				}else{
					call_err(obj, "Spaces and '"+g_IDseparator+"' not allowed in " + obj.name + " : " + obj.value);
				}
				obj.value="";
				g_VFlag=true;
				//obj.focus();
				setTimeout(function() {$(obj).focus();},0);
				}
			break;
		case "N1" :
			var x=obj.maxLength - obj.value.length;
			var st=obj.value;
			for(var i=0;i<x;i++)
				st="0" + st;
			obj.value=st;
			break;
		case "PN":
			pntype(obj);
			break;
		default :	
			if (typeof(g_FormatFunction) != 'undefined' && g_FormatFunction!=""){
				var returnValue=AfterPrompt(obj,g_FormatFunction,obj.value,obj.getAttribute("ODST"),"");
				var data=returnValue.split(g_ch255);
				if (data[0]==0){			
					if (trimString(data[1])!=""){
						obj.value=data[1];
					}
				}else{
					if(trimString(data[2])!=""){
						//sweetAlert("",data[2],"error");
						alert(data[2]);
						obj.value="";
						g_VFlag=true;
						obj.focus();
						//setTimeout(function() {$(obj).focus();},0);
						}
				}
			}

	}
}

function pntype(obj){
	//important: variable g_PN is declared in /jsp/home/index.jsp
	var currentvalue=obj.value;
	if (currentvalue==""){  //no action if value is null or empty
		return;
	}else if (currentvalue.indexOf("-")>0){ //store if value has a hyphen
		top.g_PN=currentvalue;
		return;
	}else if (isNumber(currentvalue) && (currentvalue.length==2 || currentvalue.length==4)){ //if it is 2digit number or 4 digit number then modify the value
		if (!top.g_PN) return; //return if g_PN is null
		var newvalue;
		var PN=top.g_PN.split("-");
		if(PN[1].length<currentvalue.length) //if store specific PN value is lessthan current value 
			newvalue=PN[0] + "-" + currentvalue;
		else{
			newvalue=PN[0] + "-" + PN[1].substring(0,PN[1].length-currentvalue.length)+currentvalue;
		}
		top.g_PN=newvalue;
		obj.value=newvalue;			
	}
}


function gltype(str,format){
	var arrData=str.split("-");
	var arrFormat=format.split("-");
	for(var i=0;i<arrData.length;i++){
		if(!isNumber(arrData[i])) return str;
	}
	arrData[0]=arrData[0]+"0000000000000000";
	arrData[0]=arrData[0].substring(0,arrFormat[0]);
	if (arrData.length!=arrFormat.length) return arrData[0];
	arrData[1]="0000000000000000"+arrData[1];
	arrData[1]=arrData[1].substring(arrData[1].length -arrFormat[1],arrData[1].length);
	return (arrData[0]+"-"+arrData[1]);
}

//--------------------------------------------------------------
//Numeric Functions
//Author : Vinay Ram
//--------------------------------------------------------------


function rangeCheck (c){
//Codition added by ESC on 26Dec14 to avoid getting error even if the user has not entered any data
	if (trimString(c.value)==""){
		return true;
	}
	switch( c.getAttribute("ODT") ){
		case "N":
		case "I":
			if(!(rangeCheckNum(c))){
				g_VFlag=true; g_focusFlag=true;return false;
			}
			break;
		case "F":
			if(!(rangeCheckFloat(c))){
				g_VFlag=true; g_focusFlag=true; return false;
			}
			break;
		case "D":
			if(!(rangeCheckDate(c))){
				g_VFlag=true;  g_focusFlag=true;return false;
			}
			break;
	}
	return true;		
}



//--------------------------------------------------------------
//Drill down, Modal or Non Modal window functions
//Author : Jogi & Madhavi.N
//--------------------------------------------------------------

////this function is used when a anchor is selected////

function selRec(obj,event){
	if (!obj){
		obj = event.target;
	}
	if (obj.getAttribute("TEXT")){
		document.all.ret.value= obj.getAttribute("TEXT");
	}else if (obj.name.toUpperCase() == "SUBMIT"){
		formSubmit(obj.form,"submit")
    	}else if (obj.name == "CANCEL"){
		if( !formSubmit(obj.form,"CANCEL") ){
			return false;
	    	}
	}else if (obj.name == "BACK"){
		formSubmit(obj.form,"submit")
	}
    	
	/////21mar01 - Jogi- for next & prev buttons in modal window - code starts here
//Code changed by ESC on 16Oct06 to open  next & prev buttons in modal window in same instead of closing and opening new window
	if (obj.getAttribute("UVSUBR"))	{
		//var returnval = "moreþ" +  obj.OMODALTYPE + "þ" + obj.UVSUBR + "þ" + obj.OI1 + "þ" + obj.OI2 + "þ" + obj.OI3
		//document.all.ret.value = returnval

		UVSRName =  obj.getAttribute("UVSUBR");
		firstParam = obj.getAttribute("OI1");
		vLinkName	 = obj.getAttribute("OI2");
		vThirdParam = obj.getAttribute("OI3");
		qrystr="funcName=" + UVSRName + "&fldValues=" + firstParam + "&linkName=" + vLinkName + "&thirdParam=" + vThirdParam + "&ESC=5";
		url = g_gkURL + qrystr;
		document.frmSearch.action=url;		
		document.frmSearch.submit();
	}else if (obj.name.toUpperCase() != "BACK"){
		window.close();
	}
//ESC code on 16Oct06 ends here
	return false
}

/*
function show_ModalDialog(url,name,wd,ht){
	var $dialog = $('<div></div>')
               .html('<iframe style="border: 0px; " src="' + url + '" width="100%" height="100%"></iframe>')
               .dialog({
                   autoOpen: false,
                   modal: true,
                   height: ht,
                   width: wd,
                   title: name
               });
	$dialog.dialog('open');
}*/
////To show the Modal dialog window//////
var g_rtnctl;
function show_Dialog(obj,e){
	var event = e || window.event;
	if (!obj){
		obj = event.target;
	}
	//call_err(null,"");
	
	if( obj.type == 'button' || obj.tagName == "IMG"){
		g_ancrObject = obj
	}		
	var url=g_gkURL
	var ESC;
	var bFirst=true;
	var UVSRName="";
	var vFldValues="";
	var vLinkName="";
	var vThirdParam="";

	if(g_ancrObject.getAttribute("UVSUBR")) UVSRName=g_ancrObject.getAttribute("UVSUBR");
	if(g_ancrObject.getAttribute("OI1")) vFldValues=g_ancrObject.getAttribute("OI1");
	if(g_ancrObject.getAttribute("OI2")) vLinkName=g_ancrObject.getAttribute("OI2");
	if(g_ancrObject.getAttribute("OI3")) vThirdParam=g_ancrObject.getAttribute("OI3");

	var modalTitle	= "";
	if(g_ancrObject.getAttribute("OTITLE")){
		modalTitle=g_ancrObject.getAttribute("OTITLE");
	}

	var qrystr = ""
	var MODALSIZE = 'M';
	if(g_ancrObject.getAttribute("OMSIZE")){
		MODALSIZE = g_ancrObject.getAttribute("OMSIZE");
	}
	var modalWindowHeight = (screen.height*90)/100; //570;
	var modalWindowWidth = (screen.width * 75)/100; //600;
	switch( MODALSIZE ){
		case 'S':
			modalWindowWidth = (screen.width * 50)/100; //400;
			break;
		case 'M':
			modalWindowWidth = (screen.width * 75)/100; //600;
			break;
		case 'L':
			modalWindowWidth = screen.width;//800;
			break;
		default:		
			//0 - height , 1 - width
			var hw = MODALSIZE.split(",");
			if (hw  && hw.length >= 2){
				modalWindowHeight = (screen.height * hw[0])/100; 
				modalWindowWidth = (screen.width * hw[1])/100; 						
			}
	}
	//var rtnctl      
	
	switch (g_ancrObject.getAttribute("OMODALTYPE")){
		case "ORD":	// Ordinary Dialog
				url = g_modalURL;
				ESC=4;
				break;
		case "CRT":	// Dialog selected value has to be submitted
		case "RTN":	// Dialog selected value has to be placed in associated field
				if( g_ancrObject.getAttribute("OTABINDEX") ){
					vFldValues=getOTABINDEXValues(g_ancrObject);
				}
				vFldValues=replaceString(vFldValues,"??","");
				if (g_isF4Key){
					vFldValues="?L";
				}
				ESC=5;
				break;
		case "FRM":	// Dialog selected values are to sumitted and call others form
		case "SUB4":// Combination of SUB and SUB2. Requested by SNA Dt 12Mar03
				if( g_ancrObject.getAttribute("OTABINDEX")){
					vFldValues=getOTABINDEXValues(g_ancrObject);
				}
				url = g_modalURL
				ESC=14;
				break;
		case "SUB":	// Dialog selected values are to sumitted and call others form
				if( g_ancrObject.getAttribute("OTABINDEX") ){
					vFldValues=getOTABINDEXValues(g_ancrObject);
				}
				url = g_modalURL
				ESC=6;
				break;
		case "SUB1":
		case "SUB2":
				url = g_modalURL;
				vLinkName = g_ancrObject.name;
				vFldValues=concatFieldValues(g_ancrObject.ownerDocument);
				ESC=9;
				if( window.name == "MODAL_IFRAME" )	{
					UVSRName=g_ancrObject.ownerDocument.forms[0].funcName.value;
					vThirdParam=g_ancrObject.ownerDocument.forms[0].thirdParam.value;
					bFirst=false;
				}
				break;
		case "MPT":
				url = g_modalURL;
//				vLinkName = g_ancrObject.name;
				vFldValues=concatFieldValues(g_ancrObject.ownerDocument);
				ESC=30;			
				break;
		case "SUB3":
				url = g_modalURL;
				//vLinkName = g_ancrObject.name;
				vLinkName = g_ancrObject.getAttribute("OI2"); //being sent after confirmation from SNA 24Mar05
				if( g_ancrObject.getAttribute("OTABINDEX")){
					vFldValues=getOTABINDEXValues(g_ancrObject);
				}
				ESC=13;
				break;
/*
	Code added for Handling PCL2PDF by ESC on [10April09]
*/	
		case "PDF":
				if (UVSRName)
					qrystr="funcName=" + replaceChar(escape(UVSRName),"+",String.fromCharCode(31));
				if (vFldValues)
					qrystr= qrystr + "&IP1=" + replaceChar(escape(vFldValues),"+",String.fromCharCode(31));
				if (vLinkName)
					qrystr= qrystr + "&IP2=" + replaceChar(escape(vLinkName),"+",String.fromCharCode(31));
				if (vThirdParam)
					qrystr= qrystr + "&IP3=" + replaceChar(escape(vThirdParam),"+",String.fromCharCode(31));

				hideErrLayer();

				document.location = applURL+"/jsp/app/pcl2pdf.jsp?"+qrystr;

				return;
				break;
/*
	Code added for Handling CSV Data by ESC on [15Nov16]
*/	
		case "CSV":
				if (UVSRName)
					qrystr="funcName=" + replaceChar(escape(UVSRName),"+",String.fromCharCode(31));
				if (vFldValues)
					qrystr= qrystr + "&IP1=" + replaceChar(escape(vFldValues),"+",String.fromCharCode(31));
				if (vLinkName)
					qrystr= qrystr + "&IP2=" + replaceChar(escape(vLinkName),"+",String.fromCharCode(31));
				if (vThirdParam)
					qrystr= qrystr + "&IP3=" + replaceChar(escape(vThirdParam),"+",String.fromCharCode(31));

				hideErrLayer();
				document.location = applURL+"/jsp/app/genCSV.jsp?"+qrystr;

				return;
				break;
/*
	Code modifyed for Handling New Graph Types by ESC on [12April09]
*/
		case "GPH":
				var qrystr="first=Y&ESC=20&type=" + g_ancrObject.getAttribute("OGRAPHTYPE") +"&funcName=" + UVSRName 
				url = g_modalURL + qrystr
				var retrn_val = window.showModalDialog(url,window,"dialogWidth:"+(modalWindowWidth)+"px;dialogHeight:"+(modalWindowHeight)+"px;center:yes;help:0;maximize:1;resizable=1;status:0;border:thin;")				
				//window.open(url);
				hideErrLayer();
				return;
				break;
		case "CHART":
				var qrystr;		
				if(g_ancrObject.getAttribute("UVSUBR"))
					qrystr="&funcName=" + replaceChar(escape(g_ancrObject.getAttribute("UVSUBR")),"+",String.fromCharCode(31));
				if(g_ancrObject.getAttribute("OI1"))
					qrystr= qrystr + "&fldValues=" + replaceChar(escape(g_ancrObject.getAttribute("OI1")),"+",String.fromCharCode(31));	
				if(g_ancrObject.getAttribute("OI2"))
					qrystr= qrystr + "&linkName=" + replaceChar(escape(g_ancrObject.getAttribute("OI2")),"+",String.fromCharCode(31));	
				if(g_ancrObject.getAttribute("OI3"))
					qrystr= qrystr + "&thirdParam=" + replaceChar(escape(g_ancrObject.getAttribute("OI3")),"+",String.fromCharCode(31));	
				url = g_modalURL +"first=Y&ESC=40"+qrystr;
				var retrn_val = window.showModalDialog(url,window,"dialogWidth:"+(modalWindowWidth)+"px;dialogHeight:"+(modalWindowHeight)+"px;center:yes;help:0;maximize:1;resizable=1;status:0;border:thin;")				
				//window.open(url);
				hideErrLayer();
				return;
				break;
		case "LABEL":
			var qrystr;		
			if(g_ancrObject.getAttribute("UVSUBR"))
				qrystr="&funcName=" + replaceChar(escape(g_ancrObject.getAttribute("UVSUBR")),"+",String.fromCharCode(31));
			/*ESC 24Jan18 Logic added to handle label type in display form and input form*/
			if(g_ancrObject.getAttribute("OI1")){
					if(g_ancrObject.getAttribute("OI1")=='' || g_ancrObject.getAttribute("OI1")=='*'){
						qrystr= qrystr + "&fldValues=" +concatFieldValues(g_ancrObject.document);
					}else{
					qrystr= qrystr + "&fldValues=" + replaceChar(escape(g_ancrObject.getAttribute("OI1")),"+",String.fromCharCode(31));	
					}
			}else{			
				qrystr= qrystr + "&fldValues=" +concatFieldValues(g_ancrObject.ownerDocument);
			}
			/*ESC 24Jan18*/
			if(g_ancrObject.getAttribute("OI2"))
				qrystr= qrystr + "&linkName=" + replaceChar(escape(g_ancrObject.getAttribute("OI2")),"+",String.fromCharCode(31));	
			if(g_ancrObject.getAttribute("OI3"))
				qrystr= qrystr + "&thirdParam=" + replaceChar(escape(g_ancrObject.getAttribute("OI3")),"+",String.fromCharCode(31));	
			url = g_modalURL +"first=Y&ESC=53"+qrystr;
			var retrn_val = window.showModalDialog(url,window,"dialogWidth:"+(modalWindowWidth)+"px;dialogHeight:"+(modalWindowHeight)+"px;center:yes;help:0;maximize:1;resizable=1;status:0;border:thin;")				
			hideErrLayer();
			return;
				break;
		case "EMAIL":
				openoutlook(document.body.innerHTML,g_ancrObject);
				return;
				break;
		default:
	}

	if( window.name == "MODAL_IFRAME" && bFirst==false)	{
		qrystr= qrystr + "ESC=" + ESC;
	}else{
		qrystr= qrystr + "first=Y&ESC=" + ESC;
	}

	if (UVSRName)
		qrystr= qrystr + "&funcName=" + replaceChar(escape(UVSRName),"+",String.fromCharCode(31));
	if (vFldValues)
		qrystr= qrystr + "&fldValues=" + replaceChar(escape(vFldValues),"+",String.fromCharCode(31));
	if (vLinkName)
		qrystr= qrystr + "&linkName=" + replaceChar(escape(vLinkName),"+",String.fromCharCode(31));
	if (vThirdParam)
		qrystr= qrystr + "&thirdParam=" + replaceChar(escape(vThirdParam),"+",String.fromCharCode(31));
	if( modalTitle )
		qrystr= qrystr + "&modalTitle=" + replaceChar(escape(modalTitle),"+",String.fromCharCode(31));

	if( parent.name == 'MODALWINDOW' ){
		g_xp =parseInt( parent.dialogLeft)+30
		g_yp = parseInt( parent.dialogTop)+30
	}
	
	if(g_owait!=""){
		qrystr+="&owait=" & g_owait;
	}
	url=url + qrystr;

	windowcount++;

var retrn_val = showModalDialog(url,window,"dialogWidth:"+(modalWindowWidth)+"px;dialogHeight:"+(modalWindowHeight)+"px;center:yes;help:0;maximize:1;resizable=1;status:0;border:thin;dialogLeft:"+(g_xp)+"px;dialogTop:"+(g_yp)+"px;");

//var retrn_val = show_ModalDialog(url,modalTitle,modalWindowWidth,modalWindowHeight);
//openWindow(url,900,700);
	hideErrLayer();
	//For next and previous buttons
	if (retrn_val){
		while (retrn_val.indexOf("þ") != -1 ){
			var forMore = retrn_val.split("þ");
			var qrystr = "", url="";
			if( forMore[0] == 'more'){
				call_err(null,"","W");//For "please wait" message
				UVSRName = forMore[2];
				firstParam = forMore[3];
				vLinkName	 = forMore[4];
				vThirdParam = forMore[5];
				qrystr="funcName=" + UVSRName + "&fldValues=" + firstParam + "&linkName=" + vLinkName + "&thirdParam=" + vThirdParam + "&ESC=" + ESC
				url = g_gkURL + qrystr;
				var retrn_val = showModalDialog(url,window,"dialogWidth:'+(modalWindowWidth)+'px;center:yes;help:0;maximize:1;resizable=1;status:0;border:thin;dialogLeft:'+(g_xp)+'px;dialogTop:'+(g_yp)+'px;");
				hideErrLayer();//code added for "please wait" message
				//retrn_val = window.showModalDialog(url,"","center=0;maximize=1;help=0;resizable=1;border=thin;status=0")		
			}else
				break;	
		 } //end of while
	} // end of if..

	//end of the changes made ....
	switch (g_ancrObject.getAttribute("OMODALTYPE")){
		case "ORD":	// Ordinary Dialog
				break;
		case "RTN":	// Dialog selected value has to be placed in associated field
				if (retrn_val)		{
					if (!g_rtnctl.getAttribute("OPREVIOUSVALUE") ) {
						g_rtnctl.setAttribute("OPREVIOUSVALUE",((g_rtnctl.value=="")?"#":g_rtnctl.value));
					}
					g_rtnctl.value = retrn_val;					
					//g_rtnctl.focus();
					setTimeout(function() {$(g_rtnctl).focus();},0);
					}else{ // Clear the data only if user has entered a new value as requested by Suresh on 26March2013
					if (g_rtnctl.getAttribute("OPREVIOUSVALUE") ) {
						g_rtnctl.value = "";					
						//g_rtnctl.focus();
						setTimeout(function() {$(g_rtnctl).focus();},0);
					}
				}
				break
		case "CRT":	// Dialog selected value has to be submitted
				if (retrn_val){	
					if (!g_rtnctl.getAttribute("OPREVIOUSVALUE") ) {
						g_rtnctl.setAttribute("OPREVIOUSVALUE",((g_rtnctl.value=="")?"#":g_rtnctl.value));
					}
					g_rtnctl.value = retrn_val;
					formSubmit(g_ancrObject.form,"submit");
				}
				break
		case "FRM":	// Dialog selected values are to sumitted and call others form
				g_ancrObject.ownerDocument.forms[0].fldValues.value=retrn_val;
				g_ancrObject.ownerDocument.forms[0].linkName.value="submit";
				g_ancrObject.ownerDocument.forms[0].submit();
				return true;
		case "SUB4":
			/*
			//[30Oct17:ESC] Added code not to refersh the page if user closes the window.
				if (top.g_ESC=="1"){
					g_ancrObject.ownerDocument.forms[0].fldValues.value=concatFieldValues(g_ancrObject.ownerDocument);
					g_ancrObject.ownerDocument.forms[0].linkName.value="REFRESH";
					g_ancrObject.ownerDocument.forms[0].submit();
				}else{
					//[07Nov17:ESC] Added code set the focus to FAIL field if the user close or cancel.
					if (g_ancrObject.getAttribute("OFAIL")) getObjectReference(g_ancrObject.getAttribute("OFAIL")).focus();
				}
			[27Oct17:ESC] Reverted back on Randy confirmation*/
				g_ancrObject.ownerDocument.forms[0].fldValues.value=concatFieldValues(g_ancrObject.ownerDocument);
				g_ancrObject.ownerDocument.forms[0].linkName.value="REFRESH";
				g_ancrObject.ownerDocument.forms[0].submit();
				break;
		case "SUB2":
				//[23Dec11:ESC] Added code not to refersh the page if user closes the window.
				//[20Nov12:ESC] Reverted back on SNA confirmation
				//if (top.g_ESC=="1"){
					g_ancrObject.ownerDocument.forms[0].fldValues.value=concatFieldValues(g_ancrObject.ownerDocument);
					g_ancrObject.ownerDocument.forms[0].linkName.value="REFRESH";
					g_ancrObject.ownerDocument.forms[0].submit();
				//}
				break;
		case "SUB3":
				//retrn_val="INVOICE_NBRý112-01þCUSTOMER_NAMEýQUEEN CITY SUPPLIERS";
				if(retrn_val){					
					try {
						var xmlDoc = $.parseXML(retrn_val); //is valid XML
						fillXMLValues(retrn_val);
					} catch (err) {
						// was not XML
						fillDefaults(retrn_val);
					}					
				}
	}
	
	//24jan05 uncommented the following code
	/**/
	
//added code by senthil on 05mar05 for setting the focus on the next element after show dialog
	if(g_rtnctl) {		
		var tobj=GetObjectByTabIndex(g_rtnctl.tabIndex+1,document)
		if(tobj) {	
			if(!tobj.disabled){
				//tobj.focus();
				setTimeout(function() {$(tobj).focus();},0);
			}
		}		
	}
	windowcount--;

}  //End of show_Dialog() function


function MoveNextElement(obj){
		var sValue=obj.value;
		var crcheck = /\r/;
		if (crcheck.test(sValue)){
			var tobj=GetObjectByTabIndex(obj.tabIndex+1,document)
			if(tobj) {	
				if(!tobj.disabled){
					tobj.focus();
				}
			}
		}
}
/*
* MBM[18/oct/04] Created this function to avoid redundancy of code
*/
function getOTABINDEXValues(obj){
	var vFldValues="";
	if(!(obj) || !(obj.getAttribute("OTABINDEX")) || obj.getAttribute("OTABINDEX")=="") return vFldValues;

	//convert the comma delimited string into an array
	var st=obj.getAttribute("OTABINDEX").split(",");
	//get the first element reference to set focus
	g_rtnctl=getObjectReferenceWithTabindex(st[0]);
		
	//get the value of each element specified in OTABINDEX into a string separated by (254) 
	for(var j=0;j<st.length;j++){
		if(st[j]=="*"){
			if(vFldValues.length>0){
				vFldValues= vFldValues.substr(0,vFldValues.length-1);
			}
			//vFldValues += "ÿ" + concatFieldValues(obj.document) + "ÿ"
			vFldValues += "ÿ" + concatFieldValues(document) + "ÿ"
		}else if (!isNumber(st[j]))	{	 //if condition added for literals --BMM
			vFldValues +=st[j]+ "þ";
		}else{
			vFldValues += getObjectReferenceWithTabindex(st[j]).value + "þ";
		}
	}
	//remove the last separator
	if(vFldValues.length>0){
		vFldValues= vFldValues.substr(0,vFldValues.length-1);
	}
	return vFldValues;
}


////////////To resize the modal Dialog Window////////

function dialog_resize(){  //modified code from Chris on 4Apr02
    h=document.all.blockDiv.offsetHeight + 45
    w=document.all.blockDiv.offsetWidth+45

    var testHeight = (screen.height * .90);
    if(h > testHeight){
        h=testHeight;
    }
	testHeight = (screen.width * .95);
    if(w > testHeight){
        w=testHeight;
    }
    eval("window.dialogHeight='" +h+ "px'");
    eval("window.dialogWidth='" + w + "px'");
}

//To open a window with specified size and url.
function openWindow(file,w,h){
	var w=w;
	var h=h;
	if(! (g_sepWindow) ){
			eval("g_sepWindow=window.open(file,'g_sepWindow','toolbar=no resize=yes   menubar=no center=yes width=" + w + " height=" + h + "')");
	    g_sepWindow.moveTo(75,75)
		return true; 
	}
	g_sepWindow.close()
	eval(" g_sepWindow=window.open(file,'g_sepWindow','toolbar=no resize=yes menubar=no  center=yes width="+ w +" height="+h+"')");
	g_sepWindow.moveTo(75,75)
	return true;
}
function hideMenu(){
	g_cp.document.body.cols = "1,*"
}

function isActionAllowed(obj){
        /*if((obj.tagName == 'INPUT' && obj.type == 'button') || obj.tagName == 'A' || obj.type=="textarea"){
                return false;
        }*/
        //var divs=document.all.tags("div");
		var divs=document.getElementsByTagName("div")
        for(var i=0;i<divs.length;i++){
                if ((((divs[i].id).toUpperCase()).indexOf("SFL"))>=0){
                        if( divs[i].style.visibility=="visible"){
                                return false;
                        }
                }
        }
        return true;
}

//--------------------------------------------------------------
//Element Focus functions
//Author : Madhavi.N.
//--------------------------------------------------------------

function setFrameFocus(docObj){
  doc = docObj
  window.focus()
    outer: 
	for(var k=0; k < docObj.forms.length; k++)	{
		for(var i=0; i < docObj.forms[k].elements.length; i++)	{
		  if( !( docObj.forms[k].elements[i].disabled )  &&  docObj.forms[k].elements[i].type != 'hidden' &&  docObj.forms[k].elements[i].type != 'button')  {
			temp=docObj.forms[k].elements[i];
			while( true){
				if(temp.offsetParent.tagName =='BODY' || temp.offsetParent.tagName == 'DIV')
					break;
				else
					temp=temp.offsetParent;
			}
			if (temp.offsetParent.tagName == 'DIV')
			{
				if (temp.offsetParent.style.visibility=='visible')
				{
					docObj.forms[k].elements[i].focus();

					break outer;
				}
			}
			else{
					setFocus(docObj)
			}
		  }
		}
	}
}

 function findTab(c){
	/*Code to set focus on the tab for the provided element in JQUERY tab control*/
	var tabid=getParentObjByTag(c,"DIV").id;
	if (tabid!="blockDiv"){
			$('#tabview').easytabs('select', '#'+tabid);
	}
	c.focus();
}

function openExcel(c){
	window.top.showPanel("panelExcel",1);
	/*
	window.top.panelExcel.style.display="";
	window.top.YAHOO.wade.container.panelExcel.show();
*/
}

//------------------------------------------------------------
//functions for tooltip
var g_TooltipHandle;
var sTooltipHTML;
var ifrRef;

function showtooltip(obj,e){
	var oEvent=(e)?e:(window.event)?window.event:null;
	if (!obj){
		if (window.event){
			obj = oEvent.srcElement;
		}else{
			obj = oEvent.target;
		}
	}
	var msg=obj.getAttribute("otooltip");

   $('div.tooltipnew').remove();
   $('<div class="tooltipnew"><div class="cone"></div>'+msg+' </div>').appendTo('body');
   changeTooltipPosition(oEvent);  
}
function changeTooltipPosition(event) {
	var tooltipX = event.pageX - 8;
	var tooltipY = event.pageY + 4;
	if (tooltipX < 1 ){
		tooltipX=5;
	}
	$('div.tooltipnew').css({top: tooltipY, left: tooltipX});
}
function hidetooltip(){
	$('div.tooltipnew').remove();
}
//-----------------------------------------------------------
function filterModifiedData(docObj){
	/*
	*	Author: Bhanu Date:24/Apr/04
	*	Written for sending only modified data to universe
	*/
	var initialValues=docObj.forms[0].initFieldVals.value.split("þ");
	var finalValues=docObj.forms[0].fldValues.value.split("þ");
	var filteredData="";
	for(var i=0;i<finalValues.length;i++){
		if(initialValues[i]==finalValues[i]){
			filteredData+="³";
		}else{
			filteredData+=finalValues[i];
		}
		filteredData+="þ";
	}
	filteredData=filteredData.substring(0,filteredData.length-1);
	//alert(filteredData +"\n\n"+ docObj.forms[0].fldValues.value);	
	//Note: uncomment the following line if UV Subroutines are ready to accept only modified data
	//docObj.forms[0].fldValues.value=filteredData;
}

function altel(svalue,e){
  //get the event object
   // var oEvent = (window.event) ? window.event : evt;

	var oEvent=(e)?e:(window.event)?window.event:null;
    var nKeyCode =  oEvent.keyCode ? oEvent.keyCode :oEvent.which ? oEvent.which :  void 0;
	//var sChar = String.fromCharCode(window.event.keyCode).toUpperCase();
	var sChar = String.fromCharCode(nKeyCode).toUpperCase();

	var tobj;
	g_isF4Key=false;

	if(oEvent.charCode == null || oEvent.charCode == 0){ 
		//Added code for Handling F2 Key
        if (nKeyCode==113)
        {
			tobj=getObjectByID(svalue);
			if (tobj)
			{
				if (windowcount==1){
					var a=show_Dialog(tobj,oEvent);
				}
			}
			return false;
        }
	//Added code By ESC for Handling F4 Key on 19Dec07
	  if (nKeyCode==115)
        {
			tobj=getObjectByID(svalue);
			if (tobj)
			{
				g_isF4Key=true;
				if (windowcount==1){
					var a=show_Dialog(tobj,oEvent);
				}
			}
			return false;
       }
    }
	//Added code for Handling ALT L Key
	if (oEvent.altKey && sChar == 'L')
	{
		tobj=getObjectByID(svalue);
		if (tobj)
		{
				if (windowcount==1){
					var a=show_Dialog(tobj,oEvent);
				}
		}

	}
	return false;
}	
//Function for opening the Page Designer by ESC on 01Oct09
function openDesigner(objLink,sFlag){
	var url;
	if (sFlag=="I"){
		url = g_modalURL +"first=Y&ESC=51";
	}else{
		url = g_modalURL +"first=Y&ESC=52";
	}
//	eval("g_sepWindow=window.open(url)");
	var retrn_val = window.showModalDialog(url,window,"dialogWidth=950px;dialogHeight=600px;center=0;maximize=1;help=0;resizable=1;border=thin;status=0;")				
	if (retrn_val=="0"){
		objLink.document.forms[0].linkName.value="RESEQUENCE";
		objLink.document.forms[0].submit();
	}
}
//Function for Import Excel by ESC on 02Nov2011

function importExcel(objLink,e){
	event = e || window.event;
	if (!objLink){
		objLink = event.target;
	}
	if (document.getElementById(objLink.getAttribute("OTID"))==null){
		var sConfig=objLink.getAttribute("OPOS");
		var sFields=objLink.getAttribute("OI2");
		var sOI3=objLink.getAttribute("OI3");
		var sSub=objLink.getAttribute("UVSUBR");
		g_ancrObject=objLink; //Added by ESC on 15Feb2013
		var url=applURL+"/jsp/app/modal.jsp?ESC=50&type=F&config=&sub="+sSub+"&OI3="+sOI3+"&param2="+sFields;
		var retrn_val = window.showModalDialog(url,window,"dialogWidth=600px;dialogHeight=250px;center=1;maximize=1;help=0;resizable=1;border=thin;status=0;");
		document.forms[0].fldValues.value=concatFieldValues(document);
		document.forms[0].linkName.value="REFRESH";
		document.forms[0].submit();

	}else{
	//OI2,UVSUBR 
		var a_table=document.getElementById(objLink.getAttribute("OTID"));
		for(var i=a_table.rows.length-3;i>0;i--){
				a_table.deleteRow(i);
		}
		var sConfig=objLink.getAttribute("OPOS");
		var sFields=objLink.getAttribute("OI2");
		g_ancrObject=objLink;
		var url=applURL+"/jsp/app/modal.jsp?ESC=50&type=S&sub=&OI3=&config="+sConfig+"&param2="+sFields;
		var retrn_val = window.showModalDialog(url,window,"dialogWidth=600px;dialogHeight=500px;center=1;maximize=1;help=0;resizable=1;border=thin;status=0;")				
		if(retrn_val!=null){
			if (retrn_val!=""){
			var saRows=retrn_val.split(g_ch254);
			var saCol,a_row,a_col,sTemp="";
			for(var i=0;i<saRows.length;i++){
				saCol=saRows[i].split(g_ch253);
				a_row=a_table.insertRow(a_table.rows.length-1);
				for(var j=0;j<saCol.length;j++){
					a_col=a_row.insertCell(j);
					a_col.innerHTML=saCol[j];
				}
				a_col=a_row.insertCell(j);
				sTemp="<label onClick=\"newRec(this,'I',event)\" NAME='INSERT' class='links'>Insert</label>";
				sTemp=sTemp+"&nbsp;<label onClick=\"delRec(this,event)\" NAME='REMOVE' class='links'>Remove</label>";
				a_col.innerHTML=sTemp;
			}
		}
	}
}
}
function show_Exdoc(obj,evt){ 
	var event = evt || window.event;
	if (!obj){
		obj = event.target;
	}	
	var sURL=g_modalURL+"ESC=60";
	var winParam="dialogWidth=900px;dialogHeight=500px;center=0;maximize=1;help=0;resizable=1;border=thin;status=0;"
	sURL=sURL+"&subroutine="+obj.getAttribute("UVSUBR");
	sURL=sURL+"&OI1="+obj.getAttribute("OI1");
	sURL=sURL+"&OI2="+obj.getAttribute("OI2");
	sURL=sURL+"&OI3="+obj.getAttribute("OI3");
	var retrn_val = window.showModalDialog(sURL,window,winParam);				
}
function debugginfo(msg){
	var objDiv=document.getElementById("debuggdiv")
	if (!objDiv){
		objDiv.innerHTML=objDiv.innerHTML+"<br>"+msg;
	}		
}
function showWait(sFlag){
	if (window.top){
		if (window.top.showPanel){
			if (sFlag==0){
				window.top.showPanel("divWait",0);
			}else{
				window.top.showPanel("divWait",1);
			}
		}
	}
}
/*
function showWait(sFlag){
	if (top.g_IdleTime==null){
		var winopener = window.dialogArguments;
		if (winopener != null){
			while(winopener.top.g_IdleTime==null){
				winopener=winopener.dialogArguments;
			}
			if (sFlag==0){
				//winopener.window.top.showPanel("divWait",0);
			}else{
				//winopener.window.top.showPanel("divWait",1);
			}
		 }
	}else{
		if (sFlag==0){
			//window.top.showPanel("divWait",0);
		}else{
			//window.top.showPanel("divWait",1);
		}
	}
}*/