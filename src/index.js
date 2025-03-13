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
    static getIfNotEmpty(val) { return val && val.length > 0 ? val : false }
    static getIsEmpty(val) { return !val || val.length === 0 }

    /**
     * @param {HTMLInputElement} node 
     * @returns {boolean}
     */
    static getInputIsMatch(node) {
        return node?.validity && node.validity.patternMismatch === false
    }
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
            `<div class="param block" data-id="${PARAM_MAIN_LIST_COUNT}"><span class="param_title title" onclick="ParameterControl.onMainTitleClick(${PARAM_MAIN_LIST_COUNT})">參數<span class="origin_name">(param)</span>：</span><div class="param_input data_input data"><div class="list_cell"><input class="param_input_name" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" type="text" placeholder="parameter name"><button type="button" class="append_parameter" onclick="ParameterControl.onMainAddClick(${PARAM_MAIN_LIST_COUNT})">Add</button><button type="button" class="delete_parameter" onclick="ParameterControl.onMainClrClick(${PARAM_MAIN_LIST_COUNT})">Clr</button><button type="button" class="delete_parameter" onclick="ParameterControl.onMainDelClick(${PARAM_MAIN_LIST_COUNT})">Del</button></div><div class="list_cell"><span class="text_title title sub_title">名稱<span class="origin_name">(text)</span>：</span><input class="param_input_display" type="text" placeholder="display name"></div><div class="list_cell"><span class="desc_title title sub_title">描述<span class="origin_name">(desc)</span>：</span><input class="param_input_desc" type="text" placeholder="descript"></div><div class="list_cell"><span class="type_title title sub_title">類型<span class="origin_name">(type)</span>：</span><select id="id_${PARAM_MAIN_LIST_COUNT}_param_value_type" class="param_input_type" onchange="ParameterControl.onTypeChange(${PARAM_MAIN_LIST_COUNT})"><option value="string">字串</option><option value="mul_string">多行字串</option><option value="number">數字</option><option value="boolean">是否</option><option value="select">單選</option><option value="combo">多選</option><option value="file">檔案</option><option value="actor">角色</option><option value="class">職業</option><option value="skill">技能</option><option value="item">道具</option><option value="weapon">武器</option><option value="armor">裝備</option><option value="enemy">敵人</option><option value="troop">敵隊</option><option value="state">狀態</option><option value="animation">動畫</option><option value="tileset">圖塊集</option><option value="common_event">公共事件</option><option value="map">地圖</option><option value="location">座標</option><option value="switch">開關</option><option value="variable">變數</option><option value="struct">自定義</option></select><span class="param_input_type_isarray" onclick="ParameterControl.onTypeIsArrayClick(this)" onmouseenter="ParameterControl.onTypeIsArrayEnter(this)" onmouseleave="ParameterControl.onTypeIsArrayLeave(this)">&nbsp;array&nbsp;</span></div><div class="list_cell"><span class="default_title title sub_title">預設值<span class="origin_name">(default)</span>：</span><input class="param_input_default" type="text" placeholder="default value"></div><div class="group_list_cell param_type_number" data-type="number" hidden><div class="list_cell"><span class="param_title title sub_title">最大值<span class="origin_name">(max)</span>：</span><input class="param_input_maximum" type="number" placeholder="maximum value"></div><div class="list_cell"><span class="param_title title sub_title">最小值<span class="origin_name">(min)</span>：</span><input class="param_input_minimum" type="number" placeholder="minimum value"></div><div class="list_cell"><span class="param_title title sub_title">小數位<span class="origin_name">(decimals)</span>：</span><input class="param_input_decimal" type="number" placeholder="decimal length"></div></div><div class="group_list_cell param_type_file" data-type="file" hidden><div class="list_cell"><span class="param_title title sub_title">資料夾<span class="origin_name">(dir)</span>：</span><input class="param_input_folder" type="text" placeholder="folder of file"></div></div><div class="group_list_cell param_type_boolean" data-type="boolean" hidden><div class="list_cell"><span class="param_title title sub_title">開啟名稱<span class="origin_name">(on)</span>：</span><input class="param_input_switchon" type="text" placeholder="display name of switch on"></div><div class="list_cell"><span class="param_title title sub_title">關閉名稱<span class="origin_name">(off)</span>：</span><input class="param_input_switchoff" type="text" placeholder="display name of switch off"></div></div><div class="group_list_cell param_type_combo" data-type="combo" hidden><div class="list_cell" data-id="${PARAM_COMBO_OPTION_COUNT}"><span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span><input class="param_input_combo_option" type="text" placeholder="option"><div><button type="button" onclick="ParameterControl.onComboAddClick(${PARAM_COMBO_OPTION_COUNT})" style="margin: 0 4px 0 0;">+</button><button type="button" onclick="ParameterControl.onComboClrClick(${PARAM_COMBO_OPTION_COUNT})">-</button></div></div></div><div class="group_list_cell param_type_select" data-type="select" hidden><div class="list_cell" data-id="${PARAM_SELECT_OPTION_COUNT}"><span class="param_title title sub_title">選項<span class="origin_name">(option)</span>：</span><input class="param_input_select_name" type="text" placeholder="display name"><span class="param_title title sub_title">實際值<span class="origin_name">(value)</span>：</span><input class="param_input_select_value" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="option value"><div><button type="button" onclick="ParameterControl.onSelectAddClick(${PARAM_SELECT_OPTION_COUNT})" style="margin: 0 4px 0 0;">+</button><button type="button" onclick="ParameterControl.onSelectClrClick(${PARAM_SELECT_OPTION_COUNT})">-</button></div></div></div><div class="list_cell"><span class="parent_title title sub_title">上級參數<span class="origin_name">(parent)</span>：</span><input class="param_input_parent" type="parent" placeholder="parent parameter name"></div></div></div>`
        )
    }

    static onRootAddClick() {
        const base = document.querySelector(`#root_param`)
        const node = ParameterControl.getMainNode()

        if (base && node) base.append(node)
    }

    static onRootDelClick() {
        document
            .querySelectorAll("#root_param .param.block[data-id]")
            .forEach(el => el.remove())

        PARAM_MAIN_LIST_COUNT = 0
        PARAM_COMBO_OPTION_COUNT = 0
        PARAM_SELECT_OPTION_COUNT = 0
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
              <input class="param_input_select_value" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" type="text" placeholder="option value">
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
            `<div class="command block" data-id="${COMMAND_MAIN_LIST_COUNT}" data-type="command">
        <span class="command_title title" onclick="CommandControl.onMainTitleClick(${COMMAND_MAIN_LIST_COUNT})">指令<span
            class="origin_name">(command)</span>：</span>
        <div class="command_input_list data_input data">
            <div class="list_cell">
                <input class="command_input_name" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="command name">
                <button type="button" class="append_command" onclick="CommandControl.onMainAddClick(${COMMAND_MAIN_LIST_COUNT})">Add</button>
                <button type="button" class="delete_command" onclick="CommandControl.onMainClrClick(${COMMAND_MAIN_LIST_COUNT})">Clr</button>
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
              <input class="param_input_name" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="code name">
              <button type="button" class="append_parameter" onclick="CommandControl.onParamAddClick(${COMMAND_MAIN_PARAM_COUNT})">Add</button>
              <button type="button" class="delete_parameter" onclick="CommandControl.onParamClrClick(${COMMAND_MAIN_PARAM_COUNT})">Clr</button>
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
                <input class="param_input_select_value" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="option value">
                <div>
                  <button type="button" onclick="CommandControl.onSelectAddClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})"
                    style="margin: 0 -5px 0 0;">+</button>
                  <button type="button" onclick="CommandControl.onSelectClrClick(${COMMAND_PARAM_SELECT_OPTION_COUNT})">-</button>
                </div>
              </div>
            </div>
          </div>

          <div class="list_cell" style="height: auto;">
            <div id="id_${COMMAND_MAIN_LIST_COUNT}_command_editor" style="height: 200px; width: 100%;"></div>
          </div>
        </div>
      </div>`
        )
    }

    static getCodeNode() {
        if (isNaN(COMMAND_MAIN_LIST_COUNT)) return

        COMMAND_MAIN_LIST_COUNT++

        return HTMLControl.getNodeFromText(
            `<div class="command block" data-id="${COMMAND_MAIN_LIST_COUNT}" data-type="code">
        <span class="command_title title" onclick="CommandControl.onMainTitleClick(${COMMAND_MAIN_LIST_COUNT})">程式：</span>
        <div  style="width: 80%; flex: auto;">

            <div class="list_cell" style="justify-content: flex-end;">
                <button type="button" class="append_command" onclick="CommandControl.onMainAddCodeClick(${COMMAND_MAIN_LIST_COUNT})">Add</button>
                <button type="button" class="delete_command" onclick="CommandControl.onMainClrCodeClick(${COMMAND_MAIN_LIST_COUNT})">Clr</button>
                <button type="button" class="delete_command" onclick="CommandControl.onMainDelClick(${COMMAND_MAIN_LIST_COUNT})">Del</button>
            </div>

            <div class="command_code">
            <span class="command_code_tip tips">可輸入半型驚嘆號 ! 以查看及調用各類範本</span>
            <div id="id_${COMMAND_MAIN_LIST_COUNT}_command_editor" style="height: 200px; width: 100%;"></div>
            </div>
        </div>
      </div>`)
    }

    static onRootAddClick() {
        const base = document.querySelector(`#root_command`)
        const node = CommandControl.getMainNode()

        if (!base || !node) return

        base.append(node)
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

    static onRootAddCodeClick() {
        const base = document.querySelector(`#root_command`)
        const node = CommandControl.getCodeNode()

        if (!base || !node) return

        base.append(node)
        const id = `id_${COMMAND_MAIN_LIST_COUNT}_command_editor`
        EDITOR_COMMANDS.set(id, monaco.editor.create(
            document.getElementById(id),
            {
                value: "",
                language: "javascript",
                theme: "vs-dark",
                automaticLayout: true,
            },
        ))
    }

    static onRootDelClick() {
        document
            .querySelectorAll("#root_command .command.block[data-id]")
            .forEach(el => el.remove())

        COMMAND_MAIN_LIST_COUNT = 0
        COMMAND_MAIN_PARAM_COUNT = 0
        COMMAND_PARAM_COMBO_OPTION_COUNT = 0
        COMMAND_PARAM_SELECT_OPTION_COUNT = 0

        EDITOR_COMMANDS.clear()
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
        EDITOR_COMMANDS.delete(`id_${id}_command_editor`)
    }

    static onMainClrClick(id) {
        const el = document.querySelector(`#root_command > .command.block[data-id="${id}"] > .command_input_list`)

        el
            .querySelectorAll(
                ".command_parameter_group ~ .command_parameter_group, .param_type_combo > .list_cell:nth-child(n+2), .param_type_select > .list_cell:nth-child(n+2)"
            )
            .forEach(e => e.remove())

        el
            .querySelectorAll("input, select")
            .forEach(e => e.nodeName === "SELECT"
                ? e.value = "string"
                : e.value = ""
            )
    }

    static onMainAddCodeClick(id) {
        const base = document.querySelector(`#root_command > .command.block[data-id="${id}"]`)
        const node = CommandControl.getCodeNode()

        if (!base || !node) return

        HTMLControl.setInsertToNext(base, node)
        EDITOR_COMMANDS.set(`id_${COMMAND_MAIN_LIST_COUNT}_command_editor`, monaco.editor.create(
            document.getElementById(`id_${COMMAND_MAIN_LIST_COUNT}_command_editor`),
            {
                value: "",
                language: "javascript",
                theme: "vs-dark",
                automaticLayout: true,
            },
        ))
    }

    static onMainClrCodeClick(id) {
        EDITOR_COMMANDS.get(`id_${id}_command_editor`)?.setValue("")
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
              <input class="param_input_name" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="code name">
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
                <input class="param_input_select_value" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="option value">
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
              <input class="param_input_select_value" type="text" pattern="^[A-Za-z_]+[A-Za-z0-9_]*" placeholder="option value">
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

    /** @type {boolean} */
    static get getIsTargetMZ() { return EL_TARGET?.checked || false }
    static get getAuthor() { return Fnc.getIfNotEmpty(EL_AUTHOR?.value) }
    static get getURL() { return Fnc.getIfNotEmpty(EL_URL?.value) }
    static get getHelp() { return Fnc.getIfNotEmpty(EL_HELP?.value) }
    static get getDesc() { return Fnc.getIfNotEmpty(EL_DESC?.value) }

    static getMetadata() {
        const map = Fnc.map("")

        const isMZ = map(BasicInfoBuilder.getIsTargetMZ, () => "\n * @target MZ")
        const author = map(BasicInfoBuilder.getAuthor, v => `\n * @author ${v}`)
        const url = map(BasicInfoBuilder.getURL, v => `\n * @url ${v}`)
        const help = map(BasicInfoBuilder.getHelp, v => `\n * @help ${v}`)
        const desc = map(BasicInfoBuilder.getDesc, v => `\n * @plugindesc ${v.replaceAll("\n", "\n * ")}`)

        return Fnc.getIfNotEmpty(isMZ + author + url + help + desc)
    }

    static get getBaseDepend() { return Fnc.getIfNotEmpty(EL_BASE?.value) }
    static getOrderDependPlugins(elList) {
        if (!elList) return false

        const ls = [...elList.querySelectorAll(".list_cell > input")]
            .map(el => el.value)
            .filter(Fnc.getIfNotEmpty)

        return ls.length === 0 ? false : ls
    }

    static getDependency() {
        const map = Fnc.map("")

        const base = map(BasicInfoBuilder.getBaseDepend, v => `\n * @base ${v}`)
        const after = map(BasicInfoBuilder.getOrderDependPlugins(EL_BASE_AFTER_LIST), v => `\n * @orderAfter ${v.join("\n * @orderAfter ")}`)
        const before = map(BasicInfoBuilder.getOrderDependPlugins(EL_BASE_BEFORE_LIST), v => `\n * @orderBefore ${v.join("\n * @orderBefore ")}`)

        return Fnc.getIfNotEmpty(base + after + before)
    }

    static build() {
        return Fnc.getIfNotEmpty(
            [BasicInfoBuilder.getMetadata(), BasicInfoBuilder.getDependency(),]
                .filter(v => v)
                .join("\n * ")
        )
    }
}

class ParameterBuilder {
    static getChildValueIfExist(node) {
        return className =>
            Fnc.getIfNotEmpty(node.getElementsByClassName(className)[0]?.value)
    }

    /** @return {[string, string | false][] | null} */
    static getSelectDetail(el) {
        return [...el.querySelectorAll(".group_list_cell.param_type_select > .list_cell")]
            .flatMap(list => [
                ["option", Fnc.getIfNotEmpty(list.querySelector(".param_input_select_name")?.value)],
                ["value", Fnc.getIfNotEmpty(list.querySelector(".param_input_select_value")?.value)],
            ])
    }

    /** @return {[string, string | false][] | null} */
    static getComboDetail(el) {
        return [...el.querySelectorAll(".group_list_cell.param_type_combo > .list_cell > .param_input_combo_option")]
            .map(el => ["option", Fnc.getIfNotEmpty(el.value)])
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

    /**
     * @param {HTMLElement} node 
     * @returns {string | false}
     */
    static getParamName(node) {
        const el = node.querySelector(".param_input_name")

        return Fnc.getInputIsMatch(el)
            ? Fnc.getIfNotEmpty(el.value)
            : false
    }

    static buildSingleParam(root) {
        const prepareGetValue = ParameterBuilder.getChildValueIfExist(root)

        const param = ParameterBuilder.getParamName(root)
        if (!param) return

        const type = prepareGetValue("param_input_type")
        const details = ParameterBuilder.getDetailByType(root, type)
        const isArrayEl = root.getElementsByClassName("param_input_type_isarray")[0]
        const isArray = isArrayEl ? isArrayEl.hasAttribute("checked") : false

        return "\n * "
            + [
                ["param", param],
                ["parent", prepareGetValue("param_input_parent")],
                ["text", prepareGetValue("param_input_display")],
                ["desc", prepareGetValue("param_input_desc")],
                ["type", ParameterBuilder.getTypeAttr(type, isArray)],
                ["default", prepareGetValue("param_input_default")],
                ["details", details],
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

        return Fnc.getIfNotEmpty(ls)
    }
}



class CommandBuilder {
    static buildBlockParams(block) {
        return [...block.getElementsByClassName("command_parameter_group")]
            .map(ParameterBuilder.buildSingleParam)
            .map(res => res?.replaceAll("@param ", "@arg "))
            .join("")
    }

    static getAllParamsName(block) {
        return [...block.querySelectorAll(".param_input_name")]
            .filter(Fnc.getInputIsMatch)
            .map(e => e.value)
            .join(", ")
    }

    static buildBlockCode(id, name, paramsName, isMZ) {
        const body = EDITOR_COMMANDS.get(`id_${id}_command_editor`)?.getValue().replaceAll("\r\n", "\r\n        ") || ""

        const mz = isMZ
            ? `        PluginManager.registerCommand(FILENAME, "${name}", function (${paramsName.length > 0 ? `{ ${paramsName} }` : ""}){
            ${body}
        })`
            : false

        const mv = `
            if(cmd === "${name}") {${paramsName.length > 0 ? `\n                var [${paramsName}] = args` : ""}
                ${body}
            }`

        return { mz, mv }
    }

    /**
     * @param {HTMLElement} node 
     */
    static getCommandName(node) {
        const el = node.querySelector(".command_input_name")
        return Fnc.getInputIsMatch(el)
            ? Fnc.getIfNotEmpty(el?.value)
            : false
    }

    /**
     * @param {HTMLElement} block 
     * @param {boolean} isMZ 
     * @returns {{note: string, code: false, cmdMZ: string, cmdMV: string }}}
     */
    static buildSingleCommand(block, isMZ) {
        const name = CommandBuilder.getCommandName(block)
        if (!name) return false

        const text = block.querySelector(".command_input_display")?.value || name
        const desc = block.querySelector(".command_input_desc")?.value || ""

        const params = CommandBuilder.buildBlockParams(block)

        const paramsName = CommandBuilder.getAllParamsName(block) // params.map(p => p.name).join(", ")
        const { mv, mz } = CommandBuilder.buildBlockCode(block.dataset.id, name, paramsName, isMZ)

        return {
            note: "\n * "
                + [
                    ["command", name],
                    ["text", text],
                    ["desc", desc],
                    ["params", params],
                ].map(([n, v]) => {
                    if (n === "params") return v
                    if (n === "desc" && v.length === 0) return ""

                    return `\n * @${n} ${v}`
                }).join(""),
            code: false,
            cmdMV: mv,
            cmdMZ: mz,
        }
    }

    /**
     * @param {HTMLElement} block 
     * @returns {{note: string, code: string}}
     */
    static buildSingleCode(block) {
        const id = block.dataset.id
        if (!id || id === "") return false

        const code = EDITOR_COMMANDS.get(`id_${id}_command_editor`)?.getValue().replaceAll("\n", "\n    ") || ""
        if (code === "") return false

        return {
            note: "",
            code: "    " + code,
        }
    }

    /**
     * @type {(isMZ: boolean) => (block: HTMLElement) => { note: string; code: string | false; cmdMZ: ?string; cmdMV: ?string } | false}
     */
    static buildSingleBlock(isMZ) {
        return block => {
            switch (block.dataset.type) {
                case "command": return CommandBuilder.buildSingleCommand(block, isMZ)
                case "code": return CommandBuilder.buildSingleCode(block)

                default: return false
            }
        }
    }

    /** @returns {[string, string, string, string,]} */
    static build() {
        const isMZ = BasicInfoBuilder.getIsTargetMZ

        let list = [...document.querySelectorAll("#root_command > div.command.block[data-type]")]
            .map(CommandBuilder.buildSingleBlock(isMZ))
            .reduce((all, cur) => {
                if (!cur) return all

                all[0] += cur.note
                if (cur.code) all[1] += cur.code + "\n\n"

                if (cur.cmdMZ) all[2] += cur.cmdMZ + "\n\n"
                if (!cur.cmdMV) return all

                all[3] += all[3] === ""
                    ? `        const pluginCommand = Game_Interpreter.prototype.pluginCommand
        Game_Interpreter.prototype.pluginCommand = function (cmd, args) {
            ${cur.cmdMV}`
                    : "\n\n        " + cur.cmdMV

                return all
            }, ["", "", "", ""])

        if (list[3] !== "") list[3] += "\n\n            return pluginCommand.apply(this, arguments)\n        }"

        return list
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
        const basicNote = BasicInfoBuilder.build()
        const parameterNote = ParameterBuilder.build()
        const [commandsNote, commandsCode, commandMZ, commandMV] = CommandBuilder.build()

        const isHadCode = commandsCode.length > 0
        const isHadParam = parameterNote.length > 0
        const isHadMZCommand = commandMZ.length > 0
        const isHadMVCommand = commandMV.length > 0

        const code =
            (isHadMZCommand || isHadParam ? `\n    const FILENAME = document.currentScript.src.split("/").pop().replace(".js", "")` : "")
            + (isHadParam ? "\n    const PARAMETERS = PluginManager.parameters(FILENAME)" : "")
            + (isHadCode ? `\n\n${commandsCode}` : "")
            + (isHadMVCommand ? `\n\n    if (Utils.RPGMAKER_NAME === "MV") {\n${commandMV}\n    }` : "")
            + (isHadMZCommand ? `\n\n    if (Utils.RPGMAKER_NAME === "MZ") {\n${commandMZ}    }` : "")

        const note = [
            basicNote,
            parameterNote,
            commandsNote,
        ]
            .filter(Fnc.getIfNotEmpty)
            .join("")

        return (note === "" ? "" : "/**:" + note + "\n */\n")
            + (code === "" ? "" : "(()=>{\n" + code + "\n})()\n")
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
})
