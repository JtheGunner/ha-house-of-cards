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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, oe = {
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
}, se = (e, t) => !l(e, t), ce = {
	attribute: !0,
	type: String,
	converter: oe,
	reflect: !1,
	useDefault: !1,
	hasChanged: se
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var m = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ce) {
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
		return this.elementProperties.get(e) ?? ce;
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
			let i = (n.converter?.toAttribute === void 0 ? oe : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? oe : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? se)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[p("elementProperties")] = /* @__PURE__ */ new Map(), m[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: m }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var h = globalThis, le = (e) => e, g = h.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", x = Array.isArray, me = (e) => x(e) || typeof e?.[Symbol.iterator] == "function", S = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${S}(?:([^\\s"'>=/]+)(${S}*=${S}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, T = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), O = v.createTreeWalker(v, 129);
function xe(e, t) {
	if (!x(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var Se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? we : r[1] === "?" ? Te : r[1] === "@" ? Ee : M
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), O.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === fe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += _.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = v.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new De(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, j = class e {
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
		e = A(this, e, t), b(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
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
		x(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = le(e).nextSibling;
			le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, M = class {
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
		if (i === void 0) e = A(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, we = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Te = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, Ee = class extends M {
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
}, De = class {
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
(0, h.litHtmlPolyfillSupport)?.(k, j), (h.litHtmlVersions ??= []).push("3.3.3");
var Oe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(t, this.renderRoot, this.renderOptions);
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
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P }), (0, N.litElementPolyfillSupport)?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
// src/core/format.ts
var ke = 1;
function F(e) {
	return e === null || !Number.isFinite(e) ? {
		direction: "flat",
		percent: null
	} : Math.abs(e) <= ke ? {
		direction: "flat",
		percent: e
	} : {
		direction: e > 0 ? "up" : "down",
		percent: e
	};
}
var Ae = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function I(e) {
	return e === void 0 || Ae.has(e);
}
function L(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function R(e) {
	let t = L(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
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
function z(e) {
	return T`<span class="dot dot--${je(e)}" aria-hidden="true"></span>`;
}
function B(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return T`<span class="trend trend--${e.direction}">${t}${n}</span>`;
}
function V(e, t, n) {
	return T`<div class="tile">
    <div class="tile__value">
      ${t}${n ? T` <span class="tile__unit">${n}</span>` : D}
    </div>
    <div class="tile__label">${e}</div>
  </div>`;
}
function Me(e) {
	return e && !I(e) ? T`<span class="badge">${e}</span>` : D;
}
var Ne = o`
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
`, Pe = {
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
}, Fe = {
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
}, Ie = {
	en: Fe,
	de: Pe
};
function H(e, t) {
	return (Ie[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? Fe)[t];
}
// src/core/base-card.ts
var U = class extends P {
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
		this.styles = [Ne, o`
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
		let n = this.hass ? H(this.hass, e) : e;
		return T`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? D : this.renderContent();
	}
}, Le = "contributions_this_month";
function W(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || i.platform !== n || !i.translation_key) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key] = a);
	}
	return r;
}
function G(e, t) {
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
function K(e, t, n = Le) {
	let r = /* @__PURE__ */ new Set();
	for (let i of Object.values(e.entities)) i.platform === t && i.translation_key === n && i.device_id && r.add(i.device_id);
	return [...r];
}
function Re(e, t, n = Le) {
	return Object.values(e.entities).find((e) => e.platform === t && e.translation_key === n && e.device_id)?.device_id ?? void 0;
}
// src/core/editor.ts
function q(e, t = "device") {
	return {
		name: t,
		selector: { device: { integration: e } }
	};
}
function ze(e, t = "layout") {
	return {
		name: t,
		selector: { select: {
			mode: "dropdown",
			options: e
		} }
	};
}
var J = class extends P {
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
		return !this.hass || !this.config ? D : T`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${this.schema()}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
	}
}, Be = class extends J {
	schema() {
		return [{
			...q("github_pulse"),
			required: !0
		}, ze([
			"compact",
			"standard",
			"detailed"
		])];
	}
}, Ve = {
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
}, He = ["stars"], Ue = [
	...He,
	"forks",
	"open_issues",
	"open_pull_requests",
	"commits_this_month"
], We = {
	compact: He,
	standard: Ue,
	detailed: [
		...Ue,
		"unique_visitors_14d",
		"views_14d",
		"actions_last_result",
		"actions_runs_today",
		"total_downloads",
		"days_since_last_commit",
		"days_since_last_release"
	]
};
function Ge(e, t) {
	let n = e[t]?.state;
	if (n === void 0) return;
	let { label: r, kind: i } = Ve[t];
	if (i === "text" && I(n)) return;
	let a = {
		key: t,
		label: r,
		value: n
	};
	if (i === "count" && (a.value = R(n)), i === "days" && (a.value = R(n), a.unit = "d"), t === "commits_this_month") {
		let t = e.commits_vs_last_month?.state;
		t !== void 0 && (a.trend = F(L(t)));
	}
	return a;
}
function Ke(e, t) {
	return We[t].flatMap((t) => {
		let n = Ge(e, t);
		return n ? [n] : [];
	});
}
// src/cards/github-pulse/repo/card.ts
var Y = "github_pulse", X = "hoc-github-repo-card", qe = {
	tag: X,
	ctor: class extends U {
		static {
			this.requiredKeys = ["device"];
		}
		static {
			this.styles = [...U.styles, o`
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
		static getStubConfig(e) {
			let t = new Set(K(e, Y)), n = G(e, Y).find((e) => !t.has(e.id));
			return n ? { device: n.id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${X}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return T``;
			let n = e.devices[t.device];
			if (!n) return this.renderMessage("device_not_found", !0);
			let r = t.layout ?? "standard", i = W(e, t.device, Y), a = Ke(i, r), o = i.ci_state, s = i.latest_release?.state, c = n.name_by_user ?? n.name ?? t.device;
			if (r === "compact") {
				let e = a.find((e) => e.key === "stars");
				return T`<ha-card>
        <div class="header">
          ${o ? z(o.state) : D}
          <span class="name">${c}</span>
          ${e ? T`<span>★ ${e.value}</span>` : D} ${Me(s)}
        </div>
      </ha-card>`;
			}
			return T`<ha-card>
      <div class="header">
        ${o ? z(o.state) : D}
        <span class="name">${c}</span>
        ${Me(s)}
      </div>
      <div class="grid">
        ${a.map((t) => T`<div>
              ${V(H(e, t.label), t.value, t.unit)}
              ${t.trend ? B(t.trend) : D}
            </div>`)}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${X}-editor`,
	editorCtor: Be,
	name: "GitHub repository",
	description: "One GitHub Pulse repository: CI state, stars, pull requests, commits and more."
}, Je = class extends J {
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
}, Z = "hoc-youtrack-issues-card", Ye = 5;
function Xe(e) {
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
var Ze = {
	tag: Z,
	ctor: class extends U {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.styles = [...U.styles, o`
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
			return document.createElement(`${Z}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return T``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			let r = Xe(n.attributes).slice(0, t.max_items ?? Ye);
			return r.length === 0 ? this.renderMessage("no_issues") : T`<ha-card>
      ${r.map((e) => T`<div class="issue">
            ${e.url ? T`<a
                    class="issue__id"
                    href=${e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${e.id}</a
                  >` : T`<span class="issue__id">${e.id}</span>`}
            <span class="issue__summary">${e.summary}</span>
            <span>${e.state}</span>
          </div>`)}
    </ha-card>`;
		}
	},
	editorTag: `${Z}-editor`,
	editorCtor: Je,
	name: "YouTrack issues",
	description: "The first issues of a YouTrack query sensor."
}, Qe = class extends J {
	schema() {
		return [{
			...q("youtrack"),
			required: !0
		}];
	}
}, $e = "youtrack", Q = "hoc-youtrack-project-card", et = [
	"issues_open",
	"issues_overdue",
	"issues_critical_open",
	"issues_created_7d",
	"issues_resolved_7d"
], tt = {
	tag: Q,
	ctor: class extends U {
		static {
			this.requiredKeys = ["device"];
		}
		static {
			this.styles = [...U.styles, o`
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
		static getStubConfig(e) {
			let t = G(e, $e)[0];
			return t ? { device: t.id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${Q}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return T``;
			let n = e.devices[t.device];
			if (!n) return this.renderMessage("device_not_found", !0);
			let r = W(e, t.device, $e);
			return T`<ha-card class=${r.has_overdue?.state === "on" || r.has_critical_open?.state === "on" ? "alert" : ""}>
      <div class="title">${n.name_by_user ?? n.name ?? t.device}</div>
      <div class="grid">
        ${et.map((t) => {
				let n = r[t]?.state;
				return n === void 0 ? D : V(H(e, t), R(n));
			})}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${Q}-editor`,
	editorCtor: Qe,
	name: "YouTrack project",
	description: "Issue counts of one YouTrack project, with an accent for overdue or critical issues."
}, nt = class extends J {
	schema() {
		return [
			q("github_pulse"),
			{
				name: "repositories",
				selector: { device: {
					integration: "github_pulse",
					multiple: !0
				} }
			},
			{
				name: "show_when_clean",
				selector: { boolean: {} }
			}
		];
	}
}, rt = "hoc-github-attention-card", it = /* @__PURE__ */ new Set(["failure", "error"]);
function at(e, t, n) {
	let r = t ? e.devices[t]?.config_entries : void 0, i = e.devices[n]?.config_entries;
	return !r || !i || r.some((e) => i.includes(e));
}
function ot(e, t) {
	let n = K(e, Y), r = t.device ?? n[0], i = t.repositories === void 0 || t.repositories === "all" || t.repositories.length === 0 ? null : new Set(t.repositories), a = !1, o = G(e, Y).filter((e) => !n.includes(e.id) && e.id !== r).filter((e) => i === null || i.has(e.id)).filter((t) => at(e, r, t.id)).filter((t) => {
		let n = W(e, t.id, Y).ci_state?.state;
		return I(n) || (a = !0), n !== void 0 && it.has(n);
	}).map((e) => e.name), s = r ? W(e, r, Y) : {}, c = L(s.review_requests?.state), l = L(s.stale_pull_requests?.state);
	return {
		failingRepos: o,
		reviewRequests: c ?? 0,
		stalePullRequests: l ?? 0,
		known: a || c !== null || l !== null
	};
}
var st = {
	tag: rt,
	ctor: class extends U {
		static {
			this.styles = [...U.styles, o`
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
			return document.createElement(`${rt}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return D;
			if (t.device && !e.devices[t.device]) return this.renderMessage("device_not_found", !0);
			let n = ot(e, t);
			return n.known ? n.failingRepos.length === 0 && n.reviewRequests === 0 && n.stalePullRequests === 0 ? t.show_when_clean === !1 ? D : this.renderMessage("all_clear") : T`<ha-card>
      ${n.failingRepos.length > 0 ? T`<div class="item">
              ${z("failure")}
              <span class="item__label">${H(e, "failing_ci")}</span>
              <span>${n.failingRepos.join(", ")}</span>
            </div>` : D}
      ${n.reviewRequests > 0 ? T`<div class="item">
              <span class="item__label">${H(e, "review_requests")}</span>
              <span>${n.reviewRequests}</span>
            </div>` : D}
      ${n.stalePullRequests > 0 ? T`<div class="item">
              <span class="item__label">${H(e, "stale_pull_requests")}</span>
              <span>${n.stalePullRequests}</span>
            </div>` : D}
    </ha-card>` : this.renderMessage("unavailable");
		}
	},
	editorTag: `${rt}-editor`,
	editorCtor: nt,
	name: "GitHub attention",
	description: "Only what needs attention: failing CI, review requests, stale pull requests."
}, ct = class extends J {
	schema() {
		return [q("github_pulse")];
	}
}, lt = "hoc-github-profile-card", ut = [
	{
		key: "current_streak",
		label: "current_streak",
		format: R,
		unit: "d"
	},
	{
		key: "longest_streak",
		label: "longest_streak",
		format: R,
		unit: "d"
	},
	{
		key: "top_language",
		label: "top_language",
		format: (e) => e,
		text: !0
	}
], dt = {
	tag: lt,
	ctor: class extends U {
		static {
			this.styles = [...U.styles, o`
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
			return document.createElement(`${lt}-editor`);
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return T``;
			let n = t.device ?? Re(e, "github_pulse"), r = n ? e.devices[n] : void 0;
			if (!n || !r) return this.renderMessage("device_not_found", !0);
			let i = W(e, n, Y), a = i.contributions_this_month?.state, o = i.commits_vs_last_month?.state;
			return T`<ha-card>
      <div class="title">${r.name_by_user ?? r.name ?? n}</div>
      <div class="headline">
        ${a === void 0 ? D : V(H(e, "contributions"), R(a))}
        ${o === void 0 ? D : B(F(L(o)))}
      </div>
      <div class="grid">
        ${ut.map((t) => {
				let n = i[t.key]?.state;
				return n === void 0 || t.text && I(n) ? D : V(H(e, t.label), t.format(n), t.unit);
			})}
      </div>
    </ha-card>`;
		}
	},
	editorTag: `${lt}-editor`,
	editorCtor: ct,
	name: "GitHub profile",
	description: "Your GitHub activity: contributions, trend, streaks and top language."
}, ft = class extends J {
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
					options: [...pt]
				} }
			},
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					options: ["name", ...pt]
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
}, $ = "hoc-github-repos-card", pt = [
	"stars",
	"forks",
	"open_issues",
	"open_pull_requests",
	"commits_this_month",
	"commits_vs_last_month",
	"ci_state",
	"latest_release",
	"days_since_last_commit"
], mt = [
	"ci_state",
	"stars",
	"commits_this_month",
	"latest_release"
], ht = /* @__PURE__ */ new Set(["ci_state", "latest_release"]);
function gt(e, t) {
	if (t === "name") return e.name;
	let n = e.entities[t]?.state;
	return n === void 0 || I(n) ? null : ht.has(t) ? n : L(n);
}
function _t(e, t, n, r) {
	let i = gt(e, n), a = gt(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o = typeof i == "number" && typeof a == "number" ? i - a : String(i).localeCompare(String(a));
	return o === 0 ? e.name.localeCompare(t.name) : o * r;
}
var vt = class extends U {
	static {
		this.styles = [...U.styles, o`
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
		return document.createElement(`${$}-editor`);
	}
	rows() {
		let { hass: e, config: t } = this;
		if (!e || !t) return [];
		let n = new Set(K(e, Y)), r = G(e, Y).filter((e) => !n.has(e.id)), i = t.repositories === void 0 || t.repositories === "all" || t.repositories.length === 0 ? null : new Set(t.repositories);
		return r.filter((e) => i === null || i.has(e.id)).map((t) => ({
			id: t.id,
			name: t.name,
			entities: W(e, t.id, Y)
		}));
	}
	renderCell(e, t) {
		let n = e.entities[t]?.state;
		return n === void 0 || I(n) ? T`<td>—</td>` : t === "ci_state" ? T`<td>${z(n)}</td>` : t === "commits_vs_last_month" ? T`<td>${B(F(L(n)))}</td>` : T`<td>${Ge(e.entities, t)?.value ?? "—"}</td>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return T``;
		let n = t.columns ?? mt, r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows().sort((e, t) => _t(e, t, r, i));
		return a.length === 0 ? this.renderMessage("no_repositories") : T`<ha-card>
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${H(e, "repository")}</th>
              ${n.map((t) => T`<th>${H(e, yt(t))}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${a.map((e) => T`<tr>
                  <td class="name">${e.name}</td>
                  ${n.map((t) => this.renderCell(e, t))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
	}
};
function yt(e) {
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
var bt = [
	qe,
	{
		tag: $,
		ctor: vt,
		editorTag: `${$}-editor`,
		editorCtor: ft,
		name: "GitHub repositories",
		description: "Several GitHub Pulse repositories as a sortable table."
	},
	dt,
	st,
	tt,
	Ze
];
function xt(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function St(e = bt) {
	window.customCards ??= [];
	for (let t of e) xt(t.tag, t.ctor), t.editorTag && t.editorCtor && xt(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !1
	});
}
// src/index.ts
St();
export { St as registerCards };
