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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: f } = Object, p = globalThis, ne = p.trustedTypes, m = ne ? ne.emptyScript : "", re = p.reactiveElementPolyfillSupport, h = (e, t) => e, ie = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? m : null;
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
}, ae = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: ie,
	reflect: !1,
	useDefault: !1,
	hasChanged: ae
};
Symbol.metadata ??= Symbol("metadata"), p.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(h("elementProperties"))) return;
		let e = f(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(h("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(h("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? ie : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ie : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ae)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[h("elementProperties")] = /* @__PURE__ */ new Map(), g[h("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: g }), (p.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var se = globalThis, ce = (e) => e, _ = se.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", me = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, T = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), O = y.createTreeWalker(y, 129);
function xe(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var Se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [xe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, k = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Se(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : j
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), O.nextNode(), c.push({
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
function A(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Ce = class {
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
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new we(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, we = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = A(this, e, t), x(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = k.createElement(xe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = be.get(e.strings);
		return t === void 0 && be.set(e.strings, t = new k(e)), t;
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
}, j = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends j {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Ee = class extends j {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, De = class extends j {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
};
(0, se.litHtmlPolyfillSupport)?.(k, we), (se.litHtmlVersions ??= []).push("3.3.3");
var ke = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new we(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, M = globalThis, N = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ke(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
N._$litElement$ = !0, N.finalized = !0, M.litElementHydrateSupport?.({ LitElement: N }), (0, M.litElementPolyfillSupport)?.({ LitElement: N }), (M.litElementVersions ??= []).push("4.2.2");
// src/core/parts/typography.ts
var Ae = o`var(--ha-font-size-m, 14px)`, P = o`var(--ha-font-size-s, 12px)`;
// src/core/parts/index.ts
function je(e) {
	switch (e) {
		case "success": return "success";
		case "failure":
		case "error": return "failure";
		case "pending": return "pending";
		default: return "neutral";
	}
}
function Me(e) {
	return T`<span class="dot dot--${je(e)}" aria-hidden="true"></span>`;
}
function Ne(e) {
	return e ? T`<span class="dot" style="background: ${e}" aria-hidden="true"></span>` : T`<span class="dot dot--neutral" aria-hidden="true"></span>`;
}
function Pe(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return T`<span class="trend trend--${e.direction}">${t}${n}</span>`;
}
var Fe = o`
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
    font-size: ${P};
    color: var(--secondary-text-color);
  }
  .trend--up {
    color: var(--success-color, var(--primary-text-color));
  }
  .trend--down {
    color: var(--error-color);
  }
`, Ie = {
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
	more: "weitere",
	show_less: "Weniger anzeigen",
	open_in_youtrack: "In YouTrack öffnen",
	open_issue: "Issue öffnen",
	priority: "Priorität",
	no_issue_list: "Dieser Sensor listet keine Issues. Wähle einen Abfrage-Sensor.",
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
	editor_show_title: "Titel anzeigen",
	editor_title: "Titel",
	editor_device_title: "Titel der Namensspalte",
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
	editor_shorten_names: "Namen kürzen",
	titles_text: "Text",
	titles_icon: "Icon",
	titles_icon_text: "Icon und Text",
	editor_column_titles: "Spaltentitel",
	align_left: "Links",
	align_center: "Zentriert",
	align_right: "Rechts",
	editor_align: "Ausrichtung",
	editor_title_color: "Titelfarbe",
	badge_count: "Anzahl Treffer",
	editor_expandable: "Aufklappbar",
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
}, F = {
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
	more: "more",
	show_less: "Show less",
	open_in_youtrack: "Open in YouTrack",
	open_issue: "Open issue",
	priority: "Priority",
	no_issue_list: "This sensor lists no issues. Choose a query sensor.",
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
	editor_show_title: "Show title",
	editor_title: "Title",
	editor_device_title: "Title of the name column",
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
	editor_shorten_names: "Shorten names",
	titles_text: "Text",
	titles_icon: "Icon",
	titles_icon_text: "Icon and text",
	editor_column_titles: "Column titles",
	align_left: "Left",
	align_center: "Centre",
	align_right: "Right",
	editor_align: "Alignment",
	editor_title_color: "Title colour",
	badge_count: "Number of matches",
	editor_expandable: "Expandable",
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
}, Le = {
	en: F,
	de: Ie
};
function I(e, t) {
	let n = `editor_${t}`, r = (Le[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? F)[n] ?? F[n];
	if (r) return r;
	let i = t.replace(/_/g, " ");
	return i.charAt(0).toUpperCase() + i.slice(1);
}
function L(e, t) {
	return (Le[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? F)[t];
}
// src/core/base-card.ts
var R = class extends N {
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
		this.styles = [Fe, o`
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
		let n = this.hass ? L(this.hass, e) : e;
		return T`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? D : this.renderContent();
	}
}, Re = 1;
function ze(e) {
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
var Be = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function Ve(e) {
	return e === void 0 || Be.has(e);
}
function z(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function He(e) {
	let t = z(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
function B(e) {
	if (typeof e != "string" || !e.startsWith("https://")) return !1;
	try {
		return new URL(e).protocol === "https:";
	} catch {
		return !1;
	}
}
// src/core/fields.ts
var Ue = {
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
}, We = [
	"blue",
	"purple",
	"teal",
	"orange",
	"pink",
	"green",
	"indigo",
	"amber"
], V = {
	success: "var(--success-color, var(--green-color))",
	failure: "var(--error-color, var(--red-color))",
	pending: "var(--warning-color, var(--amber-color))"
}, Ge = /* @__PURE__ */ new Set([
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
function H(e) {
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
function U(e) {
	return e.attribute ? `${e.key}:${e.attribute}` : e.key;
}
function W(e) {
	let t = e.replace(/_/g, " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}
function Ke(e) {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t;
}
function qe(e) {
	return `var(--${e}-color)`;
}
function G(e) {
	return /^[a-z-]+$/.test(e) ? qe(e) : e;
}
function Je(e) {
	return qe(We[Ke(e) % We.length] ?? "blue");
}
function Ye(e, t) {
	return e.color ? /^[a-z-]+$/.test(e.color) ? qe(e.color) : e.color : t ? V[t] : Je(e.key);
}
function Xe(e, t, n, r) {
	let i = Ue[t];
	if (i) return L(e, i);
	let a = n.attributes.friendly_name;
	return typeof a == "string" && a.trim() !== "" && (r && a.startsWith(`${r} `) ? a.slice(r.length + 1) : a).trim() || W(t);
}
function Ze(e, t) {
	if (t === "success") return "success";
	if (t === "failure" || t === "error") return "failure";
	if (t === "pending" || t === "queued") return "pending";
	if (e.startsWith("has_") && t === "on") return "failure";
	let n = z(t);
	if (n !== null) {
		if (/(overdue|critical|failing|stale)/.test(e)) return n > 0 ? "failure" : void 0;
		if (/(_vs_|trend)/.test(e)) {
			if (n > 1) return "success";
			if (n < -1) return "failure";
		}
	}
}
function Qe(e) {
	if (typeof e == "number") return Math.abs(e) >= 1e3 ? He(String(e)) : String(e);
	if (typeof e == "string") return e.trim() === "" ? void 0 : e;
	if (typeof e == "boolean") return e ? "✓" : "–";
	if (Array.isArray(e)) return String(e.length);
}
function $e(e, t) {
	let n = t.attributes.unit_of_measurement, r = typeof n == "string" && n !== "" ? n : void 0, i = z(t.state);
	return i === null ? { value: e.formatEntityState?.(t) ?? t.state } : r ? {
		value: String(i),
		unit: r
	} : { value: Math.abs(i) >= 1e3 ? He(t.state) : String(i) };
}
function K(e, t, n, r) {
	return n.flatMap((n) => {
		let i = t[n.key];
		if (!i || Ve(i.state)) return [];
		let a, o;
		if (n.attribute) {
			let e = i.attributes[n.attribute], t = Qe(e);
			if (t === void 0) return [];
			a = { value: t }, o = typeof e == "number" ? e : t;
		} else a = $e(e, i), o = z(i.state) ?? i.state;
		let s = n.attribute ? void 0 : Ze(n.key, i.state), c = n.name ?? (n.attribute ? `${Xe(e, n.key, i, r)} › ${W(n.attribute)}` : Xe(e, n.key, i, r)), l = n.trend ? t[n.trend]?.state : void 0, u = {
			id: U(n),
			label: c,
			...a,
			raw: o,
			color: Ye(n, s),
			stateObj: i
		};
		return n.icon && (u.icon = n.icon), n.attribute && (u.attribute = n.attribute), s && (u.tone = s), l !== void 0 && (u.trend = ze(z(l))), [u];
	});
}
function et(e) {
	for (let t of [
		"failure",
		"pending",
		"success"
	]) if (e.some((e) => e.tone === t)) return V[t];
}
function q(e, t) {
	let n = e.devices[t]?.name ?? void 0, r = [], i = /* @__PURE__ */ new Set();
	for (let a of Object.values(e.entities)) {
		if (a.device_id !== t) continue;
		let o = e.states[a.entity_id];
		if (!o) continue;
		let s = a.translation_key || a.entity_id;
		if (i.has(s)) continue;
		i.add(s);
		let c = Xe(e, s, o, n);
		r.push({
			value: s,
			label: c
		});
		for (let [e, t] of Object.entries(o.attributes)) Ge.has(e) || Qe(t) === void 0 || Array.isArray(t) || r.push({
			value: `${s}:${e}`,
			label: `${c} › ${W(e)}`
		});
	}
	return r.sort((e, t) => {
		let n = e.value.split(":")[0] ?? "", r = t.value.split(":")[0] ?? "";
		return n === r ? e.value.localeCompare(t.value) : n.localeCompare(r);
	});
}
// src/core/parts/header.ts
var tt = o`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .header--badge-only {
    justify-content: flex-end;
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
    font-size: ${P};
    color: var(--secondary-text-color);
    background: var(--secondary-background-color);
  }
  .badge--colored {
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .name {
    font-size: ${Ae};
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
`, nt = /^(done|fixed|verified|resolved|closed|complete|completed|erledigt|behoben|geschlossen|gelöst)/i, rt = /(progress|review|testing|test|doing|implement|bearbeitung|prüf)/i, it = /(blocked|won'?t|rejected|duplicate|obsolete|blockiert|abgelehnt)/i, at = /^(open|submitted|new|to ?do|backlog|offen|neu)/i, ot = /(show-?stopper|blocker|critical|kritisch)/i, st = /(major|high|hoch|wichtig)/i, ct = /(minor|low|trivial|niedrig|gering)/i;
function lt(e, t) {
	if (!t) return;
	let n = e.trim().toLowerCase(), r = Object.keys(t).find((e) => e.trim().toLowerCase() === n), i = r ? t[r] : void 0;
	return i ? G(i) : void 0;
}
function ut(e, t) {
	return lt(e, t) || (nt.test(e) ? V.success : it.test(e) ? V.failure : rt.test(e) ? V.pending : at.test(e) ? G("blue") : Je(e));
}
function dt(e, t) {
	return lt(e, t) || (ot.test(e) ? V.failure : st.test(e) ? V.pending : ct.test(e) ? "var(--disabled-text-color)" : "var(--divider-color)");
}
// src/core/status.ts
var ft = [
	"=",
	"!=",
	">",
	">=",
	"<",
	"<=",
	"contains"
], pt = [
	"success",
	"pending",
	"failure",
	"none"
], mt = /* @__PURE__ */ new Set([
	"success",
	"pending",
	"failure"
]);
function ht(e) {
	let t = e.trim();
	if (t === "" || t.toLowerCase() === "none" || /[;{}"<>]/.test(t)) return {};
	let n = t.toLowerCase();
	if (mt.has(n)) {
		let e = n;
		return {
			tone: e,
			color: V[e]
		};
	}
	return { color: G(t) };
}
function gt(e, t) {
	let n = H(t), r = e[n.key];
	if (r && !Ve(r.state)) return n.attribute ? r.attributes[n.attribute] : r.state;
}
function _t(e, t, n) {
	if (e == null) return !1;
	let r = String(e).toLowerCase(), i = String(n ?? "").toLowerCase();
	if (t === "contains") return r.includes(i);
	let a = z(String(e)), o = z(String(n));
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
function vt(e, t) {
	for (let n of e) if (_t(gt(t, n.field), n.operator ?? "=", n.value)) return ht(n.state);
	return {};
}
// src/core/editor.ts
function yt(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = e[r + 1];
		a && t.some(([e, t]) => i.name === e && a.name === t) ? (n.push({
			name: "",
			type: "grid",
			schema: [i, a]
		}), r++) : n.push(i);
	}
	return n;
}
function bt(e, t, n, r) {
	return {
		name: r,
		selector: { select: {
			mode: "dropdown",
			options: n.map((n) => ({
				value: n,
				label: e ? L(e, `${t}_${n}`) : n
			}))
		} }
	};
}
function xt(e, t, n = "layout") {
	return bt(e, "layout", t, n);
}
function St(e, t, n = "fields", r = !1) {
	let i = (t) => e ? I(e, t) : t, a = [
		"left",
		"center",
		"right"
	].map((t) => ({
		value: t,
		label: e ? L(e, `align_${t}`) : t
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
function Ct(e, t, n = "fields") {
	return St(e, e && t ? q(e, t) : [], n);
}
function wt(e, t) {
	if (!e) return {
		hasDevicePage: !1,
		attributeUrls: []
	};
	let n = t.some((t) => B(e.devices[t]?.configuration_url)), r = /* @__PURE__ */ new Map();
	for (let n of t) for (let t of q(e, n)) {
		let [i, a] = t.value.split(":");
		i && a && !r.has(t.value) && Object.values(e.entities).some((t) => {
			if (t.device_id !== n || (t.translation_key || t.entity_id) !== i) return !1;
			let r = e.states[t.entity_id]?.attributes[a];
			return typeof r == "string" && B(r);
		}) && r.set(t.value, t);
	}
	return {
		hasDevicePage: n,
		attributeUrls: [...r.values()]
	};
}
function Tt(e, t) {
	let n = (t) => e ? I(e, t) : t;
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
function Et(e, t, n) {
	let r = (t) => e ? L(e, t) : t;
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
function Dt(e, t) {
	let n = (t) => e ? I(e, t) : t, r = pt.map((t) => ({
		value: t,
		label: e ? L(e, `state_${t}`) : t
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
						options: ft.map((e) => ({
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
function J(e) {
	if (typeof e == "string") return { key: e };
	let { attribute: t, ...n } = e;
	return t ? {
		...n,
		key: `${e.key}:${t}`
	} : { ...n };
}
function Ot(e, t) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let n = Object.fromEntries(Object.entries(e).filter(([, e]) => e != null && e !== ""));
		return typeof n[t] == "string" ? [n] : [];
	}) : [];
}
var kt = class extends N {
	constructor(...e) {
		super(...e), this.fieldListNames = [], this.ruleListNames = [], this.linkNames = [], this.noneNames = [], this.pairs = [], this.onByDefaultNames = [], this.singleFieldNames = [], this.labelNames = {}, this.computeLabel = (e) => this.hass ? I(this.hass, this.labelNames[e.name] ?? e.name) : e.name;
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
			if (Array.isArray(n) && n.length > 0) e[t] = n.map(J);
			else {
				let n = this.defaultFields?.(t);
				n?.length && (e[t] = n.map(J));
			}
		}
		for (let t of this.singleFieldNames) {
			let n = e[t];
			(typeof n == "string" || typeof n == "object" && n) && (e[t] = J(n));
		}
		for (let t of this.linkNames) e[t] === !0 ? e[t] = "device" : (e[t] === void 0 || e[t] === !1) && (e[t] = "none");
		for (let t of this.noneNames) e[t] ??= "none";
		for (let t of this.onByDefaultNames) e[t] ??= !0;
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
			let r = Ot(n[e], "key"), i = !Array.isArray(t[e]) || t[e].length === 0 ? (this.defaultFields?.(e) ?? []).map(J) : [], a = i.length > 0 && JSON.stringify(r) === JSON.stringify(i);
			r.length > 0 && !a ? n[e] = r : delete n[e];
		}
		for (let e of this.singleFieldNames) {
			if (!(e in n)) continue;
			let [t] = Ot([n[e]], "key");
			t ? n[e] = t : delete n[e];
		}
		for (let e of this.linkNames) (n[e] === "none" || n[e] === !1) && delete n[e];
		for (let e of this.noneNames) n[e] === "none" && delete n[e];
		for (let e of this.ruleListNames) {
			if (!(e in n)) continue;
			let t = Ot(n[e], "field");
			t.length > 0 ? n[e] = t : delete n[e];
		}
		this.finalizeConfig(n), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: n },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return !this.hass || !this.config ? D : T`<ha-form
      .hass=${this.hass}
      .data=${this.formData()}
      .schema=${yt(this.schema(), this.pairs)}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
	}
}, At = class extends kt {
	constructor(...e) {
		super(...e), this.singleFieldNames = ["badge"], this.onByDefaultNames = ["show_title", "expandable"];
	}
	querySensors() {
		let { hass: e } = this;
		return e ? Object.values(e.entities).filter((t) => t.platform === "youtrack" && Array.isArray(e.states[t.entity_id]?.attributes.issues)).map((e) => e.entity_id) : [];
	}
	badgeOptions() {
		let { hass: e, config: t } = this, n = [{
			value: "count",
			label: e ? L(e, "badge_count") : "count"
		}], r = t?.entity ? e?.states[t.entity]?.attributes : void 0;
		for (let [e, t] of Object.entries(r ?? {})) e !== "friendly_name" && e !== "issues" && typeof t == "string" && t.trim() !== "" && n.push({
			value: e,
			label: e.charAt(0).toUpperCase() + e.slice(1)
		});
		return n;
	}
	schema() {
		return [
			{
				name: "entity",
				required: !0,
				selector: { entity: {
					domain: "sensor",
					include_entities: this.querySensors()
				} }
			},
			{
				name: "show_title",
				selector: { boolean: {} }
			},
			...this.config?.show_title === !1 ? [] : [{
				name: "name",
				selector: { text: {} }
			}],
			Tt(this.hass, this.badgeOptions()),
			{
				name: "max_items",
				selector: { number: {
					min: 1,
					max: 50,
					mode: "box"
				} }
			},
			{
				name: "expandable",
				selector: { boolean: {} }
			}
		];
	}
}, jt = "hoc-youtrack-issues-card", Mt = 5;
function Y(e) {
	return typeof e == "string" ? e : "";
}
function Nt(e) {
	return typeof e == "string" && /^https?:\/\//i.test(e) ? e : void 0;
}
function Pt(e) {
	let t = e.issues;
	return Array.isArray(t) ? t.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let t = e;
		return typeof t.id == "string" ? [{
			id: t.id,
			summary: Y(t.summary),
			state: Y(t.state),
			priority: Y(t.priority),
			assignee: Y(t.assignee),
			url: Nt(t.url)
		}] : [];
	}) : [];
}
function Ft(e, t, n) {
	let r = e.entities[t]?.device_id, i = r ? e.devices[r] : void 0, a = i?.name_by_user ?? i?.name ?? "", o = Y(n.attributes.friendly_name).trim(), s = a && o.startsWith(`${a} `) ? o.slice(a.length + 1) : o;
	return a && s && s !== a ? `${a} · ${s}` : a || s || t;
}
function It(e, t) {
	let n = e.find((e) => e.url)?.url;
	if (n && typeof t == "string" && t.trim() !== "") try {
		return `${new URL(n).origin}/issues?q=${encodeURIComponent(t)}`;
	} catch {
		return;
	}
}
var Lt = {
	tag: jt,
	ctor: class extends R {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.properties = {
				...R.properties,
				showAll: { state: !0 },
				openIssues: { state: !0 }
			};
		}
		constructor() {
			super(), this.showAll = !1, this.openIssues = /* @__PURE__ */ new Set();
		}
		static {
			this.styles = [
				...R.styles,
				tt,
				o`
      .issues {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
      }
      .issue {
        --p: var(--divider-color);
        border-left: 3px solid var(--p);
        border-radius: 2px;
        padding-left: 10px;
      }
      .issue + .issue {
        margin-top: 2px;
      }
      .issue__row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .issue__id {
        flex: none;
        font-size: ${P};
        font-weight: 500;
        color: var(--secondary-text-color);
        text-decoration: none;
      }
      a.issue__id:hover {
        color: var(--primary-color);
        text-decoration: underline;
      }
      button {
        font: inherit;
        color: inherit;
        background: none;
        border: 0;
        cursor: pointer;
        text-align: left;
      }
      .issue__toggle {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        padding: 6px 4px;
        border-radius: 6px;
        color: var(--primary-text-color);
      }
      .issue__toggle:hover,
      .more:hover {
        background: var(--secondary-background-color);
      }
      .issue__toggle:focus-visible,
      .more:focus-visible {
        outline: 2px solid var(--primary-color);
      }
      .issue__summary {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .issue__chevron {
        flex: none;
        font-size: ${P};
        color: var(--secondary-text-color);
        transition: transform 0.15s;
      }
      .issue--open .issue__chevron {
        transform: rotate(90deg);
      }
      .badge {
        font-size: ${P};
        white-space: nowrap;
      }
      .detail {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 2px 4px 10px;
      }
      .detail__summary {
        color: var(--primary-text-color);
        overflow-wrap: anywhere;
      }
      .detail__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        font-size: ${P};
        color: var(--secondary-text-color);
      }
      .detail__meta a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .detail__meta a:hover {
        text-decoration: underline;
      }
      .assignee {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 16px;
      }
      .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 4px 12px;
        margin-top: 6px;
        font-size: ${P};
        color: var(--secondary-text-color);
      }
      .more {
        padding: 4px 8px;
        margin-left: -8px;
        border-radius: 6px;
        color: var(--primary-color);
      }
      .more--static {
        padding: 4px 0;
        margin-left: 0;
        color: var(--secondary-text-color);
        cursor: default;
      }
      .footer a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    `
			];
		}
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.platform === "youtrack" && Array.isArray(e.states[t.entity_id]?.attributes.issues));
			return t ? { entity: t.entity_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${jt}-editor`);
		}
		toggleIssue(e) {
			let t = new Set(this.openIssues);
			t.delete(e) || t.add(e), this.openIssues = t;
		}
		badge(e) {
			let t = this.config?.badge;
			if (!t) return D;
			let { key: n, color: r } = typeof t == "string" ? {
				key: t,
				color: void 0
			} : t, i = n === "count" ? e.state : e.attributes[n], a = typeof i == "string" || typeof i == "number" ? String(i).trim() : "";
			if (a === "" || a === "unknown" || a === "unavailable") return D;
			let o = r ? G(r) : void 0;
			return T`<span class="badge ${o ? "badge--colored" : ""}" style=${o ? `--c: ${o}` : ""}
      >${a}</span
    >`;
		}
		renderIssue(e) {
			let { hass: t, config: n } = this, r = n?.colors, i = this.openIssues.has(e.id), a = e.state ? T`<span class="badge badge--colored" style="--c: ${ut(e.state, r)}"
          >${e.state}</span
        >` : D, o = e.url ? T`<a class="issue__id" href=${e.url} target="_blank" rel="noopener noreferrer"
          >${e.id}</a
        >` : T`<span class="issue__id">${e.id}</span>`;
			return T`<div
      class="issue ${i ? "issue--open" : ""}"
      style="--p: ${e.priority ? dt(e.priority, r) : "var(--divider-color)"}"
    >
      <div class="issue__row">
        ${o}
        <button
          class="issue__toggle"
          aria-expanded=${i ? "true" : "false"}
          @click=${() => this.toggleIssue(e.id)}
        >
          <span class="issue__summary">${e.summary}</span>
          ${a}
          <span class="issue__chevron" aria-hidden="true">▸</span>
        </button>
      </div>
      ${i ? T`<div class="detail">
              <div class="detail__summary">${e.summary}</div>
              <div class="detail__meta">
                ${e.priority ? T`<span
                        class="badge badge--colored"
                        style="--c: ${dt(e.priority, r) === "var(--divider-color)" ? "var(--secondary-text-color)" : dt(e.priority, r)}"
                        >${t ? L(t, "priority") : "Priority"}: ${e.priority}</span
                      >` : D}
                ${e.assignee ? T`<span class="assignee"
                        ><ha-icon icon="mdi:account-outline"></ha-icon>${e.assignee}</span
                      >` : D}
                ${e.url ? T`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                        >${t ? L(t, "open_issue") : "Open issue"} ↗</a
                      >` : D}
              </div>
            </div>` : D}
    </div>`;
		}
		renderFooter(e, t, n, r) {
			let { hass: i, config: a } = this;
			if (!i || !a) return D;
			let o = a.expandable !== !1 && e.length > n, s = Math.max(0, t - e.length), c = this.showAll ? s : Math.max(0, t - n);
			if (c === 0 && !(o && this.showAll)) return D;
			let l = L(i, "more"), u = s > 0 ? It(e, r) : void 0, d = this.showAll ? L(i, "show_less") : `+${c} ${l}`;
			return T`<div class="footer">
      ${o ? T`<button
              class="more"
              aria-expanded=${this.showAll ? "true" : "false"}
              @click=${() => {
				this.showAll = !this.showAll;
			}}
            >
              ${d}
            </button>` : T`<span class="more more--static">+${c} ${l}</span>`}
      ${this.showAll && s > 0 && o ? T`<span>+${s} ${l}</span>` : D}
      ${u ? T`<a href=${u} target="_blank" rel="noopener noreferrer"
              >${L(i, "open_in_youtrack")} ↗</a
            >` : D}
    </div>`;
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return T``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			if (!Array.isArray(n.attributes.issues)) return this.renderMessage("no_issue_list");
			let r = Pt(n.attributes), i = t.max_items ?? Mt, a = Math.max(z(n.state) ?? 0, r.length), o = this.showAll ? r : r.slice(0, i), s = t.name?.trim() || Ft(e, t.entity, n), c = this.badge(n);
			return T`<ha-card>
      ${t.show_title === !1 ? c === D ? D : T`<div class="header header--badge-only">${c}</div>` : T`<div class="header">
              <div class="title"><span class="name">${s}</span></div>
              ${c}
            </div>`}
      ${o.length === 0 ? T`<div class="message">${L(e, "no_issues")}</div>` : T`<div class="issues">${o.map((e) => this.renderIssue(e))}</div>`}
      ${this.renderFooter(r, a, i, n.attributes.query)}
    </ha-card>`;
		}
	},
	editorTag: `${jt}-editor`,
	editorCtor: At,
	name: "YouTrack issues",
	description: "The issues of a YouTrack query sensor, with coloured states and priorities."
};
// src/core/parts/field-tile.ts
function Rt(e, t) {
	return t.icon ? T`<ha-icon icon=${t.icon}></ha-icon>` : t.attribute ? T`<ha-icon icon="mdi:information-outline"></ha-icon>` : T`<ha-state-icon .hass=${e} .stateObj=${t.stateObj}></ha-state-icon>`;
}
function zt(e, t, n = "tile") {
	let r = T`<span class="field__value"
      >${t.value}${t.unit ? T` <span class="field__unit">${t.unit}</span>` : D}</span
    >${t.trend ? Pe(t.trend) : D}`;
	return T`<div
    class="field field--${n} ${t.tone ? "field--tone" : ""}"
    style="--c: ${t.color}"
    title=${t.label}
  >
    <span class="chip">${Rt(e, t)}</span>
    ${n === "inline" ? T`<span class="field__text">${r}</span>` : T`<span class="field__text">
            <span class="field__main">${r}</span>
            <span class="field__label">${t.label}</span>
          </span>`}
  </div>`;
}
var Bt = o`
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
    font-size: ${Ae};
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
  }
  .field--tone .field__value {
    color: var(--c);
  }
  .field__unit {
    font-size: ${P};
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .field__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${P};
    font-weight: 400;
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
  .field--row .field__label {
    font-size: ${Ae};
  }
`;
// src/core/link.ts
function Vt(e, t, n, r) {
	for (let i of [e, t]) {
		let e = Ht(i, n, r);
		if (e) return e;
	}
}
function Ht(e, t, n) {
	if (e === !0 || e === "device") {
		let e = t?.configuration_url;
		return B(e) ? e : void 0;
	}
	if (typeof e != "string") return;
	let r = e.trim();
	if (r.startsWith("https://")) return B(r) ? r : void 0;
	let i = H(r);
	if (!i.attribute) return;
	let a = n[i.key]?.attributes[i.attribute];
	return typeof a == "string" && B(a) ? a : void 0;
}
// src/core/resolver.ts
function X(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || n !== void 0 && i.platform !== n) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key || i.entity_id] = a);
	}
	return r;
}
function Ut(e, t) {
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
function Wt(e) {
	return e === "compact" || e === "list" ? e : "standard";
}
function Gt(e) {
	if (e !== void 0 && !(Array.isArray(e) && e.every((e) => typeof e == "string" || typeof e == "object" && !!e && typeof e.key == "string"))) throw Error("`fields` must be a list of sensor keys or objects with a `key`");
}
var Kt = class extends R {
	static {
		this.styles = [
			...R.styles,
			Bt,
			tt,
			o`
      ha-card {
        /* Keep the theme's card shadow; the inset line is the status edge. */
        box-shadow:
          var(--ha-card-box-shadow, 0 0 0 0 transparent),
          inset 0 3px 0 var(--hoc-accent, transparent);
        overflow: hidden;
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
		return t?.length ? vt(t, e) : void 0;
	}
	get dotKey() {}
	get statusKeys() {
		return this.dotKey ? [this.dotKey] : [];
	}
	deviceId() {
		return this.config?.device;
	}
	setConfig(e) {
		Gt(e.fields), super.setConfig(e);
	}
	renderBadge(e, t) {
		let { hass: n, config: r } = this;
		if (!n || !r?.badge) return D;
		let i = H(r.badge), [a] = K(n, e, [i], t);
		if (!a) return D;
		let o = i.color ? G(i.color) : a.tone ? a.color : void 0;
		return T`<span
      class="badge ${o ? "badge--colored" : ""}"
      style=${o ? `--c: ${o}` : ""}
      title=${a.label}
      >${a.value}${a.unit ? ` ${a.unit}` : ""}</span
    >`;
	}
	renderFields(e, t) {
		let { hass: n } = this;
		return !n || e.length === 0 ? D : t === "compact" ? T`<div class="inline-fields">
        ${e.map((e) => zt(n, e, "inline"))}
      </div>` : t === "list" ? T`<div class="rows">${e.map((e) => zt(n, e, "row"))}</div>` : T`<div class="grid">${e.map((e) => zt(n, e, "tile"))}</div>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return T``;
		let n = this.deviceId(), r = n ? e.devices[n] : void 0;
		if (!n || !r) return this.renderMessage("device_not_found", !0);
		let i = r.name_by_user ?? r.name ?? n, a = t.name?.trim() || i, o = t.show_status !== !1, s = X(e, n, this.platform), c = Wt(t.layout), l = K(e, s, (t.fields?.length ? t.fields : this.defaultFields(c, s)).map(H), i), u = K(e, s, this.statusKeys.map((e) => ({ key: e })), i), d = o ? this.customStatus(s) : void 0, ee = d ? d.color : o ? et(u) : void 0, te = d ? d.tone === "failure" : u.some((e) => e.tone === "failure"), f = Vt(t.link, t.link_url, r, s), p = this.dotKey ? s[this.dotKey]?.state : void 0, ne = o ? d ? Ne(d.color) : p === void 0 ? D : Me(p) : D, m = this.renderBadge(s, i);
		return T`<ha-card
      class=${te ? "alert" : ""}
      style=${ee ? `--hoc-accent: ${ee}` : ""}
    >
      ${t.show_title === !1 ? m === D ? D : T`<div class="header header--badge-only">${m}</div>` : T`<div class="header">
              <div class="title">
                ${ne}
                <span class="name"
                  >${f ? T`<a href=${f} target="_blank" rel="noopener noreferrer"
                          >${a}</a
                        >` : a}</span
                >
              </div>
              ${m}
            </div>`}
      ${this.renderFields(l, c)}
    </ha-card>`;
	}
}, qt = "github_pulse", Jt = "youtrack", Yt = [
	"stars",
	"forks",
	"open_issues",
	"open_pull_requests",
	{
		key: "commits_this_month",
		trend: "commits_vs_last_month"
	},
	"latest_release"
], Xt = [
	{
		key: "contributions_this_month",
		trend: "commits_vs_last_month"
	},
	"current_streak",
	"longest_streak",
	"top_language"
], Zt = [
	"issues_open",
	"issues_overdue",
	"issues_critical_open",
	"issues_created_7d",
	"issues_resolved_7d"
], Z = {
	[qt]: {
		platform: qt,
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
			standard: Yt,
			list: Yt
		},
		variant: {
			marker: "contributions_this_month",
			layouts: {
				compact: ["contributions_this_month", "current_streak"],
				standard: Xt,
				list: Xt
			}
		},
		dotKey: "ci_state"
	},
	[Jt]: {
		platform: Jt,
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
			compact: Zt,
			standard: Zt,
			list: Zt
		},
		statusKeys: ["has_overdue", "has_critical_open"]
	}
};
function Q(e, t) {
	for (let n of Object.values(e.entities)) {
		if (n.device_id !== t) continue;
		let e = Z[n.platform];
		if (e) return e;
	}
}
var Qt = 6;
function $t(e, t, n) {
	if (!e) return Object.keys(n).slice(0, Qt);
	let r = e.variant;
	return (r && r.marker in n ? r.layouts : e.layouts)[t];
}
function en(e, t, n) {
	let r = n.variant?.marker;
	return r ? Object.values(e.entities).some((e) => e.device_id === t && e.platform === n.platform && e.translation_key === r) : !1;
}
function $(e, t, n) {
	let r = (t) => {
		let n = e.devices[t];
		return n?.name_by_user ?? n?.name ?? t;
	};
	if (Array.isArray(t) && t.length > 0) return [...new Set(t)].filter((t) => t in e.devices).map((e) => ({
		id: e,
		name: r(e)
	}));
	if (!n) return [];
	let i = Z[n];
	return Ut(e, n).filter((t) => !i || !en(e, t.id, i));
}
function tn(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.values(e.entities)) n.device_id && e.devices[n.device_id] && t.add(n.platform);
	return [...t].map((e) => ({
		value: e,
		label: Z[e]?.label ?? e
	})).sort((e, t) => e.label.localeCompare(t.label));
}
// src/cards/generic/device/editor.ts
var nn = class extends kt {
	constructor(...e) {
		super(...e), this.fieldListNames = ["fields"], this.singleFieldNames = ["badge"], this.ruleListNames = ["status"], this.linkNames = ["link"], this.onByDefaultNames = ["show_title", "show_status"];
	}
	defaultFields(e) {
		let { hass: t, config: n } = this, r = n?.device;
		if (e !== "fields" || !t || !r) return;
		let i = Q(t, r), a = X(t, r, i?.platform);
		return $t(i, Wt(n.layout), a).filter((e) => H(e).key in a);
	}
	finalizeConfig(e) {
		e.link && delete e.link_url;
	}
	schema() {
		let e = this.config?.device, t = this.hass, n = t && e ? q(t, e) : [], r = this.config?.show_title !== !1, { hasDevicePage: i, attributeUrls: a } = wt(t, e ? [e] : []);
		return [
			{
				name: "device",
				required: !0,
				selector: { device: {} }
			},
			xt(t, [
				"compact",
				"standard",
				"list"
			]),
			{
				name: "show_title",
				selector: { boolean: {} }
			},
			...r ? [{
				name: "name",
				selector: { text: {} }
			}] : [],
			Tt(t, n),
			...r ? [Et(t, i, a)] : [],
			...r && !this.config?.link ? [{
				name: "link_url",
				selector: { text: { type: "url" } }
			}] : [],
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...this.config?.show_status === !1 ? [] : [Dt(t, n)],
			Ct(t, e)
		];
	}
}, rn = "hoc-device-card", an = {
	tag: rn,
	ctor: class extends Kt {
		static {
			this.requiredKeys = ["device"];
		}
		preset() {
			let e = this.config?.device;
			return this.hass && e ? Q(this.hass, e) : void 0;
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
			return $t(this.preset(), e, t);
		}
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.device_id && e.states[t.entity_id]);
			return t?.device_id ? { device: t.device_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${rn}-editor`);
		}
	},
	editorTag: `${rn}-editor`,
	editorCtor: nn,
	name: "Device",
	description: "Any device: choose which sensors and attributes to show, in colour. GitHub Pulse and YouTrack devices come with defaults."
}, on = class extends kt {
	constructor(...e) {
		super(...e), this.fieldListNames = ["columns"], this.ruleListNames = ["status"], this.linkNames = ["link"], this.pairs = [
			["name", "device_title"],
			["sort_by", "sort_order"],
			["link", "shorten_names"]
		], this.labelNames = { name: "title" }, this.noneNames = ["platform"];
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
		return !e || !t ? [] : $(e, t.devices, t.platform).map((e) => e.id);
	}
	columnOptions(e) {
		let { hass: t } = this;
		if (!t) return [];
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of q(t, r)) n.set(e.value, e);
		return [...n.values()];
	}
	schema() {
		let { hass: e, config: t } = this, n = this.deviceIds(), r = this.columnOptions(n), { hasDevicePage: i, attributeUrls: a } = wt(e, n), o = !!e && $(e, t?.devices, t?.platform).some((e) => e.name.includes("/")), s = e ? tn(e) : [], c = [{
			value: "none",
			label: e ? L(e, "platform_none") : "none"
		}, ...s];
		return [
			{
				name: "name",
				selector: { text: {} }
			},
			{
				name: "device_title",
				selector: { text: {} }
			},
			bt(e, "titles", [
				"text",
				"icon",
				"icon_text"
			], "column_titles"),
			{
				name: "platform",
				selector: { select: {
					mode: "dropdown",
					options: c
				} }
			},
			{
				name: "devices",
				selector: { device: {
					multiple: !0,
					...t?.platform ? { integration: t.platform } : {}
				} }
			},
			St(e, r, "columns", !0),
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					custom_value: !0,
					options: [{
						value: "name",
						label: e ? I(e, "name") : "Name"
					}, ...r]
				} }
			},
			bt(e, "order", ["asc", "desc"], "sort_order"),
			Et(e, i, a),
			...o || t?.shorten_names ? [{
				name: "shorten_names",
				selector: { boolean: {} }
			}] : [],
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...t?.show_status ? [Dt(e, r)] : [],
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
}, sn = "hoc-devices-card", cn = 4;
function ln(e, t) {
	if (e.align) return e.align;
	if (e.key === "ci_state" && !e.attribute) return "left";
	let n = t.flatMap((t) => t.views.get(U(e)) ?? []);
	return n.length > 0 && n.every((e) => typeof e.raw == "number") ? "right" : "left";
}
function un(e, t) {
	return t === "name" ? e.name : e.views.get(t)?.raw ?? null;
}
function dn(e, t, n, r) {
	let i = un(e, n), a = un(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o;
	return o = typeof i == "number" && typeof a == "number" ? i - a : typeof i == "number" ? -1 : typeof a == "number" ? 1 : i.localeCompare(a), o === 0 ? e.name.localeCompare(t.name) : o * r;
}
// src/registry.ts
var fn = [
	{
		tag: sn,
		ctor: class extends R {
			static {
				this.styles = [
					...R.styles,
					tt,
					o`
      ha-card {
        overflow: hidden;
      }
      .header {
        margin-bottom: 4px;
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
        font-size: ${P};
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
      td.name {
        font-weight: 500;
        color: var(--secondary-text-color);
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
        font-size: ${P};
        font-weight: 400;
        color: var(--secondary-text-color);
      }
    `
				];
			}
			static getConfigElement() {
				return document.createElement(`${sn}-editor`);
			}
			static getStubConfig(e) {
				let t = Object.keys(Z).find((t) => Object.values(e.entities).some((e) => e.platform === t && e.device_id)) ?? tn(e)[0]?.value;
				return t ? { platform: t } : {};
			}
			rows(e) {
				let { hass: t, config: n } = this;
				return !t || !n ? [] : $(t, n.devices, n.platform).map((r) => {
					let i = Q(t, r.id), a = X(t, r.id, i?.platform), o = K(t, a, e, r.name), s = vt(n.status?.length ? n.status : i?.rowStatus ?? [], a);
					return {
						id: r.id,
						url: Vt(n.link, void 0, t.devices[r.id], a),
						statusColor: s.color,
						name: n.shorten_names === !0 ? r.name.split("/").pop() ?? r.name : r.name,
						views: new Map(o.map((e) => [e.id, e]))
					};
				});
			}
			columnSpecs() {
				let { hass: e, config: t } = this;
				if (!e || !t) return [];
				if (t.columns?.length) return t.columns.map(H);
				let n = $(e, t.devices, t.platform)[0], r = (t.platform ? Z[t.platform] : void 0) ?? (n ? Q(e, n.id) : void 0);
				return r ? r.columns.map(H) : n ? Object.keys(X(e, n.id)).slice(0, cn).map((e) => ({ key: e })) : [];
			}
			renderCell(e, t, n) {
				let r = `text-align: ${n}`;
				return e ? t.key === "ci_state" && !t.attribute ? T`<td style=${r}>${Me(e.stateObj.state)}</td>` : T`<td style=${r}>
      <span class="cell ${e.tone || t.color ? "cell--tone" : ""}" style="--c: ${e.color}"
        >${e.value}${e.unit ? T`<span class="cell__unit">${e.unit}</span>` : D}${e.trend ? Pe(e.trend) : D}</span
      >
    </td>` : T`<td style=${r}>—</td>`;
			}
			renderContent() {
				let { hass: e, config: t } = this;
				if (!e || !t) return T``;
				let n = this.columnSpecs(), r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows(n).sort((e, t) => dn(e, t, r, i));
				if (a.length === 0) return this.renderMessage(t.devices?.length || t.platform ? "no_devices" : "choose_devices");
				let o = t.column_titles ?? "text", s = n.map((e) => ln(e, a)), c = n.map((t) => {
					let n = U(t), r = a.map((e) => e.views.get(n)).find((e) => e !== void 0);
					return {
						text: t.name ?? r?.label ?? W(t.key),
						icon: r ? Rt(e, t.icon ? {
							...r,
							icon: t.icon
						} : r) : D,
						color: t.title_color ? G(t.title_color) : void 0
					};
				}), l = t.name?.trim();
				return T`<ha-card>
      ${l ? T`<div class="header">
              <div class="title"><span class="name">${l}</span></div>
            </div>` : D}
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${t.device_title?.trim() || L(e, "device")}</th>
              ${c.map((e, t) => T`<th
                    title=${e.text}
                    style=${[`text-align: ${s[t] ?? "left"}`, e.color ? `color: ${e.color}` : ""].filter(Boolean).join("; ")}
                  >
                    ${o === "text" ? D : e.icon}${o === "icon" ? D : e.text}
                  </th>`)}
            </tr>
          </thead>
          <tbody>
            ${a.map((e) => T`<tr>
                  <td class="name">
                    <span class="name__content"
                      >${t.show_status ? Ne(e.statusColor) : D}<span
                        class="name__text"
                        >${e.url ? T`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                                >${e.name}</a
                              >` : e.name}</span
                      ></span
                    >
                  </td>
                  ${n.map((t, n) => this.renderCell(e.views.get(U(t)), t, s[n] ?? "left"))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
			}
		},
		editorTag: `${sn}-editor`,
		editorCtor: on,
		name: "Devices",
		description: "Several devices as a sortable table with selectable columns. GitHub Pulse and YouTrack come with defaults."
	},
	Lt,
	an
];
function pn(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function mn(e = fn) {
	window.customCards ??= [];
	for (let t of e) pn(t.tag, t.ctor), t.editorTag && t.editorCtor && pn(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !0
	});
}
// src/index.ts
mn();
export { mn as registerCards };
