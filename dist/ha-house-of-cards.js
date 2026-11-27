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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: ee, getPrototypeOf: te } = Object, p = globalThis, m = p.trustedTypes, ne = m ? m.emptyScript : "", re = p.reactiveElementPolyfillSupport, h = (e, t) => e, g = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ne : null;
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
	converter: g,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), p.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
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
		if (this.hasOwnProperty(h("elementProperties"))) return;
		let e = te(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(h("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(h("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? g : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? g : e.converter;
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
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[h("elementProperties")] = /* @__PURE__ */ new Map(), _[h("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: _ }), (p.reactiveElementVersions ??= []).push("2.1.2");
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
function De(e) {
	return O`<span class="dot dot--${Ee(e)}" aria-hidden="true"></span>`;
}
function Oe(e) {
	return e ? O`<span class="dot" style="background: ${e}" aria-hidden="true"></span>` : O`<span class="dot dot--neutral" aria-hidden="true"></span>`;
}
function ke(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return O`<span class="trend trend--${e.direction}">${t}${n}</span>`;
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
`, je = {
	device_not_found: "Gerät nicht gefunden",
	no_devices: "Keine Geräte",
	choose_devices: "Wähle Geräte oder eine Integration",
	unavailable: "Nicht verfügbar",
	stars: "Sterne",
	forks: "Forks",
	issues: "Issues",
	pull_requests: "Pull Requests",
	commits_this_month: "Commits im Monat",
	release: "Release",
	ci: "CI",
	device: "Gerät",
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
	align_left: "Links",
	align_center: "Zentriert",
	align_right: "Rechts",
	editor_align: "Ausrichtung",
	editor_title_color: "Titelfarbe",
	editor_platform: "Integration",
	editor_devices: "Geräte",
	platform_none: "Nur gewählte Geräte",
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
}, R = {
	device_not_found: "Device not found",
	no_devices: "No devices",
	choose_devices: "Choose devices or an integration",
	unavailable: "Unavailable",
	stars: "Stars",
	forks: "Forks",
	issues: "Issues",
	pull_requests: "Pull requests",
	commits_this_month: "Commits this month",
	release: "Release",
	ci: "CI",
	device: "Device",
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
	align_left: "Left",
	align_center: "Centre",
	align_right: "Right",
	editor_align: "Alignment",
	editor_title_color: "Title colour",
	editor_platform: "Integration",
	editor_devices: "Devices",
	platform_none: "Selected devices only",
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
}, Me = {
	en: R,
	de: je
};
function z(e, t) {
	let n = `editor_${t}`, r = (Me[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? R)[n] ?? R[n];
	if (r) return r;
	let i = t.replace(/_/g, " ");
	return i.charAt(0).toUpperCase() + i.slice(1);
}
function B(e, t) {
	return (Me[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? R)[t];
}
// src/core/base-card.ts
var V = class extends L {
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
		let n = this.hass ? B(this.hass, e) : e;
		return O`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? A : this.renderContent();
	}
}, Ne = 1;
function Pe(e) {
	return e === null || !Number.isFinite(e) ? {
		direction: "flat",
		percent: null
	} : Math.abs(e) <= Ne ? {
		direction: "flat",
		percent: e
	} : {
		direction: e > 0 ? "up" : "down",
		percent: e
	};
}
var Fe = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function Ie(e) {
	return e === void 0 || Fe.has(e);
}
function H(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Le(e) {
	let t = H(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
function U(e) {
	if (typeof e != "string" || !e.startsWith("https://")) return !1;
	try {
		return new URL(e).protocol === "https:";
	} catch {
		return !1;
	}
}
// src/core/fields.ts
var Re = {
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
}, ze = [
	"blue",
	"purple",
	"teal",
	"orange",
	"pink",
	"green",
	"indigo",
	"amber"
], W = {
	success: "var(--success-color, var(--green-color))",
	failure: "var(--error-color, var(--red-color))",
	pending: "var(--warning-color, var(--amber-color))"
}, Be = /* @__PURE__ */ new Set([
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
function G(e) {
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
function K(e) {
	return e.attribute ? `${e.key}:${e.attribute}` : e.key;
}
function q(e) {
	let t = e.replace(/_/g, " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}
function Ve(e) {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t;
}
function He(e) {
	return `var(--${e}-color)`;
}
function Ue(e) {
	return /^[a-z-]+$/.test(e) ? He(e) : e;
}
function We(e, t) {
	return e.color ? /^[a-z-]+$/.test(e.color) ? He(e.color) : e.color : t ? W[t] : He(ze[Ve(e.key) % ze.length] ?? "blue");
}
function Ge(e, t, n, r) {
	let i = Re[t];
	if (i) return B(e, i);
	let a = n.attributes.friendly_name;
	return typeof a == "string" && a.trim() !== "" && (r && a.startsWith(`${r} `) ? a.slice(r.length + 1) : a).trim() || q(t);
}
function Ke(e, t) {
	if (t === "success") return "success";
	if (t === "failure" || t === "error") return "failure";
	if (t === "pending" || t === "queued") return "pending";
	if (e.startsWith("has_") && t === "on") return "failure";
	let n = H(t);
	if (n !== null) {
		if (/(overdue|critical|failing|stale)/.test(e)) return n > 0 ? "failure" : void 0;
		if (/(_vs_|trend)/.test(e)) {
			if (n > 1) return "success";
			if (n < -1) return "failure";
		}
	}
}
function qe(e) {
	if (typeof e == "number") return Math.abs(e) >= 1e3 ? Le(String(e)) : String(e);
	if (typeof e == "string") return e.trim() === "" ? void 0 : e;
	if (typeof e == "boolean") return e ? "✓" : "–";
	if (Array.isArray(e)) return String(e.length);
}
function Je(e, t) {
	let n = t.attributes.unit_of_measurement, r = typeof n == "string" && n !== "" ? n : void 0, i = H(t.state);
	return i === null ? { value: e.formatEntityState?.(t) ?? t.state } : r ? {
		value: String(i),
		unit: r
	} : { value: Math.abs(i) >= 1e3 ? Le(t.state) : String(i) };
}
function J(e, t, n, r) {
	return n.flatMap((n) => {
		let i = t[n.key];
		if (!i || Ie(i.state)) return [];
		let a, o;
		if (n.attribute) {
			let e = i.attributes[n.attribute], t = qe(e);
			if (t === void 0) return [];
			a = { value: t }, o = typeof e == "number" ? e : t;
		} else a = Je(e, i), o = H(i.state) ?? i.state;
		let s = n.attribute ? void 0 : Ke(n.key, i.state), c = n.name ?? (n.attribute ? `${Ge(e, n.key, i, r)} › ${q(n.attribute)}` : Ge(e, n.key, i, r)), l = n.trend ? t[n.trend]?.state : void 0, u = {
			id: K(n),
			label: c,
			...a,
			raw: o,
			color: We(n, s),
			stateObj: i
		};
		return n.icon && (u.icon = n.icon), n.attribute && (u.attribute = n.attribute), s && (u.tone = s), l !== void 0 && (u.trend = Pe(H(l))), [u];
	});
}
function Ye(e) {
	for (let t of [
		"failure",
		"pending",
		"success"
	]) if (e.some((e) => e.tone === t)) return W[t];
}
function Y(e, t) {
	let n = e.devices[t]?.name ?? void 0, r = [], i = /* @__PURE__ */ new Set();
	for (let a of Object.values(e.entities)) {
		if (a.device_id !== t) continue;
		let o = e.states[a.entity_id];
		if (!o) continue;
		let s = a.translation_key || a.entity_id;
		if (i.has(s)) continue;
		i.add(s);
		let c = Ge(e, s, o, n);
		r.push({
			value: s,
			label: c
		});
		for (let [e, t] of Object.entries(o.attributes)) Be.has(e) || qe(t) === void 0 || Array.isArray(t) || r.push({
			value: `${s}:${e}`,
			label: `${c} › ${q(e)}`
		});
	}
	return r.sort((e, t) => {
		let n = e.value.split(":")[0] ?? "", r = t.value.split(":")[0] ?? "";
		return n === r ? e.value.localeCompare(t.value) : n.localeCompare(r);
	});
}
// src/core/status.ts
var Xe = [
	"=",
	"!=",
	">",
	">=",
	"<",
	"<=",
	"contains"
], Ze = [
	"success",
	"pending",
	"failure",
	"none"
], Qe = /* @__PURE__ */ new Set([
	"success",
	"pending",
	"failure"
]);
function $e(e) {
	let t = e.trim();
	if (t === "" || t.toLowerCase() === "none" || /[;{}"<>]/.test(t)) return {};
	let n = t.toLowerCase();
	if (Qe.has(n)) {
		let e = n;
		return {
			tone: e,
			color: W[e]
		};
	}
	return { color: Ue(t) };
}
function et(e, t) {
	let n = G(t), r = e[n.key];
	if (r && !Ie(r.state)) return n.attribute ? r.attributes[n.attribute] : r.state;
}
function tt(e, t, n) {
	if (e == null) return !1;
	let r = String(e).toLowerCase(), i = String(n ?? "").toLowerCase();
	if (t === "contains") return r.includes(i);
	let a = H(String(e)), o = H(String(n));
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
function nt(e, t) {
	for (let n of e) if (tt(et(t, n.field), n.operator ?? "=", n.value)) return $e(n.state);
	return {};
}
// src/core/editor.ts
function rt(e, t, n, r) {
	return {
		name: r,
		selector: { select: {
			mode: "dropdown",
			options: n.map((n) => ({
				value: n,
				label: e ? B(e, `${t}_${n}`) : n
			}))
		} }
	};
}
function it(e, t, n = "layout") {
	return rt(e, "layout", t, n);
}
function at(e, t, n = "fields", r = !1) {
	let i = (t) => e ? z(e, t) : t, a = [
		"left",
		"center",
		"right"
	].map((t) => ({
		value: t,
		label: e ? B(e, `align_${t}`) : t
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
function ot(e, t, n = "fields") {
	return at(e, e && t ? Y(e, t) : [], n);
}
function st(e, t) {
	if (!e) return {
		hasDevicePage: !1,
		attributeUrls: []
	};
	let n = t.some((t) => U(e.devices[t]?.configuration_url)), r = /* @__PURE__ */ new Map();
	for (let n of t) for (let t of Y(e, n)) {
		let [i, a] = t.value.split(":");
		i && a && !r.has(t.value) && Object.values(e.entities).some((t) => {
			if (t.device_id !== n || (t.translation_key || t.entity_id) !== i) return !1;
			let r = e.states[t.entity_id]?.attributes[a];
			return typeof r == "string" && U(r);
		}) && r.set(t.value, t);
	}
	return {
		hasDevicePage: n,
		attributeUrls: [...r.values()]
	};
}
function ct(e, t) {
	let n = (t) => e ? z(e, t) : t;
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
function lt(e, t, n) {
	let r = (t) => e ? B(e, t) : t;
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
function ut(e, t) {
	let n = (t) => e ? z(e, t) : t, r = Ze.map((t) => ({
		value: t,
		label: e ? B(e, `state_${t}`) : t
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
						options: Xe.map((e) => ({
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
function X(e) {
	if (typeof e == "string") return { key: e };
	let { attribute: t, ...n } = e;
	return t ? {
		...n,
		key: `${e.key}:${t}`
	} : { ...n };
}
function dt(e, t) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let n = Object.fromEntries(Object.entries(e).filter(([, e]) => e != null && e !== ""));
		return typeof n[t] == "string" ? [n] : [];
	}) : [];
}
var ft = class extends L {
	constructor(...e) {
		super(...e), this.fieldListNames = [], this.ruleListNames = [], this.linkNames = [], this.noneNames = [], this.singleFieldNames = [], this.computeLabel = (e) => this.hass ? z(this.hass, e.name) : e.name;
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
	finalizeConfig(e) {}
	formData() {
		let e = { ...this.config };
		for (let t of this.fieldListNames) {
			let n = e[t];
			if (Array.isArray(n) && n.length > 0) e[t] = n.map(X);
			else {
				let n = this.defaultFields?.(t);
				n?.length && (e[t] = n.map(X));
			}
		}
		for (let t of this.singleFieldNames) {
			let n = e[t];
			(typeof n == "string" || typeof n == "object" && n) && (e[t] = X(n));
		}
		for (let t of this.linkNames) e[t] === !0 ? e[t] = "device" : (e[t] === void 0 || e[t] === !1) && (e[t] = "none");
		for (let t of this.noneNames) e[t] ??= "none";
		return e;
	}
	valueChanged(e) {
		e.stopPropagation();
		let t = this.config, n = {
			...this.config,
			...e.detail.value
		};
		for (let e of this.fieldListNames) {
			if (!(e in n)) continue;
			let r = dt(n[e], "key"), i = !Array.isArray(t[e]) || t[e].length === 0 ? (this.defaultFields?.(e) ?? []).map(X) : [], a = i.length > 0 && JSON.stringify(r) === JSON.stringify(i);
			r.length > 0 && !a ? n[e] = r : delete n[e];
		}
		for (let e of this.singleFieldNames) {
			if (!(e in n)) continue;
			let [t] = dt([n[e]], "key");
			t ? n[e] = t : delete n[e];
		}
		for (let e of this.linkNames) (n[e] === "none" || n[e] === !1) && delete n[e];
		for (let e of this.noneNames) n[e] === "none" && delete n[e];
		for (let e of this.ruleListNames) {
			if (!(e in n)) continue;
			let t = dt(n[e], "field");
			t.length > 0 ? n[e] = t : delete n[e];
		}
		this.finalizeConfig(n), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: n },
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
}, pt = class extends ft {
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
}, mt = "hoc-youtrack-issues-card", ht = 5;
function gt(e) {
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
var _t = {
	tag: mt,
	ctor: class extends V {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.styles = [...V.styles, o`
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
			return document.createElement(`${mt}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return O``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			let r = gt(n.attributes).slice(0, t.max_items ?? ht);
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
	editorTag: `${mt}-editor`,
	editorCtor: pt,
	name: "YouTrack issues",
	description: "The first issues of a YouTrack query sensor."
};
// src/core/parts/field-tile.ts
function vt(e, t) {
	return t.icon ? O`<ha-icon icon=${t.icon}></ha-icon>` : t.attribute ? O`<ha-icon icon="mdi:information-outline"></ha-icon>` : O`<ha-state-icon .hass=${e} .stateObj=${t.stateObj}></ha-state-icon>`;
}
function yt(e, t, n = "tile") {
	let r = O`<span class="field__value"
      >${t.value}${t.unit ? O` <span class="field__unit">${t.unit}</span>` : A}</span
    >${t.trend ? ke(t.trend) : A}`;
	return O`<div
    class="field field--${n} ${t.tone ? "field--tone" : ""}"
    style="--c: ${t.color}"
    title=${t.label}
  >
    <span class="chip">${vt(e, t)}</span>
    ${n === "inline" ? O`<span class="field__text">${r}</span>` : O`<span class="field__text">
            <span class="field__main">${r}</span>
            <span class="field__label">${t.label}</span>
          </span>`}
  </div>`;
}
var bt = o`
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
function xt(e, t, n, r) {
	for (let i of [e, t]) {
		let e = St(i, n, r);
		if (e) return e;
	}
}
function St(e, t, n) {
	if (e === !0 || e === "device") {
		let e = t?.configuration_url;
		return U(e) ? e : void 0;
	}
	if (typeof e != "string") return;
	let r = e.trim();
	if (r.startsWith("https://")) return U(r) ? r : void 0;
	let i = G(r);
	if (!i.attribute) return;
	let a = n[i.key]?.attributes[i.attribute];
	return typeof a == "string" && U(a) ? a : void 0;
}
// src/core/resolver.ts
function Z(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || n !== void 0 && i.platform !== n) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key || i.entity_id] = a);
	}
	return r;
}
function Ct(e, t) {
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
// src/core/fields-card.ts
function wt(e) {
	return e === "compact" || e === "list" ? e : "standard";
}
function Tt(e) {
	if (e !== void 0 && !(Array.isArray(e) && e.every((e) => typeof e == "string" || typeof e == "object" && !!e && typeof e.key == "string"))) throw Error("`fields` must be a list of sensor keys or objects with a `key`");
}
var Et = class extends V {
	static {
		this.styles = [
			...V.styles,
			bt,
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
		return t?.length ? nt(t, e) : void 0;
	}
	get dotKey() {}
	get statusKeys() {
		return this.dotKey ? [this.dotKey] : [];
	}
	deviceId() {
		return this.config?.device;
	}
	setConfig(e) {
		Tt(e.fields), super.setConfig(e);
	}
	renderBadge(e, t) {
		let { hass: n, config: r } = this;
		if (!n || !r?.badge) return A;
		let i = G(r.badge), [a] = J(n, e, [i], t);
		if (!a) return A;
		let o = i.color ? Ue(i.color) : a.tone ? a.color : void 0;
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
        ${e.map((e) => yt(n, e, "inline"))}
      </div>` : t === "list" ? O`<div class="rows">${e.map((e) => yt(n, e, "row"))}</div>` : O`<div class="grid">${e.map((e) => yt(n, e, "tile"))}</div>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return O``;
		let n = this.deviceId(), r = n ? e.devices[n] : void 0;
		if (!n || !r) return this.renderMessage("device_not_found", !0);
		let i = r.name_by_user ?? r.name ?? n, a = t.name?.trim() || i, o = t.show_status !== !1, s = Z(e, n, this.platform), c = wt(t.layout), l = J(e, s, (t.fields?.length ? t.fields : this.defaultFields(c, s)).map(G), i), u = J(e, s, this.statusKeys.map((e) => ({ key: e })), i), d = o ? this.customStatus(s) : void 0, f = d ? d.color : o ? Ye(u) : void 0, ee = d ? d.tone === "failure" : u.some((e) => e.tone === "failure"), te = xt(t.link, t.link_url, r, s), p = this.dotKey ? s[this.dotKey]?.state : void 0, m = o ? d ? Oe(d.color) : p === void 0 ? A : De(p) : A, ne = this.renderBadge(s, i);
		return O`<ha-card
      class=${ee ? "alert" : ""}
      style=${f ? `--hoc-accent: ${f}` : ""}
    >
      <div class="header">
        <div class="title">
          ${m}
          <span class="name"
            >${te ? O`<a href=${te} target="_blank" rel="noopener noreferrer">${a}</a>` : a}</span
          >
        </div>
        ${ne}
      </div>
      ${this.renderFields(l, c)}
    </ha-card>`;
	}
}, Dt = "github_pulse", Ot = "youtrack", kt = [
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
], Q = {
	[Dt]: {
		platform: Dt,
		label: "GitHub Pulse",
		columns: [
			"ci_state",
			"stars",
			{
				key: "commits_this_month",
				trend: "commits_vs_last_month"
			},
			"latest_release"
		],
		rowStatus: [{
			field: "commits_this_month",
			operator: ">",
			value: 0,
			state: "success"
		}],
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
		label: "YouTrack",
		columns: [
			"issues_open",
			"issues_overdue",
			"issues_critical_open"
		],
		rowStatus: [{
			field: "has_overdue",
			value: "on",
			state: "failure"
		}, {
			field: "has_critical_open",
			value: "on",
			state: "failure"
		}],
		layouts: {
			compact: jt,
			standard: jt,
			list: jt
		},
		statusKeys: ["has_overdue", "has_critical_open"]
	}
};
function $(e, t) {
	for (let n of Object.values(e.entities)) {
		if (n.device_id !== t) continue;
		let e = Q[n.platform];
		if (e) return e;
	}
}
var Mt = 6;
function Nt(e, t, n) {
	if (!e) return Object.keys(n).slice(0, Mt);
	let r = e.variant;
	return (r && r.marker in n ? r.layouts : e.layouts)[t];
}
function Pt(e, t, n) {
	let r = n.variant?.marker;
	return r ? Object.values(e.entities).some((e) => e.device_id === t && e.platform === n.platform && e.translation_key === r) : !1;
}
function Ft(e, t, n) {
	let r = (t) => {
		let n = e.devices[t];
		return n?.name_by_user ?? n?.name ?? t;
	};
	if (Array.isArray(t) && t.length > 0) return [...new Set(t)].filter((t) => t in e.devices).map((e) => ({
		id: e,
		name: r(e)
	}));
	if (!n) return [];
	let i = Q[n];
	return Ct(e, n).filter((t) => !i || !Pt(e, t.id, i));
}
function It(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.values(e.entities)) n.device_id && e.devices[n.device_id] && t.add(n.platform);
	return [...t].map((e) => ({
		value: e,
		label: Q[e]?.label ?? e
	})).sort((e, t) => e.label.localeCompare(t.label));
}
// src/cards/generic/device/editor.ts
var Lt = class extends ft {
	constructor(...e) {
		super(...e), this.fieldListNames = ["fields"], this.singleFieldNames = ["badge"], this.ruleListNames = ["status"], this.linkNames = ["link"];
	}
	defaultFields(e) {
		let { hass: t, config: n } = this, r = n?.device;
		if (e !== "fields" || !t || !r) return;
		let i = $(t, r), a = Z(t, r, i?.platform);
		return Nt(i, wt(n.layout), a).filter((e) => G(e).key in a);
	}
	finalizeConfig(e) {
		e.link && delete e.link_url;
	}
	schema() {
		let e = this.config?.device, t = this.hass, n = t && e ? Y(t, e) : [], { hasDevicePage: r, attributeUrls: i } = st(t, e ? [e] : []);
		return [
			{
				name: "device",
				required: !0,
				selector: { device: {} }
			},
			it(t, [
				"compact",
				"standard",
				"list"
			]),
			{
				name: "name",
				selector: { text: {} }
			},
			ct(t, n),
			lt(t, r, i),
			...this.config?.link ? [] : [{
				name: "link_url",
				selector: { text: { type: "url" } }
			}],
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...this.config?.show_status === !1 ? [] : [ut(t, n)],
			ot(t, e)
		];
	}
}, Rt = "hoc-device-card", zt = {
	tag: Rt,
	ctor: class extends Et {
		static {
			this.requiredKeys = ["device"];
		}
		preset() {
			let e = this.config?.device;
			return this.hass && e ? $(this.hass, e) : void 0;
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
			return Nt(this.preset(), e, t);
		}
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.device_id && e.states[t.entity_id]);
			return t?.device_id ? { device: t.device_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${Rt}-editor`);
		}
	},
	editorTag: `${Rt}-editor`,
	editorCtor: Lt,
	name: "Device",
	description: "Any device: choose which sensors and attributes to show, in colour. GitHub Pulse and YouTrack devices come with defaults."
}, Bt = class extends ft {
	constructor(...e) {
		super(...e), this.fieldListNames = ["columns"], this.ruleListNames = ["status"], this.linkNames = ["link"], this.noneNames = ["platform"];
	}
	valueChanged(e) {
		let { devices: t } = e.detail.value;
		Array.isArray(t) && (e.detail.value = {
			...e.detail.value,
			devices: [...new Set(t)]
		}), super.valueChanged(e);
	}
	deviceIds() {
		let { hass: e, config: t } = this;
		return !e || !t ? [] : Ft(e, t.devices, t.platform).map((e) => e.id);
	}
	columnOptions(e) {
		let { hass: t } = this;
		if (!t) return [];
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of Y(t, r)) n.set(e.value, e);
		return [...n.values()];
	}
	schema() {
		let { hass: e, config: t } = this, n = this.deviceIds(), r = this.columnOptions(n), { hasDevicePage: i, attributeUrls: a } = st(e, n), o = e ? It(e) : [];
		return [
			{
				name: "platform",
				selector: { select: {
					mode: "dropdown",
					options: [{
						value: "none",
						label: e ? B(e, "platform_none") : "none"
					}, ...o]
				} }
			},
			{
				name: "devices",
				selector: { device: {
					multiple: !0,
					...t?.platform ? { integration: t.platform } : {}
				} }
			},
			at(e, r, "columns", !0),
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					custom_value: !0,
					options: [{
						value: "name",
						label: e ? z(e, "name") : "Name"
					}, ...r]
				} }
			},
			rt(e, "order", ["asc", "desc"], "sort_order"),
			{
				name: "hide_owner",
				selector: { boolean: {} }
			},
			lt(e, i, a),
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...t?.show_status ? [ut(e, r)] : [],
			rt(e, "titles", [
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
}, Vt = "hoc-devices-card", Ht = 4;
function Ut(e, t) {
	if (e.align) return e.align;
	if (e.key === "ci_state" && !e.attribute) return "left";
	let n = t.flatMap((t) => t.views.get(K(e)) ?? []);
	return n.length > 0 && n.every((e) => typeof e.raw == "number") ? "right" : "left";
}
function Wt(e, t) {
	return t === "name" ? e.name : e.views.get(t)?.raw ?? null;
}
function Gt(e, t, n, r) {
	let i = Wt(e, n), a = Wt(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o;
	return o = typeof i == "number" && typeof a == "number" ? i - a : typeof i == "number" ? -1 : typeof a == "number" ? 1 : i.localeCompare(a), o === 0 ? e.name.localeCompare(t.name) : o * r;
}
// src/registry.ts
var Kt = [
	{
		tag: Vt,
		ctor: class extends V {
			static {
				this.styles = [...V.styles, o`
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
				return document.createElement(`${Vt}-editor`);
			}
			static getStubConfig(e) {
				let t = Object.keys(Q).find((t) => Object.values(e.entities).some((e) => e.platform === t && e.device_id)) ?? It(e)[0]?.value;
				return t ? { platform: t } : {};
			}
			rows(e) {
				let { hass: t, config: n } = this;
				return !t || !n ? [] : Ft(t, n.devices, n.platform).map((r) => {
					let i = $(t, r.id), a = Z(t, r.id, i?.platform), o = J(t, a, e, r.name), s = nt(n.status?.length ? n.status : i?.rowStatus ?? [], a);
					return {
						id: r.id,
						url: xt(n.link, void 0, t.devices[r.id], a),
						statusColor: s.color,
						name: n.hide_owner === !0 ? r.name.split("/").pop() ?? r.name : r.name,
						views: new Map(o.map((e) => [e.id, e]))
					};
				});
			}
			columnSpecs() {
				let { hass: e, config: t } = this;
				if (!e || !t) return [];
				if (t.columns?.length) return t.columns.map(G);
				let n = Ft(e, t.devices, t.platform)[0], r = (t.platform ? Q[t.platform] : void 0) ?? (n ? $(e, n.id) : void 0);
				return r ? r.columns.map(G) : n ? Object.keys(Z(e, n.id)).slice(0, Ht).map((e) => ({ key: e })) : [];
			}
			renderCell(e, t, n) {
				let r = `text-align: ${n}`;
				return e ? t.key === "ci_state" && !t.attribute ? O`<td style=${r}>${De(e.stateObj.state)}</td>` : O`<td style=${r}>
      <span class="cell ${e.tone || t.color ? "cell--tone" : ""}" style="--c: ${e.color}"
        >${e.value}${e.unit ? O`<span class="cell__unit">${e.unit}</span>` : A}${e.trend ? ke(e.trend) : A}</span
      >
    </td>` : O`<td style=${r}>—</td>`;
			}
			renderContent() {
				let { hass: e, config: t } = this;
				if (!e || !t) return O``;
				let n = this.columnSpecs(), r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows(n).sort((e, t) => Gt(e, t, r, i));
				if (a.length === 0) return this.renderMessage(t.devices?.length || t.platform ? "no_devices" : "choose_devices");
				let o = t.column_titles ?? "text", s = n.map((e) => Ut(e, a)), c = n.map((t) => {
					let n = K(t), r = a.map((e) => e.views.get(n)).find((e) => e !== void 0);
					return {
						text: t.name ?? r?.label ?? q(t.key),
						icon: r ? vt(e, t.icon ? {
							...r,
							icon: t.icon
						} : r) : A,
						color: t.title_color ? Ue(t.title_color) : void 0
					};
				});
				return O`<ha-card>
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${B(e, "device")}</th>
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
                      >${t.show_status ? Oe(e.statusColor) : A}<span
                        class="name__text"
                        >${e.url ? O`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                                >${e.name}</a
                              >` : e.name}</span
                      ></span
                    >
                  </td>
                  ${n.map((t, n) => this.renderCell(e.views.get(K(t)), t, s[n] ?? "left"))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
			}
		},
		editorTag: `${Vt}-editor`,
		editorCtor: Bt,
		name: "Devices",
		description: "Several devices as a sortable table with selectable columns. GitHub Pulse and YouTrack come with defaults."
	},
	_t,
	zt
];
function qt(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function Jt(e = Kt) {
	window.customCards ??= [];
	for (let t of e) qt(t.tag, t.ctor), t.editorTag && t.editorCtor && qt(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !0
	});
}
// src/index.ts
Jt();
export { Jt as registerCards };
