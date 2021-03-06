// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006

// Basic JavaScript BN library - subset useful for RSA encryption.


JSBN = {

// Bits per digit
	dbits: null,

// JavaScript engine analysis
	canary: 0xdeadbeefcafe,
	j_lm: ((this.canary&0xffffff)==0xefcafe),
	
	BI_FP: 52,
	
	BI_RM: "0123456789abcdefghijklmnopqrstuvwxyz",
	BI_RC: new Array(),
	// return new, unset BigInteger
	nbi: function () { return new JSBN.BigInteger(null); },
	
	
	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	// We need to select the fastest one that works in this environment.
	
	// am1: use a single mult and divide to get the high bits,
	// max digit bits should be 26 because
	// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	am1: function (i,x,w,j,c,n) {
		  while(--n >= 0) {
			var v = x*this[i++]+w[j]+c;
			c = Math.floor(v/0x4000000);
			w[j++] = v&0x3ffffff;
		  }
		  return c;
		},
		
	// am2 avoids a big mult-and-extract completely.
	// Max digit bits should be <= 30 because we do bitwise ops
	// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	am2: function (i,x,w,j,c,n) {
	  var xl = x&0x7fff, xh = x>>15;
	  while(--n >= 0) {
		var l = this[i]&0x7fff;
		var h = this[i++]>>15;
		var m = xh*l+h*xl;
		l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
		c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
		w[j++] = l&0x3fffffff;
	  }
	  return c;
	},
		
	// Alternately, set max digit bits to 28 since some
	// browsers slow down when dealing with 32-bit numbers.
	am3: function (i,x,w,j,c,n) {
	  var xl = x&0x3fff, xh = x>>14;
	  while(--n >= 0) {
		var l = this[i]&0x3fff;
		var h = this[i++]>>14;
		var m = xh*l+h*xl;
		l = xl*l+((m&0x3fff)<<14)+w[j]+c;
		c = (l>>28)+(m>>14)+xh*h;
		w[j++] = l&0xfffffff;
	  }
	  return c;
	}
	,
	
	
	am_init: function () {
		if(JSBN.j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
			JSBN.BigInteger.prototype.am = JSBN.am2;
			JSBN.dbits = 30;
		}
		else if(JSBN.j_lm && (navigator.appName != "Netscape")) {
			JSBN.BigInteger.prototype.am = JSBN.am1;
			JSBN.dbits = 26;
		}
		else { // Mozilla/Netscape seems to prefer am3
			JSBN.BigInteger.prototype.am = JSBN.am3;
			JSBN.dbits = 28;
		}
	}
	,
	
	digit_conversions: function () {
		// Digit conversions
		var rr,vv;
		rr = "0".charCodeAt(0);
		for(vv = 0; vv <= 9; ++vv) JSBN.BI_RC[rr++] = vv;
		rr = "a".charCodeAt(0);
		for(vv = 10; vv < 36; ++vv) JSBN.BI_RC[rr++] = vv;
		rr = "A".charCodeAt(0);
		for(vv = 10; vv < 36; ++vv) JSBN.BI_RC[rr++] = vv;
	}
	,

	int2char: function (n) { return JSBN.BI_RM.charAt(n); },
	intAt: function (s,i) {
	  var c = JSBN.BI_RC[s.charCodeAt(i)];
	  return (c==null)?-1:c;
	}
	,
	
// return bigint initialized to value
	nbv: function (i) { var r = JSBN.nbi(); r.fromInt(i); return r; }
	,
	
// returns bit length of the integer x
	nbits: function (x) {
	  var r = 1, t;
	  if((t=x>>>16) != 0) { x = t; r += 16; } 
	  if((t=x>>8) != 0) { x = t; r += 8; }
	  if((t=x>>4) != 0) { x = t; r += 4; }
	  if((t=x>>2) != 0) { x = t; r += 2; }
	  if((t=x>>1) != 0) { x = t; r += 1; }
	  return r;
	}
};


