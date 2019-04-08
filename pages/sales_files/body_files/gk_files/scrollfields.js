/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description		:
* @version history	:Changes made for afterprompt
* Date: 29apr03
* Description: Changes made for scroll field totals(in  the function getFormat)
* [16jun05]: Added function getOGridFldValue() to handle grid field data for after prompt calls
* [18Apr06]: Added code to solve the focus issue because of disabled elements
* [19Jan09:ESC] Function setNewLine() added to handle CR in scroll fileds.
* [10May18:ESC] Added logic to postion the L type scroll filed dive below the element clicked
*/

//For scroll fields (type - "L") - Jogi
var g_table,g_rowIndex = 0;
var g_form, g_obj;
var g_decide=false;
var g_fieldVals="";
var g_new_edit ="";

//var g_updateflag=false;
//--------------------------------------------------------------
//Scroll Fields - P Type
//Author : Bhanu Modali
//--------------------------------------------------------------
document.onclick=sf_docClick

var nn=(document.layers)?true:false;
//if(nn) document.captureEvents(Event.CLICK);

var g_sf_form;
var g_sf_table;
var g_sf_selRow;

function sf_docClick(e){
	var evt=(e)?e:(window.event)?window.event:null;
	if (window.event){
			var obj=evt.srcElement;
	}else{
		var obj=evt.target;
	}
	var fobj = getParentObjByTag(obj,"FORM");
	if (fobj && obj.tagName=="TD" && fobj && fobj.getAttribute("OTID"))
	{
		init_sf(obj);		
		if (!allowAction(g_sf_selRow,"E")){
			return;
		}
		if (g_sf_form.getAttribute("OSCROLLTYPE").toUpperCase() == "P")
			editRec(obj);
		else if(g_sf_form.getAttribute("OSCROLLTYPE").toUpperCase() == "L")
			openLayer(obj);
	}
}

function init_sf(obj){
		g_sf_selRow=getParentObjByTag(obj,"TR");
		g_sf_table=getParentObjByTag(obj,"TABLE");
		g_sf_form=getParentObjByTag(obj,"FORM");
		g_form=getParentObjByTag(obj,"FORM"); //line added by chris 23apr02
}

//code for insert-after DONOT DELETE THIS CODE
function insertAfter(insObj){
	init_sf(insObj);
	if (!allowAction(g_sf_selRow,"A")){
		return;
	}

	if (!validateRow(g_sf_table,g_sf_form))
		return;	
	var sTemp;
	newrow=g_sf_table.insertRow(g_sf_selRow.rowIndex+1);	//create a new row
	for(var cpos=0;cpos<g_sf_table.rows[g_sf_selRow.rowIndex].cells.length;cpos++)//create cells in the new row
		{
			newcell=g_sf_table.rows[g_sf_selRow.rowIndex+1].insertCell(cpos);
			if (cpos==g_sf_table.rows[g_sf_selRow.rowIndex].cells.length-1){
				sTemp=" <label onClick=\"newRec(this,'I')\" NAME='INSERT' class='links'>Insert</label>";
				sTemp+="&nbsp;<label onClick=\"delRec(this)\" NAME='REMOVE' class='links'>Remove</label>";
				newcell.innerHTML=sTemp;
				newcell.align="center";
			}else{
				newcell.innerHTML="";	
				newcell.align="left";
			}
		}
	moveElements(getEditRow(g_sf_table).rowIndex,g_sf_selRow.rowIndex+1,g_sf_table,g_sf_form); //move elements
	deleteEmptyRows(g_sf_table);
	calTot(g_sf_table); //calculate totals
}


/*code for insert-before DONOT DELETE THIS CODE*/
function insertBefore(insObj){
	init_sf(insObj);
	if (!allowAction(g_sf_selRow,"I")){
		return;
	}
	if (!validateRow(g_sf_table,g_sf_form))
		return;	

	newrow=g_sf_table.insertRow(g_sf_selRow.rowIndex);	//create a new row
	for(var cpos=0;cpos<g_sf_table.rows[g_sf_selRow.rowIndex].cells.length;cpos++){//create cells in the new row		
		newcell=g_sf_table.rows[g_sf_selRow.rowIndex-1].insertCell(cpos);
		if (cpos==g_sf_table.rows[g_sf_selRow.rowIndex].cells.length-1){ 
			sTemp=" <label onClick=\"newRec(this,'I')\" NAME='INSERT' class='links'>Insert</label>";
			sTemp+="&nbsp;<label onClick=\"delRec(this)\" NAME='REMOVE' class='links'>Remove</label>";
			newcell.innerHTML=sTemp;
			newcell.align="center";

		}else{
			newcell.innerHTML="";	
			newcell.align="left";
		}
	}
	moveElements(getEditRow(g_sf_table).rowIndex,g_sf_selRow.rowIndex-1,g_sf_table,g_sf_form); //move elements
	deleteEmptyRows(g_sf_table);
	calTot(g_sf_table); //calculate totals
}

