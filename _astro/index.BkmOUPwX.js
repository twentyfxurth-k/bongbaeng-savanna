import{r as c}from"./index.DBy5LfQW.js";var d={exports:{}},f={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var E;function p(){if(E)return f;E=1;var n=Symbol.for("react.transitional.element"),l=Symbol.for("react.fragment");function e(r,t,u){var i=null;if(u!==void 0&&(i=""+u),t.key!==void 0&&(i=""+t.key),"key"in t){u={};for(var x in t)x!=="key"&&(u[x]=t[x])}else u=t;return t=u.ref,{$$typeof:n,type:r,key:i,ref:t!==void 0?t:null,props:u}}return f.Fragment=l,f.jsx=e,f.jsxs=e,f}var R;function _(){return R||(R=1,d.exports=p()),d.exports}var T=_();let s=[],o=0;const a=4;let h=n=>{let l=[],e={get(){return e.lc||e.listen(()=>{})(),e.value},lc:0,listen(r){return e.lc=l.push(r),()=>{for(let u=o+a;u<s.length;)s[u]===r?s.splice(u,a):u+=a;let t=l.indexOf(r);~t&&(l.splice(t,1),--e.lc||e.off())}},notify(r,t){let u=!s.length;for(let i of l)s.push(i,e.value,r,t);if(u){for(o=0;o<s.length;o+=a)s[o](s[o+1],s[o+2],s[o+3]);s.length=0}},off(){},set(r){let t=e.value;t!==r&&(e.value=r,e.notify(t))},subscribe(r){let t=e.listen(r);return r(e.value),t},value:n};return e};function m(n,l,e){let r=new Set(l).add(void 0);return n.listen((t,u,i)=>{r.has(i)&&e(t,u,i)})}let v=(n,l)=>e=>{n.current!==e&&(n.current=e,l())};function j(n,{keys:l,deps:e=[n,l]}={}){let r=c.useRef();r.current=n.get();let t=c.useCallback(i=>(v(r,i)(n.value),l?.length>0?m(n,l,v(r,i)):n.listen(v(r,i))),e),u=()=>r.current;return c.useSyncExternalStore(t,u,u)}export{h as a,T as j,j as u};
