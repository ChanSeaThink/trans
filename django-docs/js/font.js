window.onload=function(){
	//请求翻译表
		var table=[];
		$.ajax({
			url:"/getzh",
			type:"get",
			data:null,
			cache:false,
			success:function(data){
				if(data.content){
					table=data.content;
				}
			},
			error:function(){
				console.log(arguments);
			}
		});
	//白名单
		var whiteList=[
			" e.g.",
			" vs.",
			" i.e."
		];
		var
			whiteListString1="",
			whiteListString2="";
		for(var i=0;i<whiteList.length;i++){
			whiteListString1+=whiteList[i]+"\|";
			whiteListString2+="<"+whiteList[i]+">"+"\|";
		}
		whiteListString1=whiteListString1.slice(0,-1);
		whiteListString2=whiteListString2.slice(0,-1);
	//给全文添加font标签
		//所有文本添加font标签
			$("*").not("script").each(function(){
				if($(this).is("pre")||$(this).parents("pre").text()){
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
				var html=$(this).prop("outerHTML");
				if(html.match(whiteListString1)){
					var pattern=new RegExp(whiteListString1,"gi");
					html=html.replace(pattern,"<$&>");
				}
				html=html.replace(/(\.|\?|\!)(\s)/g,"$1"+"</font><font class='stc a'>"+"$2");
				for(var i=0;i<whiteList.length;i++){
					var pattern=new RegExp("<\("+whiteList[i]+"\)>","gi");
					html=html.replace(pattern,"$1");
				}
				$(this).prop("outerHTML",html);
			});
		//找出句尾
			var os=$("body font").filter(function(){return $(this).text().match(/(\.|\?|\!|\:)$/)});
			var osn=os.length;
		//从句尾开始往前连接词组
			for(var i=0;i<osn;i++){
				if(os.eq(i).parent().is("script")){
					continue;
				}
				else if(os.eq(i).hasClass("stc")){
					continue;
				}
				var fragment="";
				connect(os.eq(i),fragment);
			}
		//li元素合并成一句
			$("li").each(function(){
				var li=$(this).contents().not("ul");
				li=li.filter(function(){return !exist($(this),"pre")});
				var html=li.text();
				if(html.match(whiteListString1)){
					var pattern=new RegExp(whiteListString1,"gi");
					html=html.replace(pattern,"<$&>");
				}
				if(html.match(/[^.][\x7c!?.]\s/)){
					return;
				}
				var len=li.length;
				connect(li.eq(len-1),"");
			});
		//删除只有特殊字符的句子
			$("body font").each(function(){
				if($(this).text().match(/[a-zA-Z,]/)==null){
					$(this).contents().unwrap();
				}
			});
		//h标题元素合并成一句
			$(":header").each(function(){
				var h=$(this).contents();
				var len=h.length;
				if(h.eq(len-1).is("font")||exist(h.eq(len-1),"font")){
					connect(h.eq(len-1),"");
				}
				else{
					connect(h.eq(len-2),"");
				}
			});
		//p元素合并成一句
			$("p,dt,dd").each(function(){
				if(!$(this).text()||$(this).parents("font.stc").text()||exist($(this),"font.stc")){
					return;
				}
				unFont($(this));
				var html="<font class='stc'>"+$(this).html()+"</font>";
				$(this).html(html);
			});
		//断句往后和class为非stc的font元素合并
			$("font.stc").each(function(){
				var lastFont=$(this),lfflag=false;
				while((lastFont.next().is("font")||exist(lastFont.next(),"font"))&&!lastFont.next().hasClass("stc")&&!lastFont.next().find("font").hasClass("stc")){
					lastFont=lastFont.next();
					lfflag=true;
				}
				/*while(!lfflag){
					lastFont=lastFont.parent();
					if(lastFont.find(".stc").text()||lastFont.next().find(".stc").text()){
						break;
					}
					while((lastFont.next().is("font")||exist(lastFont.next(),"font"))&&!lastFont.next().hasClass("stc")&&!lastFont.next().find("font").hasClass("stc")){
						lastFont=lastFont.next();
						lfflag=true;
					}
				}*/
				if(lfflag){
					connect(lastFont,"");
				}
			});
		//排序
			var count=0;
			$("body font").each(function(){
				$(this).attr("id",count++);
			});
	//函数
		//遍历是否存在某个指定元素
			function exist(a,b){
				if(a.children(b).text()){
					return true;
				}
				else{
					var len=a.children().length;
					for(var i=0;i<len;i++){
						if(exist(a.children().eq(i),b)){
							return true;
						}
					}
				}
				return false;
			}
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
				if(p.length==0){
					if(o.is("font")){
						o.addClass("stc").append(fragment);
					}
					else{
						o.before("<font class='stc'></font>");
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
		//子文本节点查找
			function find(a){
				if(!a.children().text()){
					return a;
				}
				else{
					return find(a.children());
				}
			}
		//a,tt以外元素剥离
			var efn=0;
			function eleFilter(a){
				/*/方法一
					if(!a.children().text()){
						return;
					}
					a.children().not("a,tt,em").each(function(){
						$(this).prop("outerHTML",$(this).html());
					});
					var b=a.children("a,tt,em");
					if(!b.text()){
						return;
					}
					if(b.length==1&&a.contents().filter(function(){return this.nodeType==3}).length==0){
						b.contents(0).unwrap();
						eleFilter(a);
						return;
					}
					var n=efn++;
					b.each(function(){
						eleFilter($(this));
						$(this).prop("outerHTML","<c"+n+">"+$(this).html()+"</c"+n+">");
						n=efn++;
					});
				//*/
				//*方法二
					var ac=a.find("*");
					var acOut=ac.filter(function(){return this.tagName=="A"?false:(this.tagName=="TT"?false:(this.tagName=="EM"?false:true))});
					var acIn=ac.filter(function(){return this.tagName=="A"?true:(this.tagName=="TT"?true:(this.tagName=="EM"?true:false))});
					acOut.each(function(){
						if($(this).contents(0).text()){
							$(this).contents(0).unwrap();
						}
						else{
							$(this).remove();
						}
					});
					var n=0,tag="",arr=[];
					acIn.each(function(){
						tag=$(this).prop("outerHTML").replace($(this).html(),"");
						if(n==0||$(this).text()!=$(this).parent().text()){
							arr[n]=tag;
							$(this).wrap("<c"+(n++)+">").contents(0).unwrap();
						}
						else{
							var tag2=arr[n-1];
							arr[n-1]=tag2.replace(/^(<.*?)(<\/.+)/,"$1")+tag+tag2.replace(/^(<.*?)(<\/.+)/,"$2");
							$(this).contents(0).unwrap();
						}
					});
					return arr;
				//*/
			}
		//文本节点递归操作
			function recursionText(a){
				var textnode=a.contents().filter(function(){return this.nodeType==3});
				var elenode=a.contents().filter(function(){return this.nodeType==1});
				if(textnode.length){
					textnode.each(function(){
						this.nodeValue=this.nodeValue.replace(/>/g,"&gt;").replace(/</g,"&lt;");
					});
				}
				if(elenode.length){
					elenode.each(function(){
						recursionText($(this));
					});
				}
				else{
					return;
				}
			}
		//带有a元素的html格式转换为翻译格式
			var state=true;
			var origin="";
			function htmlToTrans(a){
				efn=0;
				if(a.find("a,tt,em").text()){
					var oHtml=a.html();
					eleFilter(a);
					recursionText(a);
					origin=a.html().replace(/&amp;gt;/g,"&gt;").replace(/&amp;lt;/g,"&lt;");
					var b=origin.replace(/&gt;/g,">").replace(/&lt;/g,"<");
					a.html(oHtml);
					state=true;
					return b;
					//var str=that.html().replace(/<a.*>([^>]+[^<]+)(<[^a]|[^\/]a|[^\/][^a])*<\/a>/g,"<a>$1</a>");
				}
				else{
					origin=a.text().replace(/>/g,"&gt;").replace(/</g,"&lt;");
					state=false;
					return a.text();
				}
			}
		//带有a元素的翻译转换为html格式
			function transToHtml(a,b){
				var ele=$("<div></div>");
				ele.html(a);
				var arr=eleFilter($("<div>"+b.html()+"</div>"));
				var bc=b.find("a,tt,em");
				var ec=ele.find("*");
				if(ele.children("c0").text()){
					if(bc.text()){
						var n=ec.length;
						for(var i=0;i<n;i++){
							var target=ec.eq(i);
							var bn=ec.eq(i).prop("tagName").replace(/c/i,"");
							bn=parseInt(bn);
							var tag=arr[bn];
							/*多<c>标签无意义嵌套时的标签转换方法
							while(target1.children("a,tt,em").text()){
								target1=target1.children("a,tt,em").eq(0);
								tag=tag.replace(/^(<.*?)(<\/.+)/,"$1")+target1.prop("outerHTML").replace(target1.html(),"")+tag.replace(/^(<.*?)(<\/.+)/,"$2");
							}*/
							target.wrap(tag).contents(0).unwrap();
						}
					}
					b.html(ele.html());
				}
				else{
					b.text(a);
				}
				return ele.html();
			}
		//把原始格式替换进翻译好的句子中
			function formatZh(a,b){
				var arr=a.match(/(<)|(>)|(&lt;)|(&gt;)/g);
				var arr2=[],arr_count=0,i=0;
				while(b.charAt(i)){
					if(b.charAt(i).match(/[<>]/)){
						b=b.slice(0,i)+arr[arr_count++]+b.slice(i+1);
					}
					i++;
				}
				return b;
			}
		//用新的格式把翻译格式化
			function formatTrans(a,b){
				var ele1=$("<div>"+a+"</div>");
				var ele2=$("<div>"+b+"</div>");
				var pattern=/\u4e00-\u9fa5/;
				var ecIn=ele1.find("*").filter(function(){return $(this).text()!=$(this).parent().text()||$(this).prop("outerHTML")==ele1.html()});
				var ecOut=ele1.find("*").filter(function(){return $(this).prop("outerHTML")!=ele1.html()&&$(this).text()==$(this).parent().text()});
				var ec2=ele2.find("*");
				if(ecOut.length!=0){
					ecOut.each(function(){
						$(this).contents(0).unwrap();
					});
				}
				if(ec2.length!=0&&ec2.length==ecIn.length){
					var n=ec2.length;
					if(n==1){
						ecIn.eq(0).wrap("<c0>").contents(0).unwrap();
						return ele1.html();
					}
					else{
						var zhFlag,total=0,zhCount=n,record=-1,array=[],arrFlag=false;
						//array记录已匹配的c标签，防止标签内容相同时重复匹配，相同内容标签默认按顺序匹配
						for(var i=0;i<n;i++){
							zhFlag=false;
							for(var j=0;j<n;j++){
								if(ecIn.eq(i).text()==ec2.eq(j).text()){
									for(var k=0;k<array.length;k++){
										if(j==array[k]){
											arrFlag=true;
										}
									}
									if(arrFlag){
										arrFlag=false;
										continue;
									}
									ecIn.eq(i).wrap("<c"+j+">").contents(0).unwrap();
									total+=j;
									zhCount--;
									zhFlag=true;
									array.push(j);
									break;
								}
							}
							if(!zhFlag){
								record=i;
							}
						}
						if(zhCount>1){
							return false;
						}
						else{
							if(zhCount==1){
								ecIn.eq(record).wrap("<c"+((n*(n-1))/2-total)+">").contents(0).unwrap();
							}
							return ele1.html();
						}
					}
				}
				else if(ec2.length==0&&ecIn.length==0){
					return a;
				}
				else{
					return false;
				}
			}
	//把table数据覆盖进页面
		var interval=setInterval(function(){
			if(table){
				clearInterval(interval);
				var font_id=0,that,array=[],newZh;
				for(var i=0;i<table.length;i++){
					font_id=table[i][0];
					that=$("font#"+font_id);
					table[i][2]=that.html();
					table[i][3]=that.text();
					/*格式化翻译
						htmlToTrans(that);
						table[i][4]=origin;
						newZh=formatTrans(table[i][1],table[i][4]);
						if(newZh){
							table[i][1]=newZh;
						}
						else{
							array.push(font_id);
						}
					//*/
					transToHtml(table[i][1],that);
					that.addClass("ripe");
				}
				/*格式化翻译
					var table2=[];
					for(var i=0;i<table.length;i++){
						table2[i]=[];
						table2[i][0]=table[i][0];
						table2[i][1]=table[i][1];
					}
					var formData={
						content:table2,
						id:array
					};
					$.ajax({
						url:"/sendenst",
						type:"post",
						data:JSON.stringify(formData),
						success:function(data){
							console.log("发送成功");
						},
						error:function(){
							console.log(arguments);
						}
					});
				//*/
			}
		},1000);
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
		var style22="display:inline-block;margin-left:113px;margin-top:15px;width:80px;height:25px;line-height:25px;text-align:center;color:white;background:#262626;cursor:pointer;";
		var style23="display:none;float:right;color:white;margin-top:15px;margin-right:50px;width:80px;height:25px;line-height:25px;";
		var style24="display:none;float:right;color:red;margin-top:15px;margin-right:50px;width:80px;height:25px;line-height:25px;";
		var style25="display:none;float:left;margin-top:15px;margin-left:0px;height:25px;line-height:25px;text-indent:4px;cursor:pointer;";
		var style26="display:none;float:left;margin-top:15px;margin-left:0px;height:25px;line-height:25px;text-indent:4px;cursor:pointer;";
		$("body").append("<div class='trans-box' style='"+style1+
			"''><div class='box-title' style='text-indent:5px;'>原文：</div><div class='en' style='"+style11+
			"'></div><div class='launch' style='"+style12+
			"'>翻译</div><div class='box' style='"+style2+
			"'><div class='zh' style='"+style21+
			"' contenteditable='true'></div><div class='restore1' style='"+style25+
			"'>显示格式</div><div class='restore2' style='"+style26+
			"'>显示原文</div><div class='hint' style='"+style23+
			"'>提交成功！</div><div class='warn' style='"+style24+
			"'>提交失败！</div><div class='post' style='"+style22+
			"'>提交</div></div></div>");
		$(".trans-box").css("fontFamily","微软雅黑");
		$(".trans-box .en").css("fontFamily","Arial");
		$(".trans-box .zh").css("outline","none");
		$("head").append("<style>.trans-box .en tt{color:#46cdcf;} .restore1:hover,.restore2:hover{color:#46cdcf;}</style>");
	//显示原文（翻译）事件
		var time,that;
		var id,zh,en,en_text;
		var flag;
		$("html").on("mouseenter","font",function(e){
			if(status){
				return
			}
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
				if(that.hasClass("ripe")){
					for(var i=0;i<table.length;i++){
						if(table[i][0]==id){
							en=table[i][2];
							en_text=table[i][3];
							break;
						}
					}
				}
				else{
					en=that.html();
					en_text=that.text();
				}
				if(that.hasClass("ripe")){
					for(var i=0;i<table.length;i++){
						if(table[i][0]==id){
							origin=table[i][1];
							zh=origin.replace(/&gt;/g,">").replace(/&lt;/g,"<");
							flag=false;
							break;
						}
					}
				}
				else{
					zh=htmlToTrans(that);
					if(!state){
						zh="尚未翻译...";
					}
					flag=true;
				}
				htmlToTrans($("<div>"+en+"</div>"));
				if(state){
					$(".trans-box .restore1").show();
					$(".trans-box .post").css("margin-left","108px");
				}
				else{console.log(en)
					$(".trans-box .restore1").hide();
					$(".trans-box .post").css("margin-left","160px");
				}
				$(".trans-box .en").html(en);
				$(".trans-box .zh").text(zh);
				$(".trans-box .hint").hide();
				$(".trans-box .warn").hide();
				$(".trans-box .box").hide();
				$(".trans-box .restore2").hide();
				$(".trans-box .launch").show();
				$(".trans-box .box-title").text("原文：");
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
	//窗口自带事件
		var clickFlag=true;
		$("body").on("click",".trans-box,.gtx-bubble",function(e){
			e.stopPropagation();
		});
		$("body").on("mousedown","#gtx-trans",function(){
			clickFlag=false;
		});
		$("body").on("click",function(e){
			if(clickFlag){
				if(status){
					$(".trans-box").hide();
					status=false;
				}
			}
			else{
				clickFlag=true;
			}
		});
		$(".trans-box .zh").focus(function(){
			if(flag){
				if($(this).text()=="尚未翻译..."){
					$(this).text("");
				}
			}
			$(".trans-box .hint,.trans-box .warn").hide();
			$(this).css("boxShadow","0 0 10px 1px #39e639");
		});
		$(".trans-box .zh").blur(function(){
			if(flag){
				if($(this).text()==""){
					$(this).text("尚未翻译...");
				}
			}
			$(this).css("boxShadow","none");
		});
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
		//显示格式和显示原文
			var enHTML="";
			$("body").on("click",".trans-box .restore1",function(){
				enHTML=$(".trans-box .en").html();
				$(this).toggle();
				$(this).siblings(".restore2").toggle();
				$(".trans-box .box-title").text("格式：");
				$(".trans-box .en").text(htmlToTrans($(".trans-box .en")));
			});
			$("body").on("click",".trans-box .restore2",function(){
				$(this).toggle();
				$(this).siblings(".restore1").toggle();
				$(".trans-box .box-title").text("原文：");
				$(".trans-box .en").html(enHTML);
			});
	//post翻译后的翻译
		$("body").on("click",".trans-box .post",function(){
			zh=$(".trans-box .zh").text();
			zh=zh=="尚未翻译..."?"":formatZh(origin,zh);
			$.ajax({
				url:"/savezh",
				type:"post",
				//headers:{"X-CSRFToken":"1"},
				data:{id:id,en:htmlToTrans($("<div>"+en+"</div>")),zh:zh},
				success:function(data){
					if(data.state){
						$(".trans-box .warn").hide();
						$(".trans-box .hint").show();
						var i,f=$("font#"+id);
						if(f.hasClass("ripe")){
							for(i=0;i<table.length;i++){
								if(table[i][0]==id){
									table[i][1]=zh;
									transToHtml(zh,f);
									break;
								}
							}
						}
						else{
							f.addClass("ripe");
							transToHtml(zh,f);
							table.push([id,zh,en,en_text]);
						}
						flag=false;
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