function editRec(obj){
	if(g_sf_selRow.rowIndex==0){ // if row is heading row donot delete //BMM 6mar05
		return false;
	}

	if(g_sf_table.rows.length-1==g_sf_selRow.rowIndex)//if totals row then do not delete the row
		return false;

	if (!validateRow(g_sf_table,g_sf_form))
		return;	

	//move elements
	moveElements(getEditRow(g_sf_table).rowIndex,g_sf_selRow.rowIndex,g_sf_table,g_sf_form);
	if(obj.children[0] && !obj.children[0].disabled && obj.children[0].style.visibility !="hidden"){
		obj.children[0].focus();	
	}
	//obj.children[0].focus();
	deleteEmptyRows(g_sf_table);
	calTot(g_sf_table);
}


function delRec(obj,event){
	if (!obj){
		obj = event.target;
	}
	var rowControl="";
	var saTemp;
	init_sf(obj);
	if (!allowAction(g_sf_selRow,"D")){
		return;
	}
	if (g_form.getAttribute("OSCROLLTYPE")) { 
		if (g_form.getAttribute("OSCROLLTYPE").toUpperCase() == "P"){
			PdelRec(obj);
		}else if(g_form.getAttribute("OSCROLLTYPE").toUpperCase() == "L"){
			LdelRec(g_sf_table,g_sf_selRow.rowIndex);
			
		}
	}  	
}

function LdelRec(Atable,Arowindex ){
	if (Atable && Arowindex >= 1   && Atable.rows.length >2) {
			   Atable.deleteRow(Arowindex);
	}else {
		   sweetAlert("","Sorry!......  can't delete the last record","error");
	}
}
//function delRec(obj) {
function PdelRec(obj) {
	var bFlag=true;
	
	//Check if any input elements, if so do not delete the row
	if(g_sf_selRow.rowIndex==g_sf_table.rows.length-1){//if totals row(last row) then do not delete the row
		return false;
	}else if (getEditRow(g_sf_table).rowIndex==g_sf_selRow.rowIndex){
		if (g_sf_table.rows.length==3){
			clearRow(g_sf_form);
			calTot(g_sf_table);
			return false;
		}else {
			if (g_sf_selRow.rowIndex < g_sf_table.rows.length - 2  ){			
				moveElements(g_sf_selRow.rowIndex,g_sf_selRow.rowIndex+1,g_sf_table,g_sf_form);				
			}else {
				//moveElements(g_sf_selRow.rowIndex,g_sf_selRow.rowIndex- 1,g_sf_table,g_sf_form);
				for (i=g_sf_selRow.rowIndex-1 ;i>0; i-- ){
					if (allowAction(g_sf_table.rows[i],"E")){						
						moveElements(g_sf_selRow.rowIndex,i,g_sf_table,g_sf_form);
						bFlag=false;
						break;
					}
				}
				if (bFlag){
					newrow=g_sf_table.insertRow(g_sf_table.rows.length - 1 );	//create a new row
					for(var cpos=0;cpos<g_sf_table.rows[g_sf_selRow.rowIndex].cells.length;cpos++){	
						newcell=newrow.insertCell(cpos);			
						if (cpos==g_sf_table.rows[g_sf_selRow.rowIndex].cells.length-1){
							sTemp="<INPUT TYPE=button NAME='APPEND' VALUE='A' onClick=\"newRec(this,'A')\" STYLE='width:18;Height:20'>";
							sTemp+="&nbsp;<label onClick=\"newRec(this,'I')\" NAME='INSERT' class='links'>Insert</label>";
							sTemp+="&nbsp;<label onClick=\"delRec(this)\" NAME='REMOVE' class='links'>Remove</label>";
							newcell.innerHTML=sTemp;
						}else{
							newcell.innerHTML="";	
						}
					}
					moveElements(g_sf_selRow.rowIndex,newrow.rowIndex,g_sf_table,g_sf_form);
				}
			}
		}
	}
	g_sf_table.deleteRow(g_sf_selRow.rowIndex);
	calTot(g_sf_table);
	return true;
}

function validateRow(a_table,a_form){
	//if primary field is null, return true
	if( (firstElement(a_form) && (firstElement(a_form)).getAttribute("REQ") && (firstElement(a_form)).value=="") && a_table.rows.length <4 ){
		call_err(firstElement(a_form),"Entry for " + firstElement(a_form).name + " is Mandatory!!!","A");
		return false;
	}

	if(!isEmptyRows(a_table))	{	
		if ((firstElement(a_form)).value=="")		{
			g_focusFlag=true;
			call_err(firstElement(a_form),(firstElement(a_form)).name + " Cannot be empty!","A");
			g_formElement=firstElement(a_form)
			return false;	
		}else	{
			for(i=0;i<a_form.elements.length;i++){
				switch (a_form.elements[i].type){
					case "password":
					case "select-one":
					case "textarea":
					case "text":
						if (a_form.elements[i].getAttribute("REQ")=='Y' && a_form.elements[i].value==""){
							call_err(a_form.elements[i],"Value is required for " + a_form.elements[i].name,"A");
							findTab(a_form.elements[i]);
							a_form.elements[i].focus();	
							g_formElement=a_form.elements[i]
							return false;
						}
						if( a_form.elements[i].getAttribute("OVALIDATE") && a_form.elements[i].getAttribute("OSV") && a_form.elements[i].getAttribute("OSV")!=true && a_form.elements[i].getAttribute("OSV")!="true"){
							call_err(a_form.elements[i], a_form.elements[i].getAttribute("OSV"));				
							findTab(a_form.elements[i]);
							a_form.elements[i].focus();
							g_formElement=a_form.elements[i]
							return false;
						}
				}
			}
		}
	}

	//if duplicates found, return true
	if (isDuplicate(a_table,a_form)){
		return false;	
	}

	//check for required fields
	return true;
}

