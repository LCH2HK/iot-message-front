<template>
  <div class="footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      2020 <span>华东勘测设计研究院数字公司</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutFooter'
}
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 2px 0 12px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>
