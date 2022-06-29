const harvester = require("harvester");
const upgrader = require("upgrader");
const builder = require("builder");
const architector = require("architector");

var rooms, creeps, sources, structures, spawns, spawn, harvesters, upgraders, builders;

module.exports.loop = function() {
    //creeps = Game.creeps;
    spawns = Object.values(Game.spawns);
    creeps = Object.values(Game.creeps);
    structures = Object.values(Game.structures);

    spawn = spawns[0];
    sources = spawn.room.find(FIND_SOURCES);
    structures = structures.filter(struct => struct.room.name == spawn.room.name);
    sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    spawns = spawns.filter(i => i.room.name == spawn.room.name);
    creeps = creeps.filter(creep => creep.room.name == spawn.room.name);

    architector(spawn.room, sources, structures, sites);

    harvesters = creeps.filter(creep => creep.memory["role"] == "harvester");
    harvesters.forEach(creep => harvester(creep, sources, spawns));
    upgraders = creeps.filter(creep => creep.memory["role"] == "upgrader");
    upgraders.forEach(creep => upgrader(creep, spawns));
    builders = creeps.filter(creep => creep.memory["role"] == "builder");
    builders.forEach(creep => builder(creep, spawns, structures, sites));

    let renew = creeps.filter(creep => creep.ticksToLive < 200);
    renew = spawn.pos.findInRange(renew, 1);
    if(renew.length > 0){
        spawn.renewCreep(spawn.pos.findClosestByRange(renew));
    }

    if(harvesters.length < (spawn.room.find(FIND_SOURCES).length * 2)) {spawn.spawnCreep([MOVE,CARRY,WORK], "Harvester " + Math.round(Math.random() * 100), {memory: {role: "harvester"}})}
    else if(upgraders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Upgrader " + Math.round(Math.random() * 100), {memory: {role: "upgrader"}})}
    else if(builders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Builder " + Math.round(Math.random() * 100), {memory: {role: "builder"}})}
}
