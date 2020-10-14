<!--公式配置弹窗 -->
<template>
  <a-modal
    :footer="null"
    :width="800"
    :height="800"
    title="公式配置"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-row>
      <!--      <a-input :disabled="inputDisabled" v-model="inputValue">-->
      <!--      </a-input>-->
      <textarea
        rows="3"
        class="formula-textarea"
        v-model="inputValue"
        placeholder="请输入公式"
        :auto-size="{ minRows: 1, maxRows: 3 }"
        ref="textarea"
      />
    </a-row>
    <a-tabs class="formula-set-tabs" default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="运算符">
        <a-row class="formula-row" :gutter="24" v-for="(items,index) in operatorArray" :key="index">
          <a-col class="formula-col" :md="4" :sm="8" v-for="(item,index2) in items" :key="index2">
            <a-button class="formula-operator-button" @click="handleConst(item.value)">{{item.title}}</a-button>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="函数" force-render>
        <a-row class="formula-row" :gutter="24" v-for="(items,index) in functionArray" :key="index">
          <a-col class="formula-col" :md="4" :sm="8" v-for="(item,index2) in items" :key="index2">
            <a-tooltip placement="rightTop" :title="item.text" :autoAdjustOverflow="true" >
              <a-button class="formula-function-button" @click="handleFunction(item.value)">{{item.title}}</a-button>
            </a-tooltip>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="3" tab="常量">
        <a-row class="formula-row" :gutter="24" v-for="(items,index) in constantArray" :key="index">
          <a-col class="formula-col" :md="6" :sm="6" v-for="(item,index2) in items" :key="index2">
            <a-button class="formula-constant-button" @click="handleConst(item.value)">{{item.title}}</a-button>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="4" tab="属性">
        <a-col class="formula-col" :md="6" :sm="6" v-for="(item,index) in collectProperty" :key="index" :value="item.alias">
          <a-button class="formula-constant-button" @click="handleProperty(item.alias)">{{item.unitName}}({{item.alias}})</a-button>
        </a-col>
      </a-tab-pane>
    </a-tabs>
    <!-- 同步按钮 -->
    <a-form-item class="btnClass">
<!--      <a-icon type="calculator" />-->
      <a-button @click="validateFormula" icon="calculator" class="confirm" type="primary" v-if="title !== '查看'">验证公式</a-button>
      <a-button
        @click="handleOk"
        icon="check"
        type="primary"
        style="margin-left:10px"
        class="confirm"
        v-if="title !== '查看'"
      >确定
      </a-button>
      <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
    </a-form-item>
  </a-modal>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { postAction } from '../../../../api/manage'

