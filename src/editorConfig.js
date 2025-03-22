
// 定義

// TS 語言驗證
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
})

// TS 編譯設定
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
})

fetch("https://raw.githubusercontent.com/AnChiCode/RMTypeDefines/refs/heads/main/rm_comment.d.ts")
    .then(res => res.text())
    .then(res => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(res, "ts:lib/rm_comment.d.ts")
        monaco.editor.createModel(res, "typescript", monaco.Uri.parse("ts:lib/rm_comment.d.ts"))
    })
    .catch(console.error)

// 範本
/**
 * @param {*} range 
 * @returns {{label: string, kind: *, documentation: string, insertText: string, insertTextRules: ?*, range: *}[]}
 */
const createDependencyProposals = range => [
    {
        label: "!overwrite",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "覆寫已有函數",
        insertText: "const ${1:originMethod} = ${2:Target_Class.prototype.methodName}\n" +
            "${2:Target_Class.prototype.methodName} = function (){\n" +
            "    return ${1:originMethod}.apply(this, arguments)\n" +
            "}",
        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    },
    {
        label: "!commandMZ",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "設定 MZ 插件指令",
        insertText: 'PluginManager.registerCommand(FILENAME, "${1:commandName}", function ({ ${2:parameters} }) {\n' +
            "\n" +
            "})",
        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    },
    {
        label: "!commandMV",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "設定 MV 插件指令",
        insertText: "const ${1:originMethod} = Game_Interpreter.prototype.pluginCommand\n" +
            "Game_Interpreter.prototype.pluginCommand = function (cmd, args) {\n" +
            '    if(cmd !== "${2:commandName}") return ${1:originMethod}.apply(this, arguments)\n' +
            "\n" +
            "    // your process going here..." +
            "\n" +
            "}",
        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    },
]


monaco.languages.registerCompletionItemProvider("javascript", {
    triggerCharacters: ["!"],
    provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: Math.min(0, word.startColumn - 1),
            endColumn: word.endColumn,
        }

        return {
            suggestions: createDependencyProposals(range),
        }
    },
})
