
import Vue from 'vue'
import LoadingBar from './LoadingBar.vue'

let container;
if (process.browser){
  container = document.body;
}
let timer = null ,removeTimer = null;
let LoadingBarConstructor = Vue.extend(LoadingBar);
LoadingBarConstructor.prototype.init = function(){
    clearTimeout(timer);
    this.totalProgress = 0;
    this.isError = false;
    this.vm = this.$mount();
    container.appendChild(this.vm.$el);
    return this
}
LoadingBarConstructor.prototype.start = function () {
    this.init();
    timer = setInterval(() => {
      if (this.totalProgress < 90) {
        this.totalProgress += (this.percentNum || Math.random()) * this.speed;
      }
    }, 100);
};
LoadingBarConstructor.prototype.end = function () {
  timer || this.init();
  this.totalProgress = 100;
  clearTimeout(removeTimer);
  removeTimer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    container.removeChild(this.vm.$el)
  }, 200)
};

export default new LoadingBarConstructor
