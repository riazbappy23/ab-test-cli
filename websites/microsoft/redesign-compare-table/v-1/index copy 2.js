(() => {
    //  LABEL + ICON MAPS
    const HIGHLIGHTS_META = [
        {label: "Device Type", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-ram?fmt=png-alpha"},
        {label: "System", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-windows-11?fmt=png-alpha"},
        {label: "Copilot+ PC", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-copilot?fmt=png-alpha"},
        {label: "Battery life", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-battery?fmt=png-alpha"},
        {label: "Touchscreen", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-touchscreen?fmt=png-alpha"},
        {label: "Ports", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-usb?fmt=png-alpha"},
        {label: "Camera and Video", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-camera?fmt=png-alpha"},
        {label: "Wi-Fi", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-wifi?fmt=png-alpha"},
        {label: "Weight", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-weight?fmt=png-alpha"},
    ];

    const PERFORMANCE_META = [
        {match: "cpu", label: "CPU", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-processor?fmt=png-alpha"},
        {match: "neural", label: "Neural Processing Unit (NPU)", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-processor?fmt=png-alpha"},
        {match: "gpu", label: "GPU", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-processor?fmt=png-alpha"},
        {match: "ram", label: "Memory", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-ram?fmt=png-alpha"},
        {match: "storage", label: "Storage", icon: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSS-C-E277-storage?fmt=png-alpha"},
    ];

    const HIDE_SUB = new Set(["Device Type", "System", "Copilot+ PC", "Battery life", "Touchscreen", "Ports", "Camera and Video", "Wi-Fi", "Weight", "CPU", "Neural Processing Unit (NPU)", "Memory", "Storage"]);

    //  CSS
    const css = `
    .exp-new-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-size: 1.2rem;
      color: #1a1a1a;
    }
    .exp-new-table .exp-heading-cell {
      padding: 32px 0 10px;
      font-size: 1.5rem;
      font-weight: 700;
      border-bottom: 1px solid #d1d1d1;
    }
    .exp-new-table .exp-label-cell,
    .exp-new-table .exp-device-label-cell {
      padding: 16px 12px 16px 0;
      vertical-align: middle;
      border-bottom: 1px solid #ebebeb;
      width: 220px;
    }
    .exp-label-inner {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 400;
      color: #333;
      line-height: 1.4;
    }
    .exp-label-inner img { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
    .exp-new-table .exp-value-cell {
      padding: 16px;
      vertical-align: middle;
      border-bottom: 1px solid #ebebeb;
      line-height: 1.5;
    }
    .exp-new-table .exp-device-value-cell {
      font-size: 1.2rem;
      padding: 16px;
      vertical-align: middle;
      border-bottom: 1px solid #ebebeb;
    }
    .exp-new-table .exp-value-cell b,
    .exp-new-table .exp-value-cell strong { font-weight: 700; }

    .exp-new-table .exp-value-cell sup,
    .exp-new-table .exp-device-value-cell sup {
      font-size: 0.65em;
      vertical-align: super;
      line-height: 0;
    }
    .exp-new-table .exp-value-cell sup a,
    .exp-new-table .exp-device-value-cell sup a { 
    color:blue;
    font-size:16px;
    font-weight:500;
    text-decoration: none; 
    }
    .exp-new-table .exp-value-cell .exp-sub,
    .exp-new-table .exp-device-value-cell .exp-sub {
      display: block;
      font-size: 0.8125rem;
      color: #555;
      font-weight: 400;
      margin-top: 2px;
    }
    .exp-new-table .exp-spacer-td { height: 28px; border: none !important; padding: 0; }
  `;

    var waitForElem = (waitFor, callback, minElements = 1, isVariable = false, timer = 30000, frequency = 100) => {
        const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        const conditionMet = isVariable ? typeof window[waitFor] !== "undefined" : elements.length >= minElements;
        conditionMet ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    };

    const isAddAnotherRow = (tr) => tr.classList.contains("row-add-another") || !!tr.querySelector(".button-label")?.textContent.toLowerCase().includes("add another");
    const isCtaRow = (tr) => !!tr.querySelector("moray-anchor");
    const isSectionHeaderRow = (tr) => !!tr.querySelector("td.header");

    const cleanText = (raw) =>
        (raw || "")
            .replace(/\?lit\$\d+\$/g, "")
            .replace(/\s+/g, " ")
            .trim();

    function cleanLit(node) {
        const c = node.cloneNode(true);
        const tw = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
        const tns = [];
        let n;
        while ((n = tw.nextNode())) tns.push(n);
        tns.forEach((tn) => {
            tn.textContent = cleanText(tn.textContent);
        });
        return c;
    }

    function extractCell(td) {
        const clone = td.cloneNode(true);
        clone.querySelectorAll("moray-tooltip").forEach((e) => e.remove());

        const sc = clone.querySelector(".spec-card");
        const container = sc || clone;

        // 1. Locate bold wrapper
        const kf = container.querySelector(".key-feature");
        const boldEl = kf || container.querySelector("b, strong");

        // 2. "Up to" prefix
        let prefix = "";
        if (boldEl) {
            const tw = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = tw.nextNode())) {
                // Stop the moment we enter boldEl's subtree
                if (boldEl === node || boldEl.contains(node)) break;
                prefix += node.textContent;
            }
            prefix = cleanText(prefix);
            // only keep "Up to" qualifiers
            if (!/\bup\s+to\b/i.test(prefix)) prefix = "";
        }

        // 3. boldNode — clone bold, strip decorative icons, absorb trailing <sup> siblings
        let boldNode = null;
        let absorbedSupCount = 0;
        if (boldEl) {
            const bc = cleanLit(boldEl);
            bc.querySelectorAll("img, svg, moray-icon").forEach((e) => e.remove());
            boldNode = document.createElement("span");
            boldNode.innerHTML = kf ? bc.innerHTML : `<b>${bc.innerHTML}</b>`;

            // Walk siblings immediately after boldEl in the ORIGINAL container;
            // absorb consecutive <sup> elements (reference numbers like ¹ ²²)
            let sib = boldEl.nextSibling;
            while (sib) {
                const next = sib.nextSibling;
                if (sib.nodeType === Node.TEXT_NODE && cleanText(sib.textContent) === "") {
                    sib = next; // skip empty whitespace between bold and sup
                    continue;
                }
                if (sib.nodeType === Node.ELEMENT_NODE && sib.tagName === "SUP") {
                    boldNode.appendChild(cleanLit(sib));
                    absorbedSupCount++;
                    sib = next;
                } else {
                    break; // non-sup sibling → belongs to subNode, stop here
                }
            }
        }

        // 4. subNode — everything that remains after boldEl + absorbed sups
        //    Clone container, remove boldEl, remove only the first N sups
        //    (the ones we absorbed), keep any further sups (they're part of subText)
        let subNode = null;
        if (boldEl) {
            const sc2 = container.cloneNode(true);

            // Remove bold mirror
            const boldMirror = kf ? sc2.querySelector(".key-feature") : sc2.querySelector("b, strong");
            if (boldMirror) boldMirror.remove();

            // Remove only the N sups we absorbed into boldNode (front of the list)
            const remainingSups = Array.from(sc2.querySelectorAll("sup"));
            for (let i = 0; i < absorbedSupCount && i < remainingSups.length; i++) {
                remainingSups[i].remove();
            }

            // Strip the "Up to" prefix text from the remaining text nodes
            if (prefix) {
                const tw2 = document.createTreeWalker(sc2, NodeFilter.SHOW_TEXT);
                const firstTn = tw2.nextNode();
                if (firstTn) {
                    firstTn.textContent = firstTn.textContent.replace(/^\s*up\s+to\s*/i, "");
                }
            }

            cleanLit(sc2); // scrub Lit noise

            // Build subNode preserving both text and remaining <sup> elements
            const textPart = cleanText(sc2.textContent);
            const supPart = sc2.querySelectorAll("sup");

            if (textPart || supPart.length) {
                subNode = document.createElement("span");
                subNode.className = "exp-sub";

                // Walk sc2 children and append text nodes + sup elements in order
                const walker = document.createTreeWalker(sc2, NodeFilter.SHOW_ALL);
                let wn;
                while ((wn = walker.nextNode())) {
                    if (wn.nodeType === Node.TEXT_NODE) {
                        const t = cleanText(wn.textContent);
                        if (t) subNode.appendChild(document.createTextNode(t + " "));
                    } else if (wn.nodeType === Node.ELEMENT_NODE && wn.tagName === "SUP") {
                        subNode.appendChild(wn.cloneNode(true));
                        walker.nextNode(); // skip sup's children since we cloned it
                    }
                }
                // If subNode has no real content, discard it
                if (!cleanText(subNode.textContent) && !subNode.querySelector("sup")) {
                    subNode = null;
                }
            }
        }

        // 5. Fallback: no bold found — plain text cell (e.g. "1080p", "Yes")
        if (!boldNode) {
            const text = cleanText(container.textContent);
            if (text) {
                boldNode = document.createElement("span");
                boldNode.textContent = text;
            }
        }

        return {prefix, boldNode, subNode};
    }

    function parseSectionRow({tds, metaList, current, rowIndex}) {
        rowIndex++;
        const values = tds.map(extractCell);
        if (values.every((v) => !v.boldNode && !v.prefix)) return;
        const meta = metaList[rowIndex - 1];
        if (!meta) return;
        const isFirst = rowIndex === 1;
        if (isFirst) {
            current.productNames = values.map((v) => (v.boldNode ? cleanText(v.boldNode.textContent) : "")).filter(Boolean);
        }
        current.rows.push({label: meta.label, icon: meta.icon, values, isDeviceType: isFirst});
        return;
    }

    //  DATA PARSER
    function parseTargetRows(rows) {
        const sections = [];
        let current = null;
        let sectionType = "";
        let hlRowCount = 0;

        rows.forEach((tr) => {
            if (isAddAnotherRow(tr) || isCtaRow(tr)) return;

            if (isSectionHeaderRow(tr)) {
                hlRowCount = 0;
                const h3 = tr.querySelector("h3");
                const title = cleanText(h3 ? h3.textContent : "");
                sectionType = title.toLowerCase().includes("highlight") ? "highlights" : "performance";
                current = {title, productNames: [], rows: []};
                sections.push(current);
                return;
            }

            if (!current) return;
            const tds = Array.from(tr.querySelectorAll("td"));
            if (!tds.length) return;

            if (sectionType === "highlights") {
                parseSectionRow({tds, metaList: HIGHLIGHTS_META, current, rowIndex: hlRowCount});
                hlRowCount++;
                return;
            }

            if (sectionType === "performance") {
                parseSectionRow({tds, metaList: PERFORMANCE_META, current, rowIndex: hlRowCount});
                hlRowCount++;
                return;
            }
        });

        return sections;
    }

    //  TABLE BUILDER
    const el = (tag, cls) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    };

    // create cell label
    function buildLabelCell(label, iconUrl, isFirst) {
        const td = el("td", isFirst ? "exp-device-label-cell" : "exp-label-cell");
        const inner = el("div", "exp-label-inner");
        const img = el("img");
        img.src = iconUrl;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        inner.appendChild(img);
        const span = el("span");
        span.textContent = label;
        inner.appendChild(span);
        td.appendChild(inner);
        return td;
    }

    // create cell value
    function buildValueCell(v, isDeviceType, rowLabel) {
        const td = el("td", isDeviceType ? "exp-device-value-cell" : "exp-value-cell");
        const hideSub = HIDE_SUB.has(rowLabel);

        if (v.prefix) {
            const pre = document.createElement("span");
            pre.textContent = v.prefix + "\u00A0";
            td.appendChild(pre);
        }

        if (v.boldNode) td.appendChild(v.boldNode);

        if (v.subNode) {
            if (!hideSub) {
                td.appendChild(v.subNode);
            } else if (v.boldNode) {
                v.subNode.querySelectorAll("sup").forEach((sup) => {
                    v.boldNode.appendChild(sup.cloneNode(true));
                });
            }
        }

        return td;
    }

    // create table
    function buildNewTable(sections, productCount) {
        const table = el("table", "exp-new-table");
        const cg = document.createElement("colgroup");
        const lc = document.createElement("col");
        lc.style.width = "220px";
        cg.appendChild(lc);
        for (let i = 0; i < productCount; i++) cg.appendChild(document.createElement("col"));
        table.appendChild(cg);

        const tbody = el("tbody");
        table.appendChild(tbody);

        sections.forEach((section, sIdx) => {
            if (sIdx > 0) {
                const tr = el("tr");
                const td = el("td", "exp-spacer-td");
                td.setAttribute("colspan", productCount + 1);
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            const headTr = el("tr");
            const headTd = el("td", "exp-heading-cell");
            headTd.setAttribute("colspan", productCount + 1);
            headTd.textContent = section.title;
            headTr.appendChild(headTd);
            tbody.appendChild(headTr);

            section.rows.forEach((row) => {
                const tr = el("tr");
                tr.appendChild(buildLabelCell(row.label, row.icon, row.isDeviceType));
                row.values.forEach((v) => tr.appendChild(buildValueCell(v, row.isDeviceType, row.label)));
                tbody.appendChild(tr);
            });
        });

        return table;
    }

    //  INIT
    const init = () => {
        const host = document.querySelector("cascade-product-compare-table");
        if (!host) {
            return;
        }
        const shadow = host.shadowRoot;
        if (!shadow) {
            return;
        }
        const table = shadow.querySelector("table");
        if (!table) {
            return;
        }

        if (!shadow.getElementById("exp-new-table-styles")) {
            const style = document.createElement("style");
            style.id = "exp-new-table-styles";
            style.textContent = css;
            shadow.appendChild(style);
        }

        const allRows = Array.from(table.querySelectorAll("tr"));
        const firstHdrIdx = allRows.findIndex((tr) => isSectionHeaderRow(tr));
        if (firstHdrIdx === -1) {
            console.warn("[MSExp] No section header found");
            return;
        }

        const targetRows = allRows.slice(firstHdrIdx);
        const sections = parseTargetRows(targetRows);
        if (!sections.length) return;

        let productCount = 0;
        sections.forEach((sec) =>
            sec.rows.forEach((row) => {
                productCount = Math.max(productCount, row.values.length);
            })
        );

        targetRows.forEach((tr) => {
            tr.style.display = "none";
        });
        let newTable = buildNewTable(sections, productCount);
        table.insertAdjacentElement("afterend", newTable);

        let prevCount = productCount;
        new MutationObserver(() => {
            const freshSections = parseTargetRows(targetRows);
            let newCount = 0;
            freshSections.forEach((sec) =>
                sec.rows.forEach((row) => {
                    newCount = Math.max(newCount, row.values.length);
                })
            );
            if (newCount > 0 && newCount !== prevCount) {
                prevCount = newCount;
                const updated = buildNewTable(freshSections, newCount);
                newTable.replaceWith(updated);
                newTable = updated;
            }
        }).observe(table, {childList: true, subtree: true});
    };

    waitForElem("cascade-product-compare-table", init);
})();
