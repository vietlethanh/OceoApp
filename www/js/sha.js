/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(V){function A(a,b,c){var e=0,f=[0],k="",h=null,k=c||"UTF8";if("UTF8"!==k&&"UTF16BE"!==k&&"UTF16LE"!==k)throw"encoding must be UTF8, UTF16BE, or UTF16LE";if("HEX"===b){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";h=E(a);e=h.binLen;f=h.value}else if("TEXT"===b||"ASCII"===b)h=M(a,k),e=h.binLen,f=h.value;else if("B64"===b)h=N(a),e=h.binLen,f=h.value;else if("BYTES"===b)h=O(a),e=h.binLen,f=h.value;else throw"inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";
this.getHash=function(a,b,c,k){var h=null,d=f.slice(),n=e,m;3===arguments.length?"number"!==typeof c&&(k=c,c=1):2===arguments.length&&(c=1);if(c!==parseInt(c,10)||1>c)throw"numRounds must a integer >= 1";switch(b){case "HEX":h=P;break;case "B64":h=Q;break;case "BYTES":h=R;break;default:throw"format must be HEX, B64, or BYTES";}if("SHA-1"===a)for(m=0;m<c;m+=1)d=B(d,n),n=160;else if("SHA-224"===a)for(m=0;m<c;m+=1)d=x(d,n,a),n=224;else if("SHA-256"===a)for(m=0;m<c;m+=1)d=x(d,n,a),n=256;else if("SHA-384"===
a)for(m=0;m<c;m+=1)d=x(d,n,a),n=384;else if("SHA-512"===a)for(m=0;m<c;m+=1)d=x(d,n,a),n=512;else throw"Chosen SHA variant is not supported";return h(d,S(k))};this.getHMAC=function(a,b,c,h,q){var d,n,m,u,r=[],v=[];d=null;switch(h){case "HEX":h=P;break;case "B64":h=Q;break;case "BYTES":h=R;break;default:throw"outputFormat must be HEX, B64, or BYTES";}if("SHA-1"===c)n=64,u=160;else if("SHA-224"===c)n=64,u=224;else if("SHA-256"===c)n=64,u=256;else if("SHA-384"===c)n=128,u=384;else if("SHA-512"===c)n=
128,u=512;else throw"Chosen SHA variant is not supported";if("HEX"===b)d=E(a),m=d.binLen,d=d.value;else if("TEXT"===b||"ASCII"===b)d=M(a,k),m=d.binLen,d=d.value;else if("B64"===b)d=N(a),m=d.binLen,d=d.value;else if("BYTES"===b)d=O(a),m=d.binLen,d=d.value;else throw"inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";a=8*n;b=n/4-1;if(n<m/8){for(d="SHA-1"===c?B(d,m):x(d,m,c);d.length<=b;)d.push(0);d[b]&=4294967040}else if(n>m/8){for(;d.length<=b;)d.push(0);d[b]&=4294967040}for(n=0;n<=b;n+=1)r[n]=d[n]^
909522486,v[n]=d[n]^1549556828;c="SHA-1"===c?B(v.concat(B(r.concat(f),a+e)),a+u):x(v.concat(x(r.concat(f),a+e,c)),a+u,c);return h(c,S(q))}}function q(a,b){this.a=a;this.b=b}function M(a,b){var c=[],e,f=[],k=0,h,p,q;if("UTF8"===b)for(h=0;h<a.length;h+=1)for(e=a.charCodeAt(h),f=[],128>e?f.push(e):2048>e?(f.push(192|e>>>6),f.push(128|e&63)):55296>e||57344<=e?f.push(224|e>>>12,128|e>>>6&63,128|e&63):(h+=1,e=65536+((e&1023)<<10|a.charCodeAt(h)&1023),f.push(240|e>>>18,128|e>>>12&63,128|e>>>6&63,128|e&63)),
p=0;p<f.length;p+=1){for(q=k>>>2;c.length<=q;)c.push(0);c[q]|=f[p]<<24-k%4*8;k+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(h=0;h<a.length;h+=1){e=a.charCodeAt(h);"UTF16LE"===b&&(p=e&255,e=p<<8|e>>8);for(q=k>>>2;c.length<=q;)c.push(0);c[q]|=e<<16-k%4*8;k+=2}return{value:c,binLen:8*k}}function E(a){var b=[],c=a.length,e,f,k;if(0!==c%2)throw"String of HEX type must be in byte increments";for(e=0;e<c;e+=2){f=parseInt(a.substr(e,2),16);if(isNaN(f))throw"String of HEX type contains invalid characters";
for(k=e>>>3;b.length<=k;)b.push(0);b[e>>>3]|=f<<24-e%8*4}return{value:b,binLen:4*c}}function O(a){var b=[],c,e,f;for(e=0;e<a.length;e+=1)c=a.charCodeAt(e),f=e>>>2,b.length<=f&&b.push(0),b[f]|=c<<24-e%4*8;return{value:b,binLen:8*a.length}}function N(a){var b=[],c=0,e,f,k,h,p;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";f=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==f&&f<a.length)throw"Invalid '=' found in base-64 string";for(f=0;f<a.length;f+=4){p=a.substr(f,4);
for(k=h=0;k<p.length;k+=1)e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(p[k]),h|=e<<18-6*k;for(k=0;k<p.length-1;k+=1){for(e=c>>>2;b.length<=e;)b.push(0);b[e]|=(h>>>16-8*k&255)<<24-c%4*8;c+=1}}return{value:b,binLen:8*c}}function P(a,b){var c="",e=4*a.length,f,k;for(f=0;f<e;f+=1)k=a[f>>>2]>>>8*(3-f%4),c+="0123456789abcdef".charAt(k>>>4&15)+"0123456789abcdef".charAt(k&15);return b.outputUpper?c.toUpperCase():c}function Q(a,b){var c="",e=4*a.length,f,k,h;for(f=0;f<e;f+=
3)for(h=f+1>>>2,k=a.length<=h?0:a[h],h=f+2>>>2,h=a.length<=h?0:a[h],h=(a[f>>>2]>>>8*(3-f%4)&255)<<16|(k>>>8*(3-(f+1)%4)&255)<<8|h>>>8*(3-(f+2)%4)&255,k=0;4>k;k+=1)8*f+6*k<=32*a.length?c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-k)&63):c+=b.b64Pad;return c}function R(a){var b="",c=4*a.length,e,f;for(e=0;e<c;e+=1)f=a[e>>>2]>>>8*(3-e%4)&255,b+=String.fromCharCode(f);return b}function S(a){var b={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&
(b.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(b.b64Pad=a.b64Pad)}catch(c){}if("boolean"!==typeof b.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof b.b64Pad)throw"Invalid b64Pad formatting option";return b}function y(a,b){return a<<b|a>>>32-b}function r(a,b){return a>>>b|a<<32-b}function v(a,b){var c=null,c=new q(a.a,a.b);return c=32>=b?new q(c.a>>>b|c.b<<32-b&4294967295,c.b>>>b|c.a<<32-b&4294967295):new q(c.b>>>b-32|c.a<<64-b&4294967295,c.a>>>b-32|c.b<<64-
b&4294967295)}function T(a,b){var c=null;return c=32>=b?new q(a.a>>>b,a.b>>>b|a.a<<32-b&4294967295):new q(0,a.a>>>b-32)}function W(a,b,c){return a&b^~a&c}function X(a,b,c){return new q(a.a&b.a^~a.a&c.a,a.b&b.b^~a.b&c.b)}function U(a,b,c){return a&b^a&c^b&c}function Y(a,b,c){return new q(a.a&b.a^a.a&c.a^b.a&c.a,a.b&b.b^a.b&c.b^b.b&c.b)}function Z(a){return r(a,2)^r(a,13)^r(a,22)}function aa(a){var b=v(a,28),c=v(a,34);a=v(a,39);return new q(b.a^c.a^a.a,b.b^c.b^a.b)}function ba(a){return r(a,6)^r(a,
11)^r(a,25)}function ca(a){var b=v(a,14),c=v(a,18);a=v(a,41);return new q(b.a^c.a^a.a,b.b^c.b^a.b)}function da(a){return r(a,7)^r(a,18)^a>>>3}function ea(a){var b=v(a,1),c=v(a,8);a=T(a,7);return new q(b.a^c.a^a.a,b.b^c.b^a.b)}function fa(a){return r(a,17)^r(a,19)^a>>>10}function ga(a){var b=v(a,19),c=v(a,61);a=T(a,6);return new q(b.a^c.a^a.a,b.b^c.b^a.b)}function D(a,b){var c=(a&65535)+(b&65535);return((a>>>16)+(b>>>16)+(c>>>16)&65535)<<16|c&65535}function ha(a,b,c,e){var f=(a&65535)+(b&65535)+(c&
65535)+(e&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(e>>>16)+(f>>>16)&65535)<<16|f&65535}function F(a,b,c,e,f){var k=(a&65535)+(b&65535)+(c&65535)+(e&65535)+(f&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(e>>>16)+(f>>>16)+(k>>>16)&65535)<<16|k&65535}function ia(a,b){var c,e,f;c=(a.b&65535)+(b.b&65535);e=(a.b>>>16)+(b.b>>>16)+(c>>>16);f=(e&65535)<<16|c&65535;c=(a.a&65535)+(b.a&65535)+(e>>>16);e=(a.a>>>16)+(b.a>>>16)+(c>>>16);return new q((e&65535)<<16|c&65535,f)}function ja(a,b,c,e){var f,k,h;f=(a.b&65535)+
(b.b&65535)+(c.b&65535)+(e.b&65535);k=(a.b>>>16)+(b.b>>>16)+(c.b>>>16)+(e.b>>>16)+(f>>>16);h=(k&65535)<<16|f&65535;f=(a.a&65535)+(b.a&65535)+(c.a&65535)+(e.a&65535)+(k>>>16);k=(a.a>>>16)+(b.a>>>16)+(c.a>>>16)+(e.a>>>16)+(f>>>16);return new q((k&65535)<<16|f&65535,h)}function ka(a,b,c,e,f){var k,h,p;k=(a.b&65535)+(b.b&65535)+(c.b&65535)+(e.b&65535)+(f.b&65535);h=(a.b>>>16)+(b.b>>>16)+(c.b>>>16)+(e.b>>>16)+(f.b>>>16)+(k>>>16);p=(h&65535)<<16|k&65535;k=(a.a&65535)+(b.a&65535)+(c.a&65535)+(e.a&65535)+
(f.a&65535)+(h>>>16);h=(a.a>>>16)+(b.a>>>16)+(c.a>>>16)+(e.a>>>16)+(f.a>>>16)+(k>>>16);return new q((h&65535)<<16|k&65535,p)}function B(a,b){var c=[],e,f,k,h,p,q,r,t,v,d=[1732584193,4023233417,2562383102,271733878,3285377520];for(e=(b+65>>>9<<4)+15;a.length<=e;)a.push(0);a[b>>>5]|=128<<24-b%32;a[e]=b&4294967295;a[e-1]=b/4294967296|0;v=a.length;for(r=0;r<v;r+=16){e=d[0];f=d[1];k=d[2];h=d[3];p=d[4];for(t=0;80>t;t+=1)c[t]=16>t?a[t+r]:y(c[t-3]^c[t-8]^c[t-14]^c[t-16],1),q=20>t?F(y(e,5),f&k^~f&h,p,1518500249,
c[t]):40>t?F(y(e,5),f^k^h,p,1859775393,c[t]):60>t?F(y(e,5),U(f,k,h),p,2400959708,c[t]):F(y(e,5),f^k^h,p,3395469782,c[t]),p=h,h=k,k=y(f,30),f=e,e=q;d[0]=D(e,d[0]);d[1]=D(f,d[1]);d[2]=D(k,d[2]);d[3]=D(h,d[3]);d[4]=D(p,d[4])}return d}function x(a,b,c){var e,f,k,h,p,r,v,t,z,d,n,m,u,x,y,w,A,B,G,H,I,J,K,L,g,C=[],E,l=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];d=[3238371032,
914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];f=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-224"===c||"SHA-256"===c)n=64,e=(b+65>>>9<<4)+15,x=16,y=1,g=Number,w=D,A=ha,B=F,G=da,H=fa,I=Z,J=ba,L=U,K=W,d="SHA-224"===c?d:f;else if("SHA-384"===c||"SHA-512"===c)n=80,e=(b+129>>>10<<5)+31,x=32,y=2,g=q,w=ia,A=ja,B=ka,G=ea,H=ga,I=aa,J=ca,L=Y,K=X,l=[new g(l[0],3609767458),new g(l[1],602891725),new g(l[2],3964484399),new g(l[3],
2173295548),new g(l[4],4081628472),new g(l[5],3053834265),new g(l[6],2937671579),new g(l[7],3664609560),new g(l[8],2734883394),new g(l[9],1164996542),new g(l[10],1323610764),new g(l[11],3590304994),new g(l[12],4068182383),new g(l[13],991336113),new g(l[14],633803317),new g(l[15],3479774868),new g(l[16],2666613458),new g(l[17],944711139),new g(l[18],2341262773),new g(l[19],2007800933),new g(l[20],1495990901),new g(l[21],1856431235),new g(l[22],3175218132),new g(l[23],2198950837),new g(l[24],3999719339),
new g(l[25],766784016),new g(l[26],2566594879),new g(l[27],3203337956),new g(l[28],1034457026),new g(l[29],2466948901),new g(l[30],3758326383),new g(l[31],168717936),new g(l[32],1188179964),new g(l[33],1546045734),new g(l[34],1522805485),new g(l[35],2643833823),new g(l[36],2343527390),new g(l[37],1014477480),new g(l[38],1206759142),new g(l[39],344077627),new g(l[40],1290863460),new g(l[41],3158454273),new g(l[42],3505952657),new g(l[43],106217008),new g(l[44],3606008344),new g(l[45],1432725776),new g(l[46],
1467031594),new g(l[47],851169720),new g(l[48],3100823752),new g(l[49],1363258195),new g(l[50],3750685593),new g(l[51],3785050280),new g(l[52],3318307427),new g(l[53],3812723403),new g(l[54],2003034995),new g(l[55],3602036899),new g(l[56],1575990012),new g(l[57],1125592928),new g(l[58],2716904306),new g(l[59],442776044),new g(l[60],593698344),new g(l[61],3733110249),new g(l[62],2999351573),new g(l[63],3815920427),new g(3391569614,3928383900),new g(3515267271,566280711),new g(3940187606,3454069534),
new g(4118630271,4000239992),new g(116418474,1914138554),new g(174292421,2731055270),new g(289380356,3203993006),new g(460393269,320620315),new g(685471733,587496836),new g(852142971,1086792851),new g(1017036298,365543100),new g(1126000580,2618297676),new g(1288033470,3409855158),new g(1501505948,4234509866),new g(1607167915,987167468),new g(1816402316,1246189591)],d="SHA-384"===c?[new g(3418070365,d[0]),new g(1654270250,d[1]),new g(2438529370,d[2]),new g(355462360,d[3]),new g(1731405415,d[4]),new g(41048885895,
d[5]),new g(3675008525,d[6]),new g(1203062813,d[7])]:[new g(f[0],4089235720),new g(f[1],2227873595),new g(f[2],4271175723),new g(f[3],1595750129),new g(f[4],2917565137),new g(f[5],725511199),new g(f[6],4215389547),new g(f[7],327033209)];else throw"Unexpected error in SHA-2 implementation";for(;a.length<=e;)a.push(0);a[b>>>5]|=128<<24-b%32;a[e]=b&4294967295;a[e-1]=b/4294967296|0;E=a.length;for(m=0;m<E;m+=x){b=d[0];e=d[1];f=d[2];k=d[3];h=d[4];p=d[5];r=d[6];v=d[7];for(u=0;u<n;u+=1)16>u?(z=u*y+m,t=a.length<=
z?0:a[z],z=a.length<=z+1?0:a[z+1],C[u]=new g(t,z)):C[u]=A(H(C[u-2]),C[u-7],G(C[u-15]),C[u-16]),t=B(v,J(h),K(h,p,r),l[u],C[u]),z=w(I(b),L(b,e,f)),v=r,r=p,p=h,h=w(k,t),k=f,f=e,e=b,b=w(t,z);d[0]=w(b,d[0]);d[1]=w(e,d[1]);d[2]=w(f,d[2]);d[3]=w(k,d[3]);d[4]=w(h,d[4]);d[5]=w(p,d[5]);d[6]=w(r,d[6]);d[7]=w(v,d[7])}if("SHA-224"===c)a=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===c)a=d;else if("SHA-384"===c)a=[d[0].a,d[0].b,d[1].a,d[1].b,d[2].a,d[2].b,d[3].a,d[3].b,d[4].a,d[4].b,d[5].a,d[5].b];else if("SHA-512"===
c)a=[d[0].a,d[0].b,d[1].a,d[1].b,d[2].a,d[2].b,d[3].a,d[3].b,d[4].a,d[4].b,d[5].a,d[5].b,d[6].a,d[6].b,d[7].a,d[7].b];else throw"Unexpected error in SHA-2 implementation";return a}"function"===typeof define&&define.amd?define(function(){return A}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=A:exports=A:V.jsSHA=A})(this);
