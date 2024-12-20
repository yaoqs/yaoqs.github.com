/******************* Calendar ****************************/
var CalendarHandler = {
        currentYear: 0,
        currentMonth: 0,
        isRunning: false,
        showYearStart: 2009,
        tag: 0,
        initialize: function () {
                $calendarItem = this.CreateCalendar(0, 0, 0);
                $("#Container").append($calendarItem);

                $("#context").css("height", $("#CalendarMain").height() - 65 + "px");
                $("#center").css("height", $("#context").height() - 30 + "px");
                $("#selectYearDiv")
                        .css("height", $("#context").height() - 30 + "px")
                        .css("width", $("#context").width() + "px");
                $("#selectMonthDiv")
                        .css("height", $("#context").height() - 30 + "px")
                        .css("width", $("#context").width() + "px");
                $("#centerCalendarMain")
                        .css("height", $("#context").height() - 30 + "px")
                        .css("width", $("#context").width() + "px");

                $calendarItem.css("height", $("#context").height() - 30 + "px"); //.css("visibility","hidden");
                $("#Container")
                        .css("height", "0px")
                        .css("width", "0px")
                        .css("margin-left", $("#context").width() / 2 + "px")
                        .css("margin-top", ($("#context").height() - 30) / 2 + "px");
                $("#Container").animate(
                        {
                                width: $("#context").width() + "px",
                                height: ($("#context").height() - 30) * 2 + "px",
                                marginLeft: "0px",
                                marginTop: "0px",
                        },
                        300,
                        function () {
                                $calendarItem.css("visibility", "visible");
                        }
                );
                $(".dayItem").css("width", $("#context").width() + "px");
                var itemPaddintTop = $(".dayItem").height() / 6;
                $(".item").css({
                        width: $(".week").width() / 7 + "px",
                        "line-height": itemPaddintTop + "px",
                        height: itemPaddintTop + "px",
                });
                $(".currentItem>a")
                        .css("margin-left", ($(".item").width() - 25) / 2 + "px")
                        .css("margin-top", ($(".item").height() - 25) / 2 + "px");
                $(".week>h3").css("width", $(".week").width() / 7 + "px");
                this.RunningTime();
        },
        CreateSelectYear: function (showYearStart) {
                CalendarHandler.showYearStart = showYearStart;
                $(".currentDay").show();
                $("#selectYearDiv").children().remove();
                var yearindex = 0;
                for (var i = showYearStart; i < showYearStart + 12; i++) {
                        yearindex++;
                        if (i == showYearStart) {
                                $last = $("<div>往前</div>");
                                $("#selectYearDiv").append($last);
                                $last.click(function () {
                                        CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart - 10);
                                });
                                continue;
                        }
                        if (i == showYearStart + 11) {
                                $next = $("<div>往后</div>");
                                $("#selectYearDiv").append($next);
                                $next.click(function () {
                                        CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart + 10);
                                });
                                continue;
                        }

                        if (i == this.currentYear) {
                                $yearItem = $(
                                        '<div class="currentYearSd" id="' + yearindex + '">' + i + "</div>"
                                );
                        } else {
                                $yearItem = $('<div id="' + yearindex + '">' + i + "</div>");
                        }
                        $("#selectYearDiv").append($yearItem);
                        $yearItem.click(function () {
                                $calendarItem = CalendarHandler.CreateCalendar(
                                        Number($(this).html()),
                                        1,
                                        1
                                );
                                $("#Container").append($calendarItem);
                                CalendarHandler.CSS();
                                CalendarHandler.isRunning = true;
                                $($("#Container").find(".dayItem")[0]).animate(
                                        {
                                                height: "0px",
                                        },
                                        300,
                                        function () {
                                                $(this).remove();
                                                CalendarHandler.isRunning = false;
                                        }
                                );
                                $("#centerMain").animate(
                                        {
                                                marginLeft: -$("#center").width() + "px",
                                        },
                                        500
                                );
                        });
                        if (yearindex == 1 || yearindex == 5 || yearindex == 9)
                                $("#selectYearDiv")
                                        .find("#" + yearindex)
                                        .css("border-left-color", "#fff");
                        if (yearindex == 4 || yearindex == 8 || yearindex == 12)
                                $("#selectYearDiv")
                                        .find("#" + yearindex)
                                        .css("border-right-color", "#fff");
                }
                $("#selectYearDiv>div")
                        .css("width", ($("#center").width() - 4) / 4 + "px")
                        .css("line-height", ($("#center").height() - 4) / 3 + "px");
                $("#centerMain").animate(
                        {
                                marginLeft: "0px",
                        },
                        300
                );
        },
        CreateSelectMonth: function () {
                $(".currentDay").show();
                $("#selectMonthDiv").children().remove();
                for (var i = 1; i < 13; i++) {
                        if (i == this.currentMonth)
                                $monthItem = $(
                                        '<div class="currentMontSd" id="' + i + '">' + i + "月</div>"
                                );
                        else $monthItem = $('<div id="' + i + '">' + i + "月</div>");
                        $("#selectMonthDiv").append($monthItem);
                        $monthItem.click(function () {
                                $calendarItem = CalendarHandler.CreateCalendar(
                                        CalendarHandler.currentYear,
                                        Number($(this).attr("id")),
                                        1
                                );
                                $("#Container").append($calendarItem);
                                CalendarHandler.CSS();
                                CalendarHandler.isRunning = true;
                                $($("#Container").find(".dayItem")[0]).animate(
                                        {
                                                height: "0px",
                                        },
                                        300,
                                        function () {
                                                $(this).remove();
                                                CalendarHandler.isRunning = false;
                                        }
                                );
                                $("#centerMain").animate(
                                        {
                                                marginLeft: -$("#center").width() + "px",
                                        },
                                        500
                                );
                        });
                        if (i == 1 || i == 5 || i == 9)
                                $("#selectMonthDiv")
                                        .find("#" + i)
                                        .css("border-left-color", "#fff");
                        if (i == 4 || i == 8 || i == 12)
                                $("#selectMonthDiv")
                                        .find("#" + i)
                                        .css("border-right-color", "#fff");
                }
                $("#selectMonthDiv>div")
                        .css("width", ($("#center").width() - 4) / 4 + "px")
                        .css("line-height", ($("#center").height() - 4) / 3 + "px");
                $("#centerMain").animate(
                        {
                                marginLeft: -$("#center").width() * 2 + "px",
                        },
                        300
                );
        },
        IsRuiYear: function (aDate) {
                return 0 == aDate % 4 && (aDate % 100 != 0 || aDate % 400 == 0);
        },
        CalculateWeek: function (y, m, d) {
                var arr = "7123456".split("");

                var vYear = parseInt(y, 10);
                var vMonth = parseInt(m, 10);
                var vDay = parseInt(d, 10);

                var week = arr[new Date(y, m - 1, vDay).getDay()];
                return week;
        },
        CalculateMonthDays: function (m, y) {
                var mDay = 0;
                if (
                        m == 0 ||
                        m == 1 ||
                        m == 3 ||
                        m == 5 ||
                        m == 7 ||
                        m == 8 ||
                        m == 10 ||
                        m == 12
                ) {
                        mDay = 31;
                } else {
                        if (m == 2) {
                                //判断是否为芮年
                                var isRn = this.IsRuiYear(y);
                                if (isRn == true) {
                                        mDay = 29;
                                } else {
                                        mDay = 28;
                                }
                        } else {
                                mDay = 30;
                        }
                }
                return mDay;
        },
        CreateCalendar: function (y, m, d) {
                $dayItem = $('<div class="dayItem"></div>');
                //获取当前月份的天数
                var nowDate = new Date();
                if (
                        (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) ||
                        (y == 0 && m == 0)
                )
                        $(".currentDay").hide();
                var nowYear = y == 0 ? nowDate.getFullYear() : y;
                this.currentYear = nowYear;
                var nowMonth = m == 0 ? nowDate.getMonth() + 1 : m;
                this.currentMonth = nowMonth;
                var nowDay = d == 0 ? nowDate.getDate() : d;
                $(".selectYear").html(nowYear + "年");
                $(".selectMonth").html(nowMonth + "月");
                var nowDaysNub = this.CalculateMonthDays(nowMonth, nowYear);
                //获取当月第一天是星期几
                //var weekDate = new Date(nowYear+"-"+nowMonth+"-"+1);
                //alert(weekDate.getDay());
                var nowWeek = parseInt(this.CalculateWeek(nowYear, nowMonth, 1));
                //nowWeek=weekDate.getDay()==0?7:weekDate.getDay();
                //var nowWeek=weekDate.getDay();
                //获取上个月的天数
                var lastMonthDaysNub = this.CalculateMonthDays(nowMonth - 1, nowYear);

                if (nowWeek != 0) {
                        //生成上月剩下的日期
                        for (
                                var i = lastMonthDaysNub - (nowWeek - 1);
                                i < lastMonthDaysNub;
                                i++
                        ) {
                                $dayItem.append(
                                        '<div class="item lastItem"><a>' + (i + 1) + "</a></div>"
                                );
                        }
                }

                //生成当月的日期
                for (var i = 0; i < nowDaysNub; i++) {
                        if (i == nowDay - 1)
                                $dayItem.append(
                                        '<div class="item currentItem"><a>' + (i + 1) + "</a></div>"
                                );
                        else $dayItem.append('<div class="item"><a>' + (i + 1) + "</a></div>");
                }

                //获取总共已经生成的天数
                var hasCreateDaysNub = nowWeek + nowDaysNub;
                //如果小于42，往下个月推算
                if (hasCreateDaysNub < 42) {
                        for (var i = 0; i <= 42 - hasCreateDaysNub; i++) {
                                $dayItem.append(
                                        '<div class="item lastItem"><a>' + (i + 1) + "</a></div>"
                                );
                        }
                }

                return $dayItem;
        },
        CSS: function () {
                var itemPaddintTop = $(".dayItem").height() / 6;
                $(".item").css({
                        width: $(".week").width() / 7 + "px",
                        "line-height": itemPaddintTop + "px",
                        height: itemPaddintTop + "px",
                });
                $(".currentItem>a")
                        .css("margin-left", ($(".item").width() - 25) / 2 + "px")
                        .css("margin-top", ($(".item").height() - 25) / 2 + "px");
        },
        CalculateNextMonthDays: function () {
                if (this.isRunning == false) {
                        $(".currentDay").show();
                        var m = this.currentMonth == 12 ? 1 : this.currentMonth + 1;
                        var y = this.currentMonth == 12 ? this.currentYear + 1 : this.currentYear;
                        var d = 0;
                        var nowDate = new Date();
                        if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1)
                                d = nowDate.getDate();
                        else d = 1;
                        $calendarItem = this.CreateCalendar(y, m, d);
                        $("#Container").append($calendarItem);

                        this.CSS();
                        this.isRunning = true;
                        $($("#Container").find(".dayItem")[0]).animate(
                                {
                                        height: "0px",
                                },
                                300,
                                function () {
                                        $(this).remove();
                                        CalendarHandler.isRunning = false;
                                }
                        );
                }
        },
        CalculateLastMonthDays: function () {
                if (this.isRunning == false) {
                        $(".currentDay").show();
                        var nowDate = new Date();
                        var m = this.currentMonth == 1 ? 12 : this.currentMonth - 1;
                        var y = this.currentMonth == 1 ? this.currentYear - 1 : this.currentYear;
                        var d = 0;

                        if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1)
                                d = nowDate.getDate();
                        else d = 1;
                        $calendarItem = this.CreateCalendar(y, m, d);
                        $("#Container").append($calendarItem);
                        var itemPaddintTop = $(".dayItem").height() / 6;
                        this.CSS();
                        this.isRunning = true;
                        $($("#Container").find(".dayItem")[0]).animate(
                                {
                                        height: "0px",
                                },
                                300,
                                function () {
                                        $(this).remove();
                                        CalendarHandler.isRunning = false;
                                }
                        );
                }
        },
        CreateCurrentCalendar: function () {
                if (this.isRunning == false) {
                        $(".currentDay").hide();
                        $calendarItem = this.CreateCalendar(0, 0, 0);
                        $("#Container").append($calendarItem);
                        this.isRunning = true;
                        $($("#Container").find(".dayItem")[0]).animate(
                                {
                                        height: "0px",
                                },
                                300,
                                function () {
                                        $(this).remove();
                                        CalendarHandler.isRunning = false;
                                }
                        );
                        this.CSS();
                        $("#centerMain").animate(
                                {
                                        marginLeft: -$("#center").width() + "px",
                                },
                                500
                        );
                }
        },
        RunningTime: function () {
                var mTiming = setInterval(function () {
                        var nowDate = new Date();
                        var h =
                                nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
                        var m =
                                nowDate.getMinutes() < 10
                                        ? "0" + nowDate.getMinutes()
                                        : nowDate.getMinutes();
                        var s =
                                nowDate.getSeconds() < 10
                                        ? "0" + nowDate.getSeconds()
                                        : nowDate.getSeconds();
                        var nowTime = h + ":" + m + ":" + s;
                        $("#footNow").html("本地时间 " + nowTime);
                }, 1000);
        }

};
$(() => {
        CalendarHandler.initialize();
});

