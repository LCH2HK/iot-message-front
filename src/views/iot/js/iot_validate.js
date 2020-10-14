
/**
 * 产品编号，只允许数字，字母，下划线
 * @param s
 * @returns {boolean}
 */
export function isLetters(s) {
  return /^[a-zA-z0-9_\-]*$/.test(s);
}

/**
 * 常规校验，不为空，且不超过20字，不少于2，一个汉字无法表达实意，至少需要两个
 * 可以输入汉字，不能输入特殊字符、空格
 */
export function normalValidate(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (/[\s+]/g.test(value))  {
    callback('不可添加空格!')
  }else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)) {
    callback('不可输入特殊字符!')
  }else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}

export function normalValidate1(label, length, value) {
  let val = value ? value : ''
  if (val.length === 0) {
    return '请填写' + label + '！';
  } else if (/[\s+]/g.test(value))  {
    return '不可添加空格!';
  }else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)) {
    return '不可输入特殊字符!';
  }else if (val.length < length[0]) {
    return '最少输入' + length[0] + '个字';
  } else if (val.length > length[1]) {
    return '最多输入' + length[1] + '个字';
  } else {
    return 0;
  }
}

export function unitValidate(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (/[\s+]/g.test(value))  {
    callback('不可添加空格!')
  }else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}

export function unitValidate1(label, length, value) {
  let val = value ? value : ''
  if (val.length === 0) {
    return '请填写' + label + '！';
  } else if (/[\s+]/g.test(value))  {
    return '不可添加空格!';
  }else if (val.length < length[0]) {
    return '最少输入' + length[0] + '个字';
  } else if (val.length > length[1]) {
    return '最多输入' + length[1] + '个字';
  } else {
    return 0;
  }
}

/**
 * 非汉字校验，不为空，字符不多于32，不少于6
 */
export function codeValidate(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0 ) {
    callback('请输入' + label + '！')
  } else if (/[\s+]/g.test(value))  {
    callback('不可添加空格!')
  } else if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback('不可输入汉字!')
  } else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)) {
    callback('不可输入特殊字符!')
  }else if (val.length < length[0]){
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  }  else {
    callback()
  }
}

/**
 * 不允许空格，汉字，允许特殊字符
 */
export function specialValidate(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0 ) {
    callback('请填写' + label + '！')
  } else if (/[\s+]/g.test(value))  {
    callback('不可添加空格!')
  } else if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback('不可输入汉字!')
  }else if (val.length < length[0]){
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  }  else {
    callback()
  }
}


export function isHaveSpecialChar(str) {
  var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
  if(!patrn.test(str)) {// 如果包含特殊字符返回false
    return false;
  }else {
    return true;
  }
}

export function specialCharReplace(s) {
  var pattern = new RegExp("[`~!@#$%^&*()_\\-+=<>?:\"{}|,.\\/;'\\\\[\\]·~！@#￥%……&*（）——\\-+={}|《》？：“”【】、；‘’，。、]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    var temp = s.substr(i, 1);
    rs = rs + temp.replace(pattern, "\\"+temp);
  }
  return rs;
}

/**
 * 数据库url校验
 * 不能包含汉字，空格
 */
export function dbUrlValidate(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (/[\s+]/g.test(value)) {
    callback('不可添加空格!')
  } else if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback('不可输入汉字!')
  } else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}

/**
 *  字符个数校验
 */
export function charNumValidate(label, length, rule, value, callback) {
  let val = value ? value : '';
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}

/**
 * 不允许空格
 */
export function noBlank(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (/[\s+]/g.test(value))  {
    callback('不可添加空格!')
  } else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}

/**
 * 只允许数字
 */
export function numberOnly(label, length, rule, value, callback) {
  let val = value ? value : ''
  if (val.length === 0) {
    callback('请填写' + label + '！')
  } else if (/[^\d]/g.test(value))  {
    callback('只能输入数字!')
  } else if (val.length < length[0]) {
    callback('最少输入' + length[0] + '个字')
  } else if (val.length > length[1]) {
    callback('最多输入' + length[1] + '个字')
  } else {
    callback()
  }
}
export function floatNumberValidate(label, length, rule, value, callback) {
  let val = value ? value.trim() : ''
  if (!/^[-+]?\d+\.?\d*$/g.test(val))  {
    callback('请输入正确的浮点数!')
  } else if (val.length > length[1]) {
    callback('数字最大长度为' + length[1])
  } else {
    callback()
  }
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
