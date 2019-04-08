/*
* @version	1.0	
* @date		31-DEC-18
* @author	Senthil E
* @description	
* @version history	:
* function isDate(d)
* function getDaysInMonth(month,year)
* function isLeapYear(Year)
* function getNWorkingDays( n )
* function getNCalendarDays( n )
* function getTodaysDate()
* function formatDate( dt )
* function convertDate(dat)
* function rangeCheckDate(c)
* function getFullDate(dt)
*
* [Limitations]
Currently "--n" is treated as subtracting 'n' calendar days instead of 'n'working days
*/
//--------------------------------------------------------------
//Date Functions
//Author :Bhanu
//--------------------------------------------------------------

var g_monthsLookup = {
					"1" : 'January',"2" :'February', "3" : 'March',"4" :'April',"5" : 'May',"6" : 'June',
					"7":'July',"8" :'August',"9":'September',"10" :'October',"11":'November',"12":'December'
				   }

var g_daysLookup = {"Mon":'Monday',"Tue":'Tuesday',"Wed":'Wednesday',"Thu":'Thursday',
					"Fri":'Friday',"Sat":'Saturday',"Sun":'Sunday'
				   }
var g_sep = '/'; //used in date functions

function isDate(d){
    ret 	= true;
    dt 		= new String(d.value);
    var dtArr ;
    if( (dt.charAt(0) == '+') && (dt.charAt(1) == '+')) {
		if( dt.length == 2 )
			dt = dt + "1";
		else if( !isNumber(dt.substring(2)) )
			return false;
		d.value = formatDate(getNWorkingDays(dt.substring(2)));
		return true;
    }else if(dt.charAt(0) == '+'){
		if( dt.length == 1 )
			dt = dt + "1";
		else if( !isNumber(dt.substring(1)) )
			return false;
		d.value = formatDate(getNCalendarDays(dt.substring(0))) 
		return true;
    }else if( (dt.charAt(0) == '-') && (dt.charAt(1) == '-')){
		if( dt.length == 2 )
			dt = dt + "1";
		else if( !isNumber(dt.substring(2)) )
			return false;
		d.value = formatDate(getNWorkingDays(dt.substring(1)));
		return true;
    }else if(dt.charAt(0) == '-'){
		if( dt.length == 1 )
			dt = dt + "1";
		else if( !isNumber(dt.substring(1)) )
			 return false;
		d.value = formatDate(getNCalendarDays(dt.substring(0)));
		return true;
    }else if( ((dt.length == 1) && (dt.toUpperCase().charAt(0) == 'T')) || (dt.toUpperCase() == 'TODAY')){
		d.value = formatDate(getTodaysDate());
		return true;
    }else{
		dt = convertDate(d.value);
		if(dt == "INVALID")
			return false;
		dtArr = new Array();
		dtArr = dt.split(g_sep);
    }
    dayStr=dtArr[0];
    if( !isNumber(dayStr)){
		return false;
    }
    day = dayStr; //parseInt(dayStr,10) - by jogi on july 10 for two digit day;
    mthStr    = dtArr[1];
    if( !isNumber(mthStr)){
		return false;
    }
	mth	= mthStr;//parseInt(mthStr,10) - by jogi on july 10 for two digit day;
    if( (mth < 1) || (mth > 12)){
        return false;
    }
    yearStr = dtArr[2];
    if( !((yearStr.length == 2) || (yearStr.length == 4)) ){
		return false;
    }else if( !isNumber(yearStr) ){
		return false;
    }
    year = parseInt(yearStr,10);
    if( (year >= 0) && (year < 70) ){
		year = year + 2000;
    }else if((year >= 70) && (year < 100) ){
		year = year + 1900;
    }else if((year >= 1900) && (year < 2100) ){
		year = year;
    }else{
		return false;
    }

	daysInAMth = getDaysInMonth(mth,year);
    if( (day < 1) || (day > daysInAMth) ) {
		return false;
    }
	year1=new String(year)
	if(d.getAttribute("OCR")){
		ocr=d.getAttribute("OCR");
		//ocr="D4-"
		var objRegExp = /(^D+)(\d+)(.+)/
		if(objRegExp.test(ocr)){
			if((RegExp.$2)==2 ){
				year2=year1.charAt(2) + year1.charAt(3)
				year1=year2
			}
			//d.value = mth + RegExp.$3 + day + RegExp.$3+ year1;
			d.value = day + RegExp.$3 + mth + RegExp.$3+ year1;
		 }else{
			day1=new String(new Date(mth +"/"+ day + "/"+ year1)).substring(0,3)
			d.value= g_daysLookup[day1] + " " + day + " " + g_monthsLookup[mth] + " " +year1
		 }
	}
	return ret;
}