// Modular reduction using "classic" algorithm
JSBN.Classic = function (m) { 
	this.m = m;
	this.convert = function cConvert(x) {
	  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	  else return x;
	};
	this.revert = function (x) { return x; };
	this.reduce = function (x) { x.divRemTo(this.m,null,x); };
	this.mulTo = function (x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
	this.sqrTo = function (x,r) { x.squareTo(r); this.reduce(r); };
};


// Montgomery reduction
JSBN.Montgomery = function (m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;

	
	// xR mod m
	this.convert = function (x) {
	  var r = JSBN.nbi();
	  x.abs().dlShiftTo(this.m.t,r);
	  r.divRemTo(this.m,null,r);
	  if(x.s < 0 && r.compareTo(JSBN.BigInteger.ZERO) > 0) this.m.subTo(r,r);
	  return r;
	};
	
	// x/R mod m
	this.revert = function (x) {
	  var r = JSBN.nbi();
	  x.copyTo(r);
	  this.reduce(r);
	  return r;
	};
	
	// x = x/R mod m (HAC 14.32)
	this.reduce = function (x) {
	  while(x.t <= this.mt2)	// pad x so am has enough room later
		x[x.t++] = 0;
	  for(var i = 0; i < this.m.t; ++i) {
		// faster way of calculating u0 = x[i]*mp mod DV
		var j = x[i]&0x7fff;
		var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
		// use am to combine the multiply-shift-add into one call
		j = i+this.m.t;
		x[j] += this.m.am(0,u0,x,i,0,this.m.t);
		// propagate carry
		while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	  }
	  x.clamp();
	  x.drShiftTo(this.m.t,x);
	  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	};
	
	// r = "x^2/R mod m"; x != r
	this.sqrTo = function (x,r) { x.squareTo(r); this.reduce(r); };
	
	// r = "xy/R mod m"; x,y != r
	this.mulTo = function (x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
};

// (public) Constructor
JSBN.BigInteger = function (a,b,c) {
	if(a != null)
		if("number" == typeof a) this.fromNumber(a,b,c);
		else if(b == null && "string" != typeof a) this.fromString(a,256);
		else this.fromString(a,b);
};


// chars optimization :-)
if (1) {

	var BI = JSBN.BigInteger;
	JSBN.am_init();
	
	BI.prototype.DB = JSBN.dbits;
	BI.prototype.DM = ((1<<JSBN.dbits)-1);
	BI.prototype.DV = (1<<JSBN.dbits);
	
	BI.prototype.FV = Math.pow(2,JSBN.BI_FP);
	BI.prototype.F1 = JSBN.BI_FP-JSBN.dbits;
	BI.prototype.F2 = 2*JSBN.dbits-JSBN.BI_FP;
	
	JSBN.digit_conversions();
	
	
	// (protected) copy this to r
	BI.prototype.copyTo = function (r) {
	  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	  r.t = this.t;
	  r.s = this.s;
	};
	
	// (protected) set from integer value x, -DV <= x < DV
	BI.prototype.fromInt = function (x) {
	  this.t = 1;
	  this.s = (x<0)?-1:0;
	  if(x > 0) this[0] = x;
	  else if(x < -1) this[0] = x+DV;
	  else this.t = 0;
	};
	
	// (protected) set from string and radix
	BI.prototype.fromString = function (s,b) {
	  var k;
	  if(b == 16) k = 4;
	  else if(b == 8) k = 3;
	  else if(b == 256) k = 8; // byte array
	  else if(b == 2) k = 1;
	  else if(b == 32) k = 5;
	  else if(b == 4) k = 2;
	  else { this.fromRadix(s,b); return; }
	  this.t = 0;
	  this.s = 0;
	  var i = s.length, mi = false, sh = 0;
	  while(--i >= 0) {
		var x = (k==8)?s[i]&0xff:JSBN.intAt(s,i);
		if(x < 0) {
		  if(s.charAt(i) == "-") mi = true;
		  continue;
		}
		mi = false;
		if(sh == 0) this[this.t++] = x;
		else if(sh+k > this.DB) {
		  this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
		  this[this.t++] = (x>>(this.DB-sh));
		}
		else this[this.t-1] |= x<<sh;
		sh += k;
		if(sh >= this.DB) sh -= this.DB;
	  }
	  if(k == 8 && (s[0]&0x80) != 0) {
		this.s = -1;
		if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	  }
	  this.clamp();
	  if(mi) JSBN.BigInteger.ZERO.subTo(this,this);
	};
	
	// (protected) clamp off excess high words
	BI.prototype.clamp = function () {
	  var c = this.s&this.DM;
	  while(this.t > 0 && this[this.t-1] == c) --this.t;
	};
	
	// (public) return string representation in given radix
	BI.prototype.toString = function (b) {
	  if(this.s < 0) return "-"+this.negate().toString(b);
	  var k;
	  if(b == 16) k = 4;
	  else if(b == 8) k = 3;
	  else if(b == 2) k = 1;
	  else if(b == 32) k = 5;
	  else if(b == 4) k = 2;
	  else return this.toRadix(b);
	  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
	  var p = this.DB-(i*this.DB)%k;
	  if(i-- > 0) {
		if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = JSBN.int2char(d); }
		while(i >= 0) {
		  if(p < k) {
			d = (this[i]&((1<<p)-1))<<(k-p);
			d |= this[--i]>>(p+=this.DB-k);
		  }
		  else {
			d = (this[i]>>(p-=k))&km;
			if(p <= 0) { p += this.DB; --i; }
		  }
		  if(d > 0) m = true;
		  if(m) r += JSBN.int2char(d);
		}
	  }
	  return m?r:"0";
	};
	
	// (public) -this
	BI.prototype.negate = function () { var r = JSBN.nbi(); JSBN.BigInteger.ZERO.subTo(this,r); return r; };
	
	// (public) |this|
	BI.prototype.abs = function () { return (this.s<0)?this.negate():this; };
	
	// (public) return + if this > a, - if this < a, 0 if equal
	BI.prototype.compareTo = function (a) {
	  var r = this.s-a.s;
	  if(r != 0) return r;
	  var i = this.t;
	  r = i-a.t;
	  if(r != 0) return r;
	  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
	  return 0;
	};
	
	
	// (public) return the number of bits in "this"
	BI.prototype.bitLength = function () {
	  if(this.t <= 0) return 0;
	  return this.DB*(this.t-1)+JSBN.nbits(this[this.t-1]^(this.s&this.DM));
	};
	
	// (protected) r = this << n*DB
	BI.prototype.dlShiftTo = function (n,r) {
	  var i;
	  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	  for(i = n-1; i >= 0; --i) r[i] = 0;
	  r.t = this.t+n;
	  r.s = this.s;
	};
	
	// (protected) r = this >> n*DB
	BI.prototype.drShiftTo = function (n,r) {
	  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	  r.t = Math.max(this.t-n,0);
	  r.s = this.s;
	};
	
	// (protected) r = this << n
	BI.prototype.lShiftTo = function (n,r) {
	  var bs = n%this.DB;
	  var cbs = this.DB-bs;
	  var bm = (1<<cbs)-1;
	  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	  for(i = this.t-1; i >= 0; --i) {
		r[i+ds+1] = (this[i]>>cbs)|c;
		c = (this[i]&bm)<<bs;
	  }
	  for(i = ds-1; i >= 0; --i) r[i] = 0;
	  r[ds] = c;
	  r.t = this.t+ds+1;
	  r.s = this.s;
	  r.clamp();
	};
	
	// (protected) r = this >> n
	BI.prototype.rShiftTo = function (n,r) {
	  r.s = this.s;
	  var ds = Math.floor(n/this.DB);
	  if(ds >= this.t) { r.t = 0; return; }
	  var bs = n%this.DB;
	  var cbs = this.DB-bs;
	  var bm = (1<<bs)-1;
	  r[0] = this[ds]>>bs;
	  for(var i = ds+1; i < this.t; ++i) {
		r[i-ds-1] |= (this[i]&bm)<<cbs;
		r[i-ds] = this[i]>>bs;
	  }
	  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	  r.t = this.t-ds;
	  r.clamp();
	};
	
	// (protected) r = this - a
	BI.prototype.subTo = function (a,r) {
	  var i = 0, c = 0, m = Math.min(a.t,this.t);
	  while(i < m) {
		c += this[i]-a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	  }
	  if(a.t < this.t) {
		c -= a.s;
		while(i < this.t) {
		  c += this[i];
		  r[i++] = c&this.DM;
		  c >>= this.DB;
		}
		c += this.s;
	  }
	  else {
		c += this.s;
		while(i < a.t) {
		  c -= a[i];
		  r[i++] = c&this.DM;
		  c >>= this.DB;
		}
		c -= a.s;
	  }
	  r.s = (c<0)?-1:0;
	  if(c < -1) r[i++] = this.DV+c;
	  else if(c > 0) r[i++] = c;
	  r.t = i;
	  r.clamp();
	};
	
	// (protected) r = this * a, r != this,a (HAC 14.12)
	// "this" should be the larger one if appropriate.
	BI.prototype.multiplyTo = function (a,r) {
	  var x = this.abs(), y = a.abs();
	  var i = x.t;
	  r.t = i+y.t;
	  while(--i >= 0) r[i] = 0;
	  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	  r.s = 0;
	  r.clamp();
	  if(this.s != a.s) JSBN.BigInteger.ZERO.subTo(r,r);
	};
	
	// (protected) r = this^2, r != this (HAC 14.16)
	BI.prototype.squareTo = function (r) {
	  var x = this.abs();
	  var i = r.t = 2*x.t;
	  while(--i >= 0) r[i] = 0;
	  for(i = 0; i < x.t-1; ++i) {
		var c = x.am(i,x[i],r,2*i,0,1);
		if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
		  r[i+x.t] -= x.DV;
		  r[i+x.t+1] = 1;
		}
	  }
	  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	  r.s = 0;
	  r.clamp();
	};
	
	// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	// r != q, this != m.  q or r may be null.
	BI.prototype.divRemTo = function (m,q,r) {
	  var pm = m.abs();
	  if(pm.t <= 0) return;
	  var pt = this.abs();
	  if(pt.t < pm.t) {
		if(q != null) q.fromInt(0);
		if(r != null) this.copyTo(r);
		return;
	  }
	  if(r == null) r = JSBN.nbi();
	  var y = JSBN.nbi(), ts = this.s, ms = m.s;
	  var nsh = this.DB-JSBN.nbits(pm[pm.t-1]);	// normalize modulus
	  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	  else { pm.copyTo(y); pt.copyTo(r); }
	  var ys = y.t;
	  var y0 = y[ys-1];
	  if(y0 == 0) return;
	  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	  var i = r.t, j = i-ys, t = (q==null)?JSBN.nbi():q;
	  y.dlShiftTo(j,t);
	  if(r.compareTo(t) >= 0) {
		r[r.t++] = 1;
		r.subTo(t,r);
	  }
	  JSBN.BigInteger.ONE.dlShiftTo(ys,t);
	  t.subTo(y,y);	// "negative" y so we can replace sub with am later
	  while(y.t < ys) y[y.t++] = 0;
	  while(--j >= 0) {
		// Estimate quotient digit
		var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
		if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
		  y.dlShiftTo(j,t);
		  r.subTo(t,r);
		  while(r[i] < --qd) r.subTo(t,r);
		}
	  }
	  if(q != null) {
		r.drShiftTo(ys,q);
		if(ts != ms) JSBN.BigInteger.ZERO.subTo(q,q);
	  }
	  r.t = ys;
	  r.clamp();
	  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
	  if(ts < 0) JSBN.BigInteger.ZERO.subTo(r,r);
	};
	
	// (public) this mod a
	BI.prototype.mod = function (a) {
	  var r = JSBN.nbi();
	  this.abs().divRemTo(a,null,r);
	  if(this.s < 0 && r.compareTo(JSBN.BigInteger.ZERO) > 0) a.subTo(r,r);
	  return r;
	};
	
	// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	// justification:
	//         xy == 1 (mod m)
	//         xy =  1+km
	//   xy(2-xy) = (1+km)(1-km)
	// x[y(2-xy)] = 1-k^2m^2
	// x[y(2-xy)] == 1 (mod m^2)
	// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	// JS multiply "overflows" differently from C/C++, so care is needed here.
	BI.prototype.invDigit = function () {
	  if(this.t < 1) return 0;
	  var x = this[0];
	  if((x&1) == 0) return 0;
	  var y = x&3;		// y == 1/x mod 2^2
	  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
	  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
	  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
	  // last step - calculate inverse mod DV directly;
	  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
	  // we really want the negative inverse, and -DV < y < DV
	  return (y>0)?this.DV-y:-y;
	};
	
	// (protected) true iff this is even
	BI.prototype.isEven = function () { return ((this.t>0)?(this[0]&1):this.s) == 0; };
	
	// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	BI.prototype.exp = function (e,z) {
	  if(e > 0xffffffff || e < 1) return JSBN.BigInteger.ONE;
	  var r = JSBN.nbi(), r2 = JSBN.nbi(), g = z.convert(this), i = JSBN.nbits(e)-1;
	  g.copyTo(r);
	  while(--i >= 0) {
		z.sqrTo(r,r2);
		if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
		else { var t = r; r = r2; r2 = t; }
	  }
	  return z.revert(r);
	};
	
	// (public) this^e % m, 0 <= e < 2^32
	BI.prototype.modPowInt = function (e,m) {
	  var z;
	  if(e < 256 || m.isEven()) z = new JSBN.Classic(m); else z = new JSBN.Montgomery(m);
	  return this.exp(e,z);
	};
	
	// "constants"
	BI.ZERO = JSBN.nbv(0);
	BI.ONE = JSBN.nbv(1);
	
};

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006

