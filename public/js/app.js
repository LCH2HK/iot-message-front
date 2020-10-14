// JavaScript Document
// var service="http://moa.simulate.com/sxdtmoadev/handler.ashx";
var service = '/ecidi-cmp'
var bt = baidu.template
// 全局核心配置对象 modified by ma_yj at 2019-09-04, 方正特有的不事先写在dataConfigs里
var dataConfigs = {
  isCommon: true,
  // "path": "",
  formName: '',
  // "bizObjId": "",
  // "detailObjIds": "",
  // "formId": "",
  // "flowId": "",
  isConsign: true,
  // "belongSys": "",
  // "webServer": "",
  items: [],
  flowConfig: {}
}
var loadSelected = ''
var hasDefault = 'false'
var words = ['boat', 'bear', 'dog', 'drink', 'elephant', 'fruit']

function nnn () {
  $().ready(function () {
    // $('#loginModal').modal('show')
    var user = window.localStorage.getItem('User')
    // if (user != "" && user != null)
    // 	$("#User").html(user);
    // else
    // 	$('#loginModal').modal('show');
    // modified by ma_yj 2019-09-04, 主表数据库下拉框内容变化，已用vue重写
    // $("#maindb").change(function () {
    // var db = $("#maindb").val();
    // $.ajax({
    // 	headers: {
    // 		"X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    // 	},
    // 	data: "dbName=" + db,
    // 	type: 'POST',
    // 	url: service + "/codegenerate/gettable",
    // 	success: function (data) {
    // 		tool.drawSelect1("mainformlist", data);
    // 	}
    // })
    // })

    // modified by ma_yj 2019-09-04, 点击主表“导入字段”按钮，已用vue重写
    // $("#pt_import").bind("click", function () {
    // var db = $("#maindb").val();
    // var table = $("#mainformlist").val();
    // $.ajax({
    // 	headers: {
    //         "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    //     },
    // 	type: 'POST',
    // 	data: "dbName=" + db + "&tableName=" + table,
    // 	url: service + "/codegenerate/getallparam",
    // 	dataType: "json",
    // 	success: function (data) {debugger
    // 		var html = tool.drawMainTable(data);
    // 		$("#pt_table table").find("tr:not('.warning')").remove();
    // 		$("#pt_table table").append(html)
    // 		$("#pt_table").slideDown();
    // 	}
    // })
    // })
    $('#loginbtn').bind('click', function () {
      var user = $('#userName').val()
      $('#User').html(user)
      window.localStorage.setItem('User', user)
      $('#loginModal').modal('hide')
    })
    // modified by ma_yj at 2019-09-04, 载入已经配置的移动端表单事件，已在vue中重写
    // $("#loadbtn").bind("click", function () {
    // 	var flowid = $("#flowlist").val();
    // 	$.ajax({
    // 		headers: {
    //             "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    //         },
    // 		url: service + '/app/formGenerate/queryById' + "?id=" + flowid,
    // 		dataType: "json",
    // 		success: function (data) {
    // 			var config = JSON.parse(data.result.dataConfigs).dataconfigs;
    // 			if (config != null) {
    // 				// dataConfigs = JSON.parse(config);
    // 				dataConfigs = config;
    // 			    tool.drawLeftMainTable(dataConfigs.items);
    // 				$("#mainconfig").resetObjectForm(dataConfigs);
    // 				$("#settings .panel-default").remove();
    // 				for (o in dataConfigs.flowConfig) {
    // 					tool.drawLeftRuleTable(dataConfigs.flowConfig[o]);
    // 				}
    // 				$("#loadDetail").val(unescape(dataConfigs.loadDetail == undefined ? "" : dataConfigs.loadDetail));
    // 				$("#pageInit").val(unescape(dataConfigs.pageInit == undefined ? "" : dataConfigs.pageInit));
    // 				$("#checkForm").val(unescape(dataConfigs.checkForm == undefined ? "" : dataConfigs.checkForm));
    // 				$("#setModifyData").val(unescape(dataConfigs.setModifyData == undefined ? "" : dataConfigs.setModifyData));
    // 				$('#loadModal').modal('hide')
    // 			}
    // 			else {
    // 				alert("表单未配置！无法载入")
    // 			}
    // 		}
    // 	})
    // })

    // modified by ma_yj 2019-09-04, 配置点击事件（主表），已用vue重写
    // $("#configBtn").bind("click",function(){
    // var promise = $.ajax({
    // 	headers: {
    // 		"X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    // 	},
    // 	url: service + '/codegenerate/getdbname',
    // 	method: 'GET',
    // 	success: function (data) {
    // 		tool.drawSelect1("maindb", data);
    // 	}
    // })
    // promise.then(function(){
    // 	var db = $("#maindb").val();
    // 	$.ajax({
    // 		headers: {
    // 			"X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    // 		},
    // 		data: "dbName=" + db,
    // 		type: 'POST',
    // 		url: service + "/codegenerate/gettable",
    // 		success: function (data) {
    // 			tool.drawSelect1("mainformlist", data);
    // 		}
    // 	})
    // })
    // })

    // 新增点击事件（明细表）
    $('#configDtlBtn').bind('click', function () {
      var promise = $.ajax({
        headers: {
          'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
        },
        url: service + '/codegenerate/getdbname',
        method: 'GET',
        success: function (data) {
          tool.drawSelect1('detaildb', data)
        }
      })
      promise.then(function () {
        var db = $('#detaildb').val()
        $.ajax({
          headers: {
            'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          data: 'dbName=' + db,
          type: 'POST',
          url: service + '/codegenerate/gettable',
          success: function (data) {
            tool.drawSelect1('detailformlist', data)
          }
        })
      })
    })

    // modified by ma_yj 2019-09-04, 主表配置的保存事件，已用vue重写
    // $("#mainsavebtn").bind("click", function () {
    // 	var data = tool.packMainTableData();
    // 	tool.drawLeftMainTable(data);
    // 	$('#myModal').modal('hide')
    // })

    // modified by ma_yj at 2019-09-04, 左侧面板基本选项卡的保存事件，已在vue重写
    // $("#mainconfigbtn").click(function () {
    // 	var arr = $("#mainconfig").serializeArray();
    // 	for (var i = 0; i < arr.length; i++) {
    // 		dataConfigs[arr[i].name] = arr[i].value;
    // 	}
    // 	alert("保存成功！");
    // })
    $('#customjsbtn').click(function () {
      var arr = $('#customjs').serializeArray()
      for (var i = 0; i < arr.length; i++) {
        dataConfigs[arr[i].name] = escape(arr[i].value)
      }
      alert('保存成功！')
    })

    $('#detaildb').change(function () {
      var db = $('#detaildb').val()
      $.ajax({
        headers: {
          'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
        },
        url: service + '/codegenerate/gettable',
        data: 'dbName=' + db,
        type: 'POST',
        success: function (data) {
          tool.drawSelect1('detailformlist', data)
        }
      })
    })

    $('#detailformlist').change(function () {
      var val = $(this).val()
      val = val.toUpperCase()
      $('#detailId').val(val)
    })

    $('#dt_import').bind('click', function () {
      var db = $('#detaildb').val()
      var table = $('#detailformlist').val()
      $.ajax({
        headers: {
          'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
        },
        type: 'POST',
        data: 'dbName=' + db + '&tableName=' + table,
        url: service + '/codegenerate/getallparam',
        success: function (data) {
          var html = tool.drawDetailTable(data)
          $('#dt_table table').find('tr:not(\'.warning\')').remove()
          $('#dt_table table').append(html)
          $('#dt_table').slideDown()
        }
      })
    })
    $('#detailsavebtn').bind('click', function () {
      var data = tool.packDetailTableData()
      tool.drawLeftDetailTable(data)
      $('#myModal2').modal('hide')
    })

    $('#maindb,#detaildb').change()
    /*
		$("#testbtn").click(function(){
			var downUrl="http://moa.ecidi.com:8081/weixininterface/download/0000b7cfcef91ec3ceec7a86a642bab0.DOC";
			$.ajax({
				url:'http://websp.ecidi.com:8007/dcs.web/onlinefile',
				data:{
					"downloadUrl" : downUrl,
					convertType : "0",
					isCopy:'1',
					isPrint:'0',
					isShowTitle:'0',
					wmContent :'ECIDI沈舒男'
				},
				dataType : "json",
				type:"post",
				success:function(data){
					if(data.result==0)
						window.open(data.data[0]);
				}
			})
		}) */

    // 表删除行的操作
    // $("#pt_table table,#dt_table table,#rule_table table").delegate(".btn-danger", "click", function () {
    // 	$(this).parents("tr").fadeOut(500, function () {
    // 		$(this).remove();
    // 	});
    // });
    $('#pt_clean').click(function () {
      $('#pt_table tr:gt(0)').each(function () {
        if ($(this).find('td:eq(3) input').val() == '') {
          $(this).remove()
        }
      })
    })

    $('#dt_table table').delegate('.glyphicon-arrow-up', 'click', function () {
      var prev = $(this).parents('tr').prev()
      if (prev.hasClass('warning')) { return false }
      $(this).parents('tr').insertBefore(prev)
    })
    $('#dt_table table').delegate('.glyphicon-arrow-down', 'click', function () {
      var next = $(this).parents('tr').next()
      $(this).parents('tr').insertAfter(next)
    })
    $('#detailtable').delegate('.btn-danger', 'click', function () {
      var id = $(this).val()
      $('div[id^=' + id + ']').remove()
    })
    // modified by ma_yj at 2019-09-06, 修改流程环节配置，已在vue里重写
    // $("#settings").delegate(".btn-primary", "click", function () {
    // 	var id = $(this).attr("rel");
    // 	var data = $("#" + id + "_div").data("data");
    // 	$('#myModal3').modal('show');
    // 	$("#ruleform").resetObjectForm(data);
    // 	for (o in data.items) {
    // 		var obj = data.items[o];
    // 		obj.items = tool.getPageFields();
    // 		var html = bt(_DOM_TPL.ruletable, obj);
    // 		$("#rule_table table").append(html);
    // 	}
    // });

    $('#settings').delegate('.btn-danger', 'click', function () {
      $(this).parents('.panel-default').remove()
    })

    $('#genbtn').click(function () {
      var html = ''
      $('#page1>div').each(function () {
        var obj = $(this).clone()
        obj.removeAttr('style').removeClass('ui-draggable').removeClass('ui-draggable-handle')
        obj.find('div[id$=_ctl]').html('')
        html += obj[0].outerHTML + '\n'
      })
      $('#genBox').text(HTMLFormat(html))
      $('#genModal').modal('show')
    })

    $('#page1').sortable({
      revert: false
    }).droppable({
      drop: function (event, ui) {
        recycleImage(ui.draggable)
      }
    })

    // item的点击事件
    $('#page1').delegate('>div', 'click', function () {
      // debugger
      $('#page1>div').removeClass('actived')
      $(this).addClass('actived')
      var data = $(this).data('data')
      $('#basicform').resetObjectForm(data)
      if (typeof (data.prop) == 'object') {	// 根据字段配置信息展示属性 TODO
        $('#propform').resetObjectForm(data.prop)
        if (typeof (data.prop.items) != 'undefined') {
          var val = ''
          for (o in data.prop.items) {
            val += data.prop.items[o].text + ':' + data.prop.items[o].value + '\n'
          }
          if (val != '') {
            val = val.substring(0, val.length - 1)
          }
          $('#items').val(val)
        }
        if (data.prop.isSubmit == 'on') { $('#isSubmit').prop('checked', 'checked') } else { $('#isSubmit').removeProp('checked') }
      } else {
        // $("#hasDefaultValueInput").attr("value", "false"); TODO
        $('#propform')[0].reset()
      }
      $('#type').change()
    })

    // 明细表模态窗口关闭后，清空模态窗里表格的内容，便于下次新增
    $('#myModal2').on('hidden.bs.modal', function () {
      $('#myModal2 form')[0].reset()
      $('#dt_table tr:gt(0)').remove()
    })
    // modified by ma_yj at 2019-09-06, 流程配置面板关闭时触发，清空表格内容，已在vue重写
    // $('#myModal3').on('hidden.bs.modal', function () {
    // 	$('#myModal3 form')[0].reset();
    // 	$("#rule_table tr:gt(0)").remove();
    // })

    // modified by ma_yj at 2019-09-05, 载入现有配置，已在vue中重写
    // $('#loadModal').on('show.bs.modal', function () {
    // 	$.ajax({
    // 		headers: {
    //             "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
    //         },
    //         url: service + "/app/formGenerate/getFlowList",
    // 		datatype: "json",
    // 		success: function (data) {
    // 			tool.drawSelect("flowlist", data);
    // 		}
    // 	})
    // })

    // modified by ma_yj 2019-09-04, 字段属性保存事件，已在vue中重写
    // $("#propsavebtn").click(function () {
    // 	var id = $("#Id").val();
    // 	if (id == "")
    // 		return;
    // 	var basicform = $("#basicform").serializeArray();
    // 	var propform = $("#propform").serializeArray();
    // 	var oD = $("#" + id + "_div").data("data");
    // 	var obj = oD, prop = oD.prop;
    // 	for (o in basicform) {
    // 		obj[basicform[o].name] = basicform[o].value;
    // 	}
    // 	for (o in propform) {
    // 		if (propform[o].value != "") {
    // 			if (typeof (prop) != "object")
    // 				prop = {};
    // 			if (propform[o].name == "items") {
    // 				//如果是枚举项，需要单独处理
    // 				var arr = propform[o].value.split("\n");
    // 				var items = [];
    // 				for (i in arr) {
    // 					var item = {};
    // 					var itemarr = arr[i].split(":");
    // 					item.text = itemarr[0];
    // 					item.value = itemarr[1];
    // 					items.push(item);
    // 				}
    // 				prop.items = items;
    // 			}
    // 			else
    // 				prop[propform[o].name] = propform[o].value;
    // 		}
    // 	}
    // 	//组合两个对象
    // 	obj.prop = prop;
    // 	//重绘HTML结构
    // 	var html = tool.drawItem(obj);
    // 	//写入到dom对象上
    // 	$("#" + obj.Id + "_div").replaceWith(html);
    // 	$("#" + obj.Id + "_div").data("data", obj)
    // 	//拼装submitDatas
    // 	/*var isSubmit=$("#isSubmit").prop("checked");
    // 	if(isSubmit){
    // 		var oData={};
    // 		oData.Id=obj.Id;
    // 		oData.type=obj.type;
    // 		var isExist=false;
    // 		for(o in dataConfigs.submitDatas){
    // 			if(dataConfigs.submitDatas[o].Id==oData.Id){
    // 				dataConfigs.submitDatas.splice(o,1,oData);
    // 				isExist=true;
    // 				break;
    // 			}
    // 		}
    // 		if(!isExist){
    // 			dataConfigs.submitDatas.push(oData);
    // 		}
    // 	}
    // 	else{
    // 		for(o in dataConfigs.submitDatas){
    // 			if(dataConfigs.submitDatas[o].Id==obj.Id){
    // 				dataConfigs.submitDatas.splice(o,1);
    // 				break;
    // 			}
    // 		}
    // 	}*/
    // 	$("#alert-suc").slideDown("fast", function () {
    // 		$(this).delay(500);
    // 		$(this).fadeOut(1000);
    // 	})
    // })
    // modified by ma_yj at 2019-09-06, item删除按钮事件，已在vue中重写
    // $("#itemdelbtn").click(function () {
    // 	var id = $("#Id").val();
    // 	/*var data=$("#page1 #"+id+"_div").data("data");
    // 	//如果删除的条目有勾选了需要提交，则先从dataconfigs里删掉该数据
    // 	if(typeof(data.prop.isSubmit)!="undefined"){
    // 		if(data.prop.isSubmit=="on"){
    // 			for(o in dataConfigs.submitDatas){
    // 				if(dataConfigs.submitDatas[o].Id==data.Id){
    // 					dataConfigs.submitDatas.splice(o,1);
    // 					break;
    // 				}
    // 			}
    // 		}
    // 	}*/
    // 	$("#page1 #" + id + "_div").remove();
    // 	$("#basicform")[0].reset();
    // 	$("#propform")[0].reset();
    // })

    $('#type').change(function () {
      var val = $(this).find('option:selected').val()
      if (val == 'input' || val == 'text') {
        $('#format,#itemConfig,#itemService,#items,#chooseType,#usernameRelated,#fullnameRelated,#orgIdRelated,#orgNameRelated').parent().hide()
        $('#type').parent().show()
      } else if (val == 'detailtable') {
        $('#format,#itemConfig,#itemService,#items,#chooseType,#usernameRelated,#fullnameRelated,#orgIdRelated,#orgNameRelated').parent().hide()
      } else if (val == 'datetime') {
        $('#itemConfig,#itemService,#items,#chooseType,#usernameRelated,#fullnameRelated,#orgIdRelated,#orgNameRelated').parent().hide()
        $('#format').parent().show()
      } else if (val == 'checkbox' || val == 'radio' || val == 'select') {
        $('#itemConfig,#itemService,#items').parent().show()
        $('#format,#chooseType,#usernameRelated,#fullnameRelated,#orgIdRelated,#orgNameRelated').parent().hide()
      } else if (val == 'userchoose') {
        $('#chooseType,#usernameRelated,#fullnameRelated,#orgIdRelated,#orgNameRelated').parent().show()
        $('#itemConfig,#itemService,#items,#format').parent().hide()
      } else if (val == 'groupchoose') {
        $('#chooseType,#orgIdRelated,#orgNameRelated').parent().show()
        $('#itemConfig,#itemService,#items,#format,#usernameRelated,#fullnameRelated').parent().hide()
      }
    })

    // modified by ma_yj at 2019-09-06, 左侧面板【流程-新增环节配置】的点击事件
    // $("#newrulebtn").click(function () {
    // 	var data = {};
    // 	data.Id = "";
    // 	data.commandType = "";
    // 	data.errMsg = "";
    // 	data.submit = true;
    // 	data.editable = true;
    // 	data.validate = true;
    // 	data.items = tool.getPageFields();
    // 	var html = bt(_DOM_TPL.ruletable, data);
    // 	$("#rule_table table").append(html);
    // })

    // modified by ma_yj at 2019-09-06, 保存流程环节配置，已在vue中重写
    // $("#rulesavebtn").bind("click", function () {
    // 	var data = tool.packRuleTableData();
    // 	tool.drawLeftRuleTable(data);
    // 	$('#myModal3').modal('hide')
    // })
    // modified by ma_yj at 2019-09-07, 流程环节配置，字段校验信息自动填写功能，已在vue中重写
    // $("#rule_table").delegate("input[id=ruleerrmsg]", "focusin", function () {
    // 	var scope = $(this).parent().parent();
    // 	if ($(this).val() == "") {
    // 		var text = $("#ruleid option:selected", scope).text();
    // 		$(this).val(text + "不能为空")
    // 	}
    // })

    // modified by ma_yj 2019-09-04, 全部保存事件，已在vue中重写
    // $("#saveallbtn").click(function () {
    // 	// var user = $("#User").html();
    // 	// if (user == "未登录") {
    // 	// 	$('#loginModal').modal('show')
    // 	// 	return;
    // 	// }
    // 	tool.packAllItems();
    // 	if (dataConfigs.flowId == "") {
    // 		alert("配置不正确，不能保存！");
    // 		return;
    // 	}
    // 	var arr = $("#mainconfig").serializeArray();
    // 	for (var i = 0; i < arr.length; i++) {
    // 		dataConfigs[arr[i].name] = arr[i].value;
    // 	}
    // 	var flowId = dataConfigs.flowId;
    // 	var formName = dataConfigs.formName;
    // 	var isConsign = dataConfigs.isConsign;
    // 	var str = JSON.stringify(dataConfigs);
    // 	$.ajax({
    // 		headers: {
    // 			'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
    // 		},
    // 		url: service + '/app/formGenerate/add',
    // 		type: "post",
    // 		data: 'formName=' + formName + '&isConsign=' + isConsign + '&flowId=' + flowId + '&dataConfigs=' + str,
    // 		datatype: "json",
    // 		success: function (data) {
    // 			alert("保存成功！");
    // 		}
    // 	})
    // })
    $('#showNodes').bind('blur', function () {
      var val = $(this).val()
      if (val != '' && val.lastIndexOf(',') != (val.length - 1)) {
        $(this).val(val + ',')
      }
    })
    $.widget('custom.combobox', {
      // 在此对象中this表示flowlist组件
      _create: function () {
        console.log('_create')
        this.wrapper = $('<span>')
          .addClass('custom-combobox')
          .insertAfter(this.element) // 在id为flowlist的select组件后面插入一个span

        this.element.hide()
        this._createAutocomplete()
        // this._createShowAllButton();
      },

      _createAutocomplete: function () {
        console.log('_createAutocomplete')
        var selected = this.element.children(':selected')
        var value = selected.val() ? selected.text() : ''

        this.input = $('<input>')
          .appendTo(this.wrapper)
          .val(value)
          .attr('title', '')
          .attr('placeholder', '输入表单中文名称查找')
          .addClass('form-control')
          .css({ width: '300px' })
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy(this, '_source'), // 自动完成功能的数据集合
            appendTo: '#auto'
          })
          .tooltip({
            classes: {
              'ui-tooltip': 'ui-state-highlight'
            }
          }) // TODO 在span后面插入input，其中autocomplete、tooltip不知道什么意思

        this._on(this.input, {
          autocompleteselect: function (event, ui) {
            loadSelected = ui.item.value
            ui.item.option.selected = true
            this._trigger('select', event, {
              item: ui.item.option
            })
          },

          autocompletechange: '_removeIfInvalid'
        }) // TODO 不知道什么意思
      },

      // modified by ma_yj at 2019-09-05, 没有人调用
      // _createShowAllButton: function () {
      // 	var input = this.input,
      // 		wasOpen = false;

      // 	$("<button>")
      // 		.attr("tabIndex", -1)
      // 		.html("↓")
      // 		.attr("title", "显示所有")
      // 		.tooltip()
      // 		.appendTo(this.wrapper)
      // 		.removeClass("ui-corner-all")
      // 		.addClass("custom-combobox-toggle ui-corner-right")
      // 		.on("mousedown", function () {
      // 			wasOpen = input.autocomplete("widget").is(":visible");
      // 		})
      // 		.on("mouseover", function () {
      // 			input.trigger("focus");

      // 			// Close if already visible
      // 			if (wasOpen) {
      // 				return;
      // 			}

      // 			// Pass empty string as value to search for, displaying all results
      // 			input.autocomplete("search", "");
      // 		});
      // },

      _source: function (request, response) {
        console.log('_source')
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i')
        response(this.element.children('option').map(function () {
          var text = $(this).text()
          if (this.value && (!request.term || matcher.test(text))) {
            return {
              label: text,
              value: text,
              option: this
            }
          }
        }))
      },

      _removeIfInvalid: function (event, ui) {
        console.log('_removeIfInvalid')
        // Selected an item, nothing to do
        if (ui.item) {
          return
        }
        // Search for a match (case-insensitive)
        var value = this.input.val()
        var valueLowerCase = value.toLowerCase()
        var valid = false
        this.element.children('option').each(function () {
          if ($(this).text().toLowerCase() === valueLowerCase) {
            this.selected = valid = true
            return false
          }
        })
        // Found a match, nothing to do
        if (valid) {
          return
        }
        // Remove invalid value
        this.input
          .val('')
          .attr('title', value + ' 没有匹配项')
          .tooltip('open')
        this.element.val('')
        this._delay(function () {
          this.input.tooltip('close').attr('title', '')
        }, 2500)
        this.input.autocomplete('instance').term = ''
      },

      _destroy: function () {
        console.log('_destroy')
        this.wrapper.remove()
        this.element.show()
      }
    })
    console.log('2')
    $('#flowlist').combobox() // 这句执行后，才会执行上面的$.widget("custom.combobox", {})方法，猜测意思是把flowlist组件和combobox绑定
  })
  $(document).keydown(function (e) {
    if (e.which == 46 && e.target.tagName != 'INPUT') {
      $('#page1 .actived').remove()
    }
  })

  function recycleImage (item) {
    var w = $('#page1').width()
    item.css({ width: 'auto' })
  }

  function drawItems (isForCode) {

  }
}
