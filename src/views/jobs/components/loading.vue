
<template>
    <div class="loading" v-if="loading">
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>
<script>


export default {
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
  
<style scoped>
.loading,
.loading>div {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
}

.loading{
    display: inline-block;
}

.loading {
    font-size: 0;
    color: #999;
}

.loading>div {
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
}

.loading {
    width: 54px;
    height: 18px;
}

.loading>div {
    width: 4px;
    height: 4px;
    margin: 4px;
    border-radius: 100%;
    animation: ball-beat 0.7s -0.15s infinite linear;
}

.loading>div:nth-child(2n-1) {
    animation-delay: -0.5s;
}

@keyframes ball-beat {
    50% {
        opacity: 0.2;
        transform: scale(0.75);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
  