// Extended JavaScript BN functions, required for RSA private ops.

if (typeof JSBN != 'undefined') {

	var BI = JSBN.BigInteger;
	
	// (public)
	BI.prototype.clone = function () { var r = JSBN.nbi(); this.copyTo(r); return r; };
	
	// (public) return value as integer
	BI.prototype.intValue = function () {
	  if(this.s < 0) {
		if(this.t == 1) return this[0]-this.DV;
		else if(this.t == 0) return -1;
	  }
	  else if(this.t == 1) return this[0];
	  else if(this.t == 0) return 0;
	  // assumes 16 < DB < 32
	  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
	};
	
	// (public) return value as byte
	BI.prototype.byteValue = function () { return (this.t==0)?this.s:(this[0]<<24)>>24; };
	
	// (public) return value as short (assumes DB>=16)
	BI.prototype.shortValue = function () { return (this.t==0)?this.s:(this[0]<<16)>>16; };
	
	// (protected) return x s.t. r^x < DV
	BI.prototype.chunkSize = function (r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); };
	
	// (public) 0 if this == 0, 1 if this > 0
	BI.prototype.signum = function () {
	  if(this.s < 0) return -1;
	  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
	  else return 1;
	};
	
	// (protected) convert to radix string
	BI.prototype.toRadix = function (b) {
	  if(b == null) b = 10;
	  if(this.signum() == 0 || b < 2 || b > 36) return "0";
	  var cs = this.chunkSize(b);
	  var a = Math.pow(b,cs);
	  var d = JSBN.nbv(a), y = JSBN.nbi(), z = JSBN.nbi(), r = "";
	  this.divRemTo(d,y,z);
	  while(y.signum() > 0) {
		r = (a+z.intValue()).toString(b).substr(1) + r;
		y.divRemTo(d,y,z);
	  }
	  return z.intValue().toString(b) + r;
	};
	
	// (protected) convert from radix string
	BI.prototype.fromRadix = function (s,b) {
	  this.fromInt(0);
	  if(b == null) b = 10;
	  var cs = this.chunkSize(b);
	  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	  for(var i = 0; i < s.length; ++i) {
		var x = JSBN.intAt(s,i);
		if(x < 0) {
		  if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
		  continue;
		}
		w = b*w+x;
		if(++j >= cs) {
		  this.dMultiply(d);
		  this.dAddOffset(w,0);
		  j = 0;
		  w = 0;
		}
	  }
	  if(j > 0) {
		this.dMultiply(Math.pow(b,j));
		this.dAddOffset(w,0);
	  }
	  if(mi) JSBN.BigInteger.ZERO.subTo(this,this);
	};
	
	// (protected) alternate constructor
	BI.prototype.fromNumber = function (a,b,c) {
	  if("number" == typeof b) {
		// new JSBN.BigInteger(int,int,RNG)
		if(a < 2) this.fromInt(1);
		else {
		  this.fromNumber(a,c);
		  if(!this.testBit(a-1))	// force MSB set
			this.bitwiseTo(JSBN.BigInteger.ONE.shiftLeft(a-1),JSBN.op_or,this);
		  if(this.isEven()) this.dAddOffset(1,0); // force odd
		  while(!this.isProbablePrime(b)) {
			this.dAddOffset(2,0);
			if(this.bitLength() > a) this.subTo(JSBN.BigInteger.ONE.shiftLeft(a-1),this);
		  }
		}
	  }
	  else {
		// new JSBN.BigInteger(int,RNG)
		var x = new Array(), t = a&7;
		x.length = (a>>3)+1;
		b.nextBytes(x);
		if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
		this.fromString(x,256);
	  }
	};
	
	// (public) convert to bigendian byte array
	BI.prototype.toByteArray = function () {
	  var i = this.t, r = new Array();
	  r[0] = this.s;
	  var p = this.DB-(i*this.DB)%8, d, k = 0;
	  if(i-- > 0) {
		if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
		  r[k++] = d|(this.s<<(this.DB-p));
		while(i >= 0) {
		  if(p < 8) {
			d = (this[i]&((1<<p)-1))<<(8-p);
			d |= this[--i]>>(p+=this.DB-8);
		  }
		  else {
			d = (this[i]>>(p-=8))&0xff;
			if(p <= 0) { p += this.DB; --i; }
		  }
		  if((d&0x80) != 0) d |= -256;
		  if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
		  if(k > 0 || d != this.s) r[k++] = d;
		}
	  }
	  return r;
	};
	
	BI.prototype.equals = function (a) { return(this.compareTo(a)==0); };
	BI.prototype.min = function (a) { return(this.compareTo(a)<0)?this:a; };
	BI.prototype.max = function (a) { return(this.compareTo(a)>0)?this:a; };
	
	// (protected) r = this op a (bitwise)
	BI.prototype.bitwiseTo = function (a,op,r) {
	  var i, f, m = Math.min(a.t,this.t);
	  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	  if(a.t < this.t) {
		f = a.s&this.DM;
		for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
		r.t = this.t;
	  }
	  else {
		f = this.s&this.DM;
		for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
		r.t = a.t;
	  }
	  r.s = op(this.s,a.s);
	  r.clamp();
	};
	
	// (public) this & a
	JSBN.op_and = function (x,y) { return x&y; };
	BI.prototype.and = function (a) { var r = JSBN.nbi(); this.bitwiseTo(a,JSBN.op_and,r); return r; };
	
	// (public) this | a
	JSBN.op_or = function (x,y) { return x|y; };
	BI.prototype.or = function (a) { var r = JSBN.nbi(); this.bitwiseTo(a,JSBN.op_or,r); return r; };
	
	// (public) this ^ a
	JSBN.op_xor = function (x,y) { return x^y; };
	BI.prototype.xor = function (a) { var r = JSBN.nbi(); this.bitwiseTo(a,JSBN.op_xor,r); return r; };
	
	// (public) this & ~a
	JSBN.op_andnot = function (x,y) { return x&~y; };
	BI.prototype.andNot = function (a) { var r = JSBN.nbi(); this.bitwiseTo(a,JSBN.op_andnot,r); return r; };
	
	// (public) ~this
	BI.prototype.not = function () {
	  var r = JSBN.nbi();
	  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	  r.t = this.t;
	  r.s = ~this.s;
	  return r;
	};
	
	// (public) this << n
	BI.prototype.shiftLeft = function (n) {
	  var r = JSBN.nbi();
	  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	  return r;
	};
	
	// (public) this >> n
	BI.prototype.shiftRight = function (n) {
	  var r = JSBN.nbi();
	  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	  return r;
	};
	
	// return index of lowest 1-bit in x, x < 2^31
	JSBN.lbit = function (x) {
	  if(x == 0) return -1;
	  var r = 0;
	  if((x&0xffff) == 0) { x >>= 16; r += 16; }
	  if((x&0xff) == 0) { x >>= 8; r += 8; }
	  if((x&0xf) == 0) { x >>= 4; r += 4; }
	  if((x&3) == 0) { x >>= 2; r += 2; }
	  if((x&1) == 0) ++r;
	  return r;
	};
	
	// (public) returns index of lowest 1-bit (or -1 if none)
	BI.prototype.getLowestSetBit = function () {
	  for(var i = 0; i < this.t; ++i)
		if(this[i] != 0) return i*this.DB+JSBN.lbit(this[i]);
	  if(this.s < 0) return this.t*this.DB;
	  return -1;
	};
	
	// return number of 1 bits in x
	JSBN.cbit = function (x) {
	  var r = 0;
	  while(x != 0) { x &= x-1; ++r; }
	  return r;
	};
	
	// (public) return number of set bits
	BI.prototype.bitCount = function () {
	  var r = 0, x = this.s&this.DM;
	  for(var i = 0; i < this.t; ++i) r += JSBN.cbit(this[i]^x);
	  return r;
	};
	
	// (public) true iff nth bit is set
	BI.prototype.testBit = function (n) {
	  var j = Math.floor(n/this.DB);
	  if(j >= this.t) return(this.s!=0);
	  return((this[j]&(1<<(n%this.DB)))!=0);
	};
	
	// (protected) this op (1<<n)
	BI.prototype.changeBit = function (n,op) {
	  var r = JSBN.BigInteger.ONE.shiftLeft(n);
	  this.bitwiseTo(r,op,r);
	  return r;
	};
	
	// (public) this | (1<<n)
	BI.prototype.setBit = function (n) { return this.changeBit(n,op_or); };
	
	// (public) this & ~(1<<n)
	BI.prototype.clearBit = function (n) { return this.changeBit(n,op_andnot); };
	
	// (public) this ^ (1<<n)
	BI.prototype.flipBit = function (n) { return this.changeBit(n,op_xor); };
	
	// (protected) r = this + a
	BI.prototype.addTo = function (a,r) {
	  var i = 0, c = 0, m = Math.min(a.t,this.t);
	  while(i < m) {
		c += this[i]+a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	  }
	  if(a.t < this.t) {
		c += a.s;
		while(i < this.t) {
		  c += this[i];
		  r[i++] = c&this.DM;
		  c >>= this.DB;
		}
		c += this.s;
	  }
	  else {
		c += this.s;
		while(i < a.t) {
		  c += a[i];
		  r[i++] = c&this.DM;
		  c >>= this.DB;
		}
		c += a.s;
	  }
	  r.s = (c<0)?-1:0;
	  if(c > 0) r[i++] = c;
	  else if(c < -1) r[i++] = this.DV+c;
	  r.t = i;
	  r.clamp();
	};
	
	// (public) this + a
	BI.prototype.add = function (a) { var r = JSBN.nbi(); this.addTo(a,r); return r; };
	
	// (public) this - a
	BI.prototype.subtract = function (a) { var r = JSBN.nbi(); this.subTo(a,r); return r; };
	
	// (public) this * a
	BI.prototype.multiply = function (a) { var r = JSBN.nbi(); this.multiplyTo(a,r); return r; };
	
	// (public) this / a
	BI.prototype.divide = function (a) { var r = JSBN.nbi(); this.divRemTo(a,r,null); return r; };
	
	// (public) this % a
	BI.prototype.remainder = function (a) { var r = JSBN.nbi(); this.divRemTo(a,null,r); return r; };
	
	// (public) [this/a,this%a]
	BI.prototype.divideAndRemainder = function (a) {
	  var q = JSBN.nbi(), r = JSBN.nbi();
	  this.divRemTo(a,q,r);
	  return new Array(q,r);
	};
	
	// (protected) this *= n, this >= 0, 1 < n < DV
	BI.prototype.dMultiply = function (n) {
	  this[this.t] = this.am(0,n-1,this,0,0,this.t);
	  ++this.t;
	  this.clamp();
	};
	
	// (protected) this += n << w words, this >= 0
	BI.prototype.dAddOffset = function (n,w) {
	  while(this.t <= w) this[this.t++] = 0;
	  this[w] += n;
	  while(this[w] >= this.DV) {
		this[w] -= this.DV;
		if(++w >= this.t) this[this.t++] = 0;
		++this[w];
	  }
	};
	
	// A "null" reducer 
	JSBN.NullExp = function () {
		this.convert = function (x) { return x; };
		this.revert = function (x) { return x; };
		this.mulTo = function (x,y,r) { x.multiplyTo(y,r); };
		this.sqrTo = function (x,r) { x.squareTo(r); };
	};
	
	// (public) this^e
	BI.prototype.pow = function (e) { return this.exp(e,new JSBN.NullExp()); };
	
	// (protected) r = lower n words of "this * a", a.t <= n
	// "this" should be the larger one if appropriate.
	BI.prototype.multiplyLowerTo = function (a,n,r) {
	  var i = Math.min(this.t+a.t,n);
	  r.s = 0; // assumes a,this >= 0
	  r.t = i;
	  while(i > 0) r[--i] = 0;
	  var j;
	  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	  r.clamp();
	};
	
	// (protected) r = "this * a" without lower n words, n > 0
	// "this" should be the larger one if appropriate.
	BI.prototype.multiplyUpperTo = function (a,n,r) {
	  --n;
	  var i = r.t = this.t+a.t-n;
	  r.s = 0; // assumes a,this >= 0
	  while(--i >= 0) r[i] = 0;
	  for(i = Math.max(n-this.t,0); i < a.t; ++i)
		r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	  r.clamp();
	  r.drShiftTo(1,r);
	};
	
	// Barrett modular reduction
	JSBN.Barrett = function (m) {
	  // setup Barrett
	  this.r2 = JSBN.nbi();
	  this.q3 = JSBN.nbi();
	  JSBN.BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	  this.mu = this.r2.divide(m);
	  this.m = m;
	
		this.concert = function (x) {
		  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
		  else if(x.compareTo(this.m) < 0) return x;
		  else { var r = JSBN.nbi(); x.copyTo(r); this.reduce(r); return r; }
		};
		
		this.revert = function (x) { return x; };
		
		// x = x mod m (HAC 14.42)
		this.reduce = function (x) {
		  x.drShiftTo(this.m.t-1,this.r2);
		  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
		  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
		  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
		  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
		  x.subTo(this.r2,x);
		  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
		};
		
		// r = x^2 mod m; x != r
		this.sqrTo = function (x,r) { x.squareTo(r); this.reduce(r); };
		
		// r = x*y mod m; x,y != r
		this.mulTo = function (x,y,r) { x.multiplyTo(y,r); this.reduce(r); };
	};
	
	// (public) this^e % m (HAC 14.85)
	BI.prototype.modPow = function (e,m) {
	  var i = e.bitLength(), k, r = JSBN.nbv(1), z;
	  if(i <= 0) return r;
	  else if(i < 18) k = 1;
	  else if(i < 48) k = 3;
	  else if(i < 144) k = 4;
	  else if(i < 768) k = 5;
	  else k = 6;
	  if(i < 8)
		z = new Classic(m);
	  else if(m.isEven())
		z = new JSBN.Barrett(m);
	  else
		z = new JSBN.Montgomery(m);
	
	  // precomputation
	  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	  g[1] = z.convert(this);
	  if(k > 1) {
		var g2 = JSBN.nbi();
		z.sqrTo(g[1],g2);
		while(n <= km) {
		  g[n] = JSBN.nbi();
		  z.mulTo(g2,g[n-2],g[n]);
		  n += 2;
		}
	  }
	
	  var j = e.t-1, w, is1 = true, r2 = JSBN.nbi(), t;
	  i = JSBN.nbits(e[j])-1;
	  while(j >= 0) {
		if(i >= k1) w = (e[j]>>(i-k1))&km;
		else {
		  w = (e[j]&((1<<(i+1))-1))<<(k1-i);
		  if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
		}
	
		n = k;
		while((w&1) == 0) { w >>= 1; --n; }
		if((i -= n) < 0) { i += this.DB; --j; }
		if(is1) {	// ret == 1, don't bother squaring or multiplying it
		  g[w].copyTo(r);
		  is1 = false;
		}
		else {
		  while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
		  if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
		  z.mulTo(r2,g[w],r);
		}
	
		while(j >= 0 && (e[j]&(1<<i)) == 0) {
		  z.sqrTo(r,r2); t = r; r = r2; r2 = t;
		  if(--i < 0) { i = this.DB-1; --j; }
		}
	  }
	  return z.revert(r);
	};
	
	// (public) gcd(this,a) (HAC 14.54)
	BI.prototype.gcd = function (a) {
	  var x = (this.s<0)?this.negate():this.clone();
	  var y = (a.s<0)?a.negate():a.clone();
	  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	  if(g < 0) return x;
	  if(i < g) g = i;
	  if(g > 0) {
		x.rShiftTo(g,x);
		y.rShiftTo(g,y);
	  }
	  while(x.signum() > 0) {
		if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
		if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
		if(x.compareTo(y) >= 0) {
		  x.subTo(y,x);
		  x.rShiftTo(1,x);
		}
		else {
		  y.subTo(x,y);
		  y.rShiftTo(1,y);
		}
	  }
	  if(g > 0) y.lShiftTo(g,y);
	  return y;
	};
	
	// (protected) this % n, n < 2^26
	BI.prototype.modInt = function (n) {
	  if(n <= 0) return 0;
	  var d = this.DV%n, r = (this.s<0)?n-1:0;
	  if(this.t > 0)
		if(d == 0) r = this[0]%n;
		else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	  return r;
	};
	
	// (public) 1/this % m (HAC 14.61)
	BI.prototype.modInverse = function (m) {
	  var ac = m.isEven();
	  if((this.isEven() && ac) || m.signum() == 0) return JSBN.BigInteger.ZERO;
	  var u = m.clone(), v = this.clone();
	  var a = JSBN.nbv(1), b = JSBN.nbv(0), c = JSBN.nbv(0), d = JSBN.nbv(1);
	  while(u.signum() != 0) {
		while(u.isEven()) {
		  u.rShiftTo(1,u);
		  if(ac) {
			if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
			a.rShiftTo(1,a);
		  }
		  else if(!b.isEven()) b.subTo(m,b);
		  b.rShiftTo(1,b);
		}
		while(v.isEven()) {
		  v.rShiftTo(1,v);
		  if(ac) {
			if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
			c.rShiftTo(1,c);
		  }
		  else if(!d.isEven()) d.subTo(m,d);
		  d.rShiftTo(1,d);
		}
		if(u.compareTo(v) >= 0) {
		  u.subTo(v,u);
		  if(ac) a.subTo(c,a);
		  b.subTo(d,b);
		}
		else {
		  v.subTo(u,v);
		  if(ac) c.subTo(a,c);
		  d.subTo(b,d);
		}
	  }
	  if(v.compareTo(JSBN.BigInteger.ONE) != 0) return JSBN.BigInteger.ZERO;
	  if(d.compareTo(m) >= 0) return d.subtract(m);
	  if(d.signum() < 0) d.addTo(m,d); else return d;
	  if(d.signum() < 0) return d.add(m); else return d;
	};
	
	JSBN.lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509];
	JSBN.lplim = (1<<26)/JSBN.lowprimes[JSBN.lowprimes.length-1];
	
	// (public) test primality with certainty >= 1-.5^t
	BI.prototype.isProbablePrime = function (t) {
	  var i, x = this.abs();
	  if(x.t == 1 && x[0] <= JSBN.lowprimes[JSBN.lowprimes.length-1]) {
		for(i = 0; i < JSBN.lowprimes.length; ++i)
		  if(x[0] == JSBN.lowprimes[i]) return true;
		return false;
	  }
	  if(x.isEven()) return false;
	  i = 1;
	  while(i < JSBN.lowprimes.length) {
		var m = JSBN.lowprimes[i], j = i+1;
		while(j < JSBN.lowprimes.length && m < JSBN.lplim) m *= JSBN.lowprimes[j++];
		m = x.modInt(m);
		while(i < j) if(m%JSBN.lowprimes[i++] == 0) return false;
	  }
	  return x.millerRabin(t);
	};
	
	// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	BI.prototype.millerRabin = function (t) {
	  var n1 = this.subtract(JSBN.BigInteger.ONE);
	  var k = n1.getLowestSetBit();
	  if(k <= 0) return false;
	  var r = n1.shiftRight(k);
	  t = (t+1)>>1;
	  if(t > JSBN.lowprimes.length) t = JSBN.lowprimes.length;
	  var a = JSBN.nbi();
	  for(var i = 0; i < t; ++i) {
		a.fromInt(JSBN.lowprimes[i]);
		var y = a.modPow(r,this);
		if(y.compareTo(JSBN.BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
		  var j = 1;
		  while(j++ < k && y.compareTo(n1) != 0) {
			y = y.modPowInt(2,this);
			if(y.compareTo(JSBN.BigInteger.ONE) == 0) return false;
		  }
		  if(y.compareTo(n1) != 0) return false;
		}
	  }
	  return true;
	};
	
	// BigInteger interfaces not implemented in jsbn:
	
	// BigInteger(int signum, byte[] magnitude)
	// double doubleValue()
	// float floatValue()
	// int hashCode()
	// long longValue()
	// static BigInteger valueOf(long val)

};

