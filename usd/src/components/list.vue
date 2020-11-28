<template>
  <div class="list">
    <div class="list_box">
      <!--展示区域-->
      <el-container>
        <el-header>汇率转换</el-header>
        <el-container>
          <el-aside width="200px">计划任务</el-aside>
          <el-container>
            <el-main>
              <el-form :inline="true"
                       :model="addPlan"
                       class="demo-form-inline">
                <el-form-item>
                  <el-input v-model="addPlan.plan"
                            placeholder="计划"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="addPlan.price"
                            placeholder="价格"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="addPlan.type"
                             placeholder="货币类型">
                    <el-option label="人民币"
                               value="RMB"></el-option>
                    <el-option label="美元"
                               value="USD"></el-option>
                    <el-option label="卢布"
                               value="RUB"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                             @click="add">添加</el-button>
                </el-form-item>
              </el-form>
              <div class="exchange">
                <el-row :gutter="10">
                  <el-col :span="6">
                    <div class="grid-content bg-purple"></div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">{{this.RUBvalue}}卢布/人民币</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">{{this.USDvalue}}卢布/美元</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple">{{this.RMBvalue}}人民币/美元</div>
                  </el-col>
                </el-row>
              </div>
              <el-table ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column prop="plan"
                                 label="计划">
                </el-table-column>
                <el-table-column prop="USD"
                                 label="美元"
                                 width="180">
                </el-table-column>
                <el-table-column prop="RMB"
                                 label="人民币"
                                 width="180">
                </el-table-column>
                <el-table-column prop="RUB"
                                 label="卢布"
                                 width="180">
                </el-table-column>
                <el-table-column width="180">
                  <template slot-scope="scope">
                    <el-button @click="handleFinish(scope.row.id)">完成</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="toUse">
                <el-row :gutter="55">
                  <el-col :span="10">
                    <div class="grid-content bg-purple">将要花费</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.totalUSD.toFixed(5)}}</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.totalRMB.toFixed(5)}}</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.totalRUB.toFixed(5)}}</div>
                  </el-col>
                </el-row>
              </div>
              <el-table ref="multipleTable"
                        :data="FinishData"
                        tooltip-effect="dark"
                        style="width: 100%">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column prop="plan"
                                 label="已完成">
                </el-table-column>
                <el-table-column prop="USD"
                                 label="美元"
                                 width="180">
                </el-table-column>
                <el-table-column prop="RMB"
                                 label="人民币"
                                 width="180">
                </el-table-column>
                <el-table-column prop="RUB"
                                 label="卢布"
                                 width="180">
                </el-table-column>
                <el-table-column width="180">
                  <template>
                  </template>
                </el-table-column>
              </el-table>
              <div class="uesd">
                <el-row :gutter="55">
                  <el-col :span="10">
                    <div class="grid-content bg-purple">一共花了</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.finishUSD.toFixed(5)}}</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.finishRMB.toFixed(5)}}</div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">{{this.finishRUB.toFixed(5)}}</div>
                  </el-col>
                </el-row>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      USD: {},
      RUB: {},
      RMBvalue: 0,
      USDvalue: 0,
      RUBvalue: 0,
      checked: true,
      addPlan: {
        plan: '',
        price: '',
        type: '',
        USD: '',
        RMB: '',
        RUB: ''
      },
      tableData: [{
        plan: '去哪里/干什么',
        USD: '0',
        RMB: '0',
        RUB: '0',
        type: ''
      }],
      FinishData: [],
      multipleSelection: [],
      totalUSD: 0,
      totalRMB: 0,
      totalRUB: 0,
      finishUSD: 0,
      finishRMB: 0,
      finishRUB: 0
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    async getlist () {
      const { data } = await this.$http.get('forex')
      this.USD = data.USD
      this.RUB = data.RUB
      this.RMBvalue = (1 / this.USD.value).toFixed(3)
      this.RUBvalue = (1 * this.RUB.value).toFixed(3)
      this.USDvalue = (this.RMBvalue * this.RUBvalue).toFixed(3)
    },
    add () {
      let i = 1
      if (this.addPlan.type === 'USD') {
        this.addPlan.USD = this.addPlan.price
        this.addPlan.RMB = (this.addPlan.price * this.RMBvalue).toFixed(5)
        this.addPlan.RUB = (this.addPlan.price * this.RMBvalue * this.RUBvalue).toFixed(5)
        i *= this.addPlan.USD
        this.tableData.push(this.addPlan)
      } else if (this.addPlan.type === 'RMB') {
        this.addPlan.RMB = this.addPlan.price
        this.addPlan.USD = (this.addPlan.price / this.RMBvalue).toFixed(5)
        this.addPlan.RUB = (this.addPlan.price * this.RUBvalue).toFixed(5)
        i *= this.addPlan.USD
        this.tableData.push(this.addPlan)
      } else {
        this.addPlan.RUB = this.addPlan.price
        this.addPlan.RMB = (this.addPlan.price / this.RUBvalue).toFixed(5)
        this.addPlan.USD = (this.addPlan.RMB / this.USDvalue).toFixed(5)
        i *= this.addPlan.USD
        this.tableData.push(this.addPlan)
      }
      this.addPlan.id = i
      this.addPlan = {}
      if (this.totalUSD !== 0) {
        this.totalUSD = 0
        this.totalRMB = 0
        this.totalRUB = 0
      }
      for (const v of this.tableData) {
        const USDprice = parseFloat(v.USD)
        const RMBprice = parseFloat(v.RMB)
        const RUBprice = parseFloat(v.RUB)
        this.totalUSD += USDprice
        this.totalRMB += RMBprice
        this.totalRUB += RUBprice
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleFinish (id) {
      for (const k of this.multipleSelection) {
        if (k.id === id) {
          this.FinishData.push(k)
          const index = this.tableData.findIndex(function (v) {
            return v === k
          })
          this.tableData.splice(index, 1)
        }
      }
      if (this.totalUSD !== 0) {
        this.totalUSD = 0
        this.totalRMB = 0
        this.totalRUB = 0
      }
      for (const v of this.tableData) {
        const USDprice = parseFloat(v.USD)
        const RMBprice = parseFloat(v.RMB)
        const RUBprice = parseFloat(v.RUB)
        this.totalUSD += USDprice
        this.totalRMB += RMBprice
        this.totalRUB += RUBprice
      }
      if (this.finishUSD !== 0) {
        this.finishUSD = 0
        this.finishRMB = 0
        this.finishRUB = 0
      }
      for (const v of this.FinishData) {
        const USDprice = parseFloat(v.USD)
        const RMBprice = parseFloat(v.RMB)
        const RUBprice = parseFloat(v.RUB)
        this.finishUSD += USDprice
        this.finishRMB += RMBprice
        this.finishRUB += RUBprice
      }
      this.$refs.multipleTable.toggleAllSelection()
    }
  }
}
</script>

<style scoped>
.list {
  height: 100%;
}
.list_box {
  width: 100%;
  height: 300px;
  background-color: #fff;
}
.el-col {
  border-radius: 4px;
  text-align: end;
}
.toUse,
.uesd {
  margin: 30px 0;
  overflow: hidden;
}
.toUse .el-col,
.uesd .el-col {
  text-align: start;
}
</style>