// jQuery火箭图标返回顶部代码
$(function () {
        var rocketToTop = $("#rocket-to-top"),
                documentScrollTop = 0,
                animationInterval,
                animationInProgress = false;

        function updateRocketPosition() {
                var currentPosition = rocketToTop.css("background-position");
                if (rocketToTop.css("display") === "none" || animationInProgress) {
                        clearInterval(animationInterval);
                        rocketToTop.css("background-position", "0px 0px");
                        return;
                }

                switch (currentPosition) {
                        case "0px 0px":
                                rocketToTop.css("background-position", "-298px 0px");
                                break;
                        case "-298px 0px":
                                rocketToTop.css("background-position", "-447px 0px");
                                break;
                        case "-447px 0px":
                                rocketToTop.css("background-position", "-596px 0px");
                                break;
                        case "-596px 0px":
                                rocketToTop.css("background-position", "-745px 0px");
                                break;
                        case "-745px 0px":
                                rocketToTop.css("background-position", "-298px 0px");
                }
        }

        function handleScroll() {
                documentScrollTop = $(document).scrollTop();
                if (documentScrollTop === 0) {
                        if (rocketToTop.css("background-position") === "0px 0px") {
                                rocketToTop.fadeOut("slow");
                        } else if (!animationInProgress) {
                                animationInProgress = true;
                                $(".level-2").css("opacity", 1);
                                rocketToTop.delay(100).animate({
                                        marginTop: "-1000px"
                                }, "normal", function () {
                                        rocketToTop.css({
                                                "margin-top": "-125px",
                                                display: "none"
                                        });
                                        animationInProgress = false;
                                });
                        }
                } else {
                        rocketToTop.fadeIn("slow");
                }
        }

        $(window).on('scroll', handleScroll);

        rocketToTop.hover(
                function () {
                        $(".level-2").stop(true).animate({ opacity: 1 });
                },
                function () {
                        $(".level-2").stop(true).animate({ opacity: 0 });
                }
        );

        $(".level-3").click(function () {
                if (animationInProgress) return;
                animationInterval = setInterval(updateRocketPosition, 50);
                $("html,body").animate({ scrollTop: 0 }, "slow");
        });
});