function moveElements(a_curr_row, a_new_row, a_table,a_form){
	if (a_curr_row==a_new_row)		return;

	//transfer the elements values into an array
	//move the new row values into the elements
	var pos=0
	var arrhtml=new Array()
	var arrval=new Array()
	var datatypes=new Array()
	var ouser=new Array()
	var temp=new Array()

$('.ocalendar').datepicker("destroy");

	for(i=0;i<a_form.elements.length;i++){
		//Added the following code to solve the focus issue because of disabled elements by ESN on 18Apr06
		//if (a_form.elements[i].disabled==true) a_form.elements[i].disabled=false
		if (!a_form.elements[i].getAttribute("ODSND") || a_form.elements[i].disabled){
			switch (a_form.elements[i].type){
				case "password":
				case "select-one":
				case "textarea":
				case "text":
					arrval[pos]=a_form.elements[i].value;
					temp[pos]=a_table.rows[a_new_row].cells[pos].innerHTML;
					if(a_form.elements[i].getAttribute("ODT")) datatypes[pos]=a_form.elements[i].getAttribute("ODT");
//Added code for field security by ESC on [16june09]
					if(a_form.elements[i].getAttribute("OUSER")){
						ouser[pos]=a_form.elements[i].getAttribute("OUSER");
					}else{
						ouser[pos]="";
					}
					pos++;
					break;
			}
		}
	}

	//transfer the elements in the new row
	//move the data from array to the current row
	for(i=0;i<a_table.rows[a_curr_row].cells.length-1;i++)	{
		a_table.rows[a_new_row].cells[i].innerHTML=a_table.rows[a_curr_row].cells[i].innerHTML
		var temp_str1=arrval[i];
		temp_str1=temp_str1.replace(/(?:\r\n|\r|\n)/g, '<br />');
		a_table.rows[a_curr_row].cells[i].innerHTML=temp_str1;
		if (datatypes[i]=='N' || datatypes[i]=='F') a_table.rows[a_curr_row].cells[i].align='right';
//Added code for field security by ESC on [16june09]
		if (ouser[i]!="") a_table.rows[a_curr_row].cells[i].setAttribute("OUSER",ouser[i]);
	}
pos=0;
	for(i=0;i<a_form.elements.length;i++){
			//Added the following code to solve the focus issue because of disabled elements by ESN on 18Apr06
			//if (a_form.elements[i].disabled==true) a_form.elements[i].disabled=false
			if (!a_form.elements[i].getAttribute("ODSND") || a_form.elements[i].disabled){
				switch (a_form.elements[i].type){
					case "password":
					case "select-one":
					case "textarea":
					case "text":
						var temp_str=temp[pos];
						temp_str=temp_str.replace(/<br>/g,"\n");
						a_form.elements[i].value=temp_str;
						pos++;
						break;
				}
			}
		}
	//the swapping process is completed
	//focus on the first element

	setDateField();
	firstElement(a_form).focus();
}

function getEditRow(a_table)
{
	for (var i=0;i<a_table.rows.length;i++)
			{
			if(a_table.rows[i].cells[0])
				st=a_table.rows[i].cells[0].innerHTML;
			st=st.toLowerCase();
			if((st.indexOf("input")>0)||(st.indexOf("select")>0)||(st.indexOf("textarea")>0)||(st.indexOf("textarea")>0))
				return a_table.rows[i];
			}
	return null;
}

function firstElement(a_form){
	for(i=0;i<a_form.elements.length;i++){
		switch (a_form.elements[i].type){
			case "password":
			case "select-one":
			case "textarea":
			case "text":
				return(a_form.elements[i]);
		}
	}
}

function clearRow(a_form){
	for(i=0;i<a_form.elements.length;i++){
		switch (a_form.elements[i].type){
			case "password":
			case "select-one":
			case "textarea":
			case "text":
				a_form.elements[i].value=""
		}
	}
}

function isEmptyRow(a_form){
	for(var i=0;i<a_form.elements.length;i++){
		switch (a_form.elements[i].type.toLowerCase()){
			case "password":
			case "select-one" :
			case "textarea":
			case "text":
				if (a_form.elements[i].value!="")
					return false;
			}
	}
	return true;
}

