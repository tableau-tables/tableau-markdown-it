# Extended Table Syntax for Markdown

[Tableau Tables](https://tableau-tables.github.io) gives you way more control 
over the tables you create in Markdown documents. `tableau-markdown-it` is the version of Tableau 
for the Markdown-It processor.

#### Headers

* Headerless tables
* Multiline headers
* Multiple separate headers
* Headers in columns and rows
* Captions

#### Layout

* Layout uses CSS styles and not inline attributes (making it easier to
  change the style of a whole document)
* Per cell alignment and CSS classes
* Default attributes, both down columns and across rows
* Table-wide classes
* Row and column span
* Continuation lines

Here are [some samples](https://tableau-tables.github.io/samples/).

## Installation

1. Install the extension:

   ~~~ console
   $  yarn add -S tableau-markdown-it       (npm i -S tableau-markdown-it)
   ~~~

2. Tell Marked to use it:

   ~~~ js
   const md  = require("markdown-it")
   const tableau = require("tableau-markdown-it") 
   md.use(tableau)
   // ...
   md.render(your_document)
   ~~~

## Writing Tables Using Tableau Tables

Pop on over to the [documentation site](https://tableau-tables.github.io).
