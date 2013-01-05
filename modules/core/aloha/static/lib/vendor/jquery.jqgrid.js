define('jqgrid',
  ['jquery', 'jqgrid-locale-' + (window && window.__DEPS__ && window.__DEPS__.lang || 'en'), 'jqueryui'],
  function (jQuery) {
    var $ = jQuery;

    /* 
     * jqGrid  4.0.0 - jQuery Grid 
     * Copyright (c) 2008, Tony Tomov, tony@trirand.com 
     * Dual licensed under the MIT and GPL licenses 
     * http://www.opensource.org/licenses/mit-license.php 
     * http://www.gnu.org/licenses/gpl-2.0.html 
     * Date:2011-04-09 
     * Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js; 
     */
    /*
     jqGrid  4.0  - jQuery Grid
     Copyright (c) 2008, Tony Tomov, tony@trirand.com
     Dual licensed under the MIT and GPL licenses
     http://www.opensource.org/licenses/mit-license.php
     http://www.gnu.org/licenses/gpl-2.0.html
     Date: 2011-04-09
     */
    (function (b) {
      b.jgrid = b.jgrid || {};
      b.extend(b.jgrid, {htmlDecode:function (f) {
        if (f && (f == "&nbsp;" || f == "&#160;" || f.length == 1 && f.charCodeAt(0) == 160)) {
          return"";
        }
        return!f ? f : String(f).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"')
      }, htmlEncode:function (f) {
        return!f ? f : String(f).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;")
      }, format:function (f) {
        var j = b.makeArray(arguments).slice(1);
        if (f === undefined) {
          f = "";
        }
        return f.replace(/\{(\d+)\}/g,
          function (h, c) {
            return j[c]
          })
      }, getCellIndex:function (f) {
        f = b(f);
        if (f.is("tr")) {
          return-1;
        }
        f = (!f.is("td") && !f.is("th") ? f.closest("td,th") : f)[0];
        if (b.browser.msie) {
          return b.inArray(f, f.parentNode.cells);
        }
        return f.cellIndex
      }, stripHtml:function (f) {
        f += "";
        var j = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
        if (f) {
          return(f = f.replace(j, "")) && f !== "&nbsp;" && f !== "&#160;" ? f.replace(/\"/g, "'") : "";
        } else {
          return f
        }
      }, stringToDoc:function (f) {
        var j;
        if (typeof f !== "string") {
          return f;
        }
        try {
          j = (new DOMParser).parseFromString(f, "text/xml")
        } catch (h) {
          j =
            new ActiveXObject("Microsoft.XMLDOM");
          j.async = false;
          j.loadXML(f)
        }
        return j && j.documentElement && j.documentElement.tagName != "parsererror" ? j : null
      }, parse:function (f) {
        if (f.substr(0, 9) == "while(1);") {
          f = f.substr(9);
        }
        if (f.substr(0, 2) == "/*") {
          f = f.substr(2, f.length - 4);
        }
        f || (f = "{}");
        return b.jgrid.useJSON === true && typeof JSON === "object" && typeof JSON.parse === "function" ? JSON.parse(f) : eval("(" + f + ")")
      }, parseDate:function (f, j) {
        var h = {m:1, d:1, y:1970, h:0, i:0, s:0}, c, g, k;
        c = /[\\\/:_;.,\t\T\s-]/;
        if (j && j !== null && j !== undefined) {
          j =
            b.trim(j);
          j = j.split(c);
          f = f.split(c);
          var l = b.jgrid.formatter.date.monthNames, a = b.jgrid.formatter.date.AmPm, r = function (v, z) {
            if (v === 0) {
              if (z == 12) {
                z = 0
              }
            } else if (z != 12) {
              z += 12;
            }
            return z
          };
          c = 0;
          for (g = f.length; c < g; c++) {
            if (f[c] == "M") {
              k = b.inArray(j[c], l);
              if (k !== -1 && k < 12) {
                j[c] = k + 1
              }
            }
            if (f[c] == "F") {
              k = b.inArray(j[c], l);
              if (k !== -1 && k > 11) {
                j[c] = k + 1 - 12
              }
            }
            if (f[c] == "a") {
              k = b.inArray(j[c], a);
              if (k !== -1 && k < 2 && j[c] == a[k]) {
                j[c] = k;
                h.h = r(j[c], h.h)
              }
            }
            if (f[c] == "A") {
              k = b.inArray(j[c], a);
              if (k !== -1 && k > 1 && j[c] == a[k]) {
                j[c] = k - 2;
                h.h = r(j[c], h.h)
              }
            }
            if (j[c] !==
              undefined) {
              h[f[c].toLowerCase()] = parseInt(j[c], 10)
            }
          }
          h.m = parseInt(h.m, 10) - 1;
          c = h.y;
          if (c >= 70 && c <= 99) {
            h.y = 1900 + h.y;
          } else if (c >= 0 && c <= 69) {
            h.y = 2E3 + h.y
          }
        }
        return new Date(h.y, h.m, h.d, h.h, h.i, h.s, 0)
      }, jqID:function (f) {
        f += "";
        return f.replace(/([\.\:\[\]])/g, "\\$1")
      }, guid:1, uidPref:"jqg", randId:function (f) {
        return(f ? f : b.jgrid.uidPref) + b.jgrid.guid++
      }, getAccessor:function (f, j) {
        var h, c, g = [], k;
        if (typeof j === "function") {
          return j(f);
        }
        h = f[j];
        if (h === undefined) {
          try {
            if (typeof j === "string") {
              g = j.split(".");
            }
            if (k = g.length) {
              for (h = f; h &&
                k--;) {
                c = g.shift();
                h = h[c]
              }
            }
          } catch (l) {
          }
        }
        return h
      }, ajaxOptions:{}, from:function (f) {
        return new function (j, h) {
          if (typeof j == "string") {
            j = b.data(j);
          }
          var c = this, g = j, k = true, l = false, a = h, r = /[\$,%]/g, v = null, z = null, E = false, P = "", K = [], O = true;
          if (typeof j == "object" && j.push) {
            if (j.length > 0) {
              O = typeof j[0] != "object" ? false : true
            }
          } else {
            throw"data provides is not an array";
          }
          this._hasData = function () {
            return g === null ? false : g.length === 0 ? false : true
          };
          this._getStr = function (m) {
            var o = [];
            l && o.push("jQuery.trim(");
            o.push("String(" + m + ")");
            l &&
            o.push(")");
            k || o.push(".toLowerCase()");
            return o.join("")
          };
          this._strComp = function (m) {
            return typeof m == "string" ? ".toString()" : ""
          };
          this._group = function (m, o) {
            return{field:m.toString(), unique:o, items:[]}
          };
          this._toStr = function (m) {
            if (l) {
              m = b.trim(m);
            }
            k || (m = m.toLowerCase());
            return m = m.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"')
          };
          this._funcLoop = function (m) {
            var o = [];
            b.each(g, function (q, B) {
              o.push(m(B))
            });
            return o
          };
          this._append = function (m) {
            if (a === null) {
              a = "";
            } else {
              a += P === "" ? " && " : P;
            }
            if (E) {
              a += "!";
            }
            a += "(" + m +
              ")";
            E = false;
            P = ""
          };
          this._setCommand = function (m, o) {
            v = m;
            z = o
          };
          this._resetNegate = function () {
            E = false
          };
          this._repeatCommand = function (m, o) {
            if (v === null) {
              return c;
            }
            if (m !== null && o !== null) {
              return v(m, o);
            }
            if (z === null) {
              return v(m);
            }
            if (!O) {
              return v(m);
            }
            return v(z, m)
          };
          this._equals = function (m, o) {
            return c._compare(m, o, 1) === 0
          };
          this._compare = function (m, o, q) {
            if (q === undefined) {
              q = 1;
            }
            if (m === undefined) {
              m = null;
            }
            if (o === undefined) {
              o = null;
            }
            if (m === null && o === null) {
              return 0;
            }
            if (m === null && o !== null) {
              return 1;
            }
            if (m !== null && o === null) {
              return-1;
            }
            if (!k && typeof m !==
              "number" && typeof o !== "number") {
              m = String(m).toLowerCase();
              o = String(o).toLowerCase()
            }
            if (m < o) {
              return-q;
            }
            if (m > o) {
              return q;
            }
            return 0
          };
          this._performSort = function () {
            if (K.length !== 0) {
              g = c._doSort(g, 0)
            }
          };
          this._doSort = function (m, o) {
            var q = K[o].by, B = K[o].dir, T = K[o].type, J = K[o].datefmt;
            if (o == K.length - 1) {
              return c._getOrder(m, q, B, T, J);
            }
            o++;
            q = c._getGroup(m, q, B, T, J);
            B = [];
            for (T = 0; T < q.length; T++) {
              J = c._doSort(q[T].items, o);
              for (var D = 0; D < J.length; D++) {
                B.push(J[D])
              }
            }
            return B
          };
          this._getOrder = function (m, o, q, B, T) {
            var J = [], D = [], W = q ==
              "a" ? 1 : -1, U, ga;
            if (B === undefined) {
              B = "text";
            }
            ga = B == "float" || B == "number" || B == "currency" || B == "numeric" ? function (S) {
              S = parseFloat(String(S).replace(r, ""));
              return isNaN(S) ? 0 : S
            } : B == "int" || B == "integer" ? function (S) {
              return S ? parseFloat(String(S).replace(r, "")) : 0
            } : B == "date" || B == "datetime" ? function (S) {
              return b.jgrid.parseDate(T, S).getTime()
            } : b.isFunction(B) ? B : function (S) {
              S || (S = "");
              return b.trim(String(S).toUpperCase())
            };
            b.each(m, function (S, aa) {
              U = o !== "" ? b.jgrid.getAccessor(aa, o) : aa;
              if (U === undefined) {
                U = "";
              }
              U = ga(U, aa);
              D.push({vSort:U, index:S})
            });
            D.sort(function (S, aa) {
              S = S.vSort;
              aa = aa.vSort;
              return c._compare(S, aa, W)
            });
            B = 0;
            for (var ca = m.length; B < ca;) {
              q = D[B].index;
              J.push(m[q]);
              B++
            }
            return J
          };
          this._getGroup = function (m, o, q, B, T) {
            var J = [], D = null, W = null, U;
            b.each(c._getOrder(m, o, q, B, T), function (ga, ca) {
              U = b.jgrid.getAccessor(ca, o);
              if (U === undefined) {
                U = "";
              }
              if (!c._equals(W, U)) {
                W = U;
                D !== null && J.push(D);
                D = c._group(o, U)
              }
              D.items.push(ca)
            });
            D !== null && J.push(D);
            return J
          };
          this.ignoreCase = function () {
            k = false;
            return c
          };
          this.useCase = function () {
            k =
              true;
            return c
          };
          this.trim = function () {
            l = true;
            return c
          };
          this.noTrim = function () {
            l = false;
            return c
          };
          this.execute = function () {
            var m = a, o = [];
            if (m === null) {
              return c;
            }
            b.each(g, function () {
              eval(m) && o.push(this)
            });
            g = o;
            return c
          };
          this.data = function () {
            return g
          };
          this.select = function (m) {
            c._performSort();
            if (!c._hasData()) {
              return[];
            }
            c.execute();
            if (b.isFunction(m)) {
              var o = [];
              b.each(g, function (q, B) {
                o.push(m(B))
              });
              return o
            }
            return g
          };
          this.hasMatch = function () {
            if (!c._hasData()) {
              return false;
            }
            c.execute();
            return g.length > 0
          };
          this.andNot =
            function (m, o, q) {
              E = !E;
              return c.and(m, o, q)
            };
          this.orNot = function (m, o, q) {
            E = !E;
            return c.or(m, o, q)
          };
          this.not = function (m, o, q) {
            return c.andNot(m, o, q)
          };
          this.and = function (m, o, q) {
            P = " && ";
            if (m === undefined) {
              return c;
            }
            return c._repeatCommand(m, o, q)
          };
          this.or = function (m, o, q) {
            P = " || ";
            if (m === undefined) {
              return c;
            }
            return c._repeatCommand(m, o, q)
          };
          this.isNot = function (m) {
            E = !E;
            return c.is(m)
          };
          this.is = function (m) {
            c._append("this." + m);
            c._resetNegate();
            return c
          };
          this._compareValues = function (m, o, q, B, T) {
            var J;
            J = O ? "jQuery.jgrid.getAccessor(this,'" +
              o + "')" : "this";
            if (q === undefined) {
              q = null;
            }
            var D = q, W = T.stype === undefined ? "text" : T.stype;
            if (q !== null) {
              switch (W) {
                case "int":
                case "integer":
                  D = isNaN(Number(D)) || D === "" ? "0" : D;
                  J = "parseInt(" + J + ",10)";
                  D = "parseInt(" + D + ",10)";
                  break;
                case "float":
                case "number":
                case "numeric":
                  D = String(D).replace(r, "");
                  D = isNaN(Number(D)) || D === "" ? "0" : D;
                  J = "parseFloat(" + J + ")";
                  D = "parseFloat(" + D + ")";
                  break;
                case "date":
                case "datetime":
                  D = String(b.jgrid.parseDate(T.newfmt || "Y-m-d", D).getTime());
                  J = 'jQuery.jgrid.parseDate("' + T.srcfmt + '",' + J + ").getTime()";
                  break;
                default:
                  J = c._getStr(J);
                  D = c._getStr('"' + c._toStr(D) + '"')
              }
            }
            c._append(J + " " + B + " " + D);
            c._setCommand(m, o);
            c._resetNegate();
            return c
          };
          this.equals = function (m, o, q) {
            return c._compareValues(c.equals, m, o, "==", q)
          };
          this.notEquals = function (m, o, q) {
            return c._compareValues(c.equals, m, o, "!==", q)
          };
          this.isNull = function (m, o, q) {
            return c._compareValues(c.equals, m, null, "===", q)
          };
          this.greater = function (m, o, q) {
            return c._compareValues(c.greater, m, o, ">", q)
          };
          this.less = function (m, o, q) {
            return c._compareValues(c.less, m, o, "<",
              q)
          };
          this.greaterOrEquals = function (m, o, q) {
            return c._compareValues(c.greaterOrEquals, m, o, ">=", q)
          };
          this.lessOrEquals = function (m, o, q) {
            return c._compareValues(c.lessOrEquals, m, o, "<=", q)
          };
          this.startsWith = function (m, o) {
            var q = o === undefined || o === null ? m : o;
            q = l ? b.trim(q.toString()).length : q.toString().length;
            if (O) {
              c._append(c._getStr("jQuery.jgrid.getAccessor(this,'" + m + "')") + ".substr(0," + q + ") == " + c._getStr('"' + c._toStr(o) + '"'));
            } else {
              q = l ? b.trim(o.toString()).length : o.toString().length;
              c._append(c._getStr("this") +
                ".substr(0," + q + ") == " + c._getStr('"' + c._toStr(m) + '"'))
            }
            c._setCommand(c.startsWith, m);
            c._resetNegate();
            return c
          };
          this.endsWith = function (m, o) {
            var q = o === undefined || o === null ? m : o;
            q = l ? b.trim(q.toString()).length : q.toString().length;
            O ? c._append(c._getStr("jQuery.jgrid.getAccessor(this,'" + m + "')") + ".substr(" + c._getStr("jQuery.jgrid.getAccessor(this,'" + m + "')") + ".length-" + q + "," + q + ') == "' + c._toStr(o) + '"') : c._append(c._getStr("this") + ".substr(" + c._getStr("this") + '.length-"' + c._toStr(m) + '".length,"' + c._toStr(m) +
              '".length) == "' + c._toStr(m) + '"');
            c._setCommand(c.endsWith, m);
            c._resetNegate();
            return c
          };
          this.contains = function (m, o) {
            O ? c._append(c._getStr("jQuery.jgrid.getAccessor(this,'" + m + "')") + '.indexOf("' + c._toStr(o) + '",0) > -1') : c._append(c._getStr("this") + '.indexOf("' + c._toStr(m) + '",0) > -1');
            c._setCommand(c.contains, m);
            c._resetNegate();
            return c
          };
          this.groupBy = function (m, o, q, B) {
            if (!c._hasData()) {
              return null;
            }
            return c._getGroup(g, m, o, q, B)
          };
          this.orderBy = function (m, o, q, B) {
            o = o === undefined || o === null ? "a" : b.trim(o.toString().toLowerCase());
            if (q === null || q === undefined) {
              q = "text";
            }
            if (B === null || B === undefined) {
              B = "Y-m-d";
            }
            if (o == "desc" || o == "descending") {
              o = "d";
            }
            if (o == "asc" || o == "ascending") {
              o = "a";
            }
            K.push({by:m, dir:o, type:q, datefmt:B});
            return c
          };
          return c
        }(f, null)
      }, extend:function (f) {
        b.extend(b.fn.jqGrid, f);
        this.no_legacy_api || b.fn.extend(f)
      }});
      b.fn.jqGrid = function (f) {
        if (typeof f == "string") {
          var j = b.jgrid.getAccessor(b.fn.jqGrid, f);
          if (!j) {
            throw"jqGrid - No such method: " + f;
          }
          var h = b.makeArray(arguments).slice(1);
          return j.apply(this, h)
        }
        return this.each(function () {
          if (!this.grid) {
            var c =
                b.extend(true, {url:"", height:150, page:1, rowNum:20, rowTotal:null, records:0, pager:"", pgbuttons:true, pginput:true, colModel:[], rowList:[], colNames:[], sortorder:"asc", sortname:"", datatype:"xml", mtype:"GET", altRows:false, selarrrow:[], savedRow:[], shrinkToFit:true, xmlReader:{}, jsonReader:{}, subGrid:false, subGridModel:[], reccount:0, lastpage:0, lastsort:0, selrow:null, beforeSelectRow:null, onSelectRow:null, onSortCol:null, ondblClickRow:null, onRightClickRow:null, onPaging:null, onSelectAll:null, loadComplete:null,
                  gridComplete:null, loadError:null, loadBeforeSend:null, afterInsertRow:null, beforeRequest:null, onHeaderClick:null, viewrecords:false, loadonce:false, multiselect:false, multikey:false, editurl:null, search:false, caption:"", hidegrid:true, hiddengrid:false, postData:{}, userData:{}, treeGrid:false, treeGridModel:"nested", treeReader:{}, treeANode:-1, ExpandColumn:null, tree_root_level:0, prmNames:{page:"page", rows:"rows", sort:"sidx", order:"sord", search:"_search", nd:"nd", id:"id", oper:"oper", editoper:"edit", addoper:"add",
                    deloper:"del", subgridid:"id", npage:null, totalrows:"totalrows"}, forceFit:false, gridstate:"visible", cellEdit:false, cellsubmit:"remote", nv:0, loadui:"enable", toolbar:[false, ""], scroll:false, multiboxonly:false, deselectAfterSort:true, scrollrows:false, autowidth:false, scrollOffset:18, cellLayout:5, subGridWidth:20, multiselectWidth:20, gridview:false, rownumWidth:25, rownumbers:false, pagerpos:"center", recordpos:"right", footerrow:false, userDataOnFooter:false, hoverrows:true, altclass:"ui-priority-secondary", viewsortcols:[false,
                    "vertical", true], resizeclass:"", autoencode:false, remapColumns:[], ajaxGridOptions:{}, direction:"ltr", toppager:false, headertitles:false, scrollTimeout:40, data:[], _index:{}, grouping:false, groupingView:{groupField:[], groupOrder:[], groupText:[], groupColumnShow:[], groupSummary:[], showSummaryOnHide:false, sortitems:[], sortnames:[], groupDataSorted:false, summary:[], summaryval:[], plusicon:"ui-icon-circlesmall-plus", minusicon:"ui-icon-circlesmall-minus"}, ignoreCase:false, cmTemplate:{}}, b.jgrid.defaults, f || {}),
              g = {headers:[], cols:[], footers:[], dragStart:function (e, d, i) {
                this.resizing = {idx:e, startX:d.clientX, sOL:i[0]};
                this.hDiv.style.cursor = "col-resize";
                this.curGbox = b("#rs_m" + b.jgrid.jqID(c.id), "#gbox_" + b.jgrid.jqID(c.id));
                this.curGbox.css({display:"block", left:i[0], top:i[1], height:i[2]});
                b.isFunction(c.resizeStart) && c.resizeStart.call(this, d, e);
                document.onselectstart = function () {
                  return false
                }
              }, dragMove:function (e) {
                if (this.resizing) {
                  var d = e.clientX - this.resizing.startX;
                  e = this.headers[this.resizing.idx];
                  var i =
                    c.direction === "ltr" ? e.width + d : e.width - d, n;
                  if (i > 33) {
                    this.curGbox.css({left:this.resizing.sOL + d});
                    if (c.forceFit === true) {
                      n = this.headers[this.resizing.idx + c.nv];
                      d = c.direction === "ltr" ? n.width - d : n.width + d;
                      if (d > 33) {
                        e.newWidth = i;
                        n.newWidth = d
                      }
                    } else {
                      this.newWidth = c.direction === "ltr" ? c.tblwidth + d : c.tblwidth - d;
                      e.newWidth = i
                    }
                  }
                }
              }, dragEnd:function () {
                this.hDiv.style.cursor = "default";
                if (this.resizing) {
                  var e = this.resizing.idx, d = this.headers[e].newWidth || this.headers[e].width;
                  d = parseInt(d, 10);
                  this.resizing = false;
                  b("#rs_m" +
                    b.jgrid.jqID(c.id)).css("display", "none");
                  c.colModel[e].width = d;
                  this.headers[e].width = d;
                  this.headers[e].el.style.width = d + "px";
                  this.cols[e].style.width = d + "px";
                  if (this.footers.length > 0) {
                    this.footers[e].style.width = d + "px";
                  }
                  if (c.forceFit === true) {
                    d = this.headers[e + c.nv].newWidth || this.headers[e + c.nv].width;
                    this.headers[e + c.nv].width = d;
                    this.headers[e + c.nv].el.style.width = d + "px";
                    this.cols[e + c.nv].style.width = d + "px";
                    if (this.footers.length > 0) {
                      this.footers[e + c.nv].style.width = d + "px";
                    }
                    c.colModel[e + c.nv].width = d
                  } else {
                    c.tblwidth =
                      this.newWidth || c.tblwidth;
                    b("table:first", this.bDiv).css("width", c.tblwidth + "px");
                    b("table:first", this.hDiv).css("width", c.tblwidth + "px");
                    this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                    if (c.footerrow) {
                      b("table:first", this.sDiv).css("width", c.tblwidth + "px");
                      this.sDiv.scrollLeft = this.bDiv.scrollLeft
                    }
                  }
                  b.isFunction(c.resizeStop) && c.resizeStop.call(this, d, e)
                }
                this.curGbox = null;
                document.onselectstart = function () {
                  return true
                }
              }, populateVisible:function () {
                g.timer && clearTimeout(g.timer);
                g.timer = null;
                var e = b(g.bDiv).height();
                if (e) {
                  var d = b("table:first", g.bDiv), i, n;
                  if (d[0].rows.length) {
                    try {
                      n = (i = d[0].rows[1]) ? b(i).outerHeight() || g.prevRowHeight : g.prevRowHeight
                    } catch (p) {
                      n = g.prevRowHeight
                    }
                  }
                  if (n) {
                    g.prevRowHeight = n;
                    var A = c.rowNum;
                    i = g.scrollTop = g.bDiv.scrollTop;
                    var s = Math.round(d.position().top) - i, F = s + d.height();
                    n *= A;
                    var t, y, x;
                    if (F < e && s <= 0 && (c.lastpage === undefined || parseInt((F + i + n - 1) / n, 10) <= c.lastpage)) {
                      y = parseInt((e - F + n - 1) / n, 10);
                      if (F >= 0 || y < 2 || c.scroll === true) {
                        t = Math.round((F + i) / n) + 1;
                        s = -1
                      } else {
                        s = 1
                      }
                    }
                    if (s > 0) {
                      t = parseInt(i / n, 10) + 1;
                      y = parseInt((i + e) / n, 10) + 2 - t;
                      x = true
                    }
                    if (y) {
                      if (!(c.lastpage && t > c.lastpage || c.lastpage == 1 || t === c.page && t === c.lastpage)) {
                        if (g.hDiv.loading) {
                          g.timer = setTimeout(g.populateVisible, c.scrollTimeout);
                        } else {
                          c.page = t;
                          if (x) {
                            g.selectionPreserver(d[0]);
                            g.emptyRows(g.bDiv, false, false)
                          }
                          g.populate(y)
                        }
                      }
                    }
                  }
                }
              }, scrollGrid:function (e) {
                if (c.scroll) {
                  var d = g.bDiv.scrollTop;
                  if (g.scrollTop === undefined) {
                    g.scrollTop = 0;
                  }
                  if (d != g.scrollTop) {
                    g.scrollTop = d;
                    g.timer && clearTimeout(g.timer);
                    g.timer = setTimeout(g.populateVisible, c.scrollTimeout)
                  }
                }
                g.hDiv.scrollLeft =
                  g.bDiv.scrollLeft;
                if (c.footerrow) {
                  g.sDiv.scrollLeft = g.bDiv.scrollLeft;
                }
                e.stopPropagation()
              }, selectionPreserver:function (e) {
                var d = e.p, i = d.selrow, n = d.selarrrow ? b.makeArray(d.selarrrow) : null, p = e.grid.bDiv.scrollLeft, A = d.gridComplete;
                d.gridComplete = function () {
                  d.selrow = null;
                  d.selarrrow = [];
                  if (d.multiselect && n && n.length > 0) {
                    for (var s = 0; s < n.length; s++) {
                      n[s] != i && b(e).jqGrid("setSelection", n[s], false);
                    }
                  }
                  i && b(e).jqGrid("setSelection", i, false);
                  e.grid.bDiv.scrollLeft = p;
                  d.gridComplete = A;
                  d.gridComplete && A()
                }
              }};
            if (this.tagName !=
              "TABLE")alert("Element is not a table"); else {
              b(this).empty().attr("tabindex", "1");
              this.p = c;
              var k, l, a;
              if (this.p.colNames.length === 0) {
                for (k = 0; k < this.p.colModel.length; k++) {
                  this.p.colNames[k] = this.p.colModel[k].label || this.p.colModel[k].name;
                }
              }
              if (this.p.colNames.length !== this.p.colModel.length)alert(b.jgrid.errors.model); else {
                var r = b("<div class='ui-jqgrid-view'></div>"), v, z = b.browser.msie ? true : false, E = b.browser.webkit || b.browser.safari ? true : false;
                a = this;
                a.p.direction = b.trim(a.p.direction.toLowerCase());
                if (b.inArray(a.p.direction, ["ltr", "rtl"]) == -1) {
                  a.p.direction = "ltr";
                }
                l = a.p.direction;
                b(r).insertBefore(this);
                b(this).appendTo(r).removeClass("scroll");
                var P = b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                b(P).insertBefore(r).attr({id:"gbox_" + this.id, dir:l});
                b(r).appendTo(P).attr("id", "gview_" + this.id);
                v = z && b.browser.version <= 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "";
                b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" +
                  this.id + "'></div>").append(v).insertBefore(r);
                b("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(r);
                b(this).attr({cellspacing:"0", cellpadding:"0", border:"0", role:"grid", "aria-multiselectable":!!this.p.multiselect, "aria-labelledby":"gbox_" + this.id});
                var K = function (e, d) {
                  e = parseInt(e, 10);
                  return isNaN(e) ? d ? d : 0 : e
                }, O = function (e, d, i, n, p, A) {
                  var s = a.p.colModel[e], F = s.align, t = 'style="', y = s.classes, x = s.name, w = [];
                  if (F) {
                    t += "text-align:" + F + ";";
                  }
                  if (s.hidden === true) {
                    t += "display:none;";
                  }
                  if (d === 0) {
                    t += "width: " + g.headers[e].width + "px;";
                  } else if (s.cellattr && b.isFunction(s.cellattr)) {
                    if ((e = s.cellattr.call(a, p, i, n, s, A)) && typeof e === "string") {
                      e = e.replace(/style/i, "style").replace(/title/i, "title");
                      if (e.indexOf("title") > -1) {
                        s.title = false;
                      }
                      if (e.indexOf("class") > -1) {
                        y = undefined;
                      }
                      w = e.split("style");
                      if (w.length === 2) {
                        w[1] = b.trim(w[1].replace("=", ""));
                        if (w[1].indexOf("'") === 0 || w[1].indexOf('"') === 0) {
                          w[1] = w[1].substring(1);
                        }
                        t += w[1].replace(/'/gi, '"')
                      } else {
                        t += '"'
                      }
                    }
                  }
                  if (!w.length) {
                    w[0] =
                      "";
                    t += '"'
                  }
                  t += (y !== undefined ? ' class="' + y + '"' : "") + (s.title && i ? ' title="' + b.jgrid.stripHtml(i) + '"' : "");
                  t += ' aria-describedby="' + a.p.id + "_" + x + '"';
                  return t + w[0]
                }, m = function (e) {
                  return e === undefined || e === null || e === "" ? "&#160;" : a.p.autoencode ? b.jgrid.htmlEncode(e) : e + ""
                }, o = function (e, d, i, n, p) {
                  var A = a.p.colModel[i];
                  if (typeof A.formatter !== "undefined") {
                    e = {rowId:e, colModel:A, gid:a.p.id, pos:i};
                    d = b.isFunction(A.formatter) ? A.formatter.call(a, d, e, n, p) : b.fmatter ? b.fn.fmatter(A.formatter, d, e, n, p) : m(d)
                  } else {
                    d = m(d);
                  }
                  return d
                }, q = function (e, d, i, n, p) {
                  d = o(e, d, i, p, "add");
                  return'<td role="gridcell" ' + O(i, n, d, p, e, true) + ">" + d + "</td>"
                }, B = function (e, d, i) {
                  var n = '<input role="checkbox" type="checkbox" id="jqg_' + a.p.id + "_" + e + '" class="cbox" name="jqg_' + a.p.id + "_" + e + '"/>';
                  return'<td role="gridcell" ' + O(d, i, "", null, e, true) + ">" + n + "</td>"
                }, T = function (e, d, i, n) {
                  i = (parseInt(i, 10) - 1) * parseInt(n, 10) + 1 + d;
                  return'<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + O(e, d, i, null, d, true) + ">" + i + "</td>"
                }, J = function (e) {
                  var d, i = [],
                    n = 0, p;
                  for (p = 0; p < a.p.colModel.length; p++) {
                    d = a.p.colModel[p];
                    if (d.name !== "cb" && d.name !== "subgrid" && d.name !== "rn") {
                      i[n] = e == "local" ? d.name : e == "xml" ? d.xmlmap || d.name : d.jsonmap || d.name;
                      n++
                    }
                  }
                  return i
                }, D = function (e) {
                  var d = a.p.remapColumns;
                  if (!d || !d.length) {
                    d = b.map(a.p.colModel, function (i, n) {
                      return n
                    });
                  }
                  if (e) {
                    d = b.map(d, function (i) {
                      return i < e ? null : i - e
                    });
                  }
                  return d
                }, W = function (e, d, i) {
                  if (a.p.deepempty) {
                    b("#" + b.jgrid.jqID(a.p.id) + " tbody:first tr:gt(0)").remove();
                  } else {
                    var n = b("#" + b.jgrid.jqID(a.p.id) + " tbody:first tr:first")[0];
                    b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").empty().append(n)
                  }
                  if (d && a.p.scroll) {
                    b(">div:first", e).css({height:"auto"}).children("div:first").css({height:0, display:"none"});
                    e.scrollTop = 0
                  }
                  if (i === true) {
                    if (a.p.treeGrid === true) {
                      a.p.data = [];
                      a.p._index = {}
                    }
                  }
                }, U = function () {
                  var e = a.p.data.length, d, i, n;
                  d = a.p.rownumbers === true ? 1 : 0;
                  i = a.p.multiselect === true ? 1 : 0;
                  n = a.p.subGrid === true ? 1 : 0;
                  d = a.p.keyIndex === false || a.p.loadonce === true ? a.p.localReader.id : a.p.colModel[a.p.keyIndex + i + n + d].name;
                  for (i = 0; i < e; i++) {
                    n = b.jgrid.getAccessor(a.p.data[i],
                      d);
                    a.p._index[n] = i
                  }
                }, ga = function (e, d, i, n, p) {
                  var A = new Date, s = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "xmlstring", F = a.p.datatype == "local" ? "local" : "xml";
                  if (s) {
                    a.p.data = [];
                    a.p._index = {};
                    a.p.localReader.id = "_id_"
                  }
                  a.p.reccount = 0;
                  if (b.isXMLDoc(e)) {
                    if (a.p.treeANode === -1 && !a.p.scroll) {
                      W(d, false, true);
                      i = 1
                    } else {
                      i = i > 1 ? i : 1;
                    }
                    var t, y, x = 0, w, G = 0, Q = 0, M = 0, L, N = [], Y, I = {}, u, C, H = [], ha = a.p.altRows === true ? " " + a.p.altclass : "";
                    a.p.xmlReader.repeatitems || (N = J(F));
                    L = a.p.keyIndex === false ? a.p.xmlReader.id : a.p.keyIndex;
                    if (N.length > 0 && !isNaN(L)) {
                      if (a.p.remapColumns && a.p.remapColumns.length) {
                        L = b.inArray(L, a.p.remapColumns);
                      }
                      L = N[L]
                    }
                    F = (L + "").indexOf("[") === -1 ? N.length ? function (ea, $) {
                      return b(L, ea).text() || $
                    } : function (ea, $) {
                      return b(a.p.xmlReader.cell, ea).eq(L).text() || $
                    } : function (ea, $) {
                      return ea.getAttribute(L.replace(/[\[\]]/g, "")) || $
                    };
                    a.p.userData = {};
                    b(a.p.xmlReader.page, e).each(function () {
                      a.p.page = this.textContent || this.text || 0
                    });
                    b(a.p.xmlReader.total, e).each(function () {
                      a.p.lastpage = this.textContent || this.text;
                      if (a.p.lastpage ===
                        undefined) {
                        a.p.lastpage = 1
                      }
                    });
                    b(a.p.xmlReader.records, e).each(function () {
                      a.p.records = this.textContent || this.text || 0
                    });
                    b(a.p.xmlReader.userdata, e).each(function () {
                      a.p.userData[this.getAttribute("name")] = this.textContent || this.text
                    });
                    (e = b(a.p.xmlReader.root + " " + a.p.xmlReader.row, e)) || (e = []);
                    var V = e.length, Z = 0, ia = {}, fa;
                    if (e && V) {
                      fa = parseInt(a.p.rowNum, 10);
                      var ra = a.p.scroll ? b.jgrid.randId() : 1;
                      if (p) {
                        fa *= p + 1;
                      }
                      p = b.isFunction(a.p.afterInsertRow);
                      var oa = "";
                      if (a.p.grouping && a.p.groupingView.groupCollapse === true) {
                        oa =
                          ' style="display:none;"';
                      }
                      for (; Z < V;) {
                        u = e[Z];
                        C = F(u, ra + Z);
                        t = i === 0 ? 0 : i + 1;
                        t = (t + Z) % 2 == 1 ? ha : "";
                        H.push("<tr" + oa + ' id="' + C + '" tabindex="-1" role="row" class ="ui-widget-content jqgrow ui-row-' + a.p.direction + "" + t + '">');
                        if (a.p.rownumbers === true) {
                          H.push(T(0, Z, a.p.page, a.p.rowNum));
                          M = 1
                        }
                        if (a.p.multiselect === true) {
                          H.push(B(C, M, Z));
                          G = 1
                        }
                        if (a.p.subGrid === true) {
                          H.push(b(a).jqGrid("addSubGridCell", G + M, Z + i));
                          Q = 1
                        }
                        if (a.p.xmlReader.repeatitems) {
                          Y || (Y = D(G + Q + M));
                          var Ba = b(a.p.xmlReader.cell, u);
                          b.each(Y, function (ea) {
                            var $ = Ba[this];
                            if (!$) {
                              return false;
                            }
                            w = $.textContent || $.text;
                            I[a.p.colModel[ea + G + Q + M].name] = w;
                            H.push(q(C, w, ea + G + Q + M, Z + i, u))
                          })
                        } else {
                          for (t = 0; t < N.length; t++) {
                            w = b(N[t], u).text();
                            I[a.p.colModel[t + G + Q + M].name] = w;
                            H.push(q(C, w, t + G + Q + M, Z + i, u))
                          }
                        }
                        H.push("</tr>");
                        if (a.p.grouping) {
                          t = a.p.groupingView.groupField.length;
                          for (var xa = [], ya = 0; ya < t; ya++) {
                            xa.push(I[a.p.groupingView.groupField[ya]]);
                          }
                          ia = b(a).jqGrid("groupingPrepare", H, xa, ia, I);
                          H = []
                        }
                        if (s || a.p.treeGrid === true) {
                          I._id_ = C;
                          a.p.data.push(I);
                          a.p._index[C] = a.p.data.length - 1
                        }
                        if (a.p.gridview ===
                          false) {
                          b("tbody:first", d).append(H.join(""));
                          p && a.p.afterInsertRow.call(a, C, I, u);
                          H = []
                        }
                        I = {};
                        x++;
                        Z++;
                        if (x == fa) {
                          break
                        }
                      }
                    }
                    if (a.p.gridview === true) {
                      y = a.p.treeANode > -1 ? a.p.treeANode : 0;
                      if (a.p.grouping) {
                        b(a).jqGrid("groupingRender", ia, a.p.colModel.length);
                        ia = null
                      } else {
                        a.p.treeGrid === true && y > 0 ? b(a.rows[y]).after(H.join("")) : b("tbody:first", d).append(H.join(""))
                      }
                    }
                    if (a.p.subGrid === true) {
                      try {
                        b(a).jqGrid("addSubGrid", G + M)
                      } catch (Ha) {
                      }
                    }
                    a.p.totaltime = new Date - A;
                    if (x > 0) {
                      if (a.p.records === 0) {
                        a.p.records = V;
                      }
                    }
                    H = null;
                    if (a.p.treeGrid ===
                      true) {
                      try {
                        b(a).jqGrid("setTreeNode", y + 1, x + y + 1)
                      } catch (Ia) {
                      }
                    }
                    if (!a.p.treeGrid && !a.p.scroll) {
                      a.grid.bDiv.scrollTop = 0;
                    }
                    a.p.reccount = x;
                    a.p.treeANode = -1;
                    a.p.userDataOnFooter && b(a).jqGrid("footerData", "set", a.p.userData, true);
                    if (s) {
                      a.p.records = V;
                      a.p.lastpage = Math.ceil(V / fa)
                    }
                    n || a.updatepager(false, true);
                    if (s) {
                      for (; x < V;) {
                        u = e[x];
                        C = F(u, x);
                        if (a.p.xmlReader.repeatitems) {
                          Y || (Y = D(G + Q + M));
                          var Ea = b(a.p.xmlReader.cell, u);
                          b.each(Y, function (ea) {
                            var $ = Ea[this];
                            if (!$) {
                              return false;
                            }
                            w = $.textContent || $.text;
                            I[a.p.colModel[ea + G +
                              Q + M].name] = w
                          })
                        } else {
                          for (t = 0; t < N.length; t++) {
                            w = b(N[t], u).text();
                            I[a.p.colModel[t + G + Q + M].name] = w
                          }
                        }
                        I._id_ = C;
                        a.p.data.push(I);
                        a.p._index[C] = a.p.data.length - 1;
                        I = {};
                        x++
                      }
                    }
                  }
                }, ca = function (e, d, i, n, p) {
                  var A = new Date;
                  if (e) {
                    if (a.p.treeANode === -1 && !a.p.scroll) {
                      W(d, false, true);
                      i = 1
                    } else {
                      i = i > 1 ? i : 1;
                    }
                    var s, F = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "jsonstring";
                    if (F) {
                      a.p.data = [];
                      a.p._index = {};
                      a.p.localReader.id = "_id_"
                    }
                    a.p.reccount = 0;
                    if (a.p.datatype == "local") {
                      d = a.p.localReader;
                      s = "local"
                    } else {
                      d = a.p.jsonReader;
                      s = "json"
                    }
                    var t = 0, y, x, w = [], G, Q = 0, M = 0, L = 0, N, Y, I = {}, u, C, H = [], ha = a.p.altRows === true ? " " + a.p.altclass : "";
                    a.p.page = b.jgrid.getAccessor(e, d.page) || 0;
                    N = b.jgrid.getAccessor(e, d.total);
                    a.p.lastpage = N === undefined ? 1 : N;
                    a.p.records = b.jgrid.getAccessor(e, d.records) || 0;
                    a.p.userData = b.jgrid.getAccessor(e, d.userdata) || {};
                    d.repeatitems || (G = w = J(s));
                    s = a.p.keyIndex === false ? d.id : a.p.keyIndex;
                    if (w.length > 0 && !isNaN(s)) {
                      if (a.p.remapColumns && a.p.remapColumns.length) {
                        s = b.inArray(s, a.p.remapColumns);
                      }
                      s = w[s]
                    }
                    (Y = b.jgrid.getAccessor(e,
                      d.root)) || (Y = []);
                    N = Y.length;
                    e = 0;
                    var V = parseInt(a.p.rowNum, 10), Z = a.p.scroll ? b.jgrid.randId() : 1;
                    if (p) {
                      V *= p + 1;
                    }
                    var ia = b.isFunction(a.p.afterInsertRow), fa = {}, ra = "";
                    if (a.p.grouping && a.p.groupingView.groupCollapse === true) {
                      ra = ' style="display:none;"';
                    }
                    for (; e < N;) {
                      p = Y[e];
                      C = b.jgrid.getAccessor(p, s);
                      if (C === undefined) {
                        C = Z + e;
                        if (w.length === 0) {
                          if (d.cell) {
                            C = b.jgrid.getAccessor(p, d.cell)[s] || C
                          }
                        }
                      }
                      y = i === 1 ? 0 : i;
                      y = (y + e) % 2 == 1 ? ha : "";
                      H.push("<tr" + ra + ' id="' + C + '" tabindex="-1" role="row" class= "ui-widget-content jqgrow ui-row-' +
                        a.p.direction + "" + y + '">');
                      if (a.p.rownumbers === true) {
                        H.push(T(0, e, a.p.page, a.p.rowNum));
                        L = 1
                      }
                      if (a.p.multiselect) {
                        H.push(B(C, L, e));
                        Q = 1
                      }
                      if (a.p.subGrid) {
                        H.push(b(a).jqGrid("addSubGridCell", Q + L, e + i));
                        M = 1
                      }
                      if (d.repeatitems) {
                        if (d.cell) {
                          p = b.jgrid.getAccessor(p, d.cell);
                        }
                        G || (G = D(Q + M + L))
                      }
                      for (x = 0; x < G.length; x++) {
                        y = b.jgrid.getAccessor(p, G[x]);
                        H.push(q(C, y, x + Q + M + L, e + i, p));
                        I[a.p.colModel[x + Q + M + L].name] = y
                      }
                      H.push("</tr>");
                      if (a.p.grouping) {
                        y = a.p.groupingView.groupField.length;
                        x = [];
                        for (var oa = 0; oa < y; oa++) {
                          x.push(I[a.p.groupingView.groupField[oa]]);
                        }
                        fa = b(a).jqGrid("groupingPrepare", H, x, fa, I);
                        H = []
                      }
                      if (F || a.p.treeGrid === true) {
                        I._id_ = C;
                        a.p.data.push(I);
                        a.p._index[C] = a.p.data.length - 1
                      }
                      if (a.p.gridview === false) {
                        b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(H.join(""));
                        ia && a.p.afterInsertRow.call(a, C, I, p);
                        H = []
                      }
                      I = {};
                      t++;
                      e++;
                      if (t == V) {
                        break
                      }
                    }
                    if (a.p.gridview === true) {
                      u = a.p.treeANode > -1 ? a.p.treeANode : 0;
                      if (a.p.grouping) {
                        b(a).jqGrid("groupingRender", fa, a.p.colModel.length);
                      } else {
                        a.p.treeGrid === true && u > 0 ? b(a.rows[u]).after(H.join("")) : b("#" + b.jgrid.jqID(a.p.id) +
                          " tbody:first").append(H.join(""))
                      }
                    }
                    if (a.p.subGrid === true) {
                      try {
                        b(a).jqGrid("addSubGrid", Q + L)
                      } catch (Ba) {
                      }
                    }
                    a.p.totaltime = new Date - A;
                    if (t > 0) {
                      if (a.p.records === 0) {
                        a.p.records = N;
                      }
                    }
                    if (a.p.treeGrid === true) {
                      try {
                        b(a).jqGrid("setTreeNode", u + 1, t + u + 1)
                      } catch (xa) {
                      }
                    }
                    if (!a.p.treeGrid && !a.p.scroll) {
                      a.grid.bDiv.scrollTop = 0;
                    }
                    a.p.reccount = t;
                    a.p.treeANode = -1;
                    a.p.userDataOnFooter && b(a).jqGrid("footerData", "set", a.p.userData, true);
                    if (F) {
                      a.p.records = N;
                      a.p.lastpage = Math.ceil(N / V)
                    }
                    n || a.updatepager(false, true);
                    if (F) {
                      for (; t < N && Y[t];) {
                        p =
                          Y[t];
                        C = b.jgrid.getAccessor(p, s);
                        if (C === undefined) {
                          C = Z + t;
                          if (w.length === 0) {
                            if (d.cell) {
                              C = b.jgrid.getAccessor(p, d.cell)[s] || C
                            }
                          }
                        }
                        if (p) {
                          if (d.repeatitems) {
                            if (d.cell) {
                              p = b.jgrid.getAccessor(p, d.cell);
                            }
                            G || (G = D(Q + M + L))
                          }
                          for (x = 0; x < G.length; x++) {
                            y = b.jgrid.getAccessor(p, G[x]);
                            I[a.p.colModel[x + Q + M + L].name] = y
                          }
                          I._id_ = C;
                          a.p.data.push(I);
                          a.p._index[C] = a.p.data.length - 1;
                          I = {}
                        }
                        t++
                      }
                    }
                  }
                }, S = function () {
                  function e(u) {
                    var C = 0, H, ha, V;
                    if (u.groups !== undefined) {
                      for (H = 0; H < u.groups.length; H++) {
                        try {
                          e(u.groups[H])
                        } catch (Z) {
                          alert(Z)
                        }
                        C++
                      }
                    }
                    if (u.rules !==
                      undefined) {
                      if (C > 0) {
                        var ia = w.select();
                        w = b.jgrid.from(ia)
                      }
                      try {
                        for (H = 0; H < u.rules.length; H++) {
                          V = u.rules[H];
                          ha = u.groupOp.toString().toUpperCase();
                          if (x[V.op] && V.field) {
                            if (C > 0 && ha && ha === "OR") {
                              w = w.or();
                            }
                            w = x[V.op](w, ha)(V.field, V.data, n[V.field])
                          }
                          C++
                        }
                      } catch (fa) {
                        alert(fa)
                      }
                    }
                  }

                  var d, i = false, n = {}, p = [], A = [], s, F, t;
                  if (b.isArray(a.p.data)) {
                    var y = a.p.grouping ? a.p.groupingView : false;
                    b.each(a.p.colModel, function () {
                      F = this.sorttype || "text";
                      if (F == "date" || F == "datetime") {
                        if (this.formatter && typeof this.formatter === "string" &&
                          this.formatter == "date") {
                          s = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : b.jgrid.formatter.date.srcformat;
                          t = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : b.jgrid.formatter.date.newformat
                        } else {
                          s = t = this.datefmt || "Y-m-d";
                        }
                        n[this.name] = {stype:F, srcfmt:s, newfmt:t}
                      } else {
                        n[this.name] = {stype:F, srcfmt:"", newfmt:""};
                      }
                      if (a.p.grouping && this.name == y.groupField[0]) {
                        var u = this.name;
                        if (typeof this.index != "undefined") {
                          u = this.index;
                        }
                        p[0] = n[u];
                        A.push(u)
                      }
                      if (!i &&
                        (this.index == a.p.sortname || this.name == a.p.sortname)) {
                        d = this.name;
                        i = true
                      }
                    });
                    if (a.p.treeGrid) {
                      b(a).jqGrid("SortTree", d, a.p.sortorder, n[d].stype, n[d].srcfmt);
                    } else {
                      var x = {eq:function (u) {
                        return u.equals
                      }, ne:function (u) {
                        return u.notEquals
                      }, lt:function (u) {
                        return u.less
                      }, le:function (u) {
                        return u.lessOrEquals
                      }, gt:function (u) {
                        return u.greater
                      }, ge:function (u) {
                        return u.greaterOrEquals
                      }, cn:function (u) {
                        return u.contains
                      }, nc:function (u, C) {
                        return C === "OR" ? u.orNot().contains : u.andNot().contains
                      }, bw:function (u) {
                        return u.startsWith
                      },
                        bn:function (u, C) {
                          return C === "OR" ? u.orNot().startsWith : u.andNot().startsWith
                        }, en:function (u, C) {
                          return C === "OR" ? u.orNot().endsWith : u.andNot().endsWith
                        }, ew:function (u) {
                          return u.endsWith
                        }, ni:function (u, C) {
                          return C === "OR" ? u.orNot().equals : u.andNot().equals
                        }, "in":function (u) {
                          return u.equals
                        }, nu:function (u) {
                          return u.isNull
                        }, nn:function (u, C) {
                          return C === "OR" ? u.orNot().isNull : u.andNot().isNull
                        }}, w = b.jgrid.from(a.p.data);
                      if (a.p.ignoreCase) {
                        w = w.ignoreCase();
                      }
                      if (a.p.search === true) {
                        var G = a.p.postData.filters;
                        if (G) {
                          if (typeof G ==
                            "string") {
                            G = b.jgrid.parse(G);
                          }
                          e(G)
                        } else {
                          try {
                            w = x[a.p.postData.searchOper](w)(a.p.postData.searchField, a.p.postData.searchString, n[a.p.postData.searchField])
                          } catch (Q) {
                          }
                        }
                      }
                      if (a.p.grouping) {
                        w.orderBy(A, y.groupOrder[0], p[0].stype, p[0].srcfmt);
                        y.groupDataSorted = true
                      }
                      if (d && a.p.sortorder && i) {
                        a.p.sortorder.toUpperCase() == "DESC" ? w.orderBy(a.p.sortname, "d", n[d].stype, n[d].srcfmt) : w.orderBy(a.p.sortname, "a", n[d].stype, n[d].srcfmt);
                      }
                      G = w.select();
                      var M = parseInt(a.p.rowNum, 10), L = G.length, N = parseInt(a.p.page, 10), Y = Math.ceil(L /
                        M), I = {};
                      G = G.slice((N - 1) * M, N * M);
                      n = w = null;
                      I[a.p.localReader.total] = Y;
                      I[a.p.localReader.page] = N;
                      I[a.p.localReader.records] = L;
                      I[a.p.localReader.root] = G;
                      G = null;
                      return I
                    }
                  }
                }, aa = function () {
                  a.grid.hDiv.loading = true;
                  if (!a.p.hiddengrid) {
                    switch (a.p.loadui) {
                      case "enable":
                        b("#load_" + b.jgrid.jqID(a.p.id)).show();
                        break;
                      case "block":
                        b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                        b("#load_" + b.jgrid.jqID(a.p.id)).show()
                    }
                  }
                }, pa = function () {
                  a.grid.hDiv.loading = false;
                  switch (a.p.loadui) {
                    case "enable":
                      b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                      break;
                    case "block":
                      b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                      b("#load_" + b.jgrid.jqID(a.p.id)).hide()
                  }
                }, ja = function (e) {
                  if (!a.grid.hDiv.loading) {
                    var d = a.p.scroll && e === false, i = {}, n, p = a.p.prmNames;
                    if (a.p.page <= 0) {
                      a.p.page = 1;
                    }
                    if (p.search !== null) {
                      i[p.search] = a.p.search;
                    }
                    if (p.nd !== null) {
                      i[p.nd] = (new Date).getTime();
                    }
                    if (p.rows !== null) {
                      i[p.rows] = a.p.rowNum;
                    }
                    if (p.page !== null) {
                      i[p.page] = a.p.page;
                    }
                    if (p.sort !== null) {
                      i[p.sort] = a.p.sortname;
                    }
                    if (p.order !== null) {
                      i[p.order] = a.p.sortorder;
                    }
                    if (a.p.rowTotal !== null && p.totalrows !== null) {
                      i[p.totalrows] =
                        a.p.rowTotal;
                    }
                    var A = a.p.loadComplete, s = b.isFunction(A);
                    s || (A = null);
                    var F = 0;
                    e = e || 1;
                    if (e > 1) {
                      if (p.npage !== null) {
                        i[p.npage] = e;
                        F = e - 1;
                        e = 1
                      } else {
                        A = function (y) {
                          a.p.page++;
                          a.grid.hDiv.loading = false;
                          s && a.p.loadComplete.call(a, y);
                          ja(e - 1)
                        };
                      }
                    } else {
                      p.npage !== null && delete a.p.postData[p.npage];
                    }
                    if (a.p.grouping) {
                      b(a).jqGrid("groupingSetup");
                      if (a.p.groupingView.groupDataSorted === true) {
                        i[p.sort] = a.p.groupingView.groupField[0] + " " + a.p.groupingView.groupOrder[0] + ", " + i[p.sort]
                      }
                    }
                    b.extend(a.p.postData, i);
                    var t = !a.p.scroll ? 1 : a.rows.length -
                      1;
                    if (b.isFunction(a.p.datatype)) {
                      a.p.datatype.call(a, a.p.postData, "load_" + a.p.id);
                    } else {
                      b.isFunction(a.p.beforeRequest) && a.p.beforeRequest.call(a);
                      n = a.p.datatype.toLowerCase();
                      switch (n) {
                        case "json":
                        case "jsonp":
                        case "xml":
                        case "script":
                          b.ajax(b.extend({url:a.p.url, type:a.p.mtype, dataType:n, data:b.isFunction(a.p.serializeGridData) ? a.p.serializeGridData.call(a, a.p.postData) : a.p.postData, success:function (y) {
                            n === "xml" ? ga(y, a.grid.bDiv, t, e > 1, F) : ca(y, a.grid.bDiv, t, e > 1, F);
                            A && A.call(a, y);
                            d && a.grid.populateVisible();
                            if (a.p.loadonce || a.p.treeGrid) {
                              a.p.datatype = "local";
                            }
                            pa()
                          }, error:function (y, x, w) {
                            b.isFunction(a.p.loadError) && a.p.loadError.call(a, y, x, w);
                            pa()
                          }, beforeSend:function (y) {
                            aa();
                            b.isFunction(a.p.loadBeforeSend) && a.p.loadBeforeSend.call(a, y)
                          }}, b.jgrid.ajaxOptions, a.p.ajaxGridOptions));
                          break;
                        case "xmlstring":
                          aa();
                          i = b.jgrid.stringToDoc(a.p.datastr);
                          ga(i, a.grid.bDiv);
                          s && a.p.loadComplete.call(a, i);
                          a.p.datatype = "local";
                          a.p.datastr = null;
                          pa();
                          break;
                        case "jsonstring":
                          aa();
                          i = typeof a.p.datastr == "string" ? b.jgrid.parse(a.p.datastr) :
                            a.p.datastr;
                          ca(i, a.grid.bDiv);
                          s && a.p.loadComplete.call(a, i);
                          a.p.datatype = "local";
                          a.p.datastr = null;
                          pa();
                          break;
                        case "local":
                        case "clientside":
                          aa();
                          a.p.datatype = "local";
                          i = S();
                          ca(i, a.grid.bDiv, t, e > 1, F);
                          A && A.call(a, i);
                          d && a.grid.populateVisible();
                          pa()
                      }
                    }
                  }
                };
                v = function (e, d) {
                  var i = "", n = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>", p = "", A, s, F, t, y = function (x) {
                    var w;
                    if (b.isFunction(a.p.onPaging)) {
                      w = a.p.onPaging.call(a, x);
                    }
                    a.p.selrow = null;
                    if (a.p.multiselect) {
                      a.p.selarrrow =
                        [];
                      b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv).attr("checked", false)
                    }
                    a.p.savedRow = [];
                    if (w == "stop") {
                      return false;
                    }
                    return true
                  };
                  e = e.substr(1);
                  A = "pg_" + e;
                  s = e + "_left";
                  F = e + "_center";
                  t = e + "_right";
                  b("#" + b.jgrid.jqID(e)).append("<div id='" + A + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + s + "' align='left'></td><td id='" + F + "' align='center' style='white-space:pre;'></td><td id='" +
                    t + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                  if (a.p.rowList.length > 0) {
                    p = "<td dir='" + l + "'>";
                    p += "<select class='ui-pg-selbox' role='listbox'>";
                    for (s = 0; s < a.p.rowList.length; s++) {
                      p += '<option role="option" value="' + a.p.rowList[s] + '"' + (a.p.rowNum == a.p.rowList[s] ? ' selected="selected"' : "") + ">" + a.p.rowList[s] + "</option>";
                    }
                    p += "</select></td>"
                  }
                  if (l == "rtl") {
                    n += p;
                  }
                  if (a.p.pginput === true) {
                    i = "<td dir='" + l + "'>" + b.jgrid.format(a.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>",
                      "<span id='sp_1'></span>") + "</td>";
                  }
                  if (a.p.pgbuttons === true) {
                    s = ["first" + d, "prev" + d, "next" + d, "last" + d];
                    l == "rtl" && s.reverse();
                    n += "<td id='" + s[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
                    n += "<td id='" + s[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
                    n += i !== "" ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + i + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" :
                      "";
                    n += "<td id='" + s[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
                    n += "<td id='" + s[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"
                  } else if (i !== "") {
                    n += i;
                  }
                  if (l == "ltr") {
                    n += p;
                  }
                  n += "</tr></tbody></table>";
                  a.p.viewrecords === true && b("td#" + e + "_" + a.p.recordpos, "#" + A).append("<div dir='" + l + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>");
                  b("td#" + e + "_" + a.p.pagerpos, "#" + A).append(n);
                  p = b(".ui-jqgrid").css("font-size") ||
                    "11px";
                  b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + p + ";visibility:hidden;' ></div>");
                  n = b(n).clone().appendTo("#testpg").width();
                  b("#testpg").remove();
                  if (n > 0) {
                    if (i !== "") {
                      n += 50;
                    }
                    b("td#" + e + "_" + a.p.pagerpos, "#" + A).width(n)
                  }
                  a.p._nvtd = [];
                  a.p._nvtd[0] = n ? Math.floor((a.p.width - n) / 2) : Math.floor(a.p.width / 3);
                  a.p._nvtd[1] = 0;
                  n = null;
                  b(".ui-pg-selbox", "#" + A).bind("change", function () {
                    a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) / this.value - 0.5) + 1;
                    a.p.rowNum =
                      this.value;
                    if (d) {
                      b(".ui-pg-selbox", a.p.pager).val(this.value);
                    } else {
                      a.p.toppager && b(".ui-pg-selbox", a.p.toppager).val(this.value);
                    }
                    if (!y("records")) {
                      return false;
                    }
                    ja();
                    return false
                  });
                  if (a.p.pgbuttons === true) {
                    b(".ui-pg-button", "#" + A).hover(function () {
                      if (b(this).hasClass("ui-state-disabled")) {
                        this.style.cursor = "default";
                      } else {
                        b(this).addClass("ui-state-hover");
                        this.style.cursor = "pointer"
                      }
                    }, function () {
                      if (!b(this).hasClass("ui-state-disabled")) {
                        b(this).removeClass("ui-state-hover");
                        this.style.cursor = "default"
                      }
                    });
                    b("#first" + d + ", #prev" + d + ", #next" + d + ", #last" + d, "#" + e).click(function () {
                      var x = K(a.p.page, 1), w = K(a.p.lastpage, 1), G = false, Q = true, M = true, L = true, N = true;
                      if (w === 0 || w === 1) {
                        N = L = M = Q = false;
                      } else if (w > 1 && x >= 1) {
                        if (x === 1) {
                          M = Q = false;
                        } else {
                          if (!(x > 1 && x < w)) {
                            if (x === w) {
                              N = L = false
                            }
                          }
                        }
                      } else if (w > 1 && x === 0) {
                        N = L = false;
                        x = w - 1
                      }
                      if (this.id === "first" + d && Q) {
                        a.p.page = 1;
                        G = true
                      }
                      if (this.id === "prev" + d && M) {
                        a.p.page = x - 1;
                        G = true
                      }
                      if (this.id === "next" + d && L) {
                        a.p.page = x + 1;
                        G = true
                      }
                      if (this.id === "last" + d && N) {
                        a.p.page = w;
                        G = true
                      }
                      if (G) {
                        if (!y(this.id)) {
                          return false;
                        }
                        ja()
                      }
                      return false
                    })
                  }
                  a.p.pginput === true && b("input.ui-pg-input", "#" + A).keypress(function (x) {
                    if ((x.charCode ? x.charCode : x.keyCode ? x.keyCode : 0) == 13) {
                      a.p.page = b(this).val() > 0 ? b(this).val() : a.p.page;
                      if (!y("user")) {
                        return false;
                      }
                      ja();
                      return false
                    }
                    return this
                  })
                };
                var Ca = function (e, d, i, n) {
                  if (a.p.colModel[d].sortable) {
                    if (!(a.p.savedRow.length > 0)) {
                      if (!i) {
                        if (a.p.lastsort == d) {
                          if (a.p.sortorder == "asc") {
                            a.p.sortorder = "desc";
                          } else {
                            if (a.p.sortorder == "desc") {
                              a.p.sortorder = "asc"
                            }
                          }
                        } else {
                          a.p.sortorder = a.p.colModel[d].firstsortorder ||
                            "asc";
                        }
                        a.p.page = 1
                      }
                      if (n) {
                        if (a.p.lastsort == d && a.p.sortorder == n && !i) {
                          return;
                        } else {
                          a.p.sortorder = n;
                        }
                      }
                      i = b("thead:first", a.grid.hDiv).get(0);
                      b("tr th:eq(" + a.p.lastsort + ") span.ui-grid-ico-sort", i).addClass("ui-state-disabled");
                      b("tr th:eq(" + a.p.lastsort + ")", i).attr("aria-selected", "false");
                      b("tr th:eq(" + d + ") span.ui-icon-" + a.p.sortorder, i).removeClass("ui-state-disabled");
                      b("tr th:eq(" + d + ")", i).attr("aria-selected", "true");
                      if (!a.p.viewsortcols[0]) {
                        if (a.p.lastsort != d) {
                          b("tr th:eq(" + a.p.lastsort + ") span.s-ico",
                            i).hide();
                          b("tr th:eq(" + d + ") span.s-ico", i).show()
                        }
                      }
                      e = e.substring(5);
                      a.p.sortname = a.p.colModel[d].index || e;
                      i = a.p.sortorder;
                      if (b.isFunction(a.p.onSortCol)) {
                        if (a.p.onSortCol.call(a, e, d, i) == "stop") {
                          a.p.lastsort = d;
                          return
                        }
                      }
                      if (a.p.datatype == "local") {
                        a.p.deselectAfterSort && b(a).jqGrid("resetSelection");
                      } else {
                        a.p.selrow = null;
                        a.p.multiselect && b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv).attr("checked", false);
                        a.p.selarrrow = [];
                        a.p.savedRow = []
                      }
                      if (a.p.scroll) {
                        i = a.grid.bDiv.scrollLeft;
                        W(a.grid.bDiv, true, false);
                        a.grid.hDiv.scrollLeft =
                          i
                      }
                      a.p.subGrid && a.p.datatype == "local" && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function () {
                        b(this).trigger("click")
                      });
                      ja();
                      a.p.lastsort = d;
                      if (a.p.sortname != e && d) {
                        a.p.lastsort = d
                      }
                    }
                  }
                }, Fa = function (e) {
                  var d, i = {}, n = E ? 0 : a.p.cellLayout;
                  for (d = i[0] = i[1] = i[2] = 0; d <= e; d++)if (a.p.colModel[d].hidden === false)i[0] += a.p.colModel[d].width + n;
                  if (a.p.direction == "rtl")i[0] = a.p.width - i[0];
                  i[0] -= a.grid.bDiv.scrollLeft;
                  if (b(a.grid.cDiv).is(":visible"))i[1] += b(a.grid.cDiv).height() + parseInt(b(a.grid.cDiv).css("padding-top"),
                    10) + parseInt(b(a.grid.cDiv).css("padding-bottom"), 10);
                  if (a.p.toolbar[0] === true && (a.p.toolbar[1] == "top" || a.p.toolbar[1] == "both"))i[1] += b(a.grid.uDiv).height() + parseInt(b(a.grid.uDiv).css("border-top-width"), 10) + parseInt(b(a.grid.uDiv).css("border-bottom-width"), 10);
                  if (a.p.toppager)i[1] += b(a.grid.topDiv).height() + parseInt(b(a.grid.topDiv).css("border-bottom-width"), 10);
                  i[2] += b(a.grid.bDiv).height() + b(a.grid.hDiv).height();
                  return i
                };
                this.p.id = this.id;
                if (b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) == -1)a.p.multikey = false;
                a.p.keyIndex = false;
                for (k = 0; k < a.p.colModel.length; k++) {
                  a.p.colModel[k] = b.extend(true, {}, a.p.cmTemplate, a.p.colModel[k].template || {}, a.p.colModel[k]);
                  if (a.p.keyIndex === false && a.p.colModel[k].key === true)a.p.keyIndex = k
                }
                a.p.sortorder = a.p.sortorder.toLowerCase();
                if (a.p.grouping === true) {
                  a.p.scroll = false;
                  a.p.rownumbers = false;
                  a.p.subGrid = false;
                  a.p.treeGrid = false;
                  a.p.gridview = true
                }
                if (this.p.treeGrid === true) {
                  try {
                    b(this).jqGrid("setTreeGrid")
                  } catch (Ja) {
                  }
                  if (a.p.datatype != "local")a.p.localReader =
                  {id:"_id_"}
                }
                if (this.p.subGrid)try {
                  b(a).jqGrid("setSubGrid")
                } catch (Ka) {
                }
                if (this.p.multiselect) {
                  this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>");
                  this.p.colModel.unshift({name:"cb", width:E ? a.p.multiselectWidth + a.p.cellLayout : a.p.multiselectWidth, sortable:false, resizable:false, hidedlg:true, search:false, align:"center", fixed:true})
                }
                if (this.p.rownumbers) {
                  this.p.colNames.unshift("");
                  this.p.colModel.unshift({name:"rn", width:a.p.rownumWidth, sortable:false,
                    resizable:false, hidedlg:true, search:false, align:"center", fixed:true})
                }
                a.p.xmlReader = b.extend(true, {root:"rows", row:"row", page:"rows>page", total:"rows>total", records:"rows>records", repeatitems:true, cell:"cell", id:"[id]", userdata:"userdata", subgrid:{root:"rows", row:"row", repeatitems:true, cell:"cell"}}, a.p.xmlReader);
                a.p.jsonReader = b.extend(true, {root:"rows", page:"page", total:"total", records:"records", repeatitems:true, cell:"cell", id:"id", userdata:"userdata", subgrid:{root:"rows", repeatitems:true, cell:"cell"}},
                  a.p.jsonReader);
                a.p.localReader = b.extend(true, {root:"rows", page:"page", total:"total", records:"records", repeatitems:false, cell:"cell", id:"id", userdata:"userdata", subgrid:{root:"rows", repeatitems:true, cell:"cell"}}, a.p.localReader);
                if (a.p.scroll) {
                  a.p.pgbuttons = false;
                  a.p.pginput = false;
                  a.p.rowList = []
                }
                a.p.data.length && U();
                var ba = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>", Da, ma, sa, qa, ta, X, R, na;
                ma = na = "";
                if (a.p.shrinkToFit === true && a.p.forceFit === true)for (k = a.p.colModel.length - 1; k >= 0; k--)if (!a.p.colModel[k].hidden) {
                  a.p.colModel[k].resizable =
                    false;
                  break
                }
                if (a.p.viewsortcols[1] == "horizontal") {
                  na = " ui-i-asc";
                  ma = " ui-i-desc"
                }
                Da = z ? "class='ui-th-div-ie'" : "";
                na = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + na + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + l + "'></span>";
                na += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + ma + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + l + "'></span></span>";
                for (k = 0; k < this.p.colNames.length; k++) {
                  ma = a.p.headertitles ? ' title="' + b.jgrid.stripHtml(a.p.colNames[k]) +
                    '"' : "";
                  ba += "<th id='" + a.p.id + "_" + a.p.colModel[k].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + l + "'" + ma + ">";
                  ma = a.p.colModel[k].index || a.p.colModel[k].name;
                  ba += "<div id='jqgh_" + a.p.colModel[k].name + "' " + Da + ">" + a.p.colNames[k];
                  a.p.colModel[k].width = a.p.colModel[k].width ? parseInt(a.p.colModel[k].width, 10) : 150;
                  if (typeof a.p.colModel[k].title !== "boolean")a.p.colModel[k].title = true;
                  if (ma == a.p.sortname)a.p.lastsort = k;
                  ba += na + "</div></th>"
                }
                ba += "</tr></thead>";
                na = null;
                b(this).append(ba);
                b("thead tr:first th", this).hover(function () {
                  b(this).addClass("ui-state-hover")
                }, function () {
                  b(this).removeClass("ui-state-hover")
                });
                if (this.p.multiselect) {
                  var za = [], ua;
                  b("#cb_" + b.jgrid.jqID(a.p.id), this).bind("click", function () {
                    a.p.selarrrow = [];
                    if (this.checked) {
                      b(a.rows).each(function (e) {
                        if (e > 0)if (!b(this).hasClass("subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-state-disabled")) {
                          b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id)).attr("checked", "checked");
                          b(this).addClass("ui-state-highlight").attr("aria-selected",
                            "true");
                          a.p.selarrrow.push(this.id);
                          a.p.selrow = this.id
                        }
                      });
                      ua = true;
                      za = []
                    } else {
                      b(a.rows).each(function (e) {
                        if (e > 0)if (!b(this).hasClass("subgrid") && !b(this).hasClass("ui-state-disabled")) {
                          b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id)).removeAttr("checked");
                          b(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
                          za.push(this.id)
                        }
                      });
                      a.p.selrow = null;
                      ua = false
                    }
                    if (b.isFunction(a.p.onSelectAll))a.p.onSelectAll.call(a, ua ? a.p.selarrrow : za, ua)
                  })
                }
                if (a.p.autowidth === true) {
                  ba = b(P).innerWidth();
                  a.p.width = ba > 0 ? ba : "nw"
                }
                (function () {
                  var e = 0, d = E ? 0 : a.p.cellLayout, i = 0, n, p = a.p.scrollOffset, A, s = false, F, t = 0, y = 0, x;
                  b.each(a.p.colModel, function () {
                    if (typeof this.hidden === "undefined")this.hidden = false;
                    this.widthOrg = A = K(this.width, 0);
                    if (this.hidden === false) {
                      e += A + d;
                      if (this.fixed)t += A + d; else i++;
                      y++
                    }
                  });
                  if (isNaN(a.p.width))a.p.width = g.width = e; else g.width = a.p.width;
                  a.p.tblwidth = e;
                  if (a.p.shrinkToFit === false && a.p.forceFit === true)a.p.forceFit = false;
                  if (a.p.shrinkToFit === true && i > 0) {
                    F = g.width - d * i - t;
                    if (!isNaN(a.p.height)) {
                      F -=
                        p;
                      s = true
                    }
                    e = 0;
                    b.each(a.p.colModel, function (w) {
                      if (this.hidden === false && !this.fixed) {
                        this.width = A = Math.round(F * this.width / (a.p.tblwidth - d * i - t));
                        e += A;
                        n = w
                      }
                    });
                    x = 0;
                    if (s) {
                      if (g.width - t - (e + d * i) !== p)x = g.width - t - (e + d * i) - p
                    } else if (!s && Math.abs(g.width - t - (e + d * i)) !== 1)x = g.width - t - (e + d * i);
                    a.p.colModel[n].width += x;
                    a.p.tblwidth = e + x + d * i + t;
                    if (a.p.tblwidth > a.p.width) {
                      a.p.colModel[n].width -= a.p.tblwidth - parseInt(a.p.width, 10);
                      a.p.tblwidth = a.p.width
                    }
                  }
                })();
                b(P).css("width", g.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" +
                  a.p.id + "'>&#160;</div>");
                b(r).css("width", g.width + "px");
                ba = b("thead:first", a).get(0);
                var va = "";
                if (a.p.footerrow)va += "<table role='grid' style='width:" + a.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + l + "'>";
                r = b("tr:first", ba);
                var wa = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                a.p.disableClick = false;
                b("th", r).each(function (e) {
                  sa = a.p.colModel[e].width;
                  if (typeof a.p.colModel[e].resizable ===
                    "undefined")a.p.colModel[e].resizable = true;
                  if (a.p.colModel[e].resizable) {
                    qa = document.createElement("span");
                    b(qa).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + l);
                    b.browser.opera || b(qa).css("cursor", "col-resize");
                    b(this).addClass(a.p.resizeclass)
                  } else qa = "";
                  b(this).css("width", sa + "px").prepend(qa);
                  var d = "";
                  if (a.p.colModel[e].hidden) {
                    b(this).css("display", "none");
                    d = "display:none;"
                  }
                  wa += "<td role='gridcell' style='height:0px;width:" + sa + "px;" + d + "'></td>";
                  g.headers[e] = {width:sa, el:this};
                  ta = a.p.colModel[e].sortable;
                  if (typeof ta !== "boolean")ta = a.p.colModel[e].sortable = true;
                  d = a.p.colModel[e].name;
                  d == "cb" || d == "subgrid" || d == "rn" || a.p.viewsortcols[2] && b("div", this).addClass("ui-jqgrid-sortable");
                  if (ta)if (a.p.viewsortcols[0]) {
                    b("div span.s-ico", this).show();
                    e == a.p.lastsort && b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                  } else if (e == a.p.lastsort) {
                    b("div span.s-ico", this).show();
                    b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                  }
                  if (a.p.footerrow)va +=
                    "<td role='gridcell' " + O(e, 0, "", null, "", false) + ">&#160;</td>"
                }).mousedown(function (e) {
                    if (b(e.target).closest("th>span.ui-jqgrid-resize").length == 1) {
                      var d = b.jgrid.getCellIndex(this);
                      if (a.p.forceFit === true) {
                        var i = a.p, n = d, p;
                        for (p = d + 1; p < a.p.colModel.length; p++)if (a.p.colModel[p].hidden !== true) {
                          n = p;
                          break
                        }
                        i.nv = n - d
                      }
                      g.dragStart(d, e, Fa(d));
                      return false
                    }
                  }).click(function (e) {
                    if (a.p.disableClick)return a.p.disableClick = false;
                    var d = "th>div.ui-jqgrid-sortable", i, n;
                    a.p.viewsortcols[2] || (d = "th>div>span>span.ui-grid-ico-sort");
                    e = b(e.target).closest(d);
                    if (e.length == 1) {
                      d = b.jgrid.getCellIndex(this);
                      if (!a.p.viewsortcols[2]) {
                        i = true;
                        n = e.attr("sort")
                      }
                      Ca(b("div", this)[0].id, d, i, n);
                      return false
                    }
                  });
                if (a.p.sortable && b.fn.sortable)try {
                  b(a).jqGrid("sortableColumns", r)
                } catch (La) {
                }
                if (a.p.footerrow)va += "</tr></tbody></table>";
                wa += "</tr>";
                this.appendChild(document.createElement("tbody"));
                b(this).addClass("ui-jqgrid-btable").append(wa);
                wa = null;
                r = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" +
                  this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(ba);
                var da = a.p.caption && a.p.hiddengrid === true ? true : false;
                k = b("<div class='ui-jqgrid-hbox" + (l == "rtl" ? "-rtl" : "") + "'></div>");
                ba = null;
                g.hDiv = document.createElement("div");
                b(g.hDiv).css({width:g.width + "px"}).addClass("ui-state-default ui-jqgrid-hdiv").append(k);
                b(k).append(r);
                r = null;
                da && b(g.hDiv).hide();
                if (a.p.pager) {
                  if (typeof a.p.pager == "string") {
                    if (a.p.pager.substr(0, 1) != "#")a.p.pager = "#" + a.p.pager
                  } else a.p.pager = "#" + b(a.p.pager).attr("id");
                  b(a.p.pager).css({width:g.width + "px"}).appendTo(P).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
                  da && b(a.p.pager).hide();
                  v(a.p.pager, "")
                }
                a.p.cellEdit === false && a.p.hoverrows === true && b(a).bind("mouseover",function (e) {
                  R = b(e.target).closest("tr.jqgrow");
                  b(R).attr("class") !== "subgrid" && b(R).addClass("ui-state-hover");
                  return false
                }).bind("mouseout", function (e) {
                    R = b(e.target).closest("tr.jqgrow");
                    b(R).removeClass("ui-state-hover");
                    return false
                  });
                var ka, la;
                b(a).before(g.hDiv).click(function (e) {
                  X =
                    e.target;
                  R = b(X, a.rows).closest("tr.jqgrow");
                  if (b(R).length === 0 || R[0].className.indexOf("ui-state-disabled") > -1)return this;
                  var d = b(X).hasClass("cbox"), i = true;
                  if (b.isFunction(a.p.beforeSelectRow))i = a.p.beforeSelectRow.call(a, R[0].id, e);
                  if (X.tagName == "A" || (X.tagName == "INPUT" || X.tagName == "TEXTAREA" || X.tagName == "OPTION" || X.tagName == "SELECT") && !d)return this;
                  if (i === true) {
                    if (a.p.cellEdit === true)if (a.p.multiselect && d)b(a).jqGrid("setSelection", R[0].id, true); else {
                      ka = R[0].rowIndex;
                      la = b.jgrid.getCellIndex(X);
                      try {
                        b(a).jqGrid("editCell", ka, la, true)
                      } catch (n) {
                      }
                    } else if (a.p.multikey)if (e[a.p.multikey])b(a).jqGrid("setSelection", R[0].id, true); else {
                      if (a.p.multiselect && d) {
                        d = b("[id^=jqg_" + b.jgrid.jqID(a.p.id) + "_]").attr("checked");
                        b("[id^=jqg_" + b.jgrid.jqID(a.p.id) + "_]").attr("checked", !d)
                      }
                    } else {
                      if (a.p.multiselect && a.p.multiboxonly)if (!d) {
                        b(a.p.selarrrow).each(function (p, A) {
                          var s = a.rows.namedItem(A);
                          b(s).removeClass("ui-state-highlight");
                          b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(A)).attr("checked", false)
                        });
                        a.p.selarrrow = [];
                        b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv).attr("checked", false)
                      }
                      b(a).jqGrid("setSelection", R[0].id, true)
                    }
                    if (b.isFunction(a.p.onCellSelect)) {
                      ka = R[0].id;
                      la = b.jgrid.getCellIndex(X);
                      a.p.onCellSelect.call(a, ka, la, b(X).html(), e)
                    }
                    e.stopPropagation()
                  } else return this
                }).bind("reloadGrid", function (e, d) {
                    if (a.p.treeGrid === true)a.p.datatype = a.p.treedatatype;
                    d && d.current && a.grid.selectionPreserver(a);
                    if (a.p.datatype == "local") {
                      b(a).jqGrid("resetSelection");
                      a.p.data.length && U()
                    } else if (!a.p.treeGrid) {
                      a.p.selrow =
                        null;
                      if (a.p.multiselect) {
                        a.p.selarrrow = [];
                        b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv).attr("checked", false)
                      }
                      a.p.savedRow = []
                    }
                    a.p.scroll && W(a.grid.bDiv, true, false);
                    if (d && d.page) {
                      var i = d.page;
                      if (i > a.p.lastpage)i = a.p.lastpage;
                      if (i < 1)i = 1;
                      a.p.page = i;
                      a.grid.bDiv.scrollTop = a.grid.prevRowHeight ? (i - 1) * a.grid.prevRowHeight * a.p.rowNum : 0
                    }
                    if (a.grid.prevRowHeight && a.p.scroll) {
                      delete a.p.lastpage;
                      a.grid.populateVisible()
                    } else a.grid.populate();
                    return false
                  });
                b.isFunction(this.p.ondblClickRow) && b(this).dblclick(function (e) {
                  X =
                    e.target;
                  R = b(X, a.rows).closest("tr.jqgrow");
                  if (b(R).length === 0)return false;
                  ka = R[0].rowIndex;
                  la = b.jgrid.getCellIndex(X);
                  a.p.ondblClickRow.call(a, b(R).attr("id"), ka, la, e);
                  return false
                });
                b.isFunction(this.p.onRightClickRow) && b(this).bind("contextmenu", function (e) {
                  X = e.target;
                  R = b(X, a.rows).closest("tr.jqgrow");
                  if (b(R).length === 0)return false;
                  a.p.multiselect || b(a).jqGrid("setSelection", R[0].id, true);
                  ka = R[0].rowIndex;
                  la = b.jgrid.getCellIndex(X);
                  a.p.onRightClickRow.call(a, b(R).attr("id"), ka, la, e);
                  return false
                });
                g.bDiv = document.createElement("div");
                if (z)if (String(a.p.height).toLowerCase() === "auto")a.p.height = "100%";
                b(g.bDiv).append(b('<div style="position:relative;' + (z && b.browser.version < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({height:a.p.height + (isNaN(a.p.height) ? "" : "px"), width:g.width + "px"}).scroll(g.scrollGrid);
                b("table:first", g.bDiv).css({width:a.p.tblwidth + "px"});
                if (z) {
                  b("tbody", this).size() == 2 && b("tbody:gt(0)", this).remove();
                  a.p.multikey &&
                  b(g.bDiv).bind("selectstart", function () {
                    return false
                  })
                } else a.p.multikey && b(g.bDiv).bind("mousedown", function () {
                  return false
                });
                da && b(g.bDiv).hide();
                g.cDiv = document.createElement("div");
                var Aa = a.p.hidegrid === true ? b("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function () {
                  Aa.addClass("ui-state-hover")
                },function () {
                  Aa.removeClass("ui-state-hover")
                }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css(l == "rtl" ? "left" : "right", "0px") :
                  "";
                b(g.cDiv).append(Aa).append("<span class='ui-jqgrid-title" + (l == "rtl" ? "-rtl" : "") + "'>" + a.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
                b(g.cDiv).insertBefore(g.hDiv);
                if (a.p.toolbar[0]) {
                  g.uDiv = document.createElement("div");
                  if (a.p.toolbar[1] == "top")b(g.uDiv).insertBefore(g.hDiv); else a.p.toolbar[1] == "bottom" && b(g.uDiv).insertAfter(g.hDiv);
                  if (a.p.toolbar[1] == "both") {
                    g.ubDiv = document.createElement("div");
                    b(g.uDiv).insertBefore(g.hDiv).addClass("ui-userdata ui-state-default").attr("id",
                      "t_" + this.id);
                    b(g.ubDiv).insertAfter(g.hDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id);
                    da && b(g.ubDiv).hide()
                  } else b(g.uDiv).width(g.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
                  da && b(g.uDiv).hide()
                }
                if (a.p.toppager) {
                  a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager";
                  g.topDiv = b("<div id='" + a.p.toppager + "'></div>")[0];
                  a.p.toppager = "#" + a.p.toppager;
                  b(g.topDiv).insertBefore(g.hDiv).addClass("ui-state-default ui-jqgrid-toppager").width(g.width);
                  v(a.p.toppager,
                    "_t")
                }
                if (a.p.footerrow) {
                  g.sDiv = b("<div class='ui-jqgrid-sdiv'></div>")[0];
                  k = b("<div class='ui-jqgrid-hbox" + (l == "rtl" ? "-rtl" : "") + "'></div>");
                  b(g.sDiv).append(k).insertAfter(g.hDiv).width(g.width);
                  b(k).append(va);
                  g.footers = b(".ui-jqgrid-ftable", g.sDiv)[0].rows[0].cells;
                  if (a.p.rownumbers)g.footers[0].className = "ui-state-default jqgrid-rownum";
                  da && b(g.sDiv).hide()
                }
                k = null;
                if (a.p.caption) {
                  var Ga = a.p.datatype;
                  if (a.p.hidegrid === true) {
                    b(".ui-jqgrid-titlebar-close", g.cDiv).click(function (e) {
                      var d = b.isFunction(a.p.onHeaderClick),
                        i = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv", n, p = this;
                      if (a.p.toolbar[0] === true) {
                        if (a.p.toolbar[1] == "both")i += ", #" + b(g.ubDiv).attr("id");
                        i += ", #" + b(g.uDiv).attr("id")
                      }
                      n = b(i, "#gview_" + b.jgrid.jqID(a.p.id)).length;
                      if (a.p.gridstate == "visible")b(i, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function () {
                        n--;
                        if (n === 0) {
                          b("span", p).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                          a.p.gridstate = "hidden";
                          b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") &&
                          b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).hide();
                          if (d)da || a.p.onHeaderClick.call(a, a.p.gridstate, e)
                        }
                      }); else a.p.gridstate == "hidden" && b(i, "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function () {
                        n--;
                        if (n === 0) {
                          b("span", p).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                          if (da) {
                            a.p.datatype = Ga;
                            ja();
                            da = false
                          }
                          a.p.gridstate = "visible";
                          b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).show();
                          if (d)da ||
                          a.p.onHeaderClick.call(a, a.p.gridstate, e)
                        }
                      });
                      return false
                    });
                    if (da) {
                      a.p.datatype = "local";
                      b(".ui-jqgrid-titlebar-close", g.cDiv).trigger("click")
                    }
                  }
                } else b(g.cDiv).hide();
                b(g.hDiv).after(g.bDiv).mousemove(function (e) {
                  if (g.resizing) {
                    g.dragMove(e);
                    return false
                  }
                });
                b(".ui-jqgrid-labels", g.hDiv).bind("selectstart", function () {
                  return false
                });
                b(document).mouseup(function () {
                  if (g.resizing) {
                    g.dragEnd();
                    return false
                  }
                  return true
                });
                a.formatCol = O;
                a.sortData = Ca;
                a.updatepager = function (e, d) {
                  var i, n, p, A, s, F, t, y = "";
                  p = parseInt(a.p.page,
                    10) - 1;
                  if (p < 0)p = 0;
                  p *= parseInt(a.p.rowNum, 10);
                  s = p + a.p.reccount;
                  if (a.p.scroll) {
                    i = b("tbody:first > tr:gt(0)", a.grid.bDiv);
                    p = s - i.length;
                    a.p.reccount = i.length;
                    if (n = i.outerHeight() || a.grid.prevRowHeight) {
                      i = p * n;
                      n *= parseInt(a.p.records, 10);
                      b(">div:first", a.grid.bDiv).css({height:n}).children("div:first").css({height:i, display:i ? "" : "none"})
                    }
                    a.grid.bDiv.scrollLeft = a.grid.hDiv.scrollLeft
                  }
                  y = a.p.pager ? a.p.pager : "";
                  y += a.p.toppager ? y ? "," + a.p.toppager : a.p.toppager : "";
                  if (y) {
                    t = b.jgrid.formatter.integer || {};
                    i = K(a.p.page);
                    n = K(a.p.lastpage);
                    b(".selbox", y).attr("disabled", false);
                    if (a.p.pginput === true) {
                      b(".ui-pg-input", y).val(a.p.page);
                      b("#sp_1", y).html(b.fmatter ? b.fmatter.util.NumberFormat(a.p.lastpage, t) : a.p.lastpage)
                    }
                    if (a.p.viewrecords)if (a.p.reccount === 0)b(".ui-paging-info", y).html(a.p.emptyrecords); else {
                      A = p + 1;
                      F = a.p.records;
                      if (b.fmatter) {
                        A = b.fmatter.util.NumberFormat(A, t);
                        s = b.fmatter.util.NumberFormat(s, t);
                        F = b.fmatter.util.NumberFormat(F, t)
                      }
                      b(".ui-paging-info", y).html(b.jgrid.format(a.p.recordtext, A, s, F))
                    }
                    if (a.p.pgbuttons ===
                      true) {
                      if (i <= 0)i = n = 0;
                      if (i == 1 || i === 0) {
                        b("#first, #prev", a.p.pager).addClass("ui-state-disabled").removeClass("ui-state-hover");
                        a.p.toppager && b("#first_t, #prev_t", a.p.toppager).addClass("ui-state-disabled").removeClass("ui-state-hover")
                      } else {
                        b("#first, #prev", a.p.pager).removeClass("ui-state-disabled");
                        a.p.toppager && b("#first_t, #prev_t", a.p.toppager).removeClass("ui-state-disabled")
                      }
                      if (i == n || i === 0) {
                        b("#next, #last", a.p.pager).addClass("ui-state-disabled").removeClass("ui-state-hover");
                        a.p.toppager &&
                        b("#next_t, #last_t", a.p.toppager).addClass("ui-state-disabled").removeClass("ui-state-hover")
                      } else {
                        b("#next, #last", a.p.pager).removeClass("ui-state-disabled");
                        a.p.toppager && b("#next_t, #last_t", a.p.toppager).removeClass("ui-state-disabled")
                      }
                    }
                  }
                  e === true && a.p.rownumbers === true && b("td.jqgrid-rownum", a.rows).each(function (x) {
                    b(this).html(p + 1 + x)
                  });
                  d && a.p.jqgdnd && b(a).jqGrid("gridDnD", "updateDnD");
                  b.isFunction(a.p.gridComplete) && a.p.gridComplete.call(a)
                };
                a.refreshIndex = U;
                a.formatter = function (e, d, i, n, p) {
                  return o(e,
                    d, i, n, p)
                };
                b.extend(g, {populate:ja, emptyRows:W});
                this.grid = g;
                a.addXmlData = function (e) {
                  ga(e, a.grid.bDiv)
                };
                a.addJSONData = function (e) {
                  ca(e, a.grid.bDiv)
                };
                this.grid.cols = this.rows[0].cells;
                ja();
                a.p.hiddengrid = false;
                b(window).unload(function () {
                  a = null
                })
              }
            }
          }
        })
      };
      b.jgrid.extend({getGridParam:function (f) {
        var j = this[0];
        if (j && j.grid)return f ? typeof j.p[f] != "undefined" ? j.p[f] : null : j.p
      }, setGridParam:function (f) {
        return this.each(function () {
          this.grid && typeof f === "object" && b.extend(true, this.p, f)
        })
      }, getDataIDs:function () {
        var f =
          [], j = 0, h, c = 0;
        this.each(function () {
          if ((h = this.rows.length) && h > 0)for (; j < h;) {
            if (b(this.rows[j]).hasClass("jqgrow")) {
              f[c] = this.rows[j].id;
              c++
            }
            j++
          }
        });
        return f
      }, setSelection:function (f, j) {
        return this.each(function () {
          function h(a) {
            var r = b(c.grid.bDiv)[0].clientHeight, v = b(c.grid.bDiv)[0].scrollTop, z = c.rows[a].offsetTop;
            a = c.rows[a].clientHeight;
            if (z + a >= r + v)b(c.grid.bDiv)[0].scrollTop = z - (r + v) + a + v; else if (z < r + v)if (z < v)b(c.grid.bDiv)[0].scrollTop = z
          }

          var c = this, g, k, l;
          if (f !== undefined) {
            j = j === false ? false : true;
            k =
              c.rows.namedItem(f + "");
            if (!(!k || k.className.indexOf("ui-state-disabled") > -1)) {
              if (c.p.scrollrows === true) {
                g = c.rows.namedItem(f).rowIndex;
                g >= 0 && h(g)
              }
              if (c.p.multiselect) {
                c.p.selrow = k.id;
                l = b.inArray(c.p.selrow, c.p.selarrrow);
                if (l === -1) {
                  k.className !== "ui-subgrid" && b(k).addClass("ui-state-highlight").attr("aria-selected", "true");
                  g = true;
                  b("#jqg_" + b.jgrid.jqID(c.p.id) + "_" + b.jgrid.jqID(c.p.selrow)).attr("checked", g);
                  c.p.selarrrow.push(c.p.selrow)
                } else {
                  k.className !== "ui-subgrid" && b(k).removeClass("ui-state-highlight").attr("aria-selected",
                    "false");
                  g = false;
                  b("#jqg_" + b.jgrid.jqID(c.p.id) + "_" + b.jgrid.jqID(c.p.selrow)).attr("checked", g);
                  c.p.selarrrow.splice(l, 1);
                  l = c.p.selarrrow[0];
                  c.p.selrow = l === undefined ? null : l
                }
                c.p.onSelectRow && j && c.p.onSelectRow.call(c, k.id, g)
              } else if (k.className !== "ui-subgrid") {
                if (c.p.selrow != k.id) {
                  b(c.rows.namedItem(c.p.selrow)).removeClass("ui-state-highlight").attr({"aria-selected":"false", tabindex:"-1"});
                  b(k).addClass("ui-state-highlight").attr({"aria-selected":true, tabindex:"0"});
                  g = true
                } else g = false;
                c.p.selrow =
                  k.id;
                c.p.onSelectRow && j && c.p.onSelectRow.call(c, k.id, g)
              }
            }
          }
        })
      }, resetSelection:function (f) {
        return this.each(function () {
          var j = this, h, c;
          if (typeof f !== "undefined") {
            c = f === j.p.selrow ? j.p.selrow : f;
            b("#" + b.jgrid.jqID(j.p.id) + " tbody:first tr#" + b.jgrid.jqID(c)).removeClass("ui-state-highlight").attr("aria-selected", "false");
            if (j.p.multiselect) {
              b("#jqg_" + b.jgrid.jqID(j.p.id) + "_" + b.jgrid.jqID(c)).attr("checked", false);
              b("#cb_" + b.jgrid.jqID(j.p.id)).attr("checked", false)
            }
            c = null
          } else if (j.p.multiselect) {
            b(j.p.selarrrow).each(function (g, k) {
              h = j.rows.namedItem(k);
              b(h).removeClass("ui-state-highlight").attr("aria-selected", "false");
              b("#jqg_" + b.jgrid.jqID(j.p.id) + "_" + b.jgrid.jqID(k)).attr("checked", false)
            });
            b("#cb_" + b.jgrid.jqID(j.p.id)).attr("checked", false);
            j.p.selarrrow = []
          } else if (j.p.selrow) {
            b("#" + b.jgrid.jqID(j.p.id) + " tbody:first tr#" + b.jgrid.jqID(j.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false");
            j.p.selrow = null
          }
          j.p.savedRow = []
        })
      }, getRowData:function (f) {
        var j = {}, h, c = false, g, k = 0;
        this.each(function () {
          var l =
            this, a, r;
          if (typeof f == "undefined") {
            c = true;
            h = [];
            g = l.rows.length
          } else {
            r = l.rows.namedItem(f);
            if (!r)return j;
            g = 2
          }
          for (; k < g;) {
            if (c)r = l.rows[k];
            if (b(r).hasClass("jqgrow")) {
              b("td", r).each(function (v) {
                a = l.p.colModel[v].name;
                if (a !== "cb" && a !== "subgrid" && a !== "rn")if (l.p.treeGrid === true && a == l.p.ExpandColumn)j[a] = b.jgrid.htmlDecode(b("span:first", this).html()); else try {
                  j[a] = b.unformat(this, {rowId:r.id, colModel:l.p.colModel[v]}, v)
                } catch (z) {
                  j[a] = b.jgrid.htmlDecode(b(this).html())
                }
              });
              if (c) {
                h.push(j);
                j = {}
              }
            }
            k++
          }
        });
        return h ? h : j
      }, delRowData:function (f) {
        var j = false, h, c;
        this.each(function () {
          if (h = this.rows.namedItem(f)) {
            b(h).remove();
            this.p.records--;
            this.p.reccount--;
            this.updatepager(true, false);
            j = true;
            if (this.p.multiselect) {
              c = b.inArray(f, this.p.selarrrow);
              c != -1 && this.p.selarrrow.splice(c, 1)
            }
            if (f == this.p.selrow)this.p.selrow = null
          } else return false;
          if (this.p.datatype == "local") {
            var g = this.p._index[f];
            if (typeof g != "undefined") {
              this.p.data.splice(g, 1);
              this.refreshIndex()
            }
          }
          if (this.p.altRows === true && j) {
            var k = this.p.altclass;
            b(this.rows).each(function (l) {
              l % 2 == 1 ? b(this).addClass(k) : b(this).removeClass(k)
            })
          }
        });
        return j
      }, setRowData:function (f, j, h) {
        var c, g = true, k;
        this.each(function () {
          if (!this.grid)return false;
          var l = this, a, r, v = typeof h, z = {};
          r = l.rows.namedItem(f);
          if (!r)return false;
          if (j)try {
            b(this.p.colModel).each(function (O) {
              c = this.name;
              if (j[c] !== undefined) {
                z[c] = this.formatter && typeof this.formatter === "string" && this.formatter == "date" ? b.unformat.date(j[c], this) : j[c];
                a = l.formatter(f, j[c], O, j, "edit");
                k = this.title ? {title:b.jgrid.stripHtml(a)} :
                {};
                l.p.treeGrid === true && c == l.p.ExpandColumn ? b("td:eq(" + O + ") > span:first", r).html(a).attr(k) : b("td:eq(" + O + ")", r).html(a).attr(k)
              }
            });
            if (l.p.datatype == "local") {
              var E = l.p._index[f];
              if (l.p.treeGrid)for (var P in l.p.treeReader)z.hasOwnProperty(l.p.treeReader[P]) && delete z[l.p.treeReader[P]];
              if (typeof E != "undefined")l.p.data[E] = b.extend(true, l.p.data[E], z);
              z = null
            }
          } catch (K) {
            g = false
          }
          if (g)if (v === "string")b(r).addClass(h); else v === "object" && b(r).css(h)
        });
        return g
      }, addRowData:function (f, j, h, c) {
        h || (h = "last");
        var g = false, k, l, a, r, v, z, E, P, K = "", O, m, o, q, B;
        if (j) {
          if (b.isArray(j)) {
            O = true;
            h = "last";
            m = f
          } else {
            j = [j];
            O = false
          }
          this.each(function () {
            var T = j.length;
            v = this.p.rownumbers === true ? 1 : 0;
            a = this.p.multiselect === true ? 1 : 0;
            r = this.p.subGrid === true ? 1 : 0;
            if (!O)if (typeof f != "undefined")f += ""; else {
              f = b.jgrid.randId();
              if (this.p.keyIndex !== false) {
                m = this.p.colModel[this.p.keyIndex + a + r + v].name;
                if (typeof j[0][m] != "undefined")f = j[0][m]
              }
            }
            o = this.p.altclass;
            for (var J = 0, D = "", W = {}, U = b.isFunction(this.p.afterInsertRow) ? true : false; J < T;) {
              q =
                j[J];
              l = "";
              if (O) {
                try {
                  f = q[m]
                } catch (ga) {
                  f = b.jgrid.randId()
                }
                D = this.p.altRows === true ? (this.rows.length - 1) % 2 === 0 ? o : "" : ""
              }
              if (v) {
                K = this.formatCol(0, 1, "", null, f, true);
                l += '<td role="gridcell" aria-describedby="' + this.p.id + '_rn" class="ui-state-default jqgrid-rownum" ' + K + ">0</td>"
              }
              if (a) {
                P = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + f + '" class="cbox"/>';
                K = this.formatCol(v, 1, "", null, f, true);
                l += '<td role="gridcell" aria-describedby="' + this.p.id + '_cb" ' + K + ">" + P + "</td>"
              }
              if (r)l += b(this).jqGrid("addSubGridCell",
                a + v, 1);
              for (E = a + r + v; E < this.p.colModel.length; E++) {
                B = this.p.colModel[E];
                k = B.name;
                W[k] = B.formatter && typeof B.formatter === "string" && B.formatter == "date" ? b.unformat.date(q[k], B) : q[k];
                P = this.formatter(f, b.jgrid.getAccessor(q, k), E, q, "edit");
                K = this.formatCol(E, 1, P, f, q, true);
                l += '<td role="gridcell" aria-describedby="' + this.p.id + "_" + k + '" ' + K + ">" + P + "</td>"
              }
              l = '<tr id="' + f + '" role="row" tabindex="-1" class="ui-widget-content jqgrow ui-row-' + this.p.direction + " " + D + '">' + l + "</tr>";
              if (this.p.subGrid === true) {
                l = b(l)[0];
                b(this).jqGrid("addSubGrid", l, a + v)
              }
              if (this.rows.length === 0)b("table:first", this.grid.bDiv).append(l); else switch (h) {
                case "last":
                  b(this.rows[this.rows.length - 1]).after(l);
                  break;
                case "first":
                  b(this.rows[0]).after(l);
                  break;
                case "after":
                  if (z = this.rows.namedItem(c))b(this.rows[z.rowIndex + 1]).hasClass("ui-subgrid") ? b(this.rows[z.rowIndex + 1]).after(l) : b(z).after(l);
                  break;
                case "before":
                  if (z = this.rows.namedItem(c)) {
                    b(z).before(l);
                    z = z.rowIndex
                  }
              }
              this.p.records++;
              this.p.reccount++;
              U && this.p.afterInsertRow.call(this,
                f, q, q);
              J++;
              if (this.p.datatype == "local") {
                W[this.p.localReader.id] = f;
                this.p._index[f] = this.p.data.length;
                this.p.data.push(W);
                W = {}
              }
            }
            if (this.p.altRows === true && !O)if (h == "last")(this.rows.length - 1) % 2 == 1 && b(this.rows[this.rows.length - 1]).addClass(o); else b(this.rows).each(function (ca) {
              ca % 2 == 1 ? b(this).addClass(o) : b(this).removeClass(o)
            });
            this.updatepager(true, true);
            g = true
          })
        }
        return g
      }, footerData:function (f, j, h) {
        function c(r) {
          for (var v in r)if (r.hasOwnProperty(v))return false;
          return true
        }

        var g, k = false, l = {},
          a;
        if (typeof f == "undefined")f = "get";
        if (typeof h != "boolean")h = true;
        f = f.toLowerCase();
        this.each(function () {
          var r = this, v;
          if (!r.grid || !r.p.footerrow)return false;
          if (f == "set")if (c(j))return false;
          k = true;
          b(this.p.colModel).each(function (z) {
            g = this.name;
            if (f == "set") {
              if (j[g] !== undefined) {
                v = h ? r.formatter("", j[g], z, j, "edit") : j[g];
                a = this.title ? {title:b.jgrid.stripHtml(v)} : {};
                b("tr.footrow td:eq(" + z + ")", r.grid.sDiv).html(v).attr(a);
                k = true
              }
            } else if (f == "get")l[g] = b("tr.footrow td:eq(" + z + ")", r.grid.sDiv).html()
          })
        });
        return f == "get" ? l : k
      }, showHideCol:function (f, j) {
        return this.each(function () {
          var h = this, c = false, g = b.browser.webkit || b.browser.safari ? 0 : h.p.cellLayout, k;
          if (h.grid) {
            if (typeof f === "string")f = [f];
            j = j != "none" ? "" : "none";
            var l = j === "" ? true : false;
            b(this.p.colModel).each(function (a) {
              if (b.inArray(this.name, f) !== -1 && this.hidden === l) {
                b("tr", h.grid.hDiv).each(function () {
                  b(this).children("th:eq(" + a + ")").css("display", j)
                });
                b(h.rows).each(function () {
                  b(this).children("td:eq(" + a + ")").css("display", j)
                });
                h.p.footerrow &&
                b(h.grid.sDiv).children("td:eq(" + a + ")").css("display", j);
                k = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                if (j === "none")h.p.tblwidth -= k + g; else h.p.tblwidth += k + g;
                this.hidden = !l;
                c = true
              }
            });
            if (c === true)if (h.grid.width !== h.p.tblwidth)b(h).jqGrid("setGridWidth", h.p.shrinkToFit === true ? h.grid.width : h.p.tblwidth, true)
          }
        })
      }, hideCol:function (f) {
        return this.each(function () {
          b(this).jqGrid("showHideCol", f, "none")
        })
      }, showCol:function (f) {
        return this.each(function () {
          b(this).jqGrid("showHideCol", f, "")
        })
      }, remapColumns:function (f, j, h) {
        function c(l) {
          var a;
          a = l.length ? b.makeArray(l) : b.extend({}, l);
          b.each(f, function (r) {
            l[r] = a[this]
          })
        }

        function g(l, a) {
          b(">tr" + (a || ""), l).each(function () {
            var r = this, v = b.makeArray(r.cells);
            b.each(f, function () {
              var z = v[this];
              z && r.appendChild(z)
            })
          })
        }

        var k = this.get(0);
        c(k.p.colModel);
        c(k.p.colNames);
        c(k.grid.headers);
        g(b("thead:first", k.grid.hDiv), h && ":not(.ui-jqgrid-labels)");
        j && g(b("#" + b.jgrid.jqID(k.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
        k.p.footerrow && g(b("tbody:first", k.grid.sDiv));
        if (k.p.remapColumns)if (k.p.remapColumns.length)c(k.p.remapColumns); else k.p.remapColumns = b.makeArray(f);
        k.p.lastsort = b.inArray(k.p.lastsort, f);
        if (k.p.treeGrid)k.p.expColInd = b.inArray(k.p.expColInd, f)
      }, setGridWidth:function (f, j) {
        return this.each(function () {
          if (this.grid) {
            var h = this, c, g = 0, k = b.browser.webkit || b.browser.safari ? 0 : h.p.cellLayout, l, a = 0, r = false, v = h.p.scrollOffset, z, E = 0, P = 0, K;
            if (typeof j != "boolean")j = h.p.shrinkToFit;
            if (!isNaN(f)) {
              f = parseInt(f, 10);
              h.grid.width = h.p.width = f;
              b("#gbox_" + b.jgrid.jqID(h.p.id)).css("width",
                f + "px");
              b("#gview_" + b.jgrid.jqID(h.p.id)).css("width", f + "px");
              b(h.grid.bDiv).css("width", f + "px");
              b(h.grid.hDiv).css("width", f + "px");
              h.p.pager && b(h.p.pager).css("width", f + "px");
              h.p.toppager && b(h.p.toppager).css("width", f + "px");
              if (h.p.toolbar[0] === true) {
                b(h.grid.uDiv).css("width", f + "px");
                h.p.toolbar[1] == "both" && b(h.grid.ubDiv).css("width", f + "px")
              }
              h.p.footerrow && b(h.grid.sDiv).css("width", f + "px");
              if (j === false && h.p.forceFit === true)h.p.forceFit = false;
              if (j === true) {
                b.each(h.p.colModel, function () {
                  if (this.hidden ===
                    false) {
                    c = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                    g += c + k;
                    if (this.fixed)E += c + k; else a++;
                    P++
                  }
                });
                if (a !== 0) {
                  h.p.tblwidth = g;
                  z = f - k * a - E;
                  if (!isNaN(h.p.height))if (b(h.grid.bDiv)[0].clientHeight < b(h.grid.bDiv)[0].scrollHeight || h.rows.length === 1) {
                    r = true;
                    z -= v
                  }
                  g = 0;
                  var O = h.grid.cols.length > 0;
                  b.each(h.p.colModel, function (m) {
                    if (this.hidden === false && !this.fixed) {
                      c = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                      c = Math.round(z * c / (h.p.tblwidth - k * a - E));
                      if (!(c < 0)) {
                        this.width = c;
                        g += c;
                        h.grid.headers[m].width =
                          c;
                        h.grid.headers[m].el.style.width = c + "px";
                        if (h.p.footerrow)h.grid.footers[m].style.width = c + "px";
                        if (O)h.grid.cols[m].style.width = c + "px";
                        l = m
                      }
                    }
                  });
                  K = 0;
                  if (r) {
                    if (f - E - (g + k * a) !== v)K = f - E - (g + k * a) - v
                  } else if (Math.abs(f - E - (g + k * a)) !== 1)K = f - E - (g + k * a);
                  h.p.colModel[l].width += K;
                  h.p.tblwidth = g + K + k * a + E;
                  if (h.p.tblwidth > f) {
                    r = h.p.tblwidth - parseInt(f, 10);
                    h.p.tblwidth = f;
                    c = h.p.colModel[l].width -= r
                  } else c = h.p.colModel[l].width;
                  h.grid.headers[l].width = c;
                  h.grid.headers[l].el.style.width = c + "px";
                  if (O)h.grid.cols[l].style.width =
                    c + "px";
                  b("table:first", h.grid.bDiv).css("width", h.p.tblwidth + "px");
                  b("table:first", h.grid.hDiv).css("width", h.p.tblwidth + "px");
                  h.grid.hDiv.scrollLeft = h.grid.bDiv.scrollLeft;
                  if (h.p.footerrow) {
                    h.grid.footers[l].style.width = c + "px";
                    b("table:first", h.grid.sDiv).css("width", h.p.tblwidth + "px")
                  }
                }
              }
            }
          }
        })
      }, setGridHeight:function (f) {
        return this.each(function () {
          if (this.grid) {
            b(this.grid.bDiv).css({height:f + (isNaN(f) ? "" : "px")});
            this.p.height = f;
            this.p.scroll && this.grid.populateVisible()
          }
        })
      }, setCaption:function (f) {
        return this.each(function () {
          this.p.caption =
            f;
          b("span.ui-jqgrid-title", this.grid.cDiv).html(f);
          b(this.grid.cDiv).show()
        })
      }, setLabel:function (f, j, h, c) {
        return this.each(function () {
          var g = -1;
          if (this.grid) {
            if (isNaN(f))b(this.p.colModel).each(function (a) {
              if (this.name == f) {
                g = a;
                return false
              }
            }); else g = parseInt(f, 10);
            if (g >= 0) {
              var k = b("tr.ui-jqgrid-labels th:eq(" + g + ")", this.grid.hDiv);
              if (j) {
                var l = b(".s-ico", k);
                b("[id^=jqgh_]", k).empty().html(j).append(l);
                this.p.colNames[g] = j
              }
              if (h)typeof h === "string" ? b(k).addClass(h) : b(k).css(h);
              typeof c === "object" && b(k).attr(c)
            }
          }
        })
      },
        setCell:function (f, j, h, c, g, k) {
          return this.each(function () {
            var l = -1, a, r;
            if (this.grid) {
              if (isNaN(j))b(this.p.colModel).each(function (z) {
                if (this.name == j) {
                  l = z;
                  return false
                }
              }); else l = parseInt(j, 10);
              if (l >= 0)if (a = this.rows.namedItem(f)) {
                var v = b("td:eq(" + l + ")", a);
                if (h !== "" || k === true) {
                  a = this.formatter(f, h, l, a, "edit");
                  r = this.p.colModel[l].title ? {title:b.jgrid.stripHtml(a)} : {};
                  this.p.treeGrid && b(".tree-wrap", b(v)).length > 0 ? b("span", b(v)).html(a).attr(r) : b(v).html(a).attr(r);
                  if (this.p.datatype == "local") {
                    a = this.p.colModel[l];
                    h = a.formatter && typeof a.formatter === "string" && a.formatter == "date" ? b.unformat.date(h, a) : h;
                    r = this.p._index[f];
                    if (typeof r != "undefined")this.p.data[r][a.name] = h
                  }
                }
                if (typeof c === "string")b(v).addClass(c); else c && b(v).css(c);
                typeof g === "object" && b(v).attr(g)
              }
            }
          })
        }, getCell:function (f, j) {
          var h = false;
          this.each(function () {
            var c = -1;
            if (this.grid) {
              if (isNaN(j))b(this.p.colModel).each(function (l) {
                if (this.name === j) {
                  c = l;
                  return false
                }
              }); else c = parseInt(j, 10);
              if (c >= 0) {
                var g = this.rows.namedItem(f);
                if (g)try {
                  h = b.unformat(b("td:eq(" +
                    c + ")", g), {rowId:g.id, colModel:this.p.colModel[c]}, c)
                } catch (k) {
                  h = b.jgrid.htmlDecode(b("td:eq(" + c + ")", g).html())
                }
              }
            }
          });
          return h
        }, getCol:function (f, j, h) {
          var c = [], g, k = 0, l = 0, a = 0, r;
          j = typeof j != "boolean" ? false : j;
          if (typeof h == "undefined")h = false;
          this.each(function () {
            var v = -1;
            if (this.grid) {
              if (isNaN(f))b(this.p.colModel).each(function (K) {
                if (this.name === f) {
                  v = K;
                  return false
                }
              }); else v = parseInt(f, 10);
              if (v >= 0) {
                var z = this.rows.length, E = 0;
                if (z && z > 0) {
                  for (; E < z;) {
                    if (b(this.rows[E]).hasClass("jqgrow")) {
                      try {
                        g = b.unformat(b(this.rows[E].cells[v]),
                          {rowId:this.rows[E].id, colModel:this.p.colModel[v]}, v)
                      } catch (P) {
                        g = b.jgrid.htmlDecode(this.rows[E].cells[v].innerHTML)
                      }
                      if (h) {
                        r = parseFloat(g);
                        k += r;
                        l = Math.min(l, r);
                        a = Math.max(l, r)
                      } else j ? c.push({id:this.rows[E].id, value:g}) : c.push(g)
                    }
                    E++
                  }
                  if (h)switch (h.toLowerCase()) {
                    case "sum":
                      c = k;
                      break;
                    case "avg":
                      c = k / z;
                      break;
                    case "count":
                      c = z;
                      break;
                    case "min":
                      c = l;
                      break;
                    case "max":
                      c = a
                  }
                }
              }
            }
          });
          return c
        }, clearGridData:function (f) {
          return this.each(function () {
            if (this.grid) {
              if (typeof f != "boolean")f = false;
              if (this.p.deepempty)b("#" +
                b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove(); else {
                var j = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                b("#" + b.jgrid.jqID(this.p.id) + " tbody:first").empty().append(j)
              }
              this.p.footerrow && f && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
              this.p.selrow = null;
              this.p.selarrrow = [];
              this.p.savedRow = [];
              this.p.records = 0;
              this.p.page = 1;
              this.p.lastpage = 0;
              this.p.reccount = 0;
              this.p.data = [];
              this.p_index = {};
              this.updatepager(true, false)
            }
          })
        }, getInd:function (f, j) {
          var h = false, c;
          this.each(function () {
            if (c =
              this.rows.namedItem(f))h = j === true ? c : c.rowIndex
          });
          return h
        }, bindKeys:function (f) {
          var j = b.extend({onEnter:null, onSpace:null, onLeftKey:null, onRightKey:null, scrollingRows:true}, f || {});
          return this.each(function () {
            var h = this;
            b("body").is("[role]") || b("body").attr("role", "application");
            h.p.scrollrows = j.scrollingRows;
            b(h).keydown(function (c) {
              var g = b(h).find("tr[tabindex=0]")[0], k, l, a, r = h.p.treeReader.expanded_field;
              if (g) {
                a = h.p._index[g.id];
                if (c.keyCode === 37 || c.keyCode === 38 || c.keyCode === 39 || c.keyCode === 40) {
                  if (c.keyCode ===
                    38) {
                    l = g.previousSibling;
                    k = "";
                    if (l)if (b(l).is(":hidden"))for (; l;) {
                      l = l.previousSibling;
                      if (!b(l).is(":hidden") && b(l).hasClass("jqgrow")) {
                        k = l.id;
                        break
                      }
                    } else k = l.id;
                    b(h).jqGrid("setSelection", k)
                  }
                  if (c.keyCode === 40) {
                    l = g.nextSibling;
                    k = "";
                    if (l)if (b(l).is(":hidden"))for (; l;) {
                      l = l.nextSibling;
                      if (!b(l).is(":hidden") && b(l).hasClass("jqgrow")) {
                        k = l.id;
                        break
                      }
                    } else k = l.id;
                    b(h).jqGrid("setSelection", k)
                  }
                  if (c.keyCode === 37) {
                    h.p.treeGrid && h.p.data[a][r] && b(g).find("div.treeclick").trigger("click");
                    b.isFunction(j.onLeftKey) &&
                    j.onLeftKey.call(h, h.p.selrow)
                  }
                  if (c.keyCode === 39) {
                    h.p.treeGrid && !h.p.data[a][r] && b(g).find("div.treeclick").trigger("click");
                    b.isFunction(j.onRightKey) && j.onRightKey.call(h, h.p.selrow)
                  }
                  return false
                } else if (c.keyCode === 13) {
                  b.isFunction(j.onEnter) && j.onEnter.call(h, h.p.selrow);
                  return false
                } else if (c.keyCode === 32) {
                  b.isFunction(j.onSpace) && j.onSpace.call(h, h.p.selrow);
                  return false
                }
              }
            })
          })
        }, unbindKeys:function () {
          return this.each(function () {
            b(this).unbind("keydown")
          })
        }, getLocalRow:function (f) {
          var j = false,
            h;
          this.each(function () {
            if (typeof f !== "undefined") {
              h = this.p._index[f];
              if (h >= 0)j = this.p.data[h]
            }
          });
          return j
        }})
    })(jQuery);
    (function (b) {
      b.fmatter = {};
      b.extend(b.fmatter, {isBoolean:function (a) {
        return typeof a === "boolean"
      }, isObject:function (a) {
        return a && (typeof a === "object" || b.isFunction(a)) || false
      }, isString:function (a) {
        return typeof a === "string"
      }, isNumber:function (a) {
        return typeof a === "number" && isFinite(a)
      }, isNull:function (a) {
        return a === null
      }, isUndefined:function (a) {
        return typeof a === "undefined"
      }, isValue:function (a) {
        return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a)
      }, isEmpty:function (a) {
        if (!this.isString(a) &&
          this.isValue(a))return false; else if (!this.isValue(a))return true;
        a = b.trim(a).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
        return a === ""
      }});
      b.fn.fmatter = function (a, c, d, e, f) {
        var g = c;
        d = b.extend({}, b.jgrid.formatter, d);
        if (b.fn.fmatter[a])g = b.fn.fmatter[a](c, d, e, f);
        return g
      };
      b.fmatter.util = {NumberFormat:function (a, c) {
        b.fmatter.isNumber(a) || (a *= 1);
        if (b.fmatter.isNumber(a)) {
          var d = a < 0, e = a + "", f = c.decimalSeparator ? c.decimalSeparator : ".", g;
          if (b.fmatter.isNumber(c.decimalPlaces)) {
            var h = c.decimalPlaces;
            e = Math.pow(10, h);
            e = Math.round(a * e) / e + "";
            g = e.lastIndexOf(".");
            if (h > 0) {
              if (g < 0) {
                e += f;
                g = e.length - 1
              } else if (f !== ".")e = e.replace(".", f);
              for (; e.length - 1 - g < h;)e += "0"
            }
          }
          if (c.thousandsSeparator) {
            h = c.thousandsSeparator;
            g = e.lastIndexOf(f);
            g = g > -1 ? g : e.length;
            f = e.substring(g);
            for (var i = -1, j = g; j > 0; j--) {
              i++;
              if (i % 3 === 0 && j !== g && (!d || j > 1))f = h + f;
              f = e.charAt(j - 1) + f
            }
            e = f
          }
          e = c.prefix ? c.prefix + e : e;
          return e = c.suffix ? e + c.suffix : e
        } else return a
      }, DateFormat:function (a, c, d, e) {
        var f = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
          g = typeof c === "string" ? c.match(f) : null;
        f = function (m, r) {
          m = String(m);
          for (r = parseInt(r, 10) || 2; m.length < r;)m = "0" + m;
          return m
        };
        var h = {m:1, d:1, y:1970, h:0, i:0, s:0, u:0}, i = 0, j, k = ["i18n"];
        k.i18n = {dayNames:e.dayNames, monthNames:e.monthNames};
        if (a in e.masks)a = e.masks[a];
        if (c.constructor === Number) {
          if (String(a).toLowerCase() == "u")c *= 1E3;
          i = new Date(c)
        } else if (c.constructor === Date)i = c; else if (g !== null) {
          i = new Date(parseInt(g[1], 10));
          if (g[3]) {
            a = Number(g[5]) * 60 + Number(g[6]);
            a *= g[4] == "-" ? 1 : -1;
            a -= i.getTimezoneOffset();
            i.setTime(Number(Number(i) + a * 6E4))
          }
        } else {
          c = String(c).split(/[\\\/:_;.,\t\T\s-]/);
          a = a.split(/[\\\/:_;.,\t\T\s-]/);
          g = 0;
          for (j = a.length; g < j; g++) {
            if (a[g] == "M") {
              i = b.inArray(c[g], k.i18n.monthNames);
              if (i !== -1 && i < 12)c[g] = i + 1
            }
            if (a[g] == "F") {
              i = b.inArray(c[g], k.i18n.monthNames);
              if (i !== -1 && i > 11)c[g] = i + 1 - 12
            }
            if (c[g])h[a[g].toLowerCase()] = parseInt(c[g], 10)
          }
          if (h.f)h.m = h.f;
          if (h.m === 0 && h.y === 0 && h.d === 0)return"&#160;";
          h.m = parseInt(h.m, 10) - 1;
          i = h.y;
          if (i >= 70 && i <= 99)h.y = 1900 + h.y; else if (i >= 0 && i <= 69)h.y = 2E3 + h.y;
          i = new Date(h.y,
            h.m, h.d, h.h, h.i, h.s, h.u)
        }
        if (d in e.masks)d = e.masks[d]; else d || (d = "Y-m-d");
        a = i.getHours();
        c = i.getMinutes();
        h = i.getDate();
        g = i.getMonth() + 1;
        j = i.getTimezoneOffset();
        var l = i.getSeconds(), o = i.getMilliseconds(), n = i.getDay(), p = i.getFullYear(), q = (n + 6) % 7 + 1, s = (new Date(p, g - 1, h) - new Date(p, 0, 1)) / 864E5, t = {d:f(h), D:k.i18n.dayNames[n], j:h, l:k.i18n.dayNames[n + 7], N:q, S:e.S(h), w:n, z:s, W:q < 5 ? Math.floor((s + q - 1) / 7) + 1 : Math.floor((s + q - 1) / 7) || (((new Date(p - 1, 0, 1)).getDay() + 6) % 7 < 4 ? 53 : 52), F:k.i18n.monthNames[g - 1 + 12], m:f(g),
          M:k.i18n.monthNames[g - 1], n:g, t:"?", L:"?", o:"?", Y:p, y:String(p).substring(2), a:a < 12 ? e.AmPm[0] : e.AmPm[1], A:a < 12 ? e.AmPm[2] : e.AmPm[3], B:"?", g:a % 12 || 12, G:a, h:f(a % 12 || 12), H:f(a), i:f(c), s:f(l), u:o, e:"?", I:"?", O:(j > 0 ? "-" : "+") + f(Math.floor(Math.abs(j) / 60) * 100 + Math.abs(j) % 60, 4), P:"?", T:(String(i).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""), Z:"?", c:"?", r:"?", U:Math.floor(i /
            1E3)};
        return d.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, function (m) {
          return m in t ? t[m] : m.substring(1)
        })
      }};
      b.fn.fmatter.defaultFormat = function (a, c) {
        return b.fmatter.isValue(a) && a !== "" ? a : c.defaultValue ? c.defaultValue : "&#160;"
      };
      b.fn.fmatter.email = function (a, c) {
        return b.fmatter.isEmpty(a) ? b.fn.fmatter.defaultFormat(a, c) : '<a href="mailto:' + a + '">' + a + "</a>"
      };
      b.fn.fmatter.checkbox = function (a, c) {
        var d = b.extend({}, c.checkbox), e;
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d,
          c.colModel.formatoptions));
        e = d.disabled === true ? 'disabled="disabled"' : "";
        if (b.fmatter.isEmpty(a) || b.fmatter.isUndefined(a))a = b.fn.fmatter.defaultFormat(a, d);
        a += "";
        a = a.toLowerCase();
        return'<input type="checkbox" ' + (a.search(/(false|0|no|off)/i) < 0 ? " checked='checked' " : "") + ' value="' + a + '" offval="no" ' + e + "/>"
      };
      b.fn.fmatter.link = function (a, c) {
        var d = {target:c.target}, e = "";
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
        if (d.target)e = "target=" + d.target;
        return b.fmatter.isEmpty(a) ?
          b.fn.fmatter.defaultFormat(a, c) : "<a " + e + ' href="' + a + '">' + a + "</a>"
      };
      b.fn.fmatter.showlink = function (a, c) {
        var d = {baseLinkUrl:c.baseLinkUrl, showAction:c.showAction, addParam:c.addParam || "", target:c.target, idName:c.idName}, e = "";
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
        if (d.target)e = "target=" + d.target;
        d = d.baseLinkUrl + d.showAction + "?" + d.idName + "=" + c.rowId + d.addParam;
        return b.fmatter.isString(a) || b.fmatter.isNumber(a) ? "<a " + e + ' href="' + d + '">' + a + "</a>" : b.fn.fmatter.defaultFormat(a,
          c)
      };
      b.fn.fmatter.integer = function (a, c) {
        var d = b.extend({}, c.integer);
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
        if (b.fmatter.isEmpty(a))return d.defaultValue;
        return b.fmatter.util.NumberFormat(a, d)
      };
      b.fn.fmatter.number = function (a, c) {
        var d = b.extend({}, c.number);
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
        if (b.fmatter.isEmpty(a))return d.defaultValue;
        return b.fmatter.util.NumberFormat(a, d)
      };
      b.fn.fmatter.currency =
        function (a, c) {
          var d = b.extend({}, c.currency);
          b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
          if (b.fmatter.isEmpty(a))return d.defaultValue;
          return b.fmatter.util.NumberFormat(a, d)
        };
      b.fn.fmatter.date = function (a, c, d, e) {
        d = b.extend({}, c.date);
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend({}, d, c.colModel.formatoptions));
        return!d.reformatAfterEdit && e == "edit" ? b.fn.fmatter.defaultFormat(a, c) : b.fmatter.isEmpty(a) ? b.fn.fmatter.defaultFormat(a, c) : b.fmatter.util.DateFormat(d.srcformat,
          a, d.newformat, d)
      };
      b.fn.fmatter.select = function (a, c) {
        a += "";
        var d = false, e = [];
        if (b.fmatter.isUndefined(c.colModel.formatoptions)) {
          if (!b.fmatter.isUndefined(c.colModel.editoptions))d = c.colModel.editoptions.value
        } else d = c.colModel.formatoptions.value;
        if (d) {
          var f = c.colModel.editoptions.multiple === true ? true : false, g = [], h;
          if (f) {
            g = a.split(",");
            g = b.map(g, function (l) {
              return b.trim(l)
            })
          }
          if (b.fmatter.isString(d))for (var i = d.split(";"), j = 0, k = 0; k < i.length; k++) {
            h = i[k].split(":");
            if (h.length > 2)h[1] = jQuery.map(h,function (l, o) {
              if (o > 0)return l
            }).join(":");
            if (f) {
              if (jQuery.inArray(h[0], g) > -1) {
                e[j] = h[1];
                j++
              }
            } else if (b.trim(h[0]) == b.trim(a)) {
              e[0] = h[1];
              break
            }
          } else if (b.fmatter.isObject(d))if (f)e = jQuery.map(g, function (l) {
            return d[l]
          }); else e[0] = d[a] || ""
        }
        a = e.join(", ");
        return a === "" ? b.fn.fmatter.defaultFormat(a, c) : a
      };
      b.fn.fmatter.rowactions = function (a, c, d, e) {
        var f = {keys:false, editbutton:true, delbutton:true, onEdit:null, onSuccess:null, afterSave:null, onError:null, afterRestore:null, extraparam:{oper:"edit"}, url:null, delOptions:{}};
        e = b("#" + c)[0].p.colModel[e];
        b.fmatter.isUndefined(e.formatoptions) || (f = b.extend(f, e.formatoptions));
        e = function (h) {
          f.afterSave && f.afterSave(h);
          b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c).show();
          b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c).hide()
        };
        var g = function (h) {
          f.afterRestore && f.afterRestore(h);
          b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c).show();
          b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c).hide()
        };
        switch (d) {
          case "edit":
            b("#" +
              c).jqGrid("editRow", a, f.keys, f.onEdit, f.onSuccess, f.url, f.extraparam, e, f.onError, g);
            b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c).hide();
            b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c).show();
            break;
          case "save":
            if (b("#" + c).jqGrid("saveRow", a, f.onSuccess, f.url, f.extraparam, e, f.onError, g)) {
              b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c).show();
              b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c).hide()
            }
            break;
          case "cancel":
            b("#" +
              c).jqGrid("restoreRow", a, g);
            b("tr#" + a + " div.ui-inline-edit, tr#" + a + " div.ui-inline-del", "#" + c).show();
            b("tr#" + a + " div.ui-inline-save, tr#" + a + " div.ui-inline-cancel", "#" + c).hide();
            break;
          case "del":
            b("#" + c).jqGrid("delGridRow", a, f.delOptions)
        }
      };
      b.fn.fmatter.actions = function (a, c) {
        var d = {keys:false, editbutton:true, delbutton:true};
        b.fmatter.isUndefined(c.colModel.formatoptions) || (d = b.extend(d, c.colModel.formatoptions));
        var e = c.rowId, f = "", g;
        if (typeof e == "undefined" || b.fmatter.isEmpty(e))return"";
        if (d.editbutton) {
          g =
            "onclick=$.fn.fmatter.rowactions('" + e + "','" + c.gid + "','edit'," + c.pos + ");";
          f = f + "<div style='margin-left:8px;'><div title='" + b.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + g + "><span class='ui-icon ui-icon-pencil'></span></div>"
        }
        if (d.delbutton) {
          g = "onclick=$.fn.fmatter.rowactions('" + e + "','" + c.gid + "','del'," + c.pos + ");";
          f = f + "<div title='" + b.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + g + "><span class='ui-icon ui-icon-trash'></span></div>"
        }
        g =
          "onclick=$.fn.fmatter.rowactions('" + e + "','" + c.gid + "','save'," + c.pos + ");";
        f = f + "<div title='" + b.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save'><span class='ui-icon ui-icon-disk' " + g + "></span></div>";
        g = "onclick=$.fn.fmatter.rowactions('" + e + "','" + c.gid + "','cancel'," + c.pos + ");";
        return f = f + "<div title='" + b.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel'><span class='ui-icon ui-icon-cancel' " + g + "></span></div></div>"
      };
      b.unformat = function (a, c, d, e) {
        var f, g = c.colModel.formatter, h = c.colModel.formatoptions || {}, i = /([\.\*\_\'\(\)\{\}\+\?\\])/g, j = c.colModel.unformat || b.fn.fmatter[g] && b.fn.fmatter[g].unformat;
        if (typeof j !== "undefined" && b.isFunction(j))f = j(b(a).text(), c, a); else if (!b.fmatter.isUndefined(g) && b.fmatter.isString(g)) {
          f = b.jgrid.formatter || {};
          switch (g) {
            case "integer":
              h = b.extend({}, f.integer, h);
              c = h.thousandsSeparator.replace(i, "\\$1");
              f = b(a).text().replace(RegExp(c, "g"), "");
              break;
            case "number":
              h = b.extend({}, f.number,
                h);
              c = h.thousandsSeparator.replace(i, "\\$1");
              f = b(a).text().replace(RegExp(c, "g"), "").replace(h.decimalSeparator, ".");
              break;
            case "currency":
              h = b.extend({}, f.currency, h);
              c = h.thousandsSeparator.replace(i, "\\$1");
              f = b(a).text().replace(RegExp(c, "g"), "").replace(h.decimalSeparator, ".").replace(h.prefix, "").replace(h.suffix, "");
              break;
            case "checkbox":
              h = c.colModel.editoptions ? c.colModel.editoptions.value.split(":") : ["Yes", "No"];
              f = b("input", a).attr("checked") ? h[0] : h[1];
              break;
            case "select":
              f = b.unformat.select(a,
                c, d, e);
              break;
            case "actions":
              return"";
            default:
              f = b(a).text()
          }
        }
        return f ? f : e === true ? b(a).text() : b.jgrid.htmlDecode(b(a).html())
      };
      b.unformat.select = function (a, c, d, e) {
        d = [];
        a = b(a).text();
        if (e === true)return a;
        c = b.extend({}, c.colModel.editoptions);
        if (c.value) {
          var f = c.value;
          c = c.multiple === true ? true : false;
          e = [];
          var g;
          if (c) {
            e = a.split(",");
            e = b.map(e, function (k) {
              return b.trim(k)
            })
          }
          if (b.fmatter.isString(f))for (var h = f.split(";"), i = 0, j = 0; j < h.length; j++) {
            g = h[j].split(":");
            if (g.length > 2)g[1] = jQuery.map(g,function (k, l) {
              if (l > 0)return k
            }).join(":");
            if (c) {
              if (jQuery.inArray(g[1], e) > -1) {
                d[i] = g[0];
                i++
              }
            } else if (b.trim(g[1]) == b.trim(a)) {
              d[0] = g[0];
              break
            }
          } else if (b.fmatter.isObject(f) || b.isArray(f)) {
            c || (e[0] = a);
            d = jQuery.map(e, function (k) {
              var l;
              b.each(f, function (o, n) {
                if (n == k) {
                  l = o;
                  return false
                }
              });
              if (typeof l != "undefined")return l
            })
          }
          return d.join(", ")
        } else return a || ""
      };
      b.unformat.date = function (a, c) {
        var d = b.jgrid.formatter.date || {};
        b.fmatter.isUndefined(c.formatoptions) || (d = b.extend({}, d, c.formatoptions));
        return b.fmatter.isEmpty(a) ?
          b.fn.fmatter.defaultFormat(a, c) : b.fmatter.util.DateFormat(d.newformat, a, d.srcformat, d)
      }
    })(jQuery);
    (function (a) {
      a.jgrid.extend({getColProp:function (c) {
        var h = {}, b = this[0];
        if (!b.grid)return false;
        b = b.p.colModel;
        for (var i = 0; i < b.length; i++)if (b[i].name == c) {
          h = b[i];
          break
        }
        return h
      }, setColProp:function (c, h) {
        return this.each(function () {
          if (this.grid)if (h)for (var b = this.p.colModel, i = 0; i < b.length; i++)if (b[i].name == c) {
            a.extend(this.p.colModel[i], h);
            break
          }
        })
      }, sortGrid:function (c, h, b) {
        return this.each(function () {
          var i = -1;
          if (this.grid) {
            if (!c)c = this.p.sortname;
            for (var o = 0; o < this.p.colModel.length; o++)if (this.p.colModel[o].index ==
              c || this.p.colModel[o].name == c) {
              i = o;
              break
            }
            if (i != -1) {
              o = this.p.colModel[i].sortable;
              if (typeof o !== "boolean")o = true;
              if (typeof h !== "boolean")h = false;
              o && this.sortData("jqgh_" + c, i, h, b)
            }
          }
        })
      }, GridDestroy:function () {
        return this.each(function () {
          if (this.grid) {
            this.p.pager && a(this.p.pager).remove();
            var c = this.id;
            try {
              a("#gbox_" + c).remove()
            } catch (h) {
            }
          }
        })
      }, GridUnload:function () {
        return this.each(function () {
          if (this.grid) {
            var c = {id:a(this).attr("id"), cl:a(this).attr("class")};
            this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
            var h = document.createElement("table");
            a(h).attr({id:c.id});
            h.className = c.cl;
            c = this.id;
            a(h).removeClass("ui-jqgrid-btable");
            if (a(this.p.pager).parents("#gbox_" + c).length === 1) {
              a(h).insertBefore("#gbox_" + c).show();
              a(this.p.pager).insertBefore("#gbox_" + c)
            } else a(h).insertBefore("#gbox_" + c).show();
            a("#gbox_" + c).remove()
          }
        })
      }, setGridState:function (c) {
        return this.each(function () {
          if (this.grid)if (c == "hidden") {
            a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + this.p.id).slideUp("fast");
            this.p.pager && a(this.p.pager).slideUp("fast");
            this.p.toppager && a(this.p.toppager).slideUp("fast");
            if (this.p.toolbar[0] === true) {
              this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideUp("fast");
              a(this.grid.uDiv).slideUp("fast")
            }
            this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideUp("fast");
            a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
            this.p.gridstate = "hidden"
          } else if (c == "visible") {
            a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + this.p.id).slideDown("fast");
            this.p.pager && a(this.p.pager).slideDown("fast");
            this.p.toppager && a(this.p.toppager).slideDown("fast");
            if (this.p.toolbar[0] === true) {
              this.p.toolbar[1] == "both" && a(this.grid.ubDiv).slideDown("fast");
              a(this.grid.uDiv).slideDown("fast")
            }
            this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + this.p.id).slideDown("fast");
            a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
            this.p.gridstate = "visible"
          }
        })
      }, filterToolbar:function (c) {
        c = a.extend({autosearch:true,
          searchOnEnter:true, beforeSearch:null, afterSearch:null, beforeClear:null, afterClear:null, searchurl:"", stringResult:false, groupOp:"AND", defaultSearch:"bw"}, c || {});
        return this.each(function () {
          function h(e, f) {
            var j = a(e);
            j[0] && jQuery.each(f, function () {
              this.data !== undefined ? j.bind(this.type, this.data, this.fn) : j.bind(this.type, this.fn)
            })
          }

          var b = this;
          if (!this.ftoolbar) {
            var i = function () {
              var e = {}, f = 0, j, d, g = {}, k;
              a.each(b.p.colModel, function () {
                d = this.index || this.name;
                switch (this.stype) {
                  case "select":
                    k = this.searchoptions &&
                      this.searchoptions.sopt ? this.searchoptions.sopt[0] : "eq";
                    if (j = a("#gs_" + a.jgrid.jqID(d), b.grid.hDiv).val()) {
                      e[d] = j;
                      g[d] = k;
                      f++
                    } else try {
                      delete b.p.postData[d]
                    } catch (p) {
                    }
                    break;
                  case "text":
                    k = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : c.defaultSearch;
                    if (j = a("#gs_" + a.jgrid.jqID(d), b.grid.hDiv).val()) {
                      e[d] = j;
                      g[d] = k;
                      f++
                    } else try {
                      delete b.p.postData[d]
                    } catch (s) {
                    }
                }
              });
              var n = f > 0 ? true : false;
              if (c.stringResult === true || b.p.datatype == "local") {
                var m = '{"groupOp":"' + c.groupOp + '","rules":[',
                  q = 0;
                a.each(e, function (p, s) {
                  if (q > 0)m += ",";
                  m += '{"field":"' + p + '",';
                  m += '"op":"' + g[p] + '",';
                  s += "";
                  m += '"data":"' + s.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                  q++
                });
                m += "]}";
                a.extend(b.p.postData, {filters:m});
                a.each(["searchField", "searchString", "searchOper"], function (p, s) {
                  b.p.postData.hasOwnProperty(s) && delete b.p.postData[s]
                })
              } else a.extend(b.p.postData, e);
              var l;
              if (b.p.searchurl) {
                l = b.p.url;
                a(b).jqGrid("setGridParam", {url:b.p.searchurl})
              }
              var r = false;
              if (a.isFunction(c.beforeSearch))r = c.beforeSearch.call(b);
              r || a(b).jqGrid("setGridParam", {search:n}).trigger("reloadGrid", [
                {page:1}
              ]);
              l && a(b).jqGrid("setGridParam", {url:l});
              a.isFunction(c.afterSearch) && c.afterSearch()
            }, o = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"), t;
            a.each(b.p.colModel, function () {
              var e = this, f, j, d, g;
              j = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + b.p.direction + "'></th>");
              f = a("<div style='width:100%;position:relative;height:100%;padding-right:0.3em;'></div>");
              this.hidden === true && a(j).css("display", "none");
              this.search = this.search === false ? false : true;
              if (typeof this.stype == "undefined")this.stype = "text";
              d = a.extend({}, this.searchoptions || {});
              if (this.search)switch (this.stype) {
                case "select":
                  if (g = this.surl || d.dataUrl)a.ajax(a.extend({url:g, dataType:"html", complete:function (l) {
                    if (d.buildSelect !== undefined)(l = d.buildSelect(l)) && a(f).append(l); else a(f).append(l.responseText);
                    d.defaultValue && a("select", f).val(d.defaultValue);
                    a("select", f).attr({name:e.index || e.name, id:"gs_" + e.name});
                    d.attr && a("select", f).attr(d.attr);
                    a("select", f).css({width:"100%"});
                    d.dataInit !== undefined && d.dataInit(a("select", f)[0]);
                    d.dataEvents !== undefined && h(a("select", f)[0], d.dataEvents);
                    c.autosearch === true && a("select", f).change(function () {
                      i();
                      return false
                    });
                    l = null
                  }}, a.jgrid.ajaxOptions, b.p.ajaxSelectOptions || {})); else {
                    var k;
                    if (e.searchoptions && e.searchoptions.value)k = e.searchoptions.value; else if (e.editoptions && e.editoptions.value)k = e.editoptions.value;
                    if (k) {
                      g = document.createElement("select");
                      g.style.width = "100%";
                      a(g).attr({name:e.index ||
                        e.name, id:"gs_" + e.name});
                      var n, m;
                      if (typeof k === "string") {
                        k = k.split(";");
                        for (var q = 0; q < k.length; q++) {
                          n = k[q].split(":");
                          m = document.createElement("option");
                          m.value = n[0];
                          m.innerHTML = n[1];
                          g.appendChild(m)
                        }
                      } else if (typeof k === "object")for (n in k)if (k.hasOwnProperty(n)) {
                        m = document.createElement("option");
                        m.value = n;
                        m.innerHTML = k[n];
                        g.appendChild(m)
                      }
                      d.defaultValue && a(g).val(d.defaultValue);
                      d.attr && a(g).attr(d.attr);
                      d.dataInit !== undefined && d.dataInit(g);
                      d.dataEvents !== undefined && h(g, d.dataEvents);
                      a(f).append(g);
                      c.autosearch === true && a(g).change(function () {
                        i();
                        return false
                      })
                    }
                  }
                  break;
                case "text":
                  g = d.defaultValue ? d.defaultValue : "";
                  a(f).append("<input type='text' style='width:95%;padding:0px;' name='" + (e.index || e.name) + "' id='gs_" + e.name + "' value='" + g + "'/>");
                  d.attr && a("input", f).attr(d.attr);
                  d.dataInit !== undefined && d.dataInit(a("input", f)[0]);
                  d.dataEvents !== undefined && h(a("input", f)[0], d.dataEvents);
                  if (c.autosearch === true)c.searchOnEnter ? a("input", f).keypress(function (l) {
                    if ((l.charCode ? l.charCode : l.keyCode ? l.keyCode :
                      0) == 13) {
                      i();
                      return false
                    }
                    return this
                  }) : a("input", f).keydown(function (l) {
                    switch (l.which) {
                      case 13:
                        return false;
                      case 9:
                      case 16:
                      case 37:
                      case 38:
                      case 39:
                      case 40:
                      case 27:
                        break;
                      default:
                        t && clearTimeout(t);
                        t = setTimeout(function () {
                          i()
                        }, 500)
                    }
                  })
              }
              a(j).append(f);
              a(o).append(j)
            });
            a("table thead", b.grid.hDiv).append(o);
            this.ftoolbar = true;
            this.triggerToolbar = i;
            this.clearToolbar = function (e) {
              var f = {}, j, d = 0, g;
              e = typeof e != "boolean" ? true : e;
              a.each(b.p.colModel, function () {
                j = this.searchoptions && this.searchoptions.defaultValue ?
                  this.searchoptions.defaultValue : "";
                g = this.index || this.name;
                switch (this.stype) {
                  case "select":
                    var r;
                    a("#gs_" + a.jgrid.jqID(g) + " option", b.grid.hDiv).each(function (u) {
                      if (u === 0)this.selected = true;
                      if (a(this).text() == j) {
                        this.selected = true;
                        r = a(this).val();
                        return false
                      }
                    });
                    if (r) {
                      f[g] = r;
                      d++
                    } else try {
                      delete b.p.postData[g]
                    } catch (p) {
                    }
                    break;
                  case "text":
                    a("#gs_" + a.jgrid.jqID(g), b.grid.hDiv).val(j);
                    if (j) {
                      f[g] = j;
                      d++
                    } else try {
                      delete b.p.postData[g]
                    } catch (s) {
                    }
                }
              });
              var k = d > 0 ? true : false;
              if (c.stringResult === true || b.p.datatype ==
                "local") {
                var n = '{"groupOp":"' + c.groupOp + '","rules":[', m = 0;
                a.each(f, function (r, p) {
                  if (m > 0)n += ",";
                  n += '{"field":"' + r + '",';
                  n += '"op":"eq",';
                  p += "";
                  n += '"data":"' + p.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                  m++
                });
                n += "]}";
                a.extend(b.p.postData, {filters:n});
                a.each(["searchField", "searchString", "searchOper"], function (r, p) {
                  b.p.postData.hasOwnProperty(p) && delete b.p.postData[p]
                })
              } else a.extend(b.p.postData, f);
              var q;
              if (b.p.searchurl) {
                q = b.p.url;
                a(b).jqGrid("setGridParam", {url:b.p.searchurl})
              }
              var l = false;
              if (a.isFunction(c.beforeClear))l =
                c.beforeClear.call(b);
              l || e && a(b).jqGrid("setGridParam", {search:k}).trigger("reloadGrid", [
                {page:1}
              ]);
              q && a(b).jqGrid("setGridParam", {url:q});
              a.isFunction(c.afterClear) && c.afterClear()
            };
            this.toggleToolbar = function () {
              var e = a("tr.ui-search-toolbar", b.grid.hDiv);
              e.css("display") == "none" ? e.show() : e.hide()
            }
          }
        })
      }})
    })(jQuery);
    (function (a) {
      a.extend(a.jgrid, {showModal:function (b) {
        b.w.show()
      }, closeModal:function (b) {
        b.w.hide().attr("aria-hidden", "true");
        b.o && b.o.remove()
      }, hideModal:function (b, c) {
        c = a.extend({jqm:true, gb:""}, c || {});
        if (c.onClose) {
          var d = c.onClose(b);
          if (typeof d == "boolean" && !d)return
        }
        if (a.fn.jqm && c.jqm === true)a(b).attr("aria-hidden", "true").jqmHide(); else {
          if (c.gb !== "")try {
            a(".jqgrid-overlay:first", c.gb).hide()
          } catch (f) {
          }
          a(b).hide().attr("aria-hidden", "true")
        }
      }, findPos:function (b) {
        var c = 0, d = 0;
        if (b.offsetParent) {
          do {
            c +=
              b.offsetLeft;
            d += b.offsetTop
          } while (b = b.offsetParent)
        }
        return[c, d]
      }, createModal:function (b, c, d, f, g, h, j) {
        var e = document.createElement("div"), k, m = this;
        j = a.extend({}, j || {});
        k = a(d.gbox).attr("dir") == "rtl" ? true : false;
        e.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
        e.id = b.themodal;
        var i = document.createElement("div");
        i.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
        i.id = b.modalhead;
        a(i).append("<span class='ui-jqdialog-title'>" + d.caption + "</span>");
        var q =
          a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function () {
            q.addClass("ui-state-hover")
          },function () {
            q.removeClass("ui-state-hover")
          }).append("<span class='ui-icon ui-icon-closethick'></span>");
        a(i).append(q);
        if (k) {
          e.dir = "rtl";
          a(".ui-jqdialog-title", i).css("float", "right");
          a(".ui-jqdialog-titlebar-close", i).css("left", "0.3em")
        } else {
          e.dir = "ltr";
          a(".ui-jqdialog-title", i).css("float", "left");
          a(".ui-jqdialog-titlebar-close", i).css("right", "0.3em")
        }
        var l = document.createElement("div");
        a(l).addClass("ui-jqdialog-content ui-widget-content").attr("id", b.modalcontent);
        a(l).append(c);
        e.appendChild(l);
        a(e).prepend(i);
        if (h === true)a("body").append(e); else typeof h == "string" ? a(h).append(e) : a(e).insertBefore(f);
        a(e).css(j);
        if (typeof d.jqModal === "undefined")d.jqModal = true;
        c = {};
        if (a.fn.jqm && d.jqModal === true) {
          if (d.left === 0 && d.top === 0 && d.overlay) {
            j = [];
            j = this.findPos(g);
            d.left = j[0] + 4;
            d.top = j[1] + 4
          }
          c.top = d.top + "px";
          c.left = d.left
        } else if (d.left !== 0 || d.top !== 0) {
          c.left = d.left;
          c.top = d.top + "px"
        }
        a("a.ui-jqdialog-titlebar-close",
          i).click(function () {
            var p = a("#" + b.themodal).data("onClose") || d.onClose, o = a("#" + b.themodal).data("gbox") || d.gbox;
            m.hideModal("#" + b.themodal, {gb:o, jqm:d.jqModal, onClose:p});
            return false
          });
        if (d.width === 0 || !d.width)d.width = 300;
        if (d.height === 0 || !d.height)d.height = 200;
        if (!d.zIndex) {
          f = a(f).parents("*[role=dialog]").filter(":first").css("z-index");
          d.zIndex = f ? parseInt(f, 10) + 1 : 950
        }
        f = 0;
        if (k && c.left && !h) {
          f = a(d.gbox).width() - (!isNaN(d.width) ? parseInt(d.width, 10) : 0) - 8;
          c.left = parseInt(c.left, 10) + parseInt(f, 10)
        }
        if (c.left)c.left +=
          "px";
        a(e).css(a.extend({width:isNaN(d.width) ? "auto" : d.width + "px", height:isNaN(d.height) ? "auto" : d.height + "px", zIndex:d.zIndex, overflow:"hidden"}, c)).attr({tabIndex:"-1", role:"dialog", "aria-labelledby":b.modalhead, "aria-hidden":"true"});
        if (typeof d.drag == "undefined")d.drag = true;
        if (typeof d.resize == "undefined")d.resize = true;
        if (d.drag) {
          a(i).css("cursor", "move");
          if (a.fn.jqDrag)a(e).jqDrag(i); else try {
            a(e).draggable({handle:a("#" + i.id)})
          } catch (n) {
          }
        }
        if (d.resize)if (a.fn.jqResize) {
          a(e).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ui-icon-grip-diagonal-se'></div>");
          a("#" + b.themodal).jqResize(".jqResize", b.scrollelm ? "#" + b.scrollelm : false)
        } else try {
          a(e).resizable({handles:"se, sw", alsoResize:b.scrollelm ? "#" + b.scrollelm : false})
        } catch (r) {
        }
        d.closeOnEscape === true && a(e).keydown(function (p) {
          if (p.which == 27) {
            p = a("#" + b.themodal).data("onClose") || d.onClose;
            m.hideModal(this, {gb:d.gbox, jqm:d.jqModal, onClose:p})
          }
        })
      }, viewModal:function (b, c) {
        c = a.extend({toTop:true, overlay:10, modal:false, onShow:this.showModal, onHide:this.closeModal, gbox:"", jqm:true, jqM:true}, c || {});
        if (a.fn.jqm &&
          c.jqm === true)c.jqM ? a(b).attr("aria-hidden", "false").jqm(c).jqmShow() : a(b).attr("aria-hidden", "false").jqmShow(); else {
          if (c.gbox !== "") {
            a(".jqgrid-overlay:first", c.gbox).show();
            a(b).data("gbox", c.gbox)
          }
          a(b).show().attr("aria-hidden", "false");
          try {
            a(":input:visible", b)[0].focus()
          } catch (d) {
          }
        }
      }, info_dialog:function (b, c, d, f) {
        var g = {width:290, height:"auto", dataheight:"auto", drag:true, resize:false, caption:"<b>" + b + "</b>", left:250, top:170, zIndex:1E3, jqModal:true, modal:false, closeOnEscape:true, align:"center",
          buttonalign:"center", buttons:[]};
        a.extend(g, f || {});
        var h = g.jqModal, j = this;
        if (a.fn.jqm && !h)h = false;
        b = "";
        if (g.buttons.length > 0)for (f = 0; f < g.buttons.length; f++) {
          if (typeof g.buttons[f].id == "undefined")g.buttons[f].id = "info_button_" + f;
          b += "<a href='javascript:void(0)' id='" + g.buttons[f].id + "' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[f].text + "</a>"
        }
        f = isNaN(g.dataheight) ? g.dataheight : g.dataheight + "px";
        var e = "<div id='info_id'>";
        e += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" +
          f + ";" + ("text-align:" + g.align + ";") + "'>" + c + "</div>";
        e += d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + d + "</a>" + b + "</div>" : b !== "" ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" +
          b + "</div>" : "";
        e += "</div>";
        try {
          a("#info_dialog").attr("aria-hidden") == "false" && this.hideModal("#info_dialog", {jqm:h});
          a("#info_dialog").remove()
        } catch (k) {
        }
        this.createModal({themodal:"info_dialog", modalhead:"info_head", modalcontent:"info_content", scrollelm:"infocnt"}, e, g, "", "", true);
        b && a.each(g.buttons, function (i) {
          a("#" + this.id, "#info_id").bind("click", function () {
            g.buttons[i].onClick.call(a("#info_dialog"));
            return false
          })
        });
        a("#closedialog", "#info_id").click(function () {
          j.hideModal("#info_dialog", {jqm:h});
          return false
        });
        a(".fm-button", "#info_dialog").hover(function () {
          a(this).addClass("ui-state-hover")
        }, function () {
          a(this).removeClass("ui-state-hover")
        });
        a.isFunction(g.beforeOpen) && g.beforeOpen();
        this.viewModal("#info_dialog", {onHide:function (i) {
          i.w.hide().remove();
          i.o && i.o.remove()
        }, modal:g.modal, jqm:h});
        a.isFunction(g.afterOpen) && g.afterOpen();
        try {
          a("#info_dialog").focus()
        } catch (m) {
        }
      }, createEl:function (b, c, d, f, g) {
        function h(l, n) {
          a.isFunction(n.dataInit) && n.dataInit(l);
          n.dataEvents && a.each(n.dataEvents,
            function () {
              this.data !== undefined ? a(l).bind(this.type, this.data, this.fn) : a(l).bind(this.type, this.fn)
            });
          return n
        }

        function j(l, n) {
          var r = ["dataInit", "dataEvents", "dataUrl", "buildSelect", "sopt", "searchhidden", "defaultValue", "attr"];
          a.each(n, function (p, o) {
            a.inArray(p, r) === -1 && a(l).attr(p, o)
          });
          n.hasOwnProperty("id") || a(l).attr("id", a.jgrid.randId())
        }

        var e = "";
        switch (b) {
          case "textarea":
            e = document.createElement("textarea");
            if (f)c.cols || a(e).css({width:"98%"}); else if (!c.cols)c.cols = 20;
            if (!c.rows)c.rows = 2;
            if (d == "&nbsp;" || d == "&#160;" || d.length == 1 && d.charCodeAt(0) == 160)d = "";
            e.value = d;
            j(e, c);
            c = h(e, c);
            a(e).attr({role:"textbox", multiline:"true"});
            break;
          case "checkbox":
            e = document.createElement("input");
            e.type = "checkbox";
            if (c.value) {
              b = c.value.split(":");
              if (d === b[0]) {
                e.checked = true;
                e.defaultChecked = true
              }
              e.value = b[0];
              a(e).attr("offval", b[1])
            } else {
              b = d.toLowerCase();
              if (b.search(/(false|0|no|off|undefined)/i) < 0 && b !== "") {
                e.checked = true;
                e.defaultChecked = true;
                e.value = d
              } else e.value = "on";
              a(e).attr("offval", "off")
            }
            j(e,
              c);
            c = h(e, c);
            a(e).attr("role", "checkbox");
            break;
          case "select":
            e = document.createElement("select");
            e.setAttribute("role", "select");
            f = [];
            if (c.multiple === true) {
              b = true;
              e.multiple = "multiple";
              a(e).attr("aria-multiselectable", "true")
            } else b = false;
            if (typeof c.dataUrl != "undefined")a.ajax(a.extend({url:c.dataUrl, type:"GET", dataType:"html", context:{elem:e, options:c, vl:d}, success:function (l) {
              var n = [], r = this.elem, p = this.vl, o = a.extend({}, this.options), s = o.multiple === true;
              if (typeof o.buildSelect != "undefined")l = o.buildSelect(l);
              if (l = a(l).html()) {
                a(r).append(l);
                j(r, o);
                o = h(r, o);
                if (typeof o.size === "undefined")o.size = s ? 3 : 1;
                if (s) {
                  n = p.split(",");
                  n = a.map(n, function (t) {
                    return a.trim(t)
                  })
                } else n[0] = a.trim(p);
                setTimeout(function () {
                  a("option", r).each(function () {
                    a(this).attr("role", "option");
                    if (a.inArray(a.trim(a(this).text()), n) > -1 || a.inArray(a.trim(a(this).val()), n) > -1)this.selected = "selected"
                  })
                }, 0)
              }
            }}, g || {})); else if (c.value) {
              var k;
              if (b) {
                f = d.split(",");
                f = a.map(f, function (l) {
                  return a.trim(l)
                });
                if (typeof c.size === "undefined")c.size =
                  3
              } else c.size = 1;
              if (typeof c.value === "function")c.value = c.value();
              var m, i;
              if (typeof c.value === "string") {
                m = c.value.split(";");
                for (k = 0; k < m.length; k++) {
                  i = m[k].split(":");
                  if (i.length > 2)i[1] = a.map(i,function (l, n) {
                    if (n > 0)return l
                  }).join(":");
                  g = document.createElement("option");
                  g.setAttribute("role", "option");
                  g.value = i[0];
                  g.innerHTML = i[1];
                  if (!b && (a.trim(i[0]) == a.trim(d) || a.trim(i[1]) == a.trim(d)))g.selected = "selected";
                  if (b && (a.inArray(a.trim(i[1]), f) > -1 || a.inArray(a.trim(i[0]), f) > -1))g.selected = "selected";
                  e.appendChild(g)
                }
              } else if (typeof c.value === "object") {
                m = c.value;
                for (k in m)if (m.hasOwnProperty(k)) {
                  g = document.createElement("option");
                  g.setAttribute("role", "option");
                  g.value = k;
                  g.innerHTML = m[k];
                  if (!b && (a.trim(k) == a.trim(d) || a.trim(m[k]) == a.trim(d)))g.selected = "selected";
                  if (b && (a.inArray(a.trim(m[k]), f) > -1 || a.inArray(a.trim(k), f) > -1))g.selected = "selected";
                  e.appendChild(g)
                }
              }
              j(e, c);
              c = h(e, c)
            }
            break;
          case "text":
          case "password":
          case "button":
            k = b == "button" ? "button" : "textbox";
            e = document.createElement("input");
            e.type = b;
            e.value = d;
            j(e, c);
            c = h(e, c);
            if (b != "button")if (f)c.size || a(e).css({width:"98%"}); else if (!c.size)c.size = 20;
            a(e).attr("role", k);
            break;
          case "image":
          case "file":
            e = document.createElement("input");
            e.type = b;
            j(e, c);
            c = h(e, c);
            break;
          case "custom":
            e = document.createElement("span");
            try {
              if (a.isFunction(c.custom_element))if (m = c.custom_element.call(this, d, c)) {
                m = a(m).addClass("customelement").attr({id:c.id, name:c.name});
                a(e).empty().append(m)
              } else throw"e2"; else throw"e1";
            } catch (q) {
              q == "e1" && this.info_dialog(a.jgrid.errors.errcap,
                "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose);
              q == "e2" ? this.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : this.info_dialog(a.jgrid.errors.errcap, typeof q === "string" ? q : q.message, a.jgrid.edit.bClose)
            }
        }
        return e
      }, checkDate:function (b, c) {
        var d = {}, f;
        b = b.toLowerCase();
        f = b.indexOf("/") != -1 ? "/" : b.indexOf("-") != -1 ? "-" : b.indexOf(".") != -1 ? "." : "/";
        b = b.split(f);
        c = c.split(f);
        if (c.length != 3)return false;
        f = -1;
        for (var g, h =
          -1, j = -1, e = 0; e < b.length; e++) {
          g = isNaN(c[e]) ? 0 : parseInt(c[e], 10);
          d[b[e]] = g;
          g = b[e];
          if (g.indexOf("y") != -1)f = e;
          if (g.indexOf("m") != -1)j = e;
          if (g.indexOf("d") != -1)h = e
        }
        g = b[f] == "y" || b[f] == "yyyy" ? 4 : b[f] == "yy" ? 2 : -1;
        e = function (m) {
          for (var i = 1; i <= m; i++) {
            this[i] = 31;
            if (i == 4 || i == 6 || i == 9 || i == 11)this[i] = 30;
            if (i == 2)this[i] = 29
          }
          return this
        }(12);
        var k;
        if (f === -1)return false; else {
          k = d[b[f]].toString();
          if (g == 2 && k.length == 1)g = 1;
          if (k.length != g || d[b[f]] === 0 && c[f] != "00")return false
        }
        if (j === -1)return false; else {
          k = d[b[j]].toString();
          if (k.length < 1 || d[b[j]] < 1 || d[b[j]] > 12)return false
        }
        if (h === -1)return false; else {
          k = d[b[h]].toString();
          if (k.length < 1 || d[b[h]] < 1 || d[b[h]] > 31 || d[b[j]] == 2 && d[b[h]] > (d[b[f]] % 4 === 0 && (d[b[f]] % 100 !== 0 || d[b[f]] % 400 === 0) ? 29 : 28) || d[b[h]] > e[d[b[j]]])return false
        }
        return true
      }, isEmpty:function (b) {
        return b.match(/^\s+$/) || b === "" ? true : false
      }, checkTime:function (b) {
        var c = /^(\d{1,2}):(\d{2})([ap]m)?$/;
        if (!this.isEmpty(b))if (b = b.match(c)) {
          if (b[3]) {
            if (b[1] < 1 || b[1] > 12)return false
          } else if (b[1] > 23)return false;
          if (b[2] > 59)return false
        } else return false;
        return true
      }, checkValues:function (b, c, d, f, g) {
        var h, j;
        if (typeof f === "undefined")if (typeof c == "string") {
          f = 0;
          for (g = d.p.colModel.length; f < g; f++)if (d.p.colModel[f].name == c) {
            h = d.p.colModel[f].editrules;
            c = f;
            try {
              j = d.p.colModel[f].formoptions.label
            } catch (e) {
            }
            break
          }
        } else {
          if (c >= 0)h = d.p.colModel[c].editrules
        } else {
          h = f;
          j = g === undefined ? "_" : g
        }
        if (h) {
          j || (j = d.p.colNames[c]);
          if (h.required === true)if (this.isEmpty(b))return[false, j + ": " + a.jgrid.edit.msg.required, ""];
          f = h.required === false ? false : true;
          if (h.number === true)if (!(f ===
            false && this.isEmpty(b)))if (isNaN(b))return[false, j + ": " + a.jgrid.edit.msg.number, ""];
          if (typeof h.minValue != "undefined" && !isNaN(h.minValue))if (parseFloat(b) < parseFloat(h.minValue))return[false, j + ": " + a.jgrid.edit.msg.minValue + " " + h.minValue, ""];
          if (typeof h.maxValue != "undefined" && !isNaN(h.maxValue))if (parseFloat(b) > parseFloat(h.maxValue))return[false, j + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""];
          if (h.email === true)if (!(f === false && this.isEmpty(b))) {
            g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
            if (!g.test(b))return[false, j + ": " + a.jgrid.edit.msg.email, ""]
          }
          if (h.integer === true)if (!(f === false && this.isEmpty(b))) {
            if (isNaN(b))return[false, j + ": " + a.jgrid.edit.msg.integer, ""];
            if (b % 1 !== 0 || b.indexOf(".") != -1)return[false, j + ": " + a.jgrid.edit.msg.integer, ""]
          }
          if (h.date === true)if (!(f === false && this.isEmpty(b))) {
            c = d.p.colModel[c].formatoptions && d.p.colModel[c].formatoptions.newformat ? d.p.colModel[c].formatoptions.newformat : d.p.colModel[c].datefmt || "Y-m-d";
            if (!this.checkDate(c, b))return[false, j + ": " + a.jgrid.edit.msg.date +
              " - " + c, ""]
          }
          if (h.time === true)if (!(f === false && this.isEmpty(b)))if (!this.checkTime(b))return[false, j + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
          if (h.url === true)if (!(f === false && this.isEmpty(b))) {
            g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
            if (!g.test(b))return[false, j + ": " + a.jgrid.edit.msg.url, ""]
          }
          if (h.custom === true)if (!(f === false && this.isEmpty(b)))if (a.isFunction(h.custom_func)) {
            b = h.custom_func.call(d, b, j);
            return a.isArray(b) ?
              b : [false, a.jgrid.edit.msg.customarray, ""]
          } else return[false, a.jgrid.edit.msg.customfcheck, ""]
        }
        return[true, "", ""]
      }})
    })(jQuery);
    (function (a) {
      var c = null;
      a.jgrid.extend({searchGrid:function (d) {
        d = a.extend({recreateFilter:false, drag:true, sField:"searchField", sValue:"searchString", sOper:"searchOper", sFilter:"filters", loadDefaults:true, beforeShowSearch:null, afterShowSearch:null, onInitializeSearch:null, closeAfterSearch:false, closeAfterReset:false, closeOnEscape:false, multipleSearch:false, multipleGroup:false, top:0, left:0, jqModal:true, modal:false, resize:false, width:450, height:"auto", dataheight:"auto", showQuery:false, errorcheck:true,
          sopt:null, stringResult:undefined, onClose:null, onSearch:null, onReset:null, toTop:true, overlay:10, columns:[], tmplNames:null, tmplFilters:null, tmplLabel:" Template: ", showOnLoad:false, layer:null}, a.jgrid.search, d || {});
        return this.each(function () {
          function b() {
            if (a.isFunction(d.beforeShowSearch)) {
              C = d.beforeShowSearch(a("#" + q));
              if (typeof C === "undefined")C = true
            }
            if (C) {
              a.jgrid.viewModal("#" + z.themodal, {gbox:"#gbox_" + q, jqm:d.jqModal, modal:d.modal, overlay:d.overlay, toTop:d.toTop});
              a.isFunction(d.afterShowSearch) &&
              d.afterShowSearch(a("#" + q))
            }
          }

          var l = this;
          if (l.grid) {
            var q = "fbox_" + l.p.id, C = true, z = {themodal:"searchmod" + q, modalhead:"searchhd" + q, modalcontent:"searchcnt" + q, scrollelm:q}, D = l.p.postData[d.sFilter];
            if (typeof D === "string")D = a.jgrid.parse(D);
            d.recreateFilter === true && a("#" + z.themodal).remove();
            if (a("#" + z.themodal).html() !== null)b(); else {
              var w = a("<span><div id='" + q + "' class='searchFilter' style='overflow:auto'></div></span>").insertBefore("#gview_" + l.p.id);
              if (a.isFunction(d.onInitializeSearch))d.onInitializeSearch(a("#" +
                q));
              var n = a.extend([], l.p.colModel), s = "<a href='javascript:void(0)' id='" + q + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + d.Find + "</a>", t = "<a href='javascript:void(0)' id='" + q + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + d.Reset + "</a>", p = "", e = "", u, o = false;
              if (d.showQuery)p = "<a href='javascript:void(0)' id='" +
                q + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>";
              if (d.columns.length)n = d.columns; else a.each(n, function (f, j) {
                if (!j.label)j.label = l.p.colNames[f];
                if (!o) {
                  var G = typeof j.search === "undefined" ? true : j.search, L = j.hidden === true;
                  if (j.searchoptions && j.searchoptions.searchhidden === true && G || G && !L) {
                    o = true;
                    u = j.index || j.name
                  }
                }
              });
              if (!D && u || d.multipleSearch === false)D = {groupOp:"AND", rules:[
                {field:u, op:"eq", data:""}
              ]};
              o = false;
              if (d.tmplNames &&
                d.tmplNames.length) {
                o = true;
                e = d.tmplLabel;
                e += "<select class='ui-template'>";
                e += "<option value='default'>Default</option>";
                a.each(d.tmplNames, function (f, j) {
                  e += "<option value='" + f + "'>" + j + "</option>"
                });
                e += "</select>"
              }
              s = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + q + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:left'>" + t + e + "</td><td class='EditButton'>" + p + s + "</td></tr></tbody></table>";
              a("#" + q).jqFilter({columns:n, filter:d.loadDefaults ? D : null, showQuery:d.showQuery, errorcheck:d.errorcheck, sopt:d.sopt, groupButton:d.multipleGroup, _gridsopt:a.jgrid.search.odata, onChange:function () {
                this.p.showQuery && a(".query", this).html(this.toUserFriendlyString())
              }});
              w.append(s);
              o && d.tmplFilters && d.tmplFilters.length && a(".ui-template", w).bind("change", function () {
                var f = a(this).val();
                f == "default" ? a("#" + q).jqFilter("addFilter", D) : a("#" + q).jqFilter("addFilter", d.tmplFilters[parseInt(f, 10)]);
                return false
              });
              if (d.multipleSearch === false) {
                a(".add-rule", "#" + q).hide();
                a(".delete-rule", "#" + q).hide()
              }
              if (a.isFunction(d.onInitializeSearch))d.onInitializeSearch(a("#" + q));
              d.layer ? a.jgrid.createModal(z, w, d, "#gview_" + l.p.id, a("#gbox_" + l.p.id)[0], "#" + d.layer, {position:"relative"}) : a.jgrid.createModal(z, w, d, "#gview_" + l.p.id, a("#gbox_" + l.p.id)[0]);
              p && a("#" + q + "_query").bind("click", function () {
                a(".queryresult", w).toggle();
                return false
              });
              if (d.stringResult === undefined)d.stringResult = d.multipleSearch;
              a("#" + q + "_search").bind("click",
                function () {
                  var f = a("#" + q), j = {}, G, L = f.jqFilter("filterData");
                  if (d.errorcheck) {
                    f[0].hideError();
                    d.showQuery || f.jqFilter("toSQLString");
                    if (f[0].p.error) {
                      f[0].showError();
                      return false
                    }
                  }
                  if (d.stringResult) {
                    try {
                      G = xmlJsonClass.toJson(L, "", "", false)
                    } catch (I) {
                      try {
                        G = JSON.stringify(L)
                      } catch (T) {
                      }
                    }
                    if (typeof G === "string") {
                      j[d.sFilter] = G;
                      a.each([d.sField, d.sValue, d.sOper], function () {
                        j[this] = ""
                      })
                    }
                  } else if (d.multipleSearch) {
                    j[d.sFilter] = L;
                    a.each([d.sField, d.sValue, d.sOper], function () {
                      j[this] = ""
                    })
                  } else {
                    j[d.sField] =
                      L.rules[0].field;
                    j[d.sValue] = L.rules[0].data;
                    j[d.sOper] = L.rules[0].op;
                    j[d.sFilter] = ""
                  }
                  l.p.search = true;
                  a.extend(l.p.postData, j);
                  if (a.isFunction(d.onSearch))d.onSearch();
                  a(l).trigger("reloadGrid", [
                    {page:1}
                  ]);
                  d.closeAfterSearch && a.jgrid.hideModal("#" + z.themodal, {gb:"#gbox_" + l.p.id, jqm:d.jqModal, onClose:d.onClose});
                  return false
                });
              a("#" + q + "_reset").bind("click", function () {
                var f = {}, j = a("#" + q);
                l.p.search = false;
                if (d.multipleSearch === false)f[d.sField] = f[d.sValue] = f[d.sOper] = ""; else f[d.sFilter] = "";
                j[0].resetFilter();
                o && a(".ui-template", w).val("default");
                a.extend(l.p.postData, f);
                if (a.isFunction(d.onReset))d.onReset();
                a(l).trigger("reloadGrid", [
                  {page:1}
                ]);
                return false
              });
              b();
              a(".fm-button:not(.ui-state-disabled)", w).hover(function () {
                a(this).addClass("ui-state-hover")
              }, function () {
                a(this).removeClass("ui-state-hover")
              })
            }
          }
        })
      }, editGridRow:function (d, b) {
        c = b = a.extend({top:0, left:0, width:300, height:"auto", dataheight:"auto", modal:false, overlay:10, drag:true, resize:true, url:null, mtype:"POST", clearAfterAdd:true, closeAfterEdit:false,
          reloadAfterSubmit:true, onInitializeForm:null, beforeInitData:null, beforeShowForm:null, afterShowForm:null, beforeSubmit:null, afterSubmit:null, onclickSubmit:null, afterComplete:null, onclickPgButtons:null, afterclickPgButtons:null, editData:{}, recreateForm:false, jqModal:true, closeOnEscape:false, addedrow:"first", topinfo:"", bottominfo:"", saveicon:[], closeicon:[], savekey:[false, 13], navkeys:[false, 38, 40], checkOnSubmit:false, checkOnUpdate:false, _savedData:{}, processing:false, onClose:null, ajaxEditOptions:{}, serializeEditData:null,
          viewPagerButtons:true}, a.jgrid.edit, b || {});
        return this.each(function () {
          function l() {
            a(".FormElement", "#" + f).each(function () {
              var g = a(".customelement", this);
              if (g.length) {
                var k = a(g[0]).attr("name");
                a.each(e.p.colModel, function () {
                  if (this.name === k && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                    try {
                      h[k] = this.editoptions.custom_value(a("#" + a.jgrid.jqID(k), "#" + f), "get");
                      if (h[k] === undefined)throw"e1";
                    } catch (r) {
                      r === "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " +
                        a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, r.message, jQuery.jgrid.edit.bClose)
                    }
                    return true
                  }
                })
              } else {
                switch (a(this).get(0).type) {
                  case "checkbox":
                    if (a(this).attr("checked"))h[this.name] = a(this).val(); else {
                      g = a(this).attr("offval");
                      h[this.name] = g
                    }
                    break;
                  case "select-one":
                    h[this.name] = a("option:selected", this).val();
                    P[this.name] = a("option:selected", this).text();
                    break;
                  case "select-multiple":
                    h[this.name] = a(this).val();
                    h[this.name] = h[this.name] ? h[this.name].join(",") :
                      "";
                    var v = [];
                    a("option:selected", this).each(function (r, E) {
                      v[r] = a(E).text()
                    });
                    P[this.name] = v.join(",");
                    break;
                  case "password":
                  case "text":
                  case "textarea":
                  case "button":
                    h[this.name] = a(this).val()
                }
                if (e.p.autoencode)h[this.name] = a.jgrid.htmlEncode(h[this.name])
              }
            });
            return true
          }

          function q(g, k, v, r) {
            var E, A, y, K = 0, B, N, F, S = [], M = false, aa = "", R;
            for (R = 1; R <= r; R++)aa += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
            if (g != "_empty")M = a(k).jqGrid("getInd", g);
            a(k.p.colModel).each(function (U) {
              E = this.name;
              N = (A = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false) ? "style='display:none'" : "";
              if (E !== "cb" && E !== "subgrid" && this.editable === true && E !== "rn") {
                if (M === false)B = ""; else if (E == k.p.ExpandColumn && k.p.treeGrid === true)B = a("td:eq(" + U + ")", k.rows[M]).text(); else try {
                  B = a.unformat(a("td:eq(" + U + ")", k.rows[M]), {rowId:g, colModel:this}, U)
                } catch (fa) {
                  B = a("td:eq(" + U + ")", k.rows[M]).text()
                }
                var Y = a.extend({}, this.editoptions || {}, {id:E, name:E}), Z = a.extend({}, {elmprefix:"", elmsuffix:"", rowabove:false,
                  rowcontent:""}, this.formoptions || {}), ea = parseInt(Z.rowpos, 10) || K + 1, ga = parseInt((parseInt(Z.colpos, 10) || 1) * 2, 10);
                if (g == "_empty" && Y.defaultValue)B = a.isFunction(Y.defaultValue) ? Y.defaultValue() : Y.defaultValue;
                if (!this.edittype)this.edittype = "text";
                if (e.p.autoencode)B = a.jgrid.htmlDecode(B);
                F = a.jgrid.createEl(this.edittype, Y, B, false, a.extend({}, a.jgrid.ajaxOptions, k.p.ajaxSelectOptions || {}));
                if (B === "" && this.edittype == "checkbox")B = a(F).attr("offval");
                if (B === "" && this.edittype == "select")B = a("option:eq(0)",
                  F).text();
                if (c.checkOnSubmit || c.checkOnUpdate)c._savedData[E] = B;
                a(F).addClass("FormElement");
                if (this.edittype == "text" || this.edittype == "textarea")a(F).addClass("ui-widget-content ui-corner-all");
                y = a(v).find("tr[rowpos=" + ea + "]");
                if (Z.rowabove) {
                  Y = a("<tr><td class='contentinfo' colspan='" + r * 2 + "'>" + Z.rowcontent + "</td></tr>");
                  a(v).append(Y);
                  Y[0].rp = ea
                }
                if (y.length === 0) {
                  y = a("<tr " + N + " rowpos='" + ea + "'></tr>").addClass("FormData").attr("id", "tr_" + E);
                  a(y).append(aa);
                  a(v).append(y);
                  y[0].rp = ea
                }
                a("td:eq(" + (ga -
                  2) + ")", y[0]).html(typeof Z.label === "undefined" ? k.p.colNames[U] : Z.label);
                a("td:eq(" + (ga - 1) + ")", y[0]).append(Z.elmprefix).append(F).append(Z.elmsuffix);
                S[K] = U;
                K++
              }
            });
            if (K > 0) {
              R = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (r * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + k.p.id + "_id' value='" + g + "'/></td></tr>");
              R[0].rp = K + 999;
              a(v).append(R);
              if (c.checkOnSubmit || c.checkOnUpdate)c._savedData[k.p.id + "_id"] = g
            }
            return S
          }

          function C(g, k, v) {
            var r, E = 0, A, y, K, B, N;
            if (c.checkOnSubmit || c.checkOnUpdate) {
              c._savedData = {};
              c._savedData[k.p.id + "_id"] = g
            }
            var F = k.p.colModel;
            if (g == "_empty") {
              a(F).each(function () {
                r = this.name;
                K = a.extend({}, this.editoptions || {});
                if ((y = a("#" + a.jgrid.jqID(r), "#" + v)) && y[0] !== null) {
                  B = "";
                  if (K.defaultValue) {
                    B = a.isFunction(K.defaultValue) ? K.defaultValue() : K.defaultValue;
                    if (y[0].type == "checkbox") {
                      N = B.toLowerCase();
                      if (N.search(/(false|0|no|off|undefined)/i) < 0 && N !== "") {
                        y[0].checked = true;
                        y[0].defaultChecked = true;
                        y[0].value = B
                      } else y.attr({checked:"",
                        defaultChecked:""})
                    } else y.val(B)
                  } else if (y[0].type == "checkbox") {
                    y[0].checked = false;
                    y[0].defaultChecked = false;
                    B = a(y).attr("offval")
                  } else if (y[0].type && y[0].type.substr(0, 6) == "select")y[0].selectedIndex = 0; else y.val(B);
                  if (c.checkOnSubmit === true || c.checkOnUpdate)c._savedData[r] = B
                }
              });
              a("#id_g", "#" + v).val(g)
            } else {
              var S = a(k).jqGrid("getInd", g, true);
              if (S) {
                a("td", S).each(function (M) {
                  r = F[M].name;
                  if (r !== "cb" && r !== "subgrid" && r !== "rn" && F[M].editable === true) {
                    if (r == k.p.ExpandColumn && k.p.treeGrid === true)A = a(this).text();
                    else try {
                      A = a.unformat(a(this), {rowId:g, colModel:F[M]}, M)
                    } catch (aa) {
                      A = a(this).text()
                    }
                    if (e.p.autoencode)A = a.jgrid.htmlDecode(A);
                    if (c.checkOnSubmit === true || c.checkOnUpdate)c._savedData[r] = A;
                    r = a.jgrid.jqID(r);
                    switch (F[M].edittype) {
                      case "password":
                      case "text":
                      case "button":
                      case "image":
                        a("#" + r, "#" + v).val(A);
                        break;
                      case "textarea":
                        if (A == "&nbsp;" || A == "&#160;" || A.length == 1 && A.charCodeAt(0) == 160)A = "";
                        a("#" + r, "#" + v).val(A);
                        break;
                      case "select":
                        var R = A.split(",");
                        R = a.map(R, function (fa) {
                          return a.trim(fa)
                        });
                        a("#" +
                          r + " option", "#" + v).each(function () {
                            this.selected = !F[M].editoptions.multiple && (R[0] == a.trim(a(this).text()) || R[0] == a.trim(a(this).val())) ? true : F[M].editoptions.multiple ? a.inArray(a.trim(a(this).text()), R) > -1 || a.inArray(a.trim(a(this).val()), R) > -1 ? true : false : false
                          });
                        break;
                      case "checkbox":
                        A += "";
                        if (F[M].editoptions && F[M].editoptions.value)if (F[M].editoptions.value.split(":")[0] == A) {
                          a("#" + r, "#" + v).attr("checked", true);
                          a("#" + r, "#" + v).attr("defaultChecked", true)
                        } else {
                          a("#" + r, "#" + v).attr("checked", false);
                          a("#" + r, "#" + v).attr("defaultChecked", "")
                        } else {
                          A = A.toLowerCase();
                          if (A.search(/(false|0|no|off|undefined)/i) < 0 && A !== "") {
                            a("#" + r, "#" + v).attr("checked", true);
                            a("#" + r, "#" + v).attr("defaultChecked", true)
                          } else {
                            a("#" + r, "#" + v).attr("checked", false);
                            a("#" + r, "#" + v).attr("defaultChecked", "")
                          }
                        }
                        break;
                      case "custom":
                        try {
                          if (F[M].editoptions && a.isFunction(F[M].editoptions.custom_value))F[M].editoptions.custom_value(a("#" + r, "#" + v), "set", A); else throw"e1";
                        } catch (U) {
                          U == "e1" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap,
                            "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, U.message, jQuery.jgrid.edit.bClose)
                        }
                    }
                    E++
                  }
                });
                E > 0 && a("#id_g", "#" + f).val(g)
              }
            }
          }

          function z() {
            var g, k = [true, "", ""], v = {}, r = e.p.prmNames, E, A, y, K;
            if (a.isFunction(c.beforeCheckValues)) {
              var B = c.beforeCheckValues(h, a("#" + o), h[e.p.id + "_id"] == "_empty" ? r.addoper : r.editoper);
              if (B && typeof B === "object")h = B
            }
            for (y in h)if (h.hasOwnProperty(y)) {
              k = a.jgrid.checkValues(h[y], y, e);
              if (k[0] === false)break
            }
            if (k[0]) {
              if (a.isFunction(c.onclickSubmit))v =
                c.onclickSubmit(c, h) || {};
              if (a.isFunction(c.beforeSubmit))k = c.beforeSubmit(h, a("#" + o))
            }
            if (k[0] && !c.processing) {
              c.processing = true;
              a("#sData", "#" + f + "_2").addClass("ui-state-active");
              A = r.oper;
              E = r.id;
              h[A] = a.trim(h[e.p.id + "_id"]) == "_empty" ? r.addoper : r.editoper;
              if (h[A] != r.addoper)h[E] = h[e.p.id + "_id"]; else if (h[E] === undefined)h[E] = h[e.p.id + "_id"];
              delete h[e.p.id + "_id"];
              h = a.extend(h, c.editData, v);
              if (e.p.treeGrid === true) {
                if (h[A] == r.addoper) {
                  K = a(e).jqGrid("getGridParam", "selrow");
                  h[e.p.treeGridModel == "adjacency" ?
                    e.p.treeReader.parent_id_field : "parent_id"] = K
                }
                for (i in e.p.treeReader) {
                  v = e.p.treeReader[i];
                  if (h.hasOwnProperty(v))h[A] == r.addoper && i === "parent_id_field" || delete h[v]
                }
              }
              v = a.extend({url:c.url ? c.url : a(e).jqGrid("getGridParam", "editurl"), type:c.mtype, data:a.isFunction(c.serializeEditData) ? c.serializeEditData(h) : h, complete:function (N, F) {
                if (F != "success") {
                  k[0] = false;
                  k[1] = a.isFunction(c.errorTextFormat) ? c.errorTextFormat(N) : F + " Status: '" + N.statusText + "'. Error code: " + N.status
                } else if (a.isFunction(c.afterSubmit))k =
                  c.afterSubmit(N, h);
                if (k[0] === false) {
                  a("#FormError>td", "#" + f).html(k[1]);
                  a("#FormError", "#" + f).show()
                } else {
                  a.each(e.p.colModel, function () {
                    if (P[this.name] && this.formatter && this.formatter == "select")try {
                      delete P[this.name]
                    } catch (aa) {
                    }
                  });
                  h = a.extend(h, P);
                  e.p.autoencode && a.each(h, function (aa, R) {
                    h[aa] = a.jgrid.htmlDecode(R)
                  });
                  c.reloadAfterSubmit = c.reloadAfterSubmit && e.p.datatype != "local";
                  if (h[A] == r.addoper) {
                    k[2] || (k[2] = a.jgrid.randId());
                    h[E] = k[2];
                    if (c.closeAfterAdd) {
                      if (c.reloadAfterSubmit)a(e).trigger("reloadGrid");
                      else if (e.p.treeGrid === true)a(e).jqGrid("addChildNode", k[2], K, h); else {
                        a(e).jqGrid("addRowData", k[2], h, b.addedrow);
                        a(e).jqGrid("setSelection", k[2])
                      }
                      a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose})
                    } else if (c.clearAfterAdd) {
                      if (c.reloadAfterSubmit)a(e).trigger("reloadGrid"); else e.p.treeGrid === true ? a(e).jqGrid("addChildNode", k[2], K, h) : a(e).jqGrid("addRowData", k[2], h, b.addedrow);
                      C("_empty", e, o)
                    } else if (c.reloadAfterSubmit)a(e).trigger("reloadGrid"); else e.p.treeGrid ===
                      true ? a(e).jqGrid("addChildNode", k[2], K, h) : a(e).jqGrid("addRowData", k[2], h, b.addedrow)
                  } else {
                    if (c.reloadAfterSubmit) {
                      a(e).trigger("reloadGrid");
                      c.closeAfterEdit || setTimeout(function () {
                        a(e).jqGrid("setSelection", h[E])
                      }, 1E3)
                    } else e.p.treeGrid === true ? a(e).jqGrid("setTreeRow", h[E], h) : a(e).jqGrid("setRowData", h[E], h);
                    c.closeAfterEdit && a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose})
                  }
                  if (a.isFunction(c.afterComplete)) {
                    g = N;
                    setTimeout(function () {
                      c.afterComplete(g, h, a("#" + o));
                      g = null
                    }, 500)
                  }
                  if (c.checkOnSubmit || c.checkOnUpdate) {
                    a("#" + o).data("disabled", false);
                    if (c._savedData[e.p.id + "_id"] != "_empty")for (var S in c._savedData)if (h[S])c._savedData[S] = h[S]
                  }
                }
                c.processing = false;
                a("#sData", "#" + f + "_2").removeClass("ui-state-active");
                try {
                  a(":input:visible", "#" + o)[0].focus()
                } catch (M) {
                }
              }}, a.jgrid.ajaxOptions, c.ajaxEditOptions);
              if (!v.url && !c.useDataProxy)if (a.isFunction(e.p.dataProxy))c.useDataProxy = true; else {
                k[0] = false;
                k[1] += " " + a.jgrid.errors.nourl
              }
              if (k[0])c.useDataProxy ? e.p.dataProxy.call(e,
                v, "set_" + e.p.id) : a.ajax(v)
            }
            if (k[0] === false) {
              a("#FormError>td", "#" + f).html(k[1]);
              a("#FormError", "#" + f).show()
            }
          }

          function D(g, k) {
            var v = false, r;
            for (r in g)if (g[r] != k[r]) {
              v = true;
              break
            }
            return v
          }

          function w() {
            a.each(e.p.colModel, function (g, k) {
              if (k.editoptions && k.editoptions.NullIfEmpty === true)if (h.hasOwnProperty(k.name) && h[k.name] == "")h[k.name] = "null"
            })
          }

          function n() {
            var g = true;
            a("#FormError", "#" + f).hide();
            if (c.checkOnUpdate) {
              h = {};
              P = {};
              l();
              O = a.extend({}, h, P);
              if (V = D(O, c._savedData)) {
                a("#" + o).data("disabled",
                  true);
                a(".confirm", "#" + j.themodal).show();
                g = false
              } else w()
            }
            return g
          }

          function s() {
            if (d !== "_empty" && typeof e.p.savedRow !== "undefined" && e.p.savedRow.length > 0 && a.isFunction(a.fn.jqGrid.restoreRow))for (var g = 0; g < e.p.savedRow.length; g++)if (e.p.savedRow[g].id == d) {
              a(e).jqGrid("restoreRow", d);
              break
            }
          }

          function t(g, k) {
            g === 0 ? a("#pData", "#" + f + "_2").addClass("ui-state-disabled") : a("#pData", "#" + f + "_2").removeClass("ui-state-disabled");
            g == k ? a("#nData", "#" + f + "_2").addClass("ui-state-disabled") : a("#nData", "#" + f + "_2").removeClass("ui-state-disabled")
          }

          function p() {
            var g = a(e).jqGrid("getDataIDs"), k = a("#id_g", "#" + f).val();
            return[a.inArray(k, g), g]
          }

          var e = this;
          if (e.grid && d) {
            var u = e.p.id, o = "FrmGrid_" + u, f = "TblGrid_" + u, j = {themodal:"editmod" + u, modalhead:"edithd" + u, modalcontent:"editcnt" + u, scrollelm:o}, G = a.isFunction(c.beforeShowForm) ? c.beforeShowForm : false, L = a.isFunction(c.afterShowForm) ? c.afterShowForm : false, I = a.isFunction(c.beforeInitData) ? c.beforeInitData : false, T = a.isFunction(c.onInitializeForm) ? c.onInitializeForm : false, H = true, m = 1, x = 0, h, P, O, V;
            if (d ===
              "new") {
              d = "_empty";
              b.caption = c.addCaption
            } else b.caption = c.editCaption;
            b.recreateForm === true && a("#" + j.themodal).html() !== null && a("#" + j.themodal).remove();
            var Q = true;
            if (b.checkOnUpdate && b.jqModal && !b.modal)Q = false;
            if (a("#" + j.themodal).html() !== null) {
              if (I) {
                H = I(a("#" + o));
                if (typeof H == "undefined")H = true
              }
              if (H === false)return;
              s();
              a(".ui-jqdialog-title", "#" + j.modalhead).html(b.caption);
              a("#FormError", "#" + f).hide();
              if (c.topinfo) {
                a(".topinfo", "#" + f + "_2").html(c.topinfo);
                a(".tinfo", "#" + f + "_2").show()
              } else a(".tinfo",
                "#" + f + "_2").hide();
              if (c.bottominfo) {
                a(".bottominfo", "#" + f + "_2").html(c.bottominfo);
                a(".binfo", "#" + f + "_2").show()
              } else a(".binfo", "#" + f + "_2").hide();
              C(d, e, o);
              d == "_empty" || !c.viewPagerButtons ? a("#pData, #nData", "#" + f + "_2").hide() : a("#pData, #nData", "#" + f + "_2").show();
              if (c.processing === true) {
                c.processing = false;
                a("#sData", "#" + f + "_2").removeClass("ui-state-active")
              }
              if (a("#" + o).data("disabled") === true) {
                a(".confirm", "#" + j.themodal).hide();
                a("#" + o).data("disabled", false)
              }
              G && G(a("#" + o));
              a("#" + j.themodal).data("onClose",
                c.onClose);
              a.jgrid.viewModal("#" + j.themodal, {gbox:"#gbox_" + u, jqm:b.jqModal, jqM:false, overlay:b.overlay, modal:b.modal});
              Q || a(".jqmOverlay").click(function () {
                if (!n())return false;
                a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose});
                return false
              });
              L && L(a("#" + o))
            } else {
              var J = isNaN(b.dataheight) ? b.dataheight : b.dataheight + "px";
              J = a("<form name='FormPost' id='" + o + "' class='FormGrid' onSubmit='return false;' style='width:100%;overflow:auto;position:relative;height:" + J + ";'></form>").data("disabled",
                false);
              var W = a("<table id='" + f + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
              if (I) {
                H = I(a("#" + o));
                if (typeof H == "undefined")H = true
              }
              if (H === false)return;
              s();
              a(e.p.colModel).each(function () {
                var g = this.formoptions;
                m = Math.max(m, g ? g.colpos || 0 : 0);
                x = Math.max(x, g ? g.rowpos || 0 : 0)
              });
              a(J).append(W);
              I = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + m * 2 + "'></td></tr>");
              I[0].rp = 0;
              a(W).append(I);
              I = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" +
                m * 2 + "'>" + c.topinfo + "</td></tr>");
              I[0].rp = 0;
              a(W).append(I);
              H = (I = e.p.direction == "rtl" ? true : false) ? "nData" : "pData";
              var X = I ? "pData" : "nData";
              q(d, e, W, m);
              H = "<a href='javascript:void(0)' id='" + H + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></div>";
              X = "<a href='javascript:void(0)' id='" + X + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></div>";
              var ba = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>" +
                b.bSubmit + "</a>", $ = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + b.bCancel + "</a>";
              H = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + f + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (I ? X + H : H + X) + "</td><td class='EditButton'>" + ba + $ + "</td></tr>";
              H += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + c.bottominfo + "</td></tr>";
              H += "</tbody></table>";
              if (x > 0) {
                var ca = [];
                a.each(a(W)[0].rows, function (g, k) {
                  ca[g] = k
                });
                ca.sort(function (g, k) {
                  if (g.rp > k.rp)return 1;
                  if (g.rp < k.rp)return-1;
                  return 0
                });
                a.each(ca, function (g, k) {
                  a("tbody", W).append(k)
                })
              }
              b.gbox = "#gbox_" + u;
              var da = false;
              if (b.closeOnEscape === true) {
                b.closeOnEscape = false;
                da = true
              }
              J = a("<span></span>").append(J).append(H);
              a.jgrid.createModal(j, J, b, "#gview_" + e.p.id, a("#gbox_" + e.p.id)[0]);
              if (I) {
                a("#pData, #nData", "#" + f + "_2").css("float", "right");
                a(".EditButton", "#" + f + "_2").css("text-align",
                  "left")
              }
              c.topinfo && a(".tinfo", "#" + f + "_2").show();
              c.bottominfo && a(".binfo", "#" + f + "_2").show();
              H = J = null;
              a("#" + j.themodal).keydown(function (g) {
                var k = g.target;
                if (a("#" + o).data("disabled") === true)return false;
                if (c.savekey[0] === true && g.which == c.savekey[1])if (k.tagName != "TEXTAREA") {
                  a("#sData", "#" + f + "_2").trigger("click");
                  return false
                }
                if (g.which === 27) {
                  if (!n())return false;
                  da && a.jgrid.hideModal(this, {gb:b.gbox, jqm:b.jqModal, onClose:c.onClose});
                  return false
                }
                if (c.navkeys[0] === true) {
                  if (a("#id_g", "#" + f).val() ==
                    "_empty")return true;
                  if (g.which == c.navkeys[1]) {
                    a("#pData", "#" + f + "_2").trigger("click");
                    return false
                  }
                  if (g.which == c.navkeys[2]) {
                    a("#nData", "#" + f + "_2").trigger("click");
                    return false
                  }
                }
              });
              if (b.checkOnUpdate) {
                a("a.ui-jqdialog-titlebar-close span", "#" + j.themodal).removeClass("jqmClose");
                a("a.ui-jqdialog-titlebar-close", "#" + j.themodal).unbind("click").click(function () {
                  if (!n())return false;
                  a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose});
                  return false
                })
              }
              b.saveicon = a.extend([true,
                "left", "ui-icon-disk"], b.saveicon);
              b.closeicon = a.extend([true, "left", "ui-icon-close"], b.closeicon);
              if (b.saveicon[0] === true)a("#sData", "#" + f + "_2").addClass(b.saveicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.saveicon[2] + "'></span>");
              if (b.closeicon[0] === true)a("#cData", "#" + f + "_2").addClass(b.closeicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.closeicon[2] + "'></span>");
              if (c.checkOnSubmit || c.checkOnUpdate) {
                ba =
                  "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bYes + "</a>";
                X = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bNo + "</a>";
                $ = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + b.bExit + "</a>";
                J = b.zIndex || 999;
                J++;
                a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:" + J + ";display:none;'>&#160;" +
                  (a.browser.msie && a.browser.version == 6 ? '<iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"></iframe>' : "") + "</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (J + 1) + "'>" + b.saveData + "<br/><br/>" + ba + X + $ + "</div>").insertAfter("#" + o);
                a("#sNew", "#" + j.themodal).click(function () {
                  z();
                  a("#" + o).data("disabled", false);
                  a(".confirm", "#" + j.themodal).hide();
                  return false
                });
                a("#nNew", "#" + j.themodal).click(function () {
                  a(".confirm", "#" +
                    j.themodal).hide();
                  a("#" + o).data("disabled", false);
                  setTimeout(function () {
                    a(":input", "#" + o)[0].focus()
                  }, 0);
                  return false
                });
                a("#cNew", "#" + j.themodal).click(function () {
                  a(".confirm", "#" + j.themodal).hide();
                  a("#" + o).data("disabled", false);
                  a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose});
                  return false
                })
              }
              T && T(a("#" + o));
              d == "_empty" || !c.viewPagerButtons ? a("#pData,#nData", "#" + f + "_2").hide() : a("#pData,#nData", "#" + f + "_2").show();
              G && G(a("#" + o));
              a("#" + j.themodal).data("onClose", c.onClose);
              a.jgrid.viewModal("#" + j.themodal, {gbox:"#gbox_" + u, jqm:b.jqModal, overlay:b.overlay, modal:b.modal});
              Q || a(".jqmOverlay").click(function () {
                if (!n())return false;
                a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose});
                return false
              });
              L && L(a("#" + o));
              a(".fm-button", "#" + j.themodal).hover(function () {
                a(this).addClass("ui-state-hover")
              }, function () {
                a(this).removeClass("ui-state-hover")
              });
              a("#sData", "#" + f + "_2").click(function () {
                h = {};
                P = {};
                a("#FormError", "#" + f).hide();
                l();
                w();
                if (h[e.p.id +
                  "_id"] == "_empty")z(); else if (b.checkOnSubmit === true) {
                  O = a.extend({}, h, P);
                  if (V = D(O, c._savedData)) {
                    a("#" + o).data("disabled", true);
                    a(".confirm", "#" + j.themodal).show()
                  } else z()
                } else z();
                return false
              });
              a("#cData", "#" + f + "_2").click(function () {
                if (!n())return false;
                a.jgrid.hideModal("#" + j.themodal, {gb:"#gbox_" + u, jqm:b.jqModal, onClose:c.onClose});
                return false
              });
              a("#nData", "#" + f + "_2").click(function () {
                if (!n())return false;
                a("#FormError", "#" + f).hide();
                var g = p();
                g[0] = parseInt(g[0], 10);
                if (g[0] != -1 && g[1][g[0] + 1]) {
                  if (a.isFunction(b.onclickPgButtons))b.onclickPgButtons("next",
                    a("#" + o), g[1][g[0]]);
                  C(g[1][g[0] + 1], e, o);
                  a(e).jqGrid("setSelection", g[1][g[0] + 1]);
                  a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("next", a("#" + o), g[1][g[0] + 1]);
                  t(g[0] + 1, g[1].length - 1)
                }
                return false
              });
              a("#pData", "#" + f + "_2").click(function () {
                if (!n())return false;
                a("#FormError", "#" + f).hide();
                var g = p();
                if (g[0] != -1 && g[1][g[0] - 1]) {
                  if (a.isFunction(b.onclickPgButtons))b.onclickPgButtons("prev", a("#" + o), g[1][g[0]]);
                  C(g[1][g[0] - 1], e, o);
                  a(e).jqGrid("setSelection", g[1][g[0] - 1]);
                  a.isFunction(b.afterclickPgButtons) &&
                  b.afterclickPgButtons("prev", a("#" + o), g[1][g[0] - 1]);
                  t(g[0] - 1, g[1].length - 1)
                }
                return false
              })
            }
            G = p();
            t(G[0], G[1].length - 1)
          }
        })
      }, viewGridRow:function (d, b) {
        b = a.extend({top:0, left:0, width:0, height:"auto", dataheight:"auto", modal:false, overlay:10, drag:true, resize:true, jqModal:true, closeOnEscape:false, labelswidth:"30%", closeicon:[], navkeys:[false, 38, 40], onClose:null, beforeShowForm:null, beforeInitData:null, viewPagerButtons:true}, a.jgrid.view, b || {});
        return this.each(function () {
          function l() {
            if (b.closeOnEscape ===
              true || b.navkeys[0] === true)setTimeout(function () {
              a(".ui-jqdialog-titlebar-close", "#" + p.modalhead).focus()
            }, 0)
          }

          function q(m, x, h, P) {
            for (var O, V, Q, J = 0, W, X, ba = [], $ = false, ca = "<td class='CaptionTD form-view-label ui-widget-content' width='" + b.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", da = "", g = ["integer", "number", "currency"], k = 0, v = 0, r, E, A, y = 1; y <= P; y++)da += y == 1 ? ca : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
            a(x.p.colModel).each(function () {
              V = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false;
              if (!V && this.align === "right")if (this.formatter && a.inArray(this.formatter, g) !== -1)k = Math.max(k, parseInt(this.width, 10)); else v = Math.max(v, parseInt(this.width, 10))
            });
            r = k !== 0 ? k : v !== 0 ? v : 0;
            $ = a(x).jqGrid("getInd", m);
            a(x.p.colModel).each(function (K) {
              O = this.name;
              E = false;
              X = (V = this.editrules && this.editrules.edithidden === true ? false : this.hidden === true ? true : false) ? "style='display:none'" : "";
              A = typeof this.viewable !=
                "boolean" ? true : this.viewable;
              if (O !== "cb" && O !== "subgrid" && O !== "rn" && A) {
                W = $ === false ? "" : O == x.p.ExpandColumn && x.p.treeGrid === true ? a("td:eq(" + K + ")", x.rows[$]).text() : a("td:eq(" + K + ")", x.rows[$]).html();
                E = this.align === "right" && r !== 0 ? true : false;
                a.extend({}, this.editoptions || {}, {id:O, name:O});
                var B = a.extend({}, {rowabove:false, rowcontent:""}, this.formoptions || {}), N = parseInt(B.rowpos, 10) || J + 1, F = parseInt((parseInt(B.colpos, 10) || 1) * 2, 10);
                if (B.rowabove) {
                  var S = a("<tr><td class='contentinfo' colspan='" + P * 2 + "'>" +
                    B.rowcontent + "</td></tr>");
                  a(h).append(S);
                  S[0].rp = N
                }
                Q = a(h).find("tr[rowpos=" + N + "]");
                if (Q.length === 0) {
                  Q = a("<tr " + X + " rowpos='" + N + "'></tr>").addClass("FormData").attr("id", "trv_" + O);
                  a(Q).append(da);
                  a(h).append(Q);
                  Q[0].rp = N
                }
                a("td:eq(" + (F - 2) + ")", Q[0]).html("<b>" + (typeof B.label === "undefined" ? x.p.colNames[K] : B.label) + "</b>");
                a("td:eq(" + (F - 1) + ")", Q[0]).append("<span>" + W + "</span>").attr("id", "v_" + O);
                E && a("td:eq(" + (F - 1) + ") span", Q[0]).css({"text-align":"right", width:r + "px"});
                ba[J] = K;
                J++
              }
            });
            if (J > 0) {
              m = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" +
                (P * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + m + "'/></td></tr>");
              m[0].rp = J + 99;
              a(h).append(m)
            }
            return ba
          }

          function C(m, x) {
            var h, P, O = 0, V, Q;
            if (Q = a(x).jqGrid("getInd", m, true)) {
              a("td", Q).each(function (J) {
                h = x.p.colModel[J].name;
                P = x.p.colModel[J].editrules && x.p.colModel[J].editrules.edithidden === true ? false : x.p.colModel[J].hidden === true ? true : false;
                if (h !== "cb" && h !== "subgrid" && h !== "rn") {
                  V = h == x.p.ExpandColumn && x.p.treeGrid === true ? a(this).text() : a(this).html();
                  a.extend({},
                    x.p.colModel[J].editoptions || {});
                  h = a.jgrid.jqID("v_" + h);
                  a("#" + h + " span", "#" + t).html(V);
                  P && a("#" + h, "#" + t).parents("tr:first").hide();
                  O++
                }
              });
              O > 0 && a("#id_g", "#" + t).val(m)
            }
          }

          function z(m, x) {
            m === 0 ? a("#pData", "#" + t + "_2").addClass("ui-state-disabled") : a("#pData", "#" + t + "_2").removeClass("ui-state-disabled");
            m == x ? a("#nData", "#" + t + "_2").addClass("ui-state-disabled") : a("#nData", "#" + t + "_2").removeClass("ui-state-disabled")
          }

          function D() {
            var m = a(w).jqGrid("getDataIDs"), x = a("#id_g", "#" + t).val();
            return[a.inArray(x,
              m), m]
          }

          var w = this;
          if (w.grid && d) {
            if (!b.imgpath)b.imgpath = w.p.imgpath;
            var n = w.p.id, s = "ViewGrid_" + n, t = "ViewTbl_" + n, p = {themodal:"viewmod" + n, modalhead:"viewhd" + n, modalcontent:"viewcnt" + n, scrollelm:s}, e = a.isFunction(b.beforeInitData) ? b.beforeInitData : false, u = true, o = 1, f = 0;
            if (a("#" + p.themodal).html() !== null) {
              if (e) {
                u = e(a("#" + s));
                if (typeof u == "undefined")u = true
              }
              if (u === false)return;
              a(".ui-jqdialog-title", "#" + p.modalhead).html(b.caption);
              a("#FormError", "#" + t).hide();
              C(d, w);
              a.isFunction(b.beforeShowForm) && b.beforeShowForm(a("#" +
                s));
              a.jgrid.viewModal("#" + p.themodal, {gbox:"#gbox_" + n, jqm:b.jqModal, jqM:false, overlay:b.overlay, modal:b.modal});
              l()
            } else {
              var j = isNaN(b.dataheight) ? b.dataheight : b.dataheight + "px";
              j = a("<form name='FormPost' id='" + s + "' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:" + j + ";'></form>");
              var G = a("<table id='" + t + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
              if (e) {
                u = e(a("#" + s));
                if (typeof u == "undefined")u = true
              }
              if (u ===
                false)return;
              a(w.p.colModel).each(function () {
                var m = this.formoptions;
                o = Math.max(o, m ? m.colpos || 0 : 0);
                f = Math.max(f, m ? m.rowpos || 0 : 0)
              });
              a(j).append(G);
              q(d, w, G, o);
              e = w.p.direction == "rtl" ? true : false;
              u = "<a href='javascript:void(0)' id='" + (e ? "nData" : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
              var L = "<a href='javascript:void(0)' id='" + (e ? "pData" : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                I = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + b.bClose + "</a>";
              if (f > 0) {
                var T = [];
                a.each(a(G)[0].rows, function (m, x) {
                  T[m] = x
                });
                T.sort(function (m, x) {
                  if (m.rp > x.rp)return 1;
                  if (m.rp < x.rp)return-1;
                  return 0
                });
                a.each(T, function (m, x) {
                  a("tbody", G).append(x)
                })
              }
              b.gbox = "#gbox_" + n;
              var H = false;
              if (b.closeOnEscape === true) {
                b.closeOnEscape = false;
                H = true
              }
              j = a("<span></span>").append(j).append("<table border='0' class='EditTable' id='" + t + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" +
                b.labelswidth + "'>" + (e ? L + u : u + L) + "</td><td class='EditButton'>" + I + "</td></tr></tbody></table>");
              a.jgrid.createModal(p, j, b, "#gview_" + w.p.id, a("#gview_" + w.p.id)[0]);
              if (e) {
                a("#pData, #nData", "#" + t + "_2").css("float", "right");
                a(".EditButton", "#" + t + "_2").css("text-align", "left")
              }
              b.viewPagerButtons || a("#pData, #nData", "#" + t + "_2").hide();
              j = null;
              a("#" + p.themodal).keydown(function (m) {
                if (m.which === 27) {
                  H && a.jgrid.hideModal(this, {gb:b.gbox, jqm:b.jqModal, onClose:b.onClose});
                  return false
                }
                if (b.navkeys[0] === true) {
                  if (m.which ===
                    b.navkeys[1]) {
                    a("#pData", "#" + t + "_2").trigger("click");
                    return false
                  }
                  if (m.which === b.navkeys[2]) {
                    a("#nData", "#" + t + "_2").trigger("click");
                    return false
                  }
                }
              });
              b.closeicon = a.extend([true, "left", "ui-icon-close"], b.closeicon);
              if (b.closeicon[0] === true)a("#cData", "#" + t + "_2").addClass(b.closeicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.closeicon[2] + "'></span>");
              a.isFunction(b.beforeShowForm) && b.beforeShowForm(a("#" + s));
              a.jgrid.viewModal("#" + p.themodal, {gbox:"#gbox_" +
                n, jqm:b.jqModal, modal:b.modal});
              a(".fm-button:not(.ui-state-disabled)", "#" + t + "_2").hover(function () {
                a(this).addClass("ui-state-hover")
              }, function () {
                a(this).removeClass("ui-state-hover")
              });
              l();
              a("#cData", "#" + t + "_2").click(function () {
                a.jgrid.hideModal("#" + p.themodal, {gb:"#gbox_" + n, jqm:b.jqModal, onClose:b.onClose});
                return false
              });
              a("#nData", "#" + t + "_2").click(function () {
                a("#FormError", "#" + t).hide();
                var m = D();
                m[0] = parseInt(m[0], 10);
                if (m[0] != -1 && m[1][m[0] + 1]) {
                  if (a.isFunction(b.onclickPgButtons))b.onclickPgButtons("next",
                    a("#" + s), m[1][m[0]]);
                  C(m[1][m[0] + 1], w);
                  a(w).jqGrid("setSelection", m[1][m[0] + 1]);
                  a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("next", a("#" + s), m[1][m[0] + 1]);
                  z(m[0] + 1, m[1].length - 1)
                }
                l();
                return false
              });
              a("#pData", "#" + t + "_2").click(function () {
                a("#FormError", "#" + t).hide();
                var m = D();
                if (m[0] != -1 && m[1][m[0] - 1]) {
                  if (a.isFunction(b.onclickPgButtons))b.onclickPgButtons("prev", a("#" + s), m[1][m[0]]);
                  C(m[1][m[0] - 1], w);
                  a(w).jqGrid("setSelection", m[1][m[0] - 1]);
                  a.isFunction(b.afterclickPgButtons) && b.afterclickPgButtons("prev",
                    a("#" + s), m[1][m[0] - 1]);
                  z(m[0] - 1, m[1].length - 1)
                }
                l();
                return false
              })
            }
            j = D();
            z(j[0], j[1].length - 1)
          }
        })
      }, delGridRow:function (d, b) {
        c = b = a.extend({top:0, left:0, width:240, height:"auto", dataheight:"auto", modal:false, overlay:10, drag:true, resize:true, url:"", mtype:"POST", reloadAfterSubmit:true, beforeShowForm:null, beforeInitData:null, afterShowForm:null, beforeSubmit:null, onclickSubmit:null, afterSubmit:null, jqModal:true, closeOnEscape:false, delData:{}, delicon:[], cancelicon:[], onClose:null, ajaxDelOptions:{}, processing:false,
          serializeDelData:null, useDataProxy:false}, a.jgrid.del, b || {});
        return this.each(function () {
          var l = this;
          if (l.grid)if (d) {
            var q = typeof b.beforeShowForm === "function" ? true : false, C = typeof b.afterShowForm === "function" ? true : false, z = a.isFunction(b.beforeInitData) ? b.beforeInitData : false, D = l.p.id, w = {}, n = true, s = "DelTbl_" + D, t, p, e, u, o = {themodal:"delmod" + D, modalhead:"delhd" + D, modalcontent:"delcnt" + D, scrollelm:s};
            if (jQuery.isArray(d))d = d.join();
            if (a("#" + o.themodal).html() !== null) {
              if (z) {
                n = z(a("#" + s));
                if (typeof n == "undefined")n =
                  true
              }
              if (n === false)return;
              a("#DelData>td", "#" + s).text(d);
              a("#DelError", "#" + s).hide();
              if (c.processing === true) {
                c.processing = false;
                a("#dData", "#" + s).removeClass("ui-state-active")
              }
              q && b.beforeShowForm(a("#" + s));
              a.jgrid.viewModal("#" + o.themodal, {gbox:"#gbox_" + D, jqm:b.jqModal, jqM:false, overlay:b.overlay, modal:b.modal})
            } else {
              var f = isNaN(b.dataheight) ? b.dataheight : b.dataheight + "px";
              f = "<div id='" + s + "' class='formdata' style='width:100%;overflow:auto;position:relative;height:" + f + ";'>";
              f += "<table class='DelTable'><tbody>";
              f += "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>";
              f += "<tr id='DelData' style='display:none'><td >" + d + "</td></tr>";
              f += '<tr><td class="delmsg" style="white-space:pre;">' + b.msg + "</td></tr><tr><td >&#160;</td></tr>";
              f += "</tbody></table></div>";
              f += "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + s + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr></tr><tr><td class='DelButton EditButton'>" + ("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>" +
                b.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>" + b.bCancel + "</a>") + "</td></tr></tbody></table>";
              b.gbox = "#gbox_" + D;
              a.jgrid.createModal(o, f, b, "#gview_" + l.p.id, a("#gview_" + l.p.id)[0]);
              if (z) {
                n = z(a("#" + s));
                if (typeof n == "undefined")n = true
              }
              if (n === false)return;
              a(".fm-button", "#" + s + "_2").hover(function () {
                a(this).addClass("ui-state-hover")
              }, function () {
                a(this).removeClass("ui-state-hover")
              });
              b.delicon = a.extend([true, "left", "ui-icon-scissors"],
                b.delicon);
              b.cancelicon = a.extend([true, "left", "ui-icon-cancel"], b.cancelicon);
              if (b.delicon[0] === true)a("#dData", "#" + s + "_2").addClass(b.delicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.delicon[2] + "'></span>");
              if (b.cancelicon[0] === true)a("#eData", "#" + s + "_2").addClass(b.cancelicon[1] == "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + b.cancelicon[2] + "'></span>");
              a("#dData", "#" + s + "_2").click(function () {
                var j = [true, ""];
                w = {};
                var G = a("#DelData>td", "#" + s).text();
                if (typeof b.onclickSubmit === "function")w = b.onclickSubmit(c, G) || {};
                if (typeof b.beforeSubmit === "function")j = b.beforeSubmit(G);
                if (j[0] && !c.processing) {
                  c.processing = true;
                  a(this).addClass("ui-state-active");
                  e = l.p.prmNames;
                  t = a.extend({}, c.delData, w);
                  u = e.oper;
                  t[u] = e.deloper;
                  p = e.id;
                  t[p] = G;
                  var L = a.extend({url:c.url ? c.url : a(l).jqGrid("getGridParam", "editurl"), type:b.mtype, data:a.isFunction(b.serializeDelData) ? b.serializeDelData(t) : t, complete:function (I, T) {
                    if (T != "success") {
                      j[0] =
                        false;
                      j[1] = a.isFunction(c.errorTextFormat) ? c.errorTextFormat(I) : T + " Status: '" + I.statusText + "'. Error code: " + I.status
                    } else if (typeof c.afterSubmit === "function")j = c.afterSubmit(I, t);
                    if (j[0] === false) {
                      a("#DelError>td", "#" + s).html(j[1]);
                      a("#DelError", "#" + s).show()
                    } else {
                      if (c.reloadAfterSubmit && l.p.datatype != "local")a(l).trigger("reloadGrid"); else {
                        var H = [];
                        H = G.split(",");
                        if (l.p.treeGrid === true)try {
                          a(l).jqGrid("delTreeNode", H[0])
                        } catch (m) {
                        } else for (var x = 0; x < H.length; x++)a(l).jqGrid("delRowData", H[x]);
                        l.p.selrow = null;
                        l.p.selarrrow = []
                      }
                      a.isFunction(c.afterComplete) && setTimeout(function () {
                        c.afterComplete(I, G)
                      }, 500)
                    }
                    c.processing = false;
                    a("#dData", "#" + s + "_2").removeClass("ui-state-active");
                    j[0] && a.jgrid.hideModal("#" + o.themodal, {gb:"#gbox_" + D, jqm:b.jqModal, onClose:c.onClose})
                  }}, a.jgrid.ajaxOptions, b.ajaxDelOptions);
                  if (!L.url && !c.useDataProxy)if (a.isFunction(l.p.dataProxy))c.useDataProxy = true; else {
                    j[0] = false;
                    j[1] += " " + a.jgrid.errors.nourl
                  }
                  if (j[0])c.useDataProxy ? l.p.dataProxy.call(l, L, "del_" + l.p.id) : a.ajax(L)
                }
                if (j[0] ===
                  false) {
                  a("#DelError>td", "#" + s).html(j[1]);
                  a("#DelError", "#" + s).show()
                }
                return false
              });
              a("#eData", "#" + s + "_2").click(function () {
                a.jgrid.hideModal("#" + o.themodal, {gb:"#gbox_" + D, jqm:b.jqModal, onClose:c.onClose});
                return false
              });
              q && b.beforeShowForm(a("#" + s));
              a.jgrid.viewModal("#" + o.themodal, {gbox:"#gbox_" + D, jqm:b.jqModal, overlay:b.overlay, modal:b.modal})
            }
            C && b.afterShowForm(a("#" + s));
            b.closeOnEscape === true && setTimeout(function () {
              a(".ui-jqdialog-titlebar-close", "#" + o.modalhead).focus()
            }, 0)
          }
        })
      }, navGrid:function (d, b, l, q, C, z, D) {
        b = a.extend({edit:true, editicon:"ui-icon-pencil", add:true, addicon:"ui-icon-plus", del:true, delicon:"ui-icon-trash", search:true, searchicon:"ui-icon-search", refresh:true, refreshicon:"ui-icon-refresh", refreshstate:"firstpage", view:false, viewicon:"ui-icon-document", position:"left", closeOnEscape:true, beforeRefresh:null, afterRefresh:null, cloneToTop:false}, a.jgrid.nav, b || {});
        return this.each(function () {
          if (!this.nav) {
            var w = {themodal:"alertmod", modalhead:"alerthd", modalcontent:"alertcnt"}, n = this,
              s, t, p;
            if (!(!n.grid || typeof d != "string")) {
              if (a("#" + w.themodal).html() === null) {
                if (typeof window.innerWidth != "undefined") {
                  s = window.innerWidth;
                  t = window.innerHeight
                } else if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined" && document.documentElement.clientWidth !== 0) {
                  s = document.documentElement.clientWidth;
                  t = document.documentElement.clientHeight
                } else {
                  s = 1024;
                  t = 768
                }
                a.jgrid.createModal(w, "<div>" + b.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",
                  {gbox:"#gbox_" + n.p.id, jqModal:true, drag:true, resize:true, caption:b.alertcap, top:t / 2 - 25, left:s / 2 - 100, width:200, height:"auto", closeOnEscape:b.closeOnEscape}, "", "", true)
              }
              s = 1;
              if (b.cloneToTop && n.p.toppager)s = 2;
              for (t = 0; t < s; t++) {
                var e = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"), u, o;
                if (t === 0) {
                  u = d;
                  o = n.p.id;
                  if (u == n.p.toppager) {
                    o += "_top";
                    s = 1
                  }
                } else {
                  u = n.p.toppager;
                  o = n.p.id + "_top"
                }
                n.p.direction == "rtl" &&
                a(e).attr("dir", "rtl").css("float", "right");
                if (b.add) {
                  q = q || {};
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.addicon + "'></span>" + b.addtext + "</div>");
                  a("tr", e).append(p);
                  a(p, e).attr({title:b.addtitle || "", id:q.id || "add_" + o}).click(function () {
                    a(this).hasClass("ui-state-disabled") || (typeof b.addfunc == "function" ? b.addfunc() : a(n).jqGrid("editGridRow", "new", q));
                    return false
                  }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    },
                    function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  p = null
                }
                if (b.edit) {
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  l = l || {};
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.editicon + "'></span>" + b.edittext + "</div>");
                  a("tr", e).append(p);
                  a(p, e).attr({title:b.edittitle || "", id:l.id || "edit_" + o}).click(function () {
                    if (!a(this).hasClass("ui-state-disabled")) {
                      var f = n.p.selrow;
                      if (f)typeof b.editfunc == "function" ? b.editfunc(f) : a(n).jqGrid("editGridRow", f, l); else {
                        a.jgrid.viewModal("#" + w.themodal,
                          {gbox:"#gbox_" + n.p.id, jqm:true});
                        a("#jqg_alrt").focus()
                      }
                    }
                    return false
                  }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    }, function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  p = null
                }
                if (b.view) {
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  D = D || {};
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.viewicon + "'></span>" + b.viewtext + "</div>");
                  a("tr", e).append(p);
                  a(p, e).attr({title:b.viewtitle || "", id:D.id || "view_" + o}).click(function () {
                    if (!a(this).hasClass("ui-state-disabled")) {
                      var f =
                        n.p.selrow;
                      if (f)a(n).jqGrid("viewGridRow", f, D); else {
                        a.jgrid.viewModal("#" + w.themodal, {gbox:"#gbox_" + n.p.id, jqm:true});
                        a("#jqg_alrt").focus()
                      }
                    }
                    return false
                  }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    }, function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  p = null
                }
                if (b.del) {
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  C = C || {};
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.delicon + "'></span>" + b.deltext + "</div>");
                  a("tr", e).append(p);
                  a(p,
                    e).attr({title:b.deltitle || "", id:C.id || "del_" + o}).click(function () {
                      if (!a(this).hasClass("ui-state-disabled")) {
                        var f;
                        if (n.p.multiselect) {
                          f = n.p.selarrrow;
                          if (f.length === 0)f = null
                        } else f = n.p.selrow;
                        if (f)"function" == typeof b.delfunc ? b.delfunc(f) : a(n).jqGrid("delGridRow", f, C); else {
                          a.jgrid.viewModal("#" + w.themodal, {gbox:"#gbox_" + n.p.id, jqm:true});
                          a("#jqg_alrt").focus()
                        }
                      }
                      return false
                    }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    }, function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  p = null
                }
                if (b.add || b.edit || b.del || b.view)a("tr", e).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");
                if (b.search) {
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  z = z || {};
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.searchicon + "'></span>" + b.searchtext + "</div>");
                  a("tr", e).append(p);
                  a(p, e).attr({title:b.searchtitle || "", id:z.id || "search_" + o}).click(function () {
                    a(this).hasClass("ui-state-disabled") || a(n).jqGrid("searchGrid",
                      z);
                    return false
                  }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    }, function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  z.showOnLoad && z.showOnLoad === true && a(p, e).click();
                  p = null
                }
                if (b.refresh) {
                  p = a("<td class='ui-pg-button ui-corner-all'></td>");
                  a(p).append("<div class='ui-pg-div'><span class='ui-icon " + b.refreshicon + "'></span>" + b.refreshtext + "</div>");
                  a("tr", e).append(p);
                  a(p, e).attr({title:b.refreshtitle || "", id:"refresh_" + o}).click(function () {
                    if (!a(this).hasClass("ui-state-disabled")) {
                      a.isFunction(b.beforeRefresh) &&
                      b.beforeRefresh();
                      n.p.search = false;
                      try {
                        var f = n.p.id;
                        n.p.postData.filters = "";
                        a("#fbox_" + f).jqFilter("resetFilter");
                        a.isFunction(n.clearToolbar) && n.clearToolbar(false)
                      } catch (j) {
                      }
                      switch (b.refreshstate) {
                        case "firstpage":
                          a(n).trigger("reloadGrid", [
                            {page:1}
                          ]);
                          break;
                        case "current":
                          a(n).trigger("reloadGrid", [
                            {current:true}
                          ])
                      }
                      a.isFunction(b.afterRefresh) && b.afterRefresh()
                    }
                    return false
                  }).hover(function () {
                      a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                    }, function () {
                      a(this).removeClass("ui-state-hover")
                    });
                  p = null
                }
                p = a(".ui-jqgrid").css("font-size") || "11px";
                a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + p + ";visibility:hidden;' ></div>");
                p = a(e).clone().appendTo("#testpg2").width();
                a("#testpg2").remove();
                a(u + "_" + b.position, u).append(e);
                if (n.p._nvtd) {
                  if (p > n.p._nvtd[0]) {
                    a(u + "_" + b.position, u).width(p);
                    n.p._nvtd[0] = p
                  }
                  n.p._nvtd[1] = p
                }
                e = p = p = null;
                this.nav = true
              }
            }
          }
        })
      }, navButtonAdd:function (d, b) {
        b = a.extend({caption:"newButton", title:"", buttonicon:"ui-icon-newwin",
          onClickButton:null, position:"last", cursor:"pointer"}, b || {});
        return this.each(function () {
          if (this.grid) {
            if (d.indexOf("#") !== 0)d = "#" + d;
            var l = a(".navtable", d)[0], q = this;
            if (l)if (!(b.id && a("#" + b.id, l).html() !== null)) {
              var C = a("<td></td>");
              b.buttonicon.toString().toUpperCase() == "NONE" ? a(C).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + b.caption + "</div>") : a(C).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + b.buttonicon + "'></span>" + b.caption +
                "</div>");
              b.id && a(C).attr("id", b.id);
              if (b.position == "first")l.rows[0].cells.length === 0 ? a("tr", l).append(C) : a("tr td:eq(0)", l).before(C); else a("tr", l).append(C);
              a(C, l).attr("title", b.title || "").click(function (z) {
                a(this).hasClass("ui-state-disabled") || a.isFunction(b.onClickButton) && b.onClickButton.call(q, z);
                return false
              }).hover(function () {
                  a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                }, function () {
                  a(this).removeClass("ui-state-hover")
                })
            }
          }
        })
      }, navSeparatorAdd:function (d, b) {
        b =
          a.extend({sepclass:"ui-separator", sepcontent:""}, b || {});
        return this.each(function () {
          if (this.grid) {
            if (d.indexOf("#") !== 0)d = "#" + d;
            var l = a(".navtable", d)[0];
            if (l) {
              var q = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + b.sepclass + "'></span>" + b.sepcontent + "</td>";
              a("tr", l).append(q)
            }
          }
        })
      }, GridToForm:function (d, b) {
        return this.each(function () {
          if (this.grid) {
            var l = a(this).jqGrid("getRowData", d);
            if (l)for (var q in l)a("[name=" + a.jgrid.jqID(q) + "]", b).is("input:radio") || a("[name=" +
              a.jgrid.jqID(q) + "]", b).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(q) + "]", b).each(function () {
              a(this).val() == l[q] ? a(this).attr("checked", "checked") : a(this).attr("checked", "")
            }) : a("[name=" + a.jgrid.jqID(q) + "]", b).val(l[q])
          }
        })
      }, FormToGrid:function (d, b, l, q) {
        return this.each(function () {
          if (this.grid) {
            l || (l = "set");
            q || (q = "first");
            var C = a(b).serializeArray(), z = {};
            a.each(C, function (D, w) {
              z[w.name] = w.value
            });
            if (l == "add")a(this).jqGrid("addRowData", d, z, q); else l == "set" && a(this).jqGrid("setRowData", d, z)
          }
        })
      }})
    })(jQuery);
    (function (d) {
      d.fn.jqFilter = function (k) {
        if (typeof k === "string") {
          var t = d.fn.jqFilter[k];
          if (!t)throw"jqFilter - No such method: " + k;
          var z = d.makeArray(arguments).slice(1);
          return t.apply(this, z)
        }
        var o = d.extend(true, {filter:null, columns:[], onChange:null, checkValues:null, error:false, errmsg:"", errorcheck:true, showQuery:true, sopt:null, ops:[
          {name:"eq", description:"equal", operator:"="},
          {name:"ne", description:"not equal", operator:"<>"},
          {name:"lt", description:"less", operator:"<"},
          {name:"le", description:"less or equal",
            operator:"<="},
          {name:"gt", description:"greater", operator:">"},
          {name:"ge", description:"greater or equal", operator:">="},
          {name:"bw", description:"begins with", operator:"LIKE"},
          {name:"bn", description:"does not begin with", operator:"NOT LIKE"},
          {name:"in", description:"in", operator:"IN"},
          {name:"ni", description:"not in", operator:"NOT IN"},
          {name:"ew", description:"ends with", operator:"LIKE"},
          {name:"en", description:"does not end with", operator:"NOT LIKE"},
          {name:"cn", description:"contains", operator:"LIKE"},
          {name:"nc",
            description:"does not contain", operator:"NOT LIKE"},
          {name:"nu", description:"is null", operator:"IS NULL"},
          {name:"nn", description:"is not null", operator:"IS NOT NULL"}
        ], numopts:["eq", "ne", "lt", "le", "gt", "ge", "nu", "nn", "in", "ni"], stropts:["eq", "ne", "bw", "bn", "ew", "en", "cn", "nc", "nu", "nn", "in", "ni"], _gridsopt:[], groupOps:["AND", "OR"], groupButton:true}, k || {});
        return this.each(function () {
          if (!this.filter) {
            this.p = o;
            if (this.p.filter === null || this.p.filter === undefined)this.p.filter = {groupOp:this.p.groupOps[0],
              rules:[], groups:[]};
            var p, u = this.p.columns.length, i, v = /msie/i.test(navigator.userAgent) && !window.opera;
            if (this.p._gridsopt.length)for (p = 0; p < this.p._gridsopt.length; p++)this.p.ops[p].description = this.p._gridsopt[p];
            this.p.initFilter = d.extend(true, {}, this.p.filter);
            if (u) {
              for (p = 0; p < u; p++) {
                i = this.p.columns[p];
                if (i.stype)i.inputtype = i.stype; else if (!i.inputtype)i.inputtype = "text";
                if (i.sorttype)i.searchtype = i.sorttype; else if (!i.searchtype)i.searchtype = "string";
                if (i.hidden === undefined)i.hidden = false;
                if (!i.label)i.label =
                  i.name;
                if (i.index)i.name = i.index;
                if (!i.hasOwnProperty("searchoptions"))i.searchoptions = {};
                if (!i.hasOwnProperty("searchrules"))i.searchrules = {}
              }
              this.p.showQuery && d(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;'><tbody><tr><td class='query'></td></tr></tbody></table>");
              var w = function (c, f) {
                var a = [true, ""];
                if (d.isFunction(f.searchrules))a = f.searchrules(c, f); else if (d.jgrid && d.jgrid.checkValues)try {
                  a = d.jgrid.checkValues(c, -1,
                    null, f.searchrules, f.label)
                } catch (b) {
                }
                if (a && a.length && a[0] === false) {
                  o.error = !a[0];
                  o.errmsg = a[1]
                }
              };
              this.onchange = function () {
                this.p.error = false;
                this.p.errmsg = "";
                return d.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : false
              };
              this.reDraw = function () {
                d("table.group:first", this).remove();
                var c = this.createTableForGroup(o.filter, null);
                d(this).append(c)
              };
              this.createTableForGroup = function (c, f) {
                var a = this, b, e = d("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>");
                f === null && d(e).append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='left'></th></tr>");
                var g = d("<tr></tr>");
                d(e).append(g);
                var j = d("<th colspan='5' align='left'></th>");
                g.append(j);
                var h = d("<select class='opsel'></select>");
                j.append(h);
                g = "";
                var l;
                for (b = 0; b < o.groupOps.length; b++) {
                  l = c.groupOp === a.p.groupOps[b] ? " selected='selected'" : "";
                  g += "<option value='" + a.p.groupOps[b] + "'" + l + ">" + a.p.groupOps[b] + "</option>"
                }
                h.append(g).bind("change", function () {
                  c.groupOp = d(h).val();
                  a.onchange()
                });
                g = "<span></span>";
                if (this.p.groupButton) {
                  g = d("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>");
                  g.bind("click", function () {
                    if (c.groups === undefined)c.groups = [];
                    c.groups.push({groupOp:o.groupOps[0], rules:[], groups:[]});
                    a.reDraw();
                    a.onchange();
                    return false
                  })
                }
                j.append(g);
                g = d("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>");
                var m;
                g.bind("click", function () {
                  if (c.rules === undefined)c.rules = [];
                  for (b = 0; b < a.p.columns.length; b++) {
                    var n = typeof a.p.columns[b].search ===
                      "undefined" ? true : a.p.columns[b].search, r = a.p.columns[b].hidden === true;
                    if (a.p.columns[b].searchoptions.searchhidden === true && n || n && !r) {
                      m = a.p.columns[b];
                      break
                    }
                  }
                  c.rules.push({field:m.name, op:(m.searchoptions.sopt ? m.searchoptions.sopt : a.p.sopt ? a.p.sopt : m.searchtype === "string" ? a.p.stropts : a.p.numopts)[0], data:""});
                  a.reDraw();
                  return false
                });
                j.append(g);
                if (f !== null) {
                  g = d("<input type='button' value='-' title='Delete group' class='delete-group'/>");
                  j.append(g);
                  g.bind("click", function () {
                    for (b = 0; b < f.groups.length; b++)if (f.groups[b] ===
                      c) {
                      f.groups.splice(b, 1);
                      break
                    }
                    a.reDraw();
                    a.onchange();
                    return false
                  })
                }
                if (c.groups !== undefined)for (b = 0; b < c.groups.length; b++) {
                  j = d("<tr></tr>");
                  e.append(j);
                  g = d("<td class='first'></td>");
                  j.append(g);
                  g = d("<td colspan='4'></td>");
                  g.append(this.createTableForGroup(c.groups[b], c));
                  j.append(g)
                }
                if (c.groupOp === undefined)c.groupOp = a.p.groupOps[0];
                if (c.rules !== undefined)for (b = 0; b < c.rules.length; b++)e.append(this.createTableRowForRule(c.rules[b], c));
                return e
              };
              this.createTableRowForRule = function (c, f) {
                var a = this,
                  b = d("<tr></tr>"), e, g, j, h, l = "", m;
                b.append("<td class='first'></td>");
                var n = d("<td class='columns'></td>");
                b.append(n);
                var r = d("<select></select>");
                n.append(r);
                r.bind("change", function () {
                  c.field = d(r).val();
                  j = d(this).parents("tr:first");
                  for (e = 0; e < a.p.columns.length; e++)if (a.p.columns[e].name === c.field) {
                    h = a.p.columns[e];
                    break
                  }
                  if (h) {
                    h.searchoptions.id = d.jgrid.randId();
                    if (v && h.inputtype === "text")if (!h.searchoptions.size)h.searchoptions.size = 10;
                    var q = d.jgrid.createEl(h.inputtype, h.searchoptions, "", true,
                      a.p.ajaxSelectOptions, true);
                    d(q).addClass("input-elm");
                    g = h.searchoptions.sopt ? h.searchoptions.sopt : a.p.sopt ? a.p.sopt : h.searchtype === "string" ? a.p.stropts : a.p.numopts;
                    var x = "", y = "";
                    for (e = 0; e < a.p.ops.length; e++)if (d.inArray(a.p.ops[e].name, g) !== -1) {
                      y = c.op === a.p.ops[e].name ? " selected=selected" : "";
                      x += "<option value='" + a.p.ops[e].name + "'" + y + ">" + a.p.ops[e].description + "</option>"
                    }
                    d(".selectopts", j).empty().append(x);
                    d(".data", j).empty().append(q);
                    d(".input-elm", j).bind("change", function () {
                      c.data = d(this).val();
                      if (d.isArray(c.data))c.data = c.data.join(",");
                      a.onchange()
                    });
                    setTimeout(function () {
                      c.data = d(q).val();
                      a.onchange()
                    }, 0)
                  }
                });
                for (e = n = 0; e < a.p.columns.length; e++) {
                  m = typeof a.p.columns[e].search === "undefined" ? true : a.p.columns[e].search;
                  var A = a.p.columns[e].hidden === true;
                  if (a.p.columns[e].searchoptions.searchhidden === true && m || m && !A) {
                    m = "";
                    if (c.field === a.p.columns[e].name) {
                      m = " selected='selected'";
                      n = e
                    }
                    l += "<option value='" + a.p.columns[e].name + "'" + m + ">" + a.p.columns[e].label + "</option>"
                  }
                }
                r.append(l);
                l = d("<td class='operators'></td>");
                b.append(l);
                h = o.columns[n];
                h.searchoptions.id = d.jgrid.randId();
                if (v && h.inputtype === "text")if (!h.searchoptions.size)h.searchoptions.size = 10;
                n = d.jgrid.createEl(h.inputtype, h.searchoptions, c.data, true, a.p.ajaxSelectOptions, true);
                var s = d("<select class='selectopts'></select>");
                l.append(s);
                s.bind("change", function () {
                  c.op = d(s).val();
                  j = d(this).parents("tr:first");
                  var q = d(".input-elm", j)[0];
                  if (c.op === "nu" || c.op === "nn") {
                    c.data = "";
                    q.value = "";
                    q.setAttribute("readonly", "true");
                    q.setAttribute("disabled", "true")
                  } else {
                    q.removeAttribute("readonly");
                    q.removeAttribute("disabled")
                  }
                  a.onchange()
                });
                g = h.searchoptions.sopt ? h.searchoptions.sopt : a.p.sopt ? a.p.sopt : h.searchtype === "string" ? o.stropts : a.p.numopts;
                l = "";
                for (e = 0; e < a.p.ops.length; e++)if (d.inArray(a.p.ops[e].name, g) !== -1) {
                  m = c.op === a.p.ops[e].name ? " selected='selected'" : "";
                  l += "<option value='" + a.p.ops[e].name + "'" + m + ">" + a.p.ops[e].description + "</option>"
                }
                s.append(l);
                l = d("<td class='data'></td>");
                b.append(l);
                l.append(n);
                d(n).addClass("input-elm").bind("change", function () {
                  c.data = d(this).val();
                  if (d.isArray(c.data))c.data =
                    c.data.join(",");
                  a.onchange()
                });
                l = d("<td></td>");
                b.append(l);
                n = d("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>");
                l.append(n);
                n.bind("click", function () {
                  for (e = 0; e < f.rules.length; e++)if (f.rules[e] === c) {
                    f.rules.splice(e, 1);
                    break
                  }
                  a.reDraw();
                  a.onchange();
                  return false
                });
                return b
              };
              this.getStringForGroup = function (c) {
                var f = "(", a;
                if (c.groups !== undefined)for (a = 0; a < c.groups.length; a++) {
                  if (f.length > 1)f += " " + c.groupOp + " ";
                  try {
                    f += this.getStringForGroup(c.groups[a])
                  } catch (b) {
                    alert(b)
                  }
                }
                if (c.rules !==
                  undefined)try {
                  for (a = 0; a < c.rules.length; a++) {
                    if (f.length > 1)f += " " + c.groupOp + " ";
                    f += this.getStringForRule(c.rules[a])
                  }
                } catch (e) {
                  alert(e)
                }
                f += ")";
                return f === "()" ? "" : f
              };
              this.getStringForRule = function (c) {
                var f = "", a = "", b, e;
                for (b = 0; b < this.p.ops.length; b++)if (this.p.ops[b].name === c.op) {
                  f = this.p.ops[b].operator;
                  a = this.p.ops[b].name;
                  break
                }
                for (b = 0; b < this.p.columns.length; b++)if (this.p.columns[b].name === c.field) {
                  e = this.p.columns[b];
                  break
                }
                b = c.data;
                if (a === "bw" || a === "bn")b += "%";
                if (a === "ew" || a === "en")b = "%" + b;
                if (a ===
                  "cn" || a === "nc")b = "%" + b + "%";
                if (a === "in" || a === "ni")b = " (" + b + ")";
                o.errorcheck && w(c.data, e);
                return d.inArray(e.searchtype, ["int", "integer", "float", "number", "currency"]) !== -1 || a === "nn" || a === "nu" ? c.field + " " + f + " " + b : c.field + " " + f + ' "' + b + '"'
              };
              this.resetFilter = function () {
                this.p.filter = d.extend(true, {}, this.p.initFilter);
                this.reDraw();
                this.onchange()
              };
              this.hideError = function () {
                d("th.ui-state-error", this).html("");
                d("tr.error", this).hide()
              };
              this.showError = function () {
                d("th.ui-state-error", this).html(this.p.errmsg);
                d("tr.error", this).show()
              };
              this.toUserFriendlyString = function () {
                return this.getStringForGroup(o.filter)
              };
              this.toString = function () {
                function c(a) {
                  var b = "(", e;
                  if (a.groups !== undefined)for (e = 0; e < a.groups.length; e++) {
                    if (b.length > 1)b += a.groupOp === "OR" ? " || " : " && ";
                    b += c(a.groups[e])
                  }
                  if (a.rules !== undefined)for (e = 0; e < a.rules.length; e++) {
                    if (b.length > 1)b += a.groupOp === "OR" ? " || " : " && ";
                    var g = a.rules[e];
                    if (f.p.errorcheck) {
                      var j = void 0, h = void 0;
                      for (j = 0; j < f.p.columns.length; j++)if (f.p.columns[j].name === g.field) {
                        h =
                          f.p.columns[j];
                        break
                      }
                      h && w(g.data, h)
                    }
                    b += g.op + "(item." + g.field + ",'" + g.data + "')"
                  }
                  b += ")";
                  return b === "()" ? "" : b
                }

                var f = this;
                return c(this.p.filter)
              };
              this.reDraw();
              if (this.p.showQuery)this.onchange();
              this.filter = true
            }
          }
        })
      };
      d.extend(d.fn.jqFilter, {toSQLString:function () {
        var k = "";
        this.each(function () {
          k = this.toUserFriendlyString()
        });
        return k
      }, filterData:function () {
        var k;
        this.each(function () {
          k = this.p.filter
        });
        return k
      }, getParameter:function (k) {
        if (k !== undefined)if (this.p.hasOwnProperty(k))return this.p[k];
        return this.p
      },
        resetFilter:function () {
          return this.each(function () {
            this.resetFilter()
          })
        }, addFilter:function (k) {
          if (typeof k === "string")k = jQuery.jgrid.parse(k);
          this.each(function () {
            this.p.filter = k;
            this.reDraw();
            this.onchange()
          })
        }})
    })(jQuery);
    (function (a) {
      a.jgrid.extend({editRow:function (e, x, l, r, t, y, u, j, s) {
        var f = {keys:x || false, oneditfunc:l || null, successfunc:r || null, url:t || null, extraparam:y || {}, aftersavefunc:u || null, errorfunc:j || null, afterrestorefunc:s || null, restoreAfterErorr:true}, o = a.makeArray(arguments).slice(1), b;
        b = o[0] && typeof o[0] == "object" && !a.isFunction(o[0]) ? a.extend(f, o[0]) : f;
        return this.each(function () {
          var d = this, c, m, v = 0, q = null, p = {}, k, g;
          if (d.grid) {
            k = a(d).jqGrid("getInd", e, true);
            if (k !== false)if ((a(k).attr("editable") || "0") == "0" && !a(k).hasClass("not-editable-row")) {
              g = d.p.colModel;
              a("td", k).each(function (h) {
                c = g[h].name;
                var A = d.p.treeGrid === true && c == d.p.ExpandColumn;
                if (A)m = a("span:first", this).html(); else try {
                  m = a.unformat(this, {rowId:e, colModel:g[h]}, h)
                } catch (n) {
                  m = a(this).html()
                }
                if (c != "cb" && c != "subgrid" && c != "rn") {
                  if (d.p.autoencode)m = a.jgrid.htmlDecode(m);
                  p[c] = m;
                  if (g[h].editable === true) {
                    if (q === null)q = h;
                    A ? a("span:first", this).html("") : a(this).html("");
                    var i = a.extend({}, g[h].editoptions || {}, {id:e + "_" + c, name:c});
                    if (!g[h].edittype)g[h].edittype =
                      "text";
                    i = a.jgrid.createEl(g[h].edittype, i, m, true, a.extend({}, a.jgrid.ajaxOptions, d.p.ajaxSelectOptions || {}));
                    a(i).addClass("editable");
                    A ? a("span:first", this).append(i) : a(this).append(i);
                    g[h].edittype == "select" && g[h].editoptions.multiple === true && a.browser.msie && a(i).width(a(i).width());
                    v++
                  }
                }
              });
              if (v > 0) {
                p.id = e;
                d.p.savedRow.push(p);
                a(k).attr("editable", "1");
                a("td:eq(" + q + ") input", k).focus();
                b.keys === true && a(k).bind("keydown", function (h) {
                  h.keyCode === 27 && a(d).jqGrid("restoreRow", e, s);
                  if (h.keyCode === 13) {
                    if (h.target.tagName ==
                      "TEXTAREA")return true;
                    a(d).jqGrid("saveRow", e, b);
                    return false
                  }
                  h.stopPropagation()
                });
                a.isFunction(b.oneditfunc) && b.oneditfunc.call(d, e)
              }
            }
          }
        })
      }, saveRow:function (e, x, l, r, t, y, u) {
        var j = {successfunc:x || null, url:l || null, extraparam:r || {}, aftersavefunc:t || null, errorfunc:y || null, afterrestorefunc:u || null, restoreAfterErorr:true}, s = a.makeArray(arguments).slice(1), f;
        f = s[0] && typeof s[0] == "object" && !a.isFunction(s[0]) ? a.extend(j, s[0]) : j;
        var o = false, b = this[0], d, c = {}, m = {}, v = {}, q, p, k;
        if (!b.grid)return o;
        k = a(b).jqGrid("getInd",
          e, true);
        if (k === false)return o;
        j = a(k).attr("editable");
        f.url = f.url ? f.url : b.p.editurl;
        if (j === "1") {
          var g;
          a("td", k).each(function (n) {
            g = b.p.colModel[n];
            d = g.name;
            if (d != "cb" && d != "subgrid" && g.editable === true && d != "rn" && !a(this).hasClass("not-editable-cell")) {
              switch (g.edittype) {
                case "checkbox":
                  var i = ["Yes", "No"];
                  if (g.editoptions)i = g.editoptions.value.split(":");
                  c[d] = a("input", this).attr("checked") ? i[0] : i[1];
                  break;
                case "text":
                case "password":
                case "textarea":
                case "button":
                  c[d] = a("input, textarea", this).val();
                  break;
                case "select":
                  if (g.editoptions.multiple) {
                    i = a("select", this);
                    var w = [];
                    c[d] = a(i).val();
                    c[d] = c[d] ? c[d].join(",") : "";
                    a("select > option:selected", this).each(function (B, C) {
                      w[B] = a(C).text()
                    });
                    m[d] = w.join(",")
                  } else {
                    c[d] = a("select>option:selected", this).val();
                    m[d] = a("select>option:selected", this).text()
                  }
                  if (g.formatter && g.formatter == "select")m = {};
                  break;
                case "custom":
                  try {
                    if (g.editoptions && a.isFunction(g.editoptions.custom_value)) {
                      c[d] = g.editoptions.custom_value.call(b, a(".customelement", this), "get");
                      if (c[d] === undefined)throw"e2";
                    } else throw"e1";
                  } catch (z) {
                    z == "e1" && a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose);
                    z == "e2" ? a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : a.jgrid.info_dialog(jQuery.jgrid.errors.errcap, z.message, jQuery.jgrid.edit.bClose)
                  }
              }
              p = a.jgrid.checkValues(c[d], n, b);
              if (p[0] === false) {
                p[1] = c[d] + " " + p[1];
                return false
              }
              if (b.p.autoencode)c[d] =
                a.jgrid.htmlEncode(c[d]);
              if (f.url !== "clientArray" && g.editoptions && g.editoptions.NullIfEmpty === true)if (c[d] == "")v[d] = "null"
            }
          });
          if (p[0] === false) {
            try {
              var h = a.jgrid.findPos(a("#" + a.jgrid.jqID(e), b.grid.bDiv)[0]);
              a.jgrid.info_dialog(a.jgrid.errors.errcap, p[1], a.jgrid.edit.bClose, {left:h[0], top:h[1]})
            } catch (A) {
              alert(p[1])
            }
            return o
          }
          if (c) {
            j = b.p.prmNames;
            s = j.oper;
            h = j.id;
            c[s] = j.editoper;
            c[h] = e;
            if (typeof b.p.inlineData == "undefined")b.p.inlineData = {};
            c = a.extend({}, c, b.p.inlineData, f.extraparam)
          }
          if (f.url == "clientArray") {
            c =
              a.extend({}, c, m);
            b.p.autoencode && a.each(c, function (n, i) {
              c[n] = a.jgrid.htmlDecode(i)
            });
            h = a(b).jqGrid("setRowData", e, c);
            a(k).attr("editable", "0");
            for (j = 0; j < b.p.savedRow.length; j++)if (b.p.savedRow[j].id == e) {
              q = j;
              break
            }
            q >= 0 && b.p.savedRow.splice(q, 1);
            a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(b, e, h);
            o = true
          } else {
            a("#lui_" + b.p.id).show();
            v = a.extend({}, c, v);
            a.ajax(a.extend({url:f.url, data:a.isFunction(b.p.serializeRowData) ? b.p.serializeRowData.call(b, v) : v, type:"POST", async:false, complete:function (n, i) {
              a("#lui_" + b.p.id).hide();
              if (i === "success")if ((a.isFunction(f.succesfunc) ? f.succesfunc.call(b, n) : true) === true) {
                b.p.autoencode && a.each(c, function (z, B) {
                  c[z] = a.jgrid.htmlDecode(B)
                });
                c = a.extend({}, c, m);
                a(b).jqGrid("setRowData", e, c);
                a(k).attr("editable", "0");
                for (var w = 0; w < b.p.savedRow.length; w++)if (b.p.savedRow[w].id == e) {
                  q = w;
                  break
                }
                q >= 0 && b.p.savedRow.splice(q, 1);
                a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(b, e, n);
                o = true
              } else {
                a.isFunction(f.errorfunc) && f.errorfunc.call(b, e, n, i);
                f.restoreAfterError ===
                  true && a(b).jqGrid("restoreRow", e, f.afterrestorefunc)
              }
            }, error:function (n, i) {
              a("#lui_" + b.p.id).hide();
              if (a.isFunction(f.errorfunc))f.errorfunc.call(b, e, n, i); else try {
                jQuery.jgrid.info_dialog(jQuery.jgrid.errors.errcap, '<div class="ui-state-error">' + n.responseText + "</div>", jQuery.jgrid.edit.bClose, {buttonalign:"right"})
              } catch (w) {
                alert(n.responseText)
              }
              f.restoreAfterError === true && a(b).jqGrid("restoreRow", e, f.afterrestorefunc)
            }}, a.jgrid.ajaxOptions, b.p.ajaxRowOptions || {}))
          }
          a(k).unbind("keydown")
        }
        return o
      },
        restoreRow:function (e, x) {
          return this.each(function () {
            var l = this, r, t, y = {};
            if (l.grid) {
              t = a(l).jqGrid("getInd", e, true);
              if (t !== false) {
                for (var u = 0; u < l.p.savedRow.length; u++)if (l.p.savedRow[u].id == e) {
                  r = u;
                  break
                }
                if (r >= 0) {
                  if (a.isFunction(a.fn.datepicker))try {
                    a("input.hasDatepicker", "#" + a.jgrid.jqID(t.id)).datepicker("hide")
                  } catch (j) {
                  }
                  a.each(l.p.colModel, function () {
                    if (this.editable === true && this.name in l.p.savedRow[r] && !a(this).hasClass("not-editable-cell"))y[this.name] = l.p.savedRow[r][this.name]
                  });
                  a(l).jqGrid("setRowData",
                    e, y);
                  a(t).attr("editable", "0").unbind("keydown");
                  l.p.savedRow.splice(r, 1)
                }
                a.isFunction(x) && x.call(l, e)
              }
            }
          })
        }})
    })(jQuery);
    (function (b) {
      b.jgrid.extend({editCell:function (d, e, a) {
        return this.each(function () {
          var c = this, h, f, g;
          if (!(!c.grid || c.p.cellEdit !== true)) {
            e = parseInt(e, 10);
            c.p.selrow = c.rows[d].id;
            c.p.knv || b(c).jqGrid("GridNav");
            if (c.p.savedRow.length > 0) {
              if (a === true)if (d == c.p.iRow && e == c.p.iCol)return;
              b(c).jqGrid("saveCell", c.p.savedRow[0].id, c.p.savedRow[0].ic)
            } else window.setTimeout(function () {
              b("#" + c.p.knv).attr("tabindex", "-1").focus()
            }, 0);
            h = c.p.colModel[e].name;
            if (!(h == "subgrid" || h == "cb" || h == "rn")) {
              g = b("td:eq(" + e +
                ")", c.rows[d]);
              if (c.p.colModel[e].editable === true && a === true && !g.hasClass("not-editable-cell")) {
                if (parseInt(c.p.iCol, 10) >= 0 && parseInt(c.p.iRow, 10) >= 0) {
                  b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight");
                  b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")
                }
                b(g).addClass("edit-cell ui-state-highlight");
                b(c.rows[d]).addClass("selected-row ui-state-hover");
                try {
                  f = b.unformat(g, {rowId:c.rows[d].id, colModel:c.p.colModel[e]}, e)
                } catch (k) {
                  f = b(g).html()
                }
                if (c.p.autoencode)f =
                  b.jgrid.htmlDecode(f);
                if (!c.p.colModel[e].edittype)c.p.colModel[e].edittype = "text";
                c.p.savedRow.push({id:d, ic:e, name:h, v:f});
                if (b.isFunction(c.p.formatCell)) {
                  var j = c.p.formatCell.call(c, c.rows[d].id, h, f, d, e);
                  if (j !== undefined)f = j
                }
                j = b.extend({}, c.p.colModel[e].editoptions || {}, {id:d + "_" + h, name:h});
                var i = b.jgrid.createEl(c.p.colModel[e].edittype, j, f, true, b.extend({}, b.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                b.isFunction(c.p.beforeEditCell) && c.p.beforeEditCell.call(c, c.rows[d].id, h, f, d, e);
                b(g).html("").append(i).attr("tabindex",
                  "0");
                window.setTimeout(function () {
                  b(i).focus()
                }, 0);
                b("input, select, textarea", g).bind("keydown", function (l) {
                  if (l.keyCode === 27)if (b("input.hasDatepicker", g).length > 0)b(".ui-datepicker").is(":hidden") ? b(c).jqGrid("restoreCell", d, e) : b("input.hasDatepicker", g).datepicker("hide"); else b(c).jqGrid("restoreCell", d, e);
                  l.keyCode === 13 && b(c).jqGrid("saveCell", d, e);
                  if (l.keyCode == 9)if (c.grid.hDiv.loading)return false; else l.shiftKey ? b(c).jqGrid("prevCell", d, e) : b(c).jqGrid("nextCell", d, e);
                  l.stopPropagation()
                });
                b.isFunction(c.p.afterEditCell) && c.p.afterEditCell.call(c, c.rows[d].id, h, f, d, e)
              } else {
                if (parseInt(c.p.iCol, 10) >= 0 && parseInt(c.p.iRow, 10) >= 0) {
                  b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight");
                  b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")
                }
                g.addClass("edit-cell ui-state-highlight");
                b(c.rows[d]).addClass("selected-row ui-state-hover");
                if (b.isFunction(c.p.onSelectCell)) {
                  f = g.html().replace(/\&#160\;/ig, "");
                  c.p.onSelectCell.call(c, c.rows[d].id, h, f, d, e)
                }
              }
              c.p.iCol =
                e;
              c.p.iRow = d
            }
          }
        })
      }, saveCell:function (d, e) {
        return this.each(function () {
          var a = this, c;
          if (!(!a.grid || a.p.cellEdit !== true)) {
            c = a.p.savedRow.length >= 1 ? 0 : null;
            if (c !== null) {
              var h = b("td:eq(" + e + ")", a.rows[d]), f, g, k = a.p.colModel[e], j = k.name, i = b.jgrid.jqID(j);
              switch (k.edittype) {
                case "select":
                  if (k.editoptions.multiple) {
                    i = b("#" + d + "_" + i, a.rows[d]);
                    var l = [];
                    if (f = b(i).val())f.join(","); else f = "";
                    b("option:selected", i).each(function (o, p) {
                      l[o] = b(p).text()
                    });
                    g = l.join(",")
                  } else {
                    f = b("#" + d + "_" + i + ">option:selected", a.rows[d]).val();
                    g = b("#" + d + "_" + i + ">option:selected", a.rows[d]).text()
                  }
                  if (k.formatter)g = f;
                  break;
                case "checkbox":
                  var m = ["Yes", "No"];
                  if (k.editoptions)m = k.editoptions.value.split(":");
                  g = f = b("#" + d + "_" + i, a.rows[d]).attr("checked") ? m[0] : m[1];
                  break;
                case "password":
                case "text":
                case "textarea":
                case "button":
                  g = f = b("#" + d + "_" + i, a.rows[d]).val();
                  break;
                case "custom":
                  try {
                    if (k.editoptions && b.isFunction(k.editoptions.custom_value)) {
                      f = k.editoptions.custom_value.call(a, b(".customelement", h), "get");
                      if (f === undefined)throw"e2"; else g = f
                    } else throw"e1";
                  } catch (q) {
                    q == "e1" && b.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, jQuery.jgrid.edit.bClose);
                    q == "e2" ? b.jgrid.info_dialog(jQuery.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, jQuery.jgrid.edit.bClose) : b.jgrid.info_dialog(jQuery.jgrid.errors.errcap, q.message, jQuery.jgrid.edit.bClose)
                  }
              }
              if (g != a.p.savedRow[c].v) {
                if (b.isFunction(a.p.beforeSaveCell))if (c = a.p.beforeSaveCell.call(a, a.rows[d].id, j, f, d, e))g = f = c;
                var r = b.jgrid.checkValues(f,
                  e, a);
                if (r[0] === true) {
                  c = {};
                  if (b.isFunction(a.p.beforeSubmitCell))(c = a.p.beforeSubmitCell.call(a, a.rows[d].id, j, f, d, e)) || (c = {});
                  b("input.hasDatepicker", h).length > 0 && b("input.hasDatepicker", h).datepicker("hide");
                  if (a.p.cellsubmit == "remote")if (a.p.cellurl) {
                    var n = {};
                    if (a.p.autoencode)f = b.jgrid.htmlEncode(f);
                    n[j] = f;
                    m = a.p.prmNames;
                    k = m.id;
                    i = m.oper;
                    n[k] = a.rows[d].id;
                    n[i] = m.editoper;
                    n = b.extend(c, n);
                    b("#lui_" + a.p.id).show();
                    a.grid.hDiv.loading = true;
                    b.ajax(b.extend({url:a.p.cellurl, data:b.isFunction(a.p.serializeCellData) ?
                      a.p.serializeCellData.call(a, n) : n, type:"POST", complete:function (o, p) {
                      b("#lui_" + a.p.id).hide();
                      a.grid.hDiv.loading = false;
                      if (p == "success")if (b.isFunction(a.p.afterSubmitCell)) {
                        var s = a.p.afterSubmitCell.call(a, o, n.id, j, f, d, e);
                        if (s[0] === true) {
                          b(h).empty();
                          b(a).jqGrid("setCell", a.rows[d].id, e, g, false, false, true);
                          b(h).addClass("dirty-cell");
                          b(a.rows[d]).addClass("edited");
                          b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, j, f, d, e);
                          a.p.savedRow.splice(0, 1)
                        } else {
                          b.jgrid.info_dialog(b.jgrid.errors.errcap,
                            s[1], b.jgrid.edit.bClose);
                          b(a).jqGrid("restoreCell", d, e)
                        }
                      } else {
                        b(h).empty();
                        b(a).jqGrid("setCell", a.rows[d].id, e, g, false, false, true);
                        b(h).addClass("dirty-cell");
                        b(a.rows[d]).addClass("edited");
                        b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, j, f, d, e);
                        a.p.savedRow.splice(0, 1)
                      }
                    }, error:function (o, p) {
                      b("#lui_" + a.p.id).hide();
                      a.grid.hDiv.loading = false;
                      b.isFunction(a.p.errorCell) ? a.p.errorCell.call(a, o, p) : b.jgrid.info_dialog(b.jgrid.errors.errcap, o.status + " : " + o.statusText + "<br/>" +
                        p, b.jgrid.edit.bClose);
                      b(a).jqGrid("restoreCell", d, e)
                    }}, b.jgrid.ajaxOptions, a.p.ajaxCellOptions || {}))
                  } else try {
                    b.jgrid.info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl, b.jgrid.edit.bClose);
                    b(a).jqGrid("restoreCell", d, e)
                  } catch (t) {
                  }
                  if (a.p.cellsubmit == "clientArray") {
                    b(h).empty();
                    b(a).jqGrid("setCell", a.rows[d].id, e, g, false, false, true);
                    b(h).addClass("dirty-cell");
                    b(a.rows[d]).addClass("edited");
                    b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, j, f, d, e);
                    a.p.savedRow.splice(0,
                      1)
                  }
                } else try {
                  window.setTimeout(function () {
                    b.jgrid.info_dialog(b.jgrid.errors.errcap, f + " " + r[1], b.jgrid.edit.bClose)
                  }, 100);
                  b(a).jqGrid("restoreCell", d, e)
                } catch (u) {
                }
              } else b(a).jqGrid("restoreCell", d, e)
            }
            b.browser.opera ? b("#" + a.p.knv).attr("tabindex", "-1").focus() : window.setTimeout(function () {
              b("#" + a.p.knv).attr("tabindex", "-1").focus()
            }, 0)
          }
        })
      }, restoreCell:function (d, e) {
        return this.each(function () {
          var a = this, c;
          if (!(!a.grid || a.p.cellEdit !== true)) {
            c = a.p.savedRow.length >= 1 ? 0 : null;
            if (c !== null) {
              var h = b("td:eq(" +
                e + ")", a.rows[d]);
              if (b.isFunction(b.fn.datepicker))try {
                b("input.hasDatepicker", h).datepicker("hide")
              } catch (f) {
              }
              b(h).empty().attr("tabindex", "-1");
              b(a).jqGrid("setCell", a.rows[d].id, e, a.p.savedRow[c].v, false, false, true);
              b.isFunction(a.p.afterRestoreCell) && a.p.afterRestoreCell.call(a, a.rows[d].id, a.p.savedRow[c].v, d, e);
              a.p.savedRow.splice(0, 1)
            }
            window.setTimeout(function () {
              b("#" + a.p.knv).attr("tabindex", "-1").focus()
            }, 0)
          }
        })
      }, nextCell:function (d, e) {
        return this.each(function () {
          var a = false;
          if (!(!this.grid ||
            this.p.cellEdit !== true)) {
            for (var c = e + 1; c < this.p.colModel.length; c++)if (this.p.colModel[c].editable === true) {
              a = c;
              break
            }
            if (a !== false)b(this).jqGrid("editCell", d, a, true); else this.p.savedRow.length > 0 && b(this).jqGrid("saveCell", d, e)
          }
        })
      }, prevCell:function (d, e) {
        return this.each(function () {
          var a = false;
          if (!(!this.grid || this.p.cellEdit !== true)) {
            for (var c = e - 1; c >= 0; c--)if (this.p.colModel[c].editable === true) {
              a = c;
              break
            }
            if (a !== false)b(this).jqGrid("editCell", d, a, true); else this.p.savedRow.length > 0 && b(this).jqGrid("saveCell",
              d, e)
          }
        })
      }, GridNav:function () {
        return this.each(function () {
          function d(g, k, j) {
            if (j.substr(0, 1) == "v") {
              var i = b(a.grid.bDiv)[0].clientHeight, l = b(a.grid.bDiv)[0].scrollTop, m = a.rows[g].offsetTop + a.rows[g].clientHeight, q = a.rows[g].offsetTop;
              if (j == "vd")if (m >= i)b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop + a.rows[g].clientHeight;
              if (j == "vu")if (q < l)b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop - a.rows[g].clientHeight
            }
            if (j == "h") {
              j = b(a.grid.bDiv)[0].clientWidth;
              i = b(a.grid.bDiv)[0].scrollLeft;
              l =
                a.rows[g].cells[k].offsetLeft;
              if (a.rows[g].cells[k].offsetLeft + a.rows[g].cells[k].clientWidth >= j + parseInt(i, 10))b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft + a.rows[g].cells[k].clientWidth; else if (l < i)b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft - a.rows[g].cells[k].clientWidth
            }
          }

          function e(g, k) {
            var j, i;
            if (k == "lft") {
              j = g + 1;
              for (i = g; i >= 0; i--)if (a.p.colModel[i].hidden !== true) {
                j = i;
                break
              }
            }
            if (k == "rgt") {
              j = g - 1;
              for (i = g; i < a.p.colModel.length; i++)if (a.p.colModel[i].hidden !== true) {
                j = i;
                break
              }
            }
            return j
          }

          var a = this;
          if (!(!a.grid || a.p.cellEdit !== true)) {
            a.p.knv = a.p.id + "_kn";
            var c = b("<span style='width:0px;height:0px;background-color:black;' tabindex='0'><span tabindex='-1' style='width:0px;height:0px;background-color:grey' id='" + a.p.knv + "'></span></span>"), h, f;
            b(c).insertBefore(a.grid.cDiv);
            b("#" + a.p.knv).focus().keydown(function (g) {
              f = g.keyCode;
              if (a.p.direction == "rtl")if (f == 37)f = 39; else if (f == 39)f = 37;
              switch (f) {
                case 38:
                  if (a.p.iRow - 1 > 0) {
                    d(a.p.iRow - 1, a.p.iCol, "vu");
                    b(a).jqGrid("editCell", a.p.iRow - 1, a.p.iCol,
                      false)
                  }
                  break;
                case 40:
                  if (a.p.iRow + 1 <= a.rows.length - 1) {
                    d(a.p.iRow + 1, a.p.iCol, "vd");
                    b(a).jqGrid("editCell", a.p.iRow + 1, a.p.iCol, false)
                  }
                  break;
                case 37:
                  if (a.p.iCol - 1 >= 0) {
                    h = e(a.p.iCol - 1, "lft");
                    d(a.p.iRow, h, "h");
                    b(a).jqGrid("editCell", a.p.iRow, h, false)
                  }
                  break;
                case 39:
                  if (a.p.iCol + 1 <= a.p.colModel.length - 1) {
                    h = e(a.p.iCol + 1, "rgt");
                    d(a.p.iRow, h, "h");
                    b(a).jqGrid("editCell", a.p.iRow, h, false)
                  }
                  break;
                case 13:
                  parseInt(a.p.iCol, 10) >= 0 && parseInt(a.p.iRow, 10) >= 0 && b(a).jqGrid("editCell", a.p.iRow, a.p.iCol, true)
              }
              return false
            })
          }
        })
      },
        getChangedCells:function (d) {
          var e = [];
          d || (d = "all");
          this.each(function () {
            var a = this, c;
            !a.grid || a.p.cellEdit !== true || b(a.rows).each(function (h) {
              var f = {};
              if (b(this).hasClass("edited")) {
                b("td", this).each(function (g) {
                  c = a.p.colModel[g].name;
                  if (c !== "cb" && c !== "subgrid")if (d == "dirty") {
                    if (b(this).hasClass("dirty-cell"))try {
                      f[c] = b.unformat(this, {rowId:a.rows[h].id, colModel:a.p.colModel[g]}, g)
                    } catch (k) {
                      f[c] = b.jgrid.htmlDecode(b(this).html())
                    }
                  } else try {
                    f[c] = b.unformat(this, {rowId:a.rows[h].id, colModel:a.p.colModel[g]},
                      g)
                  } catch (j) {
                    f[c] = b.jgrid.htmlDecode(b(this).html())
                  }
                });
                f.id = this.id;
                e.push(f)
              }
            })
          });
          return e
        }})
    })(jQuery);
    (function (b) {
      b.fn.jqm = function (a) {
        var f = {overlay:50, closeoverlay:true, overlayClass:"jqmOverlay", closeClass:"jqmClose", trigger:".jqModal", ajax:e, ajaxText:"", target:e, modal:e, toTop:e, onShow:e, onHide:e, onLoad:e};
        return this.each(function () {
          if (this._jqm)return j[this._jqm].c = b.extend({}, j[this._jqm].c, a);
          l++;
          this._jqm = l;
          j[l] = {c:b.extend(f, b.jqm.params, a), a:e, w:b(this).addClass("jqmID" + l), s:l};
          f.trigger && b(this).jqmAddTrigger(f.trigger)
        })
      };
      b.fn.jqmAddClose = function (a) {
        return o(this, a, "jqmHide")
      };
      b.fn.jqmAddTrigger =
        function (a) {
          return o(this, a, "jqmShow")
        };
      b.fn.jqmShow = function (a) {
        return this.each(function () {
          b.jqm.open(this._jqm, a)
        })
      };
      b.fn.jqmHide = function (a) {
        return this.each(function () {
          b.jqm.close(this._jqm, a)
        })
      };
      b.jqm = {hash:{}, open:function (a, f) {
        var c = j[a], d = c.c, i = "." + d.closeClass, g = parseInt(c.w.css("z-index"));
        g = g > 0 ? g : 3E3;
        var h = b("<div></div>").css({height:"100%", width:"100%", position:"fixed", left:0, top:0, "z-index":g - 1, opacity:d.overlay / 100});
        if (c.a)return e;
        c.t = f;
        c.a = true;
        c.w.css("z-index", g);
        if (d.modal) {
          k[0] ||
          setTimeout(function () {
            p("bind")
          }, 1);
          k.push(a)
        } else if (d.overlay > 0)d.closeoverlay && c.w.jqmAddClose(h); else h = e;
        c.o = h ? h.addClass(d.overlayClass).prependTo("body") : e;
        if (q) {
          b("html,body").css({height:"100%", width:"100%"});
          if (h) {
            h = h.css({position:"absolute"})[0];
            for (var m in{Top:1, Left:1})h.style.setExpression(m.toLowerCase(), "(_=(document.documentElement.scroll" + m + " || document.body.scroll" + m + "))+'px'")
          }
        }
        if (d.ajax) {
          g = d.target || c.w;
          h = d.ajax;
          g = typeof g == "string" ? b(g, c.w) : b(g);
          h = h.substr(0, 1) == "@" ? b(f).attr(h.substring(1)) :
            h;
          g.html(d.ajaxText).load(h, function () {
            d.onLoad && d.onLoad.call(this, c);
            i && c.w.jqmAddClose(b(i, c.w));
            r(c)
          })
        } else i && c.w.jqmAddClose(b(i, c.w));
        d.toTop && c.o && c.w.before('<span id="jqmP' + c.w[0]._jqm + '"></span>').insertAfter(c.o);
        d.onShow ? d.onShow(c) : c.w.show();
        r(c);
        return e
      }, close:function (a) {
        a = j[a];
        if (!a.a)return e;
        a.a = e;
        if (k[0]) {
          k.pop();
          k[0] || p("unbind")
        }
        a.c.toTop && a.o && b("#jqmP" + a.w[0]._jqm).after(a.w).remove();
        if (a.c.onHide)a.c.onHide(a); else {
          a.w.hide();
          a.o && a.o.remove()
        }
        return e
      }, params:{}};
      var l =
        0, j = b.jqm.hash, k = [], q = b.browser.msie && b.browser.version == "6.0", e = false, r = function (a) {
        var f = b('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({opacity:0});
        if (q)if (a.o)a.o.html('<p style="width:100%;height:100%"/>').prepend(f); else b("iframe.jqm", a.w)[0] || a.w.prepend(f);
        s(a)
      }, s = function (a) {
        try {
          b(":input:visible", a.w)[0].focus()
        } catch (f) {
        }
      }, p = function (a) {
        b(document)[a]("keypress", n)[a]("keydown", n)[a]("mousedown", n)
      }, n = function (a) {
        var f = j[k[k.length - 1]];
        (a = !b(a.target).parents(".jqmID" +
          f.s)[0]) && s(f);
        return!a
      }, o = function (a, f, c) {
        return a.each(function () {
          var d = this._jqm;
          b(f).each(function () {
            if (!this[c]) {
              this[c] = [];
              b(this).click(function () {
                for (var i in{jqmShow:1, jqmHide:1})for (var g in this[i])if (j[this[i][g]])j[this[i][g]].w[i](this);
                return e
              })
            }
            this[c].push(d)
          })
        })
      }
    })(jQuery);
    (function (b) {
      b.fn.jqDrag = function (a) {
        return l(this, a, "d")
      };
      b.fn.jqResize = function (a, e) {
        return l(this, a, "r", e)
      };
      b.jqDnR = {dnr:{}, e:0, drag:function (a) {
        if (c.k == "d")d.css({left:c.X + a.pageX - c.pX, top:c.Y + a.pageY - c.pY}); else {
          d.css({width:Math.max(a.pageX - c.pX + c.W, 0), height:Math.max(a.pageY - c.pY + c.H, 0)});
          M1 && f.css({width:Math.max(a.pageX - M1.pX + M1.W, 0), height:Math.max(a.pageY - M1.pY + M1.H, 0)})
        }
        return false
      }, stop:function () {
        b(document).unbind("mousemove", i.drag).unbind("mouseup", i.stop)
      }};
      var i = b.jqDnR, c = i.dnr,
        d = i.e, f, l = function (a, e, n, m) {
          return a.each(function () {
            e = e ? b(e, a) : a;
            e.bind("mousedown", {e:a, k:n}, function (g) {
              var j = g.data, h = {};
              d = j.e;
              f = m ? b(m) : false;
              if (d.css("position") != "relative")try {
                d.position(h)
              } catch (o) {
              }
              c = {X:h.left || k("left") || 0, Y:h.top || k("top") || 0, W:k("width") || d[0].scrollWidth || 0, H:k("height") || d[0].scrollHeight || 0, pX:g.pageX, pY:g.pageY, k:j.k};
              M1 = f && j.k != "d" ? {X:h.left || f1("left") || 0, Y:h.top || f1("top") || 0, W:f[0].offsetWidth || f1("width") || 0, H:f[0].offsetHeight || f1("height") || 0, pX:g.pageX, pY:g.pageY,
                k:j.k} : false;
              if (b("input.hasDatepicker", d[0])[0])try {
                b("input.hasDatepicker", d[0]).datepicker("hide")
              } catch (p) {
              }
              b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop);
              return false
            })
          })
        }, k = function (a) {
          return parseInt(d.css(a)) || false
        };
      f1 = function (a) {
        return parseInt(f.css(a)) || false
      }
    })(jQuery);
    (function (b) {
      b.jgrid.extend({setSubGrid:function () {
        return this.each(function () {
          var f;
          this.p.subGridOptions = b.extend({plusicon:"ui-icon-plus", minusicon:"ui-icon-minus", openicon:"ui-icon-carat-1-sw", expandOnLoad:false, delayOnLoad:50, selectOnExpand:false, reloadOnExpand:true}, this.p.subGridOptions || {});
          this.p.colNames.unshift("");
          this.p.colModel.unshift({name:"subgrid", width:b.browser.safari ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth, sortable:false, resizable:false, hidedlg:true, search:false,
            fixed:true});
          f = this.p.subGridModel;
          if (f[0]) {
            f[0].align = b.extend([], f[0].align || []);
            for (var a = 0; a < f[0].name.length; a++)f[0].align[a] = f[0].align[a] || "left"
          }
        })
      }, addSubGridCell:function (f, a) {
        var j = "", q, r;
        this.each(function () {
          j = this.formatCol(f, a);
          r = this.p.id;
          q = this.p.subGridOptions.plusicon
        });
        return'<td role="grid" aria-describedby="' + r + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + j + "><a href='javascript:void(0);'><span class='ui-icon " + q + "'></span></a></td>"
      }, addSubGrid:function (f) {
        return this.each(function () {
          var a =
            this;
          if (a.grid) {
            var j = function (i, d, e) {
              d = b("<td align='" + a.p.subGridModel[0].align[e] + "'></td>").html(d);
              b(i).append(d)
            }, q = function (i, d) {
              var e, c, g, k = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), h = b("<tr></tr>");
              for (c = 0; c < a.p.subGridModel[0].name.length; c++) {
                e = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>");
                b(e).html(a.p.subGridModel[0].name[c]);
                b(e).width(a.p.subGridModel[0].width[c]);
                b(h).append(e)
              }
              b(k).append(h);
              if (i) {
                g =
                  a.p.xmlReader.subgrid;
                b(g.root + " " + g.row, i).each(function () {
                  h = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                  if (g.repeatitems === true)b(g.cell, this).each(function (m) {
                    j(h, b(this).text() || "&#160;", m)
                  }); else {
                    var n = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                    if (n)for (c = 0; c < n.length; c++)j(h, b(n[c], this).text() || "&#160;", c)
                  }
                  b(k).append(h)
                })
              }
              e = b("table:first", a.grid.bDiv).attr("id") + "_";
              b("#" + e + d).append(k);
              a.grid.hDiv.loading = false;
              b("#load_" + a.p.id).hide();
              return false
            }, r = function (i, d) {
              var e,
                c, g, k, h, n = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), m = b("<tr></tr>");
              for (c = 0; c < a.p.subGridModel[0].name.length; c++) {
                e = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>");
                b(e).html(a.p.subGridModel[0].name[c]);
                b(e).width(a.p.subGridModel[0].width[c]);
                b(m).append(e)
              }
              b(n).append(m);
              if (i) {
                k = a.p.jsonReader.subgrid;
                e = i[k.root];
                if (typeof e !== "undefined")for (c = 0; c < e.length; c++) {
                  g = e[c];
                  m = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                  if (k.repeatitems === true) {
                    if (k.cell)g = g[k.cell];
                    for (h = 0; h < g.length; h++)j(m, g[h] || "&#160;", h)
                  } else {
                    var t = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                    if (t.length)for (h = 0; h < t.length; h++)j(m, g[t[h]] || "&#160;", h)
                  }
                  b(n).append(m)
                }
              }
              c = b("table:first", a.grid.bDiv).attr("id") + "_";
              b("#" + c + d).append(n);
              a.grid.hDiv.loading = false;
              b("#load_" + a.p.id).hide();
              return false
            }, w = function (i) {
              var d, e, c, g;
              d = b(i).attr("id");
              e = {nd_:(new Date).getTime()};
              e[a.p.prmNames.subgridid] = d;
              if (!a.p.subGridModel[0])return false;
              if (a.p.subGridModel[0].params)for (g = 0; g < a.p.subGridModel[0].params.length; g++)for (c = 0; c < a.p.colModel.length; c++)if (a.p.colModel[c].name == a.p.subGridModel[0].params[g])e[a.p.colModel[c].name] = b("td:eq(" + c + ")", i).text().replace(/\&#160\;/ig, "");
              if (!a.grid.hDiv.loading) {
                a.grid.hDiv.loading = true;
                b("#load_" + a.p.id).show();
                if (!a.p.subgridtype)a.p.subgridtype = a.p.datatype;
                if (b.isFunction(a.p.subgridtype))a.p.subgridtype.call(a, e); else a.p.subgridtype = a.p.subgridtype.toLowerCase();
                switch (a.p.subgridtype) {
                  case "xml":
                  case "json":
                    b.ajax(b.extend({type:a.p.mtype,
                      url:a.p.subGridUrl, dataType:a.p.subgridtype, data:b.isFunction(a.p.serializeSubGridData) ? a.p.serializeSubGridData.call(a, e) : e, complete:function (k) {
                        a.p.subgridtype == "xml" ? q(k.responseXML, d) : r(b.jgrid.parse(k.responseText), d)
                      }}, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
                }
              }
              return false
            }, l, s, u, v = 0, o, p;
            b.each(a.p.colModel, function () {
              if (this.hidden === true || this.name == "rn" || this.name == "cb")v++
            });
            b(a.rows).each(function (i) {
              var d = this;
              if (b(d).hasClass("jqgrow")) {
                b(this.cells[f]).bind("click", function () {
                  p =
                    d.nextSibling;
                  if (b(this).hasClass("sgcollapsed")) {
                    s = a.p.id;
                    l = d.id;
                    if (a.p.subGridOptions.reloadOnExpand === true || a.p.subGridOptions.reloadOnExpand === false && !b(p).hasClass("ui-subgrid")) {
                      u = f >= 1 ? "<td colspan='" + f + "'>&#160;</td>" : "";
                      o = true;
                      if (b.isFunction(a.p.subGridBeforeExpand))o = a.p.subGridBeforeExpand.call(a, s + "_" + l, l);
                      if (o === false)return false;
                      b(d).after("<tr role='row' class='ui-subgrid'>" + u + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" +
                        parseInt(a.p.colNames.length - 1 - v, 10) + "' class='ui-widget-content subgrid-data'><div id=" + s + "_" + l + " class='tablediv'></div></td></tr>");
                      b.isFunction(a.p.subGridRowExpanded) ? a.p.subGridRowExpanded.call(a, s + "_" + l, l) : w(d)
                    } else b(p).show();
                    b(this).html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.minusicon + "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                    a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", l)
                  } else if (b(this).hasClass("sgexpanded")) {
                    o =
                      true;
                    if (b.isFunction(a.p.subGridRowColapsed)) {
                      l = d.id;
                      o = a.p.subGridRowColapsed.call(a, s + "_" + l, l)
                    }
                    if (o === false)return false;
                    if (a.p.subGridOptions.reloadOnExpand === true)b(p).remove(".ui-subgrid"); else b(p).hasClass("ui-subgrid") && b(p).hide();
                    b(this).html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
                  }
                  return false
                });
                a.p.subGridOptions.expandOnLoad === true && setTimeout(function () {
                    b(d.cells[f]).trigger("click")
                  },
                  i * a.p.subGridOptions.delayOnLoad)
              }
            });
            a.subGridXml = function (i, d) {
              q(i, d)
            };
            a.subGridJson = function (i, d) {
              r(i, d)
            }
          }
        })
      }, expandSubGridRow:function (f) {
        return this.each(function () {
          if (this.grid || f)if (this.p.subGrid === true) {
            var a = b(this).jqGrid("getInd", f, true);
            if (a)(a = b("td.sgcollapsed", a)[0]) && b(a).trigger("click")
          }
        })
      }, collapseSubGridRow:function (f) {
        return this.each(function () {
          if (this.grid || f)if (this.p.subGrid === true) {
            var a = b(this).jqGrid("getInd", f, true);
            if (a)(a = b("td.sgexpanded", a)[0]) && b(a).trigger("click")
          }
        })
      },
        toggleSubGridRow:function (f) {
          return this.each(function () {
            if (this.grid || f)if (this.p.subGrid === true) {
              var a = b(this).jqGrid("getInd", f, true);
              if (a) {
                var j = b("td.sgcollapsed", a)[0];
                if (j)b(j).trigger("click"); else(j = b("td.sgexpanded", a)[0]) && b(j).trigger("click")
              }
            }
          })
        }})
    })(jQuery);
    (function (e) {
      e.jgrid.extend({groupingSetup:function () {
        return this.each(function () {
          var a = this.p.groupingView;
          if (a !== null && (typeof a === "object" || e.isFunction(a)))if (a.groupField.length) {
            if (typeof a.visibiltyOnNextGrouping == "undefined")a.visibiltyOnNextGrouping = [];
            for (var b = 0; b < a.groupField.length; b++) {
              a.groupOrder[b] || (a.groupOrder[b] = "asc");
              a.groupText[b] || (a.groupText[b] = "{0}");
              if (typeof a.groupColumnShow[b] != "boolean")a.groupColumnShow[b] = true;
              if (typeof a.groupSummary[b] != "boolean")a.groupSummary[b] =
                false;
              if (a.groupColumnShow[b] === true) {
                a.visibiltyOnNextGrouping[b] = true;
                e(this).jqGrid("showCol", a.groupField[b])
              } else {
                a.visibiltyOnNextGrouping[b] = e("#" + this.p.id + "_" + a.groupField[b]).is(":visible");
                e(this).jqGrid("hideCol", a.groupField[b])
              }
              a.sortitems[b] = [];
              a.sortnames[b] = [];
              a.summaryval[b] = [];
              if (a.groupSummary[b]) {
                a.summary[b] = [];
                for (var c = this.p.colModel, d = 0, g = c.length; d < g; d++)c[d].summaryType && a.summary[b].push({nm:c[d].name, st:c[d].summaryType, v:""})
              }
            }
            this.p.scroll = false;
            this.p.rownumbers = false;
            this.p.subGrid = false;
            this.p.treeGrid = false;
            this.p.gridview = true
          } else this.p.grouping = false; else this.p.grouping = false
        })
      }, groupingPrepare:function (a, b, c, d) {
        this.each(function () {
          b[0] += "";
          var g = b[0].toString().split(" ").join(""), h = this.p.groupingView, f = this;
          if (c.hasOwnProperty(g))c[g].push(a); else {
            c[g] = [];
            c[g].push(a);
            h.sortitems[0].push(g);
            h.sortnames[0].push(e.trim(b[0].toString()));
            h.summaryval[0][g] = e.extend(true, [], h.summary[0])
          }
          h.groupSummary[0] && e.each(h.summaryval[0][g], function () {
            this.v = e.isFunction(this.st) ?
              this.st.call(f, this.v, this.nm, d) : e(f).jqGrid("groupingCalculations." + this.st, this.v, this.nm, d)
          })
        });
        return c
      }, groupingToggle:function (a) {
        this.each(function () {
          var b = this.p.groupingView, c = a.lastIndexOf("_"), d = a.substring(0, c + 1);
          c = parseInt(a.substring(c + 1), 10) + 1;
          var g = b.minusicon, h = b.plusicon, f = e("#" + a)[0].nextSibling, k = e("#" + a + " span.tree-wrap-" + this.p.direction), l = false;
          if (k.hasClass(g)) {
            if (b.showSummaryOnHide && b.groupSummary[0]) {
              if (f)for (; f;) {
                if (e(f).hasClass("jqfoot"))break;
                e(f).hide();
                f = f.nextSibling
              }
            } else if (f)for (; f;) {
              if (e(f).attr("id") ==
                d + String(c))break;
              e(f).hide();
              f = f.nextSibling
            }
            k.removeClass(g).addClass(h);
            l = true
          } else {
            if (f)for (; f;) {
              if (e(f).attr("id") == d + String(c))break;
              e(f).show();
              f = f.nextSibling
            }
            k.removeClass(h).addClass(g);
            l = false
          }
          e.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this, a, l)
        });
        return false
      }, groupingRender:function (a, b) {
        return this.each(function () {
          var c = this, d = c.p.groupingView, g = "", h = "", f, k = "", l, r, m;
          if (!d.groupDataSorted) {
            d.sortitems[0].sort();
            d.sortnames[0].sort();
            if (d.groupOrder[0].toLowerCase() ==
              "desc") {
              d.sortitems[0].reverse();
              d.sortnames[0].reverse()
            }
          }
          k = d.groupCollapse ? d.plusicon : d.minusicon;
          k += " tree-wrap-" + c.p.direction;
          for (m = 0; m < b;) {
            if (c.p.colModel[m].name == d.groupField[0]) {
              r = m;
              break
            }
            m++
          }
          e.each(d.sortitems[0], function (o, n) {
            f = c.p.id + "ghead_" + o;
            h = "<span style='cursor:pointer;' class='ui-icon " + k + "' onclick=\"jQuery('#" + c.p.id + "').jqGrid('groupingToggle','" + f + "');return false;\"></span>";
            try {
              l = c.formatter(f, d.sortnames[0][o], r, d.sortitems[0])
            } catch (v) {
              l = d.sortnames[0][o]
            }
            g += '<tr id="' +
              f + '" role="row" class= "ui-widget-content jqgroup ui-row-' + c.p.direction + '"><td colspan="' + b + '">' + h + e.jgrid.format(d.groupText[0], l, a[n].length) + "</td></tr>";
            for (var i = 0; i < a[n].length; i++)g += a[n][i].join("");
            if (d.groupSummary[0]) {
              i = "";
              if (d.groupCollapse && !d.showSummaryOnHide)i = ' style="display:none;"';
              g += "<tr" + i + ' role="row" class="ui-widget-content jqfoot ui-row-' + c.p.direction + '">';
              i = d.summaryval[0][n];
              for (var p = c.p.colModel, q, s = a[n].length, j = 0; j < b; j++) {
                var t = "<td " + c.formatCol(j, 1, "") + ">&#160;</td>",
                  u = "{0}";
                e.each(i, function () {
                  if (this.nm == p[j].name) {
                    if (p[j].summaryTpl)u = p[j].summaryTpl;
                    if (this.st == "avg")if (this.v && s > 0)this.v /= s;
                    try {
                      q = c.formatter("", this.v, j, this)
                    } catch (w) {
                      q = this.v
                    }
                    t = "<td " + c.formatCol(j, 1, "") + ">" + e.jgrid.format(u, q) + "</td>";
                    return false
                  }
                });
                g += t
              }
              g += "</tr>"
            }
          });
          e("#" + c.p.id + " tbody:first").append(g);
          g = null
        })
      }, groupingGroupBy:function (a, b) {
        return this.each(function () {
          if (typeof a == "string")a = [a];
          var c = this.p.groupingView;
          this.p.grouping = true;
          for (var d = 0; d < c.groupField.length; d++)!c.groupColumnShow[d] &&
            c.visibiltyOnNextGrouping[d] && e(this).jqGrid("showCol", c.groupField[d]);
          for (d = 0; d < a.length; d++)c.visibiltyOnNextGrouping[d] = e("#" + this.p.id + "_" + a[d]).is(":visible");
          this.p.groupingView = e.extend(this.p.groupingView, b || {});
          c.groupField = a;
          e(this).trigger("reloadGrid")
        })
      }, groupingRemove:function (a) {
        return this.each(function () {
          if (typeof a == "undefined")a = true;
          this.p.grouping = false;
          if (a === true) {
            for (var b = this.p.groupingView, c = 0; c < b.groupField.length; c++)!b.groupColumnShow[c] && b.visibiltyOnNextGrouping[c] &&
            e(this).jqGrid("showCol", b.groupField);
            e("tr.jqgroup, tr.jqfoot", "#" + this.p.id + " tbody:first").remove();
            e("tr.jqgrow:hidden", "#" + this.p.id + " tbody:first").show()
          } else e(this).trigger("reloadGrid")
        })
      }, groupingCalculations:{sum:function (a, b, c) {
        return parseFloat(a || 0) + parseFloat(c[b] || 0)
      }, min:function (a, b, c) {
        if (a === "")return parseFloat(c[b] || 0);
        return Math.min(parseFloat(a), parseFloat(c[b] || 0))
      }, max:function (a, b, c) {
        if (a === "")return parseFloat(c[b] || 0);
        return Math.max(parseFloat(a), parseFloat(c[b] || 0))
      },
        count:function (a, b, c) {
          if (a === "")a = 0;
          return c.hasOwnProperty(b) ? a + 1 : 0
        }, avg:function (a, b, c) {
          return parseFloat(a || 0) + parseFloat(c[b] || 0)
        }}})
    })(jQuery);
    (function (d) {
      d.jgrid.extend({setTreeNode:function (b, c) {
        return this.each(function () {
          var a = this;
          if (a.grid && a.p.treeGrid)for (var e = a.p.expColInd, g = a.p.treeReader.expanded_field, h = a.p.treeReader.leaf_field, f = a.p.treeReader.level_field, k = a.p.treeReader.icon_field, i = a.p.treeReader.loaded, j, o, n, l; b < c;) {
            l = a.p.data[a.p._index[a.rows[b].id]];
            if (a.p.treeGridModel == "nested")if (!l[h]) {
              j = parseInt(l[a.p.treeReader.left_field], 10);
              o = parseInt(l[a.p.treeReader.right_field], 10);
              l[h] = o === j + 1 ? "true" : "false";
              a.rows[b].cells[a.p._treeleafpos].innerHTML =
                l[h]
            }
            j = parseInt(l[f], 10);
            if (a.p.tree_root_level === 0) {
              n = j + 1;
              o = j
            } else {
              n = j;
              o = j - 1
            }
            n = "<div class='tree-wrap tree-wrap-" + a.p.direction + "' style='width:" + n * 18 + "px;'>";
            n += "<div style='" + (a.p.direction == "rtl" ? "right:" : "left:") + o * 18 + "px;' class='ui-icon ";
            if (l[i] !== undefined)l[i] = l[i] == "true" || l[i] === true ? true : false;
            if (l[h] == "true" || l[h] === true) {
              n += (l[k] !== undefined && l[k] !== "" ? l[k] : a.p.treeIcons.leaf) + " tree-leaf treeclick'";
              l[h] = true;
              o = "leaf"
            } else {
              l[h] = false;
              o = ""
            }
            l[g] = (l[g] == "true" || l[g] === true ? true : false) &&
              l[i];
            n += l[g] === true ? a.p.treeIcons.minus + " tree-minus treeclick'" : a.p.treeIcons.plus + " tree-plus treeclick'";
            n += "</div></div>";
            d(a.rows[b].cells[e]).wrapInner("<span class='cell-wrapper" + o + "'></span>").prepend(n);
            if (j !== parseInt(a.p.tree_root_level, 10))(l = (l = d(a).jqGrid("getNodeParent", l)) && l.hasOwnProperty(g) ? l[g] : true) || d(a.rows[b]).css("display", "none");
            d(a.rows[b].cells[e]).find("div.treeclick").bind("click", function (m) {
              m = d(m.target || m.srcElement, a.rows).closest("tr.jqgrow")[0].id;
              m = a.p._index[m];
              if (!a.p.data[m][h])if (a.p.data[m][g]) {
                d(a).jqGrid("collapseRow", a.p.data[m]);
                d(a).jqGrid("collapseNode", a.p.data[m])
              } else {
                d(a).jqGrid("expandRow", a.p.data[m]);
                d(a).jqGrid("expandNode", a.p.data[m])
              }
              return false
            });
            a.p.ExpandColClick === true && d(a.rows[b].cells[e]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function (m) {
              m = d(m.target || m.srcElement, a.rows).closest("tr.jqgrow")[0].id;
              var r = a.p._index[m];
              if (!a.p.data[r][h])if (a.p.data[r][g]) {
                d(a).jqGrid("collapseRow", a.p.data[r]);
                d(a).jqGrid("collapseNode",
                  a.p.data[r])
              } else {
                d(a).jqGrid("expandRow", a.p.data[r]);
                d(a).jqGrid("expandNode", a.p.data[r])
              }
              d(a).jqGrid("setSelection", m);
              return false
            });
            b++
          }
        })
      }, setTreeGrid:function () {
        return this.each(function () {
          var b = this, c = 0, a = false, e, g, h = [];
          if (b.p.treeGrid) {
            b.p.treedatatype || d.extend(b.p, {treedatatype:b.p.datatype});
            b.p.subGrid = false;
            b.p.altRows = false;
            b.p.pgbuttons = false;
            b.p.pginput = false;
            b.p.gridview = true;
            b.p.multiselect = false;
            b.p.rowList = [];
            b.p.expColInd = 0;
            b.p.treeIcons = d.extend({plus:"ui-icon-triangle-1-" +
              (b.p.direction == "rtl" ? "w" : "e"), minus:"ui-icon-triangle-1-s", leaf:"ui-icon-radio-off"}, b.p.treeIcons || {});
            if (b.p.treeGridModel == "nested")b.p.treeReader = d.extend({level_field:"level", left_field:"lft", right_field:"rgt", leaf_field:"isLeaf", expanded_field:"expanded", loaded:"loaded", icon_field:"icon"}, b.p.treeReader); else if (b.p.treeGridModel == "adjacency")b.p.treeReader = d.extend({level_field:"level", parent_id_field:"parent", leaf_field:"isLeaf", expanded_field:"expanded", loaded:"loaded", icon_field:"icon"},
              b.p.treeReader);
            for (g in b.p.colModel)if (b.p.colModel.hasOwnProperty(g)) {
              e = b.p.colModel[g].name;
              if (e == b.p.ExpandColumn && !a) {
                a = true;
                b.p.expColInd = c
              }
              c++;
              for (var f in b.p.treeReader)b.p.treeReader[f] == e && h.push(e)
            }
            d.each(b.p.treeReader, function (k, i) {
              if (i && d.inArray(i, h) === -1) {
                if (k === "leaf_field")b.p._treeleafpos = c;
                c++;
                b.p.colNames.push(i);
                b.p.colModel.push({name:i, width:1, hidden:true, sortable:false, resizable:false, hidedlg:true, editable:true, search:false})
              }
            })
          }
        })
      }, expandRow:function (b) {
        this.each(function () {
          var c =
            this;
          if (c.grid && c.p.treeGrid) {
            var a = d(c).jqGrid("getNodeChildren", b), e = c.p.treeReader.expanded_field;
            d(a).each(function () {
              var g = d.jgrid.getAccessor(this, c.p.localReader.id);
              d("#" + g, c.grid.bDiv).css("display", "");
              this[e] && d(c).jqGrid("expandRow", this)
            })
          }
        })
      }, collapseRow:function (b) {
        this.each(function () {
          var c = this;
          if (c.grid && c.p.treeGrid) {
            var a = d(c).jqGrid("getNodeChildren", b), e = c.p.treeReader.expanded_field;
            d(a).each(function () {
              var g = d.jgrid.getAccessor(this, c.p.localReader.id);
              d("#" + g, c.grid.bDiv).css("display",
                "none");
              this[e] && d(c).jqGrid("collapseRow", this)
            })
          }
        })
      }, getRootNodes:function () {
        var b = [];
        this.each(function () {
          var c = this;
          if (c.grid && c.p.treeGrid)switch (c.p.treeGridModel) {
            case "nested":
              var a = c.p.treeReader.level_field;
              d(c.p.data).each(function () {
                parseInt(this[a], 10) === parseInt(c.p.tree_root_level, 10) && b.push(this)
              });
              break;
            case "adjacency":
              var e = c.p.treeReader.parent_id_field;
              d(c.p.data).each(function () {
                if (this[e] === null || String(this[e]).toLowerCase() == "null")b.push(this)
              })
          }
        });
        return b
      }, getNodeDepth:function (b) {
        var c =
          null;
        this.each(function () {
          if (this.grid && this.p.treeGrid)switch (this.p.treeGridModel) {
            case "nested":
              c = parseInt(b[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
              break;
            case "adjacency":
              c = d(this).jqGrid("getNodeAncestors", b).length
          }
        });
        return c
      }, getNodeParent:function (b) {
        var c = null;
        this.each(function () {
          if (this.grid && this.p.treeGrid)switch (this.p.treeGridModel) {
            case "nested":
              var a = this.p.treeReader.left_field, e = this.p.treeReader.right_field, g = this.p.treeReader.level_field, h = parseInt(b[a],
                10), f = parseInt(b[e], 10), k = parseInt(b[g], 10);
              d(this.p.data).each(function () {
                if (parseInt(this[g], 10) === k - 1 && parseInt(this[a], 10) < h && parseInt(this[e], 10) > f) {
                  c = this;
                  return false
                }
              });
              break;
            case "adjacency":
              var i = this.p.treeReader.parent_id_field, j = this.p.localReader.id;
              d(this.p.data).each(function () {
                if (this[j] == b[i]) {
                  c = this;
                  return false
                }
              })
          }
        });
        return c
      }, getNodeChildren:function (b) {
        var c = [];
        this.each(function () {
          if (this.grid && this.p.treeGrid)switch (this.p.treeGridModel) {
            case "nested":
              var a = this.p.treeReader.left_field,
                e = this.p.treeReader.right_field, g = this.p.treeReader.level_field, h = parseInt(b[a], 10), f = parseInt(b[e], 10), k = parseInt(b[g], 10);
              d(this.p.data).each(function () {
                parseInt(this[g], 10) === k + 1 && parseInt(this[a], 10) > h && parseInt(this[e], 10) < f && c.push(this)
              });
              break;
            case "adjacency":
              var i = this.p.treeReader.parent_id_field, j = this.p.localReader.id;
              d(this.p.data).each(function () {
                this[i] == b[j] && c.push(this)
              })
          }
        });
        return c
      }, getFullTreeNode:function (b) {
        var c = [];
        this.each(function () {
          var a;
          if (this.grid && this.p.treeGrid)switch (this.p.treeGridModel) {
            case "nested":
              var e =
                this.p.treeReader.left_field, g = this.p.treeReader.right_field, h = this.p.treeReader.level_field, f = parseInt(b[e], 10), k = parseInt(b[g], 10), i = parseInt(b[h], 10);
              d(this.p.data).each(function () {
                parseInt(this[h], 10) >= i && parseInt(this[e], 10) >= f && parseInt(this[e], 10) <= k && c.push(this)
              });
              break;
            case "adjacency":
              if (b) {
                c.push(b);
                var j = this.p.treeReader.parent_id_field, o = this.p.localReader.id;
                d(this.p.data).each(function (n) {
                  a = c.length;
                  for (n = 0; n < a; n++)if (c[n][o] == this[j]) {
                    c.push(this);
                    break
                  }
                })
              }
          }
        });
        return c
      }, getNodeAncestors:function (b) {
        var c =
          [];
        this.each(function () {
          if (this.grid && this.p.treeGrid)for (var a = d(this).jqGrid("getNodeParent", b); a;) {
            c.push(a);
            a = d(this).jqGrid("getNodeParent", a)
          }
        });
        return c
      }, isVisibleNode:function (b) {
        var c = true;
        this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var a = d(this).jqGrid("getNodeAncestors", b), e = this.p.treeReader.expanded_field;
            d(a).each(function () {
              c = c && this[e];
              if (!c)return false
            })
          }
        });
        return c
      }, isNodeLoaded:function (b) {
        var c;
        this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var a = this.p.treeReader.leaf_field;
            c = b !== undefined ? b.loaded !== undefined ? b.loaded : b[a] || d(this).jqGrid("getNodeChildren", b).length > 0 ? true : false : false
          }
        });
        return c
      }, expandNode:function (b) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var c = this.p.treeReader.expanded_field, a = this.p.treeReader.parent_id_field, e = this.p.treeReader.loaded, g = this.p.treeReader.level_field, h = this.p.treeReader.left_field, f = this.p.treeReader.right_field;
            if (!b[c]) {
              var k = d.jgrid.getAccessor(b, this.p.localReader.id), i = d("#" + k, this.grid.bDiv)[0], j = this.p._index[k];
              if (d(this).jqGrid("isNodeLoaded", this.p.data[j])) {
                b[c] = true;
                d("div.treeclick", i).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")
              } else {
                b[c] = true;
                d("div.treeclick", i).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus");
                this.p.treeANode = i.rowIndex;
                this.p.datatype = this.p.treedatatype;
                this.p.treeGridModel == "nested" ? d(this).jqGrid("setGridParam", {postData:{nodeid:k, n_left:b[h], n_right:b[f], n_level:b[g]}}) : d(this).jqGrid("setGridParam",
                  {postData:{nodeid:k, parentid:b[a], n_level:b[g]}});
                d(this).trigger("reloadGrid");
                b[e] = true;
                this.p.treeGridModel == "nested" ? d(this).jqGrid("setGridParam", {postData:{nodeid:"", n_left:"", n_right:"", n_level:""}}) : d(this).jqGrid("setGridParam", {postData:{nodeid:"", parentid:"", n_level:""}})
              }
            }
          }
        })
      }, collapseNode:function (b) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid)if (b.expanded) {
            b.expanded = false;
            var c = d.jgrid.getAccessor(b, this.p.localReader.id);
            c = d("#" + c, this.grid.bDiv)[0];
            d("div.treeclick",
              c).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus")
          }
        })
      }, SortTree:function (b, c, a, e) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var g, h, f, k = [], i = this, j;
            g = d(this).jqGrid("getRootNodes");
            g = d.jgrid.from(g);
            g.orderBy(b, c, a, e);
            j = g.select();
            g = 0;
            for (h = j.length; g < h; g++) {
              f = j[g];
              k.push(f);
              d(this).jqGrid("collectChildrenSortTree", k, f, b, c, a, e)
            }
            d.each(k, function (o) {
              var n = d.jgrid.getAccessor(this, i.p.localReader.id);
              d("#" + i.p.id + " tbody tr:eq(" + o + ")").after(d("tr#" +
                n, i.grid.bDiv))
            });
            k = j = g = null
          }
        })
      }, collectChildrenSortTree:function (b, c, a, e, g, h) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var f, k, i, j;
            f = d(this).jqGrid("getNodeChildren", c);
            f = d.jgrid.from(f);
            f.orderBy(a, e, g, h);
            j = f.select();
            f = 0;
            for (k = j.length; f < k; f++) {
              i = j[f];
              b.push(i);
              d(this).jqGrid("collectChildrenSortTree", b, i, a, e, g, h)
            }
          }
        })
      }, setTreeRow:function (b, c) {
        var a = false;
        this.each(function () {
          if (this.grid && this.p.treeGrid)a = d(this).jqGrid("setRowData", b, c)
        });
        return a
      }, delTreeNode:function (b) {
        return this.each(function () {
          var c =
            this.p.localReader.id, a = this.p.treeReader.left_field, e = this.p.treeReader.right_field, g, h, f;
          if (this.grid && this.p.treeGrid) {
            var k = this.p._index[b];
            if (k !== undefined) {
              g = parseInt(this.p.data[k][e], 10);
              h = g - parseInt(this.p.data[k][a], 10) + 1;
              k = d(this).jqGrid("getFullTreeNode", this.p.data[k]);
              if (k.length > 0)for (var i = 0; i < k.length; i++)d(this).jqGrid("delRowData", k[i][c]);
              if (this.p.treeGridModel === "nested") {
                c = d.jgrid.from(this.p.data).greater(a, g, {stype:"integer"}).select();
                if (c.length)for (f in c)c[f][a] = parseInt(c[f][a],
                  10) - h;
                c = d.jgrid.from(this.p.data).greater(e, g, {stype:"integer"}).select();
                if (c.length)for (f in c)c[f][e] = parseInt(c[f][e], 10) - h
              }
            }
          }
        })
      }, addChildNode:function (b, c, a) {
        var e = this[0];
        if (a) {
          var g = e.p.treeReader.expanded_field, h = e.p.treeReader.leaf_field, f = e.p.treeReader.level_field, k = e.p.treeReader.parent_id_field, i = e.p.treeReader.left_field, j = e.p.treeReader.right_field, o = e.p.treeReader.loaded, n, l, m, r, p;
          n = 0;
          var s = c, t;
          if (!b) {
            p = e.p.data.length - 1;
            if (p >= 0)for (; p >= 0;) {
              n = Math.max(n, parseInt(e.p.data[p][e.p.localReader.id],
                10));
              p--
            }
            b = n + 1
          }
          var u = d(e).jqGrid("getInd", c);
          t = false;
          if (c === undefined || c === null || c === "") {
            s = c = null;
            n = "last";
            r = e.p.tree_root_level;
            p = e.p.data.length + 1
          } else {
            n = "after";
            l = e.p._index[c];
            m = e.p.data[l];
            c = m[e.p.localReader.id];
            r = parseInt(m[f], 10) + 1;
            p = d(e).jqGrid("getFullTreeNode", m);
            if (p.length) {
              s = p = p[p.length - 1][e.p.localReader.id];
              p = d(e).jqGrid("getInd", s) + 1
            } else p = d(e).jqGrid("getInd", c) + 1;
            if (m[h]) {
              t = true;
              m[g] = true;
              d(e.rows[u]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf +
                " tree-leaf").addClass(e.p.treeIcons.minus + " tree-minus");
              e.p.data[l][h] = false;
              m[o] = true
            }
          }
          l = p + 1;
          a[g] = false;
          a[o] = true;
          a[f] = r;
          a[h] = true;
          if (e.p.treeGridModel === "adjacency")a[k] = c;
          if (e.p.treeGridModel === "nested") {
            var q;
            if (c !== null) {
              h = parseInt(m[j], 10);
              f = d.jgrid.from(e.p.data);
              f = f.greaterOrEquals(j, h, {stype:"integer"});
              f = f.select();
              if (f.length)for (q in f) {
                f[q][i] = f[q][i] > h ? parseInt(f[q][i], 10) + 2 : f[q][i];
                f[q][j] = f[q][j] >= h ? parseInt(f[q][j], 10) + 2 : f[q][j]
              }
              a[i] = h;
              a[j] = h + 1
            } else {
              h = parseInt(d(e).jqGrid("getCol",
                j, false, "max"), 10);
              f = d.jgrid.from(e.p.data).greater(i, h, {stype:"integer"}).select();
              if (f.length)for (q in f)f[q][i] = parseInt(f[q][i], 10) + 2;
              f = d.jgrid.from(e.p.data).greater(j, h, {stype:"integer"}).select();
              if (f.length)for (q in f)f[q][j] = parseInt(f[q][j], 10) + 2;
              a[i] = h + 1;
              a[j] = h + 2
            }
          }
          if (c === null || d(e).jqGrid("isNodeLoaded", m) || t) {
            d(e).jqGrid("addRowData", b, a, n, s);
            d(e).jqGrid("setTreeNode", p, l)
          }
          m && !m[g] && d(e.rows[u]).find("div.treeclick").click()
        }
      }})
    })(jQuery);
    (function (b) {
      b.jgrid.extend({jqGridImport:function (a) {
        a = b.extend({imptype:"xml", impstring:"", impurl:"", mtype:"GET", impData:{}, xmlGrid:{config:"roots>grid", data:"roots>rows"}, jsonGrid:{config:"grid", data:"data"}, ajaxOptions:{}}, a || {});
        return this.each(function () {
          var d = this, c = function (f, g) {
            var e = b(g.xmlGrid.config, f)[0], h = b(g.xmlGrid.data, f)[0], i;
            if (xmlJsonClass.xml2json && b.jgrid.parse) {
              e = xmlJsonClass.xml2json(e, " ");
              e = b.jgrid.parse(e);
              for (var l in e)if (e.hasOwnProperty(l))i = e[l];
              if (h) {
                h = e.grid.datatype;
                e.grid.datatype = "xmlstring";
                e.grid.datastr = f;
                b(d).jqGrid(i).jqGrid("setGridParam", {datatype:h})
              } else b(d).jqGrid(i)
            } else alert("xml2json or parse are not present")
          }, j = function (f, g) {
            if (f && typeof f == "string") {
              var e = b.jgrid.parse(f), h = e[g.jsonGrid.config];
              if (e = e[g.jsonGrid.data]) {
                var i = h.datatype;
                h.datatype = "jsonstring";
                h.datastr = e;
                b(d).jqGrid(h).jqGrid("setGridParam", {datatype:i})
              } else b(d).jqGrid(h)
            }
          };
          switch (a.imptype) {
            case "xml":
              b.ajax(b.extend({url:a.impurl, type:a.mtype, data:a.impData, dataType:"xml",
                complete:function (f, g) {
                  if (g == "success") {
                    c(f.responseXML, a);
                    b.isFunction(a.importComplete) && a.importComplete(f)
                  }
                }}, a.ajaxOptions));
              break;
            case "xmlstring":
              if (a.impstring && typeof a.impstring == "string") {
                var k = b.jgrid.stringToDoc(a.impstring);
                if (k) {
                  c(k, a);
                  b.isFunction(a.importComplete) && a.importComplete(k);
                  a.impstring = null
                }
                k = null
              }
              break;
            case "json":
              b.ajax(b.extend({url:a.impurl, type:a.mtype, data:a.impData, dataType:"json", complete:function (f, g) {
                if (g == "success") {
                  j(f.responseText, a);
                  b.isFunction(a.importComplete) &&
                  a.importComplete(f)
                }
              }}, a.ajaxOptions));
              break;
            case "jsonstring":
              if (a.impstring && typeof a.impstring == "string") {
                j(a.impstring, a);
                b.isFunction(a.importComplete) && a.importComplete(a.impstring);
                a.impstring = null
              }
          }
        })
      }, jqGridExport:function (a) {
        a = b.extend({exptype:"xmlstring", root:"grid", ident:"\t"}, a || {});
        var d = null;
        this.each(function () {
          if (this.grid) {
            var c = b.extend({}, b(this).jqGrid("getGridParam"));
            if (c.rownumbers) {
              c.colNames.splice(0, 1);
              c.colModel.splice(0, 1)
            }
            if (c.multiselect) {
              c.colNames.splice(0, 1);
              c.colModel.splice(0,
                1)
            }
            if (c.subGrid) {
              c.colNames.splice(0, 1);
              c.colModel.splice(0, 1)
            }
            c.knv = null;
            if (c.treeGrid)for (var j in c.treeReader)if (c.treeReader.hasOwnProperty(j)) {
              c.colNames.splice(c.colNames.length - 1);
              c.colModel.splice(c.colModel.length - 1)
            }
            switch (a.exptype) {
              case "xmlstring":
                d = "<" + a.root + ">" + xmlJsonClass.json2xml(c, a.ident) + "</" + a.root + ">";
                break;
              case "jsonstring":
                d = "{" + xmlJsonClass.toJson(c, a.root, a.ident) + "}";
                if (c.postData.filters !== undefined) {
                  d = d.replace(/filters":"/, 'filters":');
                  d = d.replace(/}]}"/, "}]}")
                }
            }
          }
        });
        return d
      }, excelExport:function (a) {
        a = b.extend({exptype:"remote", url:null, oper:"oper", tag:"excel", exportOptions:{}}, a || {});
        return this.each(function () {
          if (this.grid) {
            var d;
            if (a.exptype == "remote") {
              d = b.extend({}, this.p.postData);
              d[a.oper] = a.tag;
              d = jQuery.param(d);
              d = a.url.indexOf("?") != -1 ? a.url + "&" + d : a.url + "?" + d;
              window.location = d
            }
          }
        })
      }})
    })(jQuery);
    var xmlJsonClass = {xml2json:function (a, b) {
      if (a.nodeType === 9)a = a.documentElement;
      var g = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t");
      return"{\n" + b + (b ? g.replace(/\t/g, b) : g.replace(/\t|\n/g, "")) + "\n}"
    }, json2xml:function (a, b) {
      var g = function (d, c, i) {
        var h = "", k, j;
        if (d instanceof Array)if (d.length === 0)h += i + "<" + c + ">__EMPTY_ARRAY_</" + c + ">\n"; else {
          k = 0;
          for (j = d.length; k < j; k += 1) {
            var l = i + g(d[k], c, i + "\t") + "\n";
            h += l
          }
        } else if (typeof d === "object") {
          k = false;
          h += i + "<" + c;
          for (j in d)if (d.hasOwnProperty(j))if (j.charAt(0) ===
            "@")h += " " + j.substr(1) + '="' + d[j].toString() + '"'; else k = true;
          h += k ? ">" : "/>";
          if (k) {
            for (j in d)if (d.hasOwnProperty(j))if (j === "#text")h += d[j]; else if (j === "#cdata")h += "<![CDATA[" + d[j] + "]]\>"; else if (j.charAt(0) !== "@")h += g(d[j], j, i + "\t");
            h += (h.charAt(h.length - 1) === "\n" ? i : "") + "</" + c + ">"
          }
        } else h += typeof d === "function" ? i + "<" + c + "><![CDATA[" + d + "]]\></" + c + ">" : d.toString() === '""' || d.toString().length === 0 ? i + "<" + c + ">__EMPTY_STRING_</" + c + ">" : i + "<" + c + ">" + d.toString() + "</" + c + ">";
        return h
      }, e = "", f;
      for (f in a)if (a.hasOwnProperty(f))e +=
        g(a[f], f, "");
      return b ? e.replace(/\t/g, b) : e.replace(/\t|\n/g, "")
    }, toObj:function (a) {
      var b = {}, g = /function/i;
      if (a.nodeType === 1) {
        if (a.attributes.length) {
          var e;
          for (e = 0; e < a.attributes.length; e += 1)b["@" + a.attributes[e].nodeName] = (a.attributes[e].nodeValue || "").toString()
        }
        if (a.firstChild) {
          var f = e = 0, d = false, c;
          for (c = a.firstChild; c; c = c.nextSibling)if (c.nodeType === 1)d = true; else if (c.nodeType === 3 && c.nodeValue.match(/[^ \f\n\r\t\v]/))e += 1; else if (c.nodeType === 4)f += 1;
          if (d)if (e < 2 && f < 2) {
            this.removeWhite(a);
            for (c =
                   a.firstChild; c; c = c.nextSibling)if (c.nodeType === 3)b["#text"] = this.escape(c.nodeValue); else if (c.nodeType === 4)if (g.test(c.nodeValue))b[c.nodeName] = [b[c.nodeName], c.nodeValue]; else b["#cdata"] = this.escape(c.nodeValue); else if (b[c.nodeName])if (b[c.nodeName]instanceof Array)b[c.nodeName][b[c.nodeName].length] = this.toObj(c); else b[c.nodeName] = [b[c.nodeName], this.toObj(c)]; else b[c.nodeName] = this.toObj(c)
          } else if (a.attributes.length)b["#text"] = this.escape(this.innerXml(a)); else b = this.escape(this.innerXml(a));
          else if (e)if (a.attributes.length)b["#text"] = this.escape(this.innerXml(a)); else {
            b = this.escape(this.innerXml(a));
            if (b === "__EMPTY_ARRAY_")b = "[]"; else if (b === "__EMPTY_STRING_")b = ""
          } else if (f)if (f > 1)b = this.escape(this.innerXml(a)); else for (c = a.firstChild; c; c = c.nextSibling)if (g.test(a.firstChild.nodeValue)) {
            b = a.firstChild.nodeValue;
            break
          } else b["#cdata"] = this.escape(c.nodeValue)
        }
        if (!a.attributes.length && !a.firstChild)b = null
      } else if (a.nodeType === 9)b = this.toObj(a.documentElement); else alert("unhandled node type: " +
        a.nodeType);
      return b
    }, toJson:function (a, b, g, e) {
      if (e === undefined)e = true;
      var f = b ? '"' + b + '"' : "", d = "\t", c = "\n";
      if (!e)c = d = "";
      if (a === "[]")f += b ? ":[]" : "[]"; else if (a instanceof Array) {
        var i, h, k = [];
        h = 0;
        for (i = a.length; h < i; h += 1)k[h] = this.toJson(a[h], "", g + d, e);
        f += (b ? ":[" : "[") + (k.length > 1 ? c + g + d + k.join("," + c + g + d) + c + g : k.join("")) + "]"
      } else if (a === null)f += (b && ":") + "null"; else if (typeof a === "object") {
        i = [];
        for (h in a)if (a.hasOwnProperty(h))i[i.length] = this.toJson(a[h], h, g + d, e);
        f += (b ? ":{" : "{") + (i.length > 1 ? c + g + d + i.join("," +
          c + g + d) + c + g : i.join("")) + "}"
      } else f += typeof a === "string" ? (b && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"' : (b && ":") + '"' + a.toString() + '"';
      return f
    }, innerXml:function (a) {
      var b = "";
      if ("innerHTML"in a)b = a.innerHTML; else {
        var g = function (e) {
          var f = "", d;
          if (e.nodeType === 1) {
            f += "<" + e.nodeName;
            for (d = 0; d < e.attributes.length; d += 1)f += " " + e.attributes[d].nodeName + '="' + (e.attributes[d].nodeValue || "").toString() + '"';
            if (e.firstChild) {
              f += ">";
              for (d = e.firstChild; d; d = d.nextSibling)f += g(d);
              f += "</" + e.nodeName + ">"
            } else f +=
              "/>"
          } else if (e.nodeType === 3)f += e.nodeValue; else if (e.nodeType === 4)f += "<![CDATA[" + e.nodeValue + "]]\>";
          return f
        };
        for (a = a.firstChild; a; a = a.nextSibling)b += g(a)
      }
      return b
    }, escape:function (a) {
      return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
    }, removeWhite:function (a) {
      a.normalize();
      var b;
      for (b = a.firstChild; b;)if (b.nodeType === 3)if (b.nodeValue.match(/[^ \f\n\r\t\v]/))b = b.nextSibling; else {
        var g = b.nextSibling;
        a.removeChild(b);
        b = g
      } else {
        b.nodeType === 1 && this.removeWhite(b);
        b = b.nextSibling
      }
      return a
    }};

    function tableToGrid(n, o) {
      jQuery(n).each(function () {
        if (!this.grid) {
          jQuery(this).width("99%");
          var a = jQuery(this).width(), d = jQuery("input[type=checkbox]:first", jQuery(this)), b = jQuery("input[type=radio]:first", jQuery(this));
          d = d.length > 0;
          b = !d && b.length > 0;
          var l = d || b, c = [], g = [];
          jQuery("th", jQuery(this)).each(function () {
            if (c.length === 0 && l) {
              c.push({name:"__selection__", index:"__selection__", width:0, hidden:true});
              g.push("__selection__")
            } else {
              c.push({name:jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                index:jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"), width:jQuery(this).width() || 150});
              g.push(jQuery(this).html())
            }
          });
          var f = [], h = [], i = [];
          jQuery("tbody > tr", jQuery(this)).each(function () {
            var j = {}, e = 0;
            jQuery("td", jQuery(this)).each(function () {
              if (e === 0 && l) {
                var k = jQuery("input", jQuery(this)), m = k.attr("value");
                h.push(m || f.length);
                k.attr("checked") && i.push(m);
                j[c[e].name] = k.attr("value")
              } else j[c[e].name] = jQuery(this).html();
              e++
            });
            e > 0 && f.push(j)
          });
          jQuery(this).empty();
          jQuery(this).addClass("scroll");
          jQuery(this).jqGrid(jQuery.extend({datatype:"local", width:a, colNames:g, colModel:c, multiselect:d}, o || {}));
          for (a = 0; a < f.length; a++) {
            b = null;
            if (h.length > 0)if ((b = h[a]) && b.replace)b = encodeURIComponent(b).replace(/[.\-%]/g, "_");
            if (b === null)b = a + 1;
            jQuery(this).jqGrid("addRowData", b, f[a])
          }
          for (a = 0; a < i.length; a++)jQuery(this).jqGrid("setSelection", i[a])
        }
      })
    };
    (function (a) {
      if (a.browser.msie && a.browser.version == 8)a.expr[":"].hidden = function (b) {
        return b.offsetWidth === 0 || b.offsetHeight === 0 || b.style.display == "none"
      };
      a.jgrid._multiselect = false;
      if (a.ui)if (a.ui.multiselect) {
        if (a.ui.multiselect.prototype._setSelected) {
          var q = a.ui.multiselect.prototype._setSelected;
          a.ui.multiselect.prototype._setSelected = function (b, g) {
            var c = q.call(this, b, g);
            if (g && this.selectedList) {
              var f = this.element;
              this.selectedList.find("li").each(function () {
                a(this).data("optionLink") && a(this).data("optionLink").remove().appendTo(f)
              })
            }
            return c
          }
        }
        if (a.ui.multiselect.prototype.destroy)a.ui.multiselect.prototype.destroy =
          function () {
            this.element.show();
            this.container.remove();
            a.Widget === undefined ? a.widget.prototype.destroy.apply(this, arguments) : a.Widget.prototype.destroy.apply(this, arguments)
          };
        a.jgrid._multiselect = true
      }
      a.jgrid.extend({sortableColumns:function (b) {
        return this.each(function () {
          function g() {
            c.p.disableClick = true
          }

          var c = this, f = {tolerance:"pointer", axis:"x", scrollSensitivity:"1", items:">th:not(:has(#jqgh_cb,#jqgh_rn,#jqgh_subgrid),:hidden)", placeholder:{element:function (h) {
            return a(document.createElement(h[0].nodeName)).addClass(h[0].className +
              " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]
          }, update:function (h, j) {
            j.height(h.currentItem.innerHeight() - parseInt(h.currentItem.css("paddingTop") || 0, 10) - parseInt(h.currentItem.css("paddingBottom") || 0, 10));
            j.width(h.currentItem.innerWidth() - parseInt(h.currentItem.css("paddingLeft") || 0, 10) - parseInt(h.currentItem.css("paddingRight") || 0, 10))
          }}, update:function (h, j) {
            var i = a(j.item).parent();
            i = a(">th", i);
            var m = {};
            a.each(c.p.colModel, function (d) {
              m[this.name] = d
            });
            var k =
              [];
            i.each(function () {
              var d = a(">div", this).get(0).id.replace(/^jqgh_/, "");
              d in m && k.push(m[d])
            });
            a(c).jqGrid("remapColumns", k, true, true);
            a.isFunction(c.p.sortable.update) && c.p.sortable.update(k);
            setTimeout(function () {
              c.p.disableClick = false
            }, 50)
          }};
          if (c.p.sortable.options)a.extend(f, c.p.sortable.options); else if (a.isFunction(c.p.sortable))c.p.sortable = {update:c.p.sortable};
          if (f.start) {
            var e = f.start;
            f.start = function (h, j) {
              g();
              e.call(this, h, j)
            }
          } else f.start = g;
          if (c.p.sortable.exclude)f.items += ":not(" + c.p.sortable.exclude +
            ")";
          b.sortable(f).data("sortable").floating = true
        })
      }, columnChooser:function (b) {
        function g(d, l) {
          if (d)if (typeof d == "string")a.fn[d] && a.fn[d].apply(l, a.makeArray(arguments).slice(2)); else a.isFunction(d) && d.apply(l, a.makeArray(arguments).slice(2))
        }

        var c = this;
        if (!a("#colchooser_" + c[0].p.id).length) {
          var f = a('<div id="colchooser_' + c[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'), e = a("select", f);
          b = a.extend({width:420, height:240, classname:null,
            done:function (d) {
              d && c.jqGrid("remapColumns", d, true)
            }, msel:"multiselect", dlog:"dialog", dlog_opts:function (d) {
              var l = {};
              l[d.bSubmit] = function () {
                d.apply_perm();
                d.cleanup(false)
              };
              l[d.bCancel] = function () {
                d.cleanup(true)
              };
              return{buttons:l, close:function () {
                d.cleanup(true)
              }, modal:d.modal ? d.modal : false, resizable:d.resizable ? d.resizable : true, width:d.width + 20}
            }, apply_perm:function () {
              a("option", e).each(function () {
                this.selected ? c.jqGrid("showCol", h[this.value].name) : c.jqGrid("hideCol", h[this.value].name)
              });
              var d =
                [];
              a("option[selected]", e).each(function () {
                d.push(parseInt(this.value, 10))
              });
              a.each(d, function () {
                delete i[h[parseInt(this, 10)].name]
              });
              a.each(i, function () {
                var l = parseInt(this, 10);
                var p = d, o = l;
                if (o >= 0) {
                  var n = p.slice(), r = n.splice(o, Math.max(p.length - o, o));
                  if (o > p.length)o = p.length;
                  n[o] = l;
                  d = n.concat(r)
                } else d = void 0
              });
              b.done && b.done.call(c, d)
            }, cleanup:function (d) {
              g(b.dlog, f, "destroy");
              g(b.msel, e, "destroy");
              f.remove();
              d && b.done && b.done.call(c)
            }, msel_opts:{}}, a.jgrid.col, b || {});
          if (a.ui)if (a.ui.multiselect)if (b.msel ==
            "multiselect") {
            if (!a.jgrid._multiselect) {
              alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
              return
            }
            b.msel_opts = a.extend(a.ui.multiselect.defaults, b.msel_opts)
          }
          b.caption && f.attr("title", b.caption);
          if (b.classname) {
            f.addClass(b.classname);
            e.addClass(b.classname)
          }
          if (b.width) {
            a(">div", f).css({width:b.width, margin:"0 auto"});
            e.css("width", b.width)
          }
          if (b.height) {
            a(">div", f).css("height", b.height);
            e.css("height", b.height - 10)
          }
          var h = c.jqGrid("getGridParam", "colModel"),
            j = c.jqGrid("getGridParam", "colNames"), i = {}, m = [];
          e.empty();
          a.each(h, function (d) {
            i[this.name] = d;
            if (this.hidedlg)this.hidden || m.push(d); else e.append("<option value='" + d + "' " + (this.hidden ? "" : "selected='selected'") + ">" + j[d] + "</option>")
          });
          var k = a.isFunction(b.dlog_opts) ? b.dlog_opts.call(c, b) : b.dlog_opts;
          g(b.dlog, f, k);
          k = a.isFunction(b.msel_opts) ? b.msel_opts.call(c, b) : b.msel_opts;
          g(b.msel, e, k)
        }
      }, sortableRows:function (b) {
        return this.each(function () {
          var g = this;
          if (g.grid)if (!g.p.treeGrid)if (a.fn.sortable) {
            b =
              a.extend({cursor:"move", axis:"y", items:".jqgrow"}, b || {});
            if (b.start && a.isFunction(b.start)) {
              b._start_ = b.start;
              delete b.start
            } else b._start_ = false;
            if (b.update && a.isFunction(b.update)) {
              b._update_ = b.update;
              delete b.update
            } else b._update_ = false;
            b.start = function (c, f) {
              a(f.item).css("border-width", "0px");
              a("td", f.item).each(function (j) {
                this.style.width = g.grid.cols[j].style.width
              });
              if (g.p.subGrid) {
                var e = a(f.item).attr("id");
                try {
                  a(g).jqGrid("collapseSubGridRow", e)
                } catch (h) {
                }
              }
              b._start_ && b._start_.apply(this,
                [c, f])
            };
            b.update = function (c, f) {
              a(f.item).css("border-width", "");
              g.p.rownumbers === true && a("td.jqgrid-rownum", g.rows).each(function (e) {
                a(this).html(e + 1)
              });
              b._update_ && b._update_.apply(this, [c, f])
            };
            a("tbody:first", g).sortable(b);
            a("tbody:first", g).disableSelection()
          }
        })
      }, gridDnD:function (b) {
        return this.each(function () {
          function g() {
            var e = a.data(c, "dnd");
            a("tr.jqgrow:not(.ui-draggable)", c).draggable(a.isFunction(e.drag) ? e.drag.call(a(c), e) : e.drag)
          }

          var c = this;
          if (c.grid)if (!c.p.treeGrid)if (a.fn.draggable &&
            a.fn.droppable) {
            a("#jqgrid_dnd").html() === null && a("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");
            if (typeof b == "string" && b == "updateDnD" && c.p.jqgdnd === true)g(); else {
              b = a.extend({drag:function (e) {
                return a.extend({start:function (h, j) {
                  if (c.p.subGrid) {
                    var i = a(j.helper).attr("id");
                    try {
                      a(c).jqGrid("collapseSubGridRow", i)
                    } catch (m) {
                    }
                  }
                  for (i = 0; i < a.data(c, "dnd").connectWith.length; i++)a(a.data(c, "dnd").connectWith[i]).jqGrid("getGridParam", "reccount") == "0" && a(a.data(c, "dnd").connectWith[i]).jqGrid("addRowData",
                    "jqg_empty_row", {});
                  j.helper.addClass("ui-state-highlight");
                  a("td", j.helper).each(function (k) {
                    this.style.width = c.grid.headers[k].width + "px"
                  });
                  e.onstart && a.isFunction(e.onstart) && e.onstart.call(a(c), h, j)
                }, stop:function (h, j) {
                  if (j.helper.dropped) {
                    var i = a(j.helper).attr("id");
                    a(c).jqGrid("delRowData", i)
                  }
                  for (i = 0; i < a.data(c, "dnd").connectWith.length; i++)a(a.data(c, "dnd").connectWith[i]).jqGrid("delRowData", "jqg_empty_row");
                  e.onstop && a.isFunction(e.onstop) && e.onstop.call(a(c), h, j)
                }}, e.drag_opts || {})
              }, drop:function (e) {
                return a.extend({accept:function (h) {
                  if (!a(h).hasClass("jqgrow"))return h;
                  var j = a(h).closest("table.ui-jqgrid-btable");
                  if (j.length > 0 && a.data(j[0], "dnd") !== undefined) {
                    h = a.data(j[0], "dnd").connectWith;
                    return a.inArray("#" + this.id, h) != -1 ? true : false
                  }
                  return h
                }, drop:function (h, j) {
                  if (a(j.draggable).hasClass("jqgrow")) {
                    var i = a(j.draggable).attr("id");
                    i = j.draggable.parent().parent().jqGrid("getRowData", i);
                    if (!e.dropbyname) {
                      var m = 0, k = {}, d, l = a("#" + this.id).jqGrid("getGridParam", "colModel");
                      try {
                        for (var p in i) {
                          if (i.hasOwnProperty(p) && l[m]) {
                            d = l[m].name;
                            k[d] = i[p]
                          }
                          m++
                        }
                        i = k
                      } catch (o) {
                      }
                    }
                    j.helper.dropped =
                      true;
                    if (e.beforedrop && a.isFunction(e.beforedrop)) {
                      d = e.beforedrop.call(this, h, j, i, a("#" + c.id), a(this));
                      if (typeof d != "undefined" && d !== null && typeof d == "object")i = d
                    }
                    if (j.helper.dropped) {
                      var n;
                      if (e.autoid)if (a.isFunction(e.autoid))n = e.autoid.call(this, i); else {
                        n = Math.ceil(Math.random() * 1E3);
                        n = e.autoidprefix + n
                      }
                      a("#" + this.id).jqGrid("addRowData", n, i, e.droppos)
                    }
                    e.ondrop && a.isFunction(e.ondrop) && e.ondrop.call(this, h, j, i)
                  }
                }}, e.drop_opts || {})
              }, onstart:null, onstop:null, beforedrop:null, ondrop:null, drop_opts:{activeClass:"ui-state-active",
                hoverClass:"ui-state-hover"}, drag_opts:{revert:"invalid", helper:"clone", cursor:"move", appendTo:"#jqgrid_dnd", zIndex:5E3}, dropbyname:false, droppos:"first", autoid:true, autoidprefix:"dnd_"}, b || {});
              if (b.connectWith) {
                b.connectWith = b.connectWith.split(",");
                b.connectWith = a.map(b.connectWith, function (e) {
                  return a.trim(e)
                });
                a.data(c, "dnd", b);
                c.p.reccount != "0" && !c.p.jqgdnd && g();
                c.p.jqgdnd = true;
                for (var f = 0; f < b.connectWith.length; f++)a(b.connectWith[f]).droppable(a.isFunction(b.drop) ? b.drop.call(a(c), b) : b.drop)
              }
            }
          }
        })
      },
        gridResize:function (b) {
          return this.each(function () {
            var g = this;
            if (g.grid && a.fn.resizable) {
              b = a.extend({}, b || {});
              if (b.alsoResize) {
                b._alsoResize_ = b.alsoResize;
                delete b.alsoResize
              } else b._alsoResize_ = false;
              if (b.stop && a.isFunction(b.stop)) {
                b._stop_ = b.stop;
                delete b.stop
              } else b._stop_ = false;
              b.stop = function (c, f) {
                a(g).jqGrid("setGridParam", {height:a("#gview_" + g.p.id + " .ui-jqgrid-bdiv").height()});
                a(g).jqGrid("setGridWidth", f.size.width, b.shrinkToFit);
                b._stop_ && b._stop_.call(g, c, f)
              };
              b.alsoResize = b._alsoResize_ ?
                eval("(" + ("{'#gview_" + g.p.id + " .ui-jqgrid-bdiv':true,'" + b._alsoResize_ + "':true}") + ")") : a(".ui-jqgrid-bdiv", "#gview_" + g.p.id);
              delete b._alsoResize_;
              a("#gbox_" + g.p.id).resizable(b)
            }
          })
        }})
    })(jQuery);

  }); // define()