// prng4.js - uses Arcfour as a PRNG
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006

if (typeof JSBN != 'undefined') {

	JSBN.PRNG4 = {
	
		Arcfour: function () {
			this.i = 0;
			this.j = 0;
			this.S = new Array();
		
		// Initialize arcfour context from key, an array of ints, each from [0..255]
			this.init = function (key) {
			  var i, j, t;
			  for(i = 0; i < 256; ++i)
				this.S[i] = i;
			  j = 0;
			  for(i = 0; i < 256; ++i) {
				j = (j + this.S[i] + key[i % key.length]) & 255;
				t = this.S[i];
				this.S[i] = this.S[j];
				this.S[j] = t;
			  }
			  this.i = 0;
			  this.j = 0;
			};
	
			this.next = function () {
			  var t;
			  this.i = (this.i + 1) & 255;
			  this.j = (this.j + this.S[this.i]) & 255;
			  t = this.S[this.i];
			  this.S[this.i] = this.S[this.j];
			  this.S[this.j] = t;
			  return this.S[(t + this.S[this.i]) & 255];
			};
		}
		,
		
		// Plug in your RNG constructor here
		prng_newstate: function () {
			return new this.Arcfour();
		}
		,
		
		// Pool size must be a multiple of 4 and greater than 32.
		// An array of bytes the size of the pool will be passed to init()
		rng_psize: 256
	
	}
};

