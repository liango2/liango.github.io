//------------------------------
// 参考了：
//   三角图标： http://en.wikipedia.org/wiki/Geometric_Shapes
//   css相关：  http://www.sitepoint.com/web-foundations/pseudoclass-nthlastchild/
//------------------------------
// 全局变量
var WEEK = ['一', '二', '三', '四', '五', '六', '日']
var currDate = new Date() // 保存当前的日期

//------------------------------
function $(id) {
    return document.getElementById(id);
}

function cd(id, innerHTML, css, onclick) {
    var eDiv = document.createElement('div')
    if (id) {
        eDiv.id = id;
    }
    if (innerHTML) {
        eDiv.innerHTML = innerHTML;
    }
    if (css) {
        eDiv.className = css;
    }
    if (onclick) {
        eDiv.onclick = new Function(onclick);
    }
    return eDiv;
}

//------------------------------
/**
 * 1. 生成一个html的框架；
 * 2. 生成cal_month, cal_day
 *
 */
function showCalendar(id) {
    initCalendar()
    refreshCalHeader()
    refreshCalBody()
}

function initCalendar() {
    var cal = $('cal');

    if (!cal) {
        var calDiv = cd('cal')

        //<div id="cal_header">
        //  <div id="cal_prev">前</div>
        //  <div id="cal_month">May, 2015</div>
        //  <div id="cal_next">后</div>
        //</div>
        var header = cd('cal_header')

        header.appendChild(cd('cal_prev', '&#x25C0;', null, 'gotoPrevMonth()'));
        header.appendChild(cd('cal_month'));
        header.appendChild(cd('cal_next', '&#x25B6;', null, 'gotoNextMonth()'));

        calDiv.appendChild(header);

        //<div id="cal_week">
        //  <div>一</div>
        //  <div>二</div>
        //  <div>三</div>
        //  <div>四</div>
        //  <div>五</div>
        //  <div>六</div>
        //  <div>日</div>
        //</div>
        var week = cd('cal_week');

        for (var i = 0; i < 7; i++) {
            week.appendChild(cd(null, WEEK[i]));
        }

        calDiv.appendChild(week);

        //<div id="cal_body">
        //  <div id="cal_day">
        //    <div id="gray">1</div>
        //    <div id="selected">1</div>
        //    <div id="today_selected">1</div>
        //    <div id="today">1</div>
        //    <!--
        //    <script type="text/javascript">
        //      for(var i = 0; i < 37; i++) {
        //        document.write(' <div id="gray">' + i +'</div> ');
        //      }
        //    </script>
        //    -->
        //  </div>
        // <div id="cal_foot">
        //   <div id="cal_get_today">today:</div>
        //   <div id="cal_dt_str">2015-05-16</div>
        // </div>
        //</div>
        var body = cd('cal_body')
        var day = cd('cal_day')
        body.appendChild(day)
        calDiv.appendChild(body)

        // <div id="cal_foot">
        //   <div id="cal_get_today">today:</div>
        //   <div id="cal_dt_str">2015-05-16</div>
        // </div>
        var foot = cd('cal_foot')
        var today = cd('cal_get_today', 'today:')
        var dt_str = cd('cal_dt_str')
        foot.appendChild(today)
        foot.appendChild(dt_str)
        calDiv.appendChild(foot)

        document.body.appendChild(calDiv);
    }
}

function refreshCalHeader() {
    $('cal_month').innerHTML = (currDate.getFullYear()) + '年' + (currDate.getMonth() + 1) + '月'
}

function refreshCalBody() {
    $('cal_day').innerHTML = '' // 清空

    refreshPrevMonth()
    refreshCurrMonth()
    refreshNextMonth()
}
/**
 * 刷新上个月的day
 * 1. 获取当前月1号是星期几
 * 2. 获取上月最后一天是几号
 * 3. 计算上月从哪天开始显示
 */
function refreshPrevMonth() {
    var firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay()
    if (firstDay == 0) firstDay = 7;
    var lastDateOfPrevMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate()

    //<div id="cal_day">
    //  <div id="gray">1</div>
    //  <div id="selected">1</div>
    //  <div id="today_selected">1</div>
    //  <div id="today">1</div>
    //  <script type="text/javascript">
    //    for(var i = 0; i < 37; i++) {
    //      document.write(' <div id="gray">' + i +'</div> ');
    //    }
    //  </script>
    //</div>
    var calDay = $('cal_day')
    for (var i = lastDateOfPrevMonth - firstDay + 2; i <= lastDateOfPrevMonth; i++) {
        calDay.appendChild(cd(null, i, 'gray', 'gotoPrevMonthSpecDate(' + i + ')'))
    }

}
function refreshCurrMonth() {
    var lastDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate() // 当前月最后一天的日期
    var calDay = $('cal_day')
    for (var i = 1; i <= lastDate; i++) {
        calDay.appendChild(cd(null, i, null, 'gotoCurrMonthSpecDate(' + i + ')'))
    }
}
function refreshNextMonth() {
    var lastDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate() // 当前月最后一天的日期
    var firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay()
    if (firstDay == 0) firstDay = 7;
    //console.log("42 - ", lastDate, " - ", firstDay, " = ", 42-lastDate -firstDay)
    var calDay = $('cal_day')
    for (var i = 1; i <= 42 - lastDate - firstDay + 1; i++) {
        calDay.appendChild(cd(null, i, 'gray', 'gotoNextMonthSpecDate(' + i + ')'))
    }
}

function gotoPrevMonth() {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1)
    refreshCalHeader()
    refreshCalBody()
}
function gotoNextMonth() {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1)
    refreshCalHeader()
    refreshCalBody()
}

function gotoCurrMonthSpecDate(i) {
    // 清除以前的选中
    var eSelected = document.getElementsByClassName('selected');
    Array.prototype.forEach.call(eSelected, function (element) {
        element.className = element.className.replace(/(\s|^)selected(\s|$)/g, '') //
    })

    var source = event.target || event.srcElement;
    source.className += ' selected'
}