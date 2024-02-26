<template>
    <button @click="click">我是 remote 的按钮</button>
</template>
<script setup>
import { ref } from 'vue'

const count = ref(0);

function click () {
    console.log('remote', count.value);
    count.value++;
}
</script>
<style scoped>
</style>