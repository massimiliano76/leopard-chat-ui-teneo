(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-48016bfe"],{"5e50":function(e,t,n){"use strict";var u=n("dc04");n.n(u).a},dc04:function(e,t,n){},e4ab:function(e,t,n){"use strict";n.r(t),n("d3b7"),n("ca6b").getLogger("CustomModal.vue");var u={components:{Dialog:function(){return n.e("chunk-f7d2312e").then(n.bind(null,"3f7a"))},Audio:function(){return Promise.all([n.e("chunk-74a28518"),n.e("chunk-2d213f05")]).then(n.bind(null,"af8b"))},Carousel:function(){return n.e("chunk-13e1c832").then(n.bind(null,"3693"))},ImageAnimation:function(){return n.e("chunk-ebd1be88").then(n.bind(null,"d45e"))},Map:function(){return n.e("chunk-04c719b8").then(n.bind(null,"a0be"))},Video:function(){return Promise.all([n.e("chunk-74a28518"),n.e("chunk-2d0de91f")]).then(n.bind(null,"85e1"))},Vimeo:function(){return Promise.all([n.e("chunk-74a28518"),n.e("chunk-2d21088b")]).then(n.bind(null,"b7ff"))},YouTube:function(){return Promise.all([n.e("chunk-74a28518"),n.e("chunk-2d0e455c")]).then(n.bind(null,"907f"))}},props:{items:{type:Array,required:!0}},data:function(){return{}},computed:{dark:function(){return this.$store.getters.dark},showCustomModal:function(){return!!(this.$store.getters.showCustomModal&&this.items&&this.items.length>0)}},methods:{closeModal:function(){this.$store.commit("HIDE_CUSTOM_MODAL")}}},a=(n("5e50"),n("2877")),i=n("6544"),o=n.n(i),s=n("a523"),r=Object(a.a)(u,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.showCustomModal?n("Dialog",{attrs:{show:e.showCustomModal,title:"Additional Information",width:"500px"},on:{close:e.closeModal}},[n("v-container",{staticClass:"modal-container"},e._l(e.items,(function(t,u){return n("span",{key:u},["title"===t.type?n("div",{staticClass:"title add-padding",domProps:{innerHTML:e._s(t.value)}}):e._e(),"subtitle"===t.type?n("div",{staticClass:"grey--text add-padding",domProps:{innerHTML:e._s(t.value)}}):e._e(),"html"===t.type?n("div",{staticClass:"add-padding",domProps:{innerHTML:e._s(t.value)}}):e._e(),"youTube"===t.type?n("YouTube",{attrs:{"video-id":t.value}}):e._e(),"audio"===t.type?n("Audio",{attrs:{url:t.value}}):e._e(),"vimeo"===t.type?n("Vimeo",{attrs:{"video-id":t.value}}):e._e(),"video"===t.type?n("Video",{attrs:{url:t.value,type:"mp4"}}):e._e(),"map"===t.type?n("Map",{attrs:{address:t.value}}):e._e(),"image"===t.type?n("ImageAnimation",{attrs:{url:t.value}}):e._e(),"carousel"===t.type?n("Carousel",{attrs:{"image-items":t.value}}):e._e()],1)})),0)],1):e._e()}),[],!1,null,null,null);t.default=r.exports,o()(r,{VContainer:s.a})}}]);