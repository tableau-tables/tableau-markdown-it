import * as Tableau from "js-tableau-parser";
import Marked from "marked";
declare const _default: {
    extensions: {
        name: string;
        level: string;
        start: typeof Tableau.test;
        tokenizer: typeof tokenizer;
        renderer: typeof renderer;
    }[];
};
export default _default;
interface TableauToken {
    type: 'tableau';
    raw: string;
    ast: Tableau.Ast;
}
declare type TokenizerThis = Marked.marked.TokenizerThis;
declare function tokenizer(this: TokenizerThis, src: string, _tokens: any): TableauToken | undefined;
declare type RendererThis = Marked.marked.RendererThis;
declare function renderer(this: RendererThis, table: TableauToken): string;
