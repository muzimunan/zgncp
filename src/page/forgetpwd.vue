<template>
  <div class="reset-password">
    <div class="header">
      <div class="header-layout">
        <h2 class="title-log">找回密码</h2>
      </div>
    </div>
    <div class="content">
      <div class="content-layout">
        <div class="maincenter">
          <div class="maincenter-box">
            <div class="maincenter-box-tip">
              <p>
                <i class="el-icon-info"></i>
                根据提示找回密码
              </p>
            </div>
            <el-form
              label-position="right"
              label-width="70px"
              :model="inputForm"
              ref="inputFormRef"
              :rules="inputFormRules"
            >
              <el-steps :active="active" finish-status="success">
                <el-step title="输入手机号"></el-step>
                <el-step title="验证信息"></el-step>
                <el-step title="完成"></el-step>
              </el-steps>
              <div v-if="active !== 3">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="inputForm.phone" style="width: 355px"></el-input>
                </el-form-item>
                <el-form-item label="随机码" prop="randomCode">
                  <el-input v-model="inputForm.randomCode" style="width: 225px; top: -12px"></el-input>
                  <div class="login-code" @click="refreshCode">
                    <!--验证码组件-->
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </el-form-item>
                <el-form-item label="验证码" v-if="this.active === 1" prop="verificationCode">
                  <el-input v-model="inputForm.verificationCode" style="width: 230px"></el-input>
                  <el-button v-show="!sendMessageDisable" class="vBtn" type="primary" @click="sendMessage">
                    <span>获取短信验证码</span>
                  </el-button>
                  <el-button v-show="sendMessageDisable" class="vBtn" type="info" :disabled="sendMessageDisable">
                    <span>{{ timeCount }}s重新发送</span>
                  </el-button>
                </el-form-item>
              </div>
              <div v-if="active === 3">
                <p>密码找回提示：密码已通过短信发送，请查收！</p>
              </div>
            </el-form>
            <div style="text-align: right" v-if="active !== 3">
              <el-button type="primary" plain @click="goBackLogin">返回登录页</el-button>
              <el-button type="primary" @click="next">下一步</el-button>
            </div>
            <div style="text-align: right" v-if="active === 3">
              <el-button type="primary" plain @click="goBackLogin">返回登录页</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SIdentify from '@/components/sidentify'

import { verificationCode, nextStep } from '@/api/login'
export default {
  name: 'ForgetPwd',
  components: { SIdentify },
  data() {
    const _that = this
    return {
      active: 0,
      identifyCodes: '1234567890',
      identifyCode: '',
      sendMessageDisable: false, // 发送短信输入框是否开始倒计时 true 开始倒计时
      timeCount: 60, // 倒计时
      timeId: '', // 存储定时器ID
      inputForm: {
        phone: '', // 手机号
        verificationCode: ''// 验证码
      },
      inputFormRules: {
        phone: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        randomCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== _that.identifyCode) {
                callback(new Error('请输入正确的验证码'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    // 验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    next() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.active === 0) {
            this.active++
          } else if (this.active === 1) {
            nextStep({ phone: this.inputForm.phone, verificationCode: this.inputForm.verificationCode }).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.active = 2
                this.active = 3
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 返回登陆页
    goBackLogin() {
      this.$router.push({ path: '/login' })
    },
    sendMessage() {
      verificationCode({
        phone: this.inputForm.phone
      }).then((res) => {
        if (res && parseInt(res.data.code) === 0) {
          const COUNT = 120
          this.sendMessageDisable = true
          this.timeId = setInterval(() => {
            if (this.timeCount > 0 && this.timeCount <= COUNT) {
              this.timeCount--
            } else if (this.timeCount === 0) {
              clearInterval(this.timeId)
              this.timeCount = 120
              this.timeId = null
              this.sendMessageDisable = false
            }
          }, 1000)
          this.$message.success('发送成功！')
        } else {
          this.sendMessageDisable = false
          this.$message.error('发送失败！')
        }
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.reset-password {
  .header {
    width: 100%;
    height: 100px;
    border-bottom: 1px solid #e3e3e3;
    background-color: #f0f0f0;
    .header-layout {
      width: 990px;
      margin: 0 auto;
      padding: 30px 0;
      overflow: hidden;
      .title-log {
        //float: left;
        display: inline-block;
        width: auto;
        height: 30px;
        padding: 5px 0 0 10px;
        line-height: 30px;
        font-size: 24px;
        color: #303030;
      }
    }
  }
  .content {
    width: 100%;
    min-height: 500px;
    border-top: 1px solid #fff;
    .content-layout {
      margin: 0 auto;
      padding: 30px 0;
      width: 990px;
      height: auto;
      .maincenter {
        margin: 0 auto;
        width: 774px;
        height: auto;
        .maincenter-box {
          padding: 20px 0;
          background-color: #fff;
          .maincenter-box-tip[data-v-73ae7c3b] {
            display: block;
            padding-bottom: 10px;
          }
          .login-code {
            display: inline-block;
            cursor: pointer;
          }
          .el-steps--horizontal {
            white-space: nowrap;
            margin: ma;
            margin-bottom: 60px;
          }
          .vBtn {
            margin-left: 10px;
            width: 114px;
          }
        }
      }
    }
  }
}
</style>
