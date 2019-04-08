/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:
* [--Change history--]
*/

function changeAlignment(c,L){
	if (arguments.length == 1)	c.style.textAlign= "right";
	else c.style.textAlign= "left";
}

function isAllowed(c){
	av= c.OAV
	g_AVarray=av.split(g_listSep)
	for(var i=0; i < g_AVarray.length ; i++){
		if(c.value == g_AVarray[i]) {return true}
	}
	return false;
}

function isEmpty(c){
//Modified to handle multi select list box validation also by ESC on 01Feb2013
	var str="";
	if (c.type.toLowerCase()=="select-multiple"){
		for(var j =0; j <c.options.length; j++){
			if(c.options[j].selected)
				str = str + c.options[j].value + g_ch252;
		}
		str= str.substr(0,str.length-1);
	}else{
		str=c.value;
	}
	//c.value = trimString(c.value)   
	str=trimString(str);
	if (str == " "  || str == ""){
		g_VFlag=true 
		findTab(c);
		return true; 
	 }
	return false;
}
function convertString(str){
	var st="";
	var prevchar='';
	for(var i=0; i< str.length; i++){
		if (str.charAt(i)==prevchar) continue;
//Added (str.charCodeAt(i) == 46) to avoid "." to "_" by ESC on 04-Feb-2010

	    if (!( (str.charCodeAt(i) == 42) || (str.charCodeAt(i) == 46) || (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) || (str.charCodeAt(i) >=97 &&  str.charCodeAt(i) <= 122) || (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) )){
			if(st.charAt(st.length -1 )!='_') st += "_";
		}else
			st += str.charAt(i);
	}
	return st;
 }
 
 function toDot(str){
	var st="";
	var prevchar='';
	for(var i=0; i< str.length; i++){
		if (str.charAt(i)==prevchar) continue;
	    if (!( (str.charCodeAt(i) == 42) || (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) || (str.charCodeAt(i) >=97 &&  str.charCodeAt(i) <= 122) || (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) )){
			if(st.charAt(st.length -1 )!='.') st += ".";
		}else{
			st += str.charAt(i);
		}
	}
	return st;
 }


function isValidInput(str,charSet){
	for(var i=0; i< str.length; i++){
		for(j=0;j<charSet.length;j++)
			if (str.charAt(i)==charSet.charAt(j))
				return false;
		}
	return true;
}

/* this function is useful to set value & checked properties for radio buttons*/
function setRadioValue(obj,value){
	if(obj.type.toLowerCase()!="radio") return;
	var frm=obj.form;
	for(var j=0;j<frm.elements.length;j++){
		if(obj.type==frm.elements[j].type && obj.name == frm.elements[j].name){
			if(frm.elements[j].value.toLowerCase()==value.toLowerCase()){
				frm.elements[j].checked=true;
			}else{
				frm.elements[j].checked=false;
			}
		}
	}
}
/* this function is useful to set value & checked properties for checkbox*/
function setCheckboxValue(obj,value){
	if(obj.type.toLowerCase()!="checkbox") return;
	var frm=obj.form;
	for(var j=0;j<frm.elements.length;j++){
		if(obj.type==frm.elements[j].type && obj.name == frm.elements[j].name){
			frm.elements[j].checked=false;			
			for(var i=0;i<value.length;i++){
				if(frm.elements[j].value.toLowerCase()==value[i].toLowerCase()){
					frm.elements[j].checked=true;
					break;
				}
			}			
		}
	}
}
	
//--------------------------------------------------------------
//Numeric Functions
//Author : Vinay Ram
//--------------------------------------------------------------

function findNumber(str){
	var firstChar = str.charAt(0);
	if((firstChar == "-"))return false;
	oneDecimal = false;
	for (var i = 0; i < str.length; i++)  {
		var oneChar = str.charAt(i);
		if ((i == 0 && oneChar == "+")) {  continue;	}
		if (oneChar == "." && !oneDecimal && i != str.length-1) {
			oneDecimal = true;
			continue;
		}
		if(isNaN(parseInt(oneChar))) {	
			return false; 
		}
	}
	return true;
}

function isNumber(str){
	if(str.length ==0)return false;//added on 1Aug02
	for(var i=0; i< str.length; i++) {
		if( isNaN(parseInt(str.charAt(i))) )  { return false; }
	}
  return true;
}

