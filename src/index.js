let ORDER_AFTER_COUNT = 0
let ORDER_BEFORE_COUNT = 0
let PARAM_MAIN_LIST_COUNT = 0
let PARAM_COMBO_OPTION_COUNT = 0
let PARAM_SELECT_OPTION_COUNT = 0
let COMMAND_MAIN_LIST_COUNT = 0
let COMMAND_MAIN_PARAM_COUNT = 0
let COMMAND_PARAM_COMBO_OPTION_COUNT = 0
let COMMAND_PARAM_SELECT_OPTION_COUNT = 0

let EL_TARGET
let EL_AUTHOR
let EL_URL
let EL_HELP
let EL_DESC
let EL_BASE
let EL_BASE_AFTER_LIST
let EL_BASE_BEFORE_LIST
let EL_PARAM_ROOT
// let EL_COMMAND

let EL_RESULT

let EDITOR_COMMANDS = new Map()
let EDITOR_RESULT



// ==============================================
// Classes Fold Control
// ==============================================

/**
 * @param name {"meta" | "depen" | "parm" | "comn" | "display"}
 */
const onRootTitleClick = name => {
    const id = {
        meta: "root_meta",
        depen: "root_depen",
        parm: "root_param",
        comn: "root_command",
        display: "root_display",
    }[name]
    if (!id) return

    document
        .getElementById(id)
        ?.classList.toggle("root_fold")
}



class Fnc {
    static map(def) { return (val, fnc) => val ? fnc(val) : def }
    static chk(val, fnc, def) { return fnc(val) ? val : def }
    /**
     * @param {string} val 
     * @returns {string | false}
     */
    static getNotEmpty(val) { return val && val.length > 0 ? val : false }
    static getIsEmpty(val) { return !val || val.length === 0 }
}



// ==============================================
// Base HTML Control Function
// ==============================================

class HTMLControl {
    static getNodeFromText(html) {
        try {
            const temp = document.createElement("template")
            temp.innerHTML = html

            return temp.content.childNodes.length === 0
                ? null
                : temp.content.firstChild
        } catch (_) {
            return null
        }
    }

    static setInsertToNext(from, node) {
        from.parentNode.insertBefore(node, from.nextSibling)
    }

    static setRemoveIfExist(query) {
        document
            .querySelector(query)
            ?.remove()
    }
}



// ==============================================
// Depend Plugins HTML Control
// ==============================================
class DependencyControl {
    static getNewOrderAfterCell() {
        if (isNaN(ORDER_AFTER_COUNT)) return null

        ORDER_AFTER_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${ORDER_AFTER_COUNT}">
          <input type="text" placeholder="plugin name">
          <button type="button" class="append_order_after_plugin" onclick="DependencyControl.useAppendAfterPluginCell(${ORDER_AFTER_COUNT})">Add</button>
          <button type="button" class="delete_order_after_plugin" onclick="DependencyControl.useDeleteAfterPluginCell(${ORDER_AFTER_COUNT})">Del</button>
        </div>`)
    }

    static getNewOrderBeforeCell() {
        if (isNaN(ORDER_BEFORE_COUNT)) return null

        ORDER_BEFORE_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${ORDER_BEFORE_COUNT}">
            <input type="text" placeholder="plugin name">
            <button type="button" class="append_order_before_plugin" onclick="DependencyControl.useAppendBeforePluginCell(${ORDER_BEFORE_COUNT})">Add</button>
            <button type="button" class="delete_order_before_plugin" onclick="DependencyControl.useDeleteBeforePluginCell(${ORDER_BEFORE_COUNT})">Del</button>
          </div>`
        )
    }

    static useAppendAfterPluginCell(id) {
        const el = document.querySelector(`.after_input_list > .list_cell[data-id="${id}"]`)
        const node = DependencyControl.getNewOrderAfterCell()

        if (el && node) HTMLControl.setInsertToNext(el, node)
    }

    static useDeleteAfterPluginCell(id) {
        return HTMLControl.setRemoveIfExist(`.after_input_list > .list_cell[data-id="${id}"]`)
    }

    static useAppendBeforePluginCell(id) {
        const el = document.querySelector(`.before_input_list > .list_cell[data-id="${id}"]`)
        const node = DependencyControl.getNewOrderBeforeCell()

        if (el && node) HTMLControl.setInsertToNext(el, node)
    }

    static useDeleteBeforePluginCell(id) {
        return HTMLControl.setRemoveIfExist(`.before_input_list > .list_cell[data-id="${id}"]`)
    }

    /** @param type {"after" | "before"} */
    static useClearInputValue(type) {
        const el = document.querySelector(`.${type}_input_list > .list_cell > input`)
        if (el) el.value = ""
    }
}



// ==============================================
// Parameters HTML Control
// ==============================================

class ParameterControl {
    static onTypeChange(id) {
        const paramEl = document.querySelector(`#root_param > .param.block[data-id="${id}"]`)
        if (!paramEl) return

        const typeEl = paramEl.querySelector(`#id_${id}_param_value_type`)
        if (!typeEl) return

        paramEl
            .querySelectorAll(".group_list_cell")
            .forEach(el => el.hidden = el.dataset.type !== typeEl.value)
    }

    static onTypeIsArrayEnter(el) {
        el.setAttribute("onHover", "")
    }

    static onTypeIsArrayLeave(el) {
        el.removeAttribute("onHover")
    }

    static onTypeIsArrayClick(el) {
        el.toggleAttribute("checked")
        el.removeAttribute("onHover")
    }