function isEmptyRows(a_table){
	for(var i=1;i<a_table.rows.length;i++){
		if(a_table.rows[i].cells[0].children && a_table.rows[i].cells[0].children.length>0)
			break;
	}
	var curRow =a_table.rows[i];
	for(var i=0;i<curRow.cells.length-1;i++)	{
		if(curRow.cells[i].children[0] && curRow.cells[i].children[0].value!="")
				return false;
	}
	return true;
}

function deleteEmptyRows(a_table){
	for(var i=0;i<a_table.rows.length;i++){
		if(a_table.rows[i].cells[0].innerHTML==""){
			a_table.deleteRow(i);
		}
	}
}

function calTot(tab){
	if (tab.getAttribute("OTC")){
		st=tab.getAttribute("OTC");
		var arr=st.split(",")
		var temp
		var vformat="";

		for(var i=0;i<arr.length;i++){
			vformat="";//code added on 22apr02
			var x=parseInt(arr[i])
			var tot=0
			for(rpos=1;rpos<tab.rows.length-1;rpos++){ 
				if(tab.rows[rpos].cells[x].children.length>0){
					//tab.rows[rpos].cells[x].children[0].value=removeCommas(tab.rows[rpos].cells[x].children[0].value);	
					if(!isNaN(parseFloat(removeCommas(tab.rows[rpos].cells[x].children[0].value))))	{
						//check the format of the input element and convert the total into same format
						if(tab.rows[rpos].cells[x].children[0].getAttribute("OCR"))
							vformat=tab.rows[rpos].cells[x].children[0].getAttribute("OCR")
						temp= parseFloat(removeCommas(tab.rows[rpos].cells[x].children[0].value))
						tot=tot + temp;
					}
				}else if(!isNaN(parseFloat(tab.rows[rpos].cells[x].innerHTML)))	{
						temp= parseFloat(removeCommas(tab.rows[rpos].cells[x].innerHTML));
						tot=tot + temp
					}
			}
			// for the converting the total format
			if (g_form.getAttribute("OSCROLLTYPE")=="L"){  //code added on 22apr02
				vformat=getFormat(g_form,x);				//code added on 22apr02

			}
			if (vformat!=""){
				//tot=formatNumber(tot,vformat)
				tot=("" + tot).round(vformat.charAt(2));
				//alert(vformat + "::Column :" + x + " Total is :" + tot);
			}
			tot1=addCommas(new String(tot))
			if(tab.rows[rpos].cells[x].children.length > 0) //changes made on 8oct01 
				tab.rows[rpos].cells[x].children[0].value=tot1;
			else
				tab.rows[rpos].cells[x].innerHTML=tot1;
			
		}
	}
}

//This function is to get format for scroll-fields-'L' type //code added on 22apr02
function getFormat(frm, colIndex){
	var i,cnt=0;
	for(i=0;i<frm.elements.length;i++){
		if((frm.elements[i].tagName == 'INPUT' && frm.elements[i].type == 'text' )|| frm.elements[i].type == 'select' || frm.elements[i].type == 'textarea' ||  frm.elements[i].type == 'password' ){
			//alert("cnt="+cnt + ",colIndex="+colIndex )
			if(frm.elements[i].getAttribute("OCR")){
				
				if (cnt==colIndex){
					return frm.elements[i].getAttribute("OCR");
				}
			}
			cnt++;	
		}
	}
	return "";
}

function isDuplicate(tab,frm){
	var found=false
	tcols=tab.rows[0].cells.length
	ele = frm.elements
	var cpos=0

	for(i=0;i<ele.length;i++)
	{
		switch (ele[i].type.toLowerCase())
			{
				case "password":
				case "select-one" :
				case "textarea":
				case "text":
					if (ele[i].ODUP=="N")
					{		
						for(j=1;j<tab.rows.length-1;j++)
						{
						   //do not check for the current row for duplication
							if (frm.getAttribute("OSCROLLTYPE").toUpperCase()=="L" && j==g_rowIndex)
								continue;
							//if (tab.rows[j].cells[cpos].innerHTML==ele[i].value)
                                                        if (tab.rows[j].cells[cpos].innerHTML==ele[i].value && ele[i].value!="")
							{
								found=true;
								call_err(ele[i],"Duplicate value " + ele[i].value + " is not allowed !","A");
								break;
							}
						}
					cpos++
					}
			}
	}
	return(found);
}


function isNullRec(tab,frm){
	for(i=0;i<frm.elements.length;i++){
	switch (frm.elements[i].type){
		case "password":
		case "select-one" :
		case "textarea":
		case "text":
		 	if (frm.elements[i].getAttribute("REQ")=="Y")
				if (frm.elements[i].value=="")				
					return (true)
		}
	}
}