function getDaysInMonth(month,year){
	var days;
	if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)  
		days=31;
	else if (month==4 || month==6 || month==9 || month==11)
		days=30;
	else if (month==2) {
		if (isLeapYear(year)) { 
			days=29; 
		}else { 
			days=28; 
		}
	}
	return (days);
}

function isLeapYear(Year){
	if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)){
		return (true);
	} 
	else  return (false); 
}
var g_workingDays;
var g_holidays;
function getNWorkingDays( n ){
	var hold, tmpHold, holidays;
	var holidayele;
	if (!hld){
		if(!top.content){
			var winopener = window.dialogArguments;
			if (winopener != null){
				while(winopener.top.content.leftpane.document.forms[0].holidays==null){
					winopener=winopener.dialogArguments;
				}
				holidayele = winopener.top.content.leftpane.document.forms[0].holidays
			}
		}else{
		    holidayele = top.content.leftpane.document.forms[0].holidays
		}
		var hld;
		if ((!holidayele) || trimString(holidayele.value)=="")	{
			var fd = new Date(getTodaysDate().getTime() + (n * 24 * 60 * 60 * 1000));
			return fd;
		}
		hld= trimString(holidayele.value);
	}
	if(trimString(hld)!="" && hld.length>2){
		hold = hld.split(g_ch254);
		g_workingDays = hold[0];
		g_holidays = hold[1];
	}
	return (new Date(getDeliveryDate(parseInt(n))));
}
/* Old one
function getNWorkingDays( n ){
	var hold, tmpHold, holidays;
	
	if (!hld){
	    var holidayele = top.content.leftpane.document.forms[0].holidays
		alert("::::"+holidayele.value);
		var hld;
		if ((!holidayele) || trimString(holidayele.value)=="")	{
			var fd = new Date(getTodaysDate().getTime() + (n * 24 * 60 * 60 * 1000));
			return fd;
		}
		hld= trimString(holidayele.value);
	}
	if(trimString(hld)!="" && hld.length>2){
		hold = hld.split(g_ch254);
		tmpHold = hold[0].split(g_ch253);
		holidays = hold[1].split(g_ch253);
	}
	
	neg = false;
	v = 0;
	noh = 0;
	n=parseInt(n,10);
	count = 0;
	if( n < 0 ){
		n = -n; 
		neg = true; 
		v = -1;
	}else{
		v = 1;
	}
	count = n;
	dow = getTodaysDate().getDay();
	dow = dow + v;
	var cd = 0;
	while(count>0){
		cd++;
		//if( dow == 0 || dow == 6)
		if( tmpHold[dow] == 'N' ){ //changed on 31jul03 by Bhanu
			noh++;
		}else{
			if( neg ) cd = -cd;
			var curDate = new Date(formatDate(new Date(getTodaysDate().getTime() + (cd * 24 * 60 * 60 * 1000))));
			for( var k =0; k < holidays.length; k++){			
				var hol  = new Date(getFullDate(holidays[k]));
				if( curDate.getTime() == hol.getTime() ){
					noh++;
					count++;
				}
			}
			count--;
			if( neg) cd=-cd;
		}
		dow = dow + v;
		if( dow == -1 ) { dow = 6; }
		if( dow ==  7 ) { dow = 0; }
	}
	n = n + noh;
	if( neg ) n=-n;
    var fd = new Date(getTodaysDate().getTime() + (n * 24 * 60 * 60 * 1000));
    return fd;
}
*/

function getNCalendarDays( n ){
    var nxt = new Date(getTodaysDate().getTime() + (parseInt(n,10) * 24 * 60 * 60 * 1000));
    return nxt;
}

function getTodaysDate(){
	return new Date(jsp_sysDate); //jsp_sysDate variable is generated by JSP programs
}

