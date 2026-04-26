// custom.ts
// Custom MakeCode extension file

class CraftPattern {
    patternText: String
    public constructor(patternText: String) {
        this.patternText = patternText;
    }
}

//% weight=200 color="#0096FF" icon="\uf126" block="Hour of AI"
namespace haiInputs {

    /**
     * This function takes
     */
    //% block="craft with %n"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function craftWith(n: number): void {
        player.execute(`scoreboard players add .outputsum global ${n}`);
    }

}

//% weight=200 color="#0096FF" icon="\uf126" block="Hour of AI Python"
namespace ai {

    const items: { [key: string]: string } = {
        'oak_planks': '1',
        'cobblestone': '3',
        'oak_log': '1',
        'birch_log': '2',
        'acacia_log': '3',
        'coal_ore': '4',
        'iron_ore': '5',
        'wool': '6',
        'grass': '99',
        'lava': '99',
        'soul_sand': '99',
        'coal': '21',
        'iron_ingot': '22',
        'stick': '2',
        'wood_pickaxe': '1',
        'wood_axe': '2',
        'wood_shovel': '3',
        'wood': '1',
        'axe': '2',
        'pickaxe': '1',
        'shovel': '3',

    }

    const crafting_recipes: { [key: string]: string } = {
        'BBBB': '4', // crafting bench
        'OOOOBOOBO': '5', // stick or torch
        'BBBOBOOBO': '6', // pickaxe
        'BBOBBOOBO': '7', // axe
        'OBOOBOOBO': '8', // shovel
        'BBOBBOBBO': '9', // door
        'BBBBOBBBB': '10', // furnace
        'OOOBBBBBB': '11', // bed
        'OOOOBOOOB': '12', // shears
        'OOOB': '13' // plank
    }

    /**
     * This function makes an API request.
     */
    export function make_api_request(api_url: string, api_key: string, api_endpoint: string, data: { [key: string]: string }): void {
        if (api_url !== 'minecraft://agent.ai/') {
            player.execute(`/title @p title \u00a76404 Not Found:`);
            player.execute(`/title @p subtitle \u00a76The requested URL ${api_url} was not found on this server.`);

        } else if (api_endpoint !== "classify" && api_endpoint !== "crafting" && api_endpoint !== "upgrade") {
            player.execute(`/title @p title \u00a76Invalid endpoint:`);
            player.execute(`/title @p subtitle \u00a76'${api_endpoint}'. Available endpoints are 'classify', 'crafting' or 'upgrade'.`);

        } else {
            if (api_endpoint == "classify") {
                const keys = Object.keys(data);
                for (const key of keys) {
                    const value = data[key].trim();
                    if (items[value] === undefined) {
                        player.execute(`/title @p title \u00a76Invalid Item Name:`);
                        player.execute(`/title @p subtitle \u00a76'${data[key]}' is not a valid item for classification.`);
                        return;
                    }
                    player.execute(`scoreboard players add .outputsum global ${items[value]}`);
                }

            } else if (api_endpoint == "crafting") {
                const keys = Object.keys(data);
                for (const key of keys) {
                    let value = data[key].trim();
                    value = value.split("\n").join("");
                    value = value.split(" ").join("");
                    value = value.split("\t").join("");
                    if (crafting_recipes[value] === undefined) {
                        player.execute(`/title @p title \u00a76Invalid Crafting Recipe:`);
                        player.execute(`/title @p subtitle \u00a76The passed pattern is not a valid crafting recipe.`);
                        return;
                    }
                    player.execute(`scoreboard players add .outputsum global ${crafting_recipes[value]}`);
                }
            } else if (api_endpoint == "upgrade") {
                const keys = Object.keys(data);
                for (const key of keys) {
                    const value = data[key].trim();
                    if (items[key] === undefined) {
                        player.execute(`/title @p title \u00a76Invalid Tool Type:`);
                        player.execute(`/title @p subtitle \u00a76'${key}' is not a valid tool.`);
                        return;
                    }
                    if (items[value] === undefined || items[value] !== '3') {
                        player.execute(`/title @p title \u00a76Invalid Upgrade Type:`);
                        player.execute(`/title @p subtitle \u00a76'${value}' is not a valid upgrade.`);
                        return;
                    }
                    player.execute(`scoreboard players add .outputsum global ${items[key]}`);
                    player.execute(`scoreboard players add .outputsum global ${items[value]}`);
                }
            }
        }
    }
}