    // TODO: 新產生的參數欄位，第一個多選及單選的 + - 按鈕樣式會跑版。不知道為什麼
    // 清除內容的 Clr 也是
    static getMainNode() {
        if (isNaN(PARAM_MAIN_LIST_COUNT)
            || isNaN(PARAM_COMBO_OPTION_COUNT)
            || isNaN(PARAM_SELECT_OPTION_COUNT)) return

        PARAM_MAIN_LIST_COUNT++
        PARAM_COMBO_OPTION_COUNT++
        PARAM_SELECT_OPTION_COUNT++

        return HTMLControl.getNodeFromText(
            `<div class="param block" data-id="${PARAM_MAIN_LIST_COUNT}"><span class="param_title title" onclick="ParameterControl.onMainTitleClick(${PARAM_MAIN_LIST_COUNT})">參數<span class="origin_name">(param)</span>：</span><div class="param_input data_input data"><div class="list_cell"><input class="param_input_name" type="text" placeholder="parameter name"><button type="button" class="append_parameter" onclick="ParameterControl.onMainAddClick(${PARAM_MAIN_LIST_COUNT})">Add</button><button type="button" class="delete_parameter" onclick="ParameterControl.onMainDelClick(${PARAM_MAIN_LIST_COUNT})">Del</button></div><div class="list_cell"><span class="text_title title sub_title">名稱<span class="origin_name">(text)</span>：</span><input class="param_input_display" type="text" placeholder="display name"></div><div class="list_cell"><span class="desc_title title sub_title">描述<span class="origin_name">(desc)</span>：</span><input class="param_input_desc" type="text" placeholder="descript"></div><div class="list_cell"><span class="type_title title sub_title">類型<span class="origin_name">(type)</span>：</span><select id="id_${PARAM_MAIN_LIST_COUNT}_param_value_type" class="param_input_type" onchange="ParameterControl.onTypeChange(${PARAM_MAIN_LIST_COUNT})"><option value="string">字串</option><option value="mul_string">多行字串</option><option value="number">數字</option><option value="boolean">是否</option><option value="select">單選</option><option value="combo">多選</option><option value="file">檔案</option><option value="actor">角色</option><option value="class">職業</option><option value="skill">技能</option><option value="item">道具</option><option value="weapon">武器</option><option value="armor">裝備</option><option value="enemy">敵人</option><option value="troop">敵隊</option><option value="state">狀態</option><option value="animation">動畫</option><option value="tileset">圖塊集</option><option value="common_event">公共事件</option><option value="map">地圖</option><option value="location">座標</option><option value="switch">開關</option><option value="variable">變數</option><option value="struct">自定義</option></select><span class="param_input_type_isarray" onclick="ParameterControl.onTypeIsArrayClick(this)" onmouseenter="ParameterControl.onTypeIsArrayEnter(this)" onmouseleave="ParameterControl.onTypeIsArrayLeave(this)">&nbsp;array&nbsp;</span></div><div class="list_cell"><span class="default_title title sub_title">預設值<span class="origin_name">(default)</span>：</span><input class="param_input_default" type="text" placeholder="default value"></div><div class="group_list_cell param_type_number" data-type="number" hidden><div class="list_cell"><span class="param_title title sub_title">最大值<span class="origin_name">(max)</span>：</span><input class="param_input_maximum" type="number" placeholder="maximum value"></div><div class="list_cell"><span class="param_title title sub_title">最小值<span class="origin_name">(min)</span>：</span><input class="param_input_minimum" type="number" placeholder="minimum value"></div><div class="list_cell"><span class="param_title title sub_title">小數位<span class="origin_name">(decimals)</span>：</span><input class="param_input_decimal" type="number" placeholder="decimal length"></div></div><div class="group_list_cell param_type_file" data-type="file" hidden><div class="list_cell"><span class="param_title title sub_title">資料夾<span class="origin_name">(dir)</span>：</span><input class="param_input_folder" type="text" placeholder="folder of file"></div></div><div class="group_list_cell param_type_boolean" data-type="boolean" hidden><div class="list_cell"><span class="param_title title sub_title">開啟名稱<span class="origin_name">(on)</span>：</span><input class="param_input_switchon" type="text" placeholder="display name of switch on"></div><div class="list_cell"><span class="param_title title sub_title">關閉名稱<span class="origin_name">(off)</span>：</span><input class="param_input_switchoff" type="text" placeholder="display name of switch off"></div></div><div class="group_list_cell param_type_combo" data-type="combo" hidden><div class="list_cell" data-id="${PARAM_COMBO_OPTION_COUNT}"><span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span><input class="param_input_combo_option" type="text" placeholder="option"><div><button type="button" onclick="ParameterControl.onComboAddClick(${PARAM_COMBO_OPTION_COUNT})" style="margin: 0 4px 0 0;">+</button><button type="button" onclick="ParameterControl.onComboClrClick(${PARAM_COMBO_OPTION_COUNT})">-</button></div></div></div><div class="group_list_cell param_type_select" data-type="select" hidden><div class="list_cell" data-id="${PARAM_SELECT_OPTION_COUNT}"><span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span><input class="param_input_select_name" type="text" placeholder="display name"><span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span><input class="param_input_select_value" type="text" placeholder="option value"><div><button type="button" onclick="ParameterControl.onSelectAddClick(${PARAM_SELECT_OPTION_COUNT})" style="margin: 0 4px 0 0;">+</button><button type="button" onclick="ParameterControl.onSelectClrClick(${PARAM_SELECT_OPTION_COUNT})">-</button></div></div></div><div class="list_cell"><span class="parent_title title sub_title">上級參數<span class="origin_name">(parent)</span>：</span><input class="param_input_parent" type="parent" placeholder="parent parameter name"></div></div></div>`
        )
    }