function formatDate( dt ){
	var mm = dt.getMonth() + 1;
	var dd = "" + dt.getDate();
	if (("" + mm).length ==1) mm = "0" + mm; 
	if (dd.length==1) dd = "0" + dd;  
	return dd + g_sep + mm + g_sep + dt.getFullYear();	
}

function convertDate(dat){
	var d=dat;
	var dt=new Array("","","");
	var mon=new Array("jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec");
	var i;
	var pos;
	var pchar;
	var mm=-1,dd=-1,yy=-1;

	//code for seperating the entered date and store in an array
	i=0;
	for(pos=0; pos<d.length; pos++){
		switch(d.charAt(pos)){
			case '\\':
			case '/':
			case '-':
			case ' ':
			case '.':
			if (pchar!='\\' && pchar!='/' && pchar!='-' && pchar!=' ' && pchar!='.')
					 i++; 
					break;
			default : 
				dt[i]=dt[i] + d.charAt(pos);
		}
		pchar=d.charAt(pos);
	}
	if (dt[2]=="") dt[2]=new Date().getFullYear();	
	yy=dt[2];
	//read each element in an array
	for(i=0;i<=2;i++){
			//if the array element is text then check whether a valid month
		if (isNumber(dt[i])==false)	{
			for(k=0;k<12;k++){
				if (dt[i].toLowerCase()==mon[k]){
					mm=k+1;
					break;
				}
			}
		}
	}
	//read each element in an array
	/*if the array element is number then, if the value is less than 12 it is assumed as month
		and if >12 and <31  then it is assumed as day, if both month and day are less than 12 then by default
		the first number is assumed as month number	order is month,day and year */

	/*
	for(i=0;i<=2;i++){
		if (isNumber(dt[i])==true)	{ 
			  if (dt[i] <= 31)
				{if (dd==-1) {dd=dt[i]; continue;} } 
			  if (dt[i] <= 12)
					{if (mm==-1) {mm=dt[i]; continue;} }
			  if (dt[i] > 31)
				{yy=dt[i]; continue;}  
			}
	}*/
	//--------------------------
	if(isNumber(dt[0])){
		if(dt[0]<=12){
			mm=dt[0];
		}else{
			dd=dt[0];
		}
	}
	if(isNumber(dt[1])){
		if(dt[1]<=12 && dd <=12){
			dd=mm;
			mm=dt[1];
		}else if(dt[1]<=31 && dd==-1){
			//mm=dd;
			dd=dt[1];
		}else{
			mm=dt[1];
		}
	}
	//----------------------------
	if (yy==-1)	return "INVALID";
	if(mm=="") return "INVALID";
	if((dd==-1)||(dd=="")) return "INVALID";
	if (mm.length==1)	mm = "0" +  mm;
	if (dd.length==1)	dd = "0" + dd;
	return (dd + "/" + mm + "/" + yy);

}

function rangeCheckDate(c){
	ra= c.getAttribute("ORC")
	g_RAarray=ra.split(g_listSep)
	len=g_RAarray.length
	if( !isInteger(g_RAarray[0]) || !isInteger(g_RAarray[1]) ){
		return false;
	}
	cur = getFullDate(c.value);
	g_fir = getFullDate(formatDate(getNCalendarDays( g_RAarray[0])));
	g_sec = getFullDate(formatDate(getNCalendarDays( g_RAarray[1])));

/*
The following code is modified since the date object accepts the date string in 
year,month,date or month,date,year
*/
	sTemp=cur.split("/");
	cur=new Date(sTemp[2],sTemp[1]-1,sTemp[0]);

	sTemp=g_fir.split("/");
	g_fir=new Date(sTemp[2],sTemp[1]-1,sTemp[0]);

	sTemp=g_sec.split("/");
	g_sec=new Date(sTemp[2],sTemp[1]-1,sTemp[0]);

	if( cur < g_fir || cur > g_sec ){
		return false;
	}
	return true;
}