// Random number generator - requires a PRNG backend, e.g. prng4.js
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

if (typeof JSBN != 'undefined') {

	JSBN.RNG = {
	
		rng_state: null,
		rng_pool: [],
		rng_pptr: 0,
		
		// Mix in a 32-bit integer into the pool
		rng_seed_int: function (x) {
			var RNG = JSBN.RNG;
			RNG.rng_pool[RNG.rng_pptr++] ^= x & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 8) & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 16) & 255;
			RNG.rng_pool[RNG.rng_pptr++] ^= (x >> 24) & 255;
			if(RNG.rng_pptr >= JSBN.PRNG4.rng_psize) RNG.rng_pptr -= JSBN.PRNG4.rng_psize;
		}
		,
		
		// Mix in the current time (w/milliseconds) into the pool
		rng_seed_time: function () {
		  JSBN.RNG.rng_seed_int(new Date().getTime());
		}
		,
		
		// Initialize the pool with junk if needed.
		pool_init: function () {
		  var t, RNG = JSBN.RNG;
		 if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
			// Extract entropy (256 bits) from NS4 RNG if available
			var z = window.crypto.random(32);
			for(t = 0; t < z.length; ++t)
			  RNG.rng_pool[RNG.rng_pptr++] = z.charCodeAt(t) & 255;
		  }  
		  while(RNG.rng_pptr < JSBN.PRNG4.rng_psize) {  // extract some randomness from Math.random()
			t = Math.floor(65536 * Math.random());
			RNG.rng_pool[RNG.rng_pptr++] = t >>> 8;
			RNG.rng_pool[RNG.rng_pptr++] = t & 255;
		  }
		  RNG.rng_pptr = 0;
		  RNG.rng_seed_time();
		  //RNG.rng_seed_int(window.screenX);
		  //RNG.rng_seed_int(window.screenY);
		}
		,
		
		rng_get_byte: function () {
			var RNG = JSBN.RNG;
		  if(RNG.rng_state == null) {
			RNG.rng_seed_time();
			RNG.rng_state = JSBN.PRNG4.prng_newstate();
			RNG.rng_state.init(RNG.rng_pool);
			for(RNG.rng_pptr = 0; RNG.rng_pptr < RNG.rng_pool.length; ++RNG.rng_pptr)
			  RNG.rng_pool[RNG.rng_pptr] = 0;
			RNG.rng_pptr = 0;
			//RNG.rng_pool = null;
		  }
		  // TODO: allow reseeding after first request
		  return RNG.rng_state.next();
		}
		,
		
		SecureRandom: function () {
			this.nextBytes = function (ba) {
			  var i;
			  for(i = 0; i < ba.length; ++i) ba[i] = JSBN.RNG.rng_get_byte();
			}
		}
		
	}

};