function isInteger(str) {
	var ret = false;
	var firstChar = str.charAt(0);
	if((firstChar == "-") || ( firstChar == "+")) {  
		ret = isNumber(str.substring(1));  
	}else {  
		ret = isNumber(str);  
	}
	return ret;
}

function isFloat(str){
	oneDecimal = false;
	for (var i = 0; i < str.length; i++) {
		var oneChar = str.charAt(i);
		if ((i == 0 && oneChar == "-") || (i == 0 && oneChar == "+")) {  
			if(str.length ==1)return false;//added on 1Aug02
			continue;	
		}
		//if (oneChar == "." && !oneDecimal && i != str.length-1){ //commented by bhanu to accept "7."
		if (oneChar == "." && !oneDecimal){
			if(str.length ==1)return false;//added on 1Aug02
			oneDecimal = true;
			continue;
		}
		if(isNaN(parseInt(oneChar))) {	
			return false; 
		}
	}
	return true;
}
function addChars(retStr,str,n){
	for(var i=0;i < n; i++)
		retStr += str;
	return retStr;
}

function _round(dig) {
	// dig specifies how many digits
	// Invalid values default to 0.
	if ((dig<0) || (dig==null) || (isNaN(dig))) dig=0;
	var power = Math.pow(10,dig);
	var  tempStr = "" + Math.round(this.valueOf()*power)/power; //jul10th changed by Madhavi
	var index = tempStr.indexOf('.') ;
	
	if(index == -1){
		tempStr = addChars(tempStr,'.',1);
		tempStr = addChars(tempStr,'0',dig);
	}
	else{
		var n= tempStr.substring(index +1,tempStr.length).length;
		if(n < dig)
			tempStr = addChars(tempStr,'0',dig - n);
	}
	return tempStr;
	
	//return Math.round(this.valueOf()*power)/power;
}
String.prototype.round = _round 
//--------------------------------------------------------------
//Character/String Functions
//Author : Madhavi N.
//--------------------------------------------------------------

function trimString(str) {
	//if(str== "undefined" || str =="") return "";
	if(!(str) || str =="") return "";
	if( (str.charAt(0) != ' ') && (str.charAt(str.length-1) != ' ') ) { return str; }
	while( str.charAt(0)  == ' ' )
			str = '' + str.substring(1,str.length);
	while( str.charAt(str.length-1)  == ' ' )
			str = '' + str.substring(0,str.length-1);
	return str;
}

function convertCase(c){ 
	if(c.getAttribute("OCCR") == "L") c.value = c.value.toLowerCase();
	if(c.getAttribute("OCCR") == "U") c.value = c.value.toUpperCase();
	if(c.getAttribute("OCCR") == "T") c.value = TitleCase(c.value);
}

function isText(inputVal){
	var str = inputVal.value;
	var ch = '';
	for (var i = 0; i < str.length; i++) {
		ch = str.charAt(i);
		if ( (ch < 'a' || ch > 'z') && (ch < 'A' || ch > 'Z') )	{
			return false;	
		}
	}
	return true;
}

function checkPattern(c){
	var pc=c.OPC
	var PCarray=pc.split(g_listSep)
	for (var i=0; i < PCarray.length ; i++){
		pattern=new RegExp(PCarray[i])
		if(pattern.test(c.value)) return true
	}
	return false
}
//--------------------------------------------------------------
//Formula Computations
//Author : Bhanu Modali
//--------------------------------------------------------------
function computeformulae(obj){
	var formulae = obj.OCF.split("|")
	for(var i=0;i<formulae.length;i++)	{	
		compute(formulae[i],obj)
	}	
}

function compute(expression,obj){
	var frm = obj.form;
	var expressionArr = expression.split("=");
	var finalVal=expressionArr[0];
	var vformula=expressionArr[1];
	frm.elements[finalVal].value = evalExpression(vformula);
	if (frm.elements[finalVal].OCR)	{
		ocr = frm.elements[finalVal].OCR.charAt(2);
		frm.elements[finalVal].value=frm.elements[finalVal].value.round(ocr)
	}
}