//added on 12th september
function eleFocus(obj,event){
	if (!obj){
		obj = event.target;
	}
	calTot(obj);	//calculate totals
	if (obj.getAttribute("ODUP")=="N"){
		if(checkDup(obj)){
			obj.focus();
			return
		}
	}
	/*
	ESN on 28Dec2005 Code Not required for setting the focus in the new functionality
	-------code starts here  Added on Aug23rd 01 By madhavi to focus on Insert button
	var pTrObj = getParentObjByTag(obj,"TR");
	var pTdObj = getParentObjByTag(obj,"TD");
	// pTdObj.nextSibling.children[0].nodeName == 'SELECT'	
	
	if(( pTdObj.nextSibling.children[0].disabled   && pTdObj.nextSibling.cellIndex == pTrObj.cells.length -2) || pTdObj.nextSibling.cellIndex == pTrObj.cells.length -1){
		pTrObj.cells[pTrObj.cells.length -1].children[0].focus();
	}
	---------code ends here
	*/
}

function checkDup(obj){
	var found=false;
	var tab=obj;
	var tcell=obj;
	while(tcell.tagName!="TD")
		tcell=tcell.parentElement;
	tcellindex=tcell.cellIndex;
	while(tab.tagName!="TABLE")
		tab=tab.parentElement;
	for(rpos=1;rpos<tab.rows.length-1;rpos++){
		//if(tab.rows[rpos].cells[tcellindex].innerHTML==obj.value){
                  if(tab.rows[rpos].cells[tcellindex].innerHTML==obj.value && obj.value!=""){
				var st = obj.value + " is duplicated and already exists in line " + rpos;
				call_err(obj,st);
				return true
			}
		}
	return false;
}

function sfdata(frm){ //for scroll field concatenation
	var isnullrow=false
	var nullrow=0
	var security=false;
	var ouser="";
	var st=""
	//BA Change	tab=eval('document.all.'+frm.OTID)
	tab=document.getElementById(frm.getAttribute("OTID"));

	trows=tab.rows.length
	tcols=tab.rows[0].cells.length
	for(i=0;i<tab.rows.length;i++){
		isnullrow=false
		for(j=0;j<tab.rows[i].cells.length-1;j++){
			if (tab.rows[i].cells[j].innerHTML=="" ||  tab.rows[i].cells[j].innerHTML==""){
				isnullrow=true
				nullrow=i
			}else
				isrownull=false
		}
		if (isrownull)
			break;
	}
	for(cpos=0;cpos<tcols-1;cpos++){
		 //ignore collateral info. column
		if (tab.rows[0].cells[cpos].getAttribute("ODSND")){
			//alert(tab.rows[0].cells[cpos].innerHTML); 
			continue;
		}
		ouser="";
		security=false;
		for(rpos=1;rpos<tab.rows.length-1;rpos++){
			if (tab.rows[rpos].cells[cpos].children.length>0 && tab.rows[rpos].cells[cpos].children[0].value!=undefined){
				st=st + tab.rows[rpos].cells[cpos].children[0].value;
//Added code for field security by ESC on [16june09]
				if (tab.rows[rpos].cells[cpos].children[0].getAttribute("ODST")){
					if (tab.rows[rpos].cells[cpos].children[0].getAttribute("ODST")=="AR"){							
						if (tab.rows[rpos].cells[cpos].children[0].getAttribute("OUSER")){
							st=st+g_ch251+tab.rows[rpos].cells[cpos].children[0].getAttribute("OUSER");
						}
					}
				}
				st=st + g_ch253;
			}else{
				st=st + tab.rows[rpos].cells[cpos].innerHTML;
//Added code for field security by ESC on [16june09]
				if (tab.rows[rpos].cells[cpos].getAttribute("OUSER")){
					st=st+g_ch251+tab.rows[rpos].cells[cpos].getAttribute("OUSER");
				}
				st=st + g_ch253;
			}
			
		}
		if (st!="" && st.charAt(st.length-1)==g_ch253)
			st=st.substring(0,st.length-1);
			st= st + g_ch254;
		}
	st=st.replace(/<br>/g,"\n");
	st=st.substring(0,st.length-1)
	//st=encodeURIComponent(st);/*19Mar18 added the encoding logic to handle \n in query string*/
	return(st)
}