/**
 * 显示带有标题和内容的提示窗口
 *
 * @param str 窗口显示的内容
 */
function divshowAlert(str) {
        const msgWidth = 400; // 提示窗口的宽度
        const msgHeight = 100; // 提示窗口的高度
        const titleHeight = 25; // 提示窗口标题高度
        const borderColor = "#007ECE"; // 提示窗口的边框颜色
        const titleColor = "#99CCFF"; // 提示窗口的标题颜色
        const bgOpacity = 0.6; // 背景透明度

        // 获取文档尺寸
        const sWidth = document.body.offsetWidth - 25;
        const sHeight = document.body.scrollHeight;

        // 创建背景遮罩层
        const bgObj = document.createElement("div");
        bgObj.id = "bgDiv";
        bgObj.style.position = "absolute";
        bgObj.style.top = "0";
        bgObj.style.left = "0";
        bgObj.style.background = "#777";
        bgObj.style.opacity = bgOpacity;
        bgObj.style.width = sWidth + "px";
        bgObj.style.height = sHeight + "px";
        bgObj.style.zIndex = "10000";

        // 创建消息框
        const msgObj = document.createElement("div");
        msgObj.id = "msgDiv";
        msgObj.style.background = "white";
        msgObj.style.border = `1px solid ${borderColor}`;
        msgObj.style.position = "absolute";
        msgObj.style.left = "50%";
        msgObj.style.top = `50%`;
        msgObj.style.transform = "translate(-50%, -50%)";
        msgObj.style.width = msgWidth + "px";
        msgObj.style.height = msgHeight + "px";
        msgObj.style.textAlign = "center";
        msgObj.style.lineHeight = `${titleHeight}px`;
        msgObj.style.zIndex = "10001";

        // 创建标题栏
        const title = document.createElement("h4");
        title.id = "msgTitle";
        title.style.margin = "0";
        title.style.padding = "3px";
        title.style.fontSize = "16px";
        title.style.fontWeight = "bold";
        title.style.background = borderColor;
        title.style.border = `1px solid ${borderColor}`;
        title.style.height = `${titleHeight + 5}px`; // Adjusted for padding
        title.style.color = "white";
        title.style.cursor = "pointer";
        title.textContent = "关闭";
        title.onclick = function () {
                document.body.removeChild(bgObj);
                document.body.removeChild(msgObj);
        };

        // 设置消息文本
        const txt = document.createElement("p");
        txt.style.margin = "1em 0";
        txt.id = "msgTxt";
        txt.innerHTML = str;

        // 组装DOM结构
        document.body.appendChild(bgObj);
        msgObj.appendChild(title);
        msgObj.appendChild(txt);
        document.body.appendChild(msgObj);
}