export default {
  name: 'FormulaSettingModal',
  mixins: [JEditableTableMixin],
  components: {},
  props: {
    dataSource: {
      type: Array, // 定义属性的类型
      defaultValue: [] // 定义该属性的默认值
    },
    rowId: {
      type: String,
      defaultValue: ''
    }
  },
  data () {
    return {
      // 公式输入框 是否禁止输入 已废弃
      inputDisabled: false,
      // 公式输入框的值
      inputValue: '',
      // model的显示标记
      visible: false,
      // 运算符
      operatorArray: [
        [{ title: '7', value: '7' }, { title: '8', value: '8' }, { title: '9', value: '9' }, { title: '÷', value: '/' }, { title: 'DEL', value: 'DEL' }, { title: 'CLR', value: 'CLR' }],
        [{ title: '4', value: '4' }, { title: '5', value: '5' }, { title: '6', value: '6' }, { title: '*', value: '*' }, { title: ',', value: ',' }, { title: '()', value: '()' }],
        [{ title: '1', value: '1' }, { title: '2', value: '2' }, { title: '3', value: '3' }, { title: '-', value: '-' }, { title: '%', value: '%' }, { title: '°', value: '°' }],
        [{ title: '.', value: '.' }, { title: '0', value: '0' }, { title: 'i', value: 'i' }, { title: '+', value: '+' }, { title: '∞', value: '∞' }, { title: 'i', value: 'x' }],
        [{ title: 'A', value: 'A' }, { title: 'B', value: 'B' }, { title: 'C', value: 'C' }, { title: '^', value: '^' }, { title: '√', value: '√' }, { title: '!', value: '!' }],
        [{ title: 'D', value: 'D' }, { title: 'E', value: 'E' }, { title: 'F', value: 'F' }]
      ],
      // 函数
      functionArray: [
        [
          { title: '平方根', value: 'sqrt()', text: 'sqrt(n) = ²√n' },
          { title: '立方根', value: 'cbrt()', text: 'cbrt(n) = ³√n' },
          { title: '开方', value: 'root()', text: 'root(n,m) = m√n' },
          { title: '随机常数', value: 'rand()', text: 'rand(): 生成[0,1]区间内的常数\n rand(n): 生成[0,n]区间内的常数' },
          { title: '随机整数', value: 'randInt()', text: 'randInt(): 生成[0,1]区间内的整数\n randInt(n): 生成[0,n]区间内的整数\n randInt(m,n):生成[m,n]区间内的整数' },
          { title: '绝对值', value: 'abs()', text: 'abs(n) = |n|' }
        ],
        [
          { title: '常用对数', value: 'lg()', text: 'lg(N) = lgN' },
          { title: '自然对数', value: 'ln()', text: 'ln(N) = lnN' },
          { title: '对数', value: 'log()', text: 'log(m,N) = logmN' },
          { title: '最小', value: 'min()', text: 'min(m,n):求m,n的最小值' },
          { title: '最大', value: 'max()', text: 'max(m,n):求m,n的最大值' },
          { title: '阶乘', value: 'fact()', text: 'fact(n) = n!  n>0' }
        ],
        [
          { title: '正弦', value: 'sin()', text: 'sin(x) = sinx' },
          { title: '余弦', value: 'cos()', text: 'cos(x) = cosx' },
          { title: '正切', value: 'tan()', text: 'tan(x) = tanx' },
          { title: '反正弦', value: 'asin()', text: 'asin(x) = asinx' },
          { title: '反余弦', value: 'acos()', text: 'acos(x) = acosx' },
          { title: '反正切', value: 'atan()', text: 'atan(x) = atanx' }
        ],
        [
          { title: '实部', value: 're()', text: 're(m+ni) = m' },
          { title: '虚部', value: 'im()', text: 'im(m+ni) = n' },
          { title: '辐角', value: 'arg()', text: 'arg(m+ni): 复数向量与实轴正方向的辐角主值(单位:弧度)' },
          { title: '模长', value: 'norm()', text: 'arg(m+ni): 复数所对应的向量长度' },
          { title: '寄存', value: 'reg()', text: 'arg():不带参，返回寄存器内的值\n arg(n):设置寄存器值为n，并返回\n例：arg(5)*2+arg() = 15,\narg()+arg(3)*4 = 错误，寄存器必须先设置值' },
          { title: '共轭复数', value: 'conj()', text: 'conj(m+ni) = m-ni' }
        ],
        [
          { title: '导函数', value: 'diff()', text: 'diff(f(x),n,dir):求f(x)的一阶导数，n为未知数‘x’的值,dir为方向向量(可不填)，如diff(7x^2,1)= 14' },
          { title: '累加求和', value: 'sum()', text: 'sum(m,start,end) :求从start~end 的所有m值的和 \n 例：sum(3,start,end)=(end-start+1)*3; \n sum(x,1,5) = 15' },
          { title: '极限', value: 'lim()', text: 'lim(f(x),n,dir) / lim(f(x),n) ： f(x)表示极限计算公式，n表示x趋近的值，dir为复数，表示求方向极限时的方向向量。 ' },
          { title: '求值', value: 'eval()', text: 'eval(f(x),m)：f(x)表示计算公式，m表示x的值，如eval(3x+1,3) = 10' },
          { title: '函数零点', value: 'fzero()', text: 'fzero (f(x),m)/fzero(f(x))： f(x)表示函数，如果有多个零点，会取离m最近的一个值, 未输入m时m = q+pi  { -1<q,p<1}' },
          { title: '定积分', value: 'integ()', text: 'integ(f(x),m,n)：求f(x)在区间[m,n]的积分' }
        ],
        [
          { title: 'e底指数', value: 'exp()', text: 'exp(x) =  e^x' },
          { title: '最大公约', value: 'gcd()', text: 'gcd(m,n) : 求m和n的最大公约数' },
          { title: '最小公倍', value: 'lcm()', text: 'lcm(m,n) : 求m和n的最小公倍数' },
          { title: '排列', value: 'perm()', text: 'perm(m,n) : 从m个不同元素中取出n个元素进行排列; 例 ：perm(5,2) = 20' },
          { title: '组合', value: 'comb()', text: 'comb(m,n) ，从m个不同元素中取出n个元素进行组合; 例 ：comb(5,2)=10' },
          { title: '伽玛函数', value: 'gamma()', text: 'gamma(N)=(N-1)*(N-2)*...*2*1' }
        ],
        [
          { title: '四舍五入', value: 'round()', text: 'round(m,n)/round(m)： m表示需要取舍的数，n表示精度，默认为0。' },
          { title: '向下取整', value: 'floor()', text: 'floor(m)： 对m向下取整' },
          { title: '向上取整', value: 'ceil()', text: 'ceil(m)： 对m向上取整' },
          { title: '取正负号', value: 'sign()', text: 'sign(m)=1 , m>0;  sign(m) = -1, m<0; sign(0) = 0' },
          { title: '取余', value: 'remn()', text: 'remn(m,n) = m%n' },
          { title: '质数', value: 'prime()', text: 'prime(m)： 求第m个质数' }
        ]
      ],
      // 常数的值
      constantArray: [
        [
          { title: '圆周率π', value: 'π' },
          { title: '自然底数e', value: 'e' },
          { title: '法拉第常数F', value: 'F' },
          { title: '普朗克常量h', value: 'h' }
        ],
        [
          { title: '约化普朗克ћ', value: 'ћ' },
          { title: '欧拉γ', value: 'γ' },
          { title: '黄金分割φ', value: 'φ' },
          { title: '光速c', value: 'c' }
        ],
        [
          { title: '阿伏伽德罗N', value: 'N' },
          { title: '理想气体R', value: 'R' },
          { title: '卡钦K', value: 'K' },
          { title: '玻尔兹曼k', value: 'k' }
        ],
        [
          { title: '万有引力G', value: 'G' },
          { title: '磁通量子Φ', value: 'Φ' }
        ]
      ],
      // 所有采集属性的数组  由DataSource过滤得到
      collectProperty: [],
      // DataSource中当前公式对应的属性index
      dataSourceFormulaIndex: -1,
      url: {
        validateFormula: '/propertyTemplate/propertyTemplate/validateFormula'
      }
    }
  },
  created () {
  },
  methods: {
    show () {
      this.filterDataSource()
      this.visible = true
      console.log('SetFormulaModal DataSource=>', this.dataSource)
      console.log('SetFormulaModal rowId=>', this.rowId)
    },
    filterDataSource () {
      this.collectProperty = []
      // console.log('into filterDataSource');
      for (const item in this.dataSource) {
        // console.log('this.dataSource[item].isCalculate=>',this.dataSource[item].isCalculate);
        if (this.dataSource[item].isCalculate === '0') {
          const temp = {
            alias: this.dataSource[item].alias,
            unitName: this.dataSource[item].unitName
          }
          this.collectProperty.push(temp)
        }
        if (this.dataSource[item].id === this.rowId) {
          this.dataSourceFormulaIndex = item
          this.inputValue = this.dataSource[item].formula
          // console.log('this.dataSourceFormulaIndex=>',this.dataSourceFormulaIndex);
        }
      }
    },
    validateFormula () {
      const formula = this.inputValue
      console.log('公式是：', formula)
      postAction(this.url.validateFormula, { formula: formula }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      // console.log("handleOk famula =>" ,this.inputValue)
      const formula = this.inputValue
      console.log('公式是：', formula)
      postAction(this.url.validateFormula, { formula: formula }).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$emit('setFormula', this.rowId, this.inputValue)
          this.visible = false
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleConst (value) {
      if (value === 'DEL') {
        this.handleDel()
        return
      }
      if (value === 'CLR') {
        this.handleClr()
        return
      }
      const _this = this
      const text = _this.inputValue
      const textarea = _this.$refs.textarea
      const { selectionStart, selectionEnd } = textarea
      _this.inputValue = `${text.substring(0, selectionStart)}${value}${text.substring(selectionEnd, text.length)}`
      _this.$nextTick(() => {
        _this.setCursor(textarea, text.substring(0, selectionStart).length + value.length)
      })
    },
    handleFunction (value) {
      const _this = this
      const text = _this.inputValue
      const textarea = _this.$refs.textarea
      const { selectionStart, selectionEnd } = textarea
      _this.inputValue = `${text.substring(0, selectionStart)}${value}${text.substring(selectionEnd, text.length)}`
      _this.$nextTick(() => {
        _this.setCursor(textarea, text.substring(0, selectionStart).length + value.length - 1)
      })
    },
    handleProperty (value) {
      const _this = this
      const text = _this.inputValue
      const textarea = _this.$refs.textarea
      const { selectionStart, selectionEnd } = textarea
      _this.inputValue = `${text.substring(0, selectionStart)}${'#' + value + '#'}${text.substring(selectionEnd, text.length)}`
      _this.$nextTick(() => {
        _this.setCursor(textarea, text.substring(0, selectionStart).length + value.length + 2)
      })
    },
    callback (key) {
      console.log(key)
    },
    setCursor (textDom, pos) {
      if (textDom.setSelectionRange) {
        textDom.focus()
        textDom.setSelectionRange(pos, pos)
      } else if (textDom.createTextRange) {
        const range = textDom.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },
    handleDel () {
      const _this = this
      const text = _this.inputValue
      const textarea = _this.$refs.textarea
      // console.log('textarea=>',textarea);
      const { selectionStart, selectionEnd } = textarea
      // console.log('start=>',selectionStart,'=>',selectionEnd);
      // console.log('text.length=>',text.length);
      _this.inputValue = `${text.substring(0, selectionStart - 1)}${text.substring(selectionEnd, text.length)}`
      _this.$nextTick(() => {
        _this.setCursor(textarea, text.substring(0, selectionStart).length - 1)
      })
    },
    handleClr () {
      this.inputValue = ''
    }
  }

}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/modal.less';
  @import '~@assets/less/topBtns.less';
  .formula-set-tabs{
    height: 360px;
  .ant-btn:not([disabled]):hover {
      background: linear-gradient(0deg, #b5b5b5, #ffffff);
      border: none;
    }
    /deep/.ant-btn{border: none}
  }
  .formula-operator-button{
    width: 100%;
    font-size: 24px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #0000009e;
  }
  .formula-function-button{
    width: 100%;
    font-size: 18px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #0000009e;
  }
  .formula-constant-button{
    width: 100%;
    font-size: 18px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: #0000009e;
  }
  .formula-textarea{
    width: 100%;
    overflow-y: auto;
    font-size: 42px;
    font-family: Microsoft YaHei UI;
    font-weight: bold;
    color: rgb(45, 116, 222);
  }
  .formula-col{
    margin-bottom: 10px;
  }
</style>
