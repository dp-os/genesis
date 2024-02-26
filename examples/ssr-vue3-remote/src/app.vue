<template>
    <div class="app">
        <button class="btn" @click="click">Click me</button>
    <Header />
    <Button />
    Hello World!{{ count }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// import { defineAsyncComponent }  from 'vue';
// const Button = defineAsyncComponent(async () => import('./common-button.vue'));
// const Header = defineAsyncComponent(async () => import('./common-header.vue'));

import Button from './common-button.vue'
import Header from './common-header.vue'
import { getWord } from './utils'

const count = ref(0);

function click () {
    console.log(getWord('click'));
    count.value++;
}

</script>
<style scoped>
.btn {
    padding: 5px 10px;
    margin: 0;
    border: 1px solid #ccc;
    cursor: pointer;
    background: transparent;
}
</style>