/*
	rule:
		cell-only that element value
		col-entire column
		row-entire row
*/
function getOGridFldValue(elemName,rule){
	//obj is the grid field reference
	var elem=getObjectReference(elemName);
	var vFldValues="";
	switch (rule){
		case "":	// single grid field value
				vFldValues=elem.value;
				break;
		case "C":
				init_sf(elem);
				//get column position
				var cpos=getParentObjByTag(elem,"TD").cellIndex;
				var tab=getParentObjByTag(elem,"TABLE");
				//get values for all the rows of this column
				for(var rpos=1;rpos<tab.rows.length-1;rpos++){
          if (rpos>1){
          	vFldValues+=g_ch253;
					}
					if(tab.rows[rpos].cells[cpos].children.length>0){
						vFldValues+=tab.rows[rpos].cells[cpos].children[0].value;
					}else{
						vFldValues+=tab.rows[rpos].cells[cpos].innerHTML;
					}
				}
				break;
		case "R":
				init_sf(elem);
				//get column position
				var tab=getParentObjByTag(elem,"TABLE");
				var tcols=tab.rows[0].cells.length
				var rpos=getParentObjByTag(elem,"TR").rowIndex;
				for(var cpos=0;cpos<tcols-1;cpos++){
					//ignore collateral info. column
					if (tab.rows[rpos].cells[cpos].ODSND){
					//alert(tab.rows[0].cells[cpos].innerHTML); 
						continue;
					}else{
            if (cpos>0){
            	vFldValues+=g_ch253;
		  			}
						if(tab.rows[rpos].cells[cpos].children.length>0){
							vFldValues+=tab.rows[rpos].cells[cpos].children[0].value;
						}else{
							vFldValues+=tab.rows[rpos].cells[cpos].innerHTML;
						}
					}
				}
				break;
		case "*": // All data in grid
				init_sf(elem);
				var tab=getParentObjByTag(elem,"TABLE");
				var tcols=tab.rows[0].cells.length
				
				for(var cpos=0;cpos<tcols-1;cpos++){
          if (cpos>0){
          	vFldValues+=g_ch253;
    			}
					for(var rpos=1;rpos<tab.rows.length-1;rpos++){
						//ignore collateral info. column
						if (tab.rows[rpos].cells[cpos].ODSND){
							continue;
						}else{
              if (rpos>1){
              	vFldValues+=g_ch252;
		    			}
							if(tab.rows[rpos].cells[cpos].children.length>0){
								vFldValues+=tab.rows[rpos].cells[cpos].children[0].value;
							}else{
								vFldValues+=tab.rows[rpos].cells[cpos].innerHTML;
							}
						}
					}
				}
				break;
		case "#": // row, column count
				init_sf(elem);
				var cpos=getParentObjByTag(elem,"TD").cellIndex;
				var rpos=getParentObjByTag(elem,"TR").rowIndex;
				vFldValues+=rpos+g_ch253;
			  vFldValues+=(cpos+1);
				break;
	}
	return vFldValues;
}


//--------------------------------------------------------------
//Scroll Fields - L Type
//Author :Jogeeswar Prasad
//--------------------------------------------------------------
//This function is to trap the mouse click event and make that record/row the editable
function openLayer(Aobj){
    var Lobj = Aobj  // event.srcElement
	//event.cancelBubble = true;

	// check the object clicked on whether it is cell or not
	if (Lobj && Lobj.tagName == "TD"){
		var rowObj = getParentObjByTag(Lobj,"TR")
		var tableObj =  rowObj.offsetParent  
        var formObj = getParentObjByTag(tableObj, "FORM")
		var hiddenDiv = getChildObjByTag(formObj,"DIV")
		var hiddenTable = getChildObjByTag(hiddenDiv, "TABLE")
		hiddenDiv.style.top=Lobj.offsetTop	//Code Added by ESC 10May18

		//set the global varible g_rowIndex and g_table for accessing in other functions
		if (rowObj.rowIndex == tableObj.rows.length-1)
			return;
		if (hiddenDiv && !(isVisible(hiddenDiv))){
			g_decide = false;
			g_rowIndex = rowObj.rowIndex
			g_table = tableObj
			g_div = hiddenDiv
			g_form = formObj
			rowObj.style.backgroundColor = "#ffbbb0"
			MoveDataToLayer(formObj,tableObj, g_rowIndex);	
			g_new_edit = "EDIT";
        }
    }
} //end of the function openLayer...

//moving data from the table to form fields.
function MoveDataToLayer(tfrm,Atable,Arowindex){
	var j=0
	g_fieldVals="";
	if (g_div){
		/*
		if (event.srcElement.tagName=="TD"){
			y = getPageScrollY();
			g_div.style.top = y;
		}*/
		g_div.style.border = "inset blue 2px"
		g_div.style.backgroundColor = "00ffff"
		showLayer(g_div)
	 }
	if (tfrm){
		for (var i=0;i<tfrm.elements.length;i++ ){
		    switch (tfrm.elements[i].type.toUpperCase()){
				case "PASSWORD":
				case "SELECT-ONE":
				case "TEXTAREA":
			    case "TEXT":
	   				if (j==0)
     					tfrm.elements[i].focus();
					var val = trimString(Atable.rows[Arowindex].cells[j].innerHTML)
				    g_fieldVals += val + "þ"
					var temp_str=val.replace(/<br>/g,"\n");
					tfrm.elements[i].value=temp_str;
					j++
			}
		}
	}
	g_fieldVals = g_fieldVals.substring(0,g_fieldVals.length-1);
}


function MoveDataFromLayer(tfrm,Atable,Arowindex) {
	var j=0
	for (var i=0;i<tfrm.elements.length;i++ ) {
		switch (tfrm.elements[i].type.toUpperCase()) {
		case "PASSWORD":
		case "TEXT":
		case "TEXTAREA":
      	case "SELECT-ONE":
			var	temp_str1=tfrm.elements[i].value;
 			temp_str1=temp_str1.replace(/(?:\r\n|\r|\n)/g, '<br />');	
			Atable.rows[Arowindex].cells[j].innerHTML = temp_str1;
			if (tfrm.elements[i].getAttribute("ODT") =='N' || tfrm.elements[i].getAttribute("ODT") =='F') 
				Atable.rows[Arowindex].cells[j].align = 'right';
//Added code for field security by ESC on [16june09]
			if (tfrm.elements[i].getAttribute("OUSER"))
				Atable.rows[Arowindex].cells[j].setAttribute("OUSER",tfrm.elements[i].getAttribute("OUSER"));
			j++;
			break;
		}
	}
}

