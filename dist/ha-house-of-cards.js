// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? se;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var g = globalThis, ce = (e) => e, _ = g.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", C = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, E = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), k = y.createTreeWalker(y, 129);
function be(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [be(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, A = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xe(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ce : r[1] === "?" ? we : r[1] === "@" ? Te : N
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function j(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var Se = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new M(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ee(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, M = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = j(this, e, t), x(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = A.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Se(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new A(e)), t;
	}
	k(t) {
		S(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, N = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = j(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ce = class extends N {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, we = class extends N {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, Te = class extends N {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ee = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
};
(0, g.litHtmlPolyfillSupport)?.(A, M), (g.litHtmlVersions ??= []).push("3.3.3");
var De = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new M(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, P = globalThis, F = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = De(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return D;
	}
};
F._$litElement$ = !0, F.finalized = !0, P.litElementHydrateSupport?.({ LitElement: F }), (0, P.litElementPolyfillSupport)?.({ LitElement: F }), (P.litElementVersions ??= []).push("4.2.2");
// src/core/parts/index.ts
function Oe(e) {
	switch (e) {
		case "success": return "success";
		case "failure":
		case "error": return "failure";
		case "pending": return "pending";
		default: return "neutral";
	}
}
function I(e) {
	return E`<span class="dot dot--${Oe(e)}" aria-hidden="true"></span>`;
}
function L(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return E`<span class="trend trend--${e.direction}">${t}${n}</span>`;
}
function R(e, t, n) {
	return E`<div class="tile">
    <div class="tile__value">
      ${t}${n ? E` <span class="tile__unit">${n}</span>` : O}
    </div>
    <div class="tile__label">${e}</div>
  </div>`;
}
function ke(e) {
	return e ? E`<span class="badge">${e}</span>` : O;
}
var Ae = o`
  .dot {
    display: inline-block;
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: var(--disabled-text-color);
  }
  .dot--success {
    background: var(--success-color, var(--state-active-color));
  }
  .dot--failure {
    background: var(--error-color);
  }
  .dot--pending {
    background: var(--warning-color);
  }
  .trend {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .trend--up {
    color: var(--success-color, var(--primary-text-color));
  }
  .trend--down {
    color: var(--error-color);
  }
  .tile__value {
    font-size: 1.2em;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .tile__unit,
  .tile__label {
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .badge {
    padding: 0 0.5em;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--secondary-background-color);
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
`, je = {
	all_clear: "Alles in Ordnung",
	device_not_found: "Gerät nicht gefunden",
	no_repositories: "Keine Repositories",
	unavailable: "Nicht verfügbar",
	stars: "Sterne",
	forks: "Forks",
	issues: "Issues",
	pull_requests: "Pull Requests",
	commits_this_month: "Commits im Monat",
	release: "Release",
	ci: "CI",
	failing_ci: "CI fehlgeschlagen",
	review_requests: "Review-Anfragen",
	stale_pull_requests: "Veraltete Pull Requests",
	repository: "Repository",
	vs_last_month: "ggü. Vormonat",
	contributions: "Contributions im Monat",
	current_streak: "Aktuelle Streak",
	longest_streak: "Längste Streak",
	top_language: "Top-Sprache",
	issues_open: "Offen",
	issues_overdue: "Überfällig",
	issues_critical_open: "Kritisch",
	issues_created_7d: "Erstellt (7 Tage)",
	issues_resolved_7d: "Gelöst (7 Tage)",
	no_issues: "Keine Issues",
	entity_not_found: "Entität nicht gefunden",
	visitors: "Besucher",
	views: "Aufrufe",
	workflow: "Workflow",
	runs_today: "Läufe heute",
	downloads: "Downloads",
	days_since_commit: "Tage seit Commit",
	days_since_release: "Tage seit Release"
}, Me = {
	all_clear: "All clear",
	device_not_found: "Device not found",
	no_repositories: "No repositories",
	unavailable: "Unavailable",
	stars: "Stars",
	forks: "Forks",
	issues: "Issues",
	pull_requests: "Pull requests",
	commits_this_month: "Commits this month",
	release: "Release",
	ci: "CI",
	failing_ci: "Failing CI",
	review_requests: "Review requests",
	stale_pull_requests: "Stale pull requests",
	repository: "Repository",
	vs_last_month: "vs last month",
	contributions: "Contributions this month",
	current_streak: "Current streak",
	longest_streak: "Longest streak",
	top_language: "Top language",
	issues_open: "Open",
	issues_overdue: "Overdue",
	issues_critical_open: "Critical",
	issues_created_7d: "Created (7 days)",
	issues_resolved_7d: "Resolved (7 days)",
	no_issues: "No issues",
	entity_not_found: "Entity not found",
	visitors: "Visitors",
	views: "Views",
	workflow: "Workflow",
	runs_today: "Runs today",
	downloads: "Downloads",
	days_since_commit: "Days since commit",
	days_since_release: "Days since release"
}, Ne = {
	en: Me,
	de: je
};
function z(e, t) {
	return (Ne[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? Me)[t];
}
// src/core/base-card.ts
var B = class extends F {
	static {
		this.requiredKeys = [];
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { state: !0 }
		};
	}
	static {
		this.styles = [Ae, o`
      ha-card {
        padding: 12px 16px;
      }
      .message {
        color: var(--secondary-text-color);
      }
      .message--error {
        color: var(--error-color);
      }
    `];
	}
	setConfig(e) {
		let t = this.constructor.requiredKeys.filter((t) => e[t] === void 0);
		if (t.length > 0) throw Error(`Missing required option: ${t.join(", ")}`);
		this.config = e;
	}
	getCardSize() {
		return 3;
	}
	getGridOptions() {
		return {
			columns: 6,
			rows: "auto",
			min_columns: 3
		};
	}
	renderMessage(e, t = !1) {
		let n = this.hass ? z(this.hass, e) : e;
		return E`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? O : this.renderContent();
	}
}, Pe = "contributions_this_month";
function V(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || i.platform !== n || !i.translation_key) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key] = a);
	}
	return r;
}
function Fe(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of Object.values(e.entities)) r.platform === t && r.device_id && n.add(r.device_id);
	return [...n].map((t) => {
		let n = e.devices[t];
		return {
			id: t,
			name: n?.name_by_user ?? n?.name ?? t
		};
	}).sort((e, t) => e.name.localeCompare(t.name));
}
function H(e, t, n = Pe) {
	return Object.values(e.entities).find((e) => e.platform === t && e.translation_key === n && e.device_id)?.device_id ?? void 0;
}
// src/core/editor.ts
function U(e, t = "device") {
	return {
		name: t,
		selector: { device: { integration: e } }
	};
}
function Ie(e, t = "layout") {
	return {
		name: t,
		selector: { select: {
			mode: "dropdown",
			options: e
		} }
	};
}
var W = class extends F {
	constructor(...e) {
		super(...e), this.computeLabel = (e) => e.name.replace(/_/g, " ");
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { state: !0 }
		};
	}
	setConfig(e) {
		this.config = e;
	}
	valueChanged(e) {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: {
				...this.config,
				...e.detail.value
			} },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return !this.hass || !this.config ? O : E`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${this.schema()}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
	}
}, Le = class extends W {
	schema() {
		return [{
			...U("github_pulse"),
			required: !0
		}, Ie([
			"compact",
			"standard",
			"detailed"
		])];
	}
}, Re = 1;
function G(e) {
	return e === null || !Number.isFinite(e) ? {
		direction: "flat",
		percent: null
	} : Math.abs(e) <= Re ? {
		direction: "flat",
		percent: e
	} : {
		direction: e > 0 ? "up" : "down",
		percent: e
	};
}
function K(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function q(e) {
	let t = K(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
// src/cards/github-pulse/repo/fields.ts
var ze = {
	stars: {
		label: "stars",
		kind: "count"
	},
	forks: {
		label: "forks",
		kind: "count"
	},
	open_issues: {
		label: "issues",
		kind: "count"
	},
	open_pull_requests: {
		label: "pull_requests",
		kind: "count"
	},
	commits_this_month: {
		label: "commits_this_month",
		kind: "count"
	},
	commits_vs_last_month: {
		label: "vs_last_month",
		kind: "text"
	},
	ci_state: {
		label: "ci",
		kind: "text"
	},
	latest_release: {
		label: "release",
		kind: "text"
	},
	days_since_last_commit: {
		label: "days_since_commit",
		kind: "days"
	},
	unique_visitors_14d: {
		label: "visitors",
		kind: "count"
	},
	views_14d: {
		label: "views",
		kind: "count"
	},
	actions_last_result: {
		label: "workflow",
		kind: "text"
	},
	actions_runs_today: {
		label: "runs_today",
		kind: "count"
	},
	total_downloads: {
		label: "downloads",
		kind: "count"
	},
	days_since_last_release: {
		label: "days_since_release",
		kind: "days"
	}
}, Be = ["stars"], Ve = [
	...Be,
	"forks",
	"open_issues",
	"open_pull_requests",
	"commits_this_month"
], He = {
	compact: Be,
	standard: Ve,
	detailed: [
		...Ve,
		"unique_visitors_14d",
		"views_14d",
		"actions_last_result",
		"actions_runs_today",
		"total_downloads",
		"days_since_last_commit",
		"days_since_last_release"
	]
};
function Ue(e, t) {
	let n = e[t]?.state;
	if (n === void 0) return;
	let { label: r, kind: i } = ze[t], a = {
		key: t,
		label: r,
		value: n
	};
	if (i === "count" && (a.value = q(n)), i === "days" && (a.value = q(n), a.unit = "d"), t === "commits_this_month") {
		let t = e.commits_vs_last_month?.state;
		t !== void 0 && (a.trend = G(K(t)));
	}
	return a;
}
function We(e, t) {
	return He[t].flatMap((t) => {
		let n = Ue(e, t);
		return n ? [n] : [];
	});
}
// src/cards/github-pulse/repo/card.ts
var J = "github_pulse", Y = "hoc-github-repo-card", Ge = {
	tag: Y,
	ctor: class extends B {
		static {
			this.requiredKeys = ["device"];
		}
		static {
			this.styles = [...B.styles, o`
      .header {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .name {
        flex: 1;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
    `];
		}
		static getConfigElement() {
			return document.createElement(`${Y}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return E``;
			let n = e.devices[t.device];
			if (!n) return this.renderMessage("device_not_found", !0);
			let r = t.layout ?? "standard", i = V(e, t.device, J), a = We(i, r), o = i.ci_state, s = i.latest_release?.state, c = n.name_by_user ?? n.name ?? t.device;
			if (r === "compact") {
				let e = a.find((e) => e.key === "stars");
				return E`<ha-card>
        <div class="header">
          ${o ? I(o.state) : O}
          <span class="name">${c}</span>
          ${e ? E`<span>★ ${e.value}</span>` : O} ${ke(s)}
        </div>
      </ha-card>`;
			}
			return E`<ha-card>
      <div class="header">
        ${o ? I(o.state) : O}
        <span class="name">${c}</span>
        ${ke(s)}
      </div>
      <div class="grid">
        ${a.map((t) => E`<div>
              ${R(z(e, t.label), t.value, t.unit)}
              ${t.trend ? L(t.trend) : O}
            </div>`)}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${Y}-editor`,
	editorCtor: Le,
	name: "GitHub repository",
	description: "One GitHub Pulse repository: CI state, stars, pull requests, commits and more."
}, Ke = class extends W {
	schema() {
		return [{
			name: "entity",
			required: !0,
			selector: { entity: {
				integration: "youtrack",
				domain: "sensor"
			} }
		}, {
			name: "max_items",
			selector: { number: {
				min: 1,
				max: 20,
				mode: "box"
			} }
		}];
	}
}, X = "hoc-youtrack-issues-card", qe = 5;
function Je(e) {
	let t = e.issues;
	return Array.isArray(t) ? t.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let t = e;
		if (typeof t.id != "string") return [];
		let n = typeof t.url == "string" ? t.url : void 0;
		return [{
			id: t.id,
			summary: typeof t.summary == "string" ? t.summary : "",
			state: typeof t.state == "string" ? t.state : "",
			url: n && /^https?:\/\//i.test(n) ? n : void 0
		}];
	}) : [];
}
var Ye = {
	tag: X,
	ctor: class extends B {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.styles = [...B.styles, o`
      .issue {
        display: flex;
        gap: 8px;
        padding: 4px 0;
        color: var(--primary-text-color);
      }
      .issue__id {
        flex: none;
        color: var(--secondary-text-color);
      }
      .issue__summary {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    `];
		}
		static getConfigElement() {
			return document.createElement(`${X}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return E``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			let r = Je(n.attributes).slice(0, t.max_items ?? qe);
			return r.length === 0 ? this.renderMessage("no_issues") : E`<ha-card>
      ${r.map((e) => E`<div class="issue">
            ${e.url ? E`<a
                    class="issue__id"
                    href=${e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${e.id}</a
                  >` : E`<span class="issue__id">${e.id}</span>`}
            <span class="issue__summary">${e.summary}</span>
            <span>${e.state}</span>
          </div>`)}
    </ha-card>`;
		}
	},
	editorTag: `${X}-editor`,
	editorCtor: Ke,
	name: "YouTrack issues",
	description: "The first issues of a YouTrack query sensor."
}, Xe = class extends W {
	schema() {
		return [{
			...U("youtrack"),
			required: !0
		}];
	}
}, Ze = "youtrack", Z = "hoc-youtrack-project-card", Qe = [
	"issues_open",
	"issues_overdue",
	"issues_critical_open",
	"issues_created_7d",
	"issues_resolved_7d"
], $e = {
	tag: Z,
	ctor: class extends B {
		static {
			this.requiredKeys = ["device"];
		}
		static {
			this.styles = [...B.styles, o`
      .alert {
        border-left: 4px solid var(--error-color);
      }
      .title {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
    `];
		}
		static getConfigElement() {
			return document.createElement(`${Z}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return E``;
			let n = e.devices[t.device];
			if (!n) return this.renderMessage("device_not_found", !0);
			let r = V(e, t.device, Ze);
			return E`<ha-card class=${r.has_overdue?.state === "on" || r.has_critical_open?.state === "on" ? "alert" : ""}>
      <div class="title">${n.name_by_user ?? n.name ?? t.device}</div>
      <div class="grid">
        ${Qe.map((t) => {
				let n = r[t]?.state;
				return n === void 0 ? O : R(z(e, t), q(n));
			})}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${Z}-editor`,
	editorCtor: Xe,
	name: "YouTrack project",
	description: "Issue counts of one YouTrack project, with an accent for overdue or critical issues."
}, et = class extends W {
	schema() {
		return [{
			name: "repositories",
			selector: { device: {
				integration: "github_pulse",
				multiple: !0
			} }
		}, {
			name: "show_when_clean",
			selector: { boolean: {} }
		}];
	}
}, Q = "hoc-github-attention-card", tt = /* @__PURE__ */ new Set(["failure", "error"]);
function nt(e, t) {
	let n = t.device ?? H(e, "github_pulse"), r = t.repositories === void 0 || t.repositories === "all" || t.repositories.length === 0 ? null : new Set(t.repositories), i = Fe(e, J).filter((e) => e.id !== n && (r === null || r.has(e.id))).filter((t) => {
		let n = V(e, t.id, J).ci_state?.state;
		return n !== void 0 && tt.has(n);
	}).map((e) => e.name), a = n ? V(e, n, J) : {};
	return {
		failingRepos: i,
		reviewRequests: K(a.review_requests?.state) ?? 0,
		stalePullRequests: K(a.stale_pull_requests?.state) ?? 0
	};
}
var rt = {
	tag: Q,
	ctor: class extends B {
		static {
			this.styles = [...B.styles, o`
      .item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0;
        color: var(--primary-text-color);
      }
      .item__label {
        color: var(--secondary-text-color);
      }
    `];
		}
		static getConfigElement() {
			return document.createElement(`${Q}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return O;
			let n = nt(e, t);
			return n.failingRepos.length === 0 && n.reviewRequests === 0 && n.stalePullRequests === 0 ? t.show_when_clean === !1 ? O : this.renderMessage("all_clear") : E`<ha-card>
      ${n.failingRepos.length > 0 ? E`<div class="item">
              ${I("failure")}
              <span class="item__label">${z(e, "failing_ci")}</span>
              <span>${n.failingRepos.join(", ")}</span>
            </div>` : O}
      ${n.reviewRequests > 0 ? E`<div class="item">
              <span class="item__label">${z(e, "review_requests")}</span>
              <span>${n.reviewRequests}</span>
            </div>` : O}
      ${n.stalePullRequests > 0 ? E`<div class="item">
              <span class="item__label">${z(e, "stale_pull_requests")}</span>
              <span>${n.stalePullRequests}</span>
            </div>` : O}
    </ha-card>`;
		}
	},
	editorTag: `${Q}-editor`,
	editorCtor: et,
	name: "GitHub attention",
	description: "Only what needs attention: failing CI, review requests, stale pull requests."
}, it = class extends W {
	schema() {
		return [U("github_pulse")];
	}
}, $ = "hoc-github-profile-card", at = [
	{
		key: "current_streak",
		label: "current_streak",
		format: q,
		unit: "d"
	},
	{
		key: "longest_streak",
		label: "longest_streak",
		format: q,
		unit: "d"
	},
	{
		key: "top_language",
		label: "top_language",
		format: (e) => e
	}
], ot = {
	tag: $,
	ctor: class extends B {
		static {
			this.styles = [...B.styles, o`
      .title {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .headline {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin: 8px 0 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 12px;
      }
    `];
		}
		static getConfigElement() {
			return document.createElement(`${$}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return E``;
			let n = t.device ?? H(e, "github_pulse"), r = n ? e.devices[n] : void 0;
			if (!n || !r) return this.renderMessage("device_not_found", !0);
			let i = V(e, n, J), a = i.contributions_this_month?.state, o = i.commits_vs_last_month?.state;
			return E`<ha-card>
      <div class="title">${r.name_by_user ?? r.name ?? n}</div>
      <div class="headline">
        ${a === void 0 ? O : R(z(e, "contributions"), q(a))}
        ${o === void 0 ? O : L(G(K(o)))}
      </div>
      <div class="grid">
        ${at.map((t) => {
				let n = i[t.key]?.state;
				return n === void 0 ? O : R(z(e, t.label), t.format(n), t.unit);
			})}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${$}-editor`,
	editorCtor: it,
	name: "GitHub profile",
	description: "Your GitHub activity: contributions, trend, streaks and top language."
}, st = class extends W {
	schema() {
		return [
			{
				name: "repositories",
				selector: { device: {
					integration: "github_pulse",
					multiple: !0
				} }
			},
			{
				name: "columns",
				selector: { select: {
					multiple: !0,
					mode: "list",
					options: [...lt]
				} }
			},
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					options: ["name", ...lt]
				} }
			},
			{
				name: "sort_order",
				selector: { select: {
					mode: "dropdown",
					options: ["asc", "desc"]
				} }
			},
			{
				name: "max_height",
				selector: { number: {
					min: 100,
					max: 2e3,
					mode: "box"
				} }
			}
		];
	}
}, ct = "hoc-github-repos-card", lt = [
	"stars",
	"forks",
	"open_issues",
	"open_pull_requests",
	"commits_this_month",
	"commits_vs_last_month",
	"ci_state",
	"latest_release",
	"days_since_last_commit"
], ut = [
	"ci_state",
	"stars",
	"commits_this_month",
	"latest_release"
], dt = /* @__PURE__ */ new Set([
	"unavailable",
	"unknown",
	""
]), ft = /* @__PURE__ */ new Set(["ci_state", "latest_release"]);
function pt(e, t) {
	if (t === "name") return e.name;
	let n = e.entities[t]?.state;
	return n === void 0 || dt.has(n) ? null : ft.has(t) ? n : K(n);
}
function mt(e, t, n, r) {
	let i = pt(e, n), a = pt(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o = typeof i == "number" && typeof a == "number" ? i - a : String(i).localeCompare(String(a));
	return o === 0 ? e.name.localeCompare(t.name) : o * r;
}
var ht = class extends B {
	static {
		this.requiredKeys = ["repositories"];
	}
	static {
		this.styles = [...B.styles, o`
      .scroll {
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        text-align: left;
        font-weight: 400;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      th,
      td {
        padding: 6px 8px 6px 0;
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
    `];
	}
	static getConfigElement() {
		return document.createElement(`${ct}-editor`);
	}
	rows() {
		let { hass: e, config: t } = this;
		if (!e || !t) return [];
		let n = H(e, J), r = Fe(e, J).filter((e) => e.id !== n), i = t.repositories === "all" || t.repositories.length === 0 ? null : new Set(t.repositories);
		return r.filter((e) => i === null || i.has(e.id)).map((t) => ({
			id: t.id,
			name: t.name,
			entities: V(e, t.id, J)
		}));
	}
	renderCell(e, t) {
		let n = e.entities[t]?.state;
		return n === void 0 || dt.has(n) ? E`<td>—</td>` : t === "ci_state" ? E`<td>${I(n)}</td>` : t === "commits_vs_last_month" ? E`<td>${L(G(K(n)))}</td>` : E`<td>${Ue(e.entities, t)?.value ?? "—"}</td>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return E``;
		let n = t.columns ?? ut, r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows().sort((e, t) => mt(e, t, r, i));
		return a.length === 0 ? this.renderMessage("no_repositories") : E`<ha-card>
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${z(e, "repository")}</th>
              ${n.map((t) => E`<th>${z(e, gt(t))}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${a.map((e) => E`<tr>
                  <td class="name">${e.name}</td>
                  ${n.map((t) => this.renderCell(e, t))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
	}
};
function gt(e) {
	return {
		stars: "stars",
		forks: "forks",
		open_issues: "issues",
		open_pull_requests: "pull_requests",
		commits_this_month: "commits_this_month",
		commits_vs_last_month: "vs_last_month",
		ci_state: "ci",
		latest_release: "release",
		days_since_last_commit: "days_since_commit"
	}[e];
}
// src/registry.ts
var _t = [
	Ge,
	{
		tag: ct,
		ctor: ht,
		editorTag: `${ct}-editor`,
		editorCtor: st,
		name: "GitHub repositories",
		description: "Several GitHub Pulse repositories as a sortable table."
	},
	ot,
	rt,
	$e,
	Ye
];
function vt(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function yt(e = _t) {
	window.customCards ??= [];
	for (let t of e) vt(t.tag, t.ctor), t.editorTag && t.editorCtor && vt(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !1
	});
}
// src/index.ts
yt();
export { yt as registerCards };
