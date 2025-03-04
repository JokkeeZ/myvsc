import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("[myvsc] activated.");

  const unquoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.unquote",
    (editor, edit) => removeQuotesFromSelection(editor, edit)
  );

  const quoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.quote",
    (editor, edit) => wrapSelectionInQuotes(editor, edit)
  );

  const reverseDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.reverse",
    (editor, edit) => reverseSelectionText(editor, edit)
  );

  const capitalizeDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.capitalize",
    (editor, edit) => capitalizeSelectionWords(editor, edit)
  );

  const numberedListFromSelectionDisposable =
    vscode.commands.registerTextEditorCommand(
      "myvsc.numbered_list",
      (editor, edit) => numberedListFromSelection(editor, edit)
    );

  context.subscriptions.push(
    unquoteDisposable,
    quoteDisposable,
    reverseDisposable,
    capitalizeDisposable,
    numberedListFromSelectionDisposable
  );
}

function removeQuotesFromSelection(
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

function wrapSelectionInQuotes(
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

function reverseSelectionText(
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

function capitalizeSelectionWords(
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

function numberedListFromSelection(
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
