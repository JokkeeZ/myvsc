import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  let editor: vscode.TextEditor;

  setup(async () => {
    await vscode.extensions.getExtension("joel.myvsc")!.activate();

    require("path").dirname("asd");

    const doc = await vscode.workspace.openTextDocument({
      content: [
        "'Item1'",
        "Item2",
        "Item3",
        "Item4",
        "This line wiLl have all of its Words _capitAlized.",
        "Numbered1",
        "Numbered2",
        "Numbered3",
        "Text",
        "Text",
        "Text",
        "Item1",
        "Text",
        "Text",
      ].join("\n"),
    });

    editor = await vscode.window.showTextDocument(doc);
  });

  test("should remove quotes from selection", async () => {
    const line = editor.document.lineAt(0);
    editor.selections = [
      new vscode.Selection(line.range.start, line.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.removeQuotesFromSelection");

    assert.equal(editor.document.getText(editor.selection), "Item1");
  });

  test("should wrap selection in quotes", async () => {
    const line = editor.document.lineAt(1);
    editor.selections = [
      new vscode.Selection(line.range.start, line.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.wrapSelectionInQuotes");

    assert.equal(editor.document.getText(editor.selection), "'Item2'");
  });

  test("should reverse selected text", async () => {
    const line = editor.document.lineAt(2);
    editor.selections = [
      new vscode.Selection(line.range.start, line.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.reverseSelectionText");

    assert.equal(editor.document.getText(editor.selection), "3metI");
  });

  test("should capitalize all words", async () => {
    const line = editor.document.lineAt(4);

    editor.selections = [
      new vscode.Selection(line.range.start, line.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.capitalizeSelectionWords");

    assert.equal(
      editor.document.getText(editor.selection),
      "This Line WiLl Have All Of Its Words _capitAlized."
    );
  });

  test("should make numbered list", async () => {
    const startingLine = editor.document.lineAt(5);
    const endingLine = editor.document.lineAt(7);

    editor.selections = [
      new vscode.Selection(startingLine.range.start, endingLine.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.numberedListFromSelection");

    const eol = editor.document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";

    assert.equal(
      editor.document.getText(editor.selection),
      ["1) Numbered1", "2) Numbered2", "3) Numbered3"].join(eol)
    );
  });

  test("should add cursor to all matches", async () => {
    const line = editor.document.lineAt(8);

    editor.selections = [
      new vscode.Selection(line.range.start, line.range.end),
    ];

    await vscode.commands.executeCommand("myvsc.cursorToAllMatches");

    assert.equal(editor.selections.length, 5);
    assert.equal(editor.selections[0].start.line, 8);
    assert.equal(editor.selections[1].start.line, 9);
    assert.equal(editor.selections[2].start.line, 10);
    assert.equal(editor.selections[3].start.line, 12);
    assert.equal(editor.selections[4].start.line, 13);
  });
});