    static onMainAddClick(id) {
        const base = document.querySelector(`#root_param > .param.block[data-id="${id}"]`)
        const node = ParameterControl.getMainNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onMainDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_param > .param.block[data-id="${id}"]`)
    }

    static onMainClrClick(id) {
        const el = document.querySelector(`#root_param > .param.block[data-id="${id}"] > .param_input`)
        if (!el) return

        el
            .querySelectorAll(".param_type_combo > .list_cell:nth-child(n+2), .param_type_select > .list_cell:nth-child(n+2)")
            .forEach(e => e.remove())

        el
            .querySelectorAll("input, select")
            .forEach(e => e.nodeName === "SELECT"
                ? e.value = "string"
                : e.value = ""
            )
    }

    static onMainTitleClick(id) {
        document
            .querySelector(`#root_param > .param.block[data-id="${id}"]`)
            ?.classList.toggle("fold")
    }

    // combo
    static getComboOptionNode() {
        if (isNaN(PARAM_COMBO_OPTION_COUNT)) return null

        PARAM_COMBO_OPTION_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${PARAM_COMBO_OPTION_COUNT}">
  <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
  <input class="param_input_combo_option" type="text" placeholder="option">
  <div>
    <button type="button" onclick="ParameterControl.onComboAddClick(${PARAM_COMBO_OPTION_COUNT})" style="margin: 0 -5px 0 0;">+</button>
    <button type="button" onclick="ParameterControl.onComboDelClick(${PARAM_COMBO_OPTION_COUNT})">-</button>
  </div>
</div>`)
    }

    static onComboAddClick(id) {
        const base = document.querySelector(`#root_param .group_list_cell.param_type_combo > .list_cell[data-id="${id}"]`)
        const node = ParameterControl.getComboOptionNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onComboDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_param .group_list_cell.param_type_combo > .list_cell[data-id="${id}"]`)
    }

    static onComboClrClick(id) {
        const el = document.querySelector(`#root_param .group_list_cell.param_type_combo > .list_cell[data-id="${id}"] > input`)
        if (el) el.value = ""
    }

    // select
    static getSelectOptionNode() {
        if (isNaN(PARAM_SELECT_OPTION_COUNT)) return null

        PARAM_SELECT_OPTION_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${PARAM_SELECT_OPTION_COUNT}">
              <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
              <input class="param_input_select_name" type="text" placeholder="display name">
              <span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span>
              <input class="param_input_select_value" type="text" placeholder="option value">
              <div>
                <button type="button" onclick="ParameterControl.onSelectAddClick(${PARAM_SELECT_OPTION_COUNT})" style="margin: 0 -5px 0 0;">+</button>
                <button type="button" onclick="ParameterControl.onSelectDelClick(${PARAM_SELECT_OPTION_COUNT})">-</button>
              </div>
            </div>`)
    }

    static onSelectAddClick(id) {
        const base = document.querySelector(`#root_param .group_list_cell.param_type_select > .list_cell[data-id="${id}"]`)
        const node = ParameterControl.getSelectOptionNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onSelectDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_param .group_list_cell.param_type_select > .list_cell[data-id="${id}"]`)
    }

    static onSelectClrClick(id) {
        document
            .querySelectorAll(`#root_param .group_list_cell.param_type_select > .list_cell[data-id="${id}"] > input`)
            .forEach(e => e.value = "")
    }
}



// ==============================================
// Event Command Control
// ==============================================


class CommandControl {

    static onTypeChange(id) {
        const paramEl = document.querySelector(`#root_command .command_parameter_group[data-id="${id}"]`)
        if (!paramEl) return

        const typeEl = paramEl.querySelector(`#id_${id}_command_param_value_type`)
        if (!typeEl) return

        paramEl
            .querySelectorAll(".group_list_cell")
            .forEach(el => el.hidden = el.dataset.type !== typeEl.value)
    }

    static onTypeIsArrayClick(id) {
        document
            .querySelector(`#root_command .command_parameter_group[data-id="${id}"] .param_input_type_isarray`)
            ?.toggleAttribute("checked")
    }

    // Main
    static onMainTitleClick(id) {
        document
            .querySelector(`#root_command > .command.block[data-id="${id}"]`)
            ?.classList.toggle("fold")
    }