function showNext() {	
	var bFlag=true;
	if (g_new_edit == "NEW"){
		change("SAVE")
		LnewRec(g_obj)
	}
	if (g_new_edit == "EDIT"){
	 	MoveDataFromLayer(g_form,g_table, g_rowIndex);		
		if (g_rowIndex+1<g_table.rows.length-1){
			for(i=g_rowIndex+1;i<g_table.rows.length-1;i++){
				if (allowAction(g_table.rows[i],"E")){
					 bFlag=false;
					 g_rowIndex=i-1;
					 break;
				}
			}
			if (bFlag){
				g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
				return;
			}
		}else{
			g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
			return;
		}
		/*
		if (g_rowIndex+1<g_table.rows.length-1){
			if (!allowAction(g_table.rows[g_rowIndex+1],"E")){
				g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
				return;
			}
		}else{
			g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
			return;
		}*/
		if (g_rowIndex >= (g_table.rows.length - 2))
			g_rowIndex = g_table.rows.length - 2 
		else
			g_rowIndex++;			
		g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0"
		
		window.scrollTo(10,g_table.rows[g_rowIndex].cells[0].offsetTop);
	    MoveDataToLayer(g_form,g_table, g_rowIndex);
	}
}


function showPrevious() {
	var bFlag=true;
	if (g_new_edit == "EDIT"){
	 	MoveDataFromLayer(g_form,g_table, g_rowIndex);	
		if (g_rowIndex-1>0){
			for(i=g_rowIndex-1;i>0;i--){				
				if (allowAction(g_table.rows[i],"E")){
					 bFlag=false;
					 g_rowIndex=i+1;
					 break;
				}
			}
			if (bFlag){
				g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
				return;
			}
		}else{
			g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0";
			return;
		}
		g_rowIndex--;
		if (g_rowIndex <= 1) g_rowIndex = 1	
	    MoveDataToLayer(g_form,g_table, g_rowIndex);
		g_table.rows[g_rowIndex].style.backgroundColor = "#ffbbb0"
	}
}

function change(Aname){
	if( g_focusFlag) {
		g_focusFlag=false
		if(g_formElement) {
			g_formElement.focus();
		}
		g_VFlag=false;
		return false;
	}
	document.all.err_msg.style.visibility="hidden";
	g_table.rows[g_rowIndex].style.backgroundColor = "";
	clearInterval(g_hand);	
	 switch (Aname.toUpperCase()) {
		 case "SAVE": 
			if (validateSingleForm(g_form)) {
          		if (isDuplicate(g_table,g_form)) return ;
				MoveDataFromLayer(g_form,g_table,g_rowIndex);
			    hideLayer(g_div); g_div=null;
				sfdata(g_form);
			}
			break;
		case "CANCEL":
			var lflag;
			if (anyChanges()){
				lflag = confirm("Changes will not be saved. Okay to Quit ?")
				if (!lflag)
				   return;		  
				if (!g_decide)
					hideLayer(g_div)
				else  {
					g_decide = false
					deleteRec(g_table,g_rowIndex); 
				}
			}else {
				if (!g_decide)
					hideLayer(g_div)
				else {
					g_decide = false
					deleteRec(g_table,g_rowIndex); 
				}
			}  	
		    break;
		case "DELETE":
			if (confirm("Are you sure you want to delete this record ?"))
				deleteRec(g_table,g_rowIndex);
			break;
		case "NEXT":			
			showNext(); break;
		case "PREV":			
			showPrevious();
			break;
	}
	calTot(g_table); //code added by bhanu 15jan02 for issue #77
	g_focusFlag=false;
}


//Check for the changes made after opening a record for editing.
function anyChanges(){
	var tempstr = "";
	var tfrm = g_form
	for (var i=0;i<tfrm.elements.length;i++ ){
		switch (tfrm.elements[i].type.toUpperCase()){
			case "PASSWORD":
			case "SELECT-ONE":
			case "TEXTAREA":		   
			case "TEXT":
				tempstr +=trimString(tfrm.elements[i].value) + "þ"
				break;
		}
	}
	tempstr = tempstr.substring(0,tempstr.length-1)
	if (trimString(g_fieldVals) == trimString(tempstr))
		return false;
	else
		return true;
}

// if user enter for a new record
function newRec(obj,sFlag){
	var rowControl="";
	var saTemp;
	
	if (obj) {	
		var fObj = getParentObjByTag(obj,"FORM")
		if (fObj && fObj.getAttribute("OSCROLLTYPE")) { 
			if (fObj.getAttribute("OSCROLLTYPE").toUpperCase() == "P"){
				if (sFlag=="A"){
					insertAfter(obj);
				}else{					
					insertBefore(obj);
				}
			}else if(fObj.getAttribute("OSCROLLTYPE").toUpperCase() == "L"){
				LnewRec(obj);
			}
        }  
	}
}