function evalExpression(expr){
	var exprarr;
	exprarr=expr.split(";");
	var temparr=new Array();
	var cnt=0;
	var v1,v2,res,temp=null;
	for(var i=0;i<exprarr.length;i++){
		v1=null;v2=null;res=null;
		if (exprarr[i] == "*" || exprarr[i] == "/" || exprarr[i] == "+" || exprarr[i] == "-") {
			v2=temparr[--cnt];
			v1=temparr[--cnt];
			// start : code added by bhanu for issue #76 on 15Jan02
			switch (getDataType(v1)){
				case 0: v1=parseFloat(v1); break;
				case 1: v1=parseFloat(getDateValueOf(v1));//(new Date(v1)).valueOf();
				case 2: v1=0;
			}
			switch (getDataType(v2)){
				case 0: v2=parseFloat(v2); break;
				case 1: v2=parseFloat(getDateValueOf(v2));//(new Date(v2)).valueOf();
				case 2: v2=0;
			}
			// end : code added by bhanu for issue #76 on 15Jan02
			switch (exprarr[i])	{
				case "*":  res=v1 * v2;	break;
				case "/":  if (isNaN(v2)) v2=1;
					  res=v1 / v2;	break;
				case "+": if (isNaN(v1)) v1=0;
					  if (isNaN(v2)) v2=0;
					  res=v1 + v2;	break;
				case "-": if (isNaN(v1)) v1=0;
					  if (isNaN(v2)) v2=0;
					  res=v1 - v2;	break;
			}
			temparr[cnt++]=res;
		}else{
			temp=getObjectReference(exprarr[i]);
			//alert(temp.name + "\r\n" + temp.value);
			temparr[cnt++]=(exprarr[i].charAt(0)=='$') ? exprarr[i].substring(1,exprarr[i].length): removeCommas((temp!=null) ? temp.value : '');
		}
	}
	return (temparr[--cnt]);
}
//--------------------------------------------------------------
//Generic functions
//Author : Bhanu Modali & Jogi
//--------------------------------------------------------------
function getParentObjByTag(sobj,tag){
	if (sobj) {
		while(sobj.tagName.toUpperCase()!= tag){
			if (sobj.tagName.toUpperCase() == "HTML")
				break;
			sobj=sobj.parentElement
		}
		if (sobj.tagName.toUpperCase() == tag)
			return sobj;
    } 	   
}

function getChildObjByTag(sobj,tag)	{
	if (sobj){
		for(var i=0;i<sobj.children.length;i++){
			if (sobj.children[i].tagName.toUpperCase() == tag.toUpperCase()){
				sobj=sobj.children[i]
				break;
			}
		}
		if (sobj.tagName.toUpperCase() == tag)
			return sobj;
	} 	   
}

function getObjectByID(id){
	if (id!=null && id.length > 0 )
		return eval("document.all." + id)	 
}

function GetObjectByTabIndex(vtabindex,vdoc){
// this function checks all the elements, in all the forms of the given document for tabindex. 
//If element tabindex matches with the given tabindex then returns the element object ref.
	for(var i=0;i<vdoc.forms.length;i++){
		for(var j=0;j<vdoc.forms[i].elements.length;j++){
			if (vdoc.forms[i].elements[j].tabIndex == vtabindex){
				return (vdoc.forms[i].elements[j]);
			}
		}
	}
	return; 
 } 

function getObjectReference(objectName){
if (trimString(objectName)=="")return null;
	for(var i=0;i<document.forms.length;i++) {
		for(var j=0;j<document.forms[i].elements.length;j++) {
			if (document.forms[i].elements[j].name == objectName) {
					return (document.forms[i].elements[j]);
			}
		}
	}
	return null; 
}

function getObjectReferenceWithTabindex(objTabindex){
	for(var i=0;i<document.forms.length;i++) {
		for(var j=0;j<document.forms[i].elements.length;j++) {
			if (document.forms[i].elements[j].tabIndex == objTabindex) {
					return (document.forms[i].elements[j]);
			}
		}
	}
	return null; 
}

function checkDoubleQuotes(str){
	var j=0;
	if (trimString(str)!="")
	for (var i=0;i<str.length;i++)
		if (str.charAt(i)=='"')
			j++
	if (j>0)	//objReg = /\"/
		return false
	else
		return true 
}

function removeCommas( strValue ) {
  var objRegExp = /,/g; //search for commas globally
  return strValue.replace(objRegExp,'');
}
function addCommas( strValue ) {
  var objRegExp  = new RegExp('(-?[0-9]+)([0-9]{3})'); 
    while(objRegExp.test(strValue)) {
		strValue = strValue.replace(objRegExp, '$1,$2');
    }
  return strValue;
}

