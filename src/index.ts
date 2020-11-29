import url from 'url'

const toZenkaku = (s) =>
  s.replace(/[+A-Za-z0-9]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0xfee0)
  )

const toHankaku = (s) =>
  s.replace(/[＋ａ-ｚ０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  )

const removeCRLF = (s: string) => s.replace(/[\r\n]/g, ' ').replace('↓', '')

const main = async () => {
  setTimeout(() => {
    const currentPageURL = document.URL
    if (url.parse(currentPageURL).host !== 'character-sheets.appspot.com') {
      return
    }

    // 名前
    const base_name = document.getElementById('base.name')
    const name = (base_name as HTMLInputElement).value

    // 剥離値
    const base_exfoliation_value = document.getElementById(
      'base.exfoliation.value'
    )
    const exfoliation = (base_exfoliation_value as HTMLInputElement).value

    // 逸脱能力
    type Special = {
      name: string
      timing: string
      target: string
      range: string
      cost: string
      effect: string
    }
    const special_table = document.getElementById('specials')
    const special_rows = special_table.querySelectorAll('tbody tr')

    const get_special = (e): Special => {
      const input = e.getElementsByTagName('input')
      const name = input[0].value
      const timing = input[1].value
      const target = input[2].value
      const range = input[3].value
      const cost = input[4].value
      const effect = input[5].value
      return { name, timing, target, range, cost, effect }
    }
    const specials = [...special_rows].map(get_special)

    // 能力値
    const abl_table = document.getElementById('div.baseCalc')
    const abl_rows = abl_table.querySelectorAll('table tbody tr')

    const get_abilities = (e) => {
      const input = e.getElementsByTagName('input')
      const get_modified_value = (s) => s.replace(/[0-9]+\(([0-9]+)\)/g, '$1')
      const body = get_modified_value(input[0].value)
      const sense = get_modified_value(input[1].value)
      const will = get_modified_value(input[2].value)
      const sympathy = get_modified_value(input[3].value)
      const society = get_modified_value(input[4].value)
      const sewing = get_modified_value(input[5].value)
      return { body, sense, will, sympathy, society, sewing }
    }

    const total_abilities = get_abilities(abl_rows[6])
    const bonus_abilities = get_abilities(abl_rows[7])

    // 配役
    const lifepath_div = document.getElementById('lifepath')
    const lifepath_rows = lifepath_div.getElementsByTagName('tr')
    const get_lifepath = (e) => {
      const input = e.getElementsByTagName('input')
      const name = input[0].value
      const effect = input[1].value
      return { name, effect }
    }
    const birth = get_lifepath(lifepath_rows[1])
    const environment = get_lifepath(lifepath_rows[2])

    // 財産ポイント
    const fortunepoint = (document.getElementById(
      'fortunepoint'
    ) as HTMLInputElement).value
    const add_fortunepoint = (document.getElementById(
      'addfortunepoint'
    ) as HTMLInputElement).value

    // 戦闘能力値
    const other = document.getElementById('outfits.other')
    const tfoot = other.getElementsByTagName('tfoot')[0]
    const tfoot_rows = tfoot.getElementsByTagName('tr')

    const get_battle_abilities = (
      right: HTMLTableRowElement,
      left: HTMLTableRowElement,
      movility: HTMLTableRowElement
    ) => {
      const right_input = right.getElementsByTagName('input')
      const right_weapon_name = right_input[0].value
      const hit = right_input[1].value
      const dodge = right_input[2].value
      const magic = right_input[3].value
      const countermagic = right_input[4].value
      const action = right_input[5].value
      const hp = right_input[6].value
      const mp = right_input[7].value
      const right_weapon_attack = right_input[8].value
      const right_weapon_range = right_input[9].value
      const right_weapon_strong = right_input[10].value

      const left_input = left.getElementsByTagName('input')
      const left_weapon_name = left_input[0].value
      const left_weapon_attack = left_input[1].value
      const left_weapon_range = left_input[2].value
      const left_weapon_strong = left_input[3].value

      const movility_input = movility.getElementsByTagName('input')
      const base_battlespeed = movility_input[0].value
      const mod_battlespeed = movility_input[1].value
      // const total_battlespeed = movility_input[2].value
      const fullspeed = movility_input[3].value
      const vehicle_fullspeed = movility_input[4].value

      return {
        right: {
          name: right_weapon_name,
          attack: right_weapon_attack,
          range: right_weapon_range,
          strong: right_weapon_strong,
        },
        left: {
          name: left_weapon_name,
          attack: left_weapon_attack,
          range: left_weapon_range,
          strong: left_weapon_strong,
        },
        abilities: {
          hit,
          dodge,
          magic,
          countermagic,
        },
        initiative: action,
        hp,
        mp,
        movilities: {
          battlespeed: mod_battlespeed ? mod_battlespeed : base_battlespeed,
          fullspeed,
          vehicle_fullspeed,
        },
      }
    }
    const battle = get_battle_abilities(
      tfoot_rows[0],
      tfoot_rows[1],
      tfoot_rows[2]
    )

    // 防御修正
    const armour_table = document.getElementById('armours')
    const armour_tfoot = armour_table.getElementsByTagName('tfoot')[0]
    const get_armours = (e) => {
      const input = e.getElementsByTagName('input')
      const slash = input[0].value
      const pierce = input[1].value
      const crash = input[2].value
      const spell = input[3].value
      const sew = input[4].value
      return { slash, pierce, crash, spell, sew }
    }
    const armours = get_armours(armour_tfoot)

    // 特技
    type Skill = {
      name: string
      classes: string
      level: string
      types: string
      timing: string
      judge: string
      difficulty: string
      target: string
      range: string
      cost: string
      effect: string
    }
    const skills_table = document.getElementById('skills')
    const skills_tbody = skills_table.getElementsByTagName('tbody')[0]
    const skills_rows = skills_tbody.getElementsByTagName('tr')
    const get_skill = (e: HTMLTableRowElement): Skill => {
      const textarea = e.getElementsByTagName('textarea')
      const name = textarea[0].textContent
      const classes = textarea[1].textContent
      const level = textarea[2].textContent
      const types = textarea[3].textContent
      const timing = textarea[4].textContent
      const judge = textarea[5].textContent
      const difficulty = textarea[6].textContent
      const target = textarea[7].textContent
      const range = textarea[8].textContent
      const cost = textarea[9].textContent
      const effect = textarea[10].textContent
      return {
        name,
        classes,
        level,
        types,
        timing,
        judge,
        difficulty,
        target,
        range,
        cost,
        effect,
      }
    }
    const skills = [...skills_rows].map(get_skill)

    const header_text = `${name}`

    const abilities_text = `能力値
肉体${toZenkaku(total_abilities.body)}　知覚${toZenkaku(
      total_abilities.sense
    )}　意志${toZenkaku(total_abilities.will)}
感応${toZenkaku(total_abilities.sympathy)}　社会${toZenkaku(
      total_abilities.society
    )}　縫製${toZenkaku(total_abilities.sewing)}`

    const battle_text = `戦闘値
命中値${toZenkaku(battle.abilities.hit)}　回避値${toZenkaku(
      battle.abilities.dodge
    )}　術操値${toZenkaku(battle.abilities.magic)}　抵抗値${toZenkaku(
      battle.abilities.countermagic
    )}`

    const right_attack_text = `攻撃
${battle.right.name}／${toZenkaku(battle.right.attack)}／${battle.right.range}`

    const left_attack_text = `${battle.left.name}／${battle.left.attack}／${battle.left.range}`
    const attack_text = battle.left.name
      ? `${right_attack_text}
${left_attack_text}`
      : `${right_attack_text}`

    const armours_text = `防御修正
〈斬〉${toZenkaku(armours.slash)}　〈刺〉${toZenkaku(
      armours.pierce
    )}　〈殴〉${toZenkaku(armours.crash)}　〈術〉${toZenkaku(
      armours.spell
    )}　〈縫〉${toZenkaku(armours.sew)}`

    console.log(`${header_text}
${abilities_text}

${battle_text}

${attack_text}

${armours_text}
    `)

    const birth_text = `　　　　　　　　　　《出自》
${birth.name}／${birth.effect}
${environment.name}／${environment.effect}`
    console.log(birth_text)

    const skills_text_header = '　　　　　　　　　　《特技》'
    const skill_to_text = (skill: Skill) => {
      const timing_to_short = (s) => {
        const timing_map = {
          メジャーアクション: 'メジャー',
          マイナーアクション: 'マイナー',
          オートアクション: 'オート',
          セットアッププロセス: 'セットアップ',
          イニシアチブプロセス: 'イニシアチブ',
          クリンナッププロセス: 'クリンナップ',
        }
        return s in timing_map ? timing_map[s] : s
      }
      if (skill.timing === '常時') {
        return `${skill.name}/${timing_to_short(skill.timing)}/${removeCRLF(
          toHankaku(skill.effect)
        )}`
      }
      const classess = ['出自', '境遇', 'アクセサリ', 'その他']
      if (classess.includes(skill.classes)) {
        return `${skill.name}/${removeCRLF(toHankaku(skill.effect))}`
      }
      return `${skill.name}/${timing_to_short(skill.timing)}/${toHankaku(
        skill.target
      )}/${skill.range}/${toHankaku(skill.cost)}/${removeCRLF(
        toHankaku(skill.effect)
      )}`
    }
    const skills_text = [skills_text_header, ...skills.map(skill_to_text)].join(
      '\n'
    )
    console.log(skills_text)

    const specials_text_header = '　　　　　　　　　　《逸脱能力》'
    const special_to_text = (special: Special) => {
      return `${special.name}/${special.timing}/${special.target}/${special.range}/${special.cost}/${special.effect}`
    }
    const specials_text = [
      specials_text_header,
      ...specials.map(special_to_text),
    ].join('\n')
    console.log(specials_text)
  }, 1000)
}

;(async () => main())()
