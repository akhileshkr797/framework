/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description	
* [--Change history--]
* Date:4Apr03
* Description:Added try-catch for multiple_sort() to handle script error
* [23Aug08:ESC] Added g_th_rowid and assigned the Rowindex of the cell to fix the multiple rows in the header section
*/

//--------------------------------------------------------------
//Array Sorting - Single
//Author : Jogi
//--------------------------------------------------------------
var g_colid; //array sorting
var g_th_object; //array sorting
var g_timeid;//array sorting - hourglass
var g_th_rowid="0";

function arr_sort(th_object,e){
	var g_th_object;
	var evt=(e)?e:(window.event)?window.event:null;

  /* if (document.getElementById("WAIT")){	   
		document.getElementById("WAIT").style.visibility = "visible";
		document.getElementById("WAIT").style.top = evt.clientY;
		document.getElementById("WAIT").style.left = evt.clientX;
	}*/
	if (!th_object){
		g_th_object=evt.target;
	}else{
		g_th_object = th_object
	}
//		g_timeid = setTimeout(sorting(g_th_object), 10);
	try{
		//g_timeid = window.setTimeout(sorting(g_th_object), 10);
		g_timeid = window.setTimeout(multisorting(g_th_object), 10);
		
	}catch(e){}
}

////////////////////////////////////////////////////////

function sorting(c)
{
/////function variables//////
colnum=c.cellIndex    // To find the cell index on which the user had clicked

var i=0;var k=1;var j=0
var row_wise_ele=new Array()
var no_of_rows= 0
var no_of_cols= 0
var sortby = colnum;

var table_object =getParentObjByTag(c,"TABLE");
var th_row_object =getParentObjByTag(c,"TR");
g_th_rowid=th_row_object.rowIndex;

//objects of a table
//var table_object = c.offsetParent

var table_head = table_object.tHead
var table_body = table_object.tBodies
var table_foot = table_object.tFoot
var no_of_cols = table_head.rows[g_th_rowid].cells.length

for (var k=0;k<table_body.length ;k++ )
{
	if (table_body[k].tagName == "TBODY")
	{

// finding out no. of columns and rows

	var no_of_rows = table_body[k].rows.length

/////creating an array////
	for(i=0; i<no_of_rows; i++)
	 {
	   row_wise_ele[i] = new Array();
	 }
////initialize array////
	for(i=0; i<no_of_rows; i++)
	{
	   for(j=0; j< no_of_cols; j++)
		 {
			row_wise_ele[i][j] = ""
		 }
	}

//// fill the array with the <tr> and <td> elements////
	for(i=0; i< no_of_rows; i++)
	{
	var col = no_of_cols
		for(j=0; j< no_of_cols ; j++)
		 {     
				row_wise_ele[i][j] = table_body[k].rows[i].cells[j].textContent

				if (table_body[k].rows[i].cells[j].getAttribute("OSORT"))
				{   
					row_wise_ele[i][col] = table_body[k].rows[i].cells[j].getAttribute("OSORT")
					col++
				}
		 }
	}	


	if (c.getAttribute("OSORT")=='Y')
	{
	 var col = 0
	 for (i=0;i<table_head.rows[g_th_rowid].cells.length;i++ )
		{
		if (c.cellIndex==table_head.rows[g_th_rowid].cells[i].cellIndex)
		  break;
		if (table_head.rows[g_th_rowid].cells[i].getAttribute("OSORT")=="Y") col++;
		}
	 colnum = no_of_cols + col
	}

//// display the array ////
	rearrange(colnum,row_wise_ele,row_wise_ele.length)

	if (sortby==g_colid)
		 row_wise_ele.reverse()
	 else 
		{
		 if (c.getAttribute("OSORT"))
		  {
		   if (isFloat(row_wise_ele[0][0]))
				row_wise_ele.sort(floatSortAsc)
			else
				row_wise_ele.sort(numericSortAsc)
		  }
		 else
		  row_wise_ele.sort()
		} 
	 
	 // g_colid = sortby 
	rearrange(colnum,row_wise_ele,row_wise_ele.length)

	for(i=0; i< no_of_rows; i++)
	{
	var col = no_of_cols
		for(j=0; j < no_of_cols; j++)
		{
			  table_body[k].rows[i].cells[j].innerHTML =row_wise_ele[i][j] 

				if (table_body[k].rows[i].cells[j].getAttribute("OSORT"))
				{
				  table_body[k].rows[i].cells[j].getAttribute("OSORT") = row_wise_ele[i][col]
				  col++
				}

			}
		 }
	  }	
	  row_wise_ele = new Array();
	}
g_colid = sortby 
clearTimeout(g_timeid);

if (document.all.WAIT && isVisible(document.all.WAIT))
	document.all.WAIT.style.visibility = "hidden"
}

//// this rearranges the array////