    static getMainNode() {
        if (isNaN(COMMAND_MAIN_LIST_COUNT)
            || isNaN(COMMAND_MAIN_PARAM_COUNT)
            || isNaN(COMMAND_PARAM_COMBO_OPTION_COUNT)
            || isNaN(COMMAND_PARAM_SELECT_OPTION_COUNT)) return

        COMMAND_MAIN_LIST_COUNT++
        COMMAND_MAIN_PARAM_COUNT++
        COMMAND_PARAM_COMBO_OPTION_COUNT++
        COMMAND_PARAM_SELECT_OPTION_COUNT++

        return HTMLControl.getNodeFromText(
            `<div class="command block" data-id="${COMMAND_MAIN_LIST_COUNT}">
        <span class="command_title title" onclick="CommandControl.onMainTitleClick(${COMMAND_MAIN_LIST_COUNT})">指令<span
            class="origin_name">(command)</span>：</span>
        <div class="command_input_list data_input data">
            <div class="list_cell">
                <input class="command_input_name" type="text" placeholder="command name">
                <button type="button" class="append_command" onclick="CommandControl.onMainAddClick(${COMMAND_MAIN_LIST_COUNT})">Add</button>
                <button type="button" class="delete_command" onclick="CommandControl.onMainDelClick(${COMMAND_MAIN_LIST_COUNT})">Del</button>
            </div>
            <div class="list_cell">
                <span class="text_title title sub_title">名稱<span class="origin_name">(text)</span>：</span>
                <input class="command_input_display" type="text" placeholder="display name">
            </div>
            <div class="list_cell">
                <span class="desc_title title sub_title">描述<span class="origin_name">(desc)</span>：</span>
                <input class="command_input_desc" type="text" placeholder="descript">
            </div>

<div class="command_parameter_group" data-id="${COMMAND_MAIN_PARAM_COUNT}">
            <div class="list_cell">
              <span class="param_title title sub_title" onclick="CommandControl.onParamTitleClick(${COMMAND_MAIN_PARAM_COUNT})">參數<span
                  class="origin_name">(arg)</span>：</span>
              <input class="param_input_name" type="text" placeholder="code name">
              <button type="button" class="append_parameter" onclick="CommandControl.onParamAddClick(${COMMAND_MAIN_PARAM_COUNT})">Add</button>
              <button type="button" class="delete_parameter" onclick="CommandControl.onParamDelClick(${COMMAND_MAIN_PARAM_COUNT})">Del</button>
            </div>
            <div class="list_cell">
              <span class="text_title title sub_title">名稱<span class="origin_name">(text)</span>：</span>
              <input class="param_input_display" type="text" placeholder="display name">
            </div>
            <div class="list_cell">
              <span class="desc_title title sub_title">描述<span class="origin_name">(desc)</span>：</span>
              <input class="param_input_desc" type="text" placeholder="descript">
            </div>
            <div class="list_cell">
              <span class="type_title title sub_title">類型<span class="origin_name">(type)</span>：</span>
              <select id="id_${COMMAND_MAIN_PARAM_COUNT}_command_param_value_type" class="param_input_type"
                onchange="CommandControl.onTypeChange(${COMMAND_MAIN_PARAM_COUNT})">
                <option value="string">字串</option>
                <option value="mul_string">多行字串</option>
                <option value="number">數字</option>
                <option value="boolean">是否</option>

                <option value="select">單選</option>
                <option value="combo">多選</option>

                <option value="file">檔案</option>

                <option value="actor">角色</option>
                <option value="class">職業</option>
                <option value="skill">技能</option>
                <option value="item">道具</option>
                <option value="weapon">武器</option>
                <option value="armor">裝備</option>
                <option value="enemy">敵人</option>
                <option value="troop">敵隊</option>
                <option value="state">狀態</option>
                <option value="animation">動畫</option>
                <option value="tileset">圖塊集</option>
                <option value="common_event">公共事件</option>
                <option value="map">地圖</option>
                <option value="location">座標</option>
                <option value="switch">開關</option>
                <option value="variable">變數</option>
                <option value="struct">自定義</option>
              </select>
              <span class="param_input_type_isarray" onclick="ParameterControl.onTypeIsArrayClick(this)"
              onmouseenter="ParameterControl.onTypeIsArrayEnter(this)"
              onmouseleave="ParameterControl.onTypeIsArrayLeave(this)">&nbsp;array&nbsp;</span>
            </div>
            <div class="list_cell">
              <span class="default_title title sub_title">預設值<span class="origin_name">(default)</span>：</span>
              <input class="param_input_default" type="text" placeholder="default value">
            </div>
            <div class="group_list_cell param_type_number" data-type="number" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">最大值<span class="origin_name">(max)</span>：</span>
                <input class="param_input_maximum" type="number" placeholder="maximum value">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">最小值<span class="origin_name">(min)</span>：</span>
                <input class="param_input_minimum" type="number" placeholder="minimum value">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">小數位<span class="origin_name">(decimals)</span>：</span>
                <input class="param_input_decimal" type="number" placeholder="decimal length">
              </div>
            </div>
            <div class="group_list_cell param_type_file" data-type="file" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">資料夾<span class="origin_name">(dir)</span>：</span>
                <input class="param_input_folder" type="text" placeholder="folder of file">
              </div>
            </div>
            <div class="group_list_cell param_type_boolean" data-type="boolean" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">開啟名稱<span class="origin_name">(on)</span>：</span>
                <input class="param_input_switchon" type="text" placeholder="display name of switch on">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">關閉名稱<span class="origin_name">(off)</span>：</span>
                <input class="param_input_switchoff" type="text" placeholder="display name of switch off">
              </div>
            </div>
            <div class="group_list_cell param_type_combo" data-type="combo" hidden>
              <div class="list_cell" data-id="${COMMAND_PARAM_COMBO_OPTION_COUNT}">
                <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
                <input class="param_input_combo_option" type="text" placeholder="option">
                <div>
                  <button type="button" onclick="CommandControl.onComboAddClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})"
                    style="margin: 0 -5px 0 0;">+</button>
                  <button type="button" onclick="CommandControl.onComboClrClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})">-</button>
                </div>
              </div>
            </div>
            <div class="group_list_cell param_type_select" data-type="select" hidden>
              <div class="list_cell" data-id="${COMMAND_PARAM_SELECT_OPTION_COUNT}">
                <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
                <input class="param_input_select_name" type="text" placeholder="display name">
                <span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span>
                <input class="param_input_select_value" type="text" placeholder="option value">
                <div>
                  <button type="button" onclick="CommandControl.onSelectAddClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})"
                    style="margin: 0 -5px 0 0;">+</button>
                  <button type="button" onclick="CommandControl.onSelectClrClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})">-</button>
                </div>
              </div>
            </div>
          </div>

          <div class="list_cell">
            <div id="id_${COMMAND_MAIN_LIST_COUNT}_command_editor" style="height: 200px; width: 100%;"></div>
          </div>
        </div>
      </div>`
        )
    }

