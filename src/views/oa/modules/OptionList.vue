<template>
  <div class="process">
    <div class="bgs">
      <h3>
        <span>审批环节处理意见列表</span>
      </h3>
      <a-steps direction="vertical" progressDot :current="currentList">
        <a-step v-for="(item,k) in commentList" :key="k">
          <template slot="title">
            <td class="shenpi-info-area">
              <div class="shenpi-name">{{ item.nodeName }}</div>
              <div class="shenpi-user">
                处理人<span>{{ item.assigneeFullname }}</span>
              </div>
              <div class="shenpi-status">
                状态<span>{{ item.handleType }}</span>
              </div>
            </td>
          </template>
          <template slot="description">
            <div class="proc_bg">
              <div class="shenpi-content" v-if="item.endTime">
                <tbody>
                  <tr>
                    <td class="shenpi-detail-content">
                      {{ item._taskComment == undefined ? '无意见' : item._taskComment }}
                    </td>
                    <td class="shenpi-detail-line">
                      <i></i>
                    </td>
                    <td class="shenpi-detail-sign">
                        <div v-if="!item.attachmentAutograph">
                          无签名
                        </div>
                        <div v-if="item.attachmentAutograph">
                          <img :src="url.imgerver + '/' + item.attachmentAutograph" style="width:80%;height:80%;"/>
                        </div>
                        <div>{{ item.endTime | stringSplit }}</div>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OptionList",
    data () {
      return {
        clums: [
          {
            title: '填写表单',
            admin: '陈敏',
            status: '提交'
          },
          {
            title: '填写表单',
            admin: '陈敏',
            status: '提交'
          },
          {
            title: '填写表单',
            admin: '陈敏',
            status: '提交'
          },
          {
            title: '填写表单',
            admin: '陈敏',
            status: '提交'
          }
        ],
        url: {
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '0': '暂存',
          '1': '流转中',
          '2': '已完成',
          '3': '废弃'
        }
        return statusMap[status]
      },
      stringSplit(T) {
        const statusMap = T.slice(0,10);
        return statusMap
      }
    },
    props: {
      commentList: {
      },
      currentList: {
      }
    },
    created () {
    },
    methods: {   
    }
  }
</script>

<style lang="less" scoped>
  .proc_bg {
    padding: 10px 15px;
    height: 85px;
    overflow: hidden;
    background: #FFF;
    border: 1px solid #EEE;
    -moz-border-radius: 3px 3px 3px 3px;
    -webkit-border-radius: 3px 3px 3px 3px;
    border-radius: 3px 3px 3px 3px;
    ul li{
      float: left;
      margin-left: 22px;
      display: block;
      height: 18px;
      line-height: 18px;
      color: #888;
      text-indent: 30px;
    }
  }
  .process {
    height: auto;
    overflow: hidden;
    padding: 10px;
    background: #f9f9f9;
    border: 1px solid #ccc;
    .bgs {
      overflow: hidden;
      margin: 0;
      padding: 10px 15px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      h3 {
        height: 40px;
        margin-bottom: 10px;
        line-height: 40px;
        font-size: 16px;
        color: #1570b6;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      :global(.ant-steps-item-content) {
        width: 96%;
        :global(.ant-steps-item-title) {
          display: inline-block;
          width: 15%
        }
        :global(.ant-steps-item-description) {
          display: inline-block;
          width: 85%;
          .shenpi-detail-content{
            width: 86%;
          }
        }
      }
      .shenpi-info-area {
        width: 100%;
        padding: 5px 0;
        .shenpi-name {
          color: #333;
          font-weight: bold;
        }
        .shenpi-user {
          font-size: 12px;
          color: #aaa;
          span {
            margin: 0 0 0 5px;
            color: #333;
          }
        }
        .shenpi-status {
          font-size: 12px;
          color: #aaa;
          span {
            margin: 0 0 0 5px;
            color: #4796ee;
          }
        }
      }
      .shenpi-content-area {
        padding: 5px 0;
      }
    }
  }
</style>