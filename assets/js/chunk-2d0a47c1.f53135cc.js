(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0a47c1"],{"0748":function(e,t,r){"use strict";r.r(t),r("4160"),r("d81d"),r("26e9"),r("fb6a"),r("b64b"),r("07ac"),r("159b");var n=r("fa7d"),a=(r("ca6b").getLogger("Table.vue"),{props:{headers:{type:Array,required:!0},items:{type:Array,required:!0},search:{type:String,required:!1},footer:{type:String,required:!0},rowsPerPage:{type:Array,required:!0}},methods:{getValues:function(e){return Object.values(e)},getUuid:function(){return Object(n.y)()},isEnabled:function(e){return this.enabled===e},unescapeHTML:function(e){var t=document.createElement("textarea");return t.innerHTML=e,t.value},makeHtml:function(){var e=this,t=this.items.map((function(t){return Object.keys(t).forEach((function(r){t[r]=e.unescapeHTML(t[r])})),t}));return console.log(t),t}},computed:{calcRowsPerPage:function(){var e=[{text:"All",value:-1}];if(this.rowsPerPage&&this.rowsPerPage.length>=0){var t=this.rowsPerPage.slice(0);(t=t.reverse()).forEach((function(t){e.unshift(t)}))}else e.unshift(5,10,25);return e}}}),s=r("2877"),o=r("6544"),u=r.n(o),i=r("0798"),c=r("8fea"),l=Object(s.a)(a,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.items&&e.items.length?r("v-data-table",{attrs:{headers:e.headers,items:e.makeHtml(),search:e.search,"footer-props":{itemsPerPageOptions:e.calcRowsPerPage}},scopedSlots:e._u([{key:"body",fn:function(t){var n=t.items;return[r("tbody",e._l(n,(function(t,n){return r("tr",{key:n+e.getUuid},[e._l(e.getValues(t),(function(t,n){return[r("td",{key:n+e.getUuid,domProps:{innerHTML:e._s(t)}})]}))],2)})),0)]}}],null,!1,1536739201)},[r("v-alert",{attrs:{slot:"no-results",value:!0,color:"error",icon:"mdi-alert-octagram"},slot:"no-results"},[e._v('Your search for "'+e._s(e.search)+'" found no results.')]),e.footer?r("template",{slot:"footer"},[r("td",{attrs:{colspan:"100%"}},[r("strong",[e._v(e._s(e.footer))])])]):e._e()],2):e._e()}),[],!1,null,null,null);t.default=l.exports,u()(l,{VAlert:i.a,VDataTable:c.a})}}]);