function getFullDate(dt){
    dt = convertDate(dt)	
    dtArr = dt.split('/')
    year = parseInt(dtArr[2],10);
    if( dtArr[2].length == 2 ) {
		if( (year >= 0) && (year < 70) ){
			year = year + 2000;
		}else if((year >= 70) && (year < 100) ){
       		year = year + 1900;
    	}
    }else if( dtArr[2].length == 4 ) {
       year = year;
    }
    return (dtArr[0] + g_sep + dtArr[1] + g_sep + year)
}
function getDateValueOf(dt){
    dt = convertDate(dt)	
    dtArr = dt.split('/')
    year = parseInt(dtArr[2],10);
    if( dtArr[2].length == 2 ) {
		if( (year >= 0) && (year < 70) ){
			year = year + 2000;
		}else if((year >= 70) && (year < 100) ){
       		year = year + 1900;
    	}
    }else if( dtArr[2].length == 4 ) {
       year = year;
    }
    return (year+""+dtArr[1] +""+ dtArr[0])
}

	//------------------------------------01-Jul-04 Bhanu --------------------------
function getNonWorkingDays(p_date, p_days){
	var dayOfTheWeek = p_date.getDay();
	var workingDays=g_workingDays.split(g_ch253);
	var nonWorkingDays=0;
	var cnt;
	if (p_days>0){
		for(cnt=0;cnt<(p_days+nonWorkingDays);cnt++){
			if(workingDays[(dayOfTheWeek+cnt) % 7]=="N"){
				nonWorkingDays++;
			}
		}

	}else{
		p_days=p_days*-1;
		var temp;
		//dayOfTheWeek-=1;
		for(cnt=1;cnt<=(p_days+(nonWorkingDays*-1)+1);cnt++){
			temp=dayOfTheWeek-cnt;
			if(temp<0) temp=temp+7;
			if(workingDays[(temp)%7]=="N"){
				nonWorkingDays--;
			}
		}
	}
		/*
		for(cnt=0;cnt>p_days;cnt--){
			alert("checking:" + (workingDays.length-(dayOfTheWeek+cnt))+"::"+workingDays[(workingDays.length-(dayOfTheWeek+cnt)) % 7]  );
			if(workingDays[(workingDays.length-(dayOfTheWeek+cnt)) % 7]=="N"){
				cnt++;
				nonWorkingDays++;
			}
		}*/		
	return nonWorkingDays;
}

//------------------------------------01-Jul-04 Bhanu --------------------------
function getNoOfHolidays(p_startDate, p_endDate){
	var holiday;
	var endDate=new Date(p_endDate);
	var holidays=g_holidays.split(g_ch253);
	var noOfHolidays=0;
	for( var k =0; k < holidays.length; k++){
		holiday=new Date(holidays[k]).getTime();
		//check if holiday is between the given dates. If so increment holidays and add a day to enddate
		if( holiday>= p_startDate.getTime() && holiday<= endDate.getTime() ){
			endDate.setTime(endDate.getTime()+ (24*60*60*1000));
			noOfHolidays++;
		}
	}
	return noOfHolidays;
}

//------------------------------------01-Jul-04 Bhanu --------------------------
function getDeliveryDate(p_businessDays){
//get current date
	var v_todaysDate=getTodaysDate();
	//alert("v_todaysDate:"+v_todaysDate);

//add nonworking days
	var nonWorkingDays=getNonWorkingDays(v_todaysDate, p_businessDays);
	//alert("nonWorkingDays:"+nonWorkingDays);

	var dateAfterNonWorkingDays=new Date(v_todaysDate.getTime()+ ((p_businessDays+nonWorkingDays)*24*60*60*1000));
	//alert("dateAfterNonWorkingDays:"+dateAfterNonWorkingDays);

//add holidays
	var holidays=getNoOfHolidays(v_todaysDate, dateAfterNonWorkingDays);
	//alert("holidays:"+holidays);

//check for nonwoking days after holidays
	var nonWorkingDaysAfterHolidayCheck=getNonWorkingDays(dateAfterNonWorkingDays,holidays);
	//alert("nonWorkingDaysAfterHolidayCheck:"+nonWorkingDaysAfterHolidayCheck);

//error for rectification. getTime() is adding one more day here
	var deliveryDate=new Date(dateAfterNonWorkingDays.getTime() + ((holidays+nonWorkingDaysAfterHolidayCheck)*24*60*60*1000));
	return deliveryDate;

}