    static onMainAddClick(id) {
        const base = document.querySelector(`#root_command > .command.block[data-id="${id}"]`)
        const node = CommandControl.getMainNode()

        if (!base || !node) return

        HTMLControl.setInsertToNext(base, node)
        EDITOR_COMMANDS.set(`id_${COMMAND_MAIN_LIST_COUNT}_command_editor`, monaco.editor.create(
            document.getElementById(`id_${COMMAND_MAIN_LIST_COUNT}_command_editor`),
            {
                value: "// here is function body",
                language: "javascript",
                theme: "vs-dark",
                automaticLayout: true,
            },
        ))
    }

    static onMainDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_command > .command.block[data-id="${id}"]`)
    }

    static onMainClrClick(id) {
        const el = document.querySelector(`#root_command > .command.block[data-id="${id}"] > .command_input_list`)

        el
            .querySelectorAll(
                ".command_parameter_group:nth-child(n+2), .param_type_combo > .list_cell:nth-child(n+2), .param_type_select > .list_cell:nth-child(n+2)"
            )
            .forEach(e => e.remove())

        el
            .querySelectorAll("input, select")
            .forEach(e => e.nodeName === "SELECT"
                ? e.value = "string"
                : e.value = ""
            )
    }

    // Param
    static onParamTitleClick(id) {
        document
            .querySelector(`#root_command > .command.block .command_parameter_group[data-id="${id}"]`)
            ?.classList.toggle("fold")
    }

    static getParamNode() {
        if (isNaN(COMMAND_MAIN_PARAM_COUNT)
            || isNaN(COMMAND_PARAM_COMBO_OPTION_COUNT)
            || isNaN(COMMAND_PARAM_SELECT_OPTION_COUNT)) return

        COMMAND_MAIN_PARAM_COUNT++
        COMMAND_PARAM_COMBO_OPTION_COUNT++
        COMMAND_PARAM_SELECT_OPTION_COUNT++

        return HTMLControl.getNodeFromText(
            `<div class="command_parameter_group" data-id="${COMMAND_MAIN_PARAM_COUNT}">
            <div class="list_cell">
              <span class="param_title title sub_title" onclick="CommandControl.onParamTitleClick(${COMMAND_MAIN_PARAM_COUNT})">參數<span
                  class="origin_name">(arg)</span>：</span>
              <input class="param_input_name" type="text" placeholder="code name">
              <button type="button" class="append_parameter" onclick="CommandControl.onParamAddClick(${COMMAND_MAIN_PARAM_COUNT})">Add</button>
              <button type="button" class="delete_parameter" onclick="CommandControl.onParamDelClick(${COMMAND_MAIN_PARAM_COUNT})">Del</button>
            </div>
            <div class="list_cell">
              <span class="text_title title sub_title">名稱<span class="origin_name">(text)</span>：</span>
              <input class="param_input_display" type="text" placeholder="display name">
            </div>
            <div class="list_cell">
              <span class="desc_title title sub_title">描述<span class="origin_name">(desc)</span>：</span>
              <input class="param_input_desc" type="text" placeholder="descript">
            </div>
            <div class="list_cell">
              <span class="type_title title sub_title">類型<span class="origin_name">(type)</span>：</span>
              <select id="id_${COMMAND_MAIN_PARAM_COUNT}_command_param_value_type" class="param_input_type"
                onchange="CommandControl.onTypeChange(${COMMAND_MAIN_PARAM_COUNT})">
                <option value="string">字串</option>
                <option value="mul_string">多行字串</option>
                <option value="number">數字</option>
                <option value="boolean">是否</option>
                <option value="select">單選</option>
                <option value="combo">多選</option>
                <option value="file">檔案</option>
                <option value="actor">角色</option>
                <option value="class">職業</option>
                <option value="skill">技能</option>
                <option value="item">道具</option>
                <option value="weapon">武器</option>
                <option value="armor">裝備</option>
                <option value="enemy">敵人</option>
                <option value="troop">敵隊</option>
                <option value="state">狀態</option>
                <option value="animation">動畫</option>
                <option value="tileset">圖塊集</option>
                <option value="common_event">公共事件</option>
                <option value="map">地圖</option>
                <option value="location">座標</option>
                <option value="switch">開關</option>
                <option value="variable">變數</option>
                <option value="struct">自定義</option>
              </select>
              <span class="param_input_type_isarray" onclick="ParameterControl.onTypeIsArrayClick(this)"
              onmouseenter="ParameterControl.onTypeIsArrayEnter(this)"
              onmouseleave="ParameterControl.onTypeIsArrayLeave(this)">&nbsp;array&nbsp;</span>
            </div>
            <div class="list_cell">
              <span class="default_title title sub_title">預設值<span class="origin_name">(default)</span>：</span>
              <input class="param_input_default" type="text" placeholder="default value">
            </div>
            <div class="group_list_cell param_type_number" data-type="number" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">最大值<span class="origin_name">(max)</span>：</span>
                <input class="param_input_maximum" type="number" placeholder="maximum value">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">最小值<span class="origin_name">(min)</span>：</span>
                <input class="param_input_minimum" type="number" placeholder="minimum value">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">小數位<span class="origin_name">(decimals)</span>：</span>
                <input class="param_input_decimal" type="number" placeholder="decimal length">
              </div>
            </div>
            <div class="group_list_cell param_type_file" data-type="file" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">資料夾<span class="origin_name">(dir)</span>：</span>
                <input class="param_input_folder" type="text" placeholder="folder of file">
              </div>
            </div>
            <div class="group_list_cell param_type_boolean" data-type="boolean" hidden>
              <div class="list_cell">
                <span class="param_title title sub_title">開啟名稱<span class="origin_name">(on)</span>：</span>
                <input class="param_input_switchon" type="text" placeholder="display name of switch on">
              </div>
              <div class="list_cell">
                <span class="param_title title sub_title">關閉名稱<span class="origin_name">(off)</span>：</span>
                <input class="param_input_switchoff" type="text" placeholder="display name of switch off">
              </div>
            </div>
            <div class="group_list_cell param_type_combo" data-type="combo" hidden>
              <div class="list_cell" data-id="${COMMAND_PARAM_COMBO_OPTION_COUNT}">
                <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
                <input class="param_input_combo_option" type="text" placeholder="option">
                <div>
                  <button type="button" onclick="CommandControl.onComboAddClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})"
                    style="margin: 0 -5px 0 0;">+</button>
                  <button type="button" onclick="CommandControl.onComboClrClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})">-</button>
                </div>
              </div>
            </div>
            <div class="group_list_cell param_type_select" data-type="select" hidden>
              <div class="list_cell" data-id="${COMMAND_PARAM_SELECT_OPTION_COUNT}">
                <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
                <input class="param_input_select_name" type="text" placeholder="display name">
                <span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span>
                <input class="param_input_select_value" type="text" placeholder="option value">
                <div>
                  <button type="button" onclick="CommandControl.onSelectAddClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})"
                    style="margin: 0 -5px 0 0;">+</button>
                  <button type="button" onclick="CommandControl.onSelectClrClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})">-</button>
                </div>
              </div>
            </div>
          </div>`)
    }

    static onParamAddClick(id) {
        const base = document.querySelector(`#root_command .command_parameter_group[data-id="${id}"]`)
        const node = CommandControl.getParamNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onParamDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_command .command_parameter_group[data-id="${id}"]`)
    }

    static onParamClrClick(id) {
        const el = document.querySelector(`#root_command > .command.block > .command_input_list > .command_parameter_group[data-id="${id}"]`)

        el
            .querySelectorAll(".param_type_combo > .list_cell:nth-child(n+2), .param_type_select > .list_cell:nth-child(n+2)")
            .forEach(e => e.remove())

        el
            .querySelectorAll("input, select")
            .forEach(e => e.nodeName === "SELECT"
                ? e.value = "string"
                : e.value = ""
            )
    }

    // TypeCombo
    static getComboOptionNode() {
        if (isNaN(COMMAND_PARAM_COMBO_OPTION_COUNT)) return null

        COMMAND_PARAM_COMBO_OPTION_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${COMMAND_PARAM_COMBO_OPTION_COUNT}">
  <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
  <input class="param_input_combo_option" type="text" placeholder="option">
  <div>
    <button type="button" onclick="CommandControl.onComboAddClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})" style="margin: 0 -5px 0 0;">+</button>
    <button type="button" onclick="CommandControl.onComboDelClick(${COMMAND_PARAM_COMBO_OPTION_COUNT})">-</button>
  </div>
</div>`)
    }

    static onComboAddClick(id) {
        const base = document.querySelector(`#root_command .param_type_combo > .list_cell[data-id="${id}"]`)
        const node = CommandControl.getComboOptionNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onComboDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_command .param_type_combo > .list_cell[data-id="${id}"]`)
    }

    static onComboClrClick(id) {
        const el = document.querySelector(`#root_command .param_type_combo > .list_cell[data-id="${id}"]`)
        if (el) el.value = ""
    }

    // TypeSelect
    static getSelectOptionNode() {
        if (isNaN(COMMAND_PARAM_SELECT_OPTION_COUNT)) return null

        COMMAND_PARAM_SELECT_OPTION_COUNT++
        return HTMLControl.getNodeFromText(
            `<div class="list_cell" data-id="${COMMAND_PARAM_SELECT_OPTION_COUNT}">
              <span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span>
              <input class="param_input_select_name" type="text" placeholder="display name">
              <span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span>
              <input class="param_input_select_value" type="text" placeholder="option value">
              <div>
                <button type="button" onclick="CommandControl.onSelectAddClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})" style="margin: 0 -5px 0 0;">+</button>
                <button type="button" onclick="CommandControl.onSelectDelClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})">-</button>
              </div>
            </div>`)
    }

    static onSelectAddClick(id) {
        const base = document.querySelector(`#root_command .param_type_select > .list_cell[data-id="${id}"]`)
        const node = CommandControl.getSelectOptionNode()

        if (base && node) HTMLControl.setInsertToNext(base, node)
    }

    static onSelectDelClick(id) {
        HTMLControl.setRemoveIfExist(`#root_command .param_type_select > .list_cell[data-id="${id}"]`)
    }

    static onSelectClrClick(id) {
        const el = document.querySelector(`#root_command .param_type_select > .list_cell[data-id="${id}"]`)
        if (el) el.value = ""
    }
}



