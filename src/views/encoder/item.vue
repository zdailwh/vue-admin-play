<template>
  <div style="padding: 0 20px;">
    <div v-if="$route.meta.showTab">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="Jobs" :name="'/encoder/item/' + eid + '/services'" />
        <el-tab-pane label="Status" :name="'/encoder/item/' + eid + '/status'" />
        <el-tab-pane label="Settings" :name="'/encoder/item/' + eid + '/settings'" />
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      eid: this.$route.params.eid,
      activeTab: this.$route.path
    }
  },
  watch: {
    activeTab(val) {
      this.$router.push({ path: val })
    },
    $route(val) {
      if (val.path) {
        console.log(val.path)
        this.activeTab = val.path
      }
    }
  },
  methods: {
    handleClick(tab, event) {
    }
  }
}
</script>

<style scoped>
</style>