function allowAction(objRow,sAction){
	var rowControl="" 
	if (!objRow.getAttribute("OROWCONTROL")){
		return true;
	}else{
		rowControl=objRow.getAttribute("OROWCONTROL");
		if (rowControl.indexOf(sAction)>=0 || rowControl.indexOf("U")>=0){
			return true;
		}
	}
	return false;
}

//To Insert a new Record 
 function LnewRec(Aobj) {
	 var Lobj = Aobj;
  	 var LrowObj = getParentObjByTag(Lobj,"TR")
	 var LtableObj = getParentObjByTag(LrowObj,"TABLE")
	 var Lformobj = getParentObjByTag(LtableObj, "FORM")
	 var Ldiv = getChildObjByTag(Lformobj, "DIV")
	 g_new_edit = "NEW"; 
	 var sTemp;
	 //bmm commented on 6mar05 
	 g_obj = Aobj//added on 13th august

 //if the layer is open and the user tries to open another layer then don't allow him
    if (isVisible(Ldiv))
    return;

     g_table = LtableObj;
	 g_rowIndex = LrowObj.rowIndex; 
	 g_div = Ldiv
	 g_form = Lformobj


	 clear(Lformobj); 
	var Lrowindex = g_rowIndex  //code for insert-before         
    var  newrow=LtableObj.insertRow(Lrowindex)
	var temprowindex = Lrowindex

  // IF THE ROW IS THE FIRST ROW TO BE INSERTED
	if (temprowindex == 1)
		 temprowindex = 2;
    else
	     temprowindex = 1;

	// create cells in the new row
		for(var cpos=0; cpos < LtableObj.rows[temprowindex].cells.length; cpos++){
			var newcell=LtableObj.rows[newrow.rowIndex].insertCell(cpos)
			if (cpos==LtableObj.rows[temprowindex].cells.length-1){
				//newcell.innerHTML=LtableObj.rows[temprowindex].cells[cpos].innerHTML 
				sTemp="<label onClick=\"newRec(this,'I')\" NAME='INSERT' class='links'>Insert</label>";
				sTemp+="&nbsp;<label onClick=\"delRec(this)\" NAME='REMOVE' class='links'>Remove</label>";
				newcell.innerHTML=sTemp;
				newcell.align="center";
			}else{
				newcell.innerHTML=" ";
			}
		}
     g_decide = true;

	 MoveDataToLayer(Lformobj,LtableObj, g_rowIndex);

	 calTot(g_table);
 }

// to clear a form object...
function clear(frmobj){
	for (var i=0;i<frmobj.elements.length;i++ ){
		if (frmobj.elements[i].type.toLowerCase() == "text" || frmobj.elements[i].type.toLowerCase() == "textarea" || frmobj.elements[i].type.toLowerCase() == "password")
	      frmobj.elements[i].value = "";
		  frmobj.elements[i].OPREVIOUSVALUE = ""; //added by bhanu on 29apr02
    }
}

///////////////////////////////////////TO DELETE A RECORD FROM THE TABLE///////////////////
//To Delete a row/record from the scrollfield when the user clicks on delete image.
function deleteRec(Atable,Arowindex) {	
//See that the table has atleast one row in it.. don't allow the user to remove all the rows.
	if (Atable && Arowindex >= 1   && Atable.rows.length >2) {
	   Atable.deleteRow(Arowindex)
       hideLayer(g_div)	 ; 	 g_div=null;
    }else {
	   sweetAlert("","Sorry!......  can't delete the last record","error")
	   hideLayer(g_div)	; 	 g_div=null;
	}
	calTot(Atable)	
 } //end of delete record

//Function  setNewLine() added to handle CR in scroll fileds by ESC 19Jan09
function setNewLine(c){
	objForm=getParentObjByTag(c,"FORM");
	if(objForm.getAttribute("OSCROLLTYPE")=="P"){
		for(var j=0;j<objForm.elements.length;j++){
		if (objForm.elements[j].tabIndex == c.tabIndex && objForm.elements[j].type=="button"){
				newRec(objForm.elements[j],"I");
			}
		}
		firstElement(objForm).focus();
	}else{
		change("next");
	}
}

/*
function validateScrollFields(a_form){
	var a_table=a_form.getChildObjectByTag("table");
	for(i=0;i<a_table.rows.length;i++){
		for(j=0;j<a_table.rows[i].cells.length-1;j++){
			if(a_table.rows[i].cells[j].OSV && a_table.rows[i].cells[j].OSV!=true ){
				moveElements(getEditRow(a_table).rowIndex,a_table.rows[i].rowIndex-1,a_table,a_form); //move elements
				call_err(,a_table.rows[i].cells[j].OSV);
				return false;
			}
		}
	}
	return true;
}*/