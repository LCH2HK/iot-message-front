<template>
  <div>
    <div class="topbar">移动办公表单快速开发平台
      <div style="float:right">
        <!-- <font id="User">未登录</font>&nbsp;&nbsp; -->
        <!-- <button type="button" class="btn btn-info" data-toggle="modal" data-target="#loginModal"><i class="fa fa-user"></i>用户登录</button> -->
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#loadModal"
                @click="queryFlowList"><i class="fa fa-download"></i>载入
        </button>
        <button id="saveallbtn" type="button" class="btn btn-success" @click="saveAll"><i class="fa fa-save"></i>全部保存
        </button>
        <button id="genbtn" type="button" class="btn btn-default"><i class="fa fa-file-code-o"></i>生成HTML</button>
      </div>
    </div>
    <div class="device-container">
      <div id="page1" class="ff"></div>
    </div>
    <div class="funmenu leftmenu" style="width:405px">
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#basic" aria-controls="basic" role="tab" data-toggle="tab"><i
          class="fa fa-database"></i>数据</a></li>
        <li role="presentation"><a href="#flow" aria-controls="flow" role="tab" data-toggle="tab"><i
          class="fa fa-cogs"></i>后台</a></li>
        <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab"><i
          class="fa fa-list-ul"></i>流程</a></li>
        <li role="presentation"><a href="#custom" aria-controls="custom" role="tab" data-toggle="tab"><i
          class="fa fa-codepen"></i>自定义JS</a></li>
      </ul>
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="basic" style="padding-top:10px;">
          <form>
            <div class="panel panel-default">
              <!-- Default panel contents -->
              <div class="panel-heading">
                <p><span style="float:right">
                        <button id="configBtn" type="button" class="btn btn-success" data-toggle="modal"
                                data-target="#myModal" @click="queryMainDbList"><i class="fa fa-edit"></i>配置</button>
                        </span>主表
                </p>
              </div>
              <div id="mainfields">
                <!-- <div v-for="item in dataConfigs.items">
                    input等
                    <div :id="item.Id+'_div'" class="ub uinn-all bg-w bb ub-ac" v-if="item.type!='text'&&item.type!='attachment'">
                        <div :id="item.Id+'_label'" class="font1 tc-l lable-l">{{item.text}}</div>
                        <div :id="item.Id+'_ctl'" class="font1 umar1 longtext">{{item.Id}}</div>
                    </div>
                    text
                    <div :id="item.Id+'_div'" class="ub-ver umar-t umar-b" v-if="item.type=='text'">
                        <div :id="item.Id+'_label'" class="ub font2 list2 uinn4 bg-lb tc-w">{{item.text}}</div>
                        <div :id="item.Id+'_ctl'" class="bg-w uinn-all font1">{{item.Id}}</div>
                    </div>
                    attachment
                    <div :id="item.Id+'_div'" class="ub-ver umar2" v-if="item.type=='attachment'">
                        <div class="ub font2 list2 uinn4 bg-lb tc-w">{{item.text}}</div>
                        <div :id="item.Id+'_ctl'" class="fjList">
                            <div class="fjitem ub ub-pj ub-ac uinn-side bg-w bb">
                                <div class="ub-f1 ub ub-ac uinn-tb">
                                    <div class="img-word"></div>
                                    <div class="font1 umar-l longtext-long">附件示例.docx</div>
                                </div>
                                <div class="img-right"></div>
                            </div>
                        </div>
                    </div>
                </div> -->
              </div>
            </div>
            <div class="panel panel-default">
              <!-- Default panel contents -->
              <div class="panel-heading">
                <p><span style="float:right">
                        <button id="configDtlBtn" type="button" class="btn btn-success" data-toggle="modal"
                                data-target="#myModal2"><i class="fa fa-plus-circle"></i>新增</button>
                        </span>明细表
                </p>
              </div>
              <div id="detailtable"></div>
            </div>
          </form>
        </div>
        <div role="tabpanel" class="tab-pane" id="flow" style="padding-top:20px;">
          <form id="mainconfig">
            <div class="form-group">
              <label for="belongSys">选择平台：</label>
              <a-radio-group name="isNewPlatform" v-model="dataConfigs.isNewPlatform">
                <a-radio :value="'true'">新平台</a-radio>
                <a-radio :value="'false'">方正平台</a-radio>
              </a-radio-group>
            </div>
            <div v-if="dataConfigs.isNewPlatform == 'true'">
              <div class="form-group">
                <label class="formItem-required">流程定义key</label>
                <input type="text" class="form-control" name="flowId" v-model="dataConfigs.flowId"
                       placeholder="从【研发平台-流程表单配置】中获取">
              </div>
              <div class="form-group">
                <label>是否使用通用表单</label>
                <br>
                <a-radio-group name="isCommon" v-model="dataConfigs.isCommon">
                  <a-radio :value="'true'">是</a-radio>
                  <a-radio :value="'false'">否</a-radio>
                </a-radio-group>
              </div>
              <div class="form-group">
                <label>是否可以委托</label>
                <br>
                <a-radio-group name="isConsign" v-model="dataConfigs.isConsign">
                  <a-radio :value="'true'">是</a-radio>
                  <a-radio :value="'false'">否</a-radio>
                </a-radio-group>
              </div>
              <div class="form-group">
                <label class="formItem-required">表单名称</label>
                <input type="text" class="form-control" name="formName" placeholder="如：请假申请"
                       v-model="dataConfigs.formName">
              </div>
            </div>
            <div v-else>
              <div class="form-group">
                <label for="belongSys">子系统</label>
                <select class="form-control" id="belongSys" name="belongSys">
                  <option value="sxdtpm">sxdtpm</option>
                </select>
              </div>
              <div class="form-group">
                <label for="belongSys">服务器地址</label>
                <select class="form-control" id="webServer" name="webServer">
                  <option value="server_SXDTPM_URL">sxdtpm</option>
                </select>
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">是否使用通用表单</label>
                <br/>
                <label class="radio-inline">
                  <input type="radio" name="isCommon" id="inlineRadio1" value="true" checked="checked">
                  是 </label>
                <label class="radio-inline">
                  <input type="radio" name="isCommon" id="inlineRadio2" value="false">
                  否 </label>
              </div>
              <div class="form-group">
                <label>是否可以委托</label>
                <br/>
                <label class="radio-inline">
                  <input type="radio" name="isConsign" id="inlineRadio1" value="true" checked="checked">
                  是 </label>
                <label class="radio-inline">
                  <input type="radio" name="isConsign" id="inlineRadio2" value="false">
                  否 </label>
              </div>
              <div class="form-group">
                <label for="path">表单路径</label>
                <input type="text" class="form-control" id="path" name="path"
                       placeholder="如：inforDigit/form_formDemo.html">
              </div>
              <div class="form-group">
                <label for="formName">表单名称</label>
                <input type="text" class="form-control" id="formName" name="formName" placeholder="如：信息化项目任务书">
              </div>
              <div class="form-group">
                <label for="bizObjId">主表业务对象编号</label>
                <input type="text" class="form-control" id="bizObjId" name="bizObjId" placeholder="如：FORM_ITTASK，必须大写">
              </div>
              <div class="form-group">
                <label for="detailObjIds">明细表业务对象编号</label>
                <input type="text" class="form-control" id="detailObjIds" name="detailObjIds"
                       placeholder="必须大写，多个明细表用英文逗号分隔">
              </div>
              <div class="form-group">
                <label for="formId">表单编号</label>
                <input type="text" class="form-control" id="formId" name="formId"
                       placeholder="一般为url中的html文件名，如：it_task_add">
              </div>
              <div class="form-group">
                <label for="flowId">流程编号</label>
                <input type="text" class="form-control" id="flowId" name="flowId" placeholder="如：it_24hours">
              </div>
            </div>
            <!--<button id="mainconfigbtn" type="button" class="btn btn-success" @click="saveFlowConfig"><i
              class="fa fa-save"></i>保存
            </button>-->
          </form>
        </div>
        <!-- 左侧面板流程选项卡 -->
        <div role="tabpanel" class="tab-pane" id="settings">
          <div style="margin:10px 0;">
            <button id="newflownode" type="button" class="btn btn-success" data-toggle="modal" data-target="#myModal3">
              <i class="fa fa-plus-circle"></i>新增环节配置
            </button>
          </div>
          <div class="panel panel-default" :id="flow.flowNode+'_div'" v-for="(flow, key) in flowConfig">
            <div class="panel-heading">
              <p><span style="float:right">
                                <button type="button" class="btn btn-primary" :rel="flow.flowNode"
                                        @click="showUpdateFlowPanel(key)">修改</button>&nbsp;
                                <button type="button" class="btn btn-danger">删除</button></span>{{flow.flowNode}}
              </p>
            </div>
            <div rel="rules" v-for="(item,index) in flow.items">
              <div class="ub uinn-all bg-w bb ub-ac">
                <div class="font1 tc-l lable-l">{{item.Name}}</div>
                <div class="font1 umar1 longtext">{{item.Id}}</div>
              </div>
            </div>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="custom" style="padding-top:10px;">
          <label>通用变量和方法：</label><br/>
          taskInfor 任务信息&nbsp;&nbsp;nodeId 当前环节<br/>
          formData 表单数据&nbsp;&nbsp;getCtlVal(id)获取控件值
          <form id="customjs">
            <div class="form-group">
              <label for="loadDetail">1、loadDetail（数据加载）</label>
              <textarea class="form-control" id="loadDetail" name="loadDetail" rows="5" placeholder="" v-model="dataConfigs.loadDetail"></textarea>
            </div>
            <div class="form-group">
              <label for="pageInit">2、pageInit（页面加载）</label>
              <textarea class="form-control" id="pageInit" name="pageInit" rows="5" placeholder="" v-model="dataConfigs.pageInit"></textarea>
            </div>
            <div class="form-group">
              <label for="checkForm">3、checkForm（提交校验）</label>
              <textarea class="form-control" id="checkForm" name="checkForm" rows="5"
                        placeholder="commandType表示按钮id" v-model="dataConfigs.checkForm"></textarea>
            </div>
            <div class="form-group">
              <label for="setModifyData">4、setModifyData（数据提交）</label>
              <textarea class="form-control" id="setModifyData" name="setModifyData" rows="5"
                        placeholder="var data={};&#10;data.DataTarget='';&#10;data.OriginalValue='';&#10;data.PK=false;&#10;data.DataType='String';&#10;data.Value = '';&#10;saveData.push(data); " v-model="dataConfigs.setModifyData"></textarea>
            </div>