// ==============================================
// Build Plugin From Setting
// ==============================================

class BasicInfoBuilder {

    static get getIsTargetMZ() { return EL_TARGET?.checked || false }
    static get getAuthor() { return Fnc.getNotEmpty(EL_AUTHOR?.value) }
    static get getURL() { return Fnc.getNotEmpty(EL_URL?.value) }
    static get getHelp() { return Fnc.getNotEmpty(EL_HELP?.value) }
    static get getDesc() { return Fnc.getNotEmpty(EL_DESC?.value) }

    static getMetadata() {
        const map = Fnc.map("")

        const isMZ = map(BasicInfoBuilder.getIsTargetMZ, () => "\n * @target MZ")
        const author = map(BasicInfoBuilder.getAuthor, v => `\n * @author ${v}`)
        const url = map(BasicInfoBuilder.getURL, v => `\n * @url ${v}`)
        const help = map(BasicInfoBuilder.getHelp, v => `\n * @help ${v}`)
        const desc = map(BasicInfoBuilder.getDesc, v => `\n * @plugindesc ${v.replaceAll("\n", "\n * ")}`)

        return Fnc.getNotEmpty(isMZ + author + url + help + desc)
    }

    static get getBaseDepend() { return Fnc.getNotEmpty(EL_BASE?.value) }
    static getOrderDependPlugins(elList) {
        if (!elList) return false

        const ls = [...elList.querySelectorAll(".list_cell > input")]
            .map(el => el.value)
            .filter(Fnc.getNotEmpty)

        return ls.length === 0 ? false : ls
    }

