/// <reference types="markdown-it" />

import { Ast, Row, Cell, to_ast } from "js-tableau-parser"
import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block";

const NL    = "\n".charCodeAt(0)
const SPACE = " ".charCodeAt(0)
const PIPE  = "|".charCodeAt(0)

function table(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {

  let endOfTable = startLine

  while (endOfTable < endLine && isTableauLine(state, endOfTable))
    endOfTable++

  if (endOfTable - startLine < 2)
    return false; 

  console.log("FOUND TABLE")
  let startPos = state.bMarks[startLine]
  let endPos   = state.eMarks[endOfTable-1]
  const ast: Ast | false = to_ast(state.src.slice(startPos, endPos+1))

  console.log(ast)

  if (!ast)
    return false

  if (silent)
    return true

  state.line = endOfTable
  renderTableau(ast, state, startLine, endOfTable)

  return true
}


export = function tableau_table_plugin(md:MarkdownIt, _options: any) {
  md.block.ruler.at('table', table, { alt: [ 'paragraph', 'reference' ] });
}


////////////////////////////////////////////////////////////////////////

function renderTableau(ast: Ast, state: StateBlock, startLine: number, endLine: number): void {

  const { head, body } = ast.split_out_head()

  const t_table = state.push("table_open", "table", 1)
  t_table.attrPush([ "class", ast.table_classes.join(" ")])
  t_table.map = [ startLine, endLine ]

  render_thead(state, head)
  render_tbody(state, body)
  render_caption(state, ast.caption)
  state.push("table_close", "table", -1)
}

function render_thead(state: StateBlock, head: Row[]) {
  if (head.length > 0) {
    state.push("thead_open", "thead", 1)
    render_rows(state, head)
    state.push("thead_close", "thead", -1)
  }
}

function render_tbody(state: StateBlock, body: Row[]) {
  if (body.length > 0) {
    state.push("tbody_open", "tbody", 1)
    render_rows(state, body)
    state.push("tbody_close", "tbody", -1)
  }
}

function render_caption(state: StateBlock, caption?: string) {
  if (caption && caption.length > 0) {
      state.push('caption_open', 'caption', 1);
      const token    = state.push('inline', '', 0);
      token.content  = caption
      token.children = [];

      state.push('caption_close', 'caption', -1);  }
}

function render_rows(state: StateBlock, row_list: Row[]) {
  row_list.forEach((row) => render_row(state, row)) 
}

function render_row(state: StateBlock, row: Row) {
  state.push("tr_open", "tr", 1)
  row.cells.forEach(cell => render_cell(state, cell))
  state.push("tr_close", "tr", -1)
}


const ALIGNMENT_CLASS = {
  "<": "a-l",
  "=": "a-c",
  ">": "a-r",
}


function render_cell(state: StateBlock, cell: Cell) {
  if (cell.hidden)
    return

  const tag_name = cell.format.heading ? "th" : "td"
  const tag = state.push(`${tag_name}_open`, tag_name, 1)
  add_attrs(tag, cell)
      const token    = state.push('inline', '', 0);
      token.content  = cell.content
      token.children = [];
  state.push(`${tag_name}_close`, tag_name, -1)
}

function add_attrs(tag: any, cell: Cell) {
  const fmt = cell.format

  if (cell.rowspan_count > 0)
    tag.attrSet("rowspan", cell.rowspan_count.toString())

  if (cell.colspan_count > 0)
    tag.attrSet("colspan", cell.colspan_count.toString())

  const classes = fmt.css_classes.concat([ ALIGNMENT_CLASS[fmt.alignment] ])

  tag.attrPush(["class", classes.join(" ")])
}

////////////////////////////////////////////////////////////////////////

function isTableauLine(state: StateBlock, line: number): boolean {

  if (state.sCount[line] - state.blkIndent >= 4) { 
    return false 
  }

  let pos = state.bMarks[line] + state.sCount[line]

  if (state.src.charCodeAt(pos) != PIPE)
    return false

  let end = state.eMarks[line] 

  if (state.src.charCodeAt(end) == NL)
    end--

  while (state.src.charCodeAt(end) == SPACE)
    end--

  return (state.src.charCodeAt(end) == PIPE)
}
