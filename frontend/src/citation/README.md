# Mark

- Marks doesn't have `addNodeView`, and using renderHTML is not the "right" way to do it

# Node

- `setNode` only supports text block nodes, have to use this alternate way instead

  ```js
  const { from, to } = view.state.selection;
  const text = state.doc.textBetween(from, to, "");
  const textNode = editor.schema.text(text);
  const citationNode = editor.schema.nodes.citation
    .create
    //...
    ()
    .toJSON();

  return commands.insertContent(citationNode);
  ```