    static getDependency() {
        const map = Fnc.map("")

        const base = map(BasicInfoBuilder.getBaseDepend, v => `\n * @base ${v}`)
        const after = map(BasicInfoBuilder.getOrderDependPlugins(EL_BASE_AFTER_LIST), v => `\n * @orderAfter ${v.join("\n * @orderAfter ")}`)
        const before = map(BasicInfoBuilder.getOrderDependPlugins(EL_BASE_BEFORE_LIST), v => `\n * @orderBefore ${v.join("\n * @orderBefore ")}`)

        return Fnc.getNotEmpty(base + after + before)
    }

    static build() {
        return Fnc.getNotEmpty(
            [BasicInfoBuilder.getMetadata(), BasicInfoBuilder.getDependency(),]
                .filter(v => v)
                .join("\n * ")
        )
    }
}

class ParameterBuilder {
    static getChildValueIfExist(node) {
        return className =>
            Fnc.getNotEmpty(node.getElementsByClassName(className)[0]?.value)
    }

    /** @return {[string, string | false][] | null} */
    static getSelectDetail(el) {
        const selectOptions = el.querySelectorAll(".group_list_cell.param_type_select > .list_cell")
        if (selectOptions.length === 0) return null

        return [...selectOptions]
            .flatMap(list => {
                const opt = Fnc.getIsEmpty(list.getElementsByClassName("param_input_select_name")[0]?.value)
                const val = Fnc.getIsEmpty(list.getElementsByClassName("param_input_select_value")[0]?.value)
                if (!opt || !val) return []

                return [
                    ["option", opt],
                    ["value", val],
                ]
            })
    }

    /** @return {[string, string | false][] | null} */
    static getComboDetail(el) {
        const comboOptions = el.querySelectorAll(".group_list_cell.param_type_combo > .list_cell")
        if (comboOptions.length === 0) return null

        return [...comboOptions]
            .map(list => {
                const opt = list.getElementsByClassName("param_input_combo_option")[0]?.value
                return ["option", Fnc.getNotEmpty(opt)]
            })
    }

    static getDetailByType(el, type) {
        const prepareGetValue = ParameterBuilder.getChildValueIfExist(el)

        let ls = null
        switch (type) {
            case "number": ls = [
                ["max", prepareGetValue("param_input_maximum"),],
                ["min", prepareGetValue("param_input_minimum"),],
                ["decimals", prepareGetValue("param_input_decimal"),],
            ]
                break
            case "boolean": ls = [
                ["on", prepareGetValue("param_input_switchon")],
                ["off", prepareGetValue("param_input_switchoff")],
            ]
                break
            case "select":
                ls = ParameterBuilder.getSelectDetail(el)
                break
            case "combo":
                ls = ParameterBuilder.getComboDetail(el)
                break
            case "file": ls = [
                ["dir", prepareGetValue("param_input_folder")]
            ]
                break

            default: break
        }

        if (!ls) return false

        const res = ls
            .filter(([_, v]) => v)
            .map(([n, v]) => `\n * @${n} ${v}`)
            .join("")

        return res === "" ? false : res
    }

    static getTypeAttr(type, isArray) {
        const arr = isArray ? "[]" : ""
        const typ = type === "struct" ? "struct<>" : type

        return `\n * @type ${typ}${arr}`
    }