JSBN.RNG.pool_init();

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006

// Depends on jsbn.js and rng.js


if (typeof JSBN != 'undefined') {

	JSBN.RSA = {
	
	
		// convert a (hex) string to a bignum object
		parseBigInt: function (str,r) {
		  return new JSBN.BigInteger(str,r);
		}
		,
		
		
		linebrk: function (s,n) {
		  var ret = "";
		  var i = 0;
		  while(i + n < s.length) {
			ret += s.substring(i,i+n) + "\n";
			i += n;
		  }
		  return ret + s.substring(i,s.length);
		}
		,
		
		byte2Hex: function (b) {
		  if(b < 0x10)
			return "0" + b.toString(16);
		  else
			return b.toString(16);
		}
		,
		
		// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
		pkcs1pad2: function (s,n) {
		  if(n < s.length + 11) {
			alert("Message too long for RSA");
			return null;
		  }
		  var ba = new Array();
		  var i = s.length - 1;
		  while(i >= 0 && n > 0) ba[--n] = s.charCodeAt(i--);
		  ba[--n] = 0;
		  var rng = new JSBN.RNG.SecureRandom();
		  var x = new Array();
		  while(n > 2) { // random non-zero pad
			x[0] = 0;
			while(x[0] == 0) rng.nextBytes(x);
			ba[--n] = x[0];
		  }
		  ba[--n] = 2;
		  ba[--n] = 0;
		  return new JSBN.BigInteger(ba);
		}
		,
		
		// "empty" RSA key constructor
		RSAKey: function () {
		  this.n = null;
		  this.e = 0;
		  this.d = null;
		  this.p = null;
		  this.q = null;
		  this.dmp1 = null;
		  this.dmq1 = null;
		  this.coeff = null;
		  
			// Set the public key fields N and e from hex strings
		this.setPublic = function (N,E) {
			  if(N != null && E != null && N.length > 0 && E.length > 0) {
				this.n = JSBN.RSA.parseBigInt(N,16);
				this.e = parseInt(E,16);
			  }
			  else
				alert("Invalid RSA public key");
			};
			
			
			// Perform raw public operation on "x": return x^e (mod n)
			this.doPublic = function (x) {
			  return x.modPowInt(this.e, this.n);
			};
			
			
			// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
			this.encrypt = function (text) {
			  var m = JSBN.RSA.pkcs1pad2(text,(this.n.bitLength()+7)>>3);
			  if(m == null) return null;
			  var c = this.doPublic(m);
			  if(c == null) return null;
			  var h = c.toString(16);
			  if((h.length & 1) == 0) return h; else return "0" + h;
			};
			  
		  
		}
	
		
	
	}
	
	// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
	//function RSAEncryptB64(text) {
	//  var h = this.encrypt(text);
	//  if(h) return hex2b64(h); else return null;
	//}
		
	
	//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
};

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Incapsulated by Francesco Sullo (www.sullof.com), december 2006