function rearrange(colnum, row_wise_ele, rows)
{
 var temp = ""
 var i

 for (i=0; i<rows; i++)
  {
  temp = row_wise_ele[i][colnum]
  row_wise_ele[i][colnum] = row_wise_ele[i][0]
  row_wise_ele[i][0] = temp
  }
  return 
}
////this sorts the numeric values////

function numericSortAsc( arg1 , arg2 )
{
	if( parseInt(arg1,10) > parseInt(arg2,10) )
		return 1;

	if( parseInt(arg1,10) < parseInt(arg2,10) )
		return -1;

	if( parseInt(arg1,10) == parseInt(arg2,10) )
		return 0;
}

function floatSortAsc( arg1 , arg2 )
{
	if( parseFloat(arg1,10) > parseFloat(arg2,10) )
		return 1;

	if( parseFloat(arg1,10) < parseFloat(arg2,10) )
		return -1;

	if( parseFloat(arg1,10) == parseFloat(arg2,10) )
		return 0;
}





////function to sort the table elements accordingly////

var colid;
var table_object, table_object_temp
var table_head
var table_body
var table_foot
var secs = new Array();
var eachTbody = new Array();
var t = 0;
var dataArr;
var osort,odatatype ;
var sortData ;
var noOfCells;

function multiple_sort(th_object,e){
	var c;
	var evt=(e)?e:(window.event)?window.event:null;
	/*
   if (document.getElementById("WAIT")){	   
		document.getElementById("WAIT").style.visibility = "visible";
		document.getElementById("WAIT").style.top = document.body.scrollTop+evt.clientY
		document.getElementById("WAIT").style.left = document.body.scrollLeft+evt.clientX
	}	*/
	if (!th_object){	
		c=evt.target;
	}else{
		c = th_object
	}
	try{
		timeid = window.setTimeout(multisorting(c), 10);
	}catch(e){}
}

function section(){
	this.id = 0;
	this.rows = new Array();
}
function multisorting(c){
 //try{
	colnum=c.cellIndex    // To find the cell index on which the user had clicked


	//table_object = c.parentNode.parentNode.parentNode //changed by SEN for freezing issue

	table_object =getParentObjByTag(c,"TABLE");
	table_head = table_object.tHead
	table_body = table_object.tBodies
	table_foot = table_object.tFoot

	var th_row_object =getParentObjByTag(c,"TR");
	g_th_rowid=th_row_object.rowIndex;

	if(table_object == table_object_temp && colnum == colid){
		for(i =0 ; i < table_body.length; i ++){
			if(table_body[i].tagName == "THEAD")
				continue;
			eachTbody[i].reverse();
			repaint(eachTbody[i], i)
			i++
		}
		if (document.all.WAIT && isVisible(document.all.WAIT))
			document.all.WAIT.style.visibility = "hidden"
		return;
		
	}
	colid = colnum
	table_object_temp = table_object
	var i=0;var k=1;var j=0
	var no_of_rows= 0
	var no_of_cols= 0
	var sortby = colnum;

//objects of a table

//sort data
//for multiple tbodies and tfoots.... uses multiple tables and keep thead for 2-n
//invisible. call Onclick event for respective column in consequtive theads.
try{
	for ( t = 0 ; t < table_body.length ; t++ ){
		if(table_body[t].tagName == "THEAD")
			continue;
		sortData = new Array();
		dataArr = new Array();
		var data = new Array(2);
		var sortfld;
		var secincr = -1;
		var id= -1;
	//get the value from header (OSORT = y/n)
		osort = false;
		odatatype = "X"
		if( table_head.rows[g_th_rowid].cells[sortby].getAttribute("OSORT") )    //!= "undefined"
			osort = table_head.rows[g_th_rowid].cells[sortby].getAttribute("OSORT").toUpperCase() == 'Y' ? true : false
		if( table_head.rows[g_th_rowid].cells[sortby].getAttribute("ODDT") )    //!= "undefined"
			odatatype = table_head.rows[g_th_rowid].cells[sortby].getAttribute("ODDT").toUpperCase()

		sortfld = sortby ; //get the cellno from header which is to be sorted
	//store data
		if (table_body[0].rows.length == 0){
			if (document.all.WAIT && isVisible(document.all.WAIT))
				document.all.WAIT.style.visibility = "hidden"
			return;
		}
		noOfCells = table_body[0].rows[0].cells.length

		for (i =0 ;i < table_body[t].rows.length ; i ++ )
		{
			//alert(table_body[t].rows[i].cells[0].textContent)
			
			if (  table_body[t].rows[i].cells[0].textContent  != " ")
			{
					id++;
					data = new Array();
					if( osort == true )
						data[0] = table_body[t].rows[i].cells[sortfld].getAttribute("OSORT");
					else
						data[0] = table_body[t].rows[i].cells[sortfld].textContent;
					data[1] = id;
					if (! isNaN(data))
						dataArr[id] = parseFloat(removeCommas(data) );
					else
					 	dataArr[id] = data;
						secincr++;
					r = 0;
					secs[secincr] = new section();
			}
			
			secs[secincr].rows[r] = new Array();
			secs[secincr].id = id;
			osortno =  table_body[t].rows[i].cells.length

			for (j=0 ; j <  table_body[t].rows[i].cells.length ; j ++  )
			{
				secs[secincr].rows[r][j] = table_body[t].rows[i].cells[j].innerHTML
				if( table_body[t].rows[i].cells[j].getAttribute("OSORT"))
					secs[secincr].rows[r][osortno++] =  table_body[t].rows[i].cells[j].getAttribute("OSORT")
			}
			r++;
			
		}



//sort depending on the type of value
		if( odatatype == "N" || odatatype == "F") {
	 		dataArr.sort(floatSortAsc)
		}
		else
			dataArr.sort();

		var k =0
		for (i=0;i<dataArr.length ;i++ )
		{
			for (j=0;j<secs.length ;j++ )
			{
				if (secs[j].id == dataArr[i][1])
				{
					sortData[k] = new section();
					sortData[k] = secs[j]

					k++;
					break;
				}
			}

		}

		eachTbody[t] = sortData;
		repaint(eachTbody[t], t)
	}
	}catch(e){}
        if (document.all.WAIT && isVisible(document.all.WAIT))
	        document.all.WAIT.style.visibility = "hidden"
 /*}catch(exception){
        if (document.all.WAIT)
                document.all.WAIT.style.visibility = "hidden";
        //alert("error");
 }*/


}


