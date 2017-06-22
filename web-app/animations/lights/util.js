!function() {
    THREE.TrackballControls = function(a, b) {
        function c(a) {
            l.enabled !== !1 && (window.removeEventListener("keydown", c), q = p, p === m.NONE && (a.keyCode !== l.keys[m.ROTATE] || l.noRotate ? a.keyCode !== l.keys[m.ZOOM] || l.noZoom ? a.keyCode !== l.keys[m.PAN] || l.noPan || (p = m.PAN) : p = m.ZOOM : p = m.ROTATE))
        }

        function d(a) {
            l.enabled !== !1 && (p = q, window.addEventListener("keydown", c, !1))
        }

        function e(a) {
            l.enabled !== !1 && (a.preventDefault(), a.stopPropagation(), p === m.NONE && (p = a.button), p !== m.ROTATE || l.noRotate ? p !== m.ZOOM || l.noZoom ? p !== m.PAN || l.noPan || (A.copy(F(a.pageX, a.pageY)), B.copy(A)) : (w.copy(F(a.pageX, a.pageY)), x.copy(w)) : (t.copy(G(a.pageX, a.pageY)), s.copy(t)), document.addEventListener("mousemove", f, !1), document.addEventListener("mouseup", g, !1), l.dispatchEvent(D))
        }

        function f(a) {
            l.enabled !== !1 && (a.preventDefault(), a.stopPropagation(), p !== m.ROTATE || l.noRotate ? p !== m.ZOOM || l.noZoom ? p !== m.PAN || l.noPan || B.copy(F(a.pageX, a.pageY)) : x.copy(F(a.pageX, a.pageY)) : (s.copy(t), t.copy(G(a.pageX, a.pageY))))
        }

        function g(a) {
            l.enabled !== !1 && (a.preventDefault(), a.stopPropagation(), p = m.NONE, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", g), l.dispatchEvent(E))
        }

        function h(a) {
            if (l.enabled !== !1) {
                a.preventDefault(), a.stopPropagation();
                var b = 0;
                a.wheelDelta ? b = a.wheelDelta / 40 : a.detail && (b = -a.detail / 3), w.y += .01 * b, l.dispatchEvent(D), l.dispatchEvent(E)
            }
        }

        function i(a) {
            if (l.enabled !== !1) {
                switch (a.touches.length) {
                    case 1:
                        p = m.TOUCH_ROTATE, t.copy(G(a.touches[0].pageX, a.touches[0].pageY)), s.copy(t);
                        break;
                    case 2:
                        p = m.TOUCH_ZOOM_PAN;
                        var b = a.touches[0].pageX - a.touches[1].pageX,
                            c = a.touches[0].pageY - a.touches[1].pageY;
                        z = y = Math.sqrt(b * b + c * c);
                        var d = (a.touches[0].pageX + a.touches[1].pageX) / 2,
                            e = (a.touches[0].pageY + a.touches[1].pageY) / 2;
                        A.copy(F(d, e)), B.copy(A);
                        break;
                    default:
                        p = m.NONE
                }
                l.dispatchEvent(D)
            }
        }

        function j(a) {
            if (l.enabled !== !1) switch (a.preventDefault(), a.stopPropagation(), a.touches.length) {
                case 1:
                    s.copy(t), t.copy(G(a.touches[0].pageX, a.touches[0].pageY));
                    break;
                case 2:
                    var b = a.touches[0].pageX - a.touches[1].pageX,
                        c = a.touches[0].pageY - a.touches[1].pageY;
                    z = Math.sqrt(b * b + c * c);
                    var d = (a.touches[0].pageX + a.touches[1].pageX) / 2,
                        e = (a.touches[0].pageY + a.touches[1].pageY) / 2;
                    B.copy(F(d, e));
                    break;
                default:
                    p = m.NONE
            }
        }

        function k(a) {
            if (l.enabled !== !1) {
                switch (a.touches.length) {
                    case 1:
                        s.copy(t), t.copy(G(a.touches[0].pageX, a.touches[0].pageY));
                        break;
                    case 2:
                        y = z = 0;
                        var b = (a.touches[0].pageX + a.touches[1].pageX) / 2,
                            c = (a.touches[0].pageY + a.touches[1].pageY) / 2;
                        B.copy(F(b, c)), A.copy(B)
                }
                p = m.NONE, l.dispatchEvent(E)
            }
        }
        var l = this,
            m = {
                NONE: -1,
                ROTATE: 0,
                ZOOM: 1,
                PAN: 2,
                TOUCH_ROTATE: 3,
                TOUCH_ZOOM_PAN: 4
            };
        this.object = a, this.domElement = void 0 !== b ? b : document, this.enabled = !0, this.screen = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }, this.rotateSpeed = 1, this.zoomSpeed = 1.2, this.panSpeed = .3, this.noRotate = !1, this.noZoom = !1, this.noPan = !1, this.staticMoving = !1, this.dynamicDampingFactor = .2, this.minDistance = 0, this.maxDistance = 1 / 0, this.keys = [65, 83, 68], this.target = new THREE.Vector3;
        var n = 1e-6,
            o = new THREE.Vector3,
            p = m.NONE,
            q = m.NONE,
            r = new THREE.Vector3,
            s = new THREE.Vector2,
            t = new THREE.Vector2,
            u = new THREE.Vector3,
            v = 0,
            w = new THREE.Vector2,
            x = new THREE.Vector2,
            y = 0,
            z = 0,
            A = new THREE.Vector2,
            B = new THREE.Vector2;
        this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.up0 = this.object.up.clone();
        var C = {
                type: "change"
            },
            D = {
                type: "start"
            },
            E = {
                type: "end"
            };
        this.handleResize = function() {
            if (this.domElement === document) this.screen.left = 0, this.screen.top = 0, this.screen.width = window.innerWidth, this.screen.height = window.innerHeight;
            else {
                var a = this.domElement.getBoundingClientRect(),
                    b = this.domElement.ownerDocument.documentElement;
                this.screen.left = a.left + window.pageXOffset - b.clientLeft, this.screen.top = a.top + window.pageYOffset - b.clientTop, this.screen.width = a.width, this.screen.height = a.height
            }
        }, this.handleEvent = function(a) {
            "function" == typeof this[a.type] && this[a.type](a)
        };
        var F = function() {
                var a = new THREE.Vector2;
                return function(b, c) {
                    return a.set((b - l.screen.left) / l.screen.width, (c - l.screen.top) / l.screen.height), a
                }
            }(),
            G = function() {
                var a = new THREE.Vector2;
                return function(b, c) {
                    return a.set((b - .5 * l.screen.width - l.screen.left) / (.5 * l.screen.width), (l.screen.height + 2 * (l.screen.top - c)) / l.screen.width), a
                }
            }();
        this.rotateCamera = function() {
            var a, b = new THREE.Vector3,
                c = new THREE.Quaternion,
                d = new THREE.Vector3,
                e = new THREE.Vector3,
                f = new THREE.Vector3,
                g = new THREE.Vector3;
            return function() {
                g.set(t.x - s.x, t.y - s.y, 0), a = g.length(), a ? (r.copy(l.object.position).sub(l.target), d.copy(r).normalize(), e.copy(l.object.up).normalize(), f.crossVectors(e, d).normalize(), e.setLength(t.y - s.y), f.setLength(t.x - s.x), g.copy(e.add(f)), b.crossVectors(g, r).normalize(), a *= l.rotateSpeed, c.setFromAxisAngle(b, a), r.applyQuaternion(c), l.object.up.applyQuaternion(c), u.copy(b), v = a) : !l.staticMoving && v && (v *= Math.sqrt(1 - l.dynamicDampingFactor), r.copy(l.object.position).sub(l.target), c.setFromAxisAngle(u, v), r.applyQuaternion(c), l.object.up.applyQuaternion(c)), s.copy(t)
            }
        }(), this.zoomCamera = function() {
            var a;
            p === m.TOUCH_ZOOM_PAN ? (a = y / z, y = z, r.multiplyScalar(a)) : (a = 1 + (x.y - w.y) * l.zoomSpeed, 1 !== a && a > 0 && (r.multiplyScalar(a), l.staticMoving ? w.copy(x) : w.y += (x.y - w.y) * this.dynamicDampingFactor))
        }, this.panCamera = function() {
            var a = new THREE.Vector2,
                b = new THREE.Vector3,
                c = new THREE.Vector3;
            return function() {
                a.copy(B).sub(A), a.lengthSq() && (a.multiplyScalar(r.length() * l.panSpeed), c.copy(r).cross(l.object.up).setLength(a.x), c.add(b.copy(l.object.up).setLength(a.y)), l.object.position.add(c), l.target.add(c), l.staticMoving ? A.copy(B) : A.add(a.subVectors(B, A).multiplyScalar(l.dynamicDampingFactor)))
            }
        }(), this.checkDistances = function() {
            l.noZoom && l.noPan || (r.lengthSq() > l.maxDistance * l.maxDistance && (l.object.position.addVectors(l.target, r.setLength(l.maxDistance)), w.copy(x)), r.lengthSq() < l.minDistance * l.minDistance && (l.object.position.addVectors(l.target, r.setLength(l.minDistance)), w.copy(x)))
        }, this.update = function() {
            r.subVectors(l.object.position, l.target), l.noRotate || l.rotateCamera(), l.noZoom || l.zoomCamera(), l.noPan || l.panCamera(), l.object.position.addVectors(l.target, r), l.checkDistances(), l.object.lookAt(l.target), o.distanceToSquared(l.object.position) > n && (l.dispatchEvent(C), o.copy(l.object.position))
        }, this.reset = function() {
            p = m.NONE, q = m.NONE, l.target.copy(l.target0), l.object.position.copy(l.position0), l.object.up.copy(l.up0), r.subVectors(l.object.position, l.target), l.object.lookAt(l.target), l.dispatchEvent(C), o.copy(l.object.position)
        }, this.domElement.addEventListener("contextmenu", function(a) {
            a.preventDefault()
        }, !1), this.domElement.addEventListener("mousedown", e, !1), this.domElement.addEventListener("mousewheel", h, !1), this.domElement.addEventListener("DOMMouseScroll", h, !1), this.domElement.addEventListener("touchstart", i, !1), this.domElement.addEventListener("touchend", k, !1), this.domElement.addEventListener("touchmove", j, !1), window.addEventListener("keydown", c, !1), window.addEventListener("keyup", d, !1), this.handleResize(), this.update()
    }, THREE.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype), THREE.TrackballControls.prototype.constructor = THREE.TrackballControls
}(),
function() {
    THREE.PlaneBufferGeometry = function(a, b, c, d) {
        THREE.BufferGeometry.call(this), this.type = "PlaneBufferGeometry", this.parameters = {
            width: a,
            height: b,
            widthSegments: c,
            heightSegments: d
        };
        for (var e = a / 2, f = b / 2, g = c || 1, h = d || 1, i = g + 1, j = h + 1, k = a / g, l = b / h, m = new Float32Array(i * j * 3), n = new Float32Array(i * j * 3), o = new Float32Array(i * j * 2), p = 0, q = 0, r = 0; r < j; r++)
            for (var s = r * l - f, t = 0; t < i; t++) {
                var u = t * k - e;
                m[p] = u, m[p + 1] = -s, n[p + 2] = 1, o[q] = t / g, o[q + 1] = 1 - r / h, p += 3, q += 2
            }
        p = 0;
        for (var v = new(m.length / 3 > 65535 ? Uint32Array : Uint16Array)(g * h * 6), r = 0; r < h; r++)
            for (var t = 0; t < g; t++) {
                var w = t + i * r,
                    x = t + i * (r + 1),
                    y = t + 1 + i * (r + 1),
                    z = t + 1 + i * r;
                v[p] = w, v[p + 1] = x, v[p + 2] = z, v[p + 3] = x, v[p + 4] = y, v[p + 5] = z, p += 6
            }
        this.addAttribute("index", new THREE.BufferAttribute(v, 1)), this.addAttribute("position", new THREE.BufferAttribute(m, 3)), this.addAttribute("normal", new THREE.BufferAttribute(n, 3)), this.addAttribute("uv", new THREE.BufferAttribute(o, 2))
    }, THREE.PlaneBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype)
}(),
function() {
    THREE.CopyShader = {
        uniforms: {
            tDiffuse: {
                type: "t",
                value: null
            },
            opacity: {
                type: "f",
                value: 1
            }
        },
        vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
        fragmentShader: ["uniform float opacity;", "uniform sampler2D tDiffuse;", "varying vec2 vUv;", "void main() {", "vec4 texel = texture2D( tDiffuse, vUv );", "gl_FragColor = opacity * texel;", "}"].join("\n")
    }
}(),
function() {
    THREE.ConvolutionShader = {
        defines: {
            KERNEL_SIZE_FLOAT: "25.0",
            KERNEL_SIZE_INT: "25"
        },
        uniforms: {
            tDiffuse: {
                type: "t",
                value: null
            },
            uImageIncrement: {
                type: "v2",
                value: new THREE.Vector2(.001953125, 0)
            },
            cKernel: {
                type: "fv1",
                value: []
            }
        },
        vertexShader: ["uniform vec2 uImageIncrement;", "varying vec2 vUv;", "void main() {", "vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
        fragmentShader: ["uniform float cKernel[ KERNEL_SIZE_INT ];", "uniform sampler2D tDiffuse;", "uniform vec2 uImageIncrement;", "varying vec2 vUv;", "void main() {", "vec2 imageCoord = vUv;", "vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );", "for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {", "sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];", "imageCoord += uImageIncrement;", "}", "gl_FragColor = sum;", "}"].join("\n"),
        buildKernel: function(a) {
            function b(a, b) {
                return Math.exp(-(a * a) / (2 * b * b))
            }
            var c, d, e, f, g = 25,
                h = 2 * Math.ceil(3 * a) + 1;
            for (h > g && (h = g), f = .5 * (h - 1), d = new Array(h), e = 0, c = 0; c < h; ++c) d[c] = b(c - f, a), e += d[c];
            for (c = 0; c < h; ++c) d[c] /= e;
            return d
        }
    }
}(),
function() {
    THREE.EffectComposer = function(a, b) {
        if (this.renderer = a, void 0 === b) {
            var c = window.innerWidth || 1,
                d = window.innerHeight || 1,
                e = {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBFormat,
                    stencilBuffer: !1
                };
            b = new THREE.WebGLRenderTarget(c, d, e)
        }
        this.renderTarget1 = b, this.renderTarget2 = b.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.passes = [], void 0 === THREE.CopyShader && console.error("THREE.EffectComposer relies on THREE.CopyShader"), this.copyPass = new THREE.ShaderPass(THREE.CopyShader)
    }, THREE.EffectComposer.prototype = {
        swapBuffers: function() {
            var a = this.readBuffer;
            this.readBuffer = this.writeBuffer, this.writeBuffer = a
        },
        addPass: function(a) {
            this.passes.push(a)
        },
        insertPass: function(a, b) {
            this.passes.splice(b, 0, a)
        },
        render: function(a) {
            this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
            var b, c, d = !1,
                e = this.passes.length;
            for (c = 0; c < e; c++)
                if (b = this.passes[c], b.enabled) {
                    if (b.render(this.renderer, this.writeBuffer, this.readBuffer, a, d), b.needsSwap) {
                        if (d) {
                            var f = this.renderer.context;
                            f.stencilFunc(f.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, a), f.stencilFunc(f.EQUAL, 1, 4294967295)
                        }
                        this.swapBuffers()
                    }
                    b instanceof THREE.MaskPass ? d = !0 : b instanceof THREE.ClearMaskPass && (d = !1)
                }
        },
        reset: function(a) {
            void 0 === a && (a = this.renderTarget1.clone(), a.width = window.innerWidth, a.height = window.innerHeight), this.renderTarget1 = a, this.renderTarget2 = a.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2
        },
        setSize: function(a, b) {
            var c = this.renderTarget1.clone();
            c.width = a, c.height = b, this.reset(c)
        }
    }
}(),
function() {
    THREE.MaskPass = function(a, b) {
        this.scene = a, this.camera = b, this.enabled = !0, this.clear = !0, this.needsSwap = !1, this.inverse = !1
    }, THREE.MaskPass.prototype = {
        render: function(a, b, c, d) {
            var e = a.context;
            e.colorMask(!1, !1, !1, !1), e.depthMask(!1);
            var f, g;
            this.inverse ? (f = 0, g = 1) : (f = 1, g = 0), e.enable(e.STENCIL_TEST), e.stencilOp(e.REPLACE, e.REPLACE, e.REPLACE), e.stencilFunc(e.ALWAYS, f, 4294967295), e.clearStencil(g), a.render(this.scene, this.camera, c, this.clear), a.render(this.scene, this.camera, b, this.clear), e.colorMask(!0, !0, !0, !0), e.depthMask(!0), e.stencilFunc(e.EQUAL, 1, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP)
        }
    }, THREE.ClearMaskPass = function() {
        this.enabled = !0
    }, THREE.ClearMaskPass.prototype = {
        render: function(a, b, c, d) {
            var e = a.context;
            e.disable(e.STENCIL_TEST)
        }
    }
}(),
function() {
    THREE.RenderPass = function(a, b, c, d, e) {
        this.scene = a, this.camera = b, this.overrideMaterial = c, this.clearColor = d, this.clearAlpha = void 0 !== e ? e : 1, this.oldClearColor = new THREE.Color, this.oldClearAlpha = 1, this.enabled = !0, this.clear = !0, this.needsSwap = !1
    }, THREE.RenderPass.prototype = {
        render: function(a, b, c, d) {
            this.scene.overrideMaterial = this.overrideMaterial, this.clearColor && (this.oldClearColor.copy(a.getClearColor()), this.oldClearAlpha = a.getClearAlpha(), a.setClearColor(this.clearColor, this.clearAlpha)), a.render(this.scene, this.camera, c, this.clear), this.clearColor && a.setClearColor(this.oldClearColor, this.oldClearAlpha), this.scene.overrideMaterial = null
        }
    }
}(),
function() {
    THREE.ShaderPass = function(a, b) {
        this.textureID = void 0 !== b ? b : "tDiffuse", this.uniforms = THREE.UniformsUtils.clone(a.uniforms), this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: a.vertexShader,
            fragmentShader: a.fragmentShader
        }), this.renderToScreen = !1, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.camera = new THREE.OrthographicCamera((-1), 1, 1, (-1), 0, 1), this.scene = new THREE.Scene, this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null), this.scene.add(this.quad)
    }, THREE.ShaderPass.prototype = {
        render: function(a, b, c, d) {
            this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = c), this.quad.material = this.material, this.renderToScreen ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear)
        }
    }
}(),
function() {
    THREE.BloomPass = function(a, b, c, d) {
        a = void 0 !== a ? a : 1, b = void 0 !== b ? b : 25, c = void 0 !== c ? c : 4, d = void 0 !== d ? d : 256;
        var e = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat
        };
        this.renderTargetX = new THREE.WebGLRenderTarget(d, d, e), this.renderTargetY = new THREE.WebGLRenderTarget(d, d, e), void 0 === THREE.CopyShader && console.error("THREE.BloomPass relies on THREE.CopyShader");
        var f = THREE.CopyShader;
        this.copyUniforms = THREE.UniformsUtils.clone(f.uniforms), this.copyUniforms.opacity.value = a, this.materialCopy = new THREE.ShaderMaterial({
            uniforms: this.copyUniforms,
            vertexShader: f.vertexShader,
            fragmentShader: f.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: !0
        }), void 0 === THREE.ConvolutionShader && console.error("THREE.BloomPass relies on THREE.ConvolutionShader");
        var g = THREE.ConvolutionShader;
        this.convolutionUniforms = THREE.UniformsUtils.clone(g.uniforms), this.convolutionUniforms.uImageIncrement.value = THREE.BloomPass.blurx, this.convolutionUniforms.cKernel.value = THREE.ConvolutionShader.buildKernel(c), this.materialConvolution = new THREE.ShaderMaterial({
            uniforms: this.convolutionUniforms,
            vertexShader: g.vertexShader,
            fragmentShader: g.fragmentShader,
            defines: {
                KERNEL_SIZE_FLOAT: b.toFixed(1),
                KERNEL_SIZE_INT: b.toFixed(0)
            }
        }), this.enabled = !0, this.needsSwap = !1, this.clear = !1, this.camera = new THREE.OrthographicCamera((-1), 1, 1, (-1), 0, 1), this.scene = new THREE.Scene, this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null), this.scene.add(this.quad)
    }, THREE.BloomPass.prototype = {
        render: function(a, b, c, d, e) {
            e && a.context.disable(a.context.STENCIL_TEST), this.quad.material = this.materialConvolution, this.convolutionUniforms.tDiffuse.value = c, this.convolutionUniforms.uImageIncrement.value = THREE.BloomPass.blurX, a.render(this.scene, this.camera, this.renderTargetX, !0), this.convolutionUniforms.tDiffuse.value = this.renderTargetX, this.convolutionUniforms.uImageIncrement.value = THREE.BloomPass.blurY, a.render(this.scene, this.camera, this.renderTargetY, !0), this.quad.material = this.materialCopy, this.copyUniforms.tDiffuse.value = this.renderTargetY, e && a.context.enable(a.context.STENCIL_TEST), a.render(this.scene, this.camera, c, this.clear)
        }
    }, THREE.BloomPass.blurX = new THREE.Vector2(.001953125, 0), THREE.BloomPass.blurY = new THREE.Vector2(0, .001953125)
}();