// Depends on rsa.js and jsbn2.js


// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext

if (typeof JSBN != 'undefined') {

	JSBN.RSA.pkcs1unpad2 = function (d,n) {
	  var b = d.toByteArray();
	  var i = 0;
	  while(i < b.length && b[i] == 0) ++i;
	  if(b.length-i != n-1 || b[i] != 2)
		return null;
	  ++i;
	  while(b[i] != 0)
		if(++i >= b.length) return null;
	  var ret = "";
	  while(++i < b.length)
		ret += String.fromCharCode(b[i]);
	  return ret;
	};
	
	
	// Set the private key fields N, e, and d from hex strings
	JSBN.RSA.RSAKey.prototype.setPrivate = function (N,E,D) {
	  if(N != null && E != null && N.length > 0 && E.length > 0) {
		this.n = JSBN.RSA.parseBigInt(N,16);
		this.e = parseInt(E,16);
		this.d = JSBN.RSA.parseBigInt(D,16);
	  }
	  else
		alert("Invalid RSA private key");
	};
	
	
	// Set the private key fields N, e, d and CRT params from hex strings
	JSBN.RSA.RSAKey.prototype.setPrivateEx = function (N,E,D,P,Q,DP,DQ,C) {
	  if(N != null && E != null && N.length > 0 && E.length > 0) {
		this.n = JSBN.RSA.parseBigInt(N,16);
		this.e = parseInt(E,16);
		this.d = JSBN.RSA.parseBigInt(D,16);
		this.p = JSBN.RSA.parseBigInt(P,16);
		this.q = JSBN.RSA.parseBigInt(Q,16);
		this.dmp1 = JSBN.RSA.parseBigInt(DP,16);
		this.dmq1 = JSBN.RSA.parseBigInt(DQ,16);
		this.coeff = JSBN.RSA.parseBigInt(C,16);
	  }
	  else alert("Invalid RSA private key");
	};
	
	
	// Generate a new random private key B bits long, using public expt E
	JSBN.RSA.RSAKey.prototype.generate = function (B,E) {
	  var rng = new JSBN.RNG.SecureRandom();
	  var qs = B>>1;
	  this.e = parseInt(E,16);
	  var ee = new JSBN.BigInteger(E,16);
	  for(;;) {
		for(;;) {
		  this.p = new JSBN.BigInteger(B-qs,1,rng);
		  if(this.p.subtract(JSBN.BigInteger.ONE).gcd(ee).compareTo(JSBN.BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
		}
		for(;;) {
		  this.q = new JSBN.BigInteger(qs,1,rng);
		  if(this.q.subtract(JSBN.BigInteger.ONE).gcd(ee).compareTo(JSBN.BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
		}
		if(this.p.compareTo(this.q) <= 0) {
		  var t = this.p;
		  this.p = this.q;
		  this.q = t;
		}
		var p1 = this.p.subtract(JSBN.BigInteger.ONE);
		var q1 = this.q.subtract(JSBN.BigInteger.ONE);
		var phi = p1.multiply(q1);
		if(phi.gcd(ee).compareTo(JSBN.BigInteger.ONE) == 0) {
		  this.n = this.p.multiply(this.q);
		  this.d = ee.modInverse(phi);
		  this.dmp1 = this.d.mod(p1);
		  this.dmq1 = this.d.mod(q1);
		  this.coeff = this.q.modInverse(this.p);
		  break;
		}
	  }
	};
	
	
	// Perform raw private operation on "x": return x^d (mod n)
	JSBN.RSA.RSAKey.prototype.doPrivate = function (x) {
	  if(this.p == null || this.q == null)
		return x.modPow(this.d, this.n);
	
	  // TODO: re-calculate any missing CRT params
	  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
	  var xq = x.mod(this.q).modPow(this.dmq1, this.q);
	
	  while(xp.compareTo(xq) < 0)
		xp = xp.add(this.p);
	  return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
	};
	
	
	// Return the PKCS#1 RSA decryption of "ctext".
	// "ctext" is an even-length hex string and the output is a plain string.
	JSBN.RSA.RSAKey.prototype.decrypt = function (ctext) {
	  var c = JSBN.RSA.parseBigInt(ctext, 16);
	  var m = this.doPrivate(c);
	  if(m == null) return null;
	  return JSBN.RSA.pkcs1unpad2(m, (this.n.bitLength()+7)>>3);
	};
	
	// Return the PKCS#1 RSA decryption of "ctext".
	// "ctext" is a Base64-encoded string and the output is a plain string.
	//function RSAB64Decrypt(ctext) {
	//  var h = b64tohex(ctext);
	//  if(h) return this.decrypt(h); else return null;
	//}

};