import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("[myvsc] activated.");

  const unquoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.removeQuotesFromSelection",
    (editor, edit) => removeQuotesFromSelection(editor, edit)
  );

  const quoteDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.wrapSelectionInQuotes",
    (editor, edit) => wrapSelectionInQuotes(editor, edit)
  );

  const reverseDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.reverseSelectionText",
    (editor, edit) => reverseSelectionText(editor, edit)
  );

  const capitalizeDisposable = vscode.commands.registerTextEditorCommand(
    "myvsc.capitalizeSelectionWords",
    (editor, edit) => capitalizeSelectionWords(editor, edit)
  );

  const numberedListFromSelectionDisposable =
    vscode.commands.registerTextEditorCommand(
      "myvsc.numberedListFromSelection",
      (editor, edit) => numberedListFromSelection(editor, edit)
    );

  const cursorToallMatchesDisposable =
    vscode.commands.registerTextEditorCommand(
      "myvsc.cursorToAllMatches",
      (editor) => cursorToAllMatches(editor)
    );

  context.subscriptions.push(
    unquoteDisposable,
    quoteDisposable,
    reverseDisposable,
    capitalizeDisposable,
    numberedListFromSelectionDisposable,
    cursorToallMatchesDisposable
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

function cursorToAllMatches(editor: vscode.TextEditor) {
  if (editor.selection.isEmpty) {
    return;
  }

  const text = editor.document.getText();
  const regex = new RegExp(editor.document.getText(editor.selection), "g");

  const matches = [...text.matchAll(regex)];
  const positions = matches.map((match) =>
    editor.document.positionAt(match.index)
  );

  if (positions.length === 0) {
    vscode.window.showInformationMessage("No matches found.");
    return;
  }

  editor.selections = positions.map((pos) => new vscode.Selection(pos, pos));
}

export function deactivate() {}
