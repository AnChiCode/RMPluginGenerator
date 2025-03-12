
// 定義

// TS 語言驗證
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
});

// TS 編譯設定
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
});

const libSource = `
      /** 檔案名稱 */
      const FILENAME: ?string
      /** 插件參數 */
      const PARAMETERS: { [name: string]: ?string }

      /** ［原始數據］於資料庫定義，來自 Actors.json 的可操控角色資料 */
      var $dataActors: DataActors
      /** ［原始數據］於資料庫定義，來自 Classes.json 的職業資料 */
      var $dataClasses: DataClasses
      /** ［原始數據］於資料庫定義，來自 Skills.json 的技能資料 */
      var $dataSkills: DataSkills
      /** ［原始數據］於資料庫定義，來自 Items.json 的道具資料 */
      var $dataItems: DataItems
      /** ［原始數據］於資料庫定義，來自 Weapons.json 的武器資料 */
      var $dataWeapons: DataWeapons
      /** ［原始數據］於資料庫定義，來自 Armors.json 的裝備資料 */
      var $dataArmors: DataArmors
      /** ［原始數據］於資料庫定義，來自 Enemies.json 的敵人資料 */
      var $dataEnemies: DataEnemies
      /** ［原始數據］於資料庫定義，來自 Troops.json 的敵人隊伍資料 */
      var $dataTroops: DataTroops
      /** ［原始數據］於資料庫定義，來自 States.json 的狀態資料 */
      var $dataStates: DataStates
      /** ［原始數據］於資料庫定義，來自 Animations.json 的動畫資料 */
      var $dataAnimations: DataAnimations
      /** ［原始數據］於資料庫定義，來自 Tilesets.json 的地圖圖塊資料 */
      var $dataTilesets: DataTilesets
      /** ［原始數據］於資料庫定義，來自 CommonEvents.json 的公共事件資料 */
      var $dataCommonEvents: DataCommonEvents
      /** ［原始數據］於資料庫定義，來自 System.json 的系統資料 */
      var $dataSystem: DataSystem
      /** ［原始數據］於資料庫定義，來自 MapInfos.json 的地圖資料 */
      var $dataMapInfos: DataMapInfos

      /** ［運行映射］遊戲運行中權宜放置的暫存資料 */
      var $gameTemp: Game_Temp
      /** ［運行映射］遊戲系統 */
      var $gameSystem: Game_System
      /** ［運行映射］遊戲畫面管理 */
      var $gameScreen: Game_Screen
      /** ［運行映射］計時器 */
      var $gameTimer: Game_Timer
      /** ［運行映射］文本視窗 */
      var $gameMessage: Game_Message
      /** ［運行映射］遊戲開關 */
      var $gameSwitches: Game_Switches
      /** ［運行映射］遊戲變數 */
      var $gameVariables: Game_Variables
      /** ［運行映射］事件自開關 */
      var $gameSelfSwitches: Game_SelfSwitches
      /** ［運行映射］ */
      var $gameActors: Game_Actors
      /** ［運行映射］玩家操控隊伍 */
      var $gameParty: Game_Party
      /** ［運行映射］戰鬥中的敵人隊伍 */
      var $gameTroop: Game_Troop
      /** ［運行映射］目前遊戲地圖 */
      var $gameMap: Game_Map
      /** ［運行映射］玩家操控角色 */
      var $gamePlayer: Game_Player
      
      /** ［原始數據］若為戰鬥或事件測試時執行的測試事件 */
      var $testEvent: DataEvent
      `
monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, "ts:lib/rpgmaker_source.d.ts")
monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse("ts:lib/rpgmaker_source.d.ts"))

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
            "}\n",
        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    },
    {
        label: "!command",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "設定插件指令",
        insertText: 'PluginManager.registerCommand(FILENAME, "${1:commandName}", function ({ ${2:parameters} }) {\n' +
            "\n" +
            "})\n",
        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    }
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