function openWord(f){
	var wdApp = new ActiveXObject("Word.Application");
	wdApp.WindowState=1;
	//wdApp.Documents.ReadOnly =true ;
	wdApp.visible=false;
	wdApp = new ActiveXObject("Word.Application");
	wdApp.visible=true;
	wdApp.Documents.Open('c:/sample.doc',true)
	//wdApp.Documents.SaveChanges =false;
}
function replaceTags(dataString, htmlTag,replaceStr, isUnary, all){
	var resString="",closeTag,pos1=0,pos2=-1;
	if (isUnary)
		closeTag=">";
	else
		closeTag="</" + htmlTag + ">";
	while((pos1=dataString.indexOf("<" + htmlTag,pos1))!=-1 ){
		resString += dataString.substring(pos2,pos1);
		resString +=replaceStr;
		pos2=dataString.indexOf(closeTag,pos1) + closeTag.length;
		pos1=pos2;
		if (!all) break;
	}
	resString+=dataString.substring(pos2,dataString.length-1);
	return resString;
}

function openoutlook(ancrObj,evt){
	if(!ancrObj){
		ancrObj = g_ancrObject;
	}	
	var mailTo="",mailSubject=""
	if (ancrObj.getAttribute("OTO"))   mailTo=ancrObj.getAttribute("OTO");
	if (ancrObj.getAttribute("OSUBJECT")) mailSubject=ancrObj.getAttribute("OSUBJECT");	
	$("#div_email").show();
	$("#mail_subject").val(mailSubject);
	$("#to_addr").val(mailTo);
	$("#mail_body").val($('body').innerHTML)
	$("#div_email").dialog("open");
}
function sendEmail(sFlag){
	var mailSubject = $("#mail_subject").val();
	var mailTo = $("#to_addr").val();
	var mailFrom = $("#from_addr").val();
	var panelwin="";
	if(sFlag=="M"){
		if (top.content.modalFrame.contentWindow){
			panelwin=top.content.modalFrame.contentWindow;	/*this is for mozilla*/			
		}else{
			panelwin=top.content.modalFrame;		 	/*ie*/
		}
	}else{
		if (top.content.rightpane.contentWindow){
			panelwin=top.content.rightpane.contentWindow;	/*this is for mozilla*/			
		}else{
			panelwin=top.content.rightpane;		 	/*ie*/
		}
	}
	var temp = panelwin.document.body.innerHTML;
	var strMsg=$(panelwin.document.body).clone().find("script,noscript,style,iframe,EMAILFILTER,input,ul,img,#err_msg").remove().end().html();
	pos1=strMsg.indexOf("<!--END-->");
	if (pos1>0){
		strMsg=strMsg.substring(0,pos1);
	}
	strMsg=strMsg.replace(/\n|\r/g, "");
	strMsg=strMsg.replace("textarea", "div");
	showWait(1)
	sURL=applURL+"/jsp/app/sendEmail.jsp";
	$.post(sURL,{email_from:mailFrom,email_to:mailTo,email_subject:mailSubject,email_body:strMsg},
	function(response,status){ // Required Callback Function
		showWait(0)
		alert(response);
	});
}
/*
function openPDF(objPDF){
	if (objPDF){
		 pdfParam=objPDF.getAttribute("OPDF");
	}else{
		pdfParam="P,9";
	}
	var panelwin="";
	if (top.content.rightpane.contentWindow){
		panelwin=top.content.rightpane.contentWindow;			
	}else{
		panelwin=top.content.rightpane;		 	
	}
	var temp = panelwin.document.body.innerHTML;
	var strMsg=$(panelwin.document.body).clone().find("script,noscript,style,iframe,EMAILFILTER,input,ul,img,#err_msg").remove().end().html();
	pos1=strMsg.indexOf("<!--END-->");
	if (pos1>0){
		strMsg=strMsg.substring(0,pos1);
	}
	strMsg=strMsg.replace(/\n|\r/g, "");
	strMsg=strMsg.replace("textarea", "div");
	sURL=applURL+"/jsp/app/genPDF.jsp";
	var inputs="<input type='hidden' id='pdf_body' name='pdf_body' value=''><input type='hidden' name='pdfParam' id='pdfParam' value='"+pdfParam+"'>"
	
	var oform=$('<form action="'+ sURL +'" method="post" id="frm_PDF">'+inputs+'</form>').appendTo('body');
	$('#pdf_body').val(strMsg);
	oform.submit().remove();
}	
*/
function formatEmailText(emailText){
	var temp = emailText.substring(0, emailText.indexOf("<FORM")) + emailText.substring(emailText.indexOf("</FORM>") + "</FORM>".length, emailText.length)
	if (temp==null ||  temp=="")	return emailText;
	return temp;
}


