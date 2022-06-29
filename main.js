const harvester = require("harvester");
const upgrader = require("upgrader");
const builder = require("builder");
const architector = require("architector");

var rooms, creeps, spawns, spawn, harvesters, upgraders, builders;

module.exports.loop = function() {
    //creeps = Game.creeps;
    spawns = Game.spawns;

    spawn = spawns["Spawn1"];
    architector(spawn.room);

    creeps = spawn.room.find(FIND_MY_CREEPS);
    harvesters = creeps.filter(creep => creep.memory["role"] == "harvester");
    harvesters.forEach(creep => harvester(creep));
    upgraders = creeps.filter(creep => creep.memory["role"] == "upgrader");
    upgraders.forEach(creep => upgrader(creep));
    builders = creeps.filter(creep => creep.memory["role"] == "builder");
    builders.forEach(creep => builder(creep));

    let renew = creeps.filter(creep => creep.ticksToLive < 200);
    renew = spawn.pos.findInRange(renew, 1);
    if(renew.length > 0){
        spawn.renewCreep(spawn.pos.findClosestByRange(renew));
    }

    if(harvesters.length < (spawn.room.find(FIND_SOURCES).length * 2)) {spawn.spawnCreep([MOVE,CARRY,WORK], "Harvester " + Math.round(Math.random() * 100), {memory: {role: "harvester"}})}
    else if(upgraders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Upgrader " + Math.round(Math.random() * 100), {memory: {role: "upgrader"}})}
    else if(builders.length < 1) {spawn.spawnCreep([MOVE,CARRY,WORK], "Builder " + Math.round(Math.random() * 100), {memory: {role: "builder"}})}
}
