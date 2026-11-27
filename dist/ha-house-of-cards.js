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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, p = re ? re.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, ae = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? p : null;
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
	converter: ae,
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
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? ae : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ae : e.converter;
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
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[m("elementProperties")] = /* @__PURE__ */ new Map(), h[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var ce = globalThis, le = (e) => e, g = ce.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", ge = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _e = /-->/g, ve = />/g, S = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, be = /"/g, xe = /^(?:script|style|textarea|title)$/i, C = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), E = v.createTreeWalker(v, 129);
function Ce(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = _e : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (xe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ve : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? be : ye) : o === be || o === ye ? o = S : o === _e || o === ve ? o = x : (o = S, i = void 0);
		let d = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), E.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = E.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? De : r[1] === "?" ? Oe : r[1] === "@" ? ke : k
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (xe.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), E.nextNode(), c.push({
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
function D(e, t, n = e, r) {
	if (t === w) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = D(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new O(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ae(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, O = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = D(this, e, t), b(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== w && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		me(this._$AH) || (this._$AH = [], this._$AR());
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
}, k = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = T;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = D(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = D(this, r[n + o], t, o), s === w && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, De = class extends k {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, Oe = class extends k {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, ke = class extends k {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = D(this, e, t, 0) ?? T) === w) return;
		let n = this._$AH, r = e === T && n !== T || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== T && (n === T || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ae = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		D(this, e);
	}
};
(0, ce.litHtmlPolyfillSupport)?.(Te, O), (ce.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new O(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, A = globalThis, j = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return w;
	}
};
j._$litElement$ = !0, j.finalized = !0, A.litElementHydrateSupport?.({ LitElement: j }), (0, A.litElementPolyfillSupport)?.({ LitElement: j }), (A.litElementVersions ??= []).push("4.2.2");
// src/core/parts/typography.ts
var Me = o`var(--ha-font-size-m, 14px)`, M = o`var(--ha-font-size-s, 12px)`;
// src/core/parts/index.ts
function Ne(e) {
	switch (e) {
		case "success": return "success";
		case "failure":
		case "error": return "failure";
		case "pending": return "pending";
		default: return "neutral";
	}
}
function Pe(e) {
	return C`<span class="dot dot--${Ne(e)}" aria-hidden="true"></span>`;
}
function Fe(e) {
	return e ? C`<span class="dot" style="background: ${e}" aria-hidden="true"></span>` : C`<span class="dot dot--neutral" aria-hidden="true"></span>`;
}
function Ie(e) {
	let t = {
		up: "▲",
		down: "▼",
		flat: "▬"
	}[e.direction], n = e.direction !== "flat" && e.percent !== null ? ` ${Math.round(Math.abs(e.percent))} %` : "";
	return C`<span class="trend trend--${e.direction}">${t}${n}</span>`;
}
var Le = o`
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
    font-size: ${M};
    color: var(--secondary-text-color);
  }
  .trend--up {
    color: var(--success-color, var(--primary-text-color));
  }
  .trend--down {
    color: var(--error-color);
  }
`, Re = {
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
}, N = {
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
}, ze = {
	en: N,
	de: Re
};
function P(e, t) {
	let n = `editor_${t}`, r = (ze[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? N)[n] ?? N[n];
	if (r) return r;
	let i = t.replace(/_/g, " ");
	return i.charAt(0).toUpperCase() + i.slice(1);
}
function F(e, t) {
	return (ze[e.locale.language.toLowerCase().split("-")[0] ?? "en"] ?? N)[t];
}
// src/core/base-card.ts
var I = class extends j {
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
		this.styles = [Le, o`
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
		let n = this.hass ? F(this.hass, e) : e;
		return C`<ha-card
      ><div class="message ${t ? "message--error" : ""}">${n}</div></ha-card
    >`;
	}
	render() {
		return !this.config || !this.hass ? T : this.renderContent();
	}
}, Be = 1;
function Ve(e) {
	return e === null || !Number.isFinite(e) ? {
		direction: "flat",
		percent: null
	} : Math.abs(e) <= Be ? {
		direction: "flat",
		percent: e
	} : {
		direction: e > 0 ? "up" : "down",
		percent: e
	};
}
var He = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function Ue(e) {
	return e === void 0 || He.has(e);
}
function L(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function We(e) {
	let t = L(e);
	return t === null ? "—" : Math.abs(t) < 1e3 ? String(t) : `${Number((t / 1e3).toFixed(1))}k`;
}
function R(e) {
	if (typeof e != "string" || !e.startsWith("https://")) return !1;
	try {
		return new URL(e).protocol === "https:";
	} catch {
		return !1;
	}
}
// src/core/fields.ts
var Ge = {
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
}, Ke = [
	"blue",
	"purple",
	"teal",
	"orange",
	"pink",
	"green",
	"indigo",
	"amber"
], z = {
	success: "var(--success-color, var(--green-color))",
	failure: "var(--error-color, var(--red-color))",
	pending: "var(--warning-color, var(--amber-color))"
}, qe = /* @__PURE__ */ new Set([
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
function B(e) {
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
function V(e) {
	return e.attribute ? `${e.key}:${e.attribute}` : e.key;
}
function H(e) {
	let t = e.replace(/_/g, " ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}
function Je(e) {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t;
}
function Ye(e) {
	return `var(--${e}-color)`;
}
function U(e) {
	return /^[a-z-]+$/.test(e) ? Ye(e) : e;
}
function Xe(e) {
	return Ye(Ke[Je(e) % Ke.length] ?? "blue");
}
function Ze(e, t) {
	return e.color ? /^[a-z-]+$/.test(e.color) ? Ye(e.color) : e.color : t ? z[t] : Xe(e.key);
}
function W(e, t, n, r) {
	let i = Ge[t];
	if (i) return F(e, i);
	let a = n.attributes.friendly_name;
	return typeof a == "string" && a.trim() !== "" && (r && a.startsWith(`${r} `) ? a.slice(r.length + 1) : a).trim() || H(t);
}
function Qe(e, t, n, r) {
	let i = n.attributes.friendly_name;
	if (typeof i == "string" && i.trim() !== "") {
		let e = r && i.startsWith(`${r} `) ? i.slice(r.length + 1) : i;
		if (e.trim() !== "") return e.trim();
	}
	return W(e, t, n, r);
}
function $e(e, t) {
	if (t === "success") return "success";
	if (t === "failure" || t === "error") return "failure";
	if (t === "pending" || t === "queued") return "pending";
	if (e.startsWith("has_") && t === "on") return "failure";
	let n = L(t);
	if (n !== null) {
		if (/(overdue|critical|failing|stale)/.test(e)) return n > 0 ? "failure" : void 0;
		if (/(_vs_|trend)/.test(e)) {
			if (n > 1) return "success";
			if (n < -1) return "failure";
		}
	}
}
function et(e) {
	if (typeof e == "number") return Math.abs(e) >= 1e3 ? We(String(e)) : String(e);
	if (typeof e == "string") return e.trim() === "" ? void 0 : e;
	if (typeof e == "boolean") return e ? "✓" : "–";
	if (Array.isArray(e)) return String(e.length);
}
function tt(e, t) {
	let n = t.attributes.unit_of_measurement, r = typeof n == "string" && n !== "" ? n : void 0, i = L(t.state);
	return i === null ? { value: e.formatEntityState?.(t) ?? t.state } : r ? {
		value: String(i),
		unit: r
	} : { value: Math.abs(i) >= 1e3 ? We(t.state) : String(i) };
}
function G(e, t, n, r) {
	return n.flatMap((n) => {
		let i = t[n.key];
		if (!i || Ue(i.state)) return [];
		let a, o;
		if (n.attribute) {
			let e = i.attributes[n.attribute], t = et(e);
			if (t === void 0) return [];
			a = { value: t }, o = typeof e == "number" ? e : t;
		} else a = tt(e, i), o = L(i.state) ?? i.state;
		let s = n.attribute ? void 0 : $e(n.key, i.state), c = n.name ?? (n.attribute ? `${W(e, n.key, i, r)} › ${H(n.attribute)}` : W(e, n.key, i, r)), l = n.name ?? (n.attribute ? `${Qe(e, n.key, i, r)} › ${H(n.attribute)}` : Qe(e, n.key, i, r)), u = n.trend ? t[n.trend]?.state : void 0, d = {
			id: V(n),
			label: c,
			entityLabel: l,
			...a,
			raw: o,
			color: Ze(n, s),
			stateObj: i
		};
		return n.icon && (d.icon = n.icon), n.attribute && (d.attribute = n.attribute), s && (d.tone = s), u !== void 0 && (d.trend = Ve(L(u))), [d];
	});
}
function nt(e) {
	for (let t of [
		"failure",
		"pending",
		"success"
	]) if (e.some((e) => e.tone === t)) return z[t];
}
function K(e, t) {
	let n = e.devices[t]?.name ?? void 0, r = [], i = /* @__PURE__ */ new Set();
	for (let a of Object.values(e.entities)) {
		if (a.device_id !== t) continue;
		let o = e.states[a.entity_id];
		if (!o) continue;
		let s = a.translation_key || a.entity_id;
		if (i.has(s)) continue;
		i.add(s);
		let c = Qe(e, s, o, n);
		r.push({
			value: s,
			label: c
		});
		for (let [e, t] of Object.entries(o.attributes)) qe.has(e) || et(t) === void 0 || Array.isArray(t) || r.push({
			value: `${s}:${e}`,
			label: `${c} › ${H(e)}`
		});
	}
	return r.sort((e, t) => {
		let n = e.value.split(":")[0] ?? "", r = t.value.split(":")[0] ?? "";
		return n === r ? e.value.localeCompare(t.value) : n.localeCompare(r);
	});
}
// src/core/parts/header.ts
var rt = o`
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
    font-size: ${M};
    color: var(--secondary-text-color);
    background: var(--secondary-background-color);
  }
  .badge--colored {
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .name {
    font-size: ${Me};
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
`, it = /^(done|fixed|verified|resolved|closed|complete|completed|erledigt|behoben|geschlossen|gelöst)/i, at = /(progress|review|testing|test|doing|implement|bearbeitung|prüf)/i, ot = /(blocked|won'?t|rejected|duplicate|obsolete|blockiert|abgelehnt)/i, st = /^(open|submitted|new|to ?do|backlog|offen|neu)/i, ct = /(show-?stopper|blocker|critical|kritisch)/i, lt = /(major|high|hoch|wichtig)/i, ut = /(minor|low|trivial|niedrig|gering)/i;
function dt(e, t) {
	if (!t) return;
	let n = e.trim().toLowerCase(), r = Object.keys(t).find((e) => e.trim().toLowerCase() === n), i = r ? t[r] : void 0;
	return i ? U(i) : void 0;
}
function ft(e, t) {
	return dt(e, t) || (it.test(e) ? z.success : ot.test(e) ? z.failure : at.test(e) ? z.pending : st.test(e) ? U("blue") : Xe(e));
}
function pt(e, t) {
	return dt(e, t) || (ct.test(e) ? z.failure : lt.test(e) ? z.pending : ut.test(e) ? "var(--disabled-text-color)" : "var(--divider-color)");
}
// src/core/status.ts
var mt = [
	"=",
	"!=",
	">",
	">=",
	"<",
	"<=",
	"contains"
], ht = [
	"success",
	"pending",
	"failure",
	"none"
], gt = /* @__PURE__ */ new Set([
	"success",
	"pending",
	"failure"
]);
function _t(e) {
	let t = e.trim();
	if (t === "" || t.toLowerCase() === "none" || /[;{}"<>]/.test(t)) return {};
	let n = t.toLowerCase();
	if (gt.has(n)) {
		let e = n;
		return {
			tone: e,
			color: z[e]
		};
	}
	return { color: U(t) };
}
function vt(e, t) {
	let n = B(t), r = e[n.key];
	if (r && !Ue(r.state)) return n.attribute ? r.attributes[n.attribute] : r.state;
}
function yt(e, t, n) {
	if (e == null) return !1;
	let r = String(e).toLowerCase(), i = String(n ?? "").toLowerCase();
	if (t === "contains") return r.includes(i);
	let a = L(String(e)), o = L(String(n));
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
function bt(e, t) {
	for (let n of e) if (yt(vt(t, n.field), n.operator ?? "=", n.value)) return _t(n.state);
	return {};
}
// src/core/editor.ts
function xt(e, t) {
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
function St(e, t, n, r) {
	return {
		name: r,
		selector: { select: {
			mode: "dropdown",
			options: n.map((n) => ({
				value: n,
				label: e ? F(e, `${t}_${n}`) : n
			}))
		} }
	};
}
function Ct(e, t, n = "layout") {
	return St(e, "layout", t, n);
}
function wt(e, t, n = "fields", r = !1) {
	let i = (t) => e ? P(e, t) : t, a = [
		"left",
		"center",
		"right"
	].map((t) => ({
		value: t,
		label: e ? F(e, `align_${t}`) : t
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
function Tt(e, t, n = "fields") {
	return wt(e, e && t ? K(e, t) : [], n);
}
function Et(e, t) {
	if (!e) return {
		hasDevicePage: !1,
		attributeUrls: []
	};
	let n = t.some((t) => R(e.devices[t]?.configuration_url)), r = /* @__PURE__ */ new Map();
	for (let n of t) for (let t of K(e, n)) {
		let [i, a] = t.value.split(":");
		i && a && !r.has(t.value) && Object.values(e.entities).some((t) => {
			if (t.device_id !== n || (t.translation_key || t.entity_id) !== i) return !1;
			let r = e.states[t.entity_id]?.attributes[a];
			return typeof r == "string" && R(r);
		}) && r.set(t.value, t);
	}
	return {
		hasDevicePage: n,
		attributeUrls: [...r.values()]
	};
}
function Dt(e, t) {
	let n = (t) => e ? P(e, t) : t;
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
function Ot(e, t, n) {
	let r = (t) => e ? F(e, t) : t;
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
function kt(e, t) {
	let n = (t) => e ? P(e, t) : t, r = ht.map((t) => ({
		value: t,
		label: e ? F(e, `state_${t}`) : t
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
						options: mt.map((e) => ({
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
function q(e) {
	if (typeof e == "string") return { key: e };
	let { attribute: t, ...n } = e;
	return t ? {
		...n,
		key: `${e.key}:${t}`
	} : { ...n };
}
function At(e, t) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let n = Object.fromEntries(Object.entries(e).filter(([, e]) => e != null && e !== ""));
		return typeof n[t] == "string" ? [n] : [];
	}) : [];
}
var jt = class extends j {
	constructor(...e) {
		super(...e), this.fieldListNames = [], this.ruleListNames = [], this.linkNames = [], this.noneNames = [], this.pairs = [], this.onByDefaultNames = [], this.singleFieldNames = [], this.labelNames = {}, this.computeLabel = (e) => this.hass ? P(this.hass, this.labelNames[e.name] ?? e.name) : e.name;
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
			if (Array.isArray(n) && n.length > 0) e[t] = n.map(q);
			else {
				let n = this.defaultFields?.(t);
				n?.length && (e[t] = n.map(q));
			}
		}
		for (let t of this.singleFieldNames) {
			let n = e[t];
			(typeof n == "string" || typeof n == "object" && n) && (e[t] = q(n));
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
			let r = At(n[e], "key"), i = !Array.isArray(t[e]) || t[e].length === 0 ? (this.defaultFields?.(e) ?? []).map(q) : [], a = i.length > 0 && JSON.stringify(r) === JSON.stringify(i);
			r.length > 0 && !a ? n[e] = r : delete n[e];
		}
		for (let e of this.singleFieldNames) {
			if (!(e in n)) continue;
			let [t] = At([n[e]], "key");
			t ? n[e] = t : delete n[e];
		}
		for (let e of this.linkNames) (n[e] === "none" || n[e] === !1) && delete n[e];
		for (let e of this.noneNames) n[e] === "none" && delete n[e];
		for (let e of this.ruleListNames) {
			if (!(e in n)) continue;
			let t = At(n[e], "field");
			t.length > 0 ? n[e] = t : delete n[e];
		}
		this.finalizeConfig(n), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: n },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return !this.hass || !this.config ? T : C`<ha-form
      .hass=${this.hass}
      .data=${this.formData()}
      .schema=${xt(this.schema(), this.pairs)}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
	}
}, Mt = class extends jt {
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
			label: e ? F(e, "badge_count") : "count"
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
			Dt(this.hass, this.badgeOptions()),
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
}, Nt = "hoc-youtrack-issues-card", Pt = 5;
function J(e) {
	return typeof e == "string" ? e : "";
}
function Ft(e) {
	return typeof e == "string" && /^https?:\/\//i.test(e) ? e : void 0;
}
function It(e) {
	let t = e.issues;
	return Array.isArray(t) ? t.flatMap((e) => {
		if (typeof e != "object" || !e) return [];
		let t = e;
		return typeof t.id == "string" ? [{
			id: t.id,
			summary: J(t.summary),
			state: J(t.state),
			priority: J(t.priority),
			assignee: J(t.assignee),
			url: Ft(t.url)
		}] : [];
	}) : [];
}
function Lt(e, t, n) {
	let r = e.entities[t]?.device_id, i = r ? e.devices[r] : void 0, a = i?.name_by_user ?? i?.name ?? "", o = J(n.attributes.friendly_name).trim(), s = a && o.startsWith(`${a} `) ? o.slice(a.length + 1) : o;
	return a && s && s !== a ? `${a} · ${s}` : a || s || t;
}
function Rt(e, t) {
	let n = e.find((e) => e.url)?.url;
	if (n && typeof t == "string" && t.trim() !== "") try {
		return `${new URL(n).origin}/issues?q=${encodeURIComponent(t)}`;
	} catch {
		return;
	}
}
var zt = {
	tag: Nt,
	ctor: class extends I {
		static {
			this.requiredKeys = ["entity"];
		}
		static {
			this.properties = {
				...I.properties,
				showAll: { state: !0 },
				openIssues: { state: !0 }
			};
		}
		constructor() {
			super(), this.showAll = !1, this.openIssues = /* @__PURE__ */ new Set();
		}
		static {
			this.styles = [
				...I.styles,
				rt,
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
        font-size: ${M};
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
        font-size: ${M};
        color: var(--secondary-text-color);
        transition: transform 0.15s;
      }
      .issue--open .issue__chevron {
        transform: rotate(90deg);
      }
      .badge {
        font-size: ${M};
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
        font-size: ${M};
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
        font-size: ${M};
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
			return document.createElement(`${Nt}-editor`);
		}
		toggleIssue(e) {
			let t = new Set(this.openIssues);
			t.delete(e) || t.add(e), this.openIssues = t;
		}
		badge(e) {
			let t = this.config?.badge;
			if (!t) return T;
			let { key: n, color: r } = typeof t == "string" ? {
				key: t,
				color: void 0
			} : t, i = n === "count" ? e.state : e.attributes[n], a = typeof i == "string" || typeof i == "number" ? String(i).trim() : "";
			if (a === "" || a === "unknown" || a === "unavailable") return T;
			let o = r ? U(r) : void 0;
			return C`<span class="badge ${o ? "badge--colored" : ""}" style=${o ? `--c: ${o}` : ""}
      >${a}</span
    >`;
		}
		renderIssue(e) {
			let { hass: t, config: n } = this, r = n?.colors, i = this.openIssues.has(e.id), a = e.state ? C`<span class="badge badge--colored" style="--c: ${ft(e.state, r)}"
          >${e.state}</span
        >` : T, o = e.url ? C`<a class="issue__id" href=${e.url} target="_blank" rel="noopener noreferrer"
          >${e.id}</a
        >` : C`<span class="issue__id">${e.id}</span>`;
			return C`<div
      class="issue ${i ? "issue--open" : ""}"
      style="--p: ${e.priority ? pt(e.priority, r) : "var(--divider-color)"}"
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
      ${i ? C`<div class="detail">
              <div class="detail__summary">${e.summary}</div>
              <div class="detail__meta">
                ${e.priority ? C`<span
                        class="badge badge--colored"
                        style="--c: ${pt(e.priority, r) === "var(--divider-color)" ? "var(--secondary-text-color)" : pt(e.priority, r)}"
                        >${t ? F(t, "priority") : "Priority"}: ${e.priority}</span
                      >` : T}
                ${e.assignee ? C`<span class="assignee"
                        ><ha-icon icon="mdi:account-outline"></ha-icon>${e.assignee}</span
                      >` : T}
                ${e.url ? C`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                        >${t ? F(t, "open_issue") : "Open issue"} ↗</a
                      >` : T}
              </div>
            </div>` : T}
    </div>`;
		}
		renderFooter(e, t, n, r) {
			let { hass: i, config: a } = this;
			if (!i || !a) return T;
			let o = a.expandable !== !1 && e.length > n, s = Math.max(0, t - e.length), c = this.showAll ? s : Math.max(0, t - n);
			if (c === 0 && !(o && this.showAll)) return T;
			let l = F(i, "more"), u = s > 0 ? Rt(e, r) : void 0, d = this.showAll ? F(i, "show_less") : `+${c} ${l}`;
			return C`<div class="footer">
      ${o ? C`<button
              class="more"
              aria-expanded=${this.showAll ? "true" : "false"}
              @click=${() => {
				this.showAll = !this.showAll;
			}}
            >
              ${d}
            </button>` : C`<span class="more more--static">+${c} ${l}</span>`}
      ${this.showAll && s > 0 && o ? C`<span>+${s} ${l}</span>` : T}
      ${u ? C`<a href=${u} target="_blank" rel="noopener noreferrer"
              >${F(i, "open_in_youtrack")} ↗</a
            >` : T}
    </div>`;
		}
		renderContent() {
			let { hass: e, config: t } = this;
			if (!e || !t) return C``;
			let n = e.states[t.entity];
			if (!n) return this.renderMessage("entity_not_found", !0);
			if (!Array.isArray(n.attributes.issues)) return this.renderMessage("no_issue_list");
			let r = It(n.attributes), i = t.max_items ?? Pt, a = Math.max(L(n.state) ?? 0, r.length), o = this.showAll ? r : r.slice(0, i), s = t.name?.trim() || Lt(e, t.entity, n), c = this.badge(n);
			return C`<ha-card>
      ${t.show_title === !1 ? c === T ? T : C`<div class="header header--badge-only">${c}</div>` : C`<div class="header">
              <div class="title"><span class="name">${s}</span></div>
              ${c}
            </div>`}
      ${o.length === 0 ? C`<div class="message">${F(e, "no_issues")}</div>` : C`<div class="issues">${o.map((e) => this.renderIssue(e))}</div>`}
      ${this.renderFooter(r, a, i, n.attributes.query)}
    </ha-card>`;
		}
	},
	editorTag: `${Nt}-editor`,
	editorCtor: Mt,
	name: "YouTrack issues",
	description: "The issues of a YouTrack query sensor, with coloured states and priorities."
};
// src/core/parts/field-tile.ts
function Bt(e, t) {
	return t.icon ? C`<ha-icon icon=${t.icon}></ha-icon>` : t.attribute ? C`<ha-icon icon="mdi:information-outline"></ha-icon>` : C`<ha-state-icon .hass=${e} .stateObj=${t.stateObj}></ha-state-icon>`;
}
function Vt(e, t, n = "tile") {
	let r = C`<span class="field__value"
      >${t.value}${t.unit ? C` <span class="field__unit">${t.unit}</span>` : T}</span
    >${t.trend ? Ie(t.trend) : T}`;
	return C`<div
    class="field field--${n} ${t.tone ? "field--tone" : ""}"
    style="--c: ${t.color}"
    title=${t.label}
  >
    <span class="chip">${Bt(e, t)}</span>
    ${n === "inline" ? C`<span class="field__text">${r}</span>` : C`<span class="field__text">
            <span class="field__main">${r}</span>
            <span class="field__label">${t.label}</span>
          </span>`}
  </div>`;
}
var Ht = o`
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
    font-size: ${Me};
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
  }
  .field--tone .field__value {
    color: var(--c);
  }
  .field__unit {
    font-size: ${M};
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .field__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${M};
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
    font-size: ${Me};
  }
`;
// src/core/link.ts
function Ut(e, t, n, r) {
	for (let i of [e, t]) {
		let e = Wt(i, n, r);
		if (e) return e;
	}
}
function Wt(e, t, n) {
	if (e === !0 || e === "device") {
		let e = t?.configuration_url;
		return R(e) ? e : void 0;
	}
	if (typeof e != "string") return;
	let r = e.trim();
	if (r.startsWith("https://")) return R(r) ? r : void 0;
	let i = B(r);
	if (!i.attribute) return;
	let a = n[i.key]?.attributes[i.attribute];
	return typeof a == "string" && R(a) ? a : void 0;
}
// src/core/resolver.ts
function Y(e, t, n) {
	let r = {};
	for (let i of Object.values(e.entities)) {
		if (i.device_id !== t || n !== void 0 && i.platform !== n) continue;
		let a = e.states[i.entity_id];
		a && (r[i.translation_key || i.entity_id] = a);
	}
	return r;
}
function Gt(e, t) {
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
function Kt(e) {
	return e === "compact" || e === "list" ? e : "standard";
}
function qt(e) {
	if (e !== void 0 && !(Array.isArray(e) && e.every((e) => typeof e == "string" || typeof e == "object" && !!e && typeof e.key == "string"))) throw Error("`fields` must be a list of sensor keys or objects with a `key`");
}
var Jt = class extends I {
	static {
		this.styles = [
			...I.styles,
			Ht,
			rt,
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
		return t?.length ? bt(t, e) : void 0;
	}
	get dotKey() {}
	get statusKeys() {
		return this.dotKey ? [this.dotKey] : [];
	}
	deviceId() {
		return this.config?.device;
	}
	setConfig(e) {
		qt(e.fields), super.setConfig(e);
	}
	renderBadge(e, t) {
		let { hass: n, config: r } = this;
		if (!n || !r?.badge) return T;
		let i = B(r.badge), [a] = G(n, e, [i], t);
		if (!a) return T;
		let o = i.color ? U(i.color) : a.tone ? a.color : void 0;
		return C`<span
      class="badge ${o ? "badge--colored" : ""}"
      style=${o ? `--c: ${o}` : ""}
      title=${a.label}
      >${a.value}${a.unit ? ` ${a.unit}` : ""}</span
    >`;
	}
	renderFields(e, t) {
		let { hass: n } = this;
		return !n || e.length === 0 ? T : t === "compact" ? C`<div class="inline-fields">
        ${e.map((e) => Vt(n, e, "inline"))}
      </div>` : t === "list" ? C`<div class="rows">${e.map((e) => Vt(n, e, "row"))}</div>` : C`<div class="grid">${e.map((e) => Vt(n, e, "tile"))}</div>`;
	}
	renderContent() {
		let { hass: e, config: t } = this;
		if (!e || !t) return C``;
		let n = this.deviceId(), r = n ? e.devices[n] : void 0;
		if (!n || !r) return this.renderMessage("device_not_found", !0);
		let i = r.name_by_user ?? r.name ?? n, a = t.name?.trim() || i, o = t.show_status !== !1, s = Y(e, n, this.platform), c = Kt(t.layout), l = G(e, s, (t.fields?.length ? t.fields : this.defaultFields(c, s)).map(B), i), u = G(e, s, this.statusKeys.map((e) => ({ key: e })), i), d = o ? this.customStatus(s) : void 0, ee = d ? d.color : o ? nt(u) : void 0, te = d ? d.tone === "failure" : u.some((e) => e.tone === "failure"), ne = Ut(t.link, t.link_url, r, s), f = this.dotKey ? s[this.dotKey]?.state : void 0, re = o ? d ? Fe(d.color) : f === void 0 ? T : Pe(f) : T, p = this.renderBadge(s, i);
		return C`<ha-card
      class=${te ? "alert" : ""}
      style=${ee ? `--hoc-accent: ${ee}` : ""}
    >
      ${t.show_title === !1 ? p === T ? T : C`<div class="header header--badge-only">${p}</div>` : C`<div class="header">
              <div class="title">
                ${re}
                <span class="name"
                  >${ne ? C`<a href=${ne} target="_blank" rel="noopener noreferrer"
                          >${a}</a
                        >` : a}</span
                >
              </div>
              ${p}
            </div>`}
      ${this.renderFields(l, c)}
    </ha-card>`;
	}
}, Yt = "github_pulse", Xt = "youtrack", Zt = [
	"stars",
	"forks",
	"open_issues",
	"open_pull_requests",
	{
		key: "commits_this_month",
		trend: "commits_vs_last_month"
	},
	"latest_release"
], Qt = [
	{
		key: "contributions_this_month",
		trend: "commits_vs_last_month"
	},
	"current_streak",
	"longest_streak",
	"top_language"
], $t = [
	"issues_open",
	"issues_overdue",
	"issues_critical_open",
	"issues_created_7d",
	"issues_resolved_7d"
], X = {
	[Yt]: {
		platform: Yt,
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
			standard: Zt,
			list: Zt
		},
		variant: {
			marker: "contributions_this_month",
			layouts: {
				compact: ["contributions_this_month", "current_streak"],
				standard: Qt,
				list: Qt
			}
		},
		dotKey: "ci_state"
	},
	[Xt]: {
		platform: Xt,
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
			compact: $t,
			standard: $t,
			list: $t
		},
		statusKeys: ["has_overdue", "has_critical_open"]
	}
};
function Z(e, t) {
	for (let n of Object.values(e.entities)) {
		if (n.device_id !== t) continue;
		let e = X[n.platform];
		if (e) return e;
	}
}
var en = 6;
function tn(e, t, n) {
	if (!e) return Object.keys(n).slice(0, en);
	let r = e.variant;
	return (r && r.marker in n ? r.layouts : e.layouts)[t];
}
function nn(e, t, n) {
	let r = n.variant?.marker;
	return r ? Object.values(e.entities).some((e) => e.device_id === t && e.platform === n.platform && e.translation_key === r) : !1;
}
function Q(e, t, n) {
	let r = (t) => {
		let n = e.devices[t];
		return n?.name_by_user ?? n?.name ?? t;
	};
	if (Array.isArray(t) && t.length > 0) return [...new Set(t)].filter((t) => t in e.devices).map((e) => ({
		id: e,
		name: r(e)
	}));
	if (!n) return [];
	let i = X[n];
	return Gt(e, n).filter((t) => !i || !nn(e, t.id, i));
}
function rn(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.values(e.entities)) n.device_id && e.devices[n.device_id] && t.add(n.platform);
	return [...t].map((e) => ({
		value: e,
		label: X[e]?.label ?? e
	})).sort((e, t) => e.label.localeCompare(t.label));
}
// src/cards/generic/device/editor.ts
var an = class extends jt {
	constructor(...e) {
		super(...e), this.fieldListNames = ["fields"], this.singleFieldNames = ["badge"], this.ruleListNames = ["status"], this.linkNames = ["link"], this.onByDefaultNames = ["show_title", "show_status"];
	}
	defaultFields(e) {
		let { hass: t, config: n } = this, r = n?.device;
		if (e !== "fields" || !t || !r) return;
		let i = Z(t, r), a = Y(t, r, i?.platform);
		return tn(i, Kt(n.layout), a).filter((e) => B(e).key in a);
	}
	finalizeConfig(e) {
		e.link && delete e.link_url;
	}
	schema() {
		let e = this.config?.device, t = this.hass, n = t && e ? K(t, e) : [], r = this.config?.show_title !== !1, { hasDevicePage: i, attributeUrls: a } = Et(t, e ? [e] : []);
		return [
			{
				name: "device",
				required: !0,
				selector: { device: {} }
			},
			Ct(t, [
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
			Dt(t, n),
			...r ? [Ot(t, i, a)] : [],
			...r && !this.config?.link ? [{
				name: "link_url",
				selector: { text: { type: "url" } }
			}] : [],
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...this.config?.show_status === !1 ? [] : [kt(t, n)],
			Tt(t, e)
		];
	}
}, on = "hoc-device-card", sn = {
	tag: on,
	ctor: class extends Jt {
		static {
			this.requiredKeys = ["device"];
		}
		preset() {
			let e = this.config?.device;
			return this.hass && e ? Z(this.hass, e) : void 0;
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
			return tn(this.preset(), e, t);
		}
		static getStubConfig(e) {
			let t = Object.values(e.entities).find((t) => t.device_id && e.states[t.entity_id]);
			return t?.device_id ? { device: t.device_id } : {};
		}
		static getConfigElement() {
			return document.createElement(`${on}-editor`);
		}
	},
	editorTag: `${on}-editor`,
	editorCtor: an,
	name: "Device",
	description: "Any device: choose which sensors and attributes to show, in colour. GitHub Pulse and YouTrack devices come with defaults."
}, cn = class extends jt {
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
		return !e || !t ? [] : Q(e, t.devices, t.platform).map((e) => e.id);
	}
	columnOptions(e) {
		let { hass: t } = this;
		if (!t) return [];
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of K(t, r)) n.set(e.value, e);
		return [...n.values()];
	}
	schema() {
		let { hass: e, config: t } = this, n = this.deviceIds(), r = this.columnOptions(n), { hasDevicePage: i, attributeUrls: a } = Et(e, n), o = !!e && Q(e, t?.devices, t?.platform).some((e) => e.name.includes("/")), s = e ? rn(e) : [], c = [{
			value: "none",
			label: e ? F(e, "platform_none") : "none"
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
			St(e, "titles", [
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
			wt(e, r, "columns", !0),
			{
				name: "sort_by",
				selector: { select: {
					mode: "dropdown",
					custom_value: !0,
					options: [{
						value: "name",
						label: e ? P(e, "name") : "Name"
					}, ...r]
				} }
			},
			St(e, "order", ["asc", "desc"], "sort_order"),
			Ot(e, i, a),
			...o || t?.shorten_names ? [{
				name: "shorten_names",
				selector: { boolean: {} }
			}] : [],
			{
				name: "show_status",
				selector: { boolean: {} }
			},
			...t?.show_status ? [kt(e, r)] : [],
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
}, $ = "hoc-devices-card", ln = 4;
function un(e, t) {
	if (e.align) return e.align;
	if (e.key === "ci_state" && !e.attribute) return "left";
	let n = t.flatMap((t) => t.views.get(V(e)) ?? []);
	return n.length > 0 && n.every((e) => typeof e.raw == "number") ? "right" : "left";
}
function dn(e, t) {
	return t === "name" ? e.name : e.views.get(t)?.raw ?? null;
}
function fn(e, t, n, r) {
	let i = dn(e, n), a = dn(t, n);
	if (i === null && a === null) return e.name.localeCompare(t.name);
	if (i === null) return 1;
	if (a === null) return -1;
	let o;
	return o = typeof i == "number" && typeof a == "number" ? i - a : typeof i == "number" ? -1 : typeof a == "number" ? 1 : i.localeCompare(a), o === 0 ? e.name.localeCompare(t.name) : o * r;
}
// src/registry.ts
var pn = [
	{
		tag: $,
		ctor: class extends I {
			static {
				this.styles = [
					...I.styles,
					rt,
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
        font-size: ${M};
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
        font-size: ${M};
        font-weight: 400;
        color: var(--secondary-text-color);
      }
    `
				];
			}
			static getConfigElement() {
				return document.createElement(`${$}-editor`);
			}
			static getStubConfig(e) {
				let t = Object.keys(X).find((t) => Object.values(e.entities).some((e) => e.platform === t && e.device_id)) ?? rn(e)[0]?.value;
				return t ? { platform: t } : {};
			}
			rows(e) {
				let { hass: t, config: n } = this;
				return !t || !n ? [] : Q(t, n.devices, n.platform).map((r) => {
					let i = Z(t, r.id), a = Y(t, r.id, i?.platform), o = G(t, a, e, r.name), s = bt(n.status?.length ? n.status : i?.rowStatus ?? [], a);
					return {
						id: r.id,
						url: Ut(n.link, void 0, t.devices[r.id], a),
						statusColor: s.color,
						name: n.shorten_names === !0 ? r.name.split("/").pop() ?? r.name : r.name,
						views: new Map(o.map((e) => [e.id, e]))
					};
				});
			}
			columnSpecs() {
				let { hass: e, config: t } = this;
				if (!e || !t) return [];
				if (t.columns?.length) return t.columns.map(B);
				let n = Q(e, t.devices, t.platform)[0], r = (t.platform ? X[t.platform] : void 0) ?? (n ? Z(e, n.id) : void 0);
				return r ? r.columns.map(B) : n ? Object.keys(Y(e, n.id)).slice(0, ln).map((e) => ({ key: e })) : [];
			}
			renderCell(e, t, n) {
				let r = `text-align: ${n}`;
				return e ? t.key === "ci_state" && !t.attribute ? C`<td style=${r}>${Pe(e.stateObj.state)}</td>` : C`<td style=${r}>
      <span class="cell ${e.tone || t.color ? "cell--tone" : ""}" style="--c: ${e.color}"
        >${e.value}${e.unit ? C`<span class="cell__unit">${e.unit}</span>` : T}${e.trend ? Ie(e.trend) : T}</span
      >
    </td>` : C`<td style=${r}>—</td>`;
			}
			renderContent() {
				let { hass: e, config: t } = this;
				if (!e || !t) return C``;
				let n = this.columnSpecs(), r = t.sort_by ?? "name", i = t.sort_order === "desc" ? -1 : 1, a = this.rows(n).sort((e, t) => fn(e, t, r, i));
				if (a.length === 0) return this.renderMessage(t.devices?.length || t.platform ? "no_devices" : "choose_devices");
				let o = t.column_titles ?? "text", s = n.map((e) => un(e, a)), c = n.map((t) => {
					let n = V(t), r = a.map((e) => e.views.get(n)).find((e) => e !== void 0);
					return {
						text: t.name ?? r?.entityLabel ?? H(t.key),
						icon: r ? Bt(e, t.icon ? {
							...r,
							icon: t.icon
						} : r) : T,
						color: t.title_color ? U(t.title_color) : void 0
					};
				}), l = t.name?.trim();
				return C`<ha-card>
      ${l ? C`<div class="header">
              <div class="title"><span class="name">${l}</span></div>
            </div>` : T}
      <div class="scroll" style="max-height: ${t.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${t.device_title?.trim() || F(e, "device")}</th>
              ${c.map((e, t) => C`<th
                    title=${e.text}
                    style=${[`text-align: ${s[t] ?? "left"}`, e.color ? `color: ${e.color}` : ""].filter(Boolean).join("; ")}
                  >
                    ${o === "text" ? T : e.icon}${o === "icon" ? T : e.text}
                  </th>`)}
            </tr>
          </thead>
          <tbody>
            ${a.map((e) => C`<tr>
                  <td class="name">
                    <span class="name__content"
                      >${t.show_status ? Fe(e.statusColor) : T}<span
                        class="name__text"
                        >${e.url ? C`<a href=${e.url} target="_blank" rel="noopener noreferrer"
                                >${e.name}</a
                              >` : e.name}</span
                      ></span
                    >
                  </td>
                  ${n.map((t, n) => this.renderCell(e.views.get(V(t)), t, s[n] ?? "left"))}
                </tr>`)}
          </tbody>
        </table>
      </div>
    </ha-card>`;
			}
		},
		editorTag: `${$}-editor`,
		editorCtor: cn,
		name: "Devices",
		description: "Several devices as a sortable table with selectable columns. GitHub Pulse and YouTrack come with defaults."
	},
	zt,
	sn
];
function mn(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function hn(e = pn) {
	window.customCards ??= [];
	for (let t of e) mn(t.tag, t.ctor), t.editorTag && t.editorCtor && mn(t.editorTag, t.editorCtor), window.customCards.some((e) => e.type === t.tag) || window.customCards.push({
		type: t.tag,
		name: t.name,
		description: t.description,
		preview: t.preview ?? !0
	});
}
// src/index.ts
hn();
export { hn as registerCards };