    static buildSingleParam(root) {
        const prepareGetValue = ParameterBuilder.getChildValueIfExist(root)

        const param = prepareGetValue("param_input_name")
        if (!param) return

        const type = prepareGetValue("param_input_type")
        const details = ParameterBuilder.getDetailByType(root, type)
        const isArrayEl = root.getElementsByClassName("param_input_type_isarray")[0]
        const isArray = isArrayEl ? isArrayEl.hasAttribute("checked") : false

        return "\n * "
            + [
                ["param", param],
                ["parent", prepareGetValue("param_input_parent")],
                ["type", ParameterBuilder.getTypeAttr(type, isArray)],
                ["default", prepareGetValue("param_input_default")],
                ["details", details],
                ["text", prepareGetValue("param_input_display")],
                ["desc", prepareGetValue("param_input_desc")],
            ]
                .filter(([_, v]) => v)
                .map(([n, v]) => {
                    if (n === "details" || n === "type") return v

                    return `\n * @${n} ${v}`
                })
                .join("")
    }

    static build() {
        if (!EL_PARAM_ROOT) return false

        const ls = [...EL_PARAM_ROOT.querySelectorAll("div.param.block")]
            .map(ParameterBuilder.buildSingleParam)
            .join("")

        return ls === "" ? false : ls
    }
}



class CommandBuilder {
    static buildBlockParams(block) {
        return [...block.getElementsByClassName("command_parameter_group")]
            .map(ParameterBuilder.buildSingleParam)
            .join("")
    }

    static getAllParamsName(block) {
        return [...block.querySelectorAll(".param_input_name")].map(e => e.value).join(", ")
    }

    static buildBlockCode(id, name, paramsName) {
        const body = EDITOR_COMMANDS.get(`id_${id}_command_editor`)?.getValue() || ""

        return `
    PluginManager.registerCommand(filename, "${name}", function ({ ${paramsName} }){
        ${body.replaceAll("\r\n", "\r\n        ")}
    })`
    }

    static buildSingleBlock(block) {
        const name = block.querySelector(".command_input_name")?.value
        if (Fnc.getIsEmpty(name)) return false

        const text = block.querySelector(".command_input_display")?.value || ""
        const desc = block.querySelector(".command_input_desc")?.value || ""

        const params = CommandBuilder.buildBlockParams(block)

        const paramsName = CommandBuilder.getAllParamsName(block) // params.map(p => p.name).join(", ")
        const code = CommandBuilder.buildBlockCode(block.dataset.id, name, paramsName)

        return {
            note: "\n * "
                + [
                    ["command", name],
                    ["text", text],
                    ["desc", desc],
                    ["params", params],
                ].map(([n, v]) => {
                    if (n === "params") return v
                    return `\n * @${n} ${v}`
                }).join(""),
            code
        }
    }

    static build() {
        return [...document.querySelectorAll("#root_command > div.command.block")]
            .map(CommandBuilder.buildSingleBlock)
            .reduce((all, cur) => {
                if (!cur) return all

                all[0] += cur.note
                all[1] += cur.code + "\n"
                return all
            }, ["", ""])
    }
}

class Builder {
    static useDownloadFile(data) {
        const file = new Blob([data], { type: "text/javascript" })

        if (window?.navigator?.msSaveOrOpenBlob)
            return void window.navigator.msSaveOrOpenBlob(file, "plugin.js")

        const a = document.createElement("a")
        const url = URL.createObjectURL(file)

        a.href = url
        a.download = "plugin.js"
        a.style.display = "none"

        document.body.appendChild(a)
        a.click()

        setTimeout(() => {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }

    static onDownloadClick() {
        if (!EDITOR_RESULT) return

        const code = EDITOR_RESULT.getValue()
        Builder.useDownloadFile(code)
    }

    static build() {
        const [commandsNote, commandsCode] = CommandBuilder.build()
        const code = commandsCode.length > 0
            ? `\n(()=>{
    const filename = document.currentScript.src.split("/").pop().replace(".js", "")

    ${commandsCode}
})()`
            : ""

        return "/**:"
            + [
                BasicInfoBuilder.build(),
                ParameterBuilder.build(),
                commandsNote,
            ]
                .filter(Fnc.getNotEmpty)
                .join("")
            + "\n */"
            + code
            + "\n"
    }

    static setBuildResult() {
        if (!EL_RESULT) return

        const res = Builder.build()
        EDITOR_RESULT.setValue(res)
    }

    static setCopyToClipBoard() {
        if (!EDITOR_RESULT) return

        navigator.clipboard.writeText(EDITOR_RESULT.getValue())
            .then(() => console.log("ok"))
            .catch(console.error)
    }

}



// ==============================================
// Monaco Editor
// ==============================================

// TODO: 抄自範例，還沒看文檔
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



// ==============================================
// Entery Point
// ==============================================

window.addEventListener("load", () => {
    EL_TARGET = document.querySelector(".target_input > input")
    EL_AUTHOR = document.querySelector(".author_input > input")
    EL_URL = document.querySelector("url_input > input")
    EL_HELP = document.querySelector(".help_input > input")
    EL_DESC = document.querySelector(".desc_input > textarea")
    EL_BASE = document.querySelector(".base_input > input")
    EL_BASE_AFTER_LIST = document.querySelector(".after_input_list")
    EL_BASE_BEFORE_LIST = document.querySelector(".before_input_list")
    EL_PARAM_ROOT = document.querySelector("#root_param")
    // EL_COMMAND = document.querySelector("#root_command")

    EL_RESULT = document.querySelector("#display_plugin > textarea")

    EDITOR_RESULT = monaco.editor.create(
        document.getElementById("monaco_build_display"),
        {
            value: "",
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true,
        },
    )

    EDITOR_COMMANDS.set("id_0_command_editor", monaco.editor.create(
        document.getElementById("id_0_command_editor"),
        {
            value: "// here is function body",
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true,
        },
    ))
})
