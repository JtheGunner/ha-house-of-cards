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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: ee, getPrototypeOf: p } = Object, m = globalThis, h = m.trustedTypes, te = h ? h.emptyScript : "", ne = m.reactiveElementPolyfillSupport, g = (e, t) => e, re = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
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
}, ie = (e, t) => !l(e, t), ae = {
	attribute: !0,
	type: String,
	converter: re,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ae) {
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
		return this.elementProperties.get(e) ?? ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = p(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...ee(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? re : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? re : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[g("elementProperties")] = /* @__PURE__ */ new Map(), _[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: _ }), (m.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var v = globalThis, oe = (e) => e, y = v.trustedTypes, se = y ? y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, S = () => x.createComment(""), C = (e) => e === null || typeof e != "object" && typeof e != "function", w = Array.isArray, de = (e) => w(e) || typeof e?.[Symbol.iterator] == "function", T = "[ 	\n\f\r]", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, pe = />/g, D = RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, he = /"/g, ge = /^(?:script|style|textarea|title)$/i, O = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), k = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), _e = /* @__PURE__ */ new WeakMap(), j = x.createTreeWalker(x, 129);
function ve(e, t) {
	if (!w(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var ye = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === E ? c[1] === "!--" ? o = fe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = D) : (ge.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = D) : o = pe : o === D ? c[0] === ">" ? (o = i ?? E, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? D : c[3] === "\"" ? he : me) : o === he || o === me ? o = D : o === fe || o === pe ? o = E : (o = D, i = void 0);
		let d = o === D && e[t + 1].startsWith("/>") ? " " : "";
		a += o === E ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [ve(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, M = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ye(t, n);
		if (this.el = e.createElement(l, r), j.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = j.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? xe : r[1] === "?" ? Se : r[1] === "@" ? Ce : F
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ge.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = y ? y.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], S()), j.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], S());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function N(e, t, n = e, r) {
	if (t === k) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = C(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = N(e, i._$AS(e, t.values), i, r)), t;
}
var be = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		j.currentNode = r;
		let i = j.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new P(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new we(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = j.nextNode(), a++);
		}
		return j.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, P = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = N(this, e, t), C(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== k && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== A && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = M.createElement(ve(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new be(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = _e.get(e.strings);
		return t === void 0 && _e.set(e.strings, t = new M(e)), t;
	}
	k(t) {
		w(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(S()), this.O(S()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = oe(e).nextSibling;
			oe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, F = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = A;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = N(this, e, t, 0), a = !C(e) || e !== this._$AH && e !== k, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = N(this, r[n + o], t, o), s === k && (s = this._$AH[o]), a ||= !C(s) || s !== this._$AH[o], s === A ? e = A : e !== A && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, xe = class extends F {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === A ? void 0 : e;
	}
}, Se = class extends F {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== A);
	}
}, Ce = class extends F {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = N(this, e, t, 0) ?? A) === k) return;
		let n = this._$AH, r = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== A && (n === A || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, we = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		N(this, e);
	}
};
(0, v.litHtmlPolyfillSupport)?.(M, P), (v.litHtmlVersions ??= []).push("3.3.3");
var Te = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new P(t.insertBefore(S(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, I = globalThis, L = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Te(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return k;
	}
};
L._$litElement$ = !0, L.finalized = !0, I.litElementHydrateSupport?.({ LitElement: L }), (0, I.litElementPolyfillSupport)?.({ LitElement: L }), (I.litElementVersions ??= []).push("4.2.2");
// src/core/parts/index.ts
function Ee(e) {
	switch (e) {
		case "success": return "success";
		case "failure":
		case "error": return "failure";
		case "pending": return "pending";
		default: return "neutral";
	}
}
function R(e) {
	return O`<span class="dot dot--${Ee(e)}" aria-hidden="true"></span>`;
}
function De(e) {
	return e ? O`<span class="dot" style="background: ${e}" aria-hidden="true"></span>` : O`<span class="dot dot--neutral" aria-hidden="true"></span>`;
}
function Oe(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return O`<span class="trend trend--${e.direction}">${t}${n}</span>`;
}
var ke = o`
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
`, Ae = {
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
	days_since_release: "Tage seit Release",
	editor_device: "Gerät",
	editor_layout: "Layout",
	editor_fields: "Felder",
	editor_columns: "Spalten",
	editor_name: "Name",
	editor_show_status: "Status anzeigen",
	editor_repositories: "Repositories",
	editor_sort_by: "Sortieren nach",
	editor_sort_order: "Reihenfolge",
	editor_max_height: "Maximale Höhe",
	editor_max_items: "Maximale Anzahl",
	editor_show_when_clean: "Auch ohne Meldungen anzeigen",
	editor_entity: "Entität",
	editor_sensor: "Sensor",
	editor_icon: "Icon",
	editor_color: "Farbe",
	layout_compact: "Kompakt",
	layout_standard: "Standard",
	layout_list: "Liste",
	order_asc: "Aufsteigend",
	order_desc: "Absteigend",
	editor_hide_owner: "Besitzer ausblenden",
	titles_text: "Text",
	titles_icon: "Icon",
	titles_icon_text: "Icon und Text",
	editor_column_titles: "Spaltentitel",
	editor_show_activity: "Aktivitätspunkt anzeigen",
	align_left: "Links",
	align_center: "Zentriert",
	align_right: "Rechts",
	editor_align: "Ausrichtung",
	editor_title_color: "Titelfarbe",
	editor_link: "Name verlinken mit",
	editor_link_url: "Link-URL",
	editor_badge: "Badge im Titel",
	link_none: "Kein Link",
	link_device: "Geräteseite",
	editor_status: "Status-Regeln",
	editor_field: "Sensor",
	editor_operator: "Bedingung",
	editor_value: "Wert",
	editor_state: "Status",
	state_success: "In Ordnung",
	state_pending: "Warnung",
	state_failure: "Fehler",
	state_none: "Kein Status"
}, z = {
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
	days_since_release: "Days since release",
	editor_device: "Device",
	editor_layout: "Layout",
	editor_fields: "Fields",
	editor_columns: "Columns",
	editor_name: "Name",
	editor_show_status: "Show status",
	editor_repositories: "Repositories",
	editor_sort_by: "Sort by",
	editor_sort_order: "Sort order",
	editor_max_height: "Maximum height",
	editor_max_items: "Maximum items",
	editor_show_when_clean: "Show when all clear",
	editor_entity: "Entity",
	editor_sensor: "Sensor",
	editor_icon: "Icon",
	editor_color: "Color",
	layout_compact: "Compact",
	layout_standard: "Standard",
	layout_list: "List",
	order_asc: "Ascending",
	order_desc: "Descending",
	editor_hide_owner: "Hide owner",
	titles_text: "Text",
	titles_icon: "Icon",
	titles_icon_text: "Icon and text",
	editor_column_titles: "Column titles",
	editor_show_activity: "Show activity dot",
	align_left: "Left",
	align_center: "Centre",
	align_right: "Right",
	editor_align: "Alignment",
	editor_title_color: "Title colour",
	editor_link: "Link name to",
	editor_link_url: "Link URL",
	editor_badge: "Badge in title",
	link_none: "No link",
	link_device: "Device page",
	editor_status: "Status rules",
	editor_field: "Sensor",
	editor_operator: "Condition",
	editor_value: "Value",
	editor_state: "Status",
	state_success: "OK",
	state_pending: "Warning",
	state_failure: "Error",
	state_none: "No status"
}, je = {
	en: z,
	de: Ae
};
function B(e, t) {
	let n = `editor_${t}`, r = (je[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? z)[n] ?? z[n];
	if (r) return r;
	let i = t.replace(/_/g, " ");
	return i.charAt(0).toUpperCase() + i.slice(1);
}
function V(e, t) {
	return (je[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? z)[t];
}
// src/core/base-card.ts
var H = class extends L {
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
		this.styles = [ke, o`
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
		let n = this.hass ? V(this.hass, e) : e;
		return O`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? A : this.renderContent();
	}
}, Me = 1;
function Ne(e) {
	return e === null || !Number.isFinite(e) ? {
		direction: "flat",
		percent: null
	} : Math.abs(e) <= Me ? {
		direction: "flat",
		percent: e
	} : {
		direction: e > 0 ? "up" : "down",
		percent: e
	};
}
var Pe = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function Fe(e) {
	return e === void 0 || Pe.has(e);
}
function U(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Ie(e) {
	let t = U(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
function W(e) {
	if (typeof e != "string" || !e.startsWith("https://")) return !1;
	try {
		return new URL(e).protocol === "https:";
	} catch {
		return !1;
	}
}
// src/core/fields.ts
var Le = {
	stars: "stars",
	forks: "forks",
	open_issues: "issues",
	open_pull_requests: "pull_requests",
	commits_this_month: "commits_this_month",
	commits_vs_last_month: "vs_last_month",
	ci_state: "ci",
	latest_release: "release",
	days_since_last_commit: "days_since_commit",
	days_since_last_release: "days_since_release",
	unique_visitors_14d: "visitors",
	views_14d: "views",
	actions_last_result: "workflow",
	actions_runs_today: "runs_today",
	total_downloads: "downloads",
	contributions_this_month: "contributions",
	current_streak: "current_streak",
	longest_streak: "longest_streak",
	top_language: "top_language",
	issues_open: "issues_open",
	issues_overdue: "issues_overdue",
	issues_critical_open: "issues_critical_open",
	issues_created_7d: "issues_created_7d",
	issues_resolved_7d: "issues_resolved_7d"
}, Re = [
	"blue",
	"purple",
	"teal",
	"orange",
	"pink",
	"green",
	"indigo",
	"amber"
], G = {
	success: "var(--success-color, var(--green-color))",
	failure: "var(--error-color, var(--red-color))",
	pending: "var(--warning-color, var(--amber-color))"
}, ze = /* @__PURE__ */ new Set([
	"friendly_name",
	"unit_of_measurement",
	"device_class",
	"icon",
	"state_class",
	"entity_picture",
	"supported_features",
	"attribution",
	"options",
	"restored",
	"editable"
]);
function K(e) {
	if (typeof e != "string") {
		if (e.attribute === void 0 && e.key.includes(":")) {
			let [t = "", ...n] = e.key.split(":");
			return {
				...e,
				key: t,
				attribute: n.join(":")
			};
		}
		return e;
	}
	let [t = "", ...n] = e.split(":");
	return n.length > 0 ? {
		key: t,
		attribute: n.join(":")
	} : { key: t };
}
function q(e) {
	return e.attribute ? `${e.key}:${e.attribute}` : e.key;
}
function J(e) {
	let t = e.replace(/_/g, " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}
function Be(e) {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t;
}
function Ve(e) {
	return `var(--${e}-color)`;
}
function Y(e) {
	return /^[a-z-]+$/.test(e) ? Ve(e) : e;
}
function He(e, t) {
	return e.color ? /^[a-z-]+$/.test(e.color) ? Ve(e.color) : e.color : t ? G[t] : Ve(Re[Be(e.key) % Re.length] ?? "blue");
}
function Ue(e, t, n, r) {
	let i = Le[t];
	if (i) return V(e, i);
	let a = n.attributes.friendly_name;
	return typeof a == "string" && a.trim() !== "" && (r && a.startsWith(`${r} `) ? a.slice(r.length + 1) : a).trim() || J(t);
}
function We(e, t) {
	if (t === "success") return "success";
	if (t === "failure" || t === "error") return "failure";
	if (t === "pending" || t === "queued") return "pending";
	if (e.startsWith("has_") && t === "on") return "failure";
	let n = U(t);
	if (n !== null) {
		if (/(overdue|critical|failing|stale)/.test(e)) return n > 0 ? "failure" : void 0;
		if (/(_vs_|trend)/.test(e)) {
			if (n > 1) return "success";
			if (n < -1) return "failure";
		}
	}
}
function Ge(e) {
	if (typeof e == "number") return Math.abs(e) >= 1e3 ? Ie(String(e)) : String(e);
	if (typeof e == "string") return e.trim() === "" ? void 0 : e;
	if (typeof e == "boolean") return e ? "✓" : "–";
	if (Array.isArray(e)) return String(e.length);
}
function Ke(e, t) {
	let n = t.attributes.unit_of_measurement, r = typeof n == "string" && n !== "" ? n : void 0, i = U(t.state);
	return i === null ? { value: e.formatEntityState?.(t) ?? t.state } : r ? {
		value: String(i),
		unit: r
	} : { value: Math.abs(i) >= 1e3 ? Ie(t.state) : String(i) };
}
function X(e, t, n, r) {
	return n.flatMap((n) => {
		let i = t[n.key];
		if (!i || Fe(i.state)) return [];
		let a, o;
		if (n.attribute) {
			let e = i.attributes[n.attribute], t = Ge(e);
			if (t === void 0) return [];
			a = { value: t }, o = typeof e == "number" ? e : t;
		} else a = Ke(e, i), o = U(i.state) ?? i.state;
		let s = n.attribute ? void 0 : We(n.key, i.state), c = n.name ?? (n.attribute ? `${Ue(e, n.key, i, r)} › ${J(n.attribute)}` : Ue(e, n.key, i, r)), l = n.trend ? t[n.trend]?.state : void 0, u = {
			id: q(n),
			label: c,
			...a,
			raw: o,
			color: He(n, s),
			stateObj: i
		};
		return n.icon && (u.icon = n.icon), n.attribute && (u.attribute = n.attribute), s && (u.tone = s), l !== void 0 && (u.trend = Ne(U(l))), [u];
	});
}
function qe(e) {
	for (let t of [
		"failure",
		"pending",
		"success"
	]) if (e.some((e) => e.tone === t)) return G[t];
}
function Je(e, t) {
	let n = e.devices[t]?.name ?? void 0, r = [], i = /* @__PURE__ */ new Set();
	for (let a of Object.values(e.entities)) {
		if (a.device_id !== t) continue;
		let o = e.states[a.entity_id];
		if (!o) continue;
		let s = a.translation_key || a.entity_id;
		if (i.has(s)) continue;
		i.add(s);
		let c = Ue(e, s, o, n);
		r.push({
			value: s,
			label: c
		});
		for (let [e, t] of Object.entries(o.attributes)) ze.has(e) || Ge(t) === void 0 || Array.isArray(t) || r.push({
			value: `${s}:${e}`,
			label: `${c} › ${J(e)}`
		});
	}
	return r.sort((e, t) => {
		let n = e.value.split(":")[0] ?? "", r = t.value.split(":")[0] ?? "";
		return n === r ? e.value.localeCompare(t.value) : n.localeCompare(r);
	});
}
// src/core/status.ts
var Ye = [
	"=",
	"!=",
	">",
	">=",
	"<",
	"<=",
	"contains"
], Xe = [
	"success",
	"pending",
	"failure",
	"none"
], Ze = /* @__PURE__ */ new Set([
	"success",
	"pending",
	"failure"
]);
function Qe(e) {
	let t = e.trim();
	if (t === "" || t.toLowerCase() === "none" || /[;{}"<>]/.test(t)) return {};
	let n = t.toLowerCase();
	if (Ze.has(n)) {
		let e = n;
		return {
			tone: e,
			color: G[e]
		};
	}
	return { color: Y(t) };
}
function $e(e, t) {
	let n = K(t), r = e[n.key];
	if (r && !Fe(r.state)) return n.attribute ? r.attributes[n.attribute] : r.state;
}
function et(e, t, n) {
	if (e == null) return !1;
	let r = String(e).toLowerCase(), i = String(n ?? "").toLowerCase();
	if (t === "contains") return r.includes(i);
	let a = U(String(e)), o = U(String(n));
	if (a !== null && o !== null) switch (t) {
		case "=": return a === o;
		case "!=": return a !== o;
		case ">": return a > o;
		case ">=": return a >= o;
		case "<": return a < o;
		case "<=": return a <= o;
	}
	return t === "=" ? r === i : t === "!=" && r !== i;
}
function tt(e, t) {
	for (let n of e) if (et($e(t, n.field), n.operator ?? "=", n.value)) return Qe(n.state);
	return {};
}
// src/core/editor.ts
function nt(e, t, n, r) {
	return {
		name: r,
		selector: { select: {
			mode: "dropdown",
			options: n.map((n) => ({
				value: n,
				label: e ? V(e, `${t}_${n}`) : n
			}))
		} }
	};
}
function rt(e, t, n = "layout") {
	return nt(e, "layout", t, n);
}
function it(e, t, n = "fields", r = !1) {
	let i = (t) => e ? B(e, t) : t, a = [
		"left",
		"center",
		"right"
	].map((t) => ({
		value: t,
		label: e ? V(e, `align_${t}`) : t
	}));
	return {
		name: n,
		selector: { object: {
			multiple: !0,
			label_field: "key",
			fields: {
				key: {
					label: i("sensor"),
					required: !0,
					selector: { select: {
						mode: "dropdown",
						custom_value: !0,
						options: t
					} }
				},
				name: {
					label: i("name"),
					selector: { text: {} }
				},
				icon: {
					label: i("icon"),
					selector: { icon: {} }
				},
				color: {
					label: i("color"),
					selector: { ui_color: {} }
				},
				...r ? {
					title_color: {
						label: i("title_color"),
						selector: { ui_color: {} }
					},
					align: {
						label: i("align"),
						selector: { select: {
							mode: "dropdown",
							options: a
						} }
					}
				} : {}
			}
		} }
	};
}
function at(e, t, n = "fields") {
	return it(e, e && t ? Je(e, t) : [], n);
}
function ot(e, t) {
	let n = (t) => e ? B(e, t) : t;
	return {
		name: "badge",
		selector: { object: {
			label_field: "key",
			fields: {
				key: {
					label: n("sensor"),
					required: !0,
					selector: { select: {
						mode: "dropdown",
						options: t
					} }
				},
				color: {
					label: n("color"),
					selector: { ui_color: {} }
				}
			}
		} }
	};
}
function st(e, t, n) {
	let r = (t) => e ? V(e, t) : t;
	return {
		name: "link",
		selector: { select: {
			mode: "dropdown",
			options: [
				{
					value: "none",
					label: r("link_none")
				},
				...t ? [{
					value: "device",
					label: r("link_device")
				}] : [],
				...n
			]
		} }
	};
}
function ct(e, t) {
	let n = (t) => e ? B(e, t) : t, r = Xe.map((t) => ({
		value: t,
		label: e ? V(e, `state_${t}`) : t
	}));
	return {
		name: "status",
		selector: { object: {
			multiple: !0,
			label_field: "field",
			fields: {
				field: {
					label: n("field"),
					required: !0,
					selector: { select: {
						mode: "dropdown",
						custom_value: !0,
						options: t
					} }
				},
				operator: {
					label: n("operator"),
					selector: { select: {
						mode: "dropdown",
						options: Ye.map((e) => ({
							value: e,
							label: e
						}))
					} }
				},
				value: {
					label: n("value"),
					selector: { text: {} }
				},
				state: {
					label: n("state"),
					required: !0,
					selector: { select: {
						mode: "dropdown",
						options: r
					} }
				}
			}
		} }
	};
}
function lt(e) {
	if (typeof e == "string") return { key: e };
	let { attribute: t, ...n } = e;
	return t ? {
		...n,
		key: `${e.key}:${t}`
	} : { ...n };
}
function ut(e, t) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let n = Object.fromEntries(Object.entries(e).filter(([, e]) => e != null && e !== ""));
		return typeof n[t] == "string" ? [n] : [];
	}) : [];
}
var dt = class extends L {
	constructor(...e) {
		super(...e), this.fieldListNames = [], this.ruleListNames = [], this.linkNames = [], this.singleFieldNames = [], this.computeLabel = (e) => this.hass ? B(this.hass, e.name) : e.name;
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
	formData() {
		let e = { ...this.config };
		for (let t of this.fieldListNames) {
			let n = e[t];
			Array.isArray(n) && (e[t] = n.map(lt));
		}
		for (let t of this.singleFieldNames) {
			let n = e[t];
			(typeof n == "string" || typeof n == "object" && n) && (e[t] = lt(n));
		}
		for (let t of this.linkNames) e[t] === !0 ? e[t] = "device" : (e[t] === void 0 || e[t] === !1) && (e[t] = "none");
		return e;
	}
	valueChanged(e) {
		e.stopPropagation();
		let t = {
			...this.config,
			...e.detail.value
		};
		for (let e of this.fieldListNames) {
			if (!(e in t)) continue;
			let n = ut(t[e], "key");
			n.length > 0 ? t[e] = n : delete t[e];
		}
		for (let e of this.singleFieldNames) {
			if (!(e in t)) continue;
			let [n] = ut([t[e]], "key");
			n ? t[e] = n : delete t[e];
		}
		for (let e of this.linkNames) (t[e] === "none" || t[e] === !1) && delete t[e];
		for (let e of this.ruleListNames) {
			if (!(e in t)) continue;
			let n = ut(t[e], "field");
			n.length > 0 ? t[e] = n : delete t[e];
		}
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return !this.hass || !this.config ? A : O`<ha-form
      .hass=${this.hass}
      .data=${this.formData()}
      .schema=${this.schema()}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
	}
}, ft = class extends dt {
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
}, pt = "hoc-youtrack-issues-card", mt = 5;
function ht(e) {
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
var gt = {
	tag: pt,
	ctor: class extends H {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.styles = [...H.styles, o`
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
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.platform === "youtrack" && Array.isArray(e.states[t.entity_id]?.attributes.issues));
			return t ? { entity: t.entity_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${pt}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return O``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			let r = ht(n.attributes).slice(0, t.max_items ?? mt);
			return r.length === 0 ? this.renderMessage("no_issues") : O`<ha-card>
      ${r.map((e) => O`<div class="issue">
            ${e.url ? O`<a
                    class="issue__id"
                    href=${e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${e.id}</a
                  >` : O`<span class="issue__id">${e.id}</span>`}
            <span class="issue__summary">${e.summary}</span>
            <span>${e.state}</span>
          </div>`)}
    </ha-card>`;
		}
	},
	editorTag: `${pt}-editor`,
	editorCtor: ft,
	name: "YouTrack issues",
	description: "The first issues of a YouTrack query sensor."
};
// src/core/parts/field-tile.ts
function _t(e, t) {
	return t.icon ? O`<ha-icon icon=${t.icon}></ha-icon>` : t.attribute ? O`<ha-icon icon="mdi:information-outline"></ha-icon>` : O`<ha-state-icon .hass=${e} .stateObj=${t.stateObj}></ha-state-icon>`;
}
function vt(e, t, n = "tile") {
	let r = O`<span class="field__value"
      >${t.value}${t.unit ? O` <span class="field__unit">${t.unit}</span>` : A}</span
    >${t.trend ? Oe(t.trend) : A}`;
	return O`<div
    class="field field--${n} ${t.tone ? "field--tone" : ""}"
    style="--c: ${t.color}"
    title=${t.label}
  >
    <span class="chip">${_t(e, t)}</span>
    ${n === "inline" ? O`<span class="field__text">${r}</span>` : O`<span class="field__text">
            <span class="field__main">${r}</span>
            <span class="field__label">${t.label}</span>
          </span>`}
  </div>`;
}
var yt = o`
  .field {
    --c: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .chip {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
    --mdc-icon-size: 20px;
  }
  .field__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .field__main {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .field__value {
    font-size: 1.15em;
    font-weight: 600;
    line-height: 1.2;
    color: var(--primary-text-color);
  }
  .field--tone .field__value {
    color: var(--c);
  }
  .field__unit {
    font-size: 0.7em;
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .field__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .field--inline .chip {
    width: 28px;
    height: 28px;
    --mdc-icon-size: 16px;
  }
  .field--row {
    padding: 4px 0;
  }
  .field--row .field__text {
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .field--row .field__main {
    order: 2;
  }
`;
// src/core/link.ts
function bt(e, t, n, r) {
	for (let i of [t, e]) {
		let e = xt(i, n, r);
		if (e) return e;
	}
}
function xt(e, t, n) {
	if (e === !0 || e === "device") {
		let e = t?.configuration_url;
		return W(e) ? e : void 0;
	}
	if (typeof e != "string") return;
	let r = e.trim();
	if (r.startsWith("https://")) return W(r) ? r : void 0;
	let i = K(r);
	if (!i.attribute) return;
	let a = n[i.key]?.attributes[i.attribute];
	return typeof a == "string" && W(a) ? a : void 0;
}
// src/core/resolver.ts
var St = "contributions_this_month";
function Ct(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || n !== void 0 && i.platform !== n) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key || i.entity_id] = a);
	}
	return r;
}
function wt(e, t) {
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
function Tt(e, t, n = St) {
	let r = /* @__PURE__ */ new Set();
	for (let i of Object.values(e.entities)) i.platform === t && i.translation_key === n && i.device_id && r.add(i.device_id);
	return [...r];
}
// src/core/fields-card.ts
function Et(e) {
	if (e !== void 0 && !(Array.isArray(e) && e.every((e) => typeof e == "string" || typeof e == "object" && !!e && typeof e.key == "string"))) throw Error("`fields` must be a list of sensor keys or objects with a `key`");
}
var Dt = class extends H {
	static {
		this.styles = [
			...H.styles,
			yt,
			o`
      ha-card {
        box-shadow: inset 0 3px 0 var(--hoc-accent, transparent);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .badge {
        flex: none;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
      }
      .badge--colored {
        color: var(--c);
        background: color-mix(in srgb, var(--c) 16%, transparent);
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .name a {
        color: inherit;
        text-decoration: none;
      }
      .name a:hover {
        text-decoration: underline;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px 12px;
        margin-top: 14px;
      }
      .inline-fields {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 8px;
      }
      .rows {
        margin-top: 8px;
      }
    `
		];
	}
	customStatus(e) {
		let t = this.config?.status;
		return t?.length ? tt(t, e) : void 0;
	}
	get dotKey() {}
	get statusKeys() {
		return this.dotKey ? [this.dotKey] : [];
	}
	deviceId() {
		return this.config?.device;
	}
	setConfig(e) {
		Et(e.fields), super.setConfig(e);
	}
	renderBadge(e, t) {
		let { hass: n, config: r } = this;
		if (!n || !r?.badge) return A;
		let i = K(r.badge), [a] = X(n, e, [i], t);
		if (!a) return A;
		let o = i.color ? Y(i.color) : a.tone ? a.color : void 0;
		return O`<span
      class="badge ${o ? "badge--colored" : ""}"
      style=${o ? `--c: ${o}` : ""}
      title=${a.label}
      >${a.value}${a.unit ? ` ${a.unit}` : ""}</span
    >`;
	}
	renderFields(e, t) {
		let { hass: n } = this;
		return !n || e.length === 0 ? A : t === "compact" ? O`<div class="inline-fields">
        ${e.map((e) => vt(n, e, "inline"))}
      </div>` : t === "list" ? O`<div class="rows">${e.map((e) => vt(n, e, "row"))}</div>` : O`<div class="grid">${e.map((e) => vt(n, e, "tile"))}</div>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return O``;
		let n = this.deviceId(), r = n ? e.devices[n] : void 0;
		if (!n || !r) return this.renderMessage("device_not_found", !0);
		let i = r.name_by_user ?? r.name ?? n, a = t.name?.trim() || i, o = t.show_status !== !1, s = Ct(e, n, this.platform), c = t.layout === "compact" || t.layout === "list" ? t.layout : "standard", l = X(e, s, (t.fields?.length ? t.fields : this.defaultFields(c, s)).map(K), i), u = X(e, s, this.statusKeys.map((e) => ({ key: e })), i), d = o ? this.customStatus(s) : void 0, f = d ? d.color : o ? qe(u) : void 0, ee = d ? d.tone === "failure" : u.some((e) => e.tone === "failure"), p = bt(t.link, t.link_url, r, s), m = this.dotKey ? s[this.dotKey]?.state : void 0, h = o ? d ? De(d.color) : m === void 0 ? A : R(m) : A, te = this.renderBadge(s, i);
		return O`<ha-card
      class=${ee ? "alert" : ""}
      style=${f ? `--hoc-accent: ${f}` : ""}
    >
      <div class="header">
        <div class="title">
          ${h}
          <span class="name"
            >${p ? O`<a href=${p} target="_blank" rel="noopener noreferrer">${a}</a>` : a}</span
          >
        </div>
        ${te}
      </div>
      ${this.renderFields(l, c)}
    </ha-card>`;
	}
}, Z = "github_pulse", Ot = "youtrack", kt = [
	"stars",
	"forks",
	"open_issues",
	"open_pull_requests",
	{
		key: "commits_this_month",
		trend: "commits_vs_last_month"
	},
	"latest_release"
], At = [
	{
		key: "contributions_this_month",
		trend: "commits_vs_last_month"
	},
	"current_streak",
	"longest_streak",
	"top_language"
], jt = [
	"issues_open",
	"issues_overdue",
	"issues_critical_open",
	"issues_created_7d",
	"issues_resolved_7d"
], Mt = {
	[Z]: {
		platform: Z,
		layouts: {
			compact: ["stars", "latest_release"],
			standard: kt,
			list: kt
		},
		variant: {
			marker: "contributions_this_month",
			layouts: {
				compact: ["contributions_this_month", "current_streak"],
				standard: At,
				list: At
			}
		},
		dotKey: "ci_state"
	},
	[Ot]: {
		platform: Ot,
		layouts: {
			compact: jt,
			standard: jt,
			list: jt
		},
		statusKeys: ["has_overdue", "has_critical_open"]
	}
};
function Nt(e, t) {
	for (let n of Object.values(e.entities)) {
		if (n.device_id !== t) continue;
		let e = Mt[n.platform];
		if (e) return e;
	}
}
// src/cards/generic/device/editor.ts
var Pt = class extends dt {
	constructor(...e) {
		super(...e), this.fieldListNames = ["fields"], this.singleFieldNames = ["badge"], this.ruleListNames = ["status"], this.linkNames = ["link"];
	}
	schema() {
		let e = this.config?.device, t = this.hass, n = t && e ? Je(t, e) : [], r = t && e ? W(t.devices[e]?.configuration_url) : !1, i = n.filter((n) => {
			let [r, i] = n.value.split(":");
			return !t || !r || !i ? !1 : Object.values(t.entities).some((n) => {
				if (n.device_id !== e || (n.translation_key || n.entity_id) !== r) return !1;
				let a = t.states[n.entity_id]?.attributes[i];
				return typeof a == "string" && W(a);
			});
		});
		return [
			{
				name: "device",
				required: !0,
				selector: { device: {} }
			},
			rt(t, [
				"compact",
				"standard",
				"list"
			]),
			{
				name: "name",
				selector: { text: {} }
			},
			ot(t, n),
			st(t, r, i),
			{
				name: "link_url",
				selector: { text: { type: "url" } }
			},
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...this.config?.show_status === !1 ? [] : [ct(t, n)],
			at(t, e)
		];
	}
}, Q = "hoc-device-card", Ft = 6, It = {
	tag: Q,
	ctor: class extends Dt {
		static {
			this.requiredKeys = ["device"];
		}
		preset() {
			let e = this.config?.device;
			return this.hass && e ? Nt(this.hass, e) : void 0;
		}
		get platform() {
			return this.preset()?.platform;
		}
		get dotKey() {
			return this.preset()?.dotKey;
		}
		get statusKeys() {
			let e = this.preset();
			return [...e?.dotKey ? [e.dotKey] : [], ...e?.statusKeys ?? []];
		}
		defaultFields(e, t) {
			let n = this.preset();
			if (!n) return Object.keys(t).slice(0, Ft);
			let r = n.variant;
			return (r && r.marker in t ? r.layouts : n.layouts)[e];
		}
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.device_id && e.states[t.entity_id]);
			return t?.device_id ? { device: t.device_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${Q}-editor`);
		}
	},
	editorTag: `${Q}-editor`,
	editorCtor: Pt,
	name: "Device",
	description: "Any device: choose which sensors and attributes to show, in colour. GitHub Pulse and YouTrack devices come with defaults."
}, Lt = class extends dt {
	constructor(...e) {
		super(...e), this.fieldListNames = ["columns"];
	}
	valueChanged(e) {
		let { repositories: t } = e.detail.value;
		Array.isArray(t) && (e.detail.value = {
			...e.detail.value,
			repositories: [...new Set(t)]
		}), super.valueChanged(e);
	}
	columnOptions() {
		if (!this.hass) return [];
		let e = new Set(Tt(this.hass, "github_pulse")), t = /* @__PURE__ */ new Map();
		for (let n of wt(this.hass, "github_pulse")) if (!e.has(n.id)) for (let e of Je(this.hass, n.id)) t.set(e.value, e);
		return [...t.values()];
	}
	schema() {
		let e = this.columnOptions();
		return [
			{
				name: "repositories",
				selector: { device: {
					integration: "github_pulse",
					multiple: !0
				} }
			},
			it(this.hass, e, "columns", !0),
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					custom_value: !0,
					options: [{
						value: "name",
						label: this.hass ? B(this.hass, "name") : "Name"
					}, ...e]
				} }
			},
			nt(this.hass, "order", ["asc", "desc"], "sort_order"),
			{
				name: "hide_owner",
				selector: { boolean: {} }
			},
			{
				name: "link",
				selector: { boolean: {} }
			},
			{
				name: "show_activity",
				selector: { boolean: {} }
			},
			nt(this.hass, "titles", [
				"text",
				"icon",
				"icon_text"
			], "column_titles"),
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
}, $ = "hoc-github-repos-card", Rt = [
	"ci_state",
	"stars",
	{
		key: "commits_this_month",
		trend: "commits_vs_last_month"
	},
	"latest_release"
];
function zt(e, t) {
	if (e.align) return e.align;
	if (e.key === "ci_state" && !e.attribute) return "left";
	let n = t.flatMap((t) => t.views.get(q(e)) ?? []);
	return n.length > 0 && n.every((e) => typeof e.raw == "number") ? "right" : "left";
}
function Bt(e, t) {
	return t === "name" ? e.name : e.views.get(t)?.raw ?? null;
}
function Vt(e, t, n, r) {
	let i = Bt(e, n), a = Bt(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o;
	return o = typeof i == "number" && typeof a == "number" ? i - a : typeof i == "number" ? -1 : typeof a == "number" ? 1 : i.localeCompare(a), o === 0 ? e.name.localeCompare(t.name) : o * r;
}
// src/registry.ts
var Ht = [
	{
		tag: $,
		ctor: class extends H {
			static {
				this.styles = [...H.styles, o`
      ha-card {
        overflow: hidden;
      }
      .scroll {
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        position: sticky;
        top: 0;
        background: var(--ha-card-background, var(--card-background-color));
        text-align: left;
        font-weight: 500;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--secondary-text-color);
      }
      th,
      td {
        padding: 8px 12px 8px 0;
      }
      tbody tr + tr td {
        border-top: 1px solid var(--divider-color);
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .name__content {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .name__text a {
        color: inherit;
        text-decoration: none;
      }
      .name__text a:hover {
        text-decoration: underline;
      }
      .name__content .dot {
        flex: none;
      }
      .cell {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .cell--tone {
        color: var(--c);
      }
      .cell__unit {
        font-size: 0.8em;
        font-weight: 400;
        color: var(--secondary-text-color);
      }
    `];
			}
			static getConfigElement() {
				return document.createElement(`${$}-editor`);
			}
			rows(e) {
				let { hass: t, config: n } = this;
				if (!t || !n) return [];
				let r = new Set(Tt(t, Z)), i = wt(t, Z).filter((e) => !r.has(e.id)), a = n.repositories === void 0 || n.repositories === "all" || n.repositories.length === 0 ? null : new Set(n.repositories);
				return i.filter((e) => a === null || a.has(e.id)).map((r) => {
					let i = Ct(t, r.id, Z), a = X(t, i, e, r.name);
					return {
						id: r.id,
						url: n.link === !0 && t.devices[r.id]?.configuration_url?.startsWith("https://") ? t.devices[r.id]?.configuration_url ?? void 0 : void 0,
						commits: i.commits_this_month?.state,
						name: n.hide_owner === !0 ? r.name.split("/").pop() ?? r.name : r.name,
						views: new Map(a.map((e) => [e.id, e]))
					};
				});
			}
			activityDot(e) {
				return R(Number(e.commits) > 0 ? "success" : void 0);
			}
			renderCell(e, t, n) {
				let r = `text-align: ${n}`;
				return e ? t.key === "ci_state" && !t.attribute ? O`<td style=${r}>${R(e.stateObj.state)}</td>` : O`<td style=${r}>
      <span class="cell ${e.tone || t.color ? "cell--tone" : ""}" style="--c: ${e.color}"
        >${e.value}${e.unit ? O`<span class="cell__unit">${e.unit}</span>` : A}${e.trend ? Oe(e.trend) : A}</span
      >
    </td>` : O`<td style=${r}>—</td>`;
			}
			renderContent() {
				let { hass: e, config: t } = this;
				if (!e || !t) return O``;
				let n = (t.columns?.length ? t.columns : Rt).map(K), r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows(n).sort((e, t) => Vt(e, t, r, i));
				if (a.length === 0) return this.renderMessage("no_repositories");
				let o = t.column_titles ?? "text", s = n.map((e) => zt(e, a)), c = n.map((t) => {
					let n = q(t), r = a.map((e) => e.views.get(n)).find((e) => e !== void 0);
					return {
						text: t.name ?? r?.label ?? J(t.key),
						icon: r ? _t(e, t.icon ? {
							...r,
							icon: t.icon
						} : r) : A,
						color: t.title_color ? Y(t.title_color) : void 0
					};
				});
				return O`<ha-card>
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${V(e, "repository")}</th>
              ${c.map((e, t) => O`<th
                    title=${e.text}
                    style=${[`text-align: ${s[t] ?? "left"}`, e.color ? `color: ${e.color}` : ""].filter(Boolean).join("; ")}
                  >
                    ${o === "text" ? A : e.icon}${o === "icon" ? A : e.text}
                  </th>`)}
            </tr>
          </thead>
          <tbody>
            ${a.map((e) => O`<tr>
                  <td class="name">
                    <span class="name__content"
                      >${t.show_activity ? this.activityDot(e) : A}<span
                        class="name__text"
                        >${e.url ? O`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                                >${e.name}</a
                              >` : e.name}</span
                      ></span
                    >
                  </td>
                  ${n.map((t, n) => this.renderCell(e.views.get(q(t)), t, s[n] ?? "left"))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
			}
		},
		editorTag: `${$}-editor`,
		editorCtor: Lt,
		name: "GitHub repositories",
		description: "Several GitHub Pulse repositories as a sortable table with selectable columns."
	},
	gt,
	It
];
function Ut(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function Wt(e = Ht) {
	window.customCards ??= [];
	for (let t of e) Ut(t.tag, t.ctor), t.editorTag && t.editorCtor && Ut(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !0
	});
}
// src/index.ts
Wt();
export { Wt as registerCards };
