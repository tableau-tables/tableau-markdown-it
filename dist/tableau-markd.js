"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tableau = __importStar(require("js-tableau-parser"));
////////////////////////////////////////////////////////////////////////
const TABLEAU_EXTENSION = {
    name: 'tableau',
    level: 'block',
    start: Tableau.test,
    tokenizer,
    renderer,
};
////////////////////////////////////////////////////////////////////////
exports.default = {
    extensions: [TABLEAU_EXTENSION]
};
////////////////////////////////////////////////////////////////////////
// the following defines a row (text between pipe characters)
const TABLE_RE = new RegExp(`(` +
    `\\s{0,3}` + //permitted indentation
    `\\|` + //starting pipe
    `[^\\n]+` + // body of the line (see [1] below)
    `\\|` + // trailing pipe
    `\\s*\\n` + // spaces nd EOL
    `){2,}`); // Two or more rows is a table
function tokenizer(src, _tokens) {
    const match = TABLE_RE.exec(src);
    if (!match)
        return;
    const ast = Tableau.to_ast(match[0]);
    if (!ast)
        return;
    // marked make you tokenize children heere, then
    // render them later
    ast.each_row(row => {
        row.each_cell(cell => {
            const tokens = [];
            this.lexer.inlineTokens(cell.content, tokens);
            cell.data = tokens;
        });
    });
    return {
        type: 'tableau',
        raw: match[0],
        ast: ast,
    };
}
function renderer(table) {
    table.ast.each_row(row => {
        row.each_cell(cell => {
            cell.content = this.parser.parseInline(cell.data);
        });
    });
    return Tableau.ast_to_html(table.ast);
}
////////////////////////////////////////////////////////////////////////
//     // Get first header row to determine how many columns
//     item.header[0] = splitCells(item.header[0]);
//     const colCount = item.header[0].reduce((length, header) => {
//       return length + header.colspan;
//     }, 0);
//     if (colCount === item.align.length) {
//       item.raw = cap[0];
//       let i, j, k, row;
//       // Get alignment row (:---:)
//       let l = item.align.length;
//       for (i = 0; i < l; i++) {
//         if (/^ *-+: *$/.test(item.align[i])) {
//           item.align[i] = 'right';
//         } else if (/^ *:-+: *$/.test(item.align[i])) {
//           item.align[i] = 'center';
//         } else if (/^ *:-+ *$/.test(item.align[i])) {
//           item.align[i] = 'left';
//         } else {
//           item.align[i] = null;
//         }
//       }
//       // Get any remaining header rows
//       l = item.header.length;
//       for (i = 1; i < l; i++) {
//         item.header[i] = splitCells(item.header[i], colCount, item.header[i - 1]);
//       }
//       // Get main table cells
//       l = item.rows.length;
//       for (i = 0; i < l; i++) {
//         item.rows[i] = splitCells(item.rows[i], colCount, item.rows[i - 1]);
//       }
//       // header child tokens
//       l = item.header.length;
//       for (j = 0; j < l; j++) {
//         row = item.header[j];
//         for (k = 0; k < row.length; k++) {
//           row[k].tokens = [];
//           this.lexer.inlineTokens(row[k].text, row[k].tokens);
//         }
//       }
//       // cell child tokens
//       l = item.rows.length;
//       for (j = 0; j < l; j++) {
//         row = item.rows[j];
//         for (k = 0; k < row.length; k++) {
//           row[k].tokens = [];
//           this.lexer.inlinetokens(row[k].text, row[k].tokens);
//         }
//       }
//       return item;
//     }
//   }
// },
// renderer(token) {
//   let i, j, row, cell, col, text;
//   let output = '<table>';
//   output += '<thead>';
//   for (i = 0; i < token.header.length; i++) {
//     row = token.header[i];
//     let col = 0;
//     output += '<tr>';
//     for (j = 0; j < row.length; j++) {
//       cell = row[j];
//       text = this.parser.parseInline(cell.tokens);
//       output += getTableCell(text, cell, 'th', token.align[col]);
//       col += cell.colspan;
//     }
//     output += '</tr>';
//   }
//   output += '</thead>';
//   if (token.rows.length) {
//     output += '<tbody>';
//     for (i = 0; i < token.rows.length; i++) {
//       row = token.rows[i];
//       col = 0;
//       output += '<tr>';
//       for (j = 0; j < row.length; j++) {
//         cell = row[j];
//         text = this.parser.parseInline(cell.tokens);
//         output += getTableCell(text, cell, 'td', token.align[col]);
//         col += cell.colspan;
//       }
//       output += '</tr>';
//     }
//     output += '</tbody>';
//   }
//   output += '</table>';
//   return output;
// }
// }
// ]
// };
// }
// const getTableCell = (text, cell, type, align) => {
//   if (!cell.rowspan) {
//     return '';
//   }
//   const tag = `<${type}`
//             + `${cell.colspan > 1 ? ` colspan=${cell.colspan}` : ''}`
//             + `${cell.rowspan > 1 ? ` rowspan=${cell.rowspan}` : ''}`
//             + `${align ? ` align=${align}` : ''}>`;
//   return `${tag + text}</${type}>\n`;
// };
// const splitCells = (tableRow, count, prevRow = []) => {
//   const cells = [...tableRow.matchAll(/(?:[^|\\]|\\.?)+(?:\|+|$)/g)].map((x) => x[0]);
//   // Remove first/last cell in a row if whitespace only and no leading/trailing pipe
//   if (!cells[0]?.trim()) { cells.shift(); }
//   if (!cells[cells.length - 1]?.trim()) { cells.pop(); }
//   let numCols = 0;
//   let i, j, trimmedCell, prevCell, prevCols;
//   for (i = 0; i < cells.length; i++) {
//     trimmedCell = cells[i].split(/\|+$/)[0];
//     cells[i] = {
//       rowspan: 1,
//       colspan: Math.max(cells[i].length - trimmedCell.length, 1),
//       text: trimmedCell.trim().replace(/\\\|/g, '|')
//       // display escaped pipes as normal character
//     };
//     // Handle Rowspan
//     if (trimmedCell.slice(-1) === '^' && prevRow.length) {
//       // Find matching cell in previous row
//       prevCols = 0;
//       for (j = 0; j < prevRow.length; j++) {
//         prevCell = prevRow[j];
//         if ((prevCols === numCols) && (prevCell.colspan === cells[i].colspan)) {
//           // merge into matching cell in previous row (the "target")
//           cells[i].rowSpanTarget = prevCell.rowSpanTarget ?? prevCell;
//           cells[i].rowSpanTarget.text += ` ${cells[i].text.slice(0, -1)}`;
//           cells[i].rowSpanTarget.rowspan += 1;
//           cells[i].rowspan = 0;
//           break;
//         }
//         prevCols += prevCell.colspan;
//         if (prevCols > numCols) { break; }
//       }
//     }
//     numCols += cells[i].colspan;
//   }
//   // Force main cell rows to match header column count
//   if (numCols > count) {
//     cells.splice(count);
//   } else {
//     while (numCols < count) {
//       cells.push({
//         colspan: 1,
//         text: ''
//       });
//       numCols += 1;
//     }
//   }
//   return cells;
// };