<!--            <button id="customjsbtn" type="button" class="btn btn-success"><i class="fa fa-save"></i>保存</button>-->
          </form>
        </div>
      </div>
    </div>
    <div class="funmenu rightmenu">
      <form id="basicform" name="basicform">
        <div class="form-group">
          <label for="Id">字段</label>
          <input type="text" class="form-control" id="Id" name="Id" readonly="readonly">
        </div>
        <div class="form-group">
          <label for="text">标题</label>
          <input type="text" class="form-control" id="text" name="text">
        </div>
        <div class="form-group">
          <label for="type">类型</label>
          <select class="form-control" name="type" id="type">
            <option value="input">输入框input</option>
            <option value="text">文本框textarea</option>
            <option value="attachment">附件</option>
            <option value="datetime">时间选择</option>
            <option value="radio">单选框</option>
            <option value="checkbox">复选框</option>
            <option value="select">下拉框</option>
            <option value="userchoose">人员选择</option>
            <option value="groupchoose">部门选择</option>
            <option value="detailtable">明细表</option>
          </select>
        </div>
      </form>
      <form id="propform" name="propform">
        <div class="form-group">
          <label for="format">格式化（仅时间类型有效）</label>
          <select class="form-control" name="format" id="format">
            <option value=""></option>
            <option value="yyyy-MM-dd">年-月-日 yyyy-MM-dd</option>
            <option value="yyyy-MM">年-月 yyyy-MM</option>
            <option value="yyyy-MM-dd hh:mm:ss">年-月-日 时-分-秒 yyyy-MM-dd hh:mm:ss</option>
            <option value="yyyy-MM-dd hh:mm">年-月-日 时-分 yyyy-MM-dd hh:mm</option>
          </select>
        </div>
        <div class="form-group">
          <label for="showMode">显示方式</label>
          <select class="form-control" name="showMode" id="showMode">
            <option value="show">可见</option>
            <option value="showOnTaskNode">特定环节显示</option>
            <option value="showOnCondition">特定条件显示</option>
            <option value="hidden">总是隐藏</option>
          </select>
        </div>
        <div class="form-group">
          <label for="showNodes">显示环节（<font color="red">最后加上逗号</font>）</label>
          <input type="text" class="form-control" id="showNodes" name="showNodes"
                 placeholder="如：UserTask_2,UserTask_5, 逗号分隔">
        </div>
        <div class="form-group">
          <label for="showCondition">显示条件</label>
          <input type="text" class="form-control" id="showCondition" name="showCondition"
                 placeholder="{ISCONSIGN}==true&&{ISCOMMON}==1">
        </div>
        <div class="form-group">
          <label for="itemConfig">枚举值类型</label>
          <select class="form-control" name="itemConfig" id="itemConfig">
            <option value=""></option>
            <option value="array">常量</option>
            <option value="service">动态</option>
          </select>
        </div>
        <div class="form-group">
          <label for="itemService">枚举值来源（暂不可用）</label>
          <input type="text" class="form-control" id="itemService" name="itemService" placeholder="获取枚举值的编号">
        </div>
        <div class="form-group">
          <label for="items">枚举值配置</label>
          <textarea class="form-control" id="items" name="items" rows="5"
                    placeholder="text:value形式，每个一行。如： 是:1"></textarea>
        </div>
        <div class="form-group">
          <label for="chooseType">选择类型</label>
          <select class="form-control" name="chooseType" id="chooseType">
            <option value=""></option>
            <option value="single">单选</option>
            <option value="multi">多选</option>
          </select>
        </div>
        <div class="form-group">
          <label for="usernameRelated">用户名关联字段</label>
          <input type="text" class="form-control" id="usernameRelated" name="usernameRelated" placeholder="非必填，小驼峰格式">
        </div>
        <div class="form-group">
          <label for="fullnameRelated">用户姓名关联字段</label>
          <input type="text" class="form-control" id="fullnameRelated" name="fullnameRelated" placeholder="非必填，小驼峰格式">
        </div>
        <div class="form-group">
          <label for="orgIdRelated">部门ID关联字段</label>
          <input type="text" class="form-control" id="orgIdRelated" name="orgIdRelated" placeholder="非必填，小驼峰格式">
        </div>
        <div class="form-group">
          <label for="orgNameRelated">部门名称关联字段</label>
          <input type="text" class="form-control" id="orgNameRelated" name="orgNameRelated" placeholder="非必填，小驼峰格式">
        </div>
        <div class="form-group">
          <label for="hasDefaultValue">是否有默认值</label>
          <a-radio-group id="hasDefaultValue" v-model="hasDefaultValue">
            <a-radio :value="'true'">有</a-radio>
            <a-radio :value="'false'">无</a-radio>
          </a-radio-group>
        </div>
        <div class="form-group" v-if="hasDefaultValue==='true'">
          <label for="default">默认值</label>
          <select class="form-control" name="default" id="default">
            <option value="curUsername">当前登录用户</option>
            <option value="curTime">当前时间</option>
          </select>
        </div>
        <!--
        <div class="form-group">
        <label class="checkbox-inline">
            <input type="checkbox" id="isSubmit" name="isSubmit" > <strong>数据需要提交</strong>
            </label>
        </div>-->
        <div class="alert alert-success" role="alert" id="alert-suc" style="display:none;">保存成功！</div>
        <button id="propsavebtn" type="button" class="btn btn-success" @click="saveProps"><i class="fa fa-save"></i>保存
        </button>
        <button id="itemdelbtn" type="button" class="btn btn-danger" @click="delItem"><i class="fa fa-trash-o"></i>删除
        </button>
      </form>
    </div>
    <!-- </div> -->
    <!-- Modal -->
    <!-- 配置主表弹窗 -->
    <div class="modal fade bs-example-modal-lg" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">配置主表</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label>数据库</label>
                <select id="maindb" class="form-control" style="width:200px;" v-model="mainDb"
                        @change="queryMainTableList">
                  <option :value="val" :key="val" v-for="val in mainDbList">{{val}}</option>
                  <!-- <option value="">加载中...</option> -->
                </select>
              </div>
              <div class="form-group">
                <label>数据表</label>
                <select class="form-control" id="mainformlist" style="width:300px" v-model="mainTable">
                  <option :value="val" :key="val" v-for="val in mainTableList">{{val}}</option>
                  <!-- <option value="">加载中...</option> -->
                </select>
              </div>
              <button id="pt_import" type="button" class="btn btn-primary" @click="queryMainTableColumns"><i
                class="fa fa-sign-in"></i>导入字段
              </button>
              <button id="pt_clean" type="button" class="btn btn-danger"><i class="fa fa-sign-out"></i>清除空白字段</button>
            </form>
            <div id="pt_table" style="margin-top:30px;max-height:500px;overflow:auto"
                 v-if="mainTableColumns.length > 0">
              <table class="table table-bordered" style="margin-top:20px;">
                <tr class="warning">
                  <th width="20%">字段</th>
                  <th width="10%">类型</th>
                  <th width="10%">长度</th>
                  <th width="30%">标题</th>
                  <th width="20%">控件类型</th>
                  <th width="10%">删除</th>
                </tr>
                <tbody>
                <tr v-for="item in mainTableColumns" :key="item.name">
                  <td>{{item.name}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.length}}</td>
                  <td>
                    <input type="text" class="form-control" :value="item.description">
                  </td>
                  <td>
                    <select class="form-control" v-model="item.elementType">
                      <option value="input">输入框input</option>
                      <option value="text">文本框textarea</option>
                      <option value="attachment">附件</option>
                      <option value="datetime">时间选择</option>
                      <option value="radio">单选框</option>
                      <option value="checkbox">复选框</option>
                      <option value="select">下拉框</option>
                      <option value="userchoose">人员选择</option>
                      <option value="groupchoose">部门选择</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" class="btn btn-danger">删除</button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
            <button type="button" class="btn btn-success" id="mainsavebtn" @click="saveMainTable"><i
              class="fa fa-save"></i>保存
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade bs-example-modal-lg" id="myModal2" tabindex="-1" role="dialog"
         aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">新增明细表</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group">
                <label style="width:80px">数据库</label>
                <select id="detaildb" class="form-control" style="width:200px">
                  <option value="">加载中...</option>
                  <!-- <option value="FormDB">FormDB</option>
                  <option value="IntegratedManage">IntegratedManage</option>
                  <option value="sxdtDB">sxdtDB</option>	 -->
                </select>
              </div>
              <div class="form-group">
                <label style="width:80px">数据表</label>
                <select class="form-control" id="detailformlist">
                  <option value="">加载中...</option>
                  <!-- <option>formDB</option>
                  <option>IntegratedManage</option> -->
                </select>
              </div>
              <br/><br/>
              <div class="form-group">
                <label style="width:80px" for="detailname">明细表标题</label>
                <input type="text" class="form-control" id="detailname" placeholder="明细表标题" style="width:200px">
              </div>
              <div class="form-group">
                <label for="detailname" style="width:80px">明细表ID</label>
                <input type="text" class="form-control" id="detailId" placeholder="明细表ID，大写" style="width:310px">
              </div>
              <button id="dt_import" type="button" class="btn btn-primary"><i class="fa fa-sign-in"></i>导入字段</button>
            </form>
            <div id="dt_table" style="margin-top:30px;display:none;max-height:500px;overflow:auto">
              <table class="table table-bordered" style="margin-top:20px;">
                <tr class="warning">
                  <th width="20%">字段</th>
                  <th width="30%">列宽</th>
                  <th width="25%">标题</th>
                  <th width="15%">排序</th>
                  <th width="10%">删除</th>
                </tr>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
            <button type="button" class="btn btn-success" id="detailsavebtn"><i class="fa fa-save"></i>保存</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增环节配置 v-show="showMyModal3"-->
    <div class="modal fade bs-example-modal-lg" id="myModal3" tabindex="-1" role="dialog"
         aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">新增流程环节配置</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline" id="ruleform" name="ruleform">
              <div class="form-group">
                <label class="formItem-required" for="flowName">环节编号</label>
                <input type="text" class="form-control" id="flowName" name='flowNode' placeholder="如UserTask_3，注意大小写"
                       style="width:250px" v-model="curFlowNode.flowNode">
              </div>
              <div class="form-group">
                <label>是否只能在PC端处理</label>
                <select id="isPcOnly" name="isPcOnly" class="form-control" v-model="curFlowNode.isPcOnly">
                  <option :value="'true'">是</option>
                  <option :value="'false'" selected>否</option>
                </select>
              </div>
            </form>
            <div id="rule_table" style="margin-top:30px;display:;max-height:500px;overflow:auto">
              <button type="button" class="btn btn-primary" id="newrulebtn" @click="addTaskField"><i
                class="fa fa-plus-circle"></i>新增字段
              </button>
              <table class="table table-bordered" style="margin-top:20px;">
                <tr class="warning">
                  <th width="20%">字段ID</th>
                  <th width="9%">需要验证</th>
                  <th width="19%">需验证按钮类型</th>
                  <th width="25%">验证提示</th>
                  <th width="9%">提交数据</th>
                  <th width="8%">可编辑</th>
                  <th width="10%">删除</th>
                </tr>
                <tbody>
                <!-- <tr><td>myj1</td><td>myj2</td><td>myj3</td><td>myj4</td><td>myj5</td><td>myj6</td><td>myj7</td></tr> -->
                <tr v-for="(field, index) in curFlowNode.items">
                  <td><select class="form-control" id="ruleid" v-model="field.Id" style="-webkit-appearance: menulist;"
                              @change="ruleidChanged($event, index)">
                    <option :value="item.Id" v-for="item in items">{{item.text}}</option>
                  </select></td>
                  <td valign="middle" align="center"><input type="checkbox" id="rulevalidate"
                                                            style="-webkit-appearance: checkbox;"
                                                            v-model="field.validate"></td>
                  <!--v-model="field.validate" -->
                  <td><input type="text" class="form-control" id="rulecommandtype" value="" placeholder="按钮类型，逗号分隔"
                             v-model="field.commandType"></td>
                  <td><input type="text" class="form-control" id="ruleerrmsg" value="" v-model="field.errMsg"
                             @focus="autoUpdateErrMsg(field)"></td>
                  <td valign="middle" align="center"><input type="checkbox" id="rulesubmit"
                                                            style="-webkit-appearance: checkbox;"
                                                            v-model="field.submit"></td><!--v-model="field.submit" -->
                  <td valign="middle" align="center"><input type="checkbox" id="ruleeditable"
                                                            style="-webkit-appearance: checkbox;"
                                                            v-model="field.disable"></td>
                  <td>
                    <button type="button" class="btn btn-danger" @click="delCurrentField(index)">删除</button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
            <button type="button" class="btn btn-success" id="rulesavebtn" @click="saveTaskConfig"><i
              class="fa fa-save"></i>保存
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" id="loginModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">开发人员登录</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group ui-widget">
                <label for="userName">开发人员姓名</label>
                <input type="text" class="form-control" id="userName" placeholder="中文姓名" style="width:250px">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
            <button type="button" class="btn btn-success" id="loginbtn"><i class="fa fa-check"></i>登录</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <div class="modal fade" tabindex="-1" role="dialog" id="loadModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">载入已配置的流程</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline">
              <div class="form-group" id="auto">
                <label for="userName">选择流程名称</label>
                <select id="flowlist" class="form-control">
                  <!-- <option value="">加载中...</option> -->
                  <option :value="item.id" :key="item.id" v-for="item in flowList">{{item.formName}}</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
            <button type="button" class="btn btn-success" id="loadbtn" @click="queryDataconfigsById"><i
              class="fa fa-download"></i>载入
            </button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <div class="modal fade bs-example-modal-lg" id="genModal" tabindex="-1" role="dialog"
         aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">生成HTML代码</h4>
          </div>
          <div class="modal-body">
            <!--<textarea id="genBox" style="width:100%" class="form-control" rows=30>

            </textarea>-->
            <pre id="genBox">
                    
                    </pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i>关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {ACCESS_TOKEN} from '@/store/mutation-types';

  export default {
    data() {
      return {
        id: '',  //根据id判断新增还是修改
        flowList: [],  //当前已配置的数据
        mainDbList: [],  //主表数据库名称列表，用于下拉框选择
        mainTableList: [],  //主表数据表名称列表，用于下拉框选择
        mainDb: '',  //主表数据库名称
        mainTable: '',  //主表数据表名称
        mainTableColumns: [],  //主表字段列表

        dataConfigs: {  //最后需要提交的完整的dataConfigs
          formName: '',  //表单名称
          flowId: '',  //流程定义key或者流程编号
          mainTableName: '',  //主表名称
          detailTableName: '',  //明细表名称
          isNewPlatform: 'true',  //标记是新平台或者方正平台
          isCommon: 'true',  //是否是通用表单
          isConsign: 'true', //是否可委托
        },
        flowConfig: {},  //最后需要提交的流程配置
        items: [],  //最后需要提交的字段配置 TODO 在两个地方会有修改：（1）导入主表字段初始化值(saveMainTable方法)，（2）修改(saveProps方法)或删除(delItem方法)字段的配置

        //字段属性
        hasDefaultValue: 'false',  //当前字段是否有默认值
        //流程配置
        curFlowNode: {
          isPcOnly: 'false',
          flowNode: '',
          items: []
        },  //当前环节的流程配置，在每次关闭环节配置面板时会清空
      };
    },
    mounted() {
      var _this = this;
      // let live = document.querySelector("#container");
      // let link = document.createElement('link');
      // link.rel = "stylesheet";
      // link.href = "~@assets/css/appcan.icon.css";
      // live.appendChild(link);
      $('#myModal3').on('hidden.bs.modal', function () {
        $('#myModal3 form')[0].reset();
        //清空环节配置信息
        _this.curFlowNode = {
          isPcOnly: 'false',
          flowNode: '',
          items: []
        };
        // $("#rule_table tr:gt(0)").remove();
      });
      nnn()
    },
    computed: {
      // computedItems() {
      //     var _this = this;
      //     var selectItems = [];
      //     for(var item in _this.items) {
      //         var temp = {Id: item.Id, Name: item.text};
      //         selectItems.push(temp);
      //     }
      //     return selectItems;
      // }
    },
    methods: {
      //载入按钮点击事件，查询现有配置
      queryFlowList() {
        var _this = this;
        $.ajax({
          headers: {
            "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          url: service + "/app/formGenerate/getFlowList",
          datatype: "json",
          success: function (data) {
            if (data.success) {
              _this.flowList = data.result;
            }
            // tool.drawSelect("flowlist", data);
          }
        })
      },
      //查询数据库名称列表
      queryMainDbList() {
        var _this = this;
        if (_this.mainDbList.length == 0) {  //没有数据才查询，已有数据不查询
          var promise = $.ajax({
            headers: {
              "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
            },
            url: service + '/codegenerate/getdbname',
            method: 'GET',
            success: function (data) {
              if (data.success) {
                _this.mainDbList = data.result;
                if (data.result.length > 0) {
                  _this.mainDb = data.result[0];  //设置默认选中第一个
                }
              } else {
                console.log("queryMainDbList失败！");
              }
            }
          })
          promise.then(function () {
            _this.queryMainTableList();
          })
        }
      },
      //查询数据表名称列表
      queryMainTableList() {
        var _this = this;
        var db = _this.mainDb;
        $.ajax({
          headers: {
            "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          data: "dbName=" + db,
          type: 'POST',
          url: service + "/codegenerate/gettable",
          success: function (data) {
            if (data.success) {
              _this.mainTableList = data.result;
              if (data.result.length > 0) {
                _this.mainTable = data.result[0];  //设置默认选中第一个
              }
            } else {
              console.log("queryMainTableList失败！");
            }
          }
        })
      },
      //查询主表字段并显示
      queryMainTableColumns() {
        var _this = this;
        var db = _this.mainDb;
        var table = _this.mainTable;
        $.ajax({
          headers: {
            "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          type: 'POST',
          data: "dbName=" + db + "&tableName=" + table,
          url: service + "/codegenerate/getallparam",
          dataType: "json",
          success: function (data) {
            if (data.success) {
              var tempAry = data.result;
              for (var i = 0; i < tempAry.length; i++) {
                tempAry[i].name = tempAry[i].name.replace(/[_][a-zA-Z]/g, function (word) {
                  return word.substring(1).toUpperCase();
                });
                tempAry[i].elementType = 'input';
              }
              _this.mainTableColumns = data.result;
            } else {
              console.log("queryMainTableColumns失败！");
            }
            // var html = tool.drawMainTable(data);
            // $("#pt_table table").find("tr:not('.warning')").remove();
            // $("#pt_table table").append(html)
            // $("#pt_table").slideDown();  //以滑动方式显示隐藏的pt_table
          }
        })
      },
      // 主表配置的保存事件
      saveMainTable() {
        var _this = this;
        if ($("#page1>div").length > 0) {  // TODO 之前加载过数据
          if (window.confirm('确定放弃当前修改，重新加载？')) {

          } else {
            return false;
          }
        }
        var data = _this.packMainTableData();
        _this.items = data;
        _this.dataConfigs.mainTableName = _this.mainTable;
        _this.drawLeftMainTable(data);
        $('#myModal').modal('hide');
      },
      // 拼接字段
      packMainTableData() {
        var _this = this;
        var arr = [];
        var maintbData = _this.mainTableColumns;
        for (var i = 0; i < maintbData.length; i++) {
          var item = {};
          item.Id = maintbData[i].name;
          item.text = maintbData[i].description;
          item.type = maintbData[i].elementType;    //TODO 获取select选中的值
          item.prop = "";
          arr.push(item);
        }
        _this.dataConfigs.items = arr;
        return arr;
      },
      // 绘制左侧面板的数据选项卡和中间面板字段
      drawLeftMainTable(arr) {
        //debugger TODO 没有改
        var html = "";
        var b = false;  //b=true表示中间面板没有数据
        if ($("#page1>div").length == 0)   //$("#page1 > div")获取id为page1下的第一级div数组
          b = true;
        $("#mainfields").empty();   //清空左侧主表字段
        // if(b)
        $("#page1").empty();    //清空中间面板字段
        if (arr != null) {
          for (var i = 0; i < arr.length; i++) {
            var data = arr[i];
            var type = data.type; //获取type并判断一下，在什么情况下赋默认input?
            if (typeof (_DOM_TPL[type]) == "undefined")
              type = "input";
            html = bt(_DOM_TPL[type], data);  //各个类型显示不同
            /**
             * html的值是一个字段：
             <div id="formName_div" class="ub uinn-all bg-w bb ub-ac">
             <div id="formName_label" class="font1 tc-l lable-l">表单名称</div>
             <div id="formName_ctl" class="font1 umar1 longtext">formName</div>
             </div>
             */
            $("#mainfields").append(html);
            $("#mainfields #" + data.Id + "_div").data("data", data);   //将本字段的信息添加到外层div的data属性中
            // if(b){
            $("#page1").append(html);
            $("#page1 #" + data.Id + "_div").data("data", data);     //将本字段的信息添加到外层div的data属性中
            // }
          }
        }
        //左侧面板字段可拖拽
        $("#mainfields>div").draggable({
          cursor: "move",
          helper: function (event) {
            var item = $(event.currentTarget.outerHTML);
            var data = $(event.currentTarget).data("data");
            var w = $("#page1").width();
            item.css({width: w})
            item.data("data", data)
            return item;
          },
          connectToSortable: "#page1",
          revert: "invalid"
        });
      },
      //字段属性保存事件
      saveProps() {
        var _this = this;
        var id = $("#Id").val();
        if (id == "")
          return;
        var basicform = $("#basicform").serializeArray();   //可以对选择器中的input、select等标签进行序列化，要求字段有name属性，且不能disabled，返回对象的格式：[{name: "", value: ""}]
        var propform = $("#propform").serializeArray();
        var oD = $("#" + id + "_div").data("data");
        var obj = oD, prop = oD.prop;
        for (var o in basicform) {
          obj[basicform[o].name] = basicform[o].value;
        }
        for (var o in propform) {
          if (propform[o].value != "") {
            if (typeof (prop) != "object")
              prop = {};
            if (propform[o].name == "items") {
              //如果是枚举项，需要单独处理
              var arr = propform[o].value.split("\n");
              var items = [];
              for (var i in arr) {
                var item = {};
                var itemarr = arr[i].split(":");
                item.text = itemarr[0];
                item.value = itemarr[1];
                items.push(item);
              }
              prop.items = items;
            } else {
              prop[propform[o].name] = propform[o].value;
              if (prop['default'] && !propform['default']) {
                delete prop.default;
              }
            }
          }
        }
        //组合两个对象
        obj.prop = prop;
        //重绘HTML结构
        var html = tool.drawItem(obj);
        //写入到dom对象上
        $("#" + obj.Id + "_div").replaceWith(html);
        $("#" + obj.Id + "_div").data("data", obj)

        //TODO 后续优化 修改data中items的值
        for (var item in _this.items) {
          if (item.Id == id) {
            item.text = obj.text;
            item.type = obj.type;
            item.prop = obj.prop;
          }
        }

        //提示保存成功
        $("#alert-suc").slideDown("fast", function () {
          $(this).delay(500);
          $(this).fadeOut(1000);
        })
      },
      //item删除按钮事件
      delItem() {
        var _this = this;
        var id = $("#Id").val();
        $("#page1 #" + id + "_div").remove();
        //TODO 后续优化
        for (var i = 0; i < _this.items.length; i++) {
          if (_this.items[i].Id == id) {
            _this.items.splice(i, 1);
          }
        }
        $("#basicform")[0].reset();
        $("#propform")[0].reset();
      },
      //左侧面板后台选项卡的保存事件
      saveFlowConfig() {
        var arr = $("#mainconfig").serializeArray();
        for (var i = 0; i < arr.length; i++) {
          dataConfigs[arr[i].name] = arr[i].value;
        }
        alert("保存成功！");
      },
      //全部保存事件
      saveAll() {
        // debugger
        var _this = this;
        // tool.packAllItems();  //用vue中的数据替代packAllItems()
        _this.dataConfigs.items = _this.items;
        _this.dataConfigs.flowConfig = _this.flowConfig;
        //序列化流程配置并拼接到dataConfigs，看是否可省略
        // var arr = $("#mainconfig").serializeArray();
        // for (var i = 0; i < arr.length; i++) {
        // 	dataConfigs[arr[i].name] = arr[i].value;
        // }
        //必须配置flowId和formName字段
        if (_this.dataConfigs.flowId == '') {
          alert("【流程定义key】或【流程编号】没有配置，不能保存！");
          return;
        }
        if (_this.dataConfigs.formName == '') {
          alert("【表单名称】没有配置，不能保存！");
          return;
        }
        // var flowId = dataConfigs.flowId;
        // var formName = dataConfigs.formName;
        // var isConsign = dataConfigs.isConsign;

        var str = JSON.stringify(_this.dataConfigs);

        var url = '';
        var params = 'formName=' + _this.dataConfigs.formName + '&isConsign=' + _this.dataConfigs.isConsign +
          '&flowId=' + _this.dataConfigs.flowId + '&dataConfigs=' + str;
        if (_this.id == '') {  //新增
          url = service + '/app/formGenerate/add';
        } else {  //修改
          url = service + '/app/formGenerate/edit'
          params = params + "&id=" + _this.id;
        }
        $.ajax({
          headers: {
            'X-Access-Token': JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          url: url,
          type: "post",
          data: params,
          datatype: "json",
          success: function (data) {
            if (data.success) {
              alert("保存成功！");
            } else {
              alert("Code: " + data.code + ", errorMsg: " + data.message);
            }
          }
        })
      },
      //根据id查询移动端表单配置，数据回填到this.dataConfigs中 TODO
      queryDataconfigsById() {
        var _this = this;
        var flowid = $("#flowlist").val();
        $.ajax({
          headers: {
            "X-Access-Token": JSON.parse(localStorage.getItem('pro__Access-Token')).value
          },
          url: service + '/app/formGenerate/queryById' + "?id=" + flowid,
          dataType: "json",
          success: function (data) {
            var config = JSON.parse(data.result.dataConfigs);
            if (config != null) {
              // dataConfigs = JSON.parse(config);
              dataConfigs = config;  //存入全局变量
              _this.dataConfigs = config;
              _this.items = config.items;
              _this.flowConfig = config.flowConfig;
              _this.id = data.result.id;
              _this.drawLeftMainTable(dataConfigs.items);  //（1）绘制左侧面板数据选项卡
              // $("#mainconfig").resetObjectForm(dataConfigs);  //（2）绘制左侧面板后台选项卡（自定义的方法，还没看，有问题），已改为vue方式此处注释掉

              // $("#settings .panel-default").remove();  //（3）清空并绘制左侧面板流程选项卡，已用vue v-for替代，此处注释掉
              // for (var o in dataConfigs.flowConfig) {
              // 	tool.drawLeftRuleTable(dataConfigs.flowConfig[o]);
              // }
              //（4）绘制左侧面板自定义JS选项卡
              $("#loadDetail").val(unescape(dataConfigs.loadDetail == undefined ? "" : dataConfigs.loadDetail));
              $("#pageInit").val(unescape(dataConfigs.pageInit == undefined ? "" : dataConfigs.pageInit));
              $("#checkForm").val(unescape(dataConfigs.checkForm == undefined ? "" : dataConfigs.checkForm));
              $("#setModifyData").val(unescape(dataConfigs.setModifyData == undefined ? "" : dataConfigs.setModifyData));
              $('#loadModal').modal('hide')
            } else {
              alert("表单未配置dataConfigs，无法载入！")
            }
          }
        })
      },
      //【流程-新增环节配置】点击事件，显示#myModal3 TODO 暂时没调用
      // showFLowConfigPanel() {
      //     var _this = this;
      //     _this.showMyModal3 = true;
      // },
      //【流程-新增环节配置-新增字段】点击事件
      addTaskField() {
        var _this = this;
        var data = {};
        data.Id = "";
        data.commandType = "";
        data.errMsg = "";
        data.submit = true;
        data.editable = true;
        data.validate = true;
        // data.items = tool.getPageFields();
        // _this.flowFieldItems = tool.getPageFields();
        _this.curFlowNode.items.push(data);

        // var html = bt(_DOM_TPL.ruletable, data);
        // $("#rule_table table").append(html);
      },
      //保存流程环节配置
      saveTaskConfig() {
        // var data = tool.packRuleTableData();  //TODO 从这里能获取到字段的中文名称
        // tool.drawLeftRuleTable(data);
        var _this = this;
        var nodeName = _this.curFlowNode.flowNode;
        if (nodeName == '') {  //环节编号必填
          alert("【环节编号】没有配置，无法保存！");
          return false;
        }
        //以下代码用于填充字段的Name属性，已用select的onchange事件代替，此处注释掉
        // for(var i=0; i<_this.curFlowNode.items.length; i++) {
        //     var temp = _this.curFlowNode.items[i];
        //     temp.Id = temp.item.Id;
        //     temp.Name = temp.item.text;
        //     delete temp.item;
        // }debugger
        _this.flowConfig[nodeName] = _this.curFlowNode;
        $('#myModal3').modal('hide');
      },
      delCurrentField(index) {
        var _this = this;
        _this.curFlowNode.items.splice(index, 1);
      },
      showUpdateFlowPanel(key) {
        // var id = $(this).attr("rel");
        // var data = $("#" + id + "_div").data("data");
        var _this = this;
        _this.curFlowNode = _this.flowConfig[key];
        $('#myModal3').modal('show');
        //以下代码已经替换为vue的方式
        // $("#ruleform").resetObjectForm(data);
        // for (var o in data.items) {
        // 	var obj = data.items[o];
        // 	obj.items = tool.getPageFields();
        // 	var html = bt(_DOM_TPL.ruletable, obj);
        // 	$("#rule_table table").append(html);
        // }
      },
      //流程环节配置，字段校验信息自动填写功能
      autoUpdateErrMsg(field) {
        if (field.errMsg == '' && field.validate && field.item) {
          field.errMsg = field.item.text + '不能为空';
        }
      },
      ruleidChanged(e, itemIndex) {
        var _this = this;
        var name = e.target.selectedOptions[0].label;
        if (_this.curFlowNode.items.length > itemIndex) {
          _this.curFlowNode.items[itemIndex].Name = name;
        }
      }
      //TODO 当前环节流程信息初始化
      // _this.curFlowNode = {
      //             isPcOnly: 'false',
      //             flowNode: '',
      //             items: []
      //     };

      // mmm(){
      //     $.ajax({
      //         headers: {
      //             "X-Access-Token":Vue.ls.get(ACCESS_TOKEN)/
      //         },
      //         url:service + "/app/formGenerate/getFlowList",
      //         datatype:"json",
      //         success:function(data){
      //             tool.drawSelect("flowlist",data);
      //         }
      //     })
      // }
    }
  }
</script>

<style scoped>
  .fa {
    margin-right: 5px;
  }

  .topbar {
    position: relative;
    margin-top: 20px;
  }

  .device-container {
    margin: 30px auto 0 auto;
  }

  .formItem-required::before {
    content: '* ';
    /* position: absolute; */
    /* font-size: 28px; */
    color: red;
    font-family: bold;
  }

</style>