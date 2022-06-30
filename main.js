const harvester = require("harvester");
const upgrader = require("upgrader");
const builder = require("builder");
const architector = require("architector");

var rooms, creeps, sources, structures, spawns, spawn, harvesters, upgraders, builders;

module.exports.loop = function() {

    // Get game objects
    spawns = Object.values(Game.spawns);
    creeps = Object.values(Game.creeps);
    structures = Object.values(Game.structures);

    // Filter objects by current room
    spawn = spawns[0];
    sources = spawn.room.find(FIND_SOURCES);
    structures = structures.filter(struct => struct.room.name == spawn.room.name);
    sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    spawns = spawns.filter(i => i.room.name == spawn.room.name);
    creeps = creeps.filter(creep => creep.room.name == spawn.room.name);

    // Launch architector (construction manager)
    architector(spawn.room, sources, structures, sites);

    // Launch creep managers
    harvesters = creeps.filter(creep => creep.memory["role"] == "harvester");
    harvesters.forEach(creep => harvester(creep, sources, spawns));
    upgraders = creeps.filter(creep => creep.memory["role"] == "upgrader");
    upgraders.forEach(creep => upgrader(creep, spawns));
    builders = creeps.filter(creep => creep.memory["role"] == "builder");
    builders.forEach(creep => builder(creep, spawns, structures, sites));

    // Renew creeps if needed
    let renew = creeps.filter(creep => creep.ticksToLive < 300);
    renew = spawn.pos.findInRange(renew, 1);
    if(renew.length > 0){
        spawn.renewCreep(spawn.pos.findClosestByRange(renew));
    }

    // Spawn new creeps if needed
    if(harvesters.length < (spawn.room.find(FIND_SOURCES).length * 2)) {spawn.spawnCreep([MOVE,CARRY,WORK], "Harvester " + Math.round(Math.random() * 100), {memory: {role: "harvester"}})}
    else if(upgraders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Upgrader " + Math.round(Math.random() * 100), {memory: {role: "upgrader"}})}
    else if(builders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Builder " + Math.round(Math.random() * 100), {memory: {role: "builder"}})}

    // Clear Memory.creeps
    let cleared = 0;
    Object.keys(Memory.creeps).forEach(name => {if(!Game.creeps[name]) {delete Memory.creeps[name]; cleared++}});

    let date = new Date();
    if(Memory.report == null) {
        Memory.report = {cleared: cleared, day: date.getDate()};
    } else if (Memory.report.cleared == null) {
        Memory.report.cleared = cleared;
    } else if (Memory.report.day == null) {
        Memory.report.day = date.getDate();
    } else {
        Memory.report.cleared += cleared;
        if(Memory.report.day != date.getDate()) {
            let report =
                "Ежедневный отчёт!\n\n" +
                `Крипы удалённые из памяти: ${Memory.report.cleared}\n\n` +
                `Дата: ${date.toLocaleString("ru", {hour12: false})}`
            Game.notify(report)
        }
    }
}