//============================
$(() => {
        setInterval(() => {
                var d = new Date()
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                if (h <= 9) { h = '0' + h };
                if (m <= 9) { m = '0' + m };
                if (s <= 9) { s = '0' + s };
                $("div#Timesphere").css("width", "100px").height("100px").css("border-radius", "50%").css("background", "radial-gradient(circle at 70px 70px,#" + Math.floor((h * 3600 + m * 60 + s * 1) / 24 / 3600 * 256 * 256 * 256).toString(16).padStart(6, '0') + ",#000000)").css("position", "float"); $("p#hex").text('#' + h + m + s);
                //console.log('#' + h + m + s)
        }, 1000);
})

//====================
// 按Enter键,执行事件
// 当文本框中按下 Enter 键时触发 searchBing 函数
$("#fake-editable").on("keydown", function (event) {
        if (event.key === 'Enter') searchBing();
});

// 当按钮被点击时触发 searchBing 函数，并阻止默认行为
$("#btn").on("click", function (event) {
        event.preventDefault(); // 阻止默认行为
        searchBing();
});

// 跳转到 Bing 搜索页面
function searchBing() {
        var inputElement = $("#fake-editable");
        if (!inputElement.length) {
                console.error("Element with ID 'fake-editable' not found.");
                return;
        }
        var searchValue = inputElement.value.trim();

        if (searchValue) {
                // 验证搜索值是否包含恶意脚本
                if (/[\x00-\x1F\x7F-\x9F<>&]/.test(searchValue)) {
                        console.error("Invalid search value detected.");
                        return;
                }
                window.location.href = "https://www.bing.com/search?q=" + encodeURIComponent(searchValue);
        } else {
                console.log("No search value provided."); // 改为log以减少错误信息的突出显示
        }
}