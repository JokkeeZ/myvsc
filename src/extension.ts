import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('[myvsc] activated.');

  const unquoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.unquote",
    (editor, edit) => unquoteSelection(editor, edit)
  );

  const quoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.quote",
    (editor, edit) => quoteSelection(editor, edit)
  );

  const reverseDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.reverse",
    (editor, edit) => reverseSelection(editor, edit)
  );

  const capitalizeDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.capitalize",
    (editor, edit) => capitalizeSelection(editor, edit)
  );

  const numberedListFromSelectionDisposable =
    vscode.commands.registerTextEditorCommand(
      "myvsc.numbered_list",
      (editor, edit) => numeredListFromSelection(editor, edit)
    );

  context.subscriptions.push(
    unquoteDisposable,
    quoteDisposable,
    reverseDisposable,
    capitalizeDisposable,
    numberedListFromSelectionDisposable
  );
}

function unquoteSelection(
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit
) {
  editor.selections.map((selection) => {
    if (selection.isEmpty) {
      return;
    }

    const text = editor.document.getText(selection);
    const unquoted = text
      .replaceAll("'", "")
      .replaceAll('"', "")
      .replaceAll("`", "");

    edit.replace(selection, unquoted);
  });
}

function quoteSelection(
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit
) {
  editor.selections.map((selection) => {
    if (selection.isEmpty) {
      return;
    }

    const text = editor.document.getText(selection);
    const c = text.includes("'") ? '"' : "'";

    edit.replace(selection, c + text + c);
  });
}

function reverseSelection(
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit
) {
  editor.selections.map((selection) => {
    if (selection.isEmpty) {
      return;
    }

    const text = editor.document.getText(selection);
    edit.replace(selection, [...text].reverse().join(""));
  });
}

function capitalizeSelection(
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit
) {
  editor.selections.map((selection) => {
    if (selection.isEmpty) {
      return;
    }

    const text = editor.document.getText(selection);
    edit.replace(
      selection,
      text.replace(/\b\w/g, (c) => c.toUpperCase())
    );
  });
}

function numeredListFromSelection(
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit
) {
  editor.selections.map((selection) => {
    if (selection.isEmpty) {
      return;
    }

    const text = editor.document.getText(selection);
    const lines = text.split("\n");

    let i = 1;
    const modified = lines.map((l) => `${i++}) ` + l);

    edit.replace(selection, modified.join("\n"));
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
