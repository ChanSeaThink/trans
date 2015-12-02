window.onload=function(){
	//请求翻译表
		var table=[];
		$.ajax({
			url:"/getzh",
			type:"get",
			data:null,
			success:function(data){
				if(data.content){
					table=data;
				}
			},
			error:function(){
				console.log(arguments);
			}
		});
	//给全文添加font标签
		$("*").not("script").each(function(){
			if($(this).parents("pre").text()){
				return;
			}
			$(this).contents().filter(function(){return this.nodeType == 3;}).each(function(){
				if($(this).text().replace(/\s+/,"")){
					$(this).wrap("<font/>");
				}
			});
		});
		//段落分句
		$("font").each(function(){
			var html=$(this).prop("outerHTML").replace(/(\.|\?|\!)(\s)/g,"$1"+"</font><font class='stc a'>"+"$2");
			$(this).prop("outerHTML",html);
		});
		//找出句尾
		var os=$("body font").filter(function(){return $(this).text().match(/(\.|\?|\!|\:)$/)});
		var n=os.length;
		//从句尾开始往前连接词组
		for(var i=0;i<n;i++){
			if(os.eq(i).parent().is("script")){
				continue;
			}
			else if(os.eq(i).hasClass("stc")){
				continue;
			}
			var fragment="";
			connect(os.eq(i),fragment);
		}
		//删除只有特殊字符的句子
		$("body font").each(function(){
			if($(this).text().match(/[a-zA-Z]/)==null){
				$(this).contents().unwrap();
			}
		});
		//排序
			var count=0;
			$("body font").each(function(){
				//console.log(count++);
				$(this).attr("id",count++);
			});
	//函数
		//消除独立font
			function unFont(o){
				if(o.is("font")){
					o.contents().unwrap();
				}
				else{
					o.find("font").contents().unwrap();
				}
			}
		//判断是否是完整句子
			function isStc(a){
				return a.text().match(/(\.|\?|\!)(\s)/)!=null;
			}
		//把独立font连接起来
			function connect(o,fragment){
				var p=o.prev();
				if(!p.text()){
					if(o.is("font")){
						o.append(fragment);
					}
					else{
						o.before("<font src='stc'></font>");
						unFont(o);
						fragment=o.prop("outerHTML")+fragment;
						o.prev().append(fragment);
						o.remove();
					}
					return
				}
				if(o.is("font")){
					fragment=o.text()+fragment;
					//console.log(fragment);
				}
				else{
					unFont(o);
					fragment=o.prop("outerHTML")+fragment;
					//console.log(fragment);
				}
				o.remove();
				if(p.hasClass("stc")){
					p.append(fragment);
				}
				else{
					connect(p,fragment);
				}
			}
	//创建显示窗口
		var style1="display:none;position:absolute;"+
		"top:0;left:0;"+
		"padding:15px;"+
		"width:400px;"+
		"text-align:left;"+
		"color:white;"+
		"background:#515151;"+
		"box-shadow:0 0 20px #515151;";
		var style11="padding:5px;margin-bottom:5px;max-height:200px;overflow-y:auto;";
		var style12="display:inline-block;margin-top-5px;text-indent:5px;cursor:pointer;";
		var style2="display:none;";
		var style21="padding:5px;max-height:200px;color:#515151;background:white;overflow-y:auto;";
		var style22="display:inline-block;margin-left:165px;margin-top:15px;width:80px;height:25px;line-height:25px;text-align:center;color:white;background:#262626;cursor:pointer;";
		var style23="display:none;float:right;color:white;margin-top:15px;margin-right:50px;width:80px;height:25px;line-height:25px;";
		var style24="display:none;float:right;color:red;margin-top:10px;margin-right:50px;width:80px;height:25px;line-height:25px;";
		$("body").append("<div class='trans-box' contenteditable style='"+style1+
			"''><div style='text-indent:5px;'>原文:</div><div class='en' style='"+style11+
			"'></div><div class='launch' style='"+style12+
			"'>翻译</div><div class='box' style='"+style2+
			"'><div class='zh' style='"+style21+
			"' contenteditable='true'></div><div class='hint' style='"+style23+
			"'>提交成功！</div><div class='warn' style='"+style24+
			"'>提交失败！</div><div class='post' style='"+style22+
			"'>提交</div></div></div>");
		$(".trans-box").css("fontFamily","微软雅黑");
		$(".trans-box .en").css("fontFamily","Arial");
		$(".trans-box .zh").css("outline","none");
		$(".trans-box").css("outline","none");
		//把trans-box变为contenteditable即可定义焦点事件，所有子元素（除.zh）还原为非contenteditable
		$(".trans-box *").not(".zh").attr({"contenteditable":false});
		var state1=false,state2=false;
		$(".trans-box").focus(function(){
			state1=true;
		});
		$(".trans-box").blur(function(){
			state1=false;
			setTimeout(function(){
				if(!state2){
					$(".trans-box").hide();
				}
			},10);
		});
		$(".trans-box .zh").focus(function(){
			state2=true;
			if(flag){
				if($(this).text()=="尚未翻译..."){
					$(this).text("");
				}
			}
			$(".trans-box .hint,.trans-box .warn").hide();
			$(this).css("boxShadow","0 0 10px 1px #39e639");
		});
		$(".trans-box .zh").blur(function(){
			state2=false;
			if(flag){
				if($(this).text()==""){
					$(this).text("尚未翻译...");
				}
			}
			$(this).css("boxShadow","none");
			setTimeout(function(){
				if(!state1){
					$(".trans-box").hide();
				}
			},10);
		});
	//窗口自带事件
		var status=false;//status表示悬浮窗的状态
		$("body").on("click",".trans-box .launch",function(){
			$(".trans-box .launch").hide();
			$(".trans-box .box").show();
			status=true;
		});
		$("body").on("mousedown",".trans-box .post",function(){
			$(this).css({"background":"#313131","color":"#f2f2f2"});
		});
		$("body").on("mouseup",".trans-box .post",function(){
			$(this).css({"background":"#262626","color":"white"});
		});
		$(".trans-box .zh")[0].onpaste=function(e){
			e.preventDefault();
			var text=e.clipboardData.getData("text/plain");
			if(text){
				document.execCommand("insertText",false,text);
			}
		};
	//显示原文（翻译）事件
		var time,that;
		var id,en,zh;
		var flag;
		$("html").on("mouseenter","font",function(e){
			e.stopPropagation();
			clearTimeout(time);
			that=$(this);
			var x=e.clientX,y=e.clientY;
			$(document).mousemove(function(e){
				x=e.clientX?e.clientX:x;
				y=e.clientY?e.clientY:y;
			});
			time=setTimeout(function(){
				$(document).off("mousemove");
				y=y+document.body.scrollTop+20;
				var h=parseInt($(".trans-box").css("height"));
				if(y+h+50>document.body.scrollTop+window.innerHeight){
					y=y-h-70;
				}
				x+=20;
				var w=400;
				if(x+w+50>document.body.clientWidth){
					x=x-w-60;
				}
				id=that.attr("id");
				en=that.text().replace(/\n/g," ");
				zh="尚未翻译...";
				//*
				var i;
				for(i=0;i<table.length;i++){
					if(table[i][0]==id){
						zh=table[i][1];
					}
				}//*/
				if(i==table.length){
					flag=true;
				}
				else{
					flag=false;
				}
				$(".trans-box .en").text(en);
				$(".trans-box .zh").text(zh);
				$(".trans-box .hint").hide();
				$(".trans-box .warn").hide();
				$(".trans-box .box").hide();
				$(".trans-box .launch").show();
				$(".trans-box").css({"left":x,"top":y}).show();
				status=false;
			},600);
			//console.log($(this).text().replace(/\n/g," "));
		});
		$("html").on("mouseleave","font",function(e){
			e.stopPropagation();
			clearTimeout(time);
			$(document).off("mousemove");
			time=setTimeout(function(){
				if(!status){
					$(".trans-box").hide();
				}
			},300);
		});
		$("html").on("mouseenter",".trans-box",function(){
			clearTimeout(time);
		});
		$("html").on("mouseleave",".trans-box",function(){
			if(!status){
				$(".trans-box").hide();
			}
		});
		$("body").on("click",function(e){
			if($(this).parents(".trans-box").text()){
				alert(1)
			}
		});
	//post翻译后的翻译
		$("body").on("click",".trans-box .post",function(){
			zh=$(".trans-box .zh").text();
			$.ajax({
				url:"/savezh",
				type:"post",
				data:{id:id,en:en,zh:zh},
				success:function(data){
					if(data.state){
						$(".trans-box .warn").hide();
						$(".trans-box .hint").show();
					}
					else{
						$(".trans-box .hint").hide();
						$(".trans-box .warn").show();
					}
				},
				error:function(){
					console.log(arguments);
				}
			});
		});
}