function filterTags(dataString, htmlTag, isUnary, all){
	htmlTags = htmlTag.split(" ");
	var resString="",closeTag,pos1=0,pos2=-1;
	if (isUnary)
		closeTag=">";
	else
		closeTag="</" + htmlTags[0] + ">";
	var temp=dataString.toUpperCase();//added by Bhanu
	while((pos1=temp.indexOf("<" + htmlTag,pos1))!=-1 ){
		resString += dataString.substring(pos2,pos1);
		pos2=dataString.indexOf(closeTag,pos1) + closeTag.length;
		pos1=pos2;
		if (!all) break;
	}
	resString+=dataString.substring(pos2,dataString.length-1);
	return resString;
}

//This function is added by bhanu on 7mar02 to rectify showlayer() problem
function getEnabledControl(formObj){
    var x;
	if(arguments.length == 1){
		for(var i=0; i < formObj.elements.length; i++){
			x=isFocussable(formObj.elements[i]);
            //if (x==undefined){
			if(g_status){
				return formObj.elements[i];
			}
			return;
        }
	}
	for(var k=0; k<document.forms.length; k++){
		for(var i=0; i<document.forms[k].elements.length; i++){
			  x=isFocussable(document.forms[k].elements[i]);
              //alert("2. Focussable element:" + x + "\n" + document.forms[k].elements[i].name);
			  //if(x==undefined){
	          if (g_status){
					return document.forms[k].elements[i];
			  }
		}
	}
    return;
}

//This function is added by bhanu on 7mar02 to rectify showlayer() problem
var g_status=false;
function isFocussable(obj){
        //if (!obj || obj==undefined)
		if (!obj || obj==null){
				g_status=true;
               return true;
		}
        //alert("current Element :" + obj.tagName + "\nName:" + obj.name + "\nDisabled:" + obj.disabled + "\nVisibility:" + obj.style.visibility);
        if (obj.disabled || (obj.style && obj.style.visibility=='hidden') || obj.type=='hidden' || obj.type=='button'){
				g_status=false;
                return false;
		}
        else
                isFocussable(obj.parentNode);
}

//added on 9th october
function getDataType(anyValue){
	if(!isNaN(anyValue))
		return 0;
	else if(new Date(anyValue).valueOf())
		return 1;
	else
		return 2;
}

function replaceChar(str,char1,char2){
	if(!str)return str;
	var arraychar = new Array(str.length)

	if(str=="")return "";
	for(var i=0;i<arraychar.length;i++){
		if(str.charAt(i) == char1)arraychar[i] =char2;
		else arraychar[i] =str.charAt(i);
	}
	str ="";
	for(var i=0; i<arraychar.length;i++)str +=arraychar[i];
	return str;
}

/*
*  Replaces substrings
*/
function replaceString(v_string, v_oldsubstring, v_newsubstring){
	var tempst="";
	while(v_string.indexOf(v_oldsubstring)>=0){
		tempst=v_string.substring(0,v_string.indexOf(v_oldsubstring));
		tempst+=v_newsubstring;
		v_string=tempst+v_string.substring(v_string.indexOf(v_oldsubstring)+v_oldsubstring.length,v_string.length);
	}
	return v_string;
}

function escapeStr(str){
	if(!str)return str;
	var newstr="";
	if(str=="")return "";
	for(var i=0;i<str.length;i++){
		if(str.charAt(i) == "+")newstr += "+";
		else newstr += escape(str.charAt(i));
	}
	return newstr;
}
//Range Check

