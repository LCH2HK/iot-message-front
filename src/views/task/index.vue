<template>
  <a-tabs defaultActiveKey="1" >
    <a-tab-pane tab="任务待办" key="1">
      <task-list></task-list>
    </a-tab-pane>
    <a-tab-pane tab="流程跟踪" key="2">
      <task-track></task-track>
    </a-tab-pane>
    <a-tab-pane tab="表单查询" key="3">
      <task-search></task-search>
    </a-tab-pane>
    <a-tab-pane tab="表单填写" key="4">
      <form-fill></form-fill>
    </a-tab-pane>
  </a-tabs>
</template>

<script>

  import taskList from './TaskList'
  import taskSearch from './search'
  import taskTrack from './track'
  import formFill from './formFill'

  export default {
    name: "task",
    components: {
      taskList,
      taskSearch,
      taskTrack,
      formFill
    }
  }

</script>

<style lang="less" scoped>
  // tab的下面横线样式
  .ant-tabs {
    :global(.ant-tabs-bar) {
      :global(.ant-tabs-nav-container) {
        line-height: 33px;
        :global(.ant-tabs-nav-scroll) {      
          :global(.ant-tabs-nav) {     
            :global(.ant-tabs-ink-bar) {
              width:70px!important;
              height:3px!important;
              border-radius:2px!important;
              margin-left:8px!important;
            }
          }
        }
      }
    }
  }
</style>