//% weight=200 color="#008106" icon="\uf126" block="Hour of AI"
namespace hai {

    /**
     * Training Module
     */
    //% block="training module"
    //% color="#0096FF"
    //% blockId=on_training_start 
    export function trainingStart(handler: () => void) {
        handler();
    }

    /**
     * Select block to craft with.
     */
    //% block="craft with %n"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function craftWith(n: number): void {
        player.execute(`scoreboard players add .outputsum global ${n}`);
    }

    /**
     * Train agent crafting.
     */
    //% block="crafting grid %pattern"
    //% blockid="craft"
    //% color="#0096FF"
    export function crafting(pattern: CraftPattern): void {
        const normalizedPattern = pattern.patternText
            .split(' ').join('')
            .trim();

        if (
            normalizedPattern === `##\n##` ||
            normalizedPattern === `##.\n##.\n...` ||
            normalizedPattern === `.##\n.##\n...` ||
            normalizedPattern === `...\n##.\n##.` ||
            normalizedPattern === `...\n.##\n.##`
        ) {
            player.execute(`scoreboard players add .outputsum global 4`);
        } else if (
            normalizedPattern === `#.\n#.` || normalizedPattern === `.#\n.#` ||
            normalizedPattern === `#..\n#..\n...` || normalizedPattern === `.#.\n.#.\n...` ||
            normalizedPattern === `..#\n..#\n...` || normalizedPattern === `...\n#..\n#..` ||
            normalizedPattern === `...\n.#.\n.#.` || normalizedPattern === `...\n..#\n..#`
        ) {
            player.execute(`scoreboard players add .outputsum global 5`);
        } else if (normalizedPattern === `###\n.#.\n.#.`) {
            player.execute(`scoreboard players add .outputsum global 6`);
        } else if (normalizedPattern === `##.\n##.\n.#.` || normalizedPattern === `.##\n.##\n.#.`) {
            player.execute(`scoreboard players add .outputsum global 7`);
        } else if (
            normalizedPattern === `.#.\n.#.\n.#.` || normalizedPattern === `#..\n#..\n#..` ||
            normalizedPattern === `..#\n..#\n..#`
        ) {
            player.execute(`scoreboard players add .outputsum global 8`);
        } else if (
            normalizedPattern === `##.\n##.\n##.` || normalizedPattern === `.##\n.##\n.##`
        ) {
            player.execute(`scoreboard players add .outputsum global 9`);
        } else if (
            normalizedPattern === `###\n#.#\n###`
        ) {
            player.execute(`scoreboard players add .outputsum global 10`);
        } else if (
            normalizedPattern === `...\n###\n###` || normalizedPattern === `###\n###\n...`
        ) {
            player.execute(`scoreboard players add .outputsum global 11`);
        } else if (
            normalizedPattern === `#.\n.#` ||
            normalizedPattern === `.#\n#.` ||
            normalizedPattern === `#..\n.#.\n...` ||
            normalizedPattern === `.#.\n..#\n...` ||
            normalizedPattern === `...\n#..\n.#.` ||
            normalizedPattern === `...\n.#.\n..#` ||
            normalizedPattern === `.#.\n#..\n...` ||
            normalizedPattern === `..#\n.#.\n...` ||
            normalizedPattern === `...\n.#.\n#..` ||
            normalizedPattern === `...\n..#\n.#.`
        ) {
            player.execute(`scoreboard players add .outputsum global 12`);
        } else if (
            normalizedPattern === `#..\n...\n...` ||
            normalizedPattern === `.#.\n...\n...` ||
            normalizedPattern === `..#\n...\n...` ||
            normalizedPattern === `...\n#..\n...` ||
            normalizedPattern === `...\n.#.\n...` ||
            normalizedPattern === `...\n..#\n...` ||
            normalizedPattern === `...\n...\n#..` ||
            normalizedPattern === `...\n...\n.#.` ||
            normalizedPattern === `...\n...\n..#` ||
            normalizedPattern === `#.\n..` ||
            normalizedPattern === `.#\n..` ||
            normalizedPattern === `..\n.#` ||
            normalizedPattern === `..\n#.`
        ) {
            player.execute(`scoreboard players add .outputsum global 13`);
        } else {
            player.execute(`scoreboard players add .outputsum global 0`);
        }
    }

    /**
     * Classify a wood log.
     */
    //% block="classify %n as wood"
    //% n.shadow="ghostBlock"
    //% color="#0096FF"
    export function classifyWood(n: number): void {
        player.execute(`scoreboard players add .outputsum global ${n}`);
    }

    /**
    * Upgrade tools material.
    */
    //% block="upgrade %t to %m"
    //% t.shadow="ghostItem"
    //% m.shadow="ghostBlock"
    //% color="#0096FF"   
    export function upgradeTool(t: number, m: number): void {
        let sub_sum = m + t;
        player.execute(`scoreboard players add .outputsum global ${sub_sum}`);
    }

    /**
    * House Materials
    */
    //% block="building material %b"
    //% b.shadow="ghostBlock"
    //% color="#0096FF"   
    export function buildingMaterials(b: number): void {
        player.execute(`scoreboard players add .outputsum global ${b}`);
    }

    /**
    * Classify as ore
    */
    //% block="classify %b as ore"
    //% b.shadow="ghostBlock"
    //% color="#0096FF"   
    export function classifyOre(b: number): void {
        player.execute(`scoreboard players add .outputsum global ${b}`);
    }

    //% block="`custom.PlanksOak` wood"
    export function wood(): number {
        return 1;
    }

    //% block="`custom.Cobblestone` cobblestone"
    export function cobblestone(): number {
        return 3;
    }

    //% block="`custom.logOak` oak log"
    //% blockId=oaklog
    export function logOak(): number {
        return 1;
    }

    //% block="`custom.logBirch` birch log"
    //% blockId=birchlog
    export function logBirch(): number {
        return 2;
    }

    //% block="`custom.logAcacia` acacia log"
    //% blockId=acacialog
    export function logAcacia(): number {
        return 3;
    }

    //% block="`custom.CoalOre` coal ore"
    //% blockId=coalore
    export function coalOre(): number {
        return 4;
    }

    //% block="`custom.IronOre` iron ore"
    //% blockId=ironore
    export function ironOre(): number {
        return 5;
    }

    //% block="`custom.Wool` wool"
    //% blockId=wool
    export function wool(): number {
        return 6;
    }

    //% block="`custom.Grass` grass"
    //% blockId=grass
    export function grass(): number {
        return 99;
    }

    //% block="`custom.Lava` lava"
    //% blockId=lava
    export function lava(): number {
        return 99;
    }

    //% block="`custom.SoulSand` soul sand"
    //% blockId=soul_sand
    export function soulSand(): number {
        return 99;
    }

    //% block="`custom.Ghost`"
    //% color="#8E8E8E"
    //% blockId=ghostBlock
    export function ghostBlock(): number {
        return 99;
    }

    //% block="`custom.Coal` coal"
    //% blockId=coal
    export function coal(): number {
        return 21;
    }

    //% block="`custom.IronIngot` iron ingot"
    //% blockId=ironIngot
    export function ironIngot(): number {
        return 22;
    }

    //% block="`custom.Stick` stick"
    export function stick(): number {
        return 2;
    }

    //% block="`custom.WoodenPickaxe` pickaxe"
    //% blockId=pickaxe
    export function pickaxe(): number {
        return 1;
    }

    //% block="`custom.WoodenAxe` axe"
    //% blockId=axe
    export function axe(): number {
        return 2;
    }

    //% block="`custom.WoodenShovel` shovel"
    //% blockId=shovel
    export function shovel(): number {
        return 3;
    }

    //% block="`custom.GhostItem`"
    //% color="#8E8E8E"
    //% blockId=ghostItem
    export function ghostItem(): number {
        return 99;
    }

    //% blockId=pocketcraftPattern block="2x2"
    //% imageLiteralColumns=2
    //% imageLiteralRows=2
    //% gridLiteral=1
    export function pocketcraftingPattern(pattern: string) {
        return new CraftPattern(pattern);
    }

    //% blockId=craftPattern block="3x3"
    //% imageLiteralColumns=3
    //% imageLiteralRows=3
    //% gridLiteral=1
    export function craftingPattern(pattern: string) {
        return new CraftPattern(pattern);
    }

}
