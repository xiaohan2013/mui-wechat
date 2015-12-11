/**
 * Created by schp-tany on 2015/12/4.
 */
;(function(){
    window.common = {
        panelNetworkHandler:function(panelId){
            var request = function(settings,successHandler){
                mui('#loadingToast').show();
                mui.ajax(mui.extend(true,settings,{
                    success: function (result) {
                        mui('#loadingToast').hide();
                        successHandler(result);
                    }
                }));
            }
            var panelId = panelId || "wait-commit";
            switch(panelId){
                case "wait-commit":
                    request({
                        url:"data/f1.json",
                        dataType:"json",
                    }, function (result) {
                        console.log("wait-commit");
                    });
                    break;
                case "in-approval":
                    request({
                        url:"data/f1.json",
                        dataType:"json",
                    }, function (result) {
                        console.log("in-approval");
                    });
                    break;
                case "in-pass":
                    request({
                        url:"data/f1.json",
                        dataType:"json",
                    }, function (result) {
                        console.log("in-pass");
                    });
                    break;
                case "in-confirm":
                    request({
                        url:"data/f1.json",
                        dataType:"json",
                    }, function (result) {
                        console.log("in-confirm");
                    });
                    break;
                case "all":
                    request({
                        url:"data/f1.json",
                        dataType:"json",
                    }, function (result) {
                        console.log("all");
                    });
                    break;
            };
        }
    };
    (function(M, doc) {
        M.init({
            gestureConfig:{
                tap: true, //默认为true
                doubletap: true, //默认为false
                longtap: true, //默认为false
                swipe: true, //默认为true
                drag: true, //默认为true
                hold:false,//默认为false，不监听
                release:false//默认为false，不监听
            },
            swipeBack: false,
            pullRefresh: {
                container: '#wait-wrapper',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    callback: pullupRefresh,
                }
            }
        });

        function pulldownRefresh() {
            setTimeout(function() {
                var table = document.body.querySelector('#wait-wrapper .mui-table-view');
                var cells = document.body.querySelectorAll('#wait-wrapper .mui-table-view-cell');
                for (var i = cells.length, len = i + 3; i < len; i++) {
                    var li = document.createElement('li');
                    li.className = 'mui-table-view-cell mui-media';
                    li.setAttribute("data-pid","201512-2010123"+i);
                    li.innerHTML = '<a class="mui-navigate-right mui-forward mui-slider-handle" href="#report-detail"><img class="mui-media-object mui-pull-left head-img" id="head-img" src=""><div class="mui-media-body">餐费(已关闭)<p class="mui-ellipsis">￥21.00-1张票据(非发票)</p><p class="mui-ellipsis">天津开发项目</p></div></a><div class="mui-slider-left mui-disabled"><a class="mui-btn mui-btn-red">提交</a></div>';
                    //下拉刷新，新纪录插到最前面；
                    li.addEventListener("swiperight",function(ev){
                        mui.swipeoutOpen(li,"left");
                    });
                    table.insertBefore(li, table.firstChild);
                }
                mui('#wait-wrapper').pullRefresh().endPulldownToRefresh(); //refresh completed
            }, 1500);
        }
        var count = 0;
        // 下拉获取数据
        function pullupRefresh() {
            setTimeout(function() {
                mui('#wait-wrapper').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
                var table = document.body.querySelector('#wait-wrapper .mui-table-view');
                var cells = document.body.querySelectorAll('#wait-wrapper .mui-table-view-cell');
                for (var i = cells.length, len = i + 20; i < len; i++) {
                    var li = document.createElement('li');
                    li.className = 'mui-table-view-cell mui-media';
                    li.setAttribute("data-pid","201512-2010123"+i);
                    li.innerHTML = '<a class="mui-navigate-right mui-forward mui-slider-handle" href="#report-detail"><img class="mui-media-object mui-pull-left head-img" id="head-img" src=""><div class="mui-media-body">餐费(已关闭)<p class="mui-ellipsis">￥21.00-1张票据(非发票)</p><p class="mui-ellipsis">天津开发项目</p></div></a><div class="mui-slider-left mui-disabled"><a class="mui-btn mui-btn-red">提交</a></div>';
                    table.appendChild(li);
                }
            }, 1500);
        }

        if (mui.os.plus) {
            mui.plusReady(function() {
                setTimeout(function() {
                    mui('#wait-wrapper').pullRefresh().pullupLoading();
                }, 1000);

            });
        } else {
            mui.ready(function() {
                mui('#wait-wrapper').pullRefresh().pullupLoading();
            });
        }

        // 侧滑菜单切换企业
        //侧滑容器父节点
        var offCanvasWrapper = mui('#my-expense-wrapper');
        //主界面容器
        var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-page-content');
        //菜单容器
        var offCanvasSide = document.getElementById("offCanvasSide");
        //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
        var classList = offCanvasWrapper[0].classList;
        //变换侧滑动画移动效果；
        offCanvasSide.classList.remove('mui-transitioning');
        offCanvasSide.setAttribute('style', '');
        classList.remove('mui-slide-in');
        classList.remove('mui-scalable');
        classList.add('mui-slide-in');
        M('#offCanvasSideScroll').scroll();

        //初始化加载数据
        common.panelNetworkHandler();
        M.ajax({
            type:"GET",
            url:'data/company.json',
            dataType:"json",
            success: function (result) {
                if(result.code == 0){
                    var companyList = template("Tpl_companyItem",{data:result.data});
                    mui("#companies-list")[0].innerHTML = companyList;
                }
            }
        });
    })(mui, document);

    // 页面内部的切换
    (function($){
        var viewApi = $('#my-expense').view({
            defaultPage: '#main-panel'
        });
        // 当前页面的引用
        var view = viewApi.view;

        //处理view的后退与webview后退
        var oldBack = $.back;
        $.back = function() {
            if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
                viewApi.back();
            } else { //执行webview后退
                oldBack();
            }
        };
        //监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
        //第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
        var previewImageApi = mui.previewImage();
        view.addEventListener('pageBeforeShow', function(e) {
            console.log(mui.target)
            //              console.log(e.detail.page.id + ' beforeShow');
            console.log(e.detail.page)
            var currPage = e.detail.page;
            if(currPage.id == "receipt-detail"){
            //    var ReceiptDetailPage = Z(currPage).find("#receipt-container")
            //    //console.log(template(Tpl_listItem,[]))
            //    Z(ReceiptDetailPage).html( template("Tpl_listItem",{data:[{
            //        pid:"201511-210",
            //        pname:"餐费（已关闭）",
            //        amount:300,
            //        invoice:"发票",
            //        count:"12",
            //        project:"中国艰涩"
            //    },{
            //        pid:"201512-2310",
            //        pname:"建筑费",
            //        amount:100,
            //        invoice:"非发票",
            //        count:"12",
            //        project:"北京地铁"
            //    },{
            //        pid:"201511-210",
            //        pname:"服务费（已关闭）",
            //        amount:12300,
            //        invoice:"发票",
            //        count:"2",
            //        project:"历史起点"
            //    }]}));
                console.log(previewImageApi)
            }
        });
        view.addEventListener('pageShow', function(e) {
            mui('#loadingToast').hide();
            //console.log(e)
            //              console.log(e.detail.page.id + ' show');
        });
        view.addEventListener('pageBeforeBack', function(e) {
            //console.log(e)
            //              console.log(e.detail.page.id + ' beforeBack');
        });
        view.addEventListener('pageBack', function(e) {
            previewImageApi.empty();
            //console.log(e)
            //              console.log(e.detail.page.id + ' back');
        });
    })(mui);

    // 点击一条数据，进行处理
    mui(".mui-expense").on("tap",".mui-table-view-cell",function (ev) {
        ev.preventDefault();
        var currTarget = mui(this);
        // var pid = currTarget.data("pid");
        var pid = currTarget[0].getAttribute("data-pid");
        mui('#loadingToast').show();
    });

    //切换Tab去请求相应的数据
    mui("#main-panel").on("tap",".mui-control-item", function (ev) {
        var currPanel = ev.detail;
        var $activePanalID = mui(this)[0].getAttribute("href");
        var activePanel = mui($activePanalID)[0];
        common.panelNetworkHandler($activePanalID.substr(1));
    })

    //切换出offCanvas时，请求可选的企业列表
    var offcanvas =  mui(mui.classSelector('.off-canvas-wrap')).offCanvas();
    // 修改其再关闭侧滑菜单时，无法执行回调的操作
    var offcanvasCloseFn = function (callback) {
        offcanvas.close();
        if(callback){
            callback();
        }
    }
    var currCompanyId;
    document.querySelector('#companies-list').addEventListener('selected',function(e){
        var currSelectId = mui(e.detail.el)[0].getAttribute("cid");
        currCompanyId = currSelectId;

        //mui.ajax({
        //    url:"list?cid="+currCompanyId,
        //    type:"GET",
        //    dataType:"json",
        //    success: function (result) {
        //
        //    }
        //})
        //closeOffCanvas();
        //console.log(e.detail.el)
        var currElement = e.detail.el;
        offcanvasCloseFn(function () {
            mui.trigger(currElement,"offcanvas:hidden",{cid:currSelectId});
        });
    });
    // 自定义侧滑菜单事件
    var  offcanvasHideEvent = document.createEvent( "CustomEvent");
    offcanvasHideEvent.initCustomEvent( "offcanvas:hidden", true,true,1 );//false 改成true看看
    // 给起注册自定义的事件
    mui("#companies-list").on("offcanvas:hidden",".company-item",function(ev){
        // 根据传来的企业ID进行更新界面的数据
        var selectedCid = ev.detail.cid;
        console.log(selectedCid)
        console.log(document.querySelector(".mui-control-item"))

        // 发出请求未提交的报销单数据
        var firstTab = document.querySelector(".mui-control-item");
        var activeTab = document.querySelector(".mui-control-item.mui-active");
        var firstTabBody = document.querySelector("#"+firstTab.href.replace(/(.*?)#/g,""));
        var activeTabBody = document.querySelector("#"+activeTab.href.replace(/(.*?)#/g,""));
        var isSame = firstTab === activeTab;
        if(!isSame && !firstTab.classList.contains("mui-active")){
            firstTab.classList.add("mui-active");
            activeTab.classList.remove("mui-active");
            firstTabBody.classList.add("mui-active");
            activeTabBody.classList.add("mui-active");
        }
        common.panelNetworkHandler();

        //mui.trigger(document.querySelector(".mui-control-item"),"tap",{a:1})
        console.log(mui.targets)

    });

    var btnArray = ['确认', '取消'];
    mui('.mui-control-content').on('tap', '.mui-btn', function(event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认提交该条记录？', 'Hello MUI', btnArray, function(e) {
            if (e.index == 0) {
                li.parentNode.removeChild(li);
            } else {
                setTimeout(function() {
                    $.swipeoutClose(li);
                }, 0);
            }
        });
    });
})();