//delete rows from table and add new rows with data.
function repaint(sortData, t)
{
 	r= 0;
	var flag= true;
	for (i =0 ; i < sortData.length ;i++ )
	{
		if(!flag)	{
			bgcolor ="#FFFFFF";	flag = true;
		}
	    else {
			bgcolor ="#F0F0F8";	flag = false;
		}
		for (j=0; j < sortData[i].rows.length ;j++ )
		{
			pos =table_head.rows[g_th_rowid].cells.length
			for (k =0 ;k < noOfCells ;k++ )
			{
				if(table_head.rows[g_th_rowid].cells[k].getAttribute("OSORT") && j == 0)					 
					table_body[t].rows[r].cells[k].setAttribute("OSORT" ,sortData[i].rows[j][pos++],false); 
				table_body[t].rows[r].cells[k].innerHTML=sortData[i].rows[j][k]
			}
			r++
		}
	}

}

//--------------------------------------------------------------
//Array cascading
//Author :Srilatha
//--------------------------------------------------------------
function insertBtns( ){

	if(document.all.cascade == null )
		return;	
	else
		table = document.all.cascade

	if (table == null )
		return;

	tbodies = table.tBodies
	tbody = tbodies[0]; 
	  
	var i=0;
	var rowid= 0;
	 
	while(true){
		 
		if( i > tbody.rows.length-1 )
			break;
		row =   tbody.rows[i++]
		if(! row.id )
			continue;
		rowid = row.id
		temp = row.previousSibling;
		while( temp && ! temp.id)
			temp = temp.previousSibling

		prevrow = temp;
		nextrow = row.nextSibling

		if ( prevrow && rowid > prevrow.id)
			prevrow.cells[0].innerHTML = "<input type=button value='+' onclick=\"showRows(this)\">"
	 }  
 deleteSpaces(tbody);
}

function deleteSpaces(tbody){
	for(var i=0 ;i < tbody.rows.length ; i++)
		if(tbody.rows[i].cells[0].children.length >= 1 && tbody.rows[i].cells[0].children[0].type == 'button')
			showRows(tbody.rows[i].cells[0].children[0]);
 		
	for(var i=tbody.rows.length-1 ;i > 0 ; i--)
		if(tbody.rows[i].cells[0].children.length >= 1 && tbody.rows[i].cells[0].children[0].type == 'button')
			showRows(tbody.rows[i].cells[0].children[0]);
 		
}


function showRows(btn){

	row = btn.parentElement.parentElement
	parentrowid = row.id
	
	row = row.nextSibling
	while(!row.id)
		row = row.nextSibling
	rowid = row.id
	nextrowid = row.id
	if( btn.value == "+") {
		while(true){
			
			if( nextrowid !="" && nextrowid <= parentrowid ){
				break;
			}
			 
			if(rowid  == nextrowid ){
				row.style.visibility = "visible"
				row.style.position = "relative"
			}
			if(row.nextSibling == null )
				break;
			row = row.nextSibling
			nextrowid = row.id
			
		}
		btn.value="-"
	}else{
		while(true){
			if(nextrowid !="" && nextrowid <= parentrowid )
				break;
			
			if (row.children[0].children.length > 0 )
				row.children[0].children[0].value= "+" 
			
				row.style.visibility = "hidden"
				row.style.position = "absolute"
			if(row.nextSibling == null )
				break;
			row = row.nextSibling
			nextrowid = row.id
		}
		btn.value="+"
	}

}