function rangeCheckNum(c){
	ra= c.getAttribute("ORC");
	g_RAarray=ra.split(g_listSep)
	len=g_RAarray.length 
	var msg;
	if (c.getAttribute("OLABEL")){
		msg=c.getAttribute("OLABEL");
	}else{
		msg=c.getAttribute("NAME");
	}
	if(g_RAarray[0] == ""){
		if(c.value <= parseInt(g_RAarray[1])) return true;
		else msg+=" value must be less than or equal to " + g_RAarray[1];
	}else if(g_RAarray[1] == ""){
		if( c.value >= parseInt(g_RAarray[0]) ) return true;
		else msg+=" value must be greater than or equal to " + g_RAarray[0];
	}else{
		if(c.value >= parseInt(g_RAarray[0]) && c.value <= parseInt(g_RAarray[1])) return true;
		else msg+=" value must be between " + g_RAarray[0] + " and " + g_RAarray[1];
	}
//	if(len==3){
	call_err(c,msg);
	g_VFlag=true	
	assignOldValue(c);
//	}		
	return false; //changed from true to false by bhanu on 30apr02
}

function rangeCheckFloat(c){
	ra= c.getAttribute("ORC")
	g_RAarray=ra.split(g_listSep)
	len=g_RAarray.length 
	var msg;
	if (c.getAttribute("OLABEL")){
		msg=c.getAttribute("OLABEL");
	}else{
		msg=c.getAttribute("NAME");
	}
	if(g_RAarray[0] == ""){
		if(c.value <= parseFloat(g_RAarray[1]) ) return true;
		else msg+=" value must be less than or equal to " + g_RAarray[1];
	}else if(g_RAarray[1] == ""){
		if( c.value >= parseFloat(g_RAarray[0])) return true;
		else msg+=" value must be greater than or equal to " + g_RAarray[0];
	}else{
		if(c.value >= parseFloat(g_RAarray[0]) && c.value <= parseFloat(g_RAarray[1])) return true;
		else msg+=" value must be between " + g_RAarray[0] + " and " + g_RAarray[1];
	}
	call_err(c,msg);
	g_VFlag=true;	
	assignOldValue(c);
	//}			
	return false; //changed from true to false by bhanu on 30apr02
}
function getChart(xmlDataId,iHeight,iWidth,divId,chartId,swfID){
	var sTemp=document.getElementById(xmlDataId).textContent;
	if (!sTemp){
			xmlData = document.getElementById(xmlDataId).innerHTML;
	}else{
		xmlData= document.getElementById(xmlDataId).textContent;
	}
	/*
	FusionCharts.setCurrentRenderer('javascript');
			FusionCharts.debugMode.enabled(true);
			FusionCharts.debugMode.outputTo(function(){
				console.log(arguments);
			});*/
	var myChart = new FusionCharts( top.applURL+"/charts/"+swfID,chartId,iWidth,iHeight,false);

    myChart.setXMLData(xmlData);
	myChart.setTransparent(true);
    myChart.render(divId);   
	
}
function getGraph(xmlDataId,iHeight,iWidth,imageId){
		var xmlData;
		var sTemp=document.getElementById(xmlDataId).textContent;
		if (!sTemp){
				xmlData = document.getElementById(xmlDataId).innerHTML;
		}else{
			xmlData= document.getElementById(xmlDataId).textContent;
		}
/*		var canvas_id="div_"+imageId;
		$("#div_page_body").append($('<div>').attr({id: canvas_id}));
*/
		var canvas_id=imageId;

		var grap_type=$(xmlData).find('params').find('options[name=type]').attr('value');
		canvas_id=imageId;		
		drawGraph(canvas_id,xmlData,grap_type);
	/*
	var xmlData;	
	var sTemp=document.getElementById(xmlDataId).textContent;
		if (!sTemp){
				xmlData = "xmldata="+document.getElementById(xmlDataId).innerHTML;
		}else{
			xmlData= "xmldata="+document.getElementById(xmlDataId).textContent;
		}
		var sURL =top.applURL+"/jsp/app/graph-inline.jsp?height="+iHeight+"&width="+iWidth;
		var sImagePath="";
		var test=$.ajax({
			url : sURL,
			type: "POST", 
			processData: false,
			data: xmlData,
			success : function (data) {
				saTemp=new String(data).split("@~@");
				sImagePath=saTemp[1];
			},
			async:false 
		}).responseText;

	if (sImagePath!=""){
		document.getElementById(imageId).src=sImagePath;
	}*/
}// End of function get Graph